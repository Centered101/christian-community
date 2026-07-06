"use client";

import { useState } from "react";

const ICONS = [
  "fa-solid fa-church", "fa-solid fa-cross", "fa-solid fa-book-bible", "fa-solid fa-book-open",
  "fa-solid fa-book", "fa-solid fa-hands-praying", "fa-solid fa-hands-holding-heart", "fa-solid fa-hand-holding-heart",
  "fa-solid fa-heart", "fa-solid fa-dove", "fa-solid fa-star", "fa-solid fa-star-of-david",
  "fa-solid fa-building-columns", "fa-solid fa-door-open", "fa-solid fa-quote-left", "fa-solid fa-bookmark",
  "fa-solid fa-users", "fa-solid fa-user", "fa-solid fa-people-group", "fa-solid fa-house",
  "fa-solid fa-comments", "fa-solid fa-comment-dots", "fa-solid fa-circle-question", "fa-solid fa-circle-info",
  "fa-solid fa-calendar-days", "fa-solid fa-calendar-check", "fa-solid fa-clock", "fa-solid fa-map-location-dot",
  "fa-solid fa-location-dot", "fa-solid fa-globe", "fa-solid fa-magnifying-glass", "fa-solid fa-compass",
  "fa-solid fa-graduation-cap", "fa-solid fa-video", "fa-solid fa-circle-play", "fa-solid fa-image",
  "fa-solid fa-images", "fa-solid fa-envelope", "fa-solid fa-phone", "fa-solid fa-gift",
  "fa-solid fa-chart-simple", "fa-solid fa-list-check", "fa-solid fa-gear", "fa-solid fa-bolt",
  "fa-solid fa-shield-halved", "fa-solid fa-arrow-right", "fa-solid fa-plus-circle", "fa-solid fa-bell",
];

type Props = {
  value: string;
  onChange: (v: string) => void;
  label?: string;
};

export default function IconPicker({ value, onChange, label = "ไอคอน" }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <label className="block text-gray-600 text-xs font-semibold mb-1.5 uppercase tracking-wider">
        {label}
      </label>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: "rgba(21,116,147,0.1)", border: "1.5px solid #d1d5db" }}
          title="เลือกไอคอน"
        >
          <i className={value || "fa-solid fa-icons"} style={{ color: "#157493" }}></i>
        </button>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-4 py-3 rounded-xl text-sm outline-none transition-all"
          style={{ background: "#fff", border: "1.5px solid #d1d5db", color: "#111827" }}
          placeholder="เช่น fa-solid fa-star"
        />
      </div>

      {open && (
        <div
          className="mt-2 p-3 rounded-xl grid grid-cols-8 sm:grid-cols-10 gap-2 max-h-56 overflow-y-auto"
          style={{ background: "#fff", border: "1.5px solid #d1d5db" }}
        >
          {ICONS.map((ic) => (
            <button
              key={ic}
              type="button"
              onClick={() => { onChange(ic); setOpen(false); }}
              className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors"
              style={{
                background: ic === value ? "rgba(21,116,147,0.15)" : "transparent",
                color: ic === value ? "#157493" : "#6b7280",
              }}
              title={ic}
            >
              <i className={ic}></i>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
