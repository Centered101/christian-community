// ตรวจคำหยาบไทย/อังกฤษแบบพื้นฐานสำหรับกล่องแชต/รีวิวสาธารณะ
// ไม่ครอบคลุมทั้งหมด — เป็นแค่ด่านแรก แอดมินยังซ่อน/ลบข้อความที่หลุดรอด
// มาได้ผ่านแผงจัดการ (moderation panel) อยู่ดี
const BLOCKLIST = [
  "เหี้ย", "ควย", "สัส", "สัตว์", "แม่ง", "ไอ้สัตว์", "เย็ด", "หี", "กระหรี่",
  "ตอแหล", "อีดอก", "อีสัตว์", "ไอ้ควาย", "ควาย", "fuck", "shit", "bitch",
  "asshole", "cunt", "nigger", "retard",
];

function normalize(text: string) {
  return text.toLowerCase().replace(/[\s.,!?_-]/g, "");
}

export function containsProfanity(text: string): boolean {
  const normalized = normalize(text);
  return BLOCKLIST.some((word) => normalized.includes(normalize(word)));
}
