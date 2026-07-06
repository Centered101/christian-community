"use client";

import { useLocale } from "@/lib/i18n/locale-context";
import { pickLocale } from "@/lib/i18n/pick-locale";
import type { ScriptureLink } from "@/lib/types";

export default function BibleSection({ scriptureLinks }: { scriptureLinks: ScriptureLink[] }) {
  const { t, locale } = useLocale();

  return (
    <div
      className="pt-6 md:pt-24 pb-16 min-h-screen flex items-center justify-center"
      style={{ background: "linear-gradient(135deg,#0f1e50 0%,#157493 60%,#1e3a8a 100%)" }}
    >
      <div className="max-w-xl mx-auto px-4 text-center">
        <div className="divider" style={{ background: "linear-gradient(90deg,#93c5fd,#bfdbfe)" }} data-aos="fade-up"></div>
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4" data-aos="fade-up">{t("bibleResources")}</h2>
        <p className="text-blue-200 text-lg mb-10 leading-relaxed" data-aos="fade-up" data-aos-delay="100">{t("bibleDesc")}</p>
        <div className="flex flex-col sm:flex-row items-center gap-6 justify-center" data-aos="zoom-in" data-aos-delay="150">
          {scriptureLinks.map((l) => (
            <a key={l.id} href={l.url} target="_blank" rel="noopener noreferrer"
              className="group flex flex-col items-center gap-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl transition-all hover:scale-105 shrink-0 self-center w-[180px]"
              style={{ padding: "24px 16px" }}>
              {l.icon && <img src={l.icon} style={{ width: 80, height: 96, objectFit: "contain" }} alt={pickLocale(locale, l.label, l.label_en)} />}
              <span className="font-display text-white text-sm tracking-wider">{pickLocale(locale, l.label, l.label_en)}</span>
              <span className="text-blue-300 text-xs">{pickLocale(locale, l.sub, l.sub_en)}</span>
            </a>
          ))}
        </div>
        <div className="mt-12 grid grid-cols-3 gap-4" data-aos="fade-up" data-aos-delay="200">
          {[
            { icon: "fa-solid fa-globe", label: t("languagesCount") },
            { icon: "fa-solid fa-calendar-days", label: t("readingPlan") },
            { icon: "fa-solid fa-headphones", label: t("audioBible") },
          ].map((s) => (
            <div key={s.label} className="bg-white/10 rounded-xl p-5 backdrop-blur">
              <div className="text-3xl mb-2 text-blue-200"><i className={s.icon}></i></div>
              <p className="text-blue-100 text-sm">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
