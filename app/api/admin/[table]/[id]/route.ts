import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { ADMIN_TABLES, sanitizePayload } from "@/lib/admin-tables";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ table: string; id: string }> }) {
  if (!(await isAdminRequest())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { table, id } = await params;
  if (!(table in ADMIN_TABLES)) return NextResponse.json({ error: "Unknown table" }, { status: 400 });

  const payload = sanitizePayload(table, await req.json());
  if (!payload) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  const sb = getSupabaseAdmin();
  if (!sb) return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });

  const { error } = await sb.from(table).update(payload).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ table: string; id: string }> }) {
  if (!(await isAdminRequest())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { table, id } = await params;
  if (!(table in ADMIN_TABLES)) return NextResponse.json({ error: "Unknown table" }, { status: 400 });

  const sb = getSupabaseAdmin();
  if (!sb) return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });

  const { error } = await sb.from(table).delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
