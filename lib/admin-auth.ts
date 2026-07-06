import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const MAX_AGE_MS = 60 * 60 * 24 * 7 * 1000; // matches admin_token cookie maxAge

function verifyToken(token: string): boolean {
  const secret = process.env.ADMIN_SECRET ?? "fallback-secret";
  try {
    const decoded = Buffer.from(token, "base64url").toString();
    const lastColon = decoded.lastIndexOf(":");
    if (lastColon === -1) return false;
    const payload = decoded.slice(0, lastColon);
    const sig = decoded.slice(lastColon + 1);
    const expected = createHmac("sha256", secret).update(payload).digest("hex");
    const sigBuf = Buffer.from(sig);
    const expBuf = Buffer.from(expected);
    if (sigBuf.length !== expBuf.length || !timingSafeEqual(sigBuf, expBuf)) return false;
    const ts = Number(payload.split(":")[1]);
    return !!ts && Date.now() - ts <= MAX_AGE_MS;
  } catch {
    return false;
  }
}

/** ตรวจสอบ cookie admin_token ที่ตั้งไว้จาก /api/admin/login ใช้ในทุก API route ที่จำกัดเฉพาะแอดมิน */
export async function isAdminRequest(): Promise<boolean> {
  const store = await cookies();
  const token = store.get("admin_token")?.value;
  return !!token && verifyToken(token);
}
