import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import { getAdminCredentials, updateAdminCredentials, verifyCurrentPassword } from "@/lib/admin-credentials";

export async function GET() {
  if (!(await isAdminRequest())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const credentials = await getAdminCredentials();
  return NextResponse.json({ username: credentials.username });
}

export async function POST(req: NextRequest) {
  if (!(await isAdminRequest())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { currentPassword, newUsername, newPassword } = await req.json();
  if (typeof currentPassword !== "string" || !currentPassword) {
    return NextResponse.json({ error: "กรุณากรอกรหัสผ่านปัจจุบัน" }, { status: 400 });
  }

  if (!(await verifyCurrentPassword(currentPassword))) {
    return NextResponse.json({ error: "รหัสผ่านปัจจุบันไม่ถูกต้อง" }, { status: 401 });
  }

  const current = await getAdminCredentials();
  const username = typeof newUsername === "string" && newUsername.trim() ? newUsername.trim() : current.username;
  const password = typeof newPassword === "string" && newPassword ? newPassword : undefined;

  try {
    await updateAdminCredentials(username, password);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "บันทึกไม่สำเร็จ";
    return NextResponse.json({ error: message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
