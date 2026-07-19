"use client";

import { useEffect } from "react";
import { useLocale } from "@/lib/i18n/locale-context";
import { pickLocale } from "@/lib/i18n/pick-locale";
import { calculateAge } from "@/lib/member-age";
import {
  formatTempleRecommendCountdown,
  formatTempleRecommendExpiry,
  getTempleRecommendTone,
  templeRecommendToneClass,
} from "@/lib/temple-recommend";
import type { Member } from "@/lib/types";

type Props = {
  member: Member | null;
  onClose: () => void;
};

export default function MemberModal({ member, onClose }: Props) {
  const { t, locale } = useLocale();
  const age = member ? calculateAge(member.birthday) : null;
  const ageSuffix = locale === "th" ? "ปี" : "years old";
  const certificateCountdown = member ? formatTempleRecommendCountdown(member.certificateExpiresAt, locale) : "";
  const certificateExpiry = member ? formatTempleRecommendExpiry(member.certificateExpiresAt, locale) : "";
  const certificateTone = member ? getTempleRecommendTone(member.certificateExpiresAt) : "expired";

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
        {
          icon: "fa-certificate",
          label: locale === "th" ? "ใบรับรองพระวิหาร" : "Temple recommend",
          value: certificateCountdown && certificateExpiry ? `${certificateCountdown} (${certificateExpiry})` : certificateCountdown,
          tone: certificateTone,
        },
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
                  <p className={`${r.tone ? templeRecommendToneClass[r.tone] : "text-slate-700"} text-sm mt-0.5`}>{r.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
