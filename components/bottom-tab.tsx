"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { useLocale } from "@/lib/i18n/locale-context";
import { pickLocale } from "@/lib/i18n/pick-locale";
import type { NavItem } from "@/lib/types";

type Props = {
  navItems: NavItem[];
  onToggleBibleSheet: () => void;
};

const ICON_BY_KEY: Record<string, string> = {
  members: "fa-solid fa-users",
  activities: "fa-solid fa-star",
  calendar: "fa-solid fa-calendar-days",
  chat: "fa-regular fa-comment",
  shop: "fa-solid fa-book",
  videos: "fa-solid fa-circle-play",
};

const ICON_BY_HREF: Record<string, string> = {
  "/members": "fa-solid fa-users",
  "/activities": "fa-solid fa-star",
  "/calendar": "fa-solid fa-calendar-days",
  "/chat": "fa-regular fa-comment",
  "/shop": "fa-solid fa-book",
  "/videos": "fa-solid fa-circle-play",
};

function iconFor(item: NavItem) {
  return ICON_BY_KEY[item.key] ?? ICON_BY_HREF[item.href] ?? "fa-solid fa-circle";
}

export default function BottomTab({ navItems, onToggleBibleSheet }: Props) {
  const pathname = usePathname();
  const { t, locale, setLocale } = useLocale();
  const [moreOpen, setMoreOpen] = useState(false);
  const hasVideosNavItem = navItems.some((item) => item.href === "/videos");

  const dbTabs = navItems.slice(0, 3).map((item) => ({
    href: item.href,
    icon: iconFor(item),
    label: pickLocale(locale, item.label, item.label_en ?? ""),
  }));
  const TABS = [
    { href: "/", icon: "fa-solid fa-house", label: t("home") },
    ...dbTabs,
  ];
  const sheetItems = [
    ...navItems.map((item) => ({
      href: item.href,
      icon: iconFor(item),
      label: pickLocale(locale, item.label, item.label_en ?? ""),
    })),
    ...(!hasVideosNavItem
      ? [{ href: "/videos", icon: "fa-solid fa-circle-play", label: locale === "th" ? "วิดีโอ" : "Videos" }]
      : []),
    { href: "/login", icon: "fa-solid fa-right-to-bracket", label: t("login") },
  ];

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const renderTab = (tab: (typeof TABS)[number]) => {
    const active = isActive(tab.href);
    return (
      <Link
        key={tab.href}
        href={tab.href}
        className="tab-item"
        style={{ color: active ? "#157493" : "#9ca3af" }}
      >
        <i className={tab.icon} style={{ fontSize: "1.15rem" }}></i>
        <span style={{ fontSize: "0.6rem", fontWeight: active ? 700 : 500, fontFamily: "inherit" }}>
          {tab.label}
        </span>
        {active && (
          <span style={{
            position: "absolute", top: 0, left: "20%", right: "20%",
            height: 2, background: "#157493", borderRadius: "0 0 2px 2px",
          }} />
        )}
      </Link>
    );
  };

  return (
    <>
      {moreOpen && (
        <div className="fixed inset-0 z-[110] md:hidden">
          <button
            type="button"
            aria-label="ปิดเมนูเพิ่มเติม"
            className="absolute inset-0 h-full w-full"
            style={{ background: "rgba(15,23,42,0.45)" }}
            onClick={() => setMoreOpen(false)}
          />
          <div
            className="absolute inset-x-0 rounded-t-3xl bg-white p-5 shadow-2xl"
            style={{
              bottom: "calc(60px + env(safe-area-inset-bottom))",
              maxHeight: "calc(100dvh - 84px - env(safe-area-inset-bottom))",
            }}
          >
            <div className="mx-auto mb-4 h-1 w-12 rounded-full bg-slate-300" />
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="text-base font-bold text-blue-900">{t("more")}</h2>
              <button
                type="button"
                onClick={() => setMoreOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500"
                aria-label="ปิด"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <div className="mb-4 grid grid-cols-2 gap-2">
              {([
                { code: "th", label: "ไทย" },
                { code: "en", label: "English" },
              ] as const).map((opt) => (
                <button
                  key={opt.code}
                  type="button"
                  onClick={() => setLocale(opt.code)}
                  className="rounded-xl py-2.5 text-sm font-bold"
                  style={{
                    background: locale === opt.code ? "#157493" : "#f1f5f9",
                    color: locale === opt.code ? "#fff" : "#64748b",
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            <div
              className="grid grid-cols-3 gap-3 overflow-y-auto pr-1"
              style={{ maxHeight: "calc(100dvh - 260px - env(safe-area-inset-bottom))" }}
            >
              {sheetItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMoreOpen(false)}
                  className="flex min-h-24 flex-col items-center justify-center gap-2 rounded-2xl border border-blue-100 bg-blue-50/40 p-3 text-center"
                >
                  <i className={item.icon} style={{ color: "#157493", fontSize: "1.15rem" }}></i>
                  <span className="text-xs font-semibold leading-snug text-blue-900">{item.label}</span>
                </Link>
              ))}
              <button
                type="button"
                onClick={() => {
                  setMoreOpen(false);
                  onToggleBibleSheet();
                }}
                className="flex min-h-24 flex-col items-center justify-center gap-2 rounded-2xl border border-blue-100 bg-blue-50/40 p-3 text-center"
              >
                <i className="fa-solid fa-book-open" style={{ color: "#157493", fontSize: "1.15rem" }}></i>
                <span className="text-xs font-semibold leading-snug text-blue-900">{t("bible")}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <div id="bottom-tabbar" style={{ background: "#fff", borderTop: "1px solid #e5e7eb" }}>
        {TABS.slice(0, 2).map(renderTab)}
        <button
          type="button"
          onClick={onToggleBibleSheet}
          className="tab-item tab-bible-fab"
          style={{ color: "#9ca3af", background: "none", border: "none", cursor: "pointer" }}
        >
          <i className="fa-solid fa-book-open" style={{ fontSize: "1.15rem" }}></i>
          <span style={{ fontSize: "0.6rem", fontWeight: 500, fontFamily: "inherit" }}>
            {t("bible")}
          </span>
        </button>
        {TABS.slice(2, 3).map(renderTab)}
        <button
          type="button"
          onClick={() => setMoreOpen(true)}
          className="tab-item"
          style={{ color: "#9ca3af", background: "none", border: "none", cursor: "pointer" }}
        >
          <i className="fa-solid fa-bars" style={{ fontSize: "1.15rem" }}></i>
          <span style={{ fontSize: "0.6rem", fontWeight: 500, fontFamily: "inherit" }}>
            {t("more")}
          </span>
        </button>
      </div>
    </>
  );
}
