"use client";

import { useLocale } from "@/lib/i18n/locale-context";
import type { ScriptureLink } from "@/lib/types";

type Props = {
  open: boolean;
  onMore: () => void;
  scriptureLinks: ScriptureLink[];
};

export default function BibleSheet({ open, onMore, scriptureLinks }: Props) {
  const { t } = useLocale();

  return (
    <div
      id="bible-sheet"
      className={open ? "open" : ""}
      style={{ background: "#fff", borderTop: "1px solid #e5e7eb", borderRadius: "20px 20px 0 0" }}
    >
      <div className="sheet-handle" style={{ background: "#d1d5db" }} />
      <p style={{ textAlign: "center", fontSize: "0.7rem", color: "#6b7280", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 12 }}>
        {t("bibleResources")}
      </p>

      {scriptureLinks.map((l) => (
        <a key={l.id} href={l.url} target="_blank" rel="noopener noreferrer" className="mobile-sub-btn">
          {l.icon && <img className="mobile-sub-img" src={l.icon} alt="" />}
          <div>
            <div style={{ color: "#157493", fontSize: "0.88rem", fontWeight: 700 }}>{l.label}</div>
            <div style={{ color: "#6b7280", fontSize: "0.75rem", marginTop: 2 }}>{l.sub}</div>
          </div>
        </a>
      ))}

      <div style={{ height: 1, background: "#f3f4f6", margin: "8px 0" }} />

      <button className="mobile-sub-btn" onClick={onMore} style={{ color: "#157493", fontWeight: 600, fontSize: "0.88rem" }}>
        <i className="fa-solid fa-arrow-right" style={{ marginRight: 8 }}></i>
        {t("moreResources")}
      </button>

      <button onClick={() => window.dispatchEvent(new CustomEvent("open-video"))} className="mobile-sub-btn" style={{ color: "#374151", fontSize: "0.88rem" }}>
        <i className="fa-solid fa-circle-play" style={{ marginRight: 8, color: "#157493" }}></i>
        {t("introVideo")}
      </button>
    </div>
  );
}
