import { assertPublicImageUrl } from "./ssrf-guard";

const MAX_REMOTE_BYTES = 8 * 1024 * 1024;
const FETCH_TIMEOUT_MS = 10_000;

/** ดาวน์โหลดรูปจาก URL ภายนอก พร้อมป้องกัน SSRF, จำกัดขนาดไฟล์, และ timeout */
export async function fetchRemoteImage(rawUrl: string): Promise<Buffer> {
  const url = await assertPublicImageUrl(rawUrl);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  let res: Response;
  try {
    // ไม่ follow redirect อัตโนมัติ — เพราะปลายทางของ redirect อาจชี้ไปยัง
    // host ภายในได้ ซึ่งจะข้ามการตรวจสอบ SSRF ที่ทำไว้ด้านบน
    res = await fetch(url, { signal: controller.signal, redirect: "manual" });
  } catch {
    throw new Error("ไม่สามารถดาวน์โหลดรูปภาพจาก URL นี้ได้");
  } finally {
    clearTimeout(timeout);
  }

  if (res.type === "opaqueredirect" || (res.status >= 300 && res.status < 400)) {
    throw new Error("ไม่รองรับ URL ที่มีการ redirect");
  }
  if (!res.ok) throw new Error(`ดาวน์โหลดรูปภาพไม่สำเร็จ (${res.status})`);

  const contentLength = res.headers.get("content-length");
  if (contentLength && Number(contentLength) > MAX_REMOTE_BYTES) {
    throw new Error("ไฟล์รูปภาพมีขนาดใหญ่เกินไป (สูงสุด 8MB)");
  }

  const contentType = (res.headers.get("content-type") || "").toLowerCase();
  if (!contentType.startsWith("image/")) {
    throw new Error("URL นี้ไม่ใช่รูปภาพ");
  }

  const arrayBuffer = await res.arrayBuffer();
  if (arrayBuffer.byteLength > MAX_REMOTE_BYTES) {
    throw new Error("ไฟล์รูปภาพมีขนาดใหญ่เกินไป (สูงสุด 8MB)");
  }
  return Buffer.from(arrayBuffer);
}
