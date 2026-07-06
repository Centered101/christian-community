"use client";

import { useMemo, useState } from "react";
import { useLocale } from "@/lib/i18n/locale-context";
import { pickLocale } from "@/lib/i18n/pick-locale";
import type { Member } from "@/lib/types";

type Props = {
  members: Member[];
  onOpenMember: (m: Member) => void;
};

export default function MembersSection({ members, onOpenMember }: Props) {
  const { t, locale } = useLocale();
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return members;
    return members.filter(
      (m) => m.name.toLowerCase().includes(q) || m.role.toLowerCase().includes(q)
    );
  }, [members, query]);

  return (
    <div className="pt-6 md:pt-24 pb-16 min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-10" data-aos="fade-up">
          <div className="divider"></div>
          <h2 className="text-3xl sm:text-4xl font-bold text-blue-900">{t("membersPageTitle")}</h2>
          <p className="text-slate-500 mt-3">{t("wardName")}</p>
        </div>

        {members.length === 0 ? (
          <div className="text-center py-20" data-aos="zoom-in">
            <div className="w-20 h-20 mx-auto rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center mb-5">
              <i className="fa-solid fa-users text-3xl text-blue-300"></i>
            </div>
            <p className="text-slate-600 font-semibold text-lg">{t("noMembersYet")}</p>
            <p className="text-slate-400 text-sm mt-2 max-w-xs mx-auto">
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
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                {filtered.map((m, i) => (
                  <div key={m.id ?? i} data-aos="fade-up" data-aos-delay={String((i % 4) * 80)} className="h-full">
                  <div
                    className="bg-white rounded-2xl shadow-md overflow-hidden card-hover text-center p-6 relative group cursor-pointer h-full"
                    onClick={() => onOpenMember(m)}
                  >
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full font-semibold">
                        <i className="fa-solid fa-circle-info mr-1"></i>{t("info")}
                      </span>
                    </div>
                    {m.avatar ? (
                      <img
                        src={m.avatar}
                        className="w-20 h-20 rounded-full mx-auto mb-4 border-4 border-blue-100 object-cover"
                        alt=""
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-full mx-auto mb-4 border-4 border-blue-100 bg-blue-50 flex items-center justify-center">
                        <i className="fa-solid fa-user text-blue-300 text-2xl"></i>
                      </div>
                    )}
                    <h3 className="font-display text-blue-900 text-sm font-semibold">{m.name}</h3>
                    <p className="text-blue-400 text-xs mt-1">
                      <i className="fa-solid fa-cross mr-1 opacity-60"></i>
                      {pickLocale(locale, m.role, m.role_en)}
                    </p>
                    <div className="mt-3 flex flex-wrap justify-center gap-1">
                      {m.tags.map((tag) => (
                        <span className="member-tag" key={tag}>{tag}</span>
                      ))}
                    </div>
                  </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
