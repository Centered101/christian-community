import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { ADMIN_TABLES, sanitizePayload } from "@/lib/admin-tables";

export async function POST(req: NextRequest, { params }: { params: Promise<{ table: string }> }) {
  if (!(await isAdminRequest())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { table } = await params;
  if (!(table in ADMIN_TABLES)) return NextResponse.json({ error: "Unknown table" }, { status: 400 });

  const payload = sanitizePayload(table, await req.json());
  if (!payload) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  const sb = getSupabaseAdmin();
  if (!sb) return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });

  const { data, error } = await sb.from(table).insert(payload).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ data });
}
