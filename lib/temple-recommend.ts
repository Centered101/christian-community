export type TempleRecommendTone = "missing" | "green" | "yellow" | "red" | "expired";

const DAY_MS = 24 * 60 * 60 * 1000;

function parseDateOnly(value: string): Date | null {
  if (!value.trim()) return null;
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day);
}

export function getTempleRecommendDaysLeft(value: string): number | null {
  const expiresAt = parseDateOnly(value);
  if (!expiresAt) return null;

  const today = new Date();
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  return Math.ceil((expiresAt.getTime() - todayStart.getTime()) / DAY_MS);
}

export function getTempleRecommendTone(value: string): TempleRecommendTone {
  const daysLeft = getTempleRecommendDaysLeft(value);
  if (daysLeft === null) return "missing";
  if (daysLeft < 0) return "expired";
  if (daysLeft <= 7) return "red";
  if (daysLeft <= 30) return "yellow";
  return "green";
}

export function formatTempleRecommendCountdown(value: string, locale: "th" | "en") {
  const daysLeft = getTempleRecommendDaysLeft(value);
  if (daysLeft === null) return locale === "th" ? "ยังไม่ได้ใบรับรองพระวิหาร" : "No temple recommend yet";

  if (locale === "th") {
    if (daysLeft < 0) return "ใบรับรองพระวิหาร หมดอายุแล้ว";
    if (daysLeft === 0) return "ใบรับรองพระวิหาร หมดอายุวันนี้";
    return `ใบรับรองพระวิหาร เหลือ ${daysLeft} วัน`;
  }

  if (daysLeft < 0) return "Temple recommend expired";
  if (daysLeft === 0) return "Temple recommend expires today";
  return `Temple recommend: ${daysLeft} days left`;
}

export function formatTempleRecommendExpiry(value: string, locale: "th" | "en") {
  const expiresAt = parseDateOnly(value);
  if (!expiresAt) return "";
  return new Intl.DateTimeFormat(locale === "th" ? "th-TH" : "en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(expiresAt);
}

export const templeRecommendToneClass: Record<TempleRecommendTone, string> = {
  missing: "text-slate-400",
  green: "text-emerald-600",
  yellow: "text-amber-600",
  red: "text-red-600",
  expired: "text-red-700",
};
