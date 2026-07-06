/**
 * "การเข้าสู่ระบบ" ที่หน้า /login ไม่ใช่การยืนยันตัวตนจริง — เลขสมาชิกไม่ได้ถูก
 * ตรวจสอบกับอะไรเลย (ดู migration access_logs) ฟังก์ชันนี้แค่เก็บค่าไว้ฝั่ง client
 * เป็นเวลา 1 สัปดาห์ เพื่อให้ navbar แสดงได้ว่าใคร "เข้ามา" แล้วหมดอายุอัตโนมัติ
 */
const ID_KEY = "member_id";
const EXPIRES_KEY = "member_id_expires";
const SESSION_LENGTH_MS = 7 * 24 * 60 * 60 * 1000;

export function setMemberSession(memberId: string): void {
  localStorage.setItem(ID_KEY, memberId);
  localStorage.setItem(EXPIRES_KEY, String(Date.now() + SESSION_LENGTH_MS));
}

export function clearMemberSession(): void {
  localStorage.removeItem(ID_KEY);
  localStorage.removeItem(EXPIRES_KEY);
}

/** คืนค่าเลขสมาชิกที่เก็บไว้ หรือ null ถ้าไม่มีหรือหมดอายุแล้ว (ถ้าหมดอายุจะล้างค่าทิ้งด้วย) */
export function getMemberSession(): string | null {
  const id = localStorage.getItem(ID_KEY);
  if (!id) return null;

  const expiresAt = Number(localStorage.getItem(EXPIRES_KEY));
  if (!expiresAt || Date.now() > expiresAt) {
    clearMemberSession();
    return null;
  }
  return id;
}
