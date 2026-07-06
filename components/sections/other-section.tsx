"use client";

import Link from "next/link";
import { useLocale } from "@/lib/i18n/locale-context";

export default function OtherSection() {
  const { t, locale, setLocale } = useLocale();

  const TILES = [
    { href: "/", icon: "fa-solid fa-house", label: t("home"), color: "#157493" },
    { href: "/calendar", icon: "fa-solid fa-calendar-days", label: t("calendarActivitiesLabel"), color: "#1d9ab8" },
    { href: "/members", icon: "fa-solid fa-users", label: t("footerMembers"), color: "#8b5cf6" },
    { href: "/activities", icon: "fa-solid fa-star", label: t("footerActivities"), color: "#f59e0b" },
    { href: "/chat", icon: "fa-regular fa-comment", label: t("chatLabel"), color: "#10b981" },
    { href: "/shop", icon: "fa-solid fa-book", label: t("footerResources"), color: "#0891b2" },
    { href: "/bible", icon: "fa-solid fa-book-bible", label: t("bible"), color: "#dc2626" },
    { href: "/videos", icon: "fa-solid fa-circle-play", label: t("watchVideo"), color: "#0f172a" },
    { href: "/login", icon: "fa-solid fa-right-to-bracket", label: t("login"), color: "#374151" },
  ];

  return (
    <div className="pt-6 md:pt-24 pb-16 min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8" data-aos="fade-up">
          <div className="divider"></div>
          <h2 className="text-3xl sm:text-4xl font-bold text-blue-900">{t("otherPageTitle")}</h2>
        </div>

        {/* ภาษา / Language — สลับภาษาได้จากหน้านี้ (มือถือ) */}
        <div className="max-w-2xl mx-auto mb-8" data-aos="fade-up" data-aos-delay="100">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-blue-100">
            <p className="text-blue-900 text-sm font-semibold mb-3 flex items-center gap-2">
              <i className="fa-solid fa-globe text-blue-500"></i>
              ภาษา / Language
            </p>
            <div className="grid grid-cols-2 gap-3">
              {([
                { code: "th", label: "ไทย" },
                { code: "en", label: "English" },
              ] as const).map((opt) => (
                <button
                  key={opt.code}
                  type="button"
                  onClick={() => setLocale(opt.code)}
                  className="py-3 rounded-xl text-sm font-bold transition-all"
                  style={{
                    background: locale === opt.code ? "#157493" : "#f1f5f9",
                    color: locale === opt.code ? "#fff" : "#64748b",
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
          {TILES.map((tile, i) => (
            <div key={tile.href} data-aos="zoom-in" data-aos-delay={String((i % 3) * 80)} className="h-full">
            <Link
              href={tile.href}
              className="bg-white rounded-2xl p-8 flex flex-col items-center gap-3 shadow-sm hover:shadow-md card-hover text-center border border-blue-100 h-full"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-lg"
                style={{ background: tile.color }}
              >
                <i className={tile.icon}></i>
              </div>
              <span className="text-blue-900 text-sm font-semibold">{tile.label}</span>
            </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
