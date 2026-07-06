import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

/** ลบทุกแถวในตาราง จำกัดไว้เฉพาะตารางที่อยู่ใน allow-list นี้เท่านั้น —
 * เป็นการ "ล้างทั้งหมด" แบบรุนแรง ไม่ควรเปิดให้ทุกตารางใน ADMIN_TABLES ใช้ได้ */
const CLEARABLE_TABLES = new Set(["access_logs"]);

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ table: string }> }) {
  if (!(await isAdminRequest())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { table } = await params;
  if (!CLEARABLE_TABLES.has(table)) return NextResponse.json({ error: "Unknown table" }, { status: 400 });

  const sb = getSupabaseAdmin();
  if (!sb) return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });

  const { error } = await sb.from(table).delete().not("id", "is", null);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
