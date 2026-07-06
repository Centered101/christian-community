import type { Locale } from "./translations";

/** เลือกข้อความตาม locale — ถ้าเป็น "en" แต่ค่า _en ว่าง จะ fallback ไปใช้ค่าไทยแทน */
export function pickLocale(locale: Locale, th: string, en: string): string {
  if (locale === "en" && en.trim()) return en;
  return th;
}
