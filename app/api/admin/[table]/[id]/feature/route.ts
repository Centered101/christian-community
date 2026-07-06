import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { ADMIN_TABLES } from "@/lib/admin-tables";

/** ตั้งแถวหนึ่งให้เป็น "หลัก" ในตารางนั้นๆ — จะยกเลิกแถวที่เป็นหลักอยู่เดิมก่อนเสมอ ปัจจุบันใช้กับ videos */
const FEATURABLE_TABLES = new Set(["videos"]);

export async function POST(_req: NextRequest, { params }: { params: Promise<{ table: string; id: string }> }) {
  if (!(await isAdminRequest())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { table, id } = await params;
  if (!(table in ADMIN_TABLES) || !FEATURABLE_TABLES.has(table)) {
    return NextResponse.json({ error: "Unknown table" }, { status: 400 });
  }

  const sb = getSupabaseAdmin();
  if (!sb) return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });

  const { error: unsetError } = await sb.from(table).update({ is_featured: false }).eq("is_featured", true);
  if (unsetError) return NextResponse.json({ error: unsetError.message }, { status: 400 });

  const { error: setError } = await sb.from(table).update({ is_featured: true }).eq("id", id);
  if (setError) return NextResponse.json({ error: setError.message }, { status: 400 });

  return NextResponse.json({ ok: true });
}
