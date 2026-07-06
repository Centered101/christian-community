"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale } from "@/lib/i18n/locale-context";

type Props = {
  onToggleBibleSheet: () => void;
};

export default function BottomTab({ onToggleBibleSheet }: Props) {
  const pathname = usePathname();
  const { t } = useLocale();

  const TABS = [
    { href: "/", icon: "fa-solid fa-house", label: t("home") },
    { href: "/calendar", icon: "fa-solid fa-calendar-days", label: t("footerCalendar") },
    { href: "/activities", icon: "fa-solid fa-star", label: t("footerActivities") },
    { href: "/members", icon: "fa-solid fa-users", label: t("footerMembers") },
    { href: "/other", icon: "fa-solid fa-bars", label: t("more") },
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
    <div id="bottom-tabbar" style={{ background: "#fff", borderTop: "1px solid #e5e7eb" }}>
      {TABS.slice(0, 2).map(renderTab)}
      <button
        type="button"
        onClick={onToggleBibleSheet}
        className="tab-item tab-bible-fab"
        style={{ color: "#9ca3af", background: "none", border: "none", cursor: "pointer" }}
      >
        <i className="fa-solid fa-book-bible" style={{ fontSize: "1.15rem" }}></i>
        <span style={{ fontSize: "0.6rem", fontWeight: 500, fontFamily: "inherit" }}>
          {t("bible")}
        </span>
      </button>
      {TABS.slice(2).map(renderTab)}
    </div>
  );
}
