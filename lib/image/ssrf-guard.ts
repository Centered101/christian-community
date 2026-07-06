import dns from "node:dns/promises";
import net from "node:net";

const BLOCKED_HOSTNAMES = new Set(["localhost", "0.0.0.0", "metadata.google.internal"]);

/** true ถ้า IPv4 หรือ IPv6 นั้นเป็น loopback, link-local หรืออยู่ในช่วง private */
function isPrivateIp(ip: string): boolean {
  const version = net.isIP(ip);
  if (version === 4) {
    const [a, b] = ip.split(".").map(Number);
    if (a === 10) return true;
    if (a === 127) return true;
    if (a === 0) return true;
    if (a === 169 && b === 254) return true; // link-local + cloud metadata (169.254.169.254)
    if (a === 172 && b >= 16 && b <= 31) return true;
    if (a === 192 && b === 168) return true;
    if (a === 100 && b >= 64 && b <= 127) return true; // carrier-grade NAT (แชร์ IP ระดับผู้ให้บริการ)
    return false;
  }
  if (version === 6) {
    const lower = ip.toLowerCase();
    if (lower === "::1" || lower === "::") return true;
    if (lower.startsWith("fe80")) return true; // link-local
    if (lower.startsWith("fc") || lower.startsWith("fd")) return true; // unique local fc00::/7 (ที่อยู่ใช้เฉพาะในองค์กร)
    const mapped = lower.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/);
    if (mapped) return isPrivateIp(mapped[1]);
    return false;
  }
  return true; // ไม่ใช่ IP literal ที่ parse ได้ -> ถือว่าไม่ปลอดภัยไว้ก่อน
}

/**
 * ตรวจสอบว่า URL ชี้ไปที่ host http(s) สาธารณะจริง — ไม่ใช่ localhost,
 * ช่วง IP ภายใน/private, หรือ cloud metadata endpoint โดย resolve hostname
 * ผ่าน DNS ด้วย เพื่อปฏิเสธโดเมนที่ดูเหมือนสาธารณะแต่ resolve ไปยัง IP ภายใน
 * (DNS rebinding) ด้วยเช่นกัน
 */
export async function assertPublicImageUrl(rawUrl: string): Promise<URL> {
  let url: URL;
  try {
    url = new URL(rawUrl);
  } catch {
    throw new Error("URL ไม่ถูกต้อง");
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error("รองรับเฉพาะ URL แบบ http/https");
  }

  const hostname = url.hostname.toLowerCase().replace(/^\[|\]$/g, "");
  if (BLOCKED_HOSTNAMES.has(hostname) || hostname.endsWith(".local")) {
    throw new Error("ไม่อนุญาตให้ใช้ URL นี้");
  }

  if (net.isIP(hostname)) {
    if (isPrivateIp(hostname)) throw new Error("ไม่อนุญาตให้ใช้ URL ที่ชี้ไปยังเครือข่ายภายใน");
    return url;
  }

  let records;
  try {
    records = await dns.lookup(hostname, { all: true });
  } catch {
    throw new Error("ไม่สามารถระบุที่อยู่ของโดเมนนี้ได้");
  }
  if (records.length === 0) throw new Error("ไม่สามารถระบุที่อยู่ของโดเมนนี้ได้");
  for (const r of records) {
    if (isPrivateIp(r.address)) throw new Error("โดเมนนี้ชี้ไปยังเครือข่ายภายใน ไม่อนุญาต");
  }
  return url;
}
