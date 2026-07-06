"use client";

import { useLocale } from "@/lib/i18n/locale-context";

export default function LocaleToggle({ className }: { className?: string }) {
  const { locale, setLocale } = useLocale();

  return (
    <div
      className={className}
      style={{ display: "flex", alignItems: "center", borderRadius: 30, border: "1.5px solid #e5e7eb", overflow: "hidden", fontSize: "0.72rem", fontWeight: 700 }}
    >
      {(["th", "en"] as const).map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLocale(l)}
          style={{
            padding: "5px 11px",
            border: "none",
            cursor: "pointer",
            background: locale === l ? "#157493" : "transparent",
            color: locale === l ? "#fff" : "#6b7280",
            transition: "background 0.15s, color 0.15s",
          }}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
