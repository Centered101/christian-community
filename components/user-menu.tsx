"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { useLocale } from "@/lib/i18n/locale-context";
import { clearMemberSession, getMemberSession } from "@/lib/member-session";

export default function UserMenu() {
  const router = useRouter();
  const { t } = useLocale();
  const [memberId, setMemberId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const read = () => setMemberId(getMemberSession());
    read();
    window.addEventListener("member-login", read);
    window.addEventListener("storage", read);
    return () => {
      window.removeEventListener("member-login", read);
      window.removeEventListener("storage", read);
    };
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  const handleLogout = () => {
    clearMemberSession();
    setMemberId(null);
    setOpen(false);
    toast.success(t("loggedOut"));
    router.refresh();
  };

  if (!memberId) {
    return (
      <Link href="/login"
        style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 16px", borderRadius: 30, background: "#157493", color: "#fff", fontWeight: 600, fontSize: "0.82rem", textDecoration: "none" }}>
        <i className="fa-solid fa-right-to-bracket"></i> {t("login")}
      </Link>
    );
  }

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button onClick={() => setOpen(v => !v)}
        style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 12px 5px 5px", borderRadius: 30, border: "1.5px solid #e5e7eb", background: "#fff", cursor: "pointer" }}>
        <div style={{ width: 30, height: 30, borderRadius: "50%", background: "#157493", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: "0.85rem" }}>
          <i className="fa-solid fa-id-card" style={{ fontSize: "0.8rem" }}></i>
        </div>
        <span style={{ fontSize: "0.82rem", fontWeight: 600, color: "#374151", maxWidth: 100, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {memberId}
        </span>
        <i className="fa-solid fa-chevron-down" style={{ fontSize: "0.65rem", color: "#9ca3af", transition: "transform 0.2s", transform: open ? "rotate(180deg)" : "rotate(0)" }}></i>
      </button>

      {open && (
        <div style={{ position: "absolute", right: 0, top: "calc(100% + 8px)", background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, boxShadow: "0 8px 24px rgba(0,0,0,0.1)", minWidth: 180, zIndex: 100, overflow: "hidden" }}>
          <div style={{ padding: "12px 16px", borderBottom: "1px solid #f3f4f6" }}>
            <p style={{ fontSize: "0.82rem", fontWeight: 700, color: "#111827" }}>{t("memberNumber")} {memberId}</p>
            <p style={{ fontSize: "0.72rem", color: "#9ca3af", marginTop: 2 }}>{t("regularMember")}</p>
          </div>
          <div style={{ padding: "6px" }}>
            <button onClick={handleLogout}
              style={{ width: "100%", display: "flex", alignItems: "center", gap: 8, padding: "9px 12px", borderRadius: 8, border: "none", background: "none", cursor: "pointer", color: "#ef4444", fontSize: "0.85rem", fontWeight: 500, transition: "background 0.15s" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#fef2f2")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
              onTouchStart={(e) => (e.currentTarget.style.background = "#fef2f2")}
              onTouchEnd={(e) => (e.currentTarget.style.background = "none")}
            >
              <i className="fa-solid fa-arrow-right-from-bracket w-4 text-center"></i>
              {t("logout")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
