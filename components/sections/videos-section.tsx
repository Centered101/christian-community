"use client";

import { useState } from "react";
import VideoModal from "@/components/video-modal";
import { useLocale } from "@/lib/i18n/locale-context";
import { pickLocale } from "@/lib/i18n/pick-locale";
import type { VideoItem } from "@/lib/types";

export default function VideosSection({
  videos,
  pageTitle,
  pageTitleEn,
  pageSubtitle,
  pageSubtitleEn,
}: {
  videos: VideoItem[];
  pageTitle?: string;
  pageTitleEn?: string;
  pageSubtitle?: string;
  pageSubtitleEn?: string;
}) {
  const { t, locale } = useLocale();
  const [active, setActive] = useState<VideoItem | null>(null);
  const titleText = pickLocale(locale, pageTitle ?? "", pageTitleEn ?? "");
  const subtitleText = pickLocale(locale, pageSubtitle ?? "", pageSubtitleEn ?? "");

  return (
    <div className="pt-6 md:pt-24 pb-16 min-h-screen" style={{ background: "#f1f5f9" }}>
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-10" data-aos="fade-up">
          <div className="divider"></div>
          <h1 className="text-3xl sm:text-4xl font-bold" style={{ color: "#0f1e50" }}>
            {titleText}
          </h1>
          {subtitleText && <p className="text-slate-500 mt-3">{subtitleText}</p>}
        </div>

        {videos.length === 0 ? (
          <p className="text-center text-slate-500" data-aos="fade-up">{t("noVideosYet")}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {videos.map((v, i) => (
              <button
                key={v.id}
                onClick={() => setActive(v)}
                data-aos="fade-up"
                data-aos-delay={String((i % 3) * 100)}
                className="group text-left rounded-2xl overflow-hidden border border-slate-200 bg-white hover:shadow-lg transition-shadow"
              >
                <div className="relative aspect-video bg-slate-900 flex items-center justify-center">
                  <video src={v.video_url} className="w-full h-full object-cover opacity-80" muted preload="metadata" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: "rgba(21,116,147,0.85)" }}>
                      <i className="fa-solid fa-play text-white text-lg"></i>
                    </div>
                  </div>
                  {v.is_featured && (
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-xs font-semibold text-white" style={{ background: "#157493" }}>
                      {t("featured")}
                    </span>
                  )}
                </div>
                <p className="px-4 py-3 text-sm font-semibold" style={{ color: "#0f1e50" }}>{pickLocale(locale, v.title, v.title_en)}</p>
              </button>
            ))}
          </div>
        )}
      </div>

      {active && (
        <VideoModal open={!!active} onClose={() => setActive(null)} src={active.video_url} title={pickLocale(locale, active.title, active.title_en)} />
      )}
    </div>
  );
}
