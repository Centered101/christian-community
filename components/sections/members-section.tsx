"use client";

import { useMemo, useState } from "react";
import { useLocale } from "@/lib/i18n/locale-context";
import { pickLocale } from "@/lib/i18n/pick-locale";
import { calculateAge } from "@/lib/member-age";
import type { Member } from "@/lib/types";

type Props = {
  members: Member[];
  onOpenMember: (m: Member) => void;
  pageTitle?: string;
  pageTitleEn?: string;
  pageSubtitle?: string;
  pageSubtitleEn?: string;
};

const MEMBER_SHOOTING_STARS = [
  { top: "12%", delay: "0s", dur: "7.5s" },
  { top: "34%", delay: "2.3s", dur: "8.5s" },
  { top: "62%", delay: "4.8s", dur: "9.5s" },
];

const MEMBER_STARS = Array.from({ length: 30 }, (_, i) => {
  const seed = i * 41;
  return {
    top: `${(seed * 7) % 100}%`,
    left: `${(seed * 13) % 100}%`,
    size: 2 + (i % 4),
    dur: `${2.5 + (i % 5) * 0.6}s`,
    delay: `${(i % 9) * 0.4}s`,
    glow: i % 5 === 0,
  };
});

export default function MembersSection({ members, onOpenMember, pageTitle, pageTitleEn, pageSubtitle, pageSubtitleEn }: Props) {
  const { t, locale } = useLocale();
  const [query, setQuery] = useState("");
  const titleText = pickLocale(locale, pageTitle ?? "", pageTitleEn ?? "");
  const subtitleText = pickLocale(locale, pageSubtitle ?? "", pageSubtitleEn ?? "");

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return members;
    return members.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.name_en.toLowerCase().includes(q) ||
        m.role.toLowerCase().includes(q) ||
        m.role_en.toLowerCase().includes(q)
    );
  }, [members, query]);

  return (
    <div
      className="relative overflow-hidden pt-6 md:pt-24 pb-16 min-h-screen"
      style={{ background: "linear-gradient(160deg, #0a1e4a 0%, #157493 55%, #1e3a8a 100%)" }}
    >
      <div className="members-hero-stars" aria-hidden="true">
        {MEMBER_STARS.map((star, i) => (
          <span
            key={`star-${i}`}
            className={`star${star.glow ? " glow" : ""}`}
            style={{
              top: star.top,
              left: star.left,
              width: star.size,
              height: star.size,
              animationDelay: star.delay,
              ["--dur" as string]: star.dur,
            }}
          />
        ))}
        {MEMBER_SHOOTING_STARS.map((star, i) => (
          <span
            key={`shooting-${i}`}
            className="shooting-star"
            style={{
              top: star.top,
              animationDelay: star.delay,
              ["--sdur" as string]: star.dur,
            }}
          />
        ))}
      </div>
      <div className="relative z-10 max-w-6xl mx-auto px-4">
        <div className="text-center mb-10" data-aos="fade-up">
          <div className="divider"></div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white">{titleText}</h2>
          <p className="text-blue-100 mt-3">{subtitleText}</p>
        </div>

        {members.length === 0 ? (
          <div className="text-center py-20" data-aos="zoom-in">
            <div className="w-20 h-20 mx-auto rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center mb-5">
              <i className="fa-solid fa-users text-3xl text-blue-300"></i>
            </div>
            <p className="text-white font-semibold text-lg">{t("noMembersYet")}</p>
            <p className="text-blue-100 text-sm mt-2 max-w-xs mx-auto">
              {t("membersWillAppear")}
            </p>
          </div>
        ) : (
          <>
            <div className="max-w-md mx-auto mb-10 relative" data-aos="fade-up">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-300">
                <i className="fa-solid fa-magnifying-glass"></i>
              </span>
              <input
                id="member-search"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t("searchMembersPlaceholder")}
                className="w-full pl-10 pr-5 py-3 rounded-2xl border border-blue-200 bg-white shadow-sm text-slate-700 transition-all focus:border-blue-400"
              />
            </div>

            {filtered.length === 0 ? (
              <p className="text-center text-slate-400 py-12">{t("noMembersFound")}</p>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 lg:gap-6">
                {filtered.map((m, i) => {
                  const age = calculateAge(m.birthday);
                  const hasCertificate = !!m.certificateUrl || !!m.certificateExpiresAt;
                  return (
                  <div key={m.id ?? i} data-aos="fade-up" data-aos-delay={String((i % 4) * 80)} className="h-full">
                  <div
                    className="bg-white rounded-2xl shadow-md overflow-hidden card-hover text-center px-3 py-5 sm:p-6 relative group cursor-pointer h-full"
                    onClick={() => onOpenMember(m)}
                  >
                    <div className={`absolute top-3 ${hasCertificate ? "right-14" : "right-3"} opacity-0 group-hover:opacity-100 transition-opacity`}>
                      <span className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full font-semibold">
                        <i className="fa-solid fa-circle-info mr-1"></i>{t("info")}
                      </span>
                    </div>
                    {hasCertificate && (
                      <span
                        title={locale === "th" ? "มีใบ certificate" : "Has certificate"}
                        aria-label={locale === "th" ? "มีใบ certificate" : "Has certificate"}
                        className="absolute top-3 right-3 w-9 h-9 rounded-full bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center shadow-sm"
                      >
                        <i className="fa-solid fa-award"></i>
                      </span>
                    )}
                    {m.avatar ? (
                      <img
                        src={m.avatar}
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl mx-auto mb-3 sm:mb-4 border-4 border-blue-100 object-cover"
                        alt=""
                      />
                    ) : (
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl mx-auto mb-3 sm:mb-4 border-4 border-blue-100 bg-blue-50 flex items-center justify-center">
                        <i className="fa-solid fa-user text-blue-300 text-2xl"></i>
                      </div>
                    )}
                    <h3 className="font-display text-blue-900 text-sm font-semibold">{pickLocale(locale, m.name, m.name_en)}</h3>
                    <p className="text-blue-400 text-xs mt-1">
                      <i className="fa-solid fa-user-group mr-1 opacity-60"></i>
                      {pickLocale(locale, m.role, m.role_en)}
                    </p>
                    {age !== null && (
                      <p className="text-slate-400 text-xs mt-1">
                        {locale === "th" ? `อายุ ${age} ปี` : `${age} years old`}
                      </p>
                    )}
                    <div className="mt-3 flex flex-wrap justify-center gap-1">
                      {m.tags.map((tag) => (
                        <span className="member-tag" key={tag}>{tag}</span>
                      ))}
                    </div>
                  </div>
                  </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
