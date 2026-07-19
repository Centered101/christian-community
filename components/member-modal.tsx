"use client";

import { useEffect } from "react";
import { useLocale } from "@/lib/i18n/locale-context";
import { pickLocale } from "@/lib/i18n/pick-locale";
import { calculateAge } from "@/lib/member-age";
import type { Member } from "@/lib/types";

type Props = {
  member: Member | null;
  onClose: () => void;
};

function formatCertificateExpiry(value: string, locale: string) {
  if (!value.trim()) return "";
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat(locale === "th" ? "th-TH" : "en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function formatCertificateCountdown(value: string, locale: string) {
  if (!value.trim()) return "";
  const expiry = new Date(`${value}T00:00:00`);
  if (Number.isNaN(expiry.getTime())) return "";

  const today = new Date();
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const diffDays = Math.ceil((expiry.getTime() - todayStart.getTime()) / 86400000);

  if (locale === "th") {
    if (diffDays > 0) return `เหลือ ${diffDays} วัน`;
    if (diffDays === 0) return "หมดอายุวันนี้";
    return `หมดอายุแล้ว ${Math.abs(diffDays)} วัน`;
  }

  if (diffDays > 0) return `${diffDays} days left`;
  if (diffDays === 0) return "Expires today";
  return `Expired ${Math.abs(diffDays)} days ago`;
}

export default function MemberModal({ member, onClose }: Props) {
  const { t, locale } = useLocale();
  const age = member ? calculateAge(member.birthday) : null;
  const ageSuffix = locale === "th" ? "ปี" : "years old";
  const certificateExpiry = member ? formatCertificateExpiry(member.certificateExpiresAt, locale) : "";
  const certificateCountdown = member ? formatCertificateCountdown(member.certificateExpiresAt, locale) : "";
  const hasCertificate = !!member?.certificateUrl || !!certificateExpiry;

  useEffect(() => {
    if (!member) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [member, onClose]);

  const rows = member
    ? [
        { icon: "fa-phone", label: t("phone"), value: member.phone },
        { icon: "fa-envelope", label: t("email"), value: member.email },
        { icon: "fa-cake-candles", label: t("birthday"), value: age === null ? member.birthday : `${member.birthday} (${age} ${ageSuffix})` },
        { icon: "fa-location-dot", label: t("address"), value: member.address },
        { icon: "fa-calendar-check", label: t("joinedSince"), value: member.joinDate },
        { icon: "fa-hands-praying", label: t("calling"), value: pickLocale(locale, member.calling, member.calling_en) },
        ...(hasCertificate
          ? [
              {
                icon: "fa-award",
                label: locale === "th" ? "ใบเซอร์" : "Certificate",
                value: locale === "th" ? "เปิดใบเซอร์" : "Open certificate",
                href: member.certificateUrl,
              },
              {
                icon: "fa-hourglass-half",
                label: locale === "th" ? "วันหมดอายุใบเซอร์" : "Certificate Expiry",
                value: certificateCountdown && certificateExpiry ? `${certificateCountdown} (${certificateExpiry})` : certificateExpiry,
              },
            ]
          : []),
        { icon: "fa-comment-dots", label: t("testimony"), value: pickLocale(locale, member.testimony, member.testimony_en) },
      ].filter((row) => row.value.trim().length > 0)
    : [];

  return (
    <div
      id="member-modal"
      className={member ? "open" : ""}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="member-modal-card">
        <div className="member-modal-banner">
          {hasCertificate && (member?.certificateUrl ? (
            <a
              href={member.certificateUrl}
              target="_blank"
              rel="noopener noreferrer"
              title={locale === "th" ? "เปิดใบเซอร์" : "Open certificate"}
              aria-label={locale === "th" ? "เปิดใบเซอร์" : "Open certificate"}
              className="absolute top-3 right-14 w-8 h-8 rounded-full bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center shadow-sm transition-transform hover:scale-105 text-sm"
            >
              <i className="fa-solid fa-award"></i>
            </a>
          ) : (
            <span
              title={locale === "th" ? "ใบ certificate" : "Certificate"}
              aria-label={locale === "th" ? "ใบ certificate" : "Certificate"}
              className="absolute top-3 right-14 w-8 h-8 rounded-full bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center shadow-sm text-sm"
            >
              <i className="fa-solid fa-award"></i>
            </span>
          ))}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center transition text-sm"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
          {member?.avatar ? <img src={member.avatar} className="member-modal-avatar" alt="" /> : null}
        </div>
        <div className="px-6 pt-14 pb-6">
          <div className="text-center mb-4">
            <h3 className="font-display text-blue-900 text-xl font-bold">
              {member ? pickLocale(locale, member.name, member.name_en) : ""}
            </h3>
            <span className="member-tag mt-1">{member ? pickLocale(locale, member.role, member.role_en) : ""}</span>
          </div>
          <div className="mt-4 space-y-1">
            {rows.map((r) => (
              <div className="member-info-row" key={r.label}>
                <div className="member-info-icon">
                  <i className={`fa-solid ${r.icon}`}></i>
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">{r.label}</p>
                  {r.href ? (
                    <a
                      href={r.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#157493] hover:text-[#0f6280] mt-0.5"
                    >
                      {r.value}
                      <i className="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
                    </a>
                  ) : (
                    <p className="text-slate-700 text-sm mt-0.5">{r.value}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
