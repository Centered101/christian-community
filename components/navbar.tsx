"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import UserMenu from "./user-menu";
import LocaleToggle from "./locale-toggle";
import { useLocale } from "@/lib/i18n/locale-context";
import type { TranslationKey } from "@/lib/i18n/translations";
import type { NavItem, ScriptureLink } from "@/lib/types";

type Props = {
  scrolled: boolean;
  bibleOpen: boolean;
  onToggleBible: () => void;
  scriptureLinks: ScriptureLink[];
  siteName: string;
  siteSubtitle: string;
  navItems: NavItem[];
};

// nav_items.key เป็นชุดหน้าคงที่ 5 หน้า — แปลได้โดยไม่ต้องเพิ่มคอลัมน์ในฐานข้อมูล
// คีย์ที่ไม่อยู่ในนี้ (ถ้ามีเพิ่มในอนาคต) จะ fallback ไปใช้ label ที่แอดมินกรอกไว้แทน
const NAV_KEY_TRANSLATION: Record<string, TranslationKey> = {
  members: "footerMembers",
  activities: "footerActivities",
  calendar: "footerCalendar",
  chat: "chatLabel",
  shop: "footerResources",
};

export default function Navbar({ scrolled, bibleOpen, onToggleBible, scriptureLinks, siteName, siteSubtitle, navItems }: Props) {
  const pathname = usePathname();
  const { t } = useLocale();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const navLabel = (item: NavItem) => {
    const key = NAV_KEY_TRANSLATION[item.key];
    return key ? t(key) : item.label;
  };

  return (
    <nav
      id="navbar"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: scrolled ? "#fff" : "rgba(255,255,255,0.97)",
        borderBottom: "1px solid #e5e7eb",
        boxShadow: scrolled ? "0 1px 8px rgba(0,0,0,0.08)" : "none",
        transition: "box-shadow 0.3s",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        {/* Logo */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none" }}>
          <img src="/favicon.webp" alt="" style={{ width: 44, height: 44, borderRadius: 8, objectFit: "cover" }} />
          <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#157493", lineHeight: 1.3, maxWidth: 180, display: "block" }}>
            {siteName}<br />
            <span style={{ fontWeight: 400, color: "#6b7280" }}>{siteSubtitle}</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              style={{
                padding: "6px 14px",
                borderRadius: 6,
                fontSize: "0.85rem",
                fontWeight: isActive(l.href) ? 700 : 500,
                color: isActive(l.href) ? "#157493" : "#374151",
                textDecoration: "none",
                background: isActive(l.href) ? "#e8f0fe" : "transparent",
                transition: "background 0.15s, color 0.15s",
              }}
            >
              {navLabel(l)}
            </Link>
          ))}

          {/* Bible dropdown */}
          <div className={`bible-nav-wrapper${bibleOpen ? " open" : ""}`} style={{ position: "relative" }}>
            <button
              onClick={(e) => { e.stopPropagation(); onToggleBible(); }}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "6px 14px", borderRadius: 6,
                fontSize: "0.85rem", fontWeight: 500,
                color: "#374151", background: "transparent", border: "none", cursor: "pointer",
                transition: "background 0.15s",
              }}
            >
              {t("bible")}
              <svg className="bible-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} style={{ width: 12, height: 12 }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div className="bible-dropdown" style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12 }}>
              {scriptureLinks.map((l) => (
                <a key={l.id} href={l.url} target="_blank" rel="noopener noreferrer" className="mobile-sub-btn">
                  {l.icon && <img className="mobile-sub-img" src={l.icon} alt="" />}
                  <div>
                    <div style={{ color: "#157493", fontSize: "0.8rem", fontWeight: 600 }}>{l.label}</div>
                    <div style={{ color: "#6b7280", fontSize: "0.72rem" }}>{l.sub}</div>
                  </div>
                </a>
              ))}
              <div style={{ height: 1, background: "#f3f4f6", margin: "6px 4px" }} />
              <Link href="/bible" className="mobile-sub-btn" style={{ color: "#157493", fontSize: "0.8rem" }}>
                <i className="fa-solid fa-arrow-right mr-2"></i>{t("moreResources")}
              </Link>
            </div>
          </div>

          <button
            onClick={() => window.dispatchEvent(new CustomEvent("open-video"))}
            style={{
              marginLeft: 8,
              padding: "7px 18px", borderRadius: 6,
              background: "#157493", color: "#fff",
              border: "none", cursor: "pointer",
              fontSize: "0.82rem", fontWeight: 600,
              transition: "background 0.15s",
            }}
          >
            {t("watchVideo")}
          </button>
          <LocaleToggle className="ml-3" />
          <div style={{ marginLeft: 12 }}>
            <UserMenu />
          </div>
        </div>

        {/* Mobile hamburger */}
        <button
          className="flex md:hidden items-center justify-center"
          onClick={() => setMobileOpen((v) => !v)}
          style={{ width: 40, height: 40, background: "none", border: "none", cursor: "pointer", color: "#374151" }}
        >
          <i className={`fa-solid ${mobileOpen ? "fa-xmark" : "fa-bars"} text-xl`}></i>
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          style={{ background: "#fff", borderTop: "1px solid #f3f4f6", padding: "12px 24px 20px", maxHeight: "calc(100vh - 64px)", overflowY: "auto" }}
          className="md:hidden"
        >
          {[
            { href: "/", label: t("home") },
            ...navItems.map((n) => ({ href: n.href, label: navLabel(n) })),
            { href: "/bible", label: t("bible") },
          ].map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setMobileOpen(false)}
              className="active:bg-gray-50"
              style={{
                display: "block", padding: "12px 4px",
                borderBottom: "1px solid #f3f4f6",
                fontSize: "0.9rem", fontWeight: isActive(l.href) ? 700 : 500,
                color: isActive(l.href) ? "#157493" : "#374151",
                textDecoration: "none",
              }}
            >
              {l.label}
            </Link>
          ))}
          <button
            onClick={() => { setMobileOpen(false); window.dispatchEvent(new CustomEvent("open-video")); }}
            className="active:scale-[0.98]"
            style={{ marginTop: 12, width: "100%", padding: "12px", background: "#157493", color: "#fff", border: "none", borderRadius: 8, fontWeight: 600, cursor: "pointer", transition: "transform 0.1s" }}
          >
            {t("watchVideo")}
          </button>
          <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid #f3f4f6", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
            <UserMenu />
            <LocaleToggle />
          </div>
        </div>
      )}
    </nav>
  );
}

