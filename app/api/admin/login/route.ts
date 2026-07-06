import { NextRequest, NextResponse } from "next/server";
import { createHmac } from "crypto";
import { verifyAdminLogin } from "@/lib/admin-credentials";

function makeToken() {
  const secret = process.env.ADMIN_SECRET ?? "fallback-secret";
  const payload = `admin:${Date.now()}`;
  const sig = createHmac("sha256", secret).update(payload).digest("hex");
  return Buffer.from(`${payload}:${sig}`).toString("base64url");
}

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();

  if (typeof username !== "string" || typeof password !== "string" || !(await verifyAdminLogin(username, password))) {
    return NextResponse.json({ error: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" }, { status: 401 });
  }

  const token = makeToken();
  const res = NextResponse.json({ ok: true });
  res.cookies.set("admin_token", token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
  return res;
}
