import { randomBytes, scryptSync, timingSafeEqual } from "crypto";
import { getSupabaseAdmin } from "./supabase/admin";

const SCRYPT_KEYLEN = 64;

export function hashPassword(password: string): { hash: string; salt: string } {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, SCRYPT_KEYLEN).toString("hex");
  return { hash, salt };
}

export function verifyPassword(password: string, hash: string, salt: string): boolean {
  try {
    const candidate = scryptSync(password, salt, SCRYPT_KEYLEN);
    const expected = Buffer.from(hash, "hex");
    return candidate.length === expected.length && timingSafeEqual(candidate, expected);
  } catch {
    return false;
  }
}

export type AdminCredentials = { username: string; passwordHash: string; passwordSalt: string };

/** เทียบสตริงแบบ timing-safe (กัน timing attack) */
function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  return ab.length === bb.length && timingSafeEqual(ab, bb);
}

/** รหัสล็อกอินจาก .env — ทำหน้าที่เป็น "รหัสหลัก/สำรอง" ที่ใช้ได้เสมอ */
function getEnvCredentials(): { username: string; password: string } {
  return {
    username: process.env.ADMIN_USERNAME ?? "admin",
    password: process.env.ADMIN_PASSWORD ?? "changeme1234",
  };
}

/** รหัสล็อกอินที่แอดมินตั้งไว้ใน Supabase (`admin_settings`) — คืน null ถ้ายังไม่เคยตั้ง */
export async function getDbCredentials(): Promise<AdminCredentials | null> {
  const sb = getSupabaseAdmin();
  if (!sb) return null;
  const { data } = await sb
    .from("admin_settings")
    .select("username,password_hash,password_salt")
    .eq("id", 1)
    .maybeSingle();
  if (!data) return null;
  return { username: data.username, passwordHash: data.password_hash, passwordSalt: data.password_salt };
}

/** อ่านข้อมูลล็อกอินแอดมิน (ใช้แสดงชื่อผู้ใช้ปัจจุบัน / คงรหัสเดิม) — DB ก่อน ไม่มีจึงใช้ env */
export async function getAdminCredentials(): Promise<AdminCredentials> {
  const db = await getDbCredentials();
  if (db) return db;
  const env = getEnvCredentials();
  const { hash, salt } = hashPassword(env.password);
  return { username: env.username, passwordHash: hash, passwordSalt: salt };
}

/**
 * ตรวจสอบการล็อกอิน — ผ่านได้ทั้ง 2 ระบบพร้อมกัน:
 *  1) รหัสใน .env (ADMIN_USERNAME/ADMIN_PASSWORD) — ใช้ได้เสมอ แม้ตั้งรหัสใน Supabase แล้ว
 *  2) รหัสที่แอดมินตั้งไว้ใน Supabase (admin_settings) — ถ้ามี
 */
export async function verifyAdminLogin(username: string, password: string): Promise<boolean> {
  const env = getEnvCredentials();
  if (safeEqual(username, env.username) && safeEqual(password, env.password)) return true;

  const db = await getDbCredentials();
  if (db && username === db.username && verifyPassword(password, db.passwordHash, db.passwordSalt)) return true;

  return false;
}

/** ยืนยันรหัสผ่านปัจจุบัน (สำหรับหน้าตั้งค่า) — รับได้ทั้งรหัส .env และรหัสใน Supabase */
export async function verifyCurrentPassword(password: string): Promise<boolean> {
  const env = getEnvCredentials();
  if (safeEqual(password, env.password)) return true;

  const db = await getDbCredentials();
  if (db && verifyPassword(password, db.passwordHash, db.passwordSalt)) return true;

  return false;
}

export async function updateAdminCredentials(username: string, password?: string): Promise<void> {
  const sb = getSupabaseAdmin();
  if (!sb) throw new Error("Supabase not configured");

  const payload: Record<string, unknown> = { id: 1, username, updated_at: new Date().toISOString() };
  if (password) {
    const { hash, salt } = hashPassword(password);
    payload.password_hash = hash;
    payload.password_salt = salt;
  } else {
    // คงรหัสผ่านเดิมไว้ ถ้าเปลี่ยนแค่ชื่อผู้ใช้
    const current = await getAdminCredentials();
    payload.password_hash = current.passwordHash;
    payload.password_salt = current.passwordSalt;
  }

  const { error } = await sb.from("admin_settings").upsert(payload);
  if (error) throw new Error(error.message);
}
