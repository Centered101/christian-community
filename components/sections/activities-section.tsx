"use client";

import { useLocale } from "@/lib/i18n/locale-context";
import { pickLocale } from "@/lib/i18n/pick-locale";
import type { ActivityItem } from "@/lib/types";

export default function ActivitiesSection({
  activities,
  pageTitle,
  pageTitleEn,
  pageSubtitle,
  pageSubtitleEn,
}: {
  activities: ActivityItem[];
  pageTitle?: string;
  pageTitleEn?: string;
  pageSubtitle?: string;
  pageSubtitleEn?: string;
}) {
  const { t, locale } = useLocale();
  const titleText = pickLocale(locale, pageTitle ?? "", pageTitleEn ?? "");
  const subtitleText = pickLocale(locale, pageSubtitle ?? "", pageSubtitleEn ?? "");

  return (
    <div className="pt-6 md:pt-24 pb-16 min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12" data-aos="fade-up">
          <div className="divider"></div>
          <h2 className="text-3xl sm:text-4xl font-bold text-blue-900">{titleText}</h2>
          <p className="text-slate-500 mt-3">{subtitleText}</p>
        </div>

        {activities.length === 0 ? (
          <div className="text-center py-20" data-aos="zoom-in">
            <div className="w-20 h-20 mx-auto rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center mb-5">
              <i className="fa-solid fa-star text-3xl text-blue-300"></i>
            </div>
            <p className="text-slate-600 font-semibold text-lg">{t("noActivitiesYet")}</p>
            <p className="text-slate-400 text-sm mt-2 max-w-xs mx-auto">
              {t("activitiesWillAppear")}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {activities.map((a, i) => (
              <div key={a.id ?? a.title} data-aos="fade-up" data-aos-delay={String((i % 3) * 100)} className="h-full">
              <div className="bg-white rounded-2xl shadow-md overflow-hidden card-hover group h-full">
                {a.img && (
                  <div className="relative overflow-hidden h-48">
                    <img
                      src={a.img}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      alt=""
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-900/70 to-transparent"></div>
                    <p className="absolute bottom-3 left-4 text-white text-xs font-semibold bg-blue-600/80 px-3 py-1 rounded-full">
                      {a.date}
                    </p>
                  </div>
                )}
                <div className="p-5">
                  {!a.img && (
                    <p className="text-blue-500 text-xs font-semibold mb-2">
                      <i className="fa-regular fa-calendar mr-1"></i>{a.date}
                    </p>
                  )}
                  <h3 className="font-display text-blue-900 text-base font-semibold mb-2">{pickLocale(locale, a.title, a.title_en)}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{pickLocale(locale, a.description, a.description_en)}</p>
                </div>
              </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
