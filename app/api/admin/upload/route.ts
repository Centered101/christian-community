import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { processImage } from "@/lib/image/process";
import { fetchRemoteImage } from "@/lib/image/fetch-remote";

export const runtime = "nodejs"; // sharp needs the Node.js runtime, not Edge

const BUCKET = "uploads";
const MAX_RAW_UPLOAD_BYTES = 20 * 1024 * 1024;

// รายชื่อโฟลเดอร์ที่อนุญาตให้อัปโหลด/ลบ — กันไม่ให้ client ส่ง folder แปลกๆ
// (path traversal, โฟลเดอร์นอกขอบเขตที่ตั้งใจไว้) มาปะปนกับข้อมูลจริงใน bucket
const ALLOWED_FOLDERS = new Set([
  "avatars",
  "activities",
  "home-highlights",
  "resources",
  "videos",
  "scripture-links",
  "seo",
  "site",
]);

/** ตรวจว่า path ที่ถอดออกมาจาก URL หน้าตาเป็น "<folder ที่รู้จัก>/<ชื่อไฟล์>" จริง ไม่มี path traversal */
function isSafeStoragePath(path: string): boolean {
  if (path.includes("..") || path.startsWith("/") || path.includes("\\")) return false;
  const [folder, ...rest] = path.split("/");
  return ALLOWED_FOLDERS.has(folder) && rest.length === 1 && rest[0].length > 0;
}

export async function POST(req: NextRequest) {
  if (!(await isAdminRequest())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const contentType = req.headers.get("content-type") || "";

    // รูปที่เพิ่มผ่านการวาง URL — ต้องผ่าน image pipeline เสมอ
    if (contentType.includes("application/json")) {
      const body = await req.json();
      const folder = typeof body.folder === "string" ? body.folder : "";
      const imageUrl = typeof body.url === "string" ? body.url : "";
      if (!folder || !imageUrl) return NextResponse.json({ error: "Missing url or folder" }, { status: 400 });
      if (!ALLOWED_FOLDERS.has(folder)) return NextResponse.json({ error: "Unknown folder" }, { status: 400 });

      const raw = await fetchRemoteImage(imageUrl);
      const processed = await processImage(raw);
      return await storeProcessedImage(folder, processed);
    }

    const form = await req.formData();
    const file = form.get("file");
    const folder = form.get("folder");
    const mode = form.get("mode");
    if (!(file instanceof File) || typeof folder !== "string" || !folder) {
      return NextResponse.json({ error: "Missing file or folder" }, { status: 400 });
    }
    if (!ALLOWED_FOLDERS.has(folder)) {
      return NextResponse.json({ error: "Unknown folder" }, { status: 400 });
    }
    if (file.size > MAX_RAW_UPLOAD_BYTES) {
      return NextResponse.json({ error: "ไฟล์มีขนาดใหญ่เกินไป" }, { status: 400 });
    }

    // ไฟล์ที่ไม่ใช่รูป (วิดีโอ, PDF, ไฟล์ทั่วไป) จะถูกเก็บตามที่เป็น —
    // image pipeline จะทำงานเฉพาะตอนฟิลด์นั้นต้องเก็บรูปภาพเท่านั้น
    if (mode !== "image") {
      const sb = getSupabaseAdmin();
      if (!sb) return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
      const ext = file.name.split(".").pop();
      const path = `${folder}/${crypto.randomUUID()}${ext ? `.${ext}` : ""}`;
      const buffer = Buffer.from(await file.arrayBuffer());
      const { error } = await sb.storage.from(BUCKET).upload(path, buffer, {
        contentType: file.type || undefined,
        upsert: false,
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      const { data } = sb.storage.from(BUCKET).getPublicUrl(path);
      return NextResponse.json({ url: data.publicUrl, path });
    }

    const raw = Buffer.from(await file.arrayBuffer());
    const processed = await processImage(raw);
    return await storeProcessedImage(folder, processed);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "อัปโหลดไม่สำเร็จ";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

async function storeProcessedImage(
  folder: string,
  processed: { buffer: Buffer; width: number; height: number; format: string; size: number }
) {
  const sb = getSupabaseAdmin();
  if (!sb) return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });

  const path = `${folder}/${crypto.randomUUID()}.${processed.format}`;
  const { error } = await sb.storage.from(BUCKET).upload(path, processed.buffer, {
    contentType: `image/${processed.format}`,
    upsert: false,
  });
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  const { data } = sb.storage.from(BUCKET).getPublicUrl(path);
  return NextResponse.json({
    url: data.publicUrl,
    path,
    width: processed.width,
    height: processed.height,
    format: processed.format,
    size: processed.size,
  });
}

export async function DELETE(req: NextRequest) {
  if (!(await isAdminRequest())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { url } = await req.json();
  if (typeof url !== "string" || !url) return NextResponse.json({ ok: true });

  const marker = `/storage/v1/object/public/${BUCKET}/`;
  const idx = url.indexOf(marker);
  if (idx === -1) return NextResponse.json({ ok: true }); // external URL, nothing to clean up

  const path = decodeURIComponent(url.slice(idx + marker.length));
  if (!isSafeStoragePath(path)) {
    // path หน้าตาไม่ตรงกับที่ระบบสร้างเอง (เช่นมี path traversal หรือโฟลเดอร์แปลกปลอม) — เมินเฉยไว้ก่อน ไม่ลบอะไรทั้งนั้น
    return NextResponse.json({ ok: true });
  }

  const sb = getSupabaseAdmin();
  if (!sb) return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });

  // ไฟล์ใหม่ถูกอัปโหลดและบันทึกลง database สำเร็จไปแล้วก่อนจะเรียก DELETE นี้เสมอ (ดูฝั่ง client)
  // ดังนั้นถ้าลบไฟล์เก่าไม่สำเร็จ แค่ log ไว้ ไม่ทำให้ทั้ง flow ล้มเหลว — ไฟล์เก่าจะค้างเป็น orphan ที่ไปเก็บกวาดทีหลังได้
  const { error } = await sb.storage.from(BUCKET).remove([path]);
  if (error) console.error(`[upload] failed to delete old file "${path}":`, error.message);
  return NextResponse.json({ ok: true });
}
