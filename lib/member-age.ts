import type { Member } from "./types";

export type ParsedBirthday = {
  year: number;
  month: number;
  day: number;
};

function validDateParts(year: number, month: number, day: number): ParsedBirthday | null {
  if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day)) return null;
  if (year < 1900 || year > new Date().getFullYear()) return null;
  if (month < 1 || month > 12 || day < 1 || day > 31) return null;

  const date = new Date(year, month - 1, day);
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) return null;
  return { year, month, day };
}

export function parseBirthday(value: string): ParsedBirthday | null {
  const raw = value.trim();
  if (!raw) return null;

  const iso = raw.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})$/);
  if (iso) return validDateParts(Number(iso[1]), Number(iso[2]), Number(iso[3]));

  const us = raw.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})$/);
  if (us) return validDateParts(Number(us[3]), Number(us[1]), Number(us[2]));

  return null;
}

export function formatBirthdayForDateInput(value: string): string {
  const parsed = parseBirthday(value);
  if (!parsed) return "";

  const year = String(parsed.year).padStart(4, "0");
  const month = String(parsed.month).padStart(2, "0");
  const day = String(parsed.day).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function calculateAge(birthday: string, today = new Date()): number | null {
  const parsed = parseBirthday(birthday);
  if (!parsed) return null;

  let age = today.getFullYear() - parsed.year;
  const currentMonth = today.getMonth() + 1;
  const currentDay = today.getDate();
  if (currentMonth < parsed.month || (currentMonth === parsed.month && currentDay < parsed.day)) age -= 1;
  return age;
}

export function isAgedOutMember(member: Pick<Member, "birthday">, today = new Date()): boolean {
  const age = calculateAge(member.birthday, today);
  return age !== null && age > 35;
}

export function isMemberAgeEligible(member: Pick<Member, "birthday">, today = new Date()): boolean {
  const age = calculateAge(member.birthday, today);
  return age !== null && age >= 18 && age <= 35;
}

export function filterActiveMembers(members: Member[], today = new Date()): Member[] {
  return members.filter((member) => isMemberAgeEligible(member, today));
}
