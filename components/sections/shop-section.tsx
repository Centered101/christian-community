"use client";

import { useState } from "react";
import { FALLBACK_RESOURCES } from "@/lib/content";
import { useLocale } from "@/lib/i18n/locale-context";
import { pickLocale } from "@/lib/i18n/pick-locale";
import type { Resource } from "@/lib/types";

type Sel = { si: number; bi: number } | null;

// แปลชื่อหมวดหมู่ (ชุดคงที่จากฟอร์มแอดมิน + ชุด fallback) โดยไม่ต้องเพิ่มคอลัมน์ในฐานข้อมูล
// หมวดที่ไม่อยู่ในนี้จะแสดงชื่อไทยตามที่แอดมินกรอกไว้
const CATEGORY_EN: Record<string, string> = {
  "ทั่วไป": "General",
  "พระคัมภีร์": "Scriptures",
  "ประวัติศาสตร์": "History",
  "หลักคำสอน": "Doctrine",
  "เพลงสวด": "Hymns",
  "การรับใช้": "Service",
  "ครอบครัว": "Family",
  "เยาวชน": "Youth",
  "หนังสือศึกษา": "Study Books",
  "เสริมสร้างศรัทธา": "Faith Building",
  "สำหรับเด็ก": "For Children",
  "งานเผยแผ่": "Missionary Work",
};

// ตาราง resources ไม่มีฟิลด์สี — สร้างสีสันหนังสือแบบคงที่จากชื่อ/ไอดี เพื่อให้ชั้นหนังสือดูมีสีสัน
const SPINE_COLORS = [
  "#1d4ed8", "#7c3aed", "#0e7490", "#b45309", "#be185d", "#166534",
  "#059669", "#dc2626", "#475569", "#92400e", "#0f766e", "#7e22ce",
];

function spineColor(key: string): string {
  let h = 0;
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) >>> 0;
  return SPINE_COLORS[h % SPINE_COLORS.length];
}

export default function ShopSection({ resources }: { resources: Resource[] }) {
  const { t, locale } = useLocale();
  const [sel, setSel] = useState<Sel>(null);

  // ถ้ายังไม่มีข้อมูลจริงในฐานข้อมูล ใช้ชุดตัวอย่างเพื่อไม่ให้หน้าว่างเปล่า
  const list = resources.length > 0 ? resources : FALLBACK_RESOURCES;

  // จัดกลุ่มตามหมวดหมู่ โดยคงลำดับที่พบครั้งแรก (เคารพ sort_order จาก DB)
  const shelves: { label: string; books: Resource[] }[] = [];
  for (const r of list) {
    let shelf = shelves.find((s) => s.label === r.category);
    if (!shelf) {
      shelf = { label: r.category, books: [] };
      shelves.push(shelf);
    }
    shelf.books.push(r);
  }

  const catLabel = (cat: string) => (locale === "en" ? CATEGORY_EN[cat] ?? cat : cat);

  const shelf = sel ? shelves[sel.si] : null;
  const book = sel && shelf ? shelf.books[sel.bi] : null;
  const bookLink = book ? book.url || book.file_url : "";

  return (
    <div className="pt-6 md:pt-24 pb-16 min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-10" data-aos="fade-up">
          <div className="divider"></div>
          <h2 className="text-3xl sm:text-4xl font-bold text-blue-900">{t("shopPageTitle")}</h2>
          <p className="text-slate-500 mt-3">{t("shopPageSub")}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          {/* ── ชั้นหนังสือ (ซ้าย) ── */}
          <div className="lg:col-span-3 space-y-6">
            {shelves.map((s, si) => (
              <div key={s.label} data-aos="fade-up" data-aos-delay={String((si % 4) * 80)}>
                <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2 pl-1">
                  {catLabel(s.label)}
                </p>
                <div className="flex flex-wrap gap-2">
                  {s.books.map((b, bi) => {
                    const isSel = sel?.si === si && sel?.bi === bi;
                    const color = spineColor(b.id ?? b.title);
                    return (
                      <button
                        key={b.id ?? b.title}
                        type="button"
                        onClick={() => setSel(isSel ? null : { si, bi })}
                        title={pickLocale(locale, b.title, b.title_en)}
                        className="group relative"
                        style={{ width: 92 }}
                      >
                        <div
                          className="rounded-xl transition-all duration-150 flex flex-col items-center justify-end overflow-hidden"
                          style={{
                            background: `linear-gradient(160deg, ${color}cc, ${color})`,
                            height: 88,
                            boxShadow: isSel
                              ? `0 0 0 3px #fff, 0 0 0 5px ${color}, 0 4px 16px ${color}66`
                              : "0 2px 6px rgba(0,0,0,0.18)",
                            transform: isSel ? "translateY(-4px) scale(1.04)" : undefined,
                          }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />
                          <div className="w-full bg-black/25 px-1 py-1 text-center">
                            <p className="text-white text-[9px] leading-tight font-semibold line-clamp-2">
                              {pickLocale(locale, b.title, b.title_en)}
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* ── รายละเอียด (ขวา) ── */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg border border-blue-100 overflow-hidden sticky top-24">
              <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                <p className="font-display text-blue-900 font-semibold text-sm">
                  {book ? t("bookDetails") : t("selectBook")}
                </p>
                {shelf && (
                  <span className="text-[11px] px-2 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600">
                    {catLabel(shelf.label)}
                  </span>
                )}
              </div>
              <div className="p-5">
                {!book ? (
                  <div className="text-center py-10">
                    <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 mb-3">
                      <i className="fa-solid fa-book-bookmark text-xl"></i>
                    </div>
                    <p className="text-slate-600 text-sm font-semibold">{t("noBookSelected")}</p>
                    <p className="text-slate-400 text-xs mt-1">{t("tapBookHint")}</p>
                  </div>
                ) : (
                  <div>
                    <div
                      className="w-full h-44 rounded-2xl flex items-end p-4 text-white shadow-inner"
                      style={{ background: `linear-gradient(135deg, ${spineColor(book.id ?? book.title)}dd, ${spineColor(book.id ?? book.title)})` }}
                    >
                      <div>
                        <p className="font-display font-bold text-lg leading-tight drop-shadow">
                          {pickLocale(locale, book.title, book.title_en)}
                        </p>
                      </div>
                    </div>
                    {pickLocale(locale, book.description, book.description_en) && (
                      <p className="text-slate-600 text-sm leading-relaxed mt-4">
                        {pickLocale(locale, book.description, book.description_en)}
                      </p>
                    )}
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      <span className="member-tag">{catLabel(shelf?.label ?? book.category)}</span>
                      {book.tags.map((tag) => (
                        <span className="member-tag" key={tag}>{tag}</span>
                      ))}
                    </div>
                    {bookLink && (
                      <a
                        href={bookLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-5 w-full cta-btn text-white text-sm font-semibold px-4 py-3 rounded-xl tracking-wide flex items-center justify-center"
                      >
                        <i className="fa-solid fa-book-open mr-2"></i>{t("viewMoreDetails")}
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
