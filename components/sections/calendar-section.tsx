"use client";

import { useMemo, useState } from "react";
import { MONTHS } from "@/lib/content";
import { useLocale } from "@/lib/i18n/locale-context";
import type { EventItem } from "@/lib/types";

const DAY_NAMES = ["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"];

function parts(dateStr: string) {
  return {
    year: Number(dateStr.slice(0, 4)),
    month: Number(dateStr.slice(5, 7)) - 1,
    day: Number(dateStr.slice(8, 10)),
  };
}

export default function CalendarSection({ events }: { events: EventItem[] }) {
  const { t } = useLocale();
  const [now] = useState(() => new Date());
  const [calYear, setCalYear] = useState(() => now.getFullYear());
  const [calMonth, setCalMonth] = useState(() => now.getMonth());
  const [selected, setSelected] = useState<number | null>(null);

  const byDay = useMemo(() => {
    const map = new Map<number, EventItem[]>();
    for (const ev of events) {
      const p = parts(ev.date);
      if (p.year === calYear && p.month === calMonth) {
        const list = map.get(p.day) ?? [];
        list.push(ev);
        map.set(p.day, list);
      }
    }
    return map;
  }, [events, calYear, calMonth]);

  const firstDay = new Date(calYear, calMonth, 1).getDay();
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const upcomingEvents = useMemo(() => {
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
    return events
      .filter((ev) => ev.date >= today)
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(0, 6);
  }, [events, now]);

  const selectedEvents = selected ? (byDay.get(selected) ?? []) : [];

  const legend = useMemo(() => {
    const seen = new Map<string, string>();
    for (const ev of events) {
      if (ev.category && !seen.has(ev.color)) seen.set(ev.color, ev.category);
    }
    return [...seen.entries()].map(([color, label]) => ({ color, label }));
  }, [events]);

  const prevMonth = () => {
    setSelected(null);
    if (calMonth === 0) { setCalMonth(11); setCalYear((y) => y - 1); }
    else setCalMonth((m) => m - 1);
  };
  const nextMonth = () => {
    setSelected(null);
    if (calMonth === 11) { setCalMonth(0); setCalYear((y) => y + 1); }
    else setCalMonth((m) => m + 1);
  };

  const formatDate = (dateStr: string) => {
    const p = parts(dateStr);
    return `${p.day} ${MONTHS[p.month]} ${p.year}`;
  };

  return (
    <div className="pt-6 md:pt-20" style={{ paddingBottom: 64, minHeight: "100vh", background: "#f8fafc" }}>
      <style>{`
        .cal-cell { border-radius: 10px; cursor: pointer; transition: background 0.15s; min-height: 52px; }
        .cal-cell:hover { background: #e0f2f7; }
        .cal-cell.has-event { background: #f0fafb; }
        .cal-cell.selected { background: #157493 !important; }
        .cal-cell.selected .cal-num { color: #fff !important; }
        .cal-cell.today .cal-num { background: #157493; color: #fff; border-radius: 50%; width: 26px; height: 26px; display: flex; align-items: center; justify-content: center; margin: 0 auto; }
        .cal-cell.sunday .cal-num { color: #ef4444; }
        .nav-btn { width: 36px; height: 36px; border-radius: 50%; border: 1.5px solid #e5e7eb; background: #fff; cursor: pointer; display: flex; align-items: center; justify-content: center; color: #374151; font-size: 1.1rem; transition: all 0.15s; }
        .nav-btn:hover { background: #157493; color: #fff; border-color: #157493; }
        .upcoming-item { display: flex; align-items: center; gap: 12px; padding: 10px 14px; border-radius: 12px; transition: background 0.15s; }
        .upcoming-item:hover { background: #f0fafb; }
      `}</style>

      <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 16px" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 36 }} data-aos="fade-up">
          <div style={{ width: 44, height: 3, background: "#157493", borderRadius: 99, margin: "0 auto 16px" }} />
          <h2 style={{ fontSize: "clamp(1.5rem,4vw,2rem)", fontWeight: 800, color: "#0f172a", marginBottom: 6 }}>
            <i className="fa-solid fa-calendar-days" style={{ color: "#157493", marginRight: 10 }}></i>
            {t("calendarPageTitle")}
          </h2>
          <p style={{ color: "#64748b", fontSize: "0.9rem" }}>{t("calendarPageSub")}</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 20, alignItems: "start" }} className="cal-layout">
          <style>{`@media(max-width:700px){.cal-layout{grid-template-columns:1fr!important}}`}</style>

          {/* Calendar card */}
          <div style={{ background: "#fff", borderRadius: 20, boxShadow: "0 2px 16px rgba(0,0,0,0.07)", overflow: "hidden" }} data-aos="fade-right">

            {/* Month nav */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px", borderBottom: "1px solid #f1f5f9" }}>
              <button className="nav-btn" onClick={prevMonth}><i className="fa-solid fa-chevron-left" style={{ fontSize: "0.75rem" }}></i></button>
              <div style={{ textAlign: "center" }}>
                <p style={{ fontWeight: 800, fontSize: "1.1rem", color: "#0f172a" }}>{MONTHS[calMonth]}</p>
                <p style={{ fontSize: "0.75rem", color: "#94a3b8", marginTop: 1 }}>{calYear}</p>
              </div>
              <button className="nav-btn" onClick={nextMonth}><i className="fa-solid fa-chevron-right" style={{ fontSize: "0.75rem" }}></i></button>
            </div>

            <div style={{ padding: "16px 16px 20px" }}>
              {/* Day headers */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 4, marginBottom: 6 }}>
                {DAY_NAMES.map((d, i) => (
                  <div key={d} style={{ textAlign: "center", fontSize: "0.72rem", fontWeight: 700, color: i === 0 ? "#ef4444" : "#94a3b8", padding: "4px 0" }}>{d}</div>
                ))}
              </div>

              {/* Day cells */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 4 }}>
                {cells.map((d, i) => {
                  if (d === null) return <div key={`e${i}`} />;
                  const isToday = d === now.getDate() && calMonth === now.getMonth() && calYear === now.getFullYear();
                  const isSun = i % 7 === 0;
                  const isSel = d === selected;
                  const evs = byDay.get(d) ?? [];
                  return (
                    <div
                      key={d}
                      onClick={() => setSelected(isSel ? null : d)}
                      className={`cal-cell${isSun ? " sunday" : ""}${isToday ? " today" : ""}${evs.length > 0 ? " has-event" : ""}${isSel ? " selected" : ""}`}
                      style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-start", padding: "6px 2px 4px" }}
                    >
                      <span className="cal-num" style={{ fontSize: "0.78rem", fontWeight: isToday ? 700 : 500, color: isSun && !isSel ? "#ef4444" : "#374151", lineHeight: 1 }}>{d}</span>
                      <div style={{ display: "flex", gap: 2, marginTop: 4, flexWrap: "wrap", justifyContent: "center" }}>
                        {evs.slice(0, 3).map((ev, j) => (
                          <span key={j} style={{ width: 5, height: 5, borderRadius: "50%", background: ev.color, display: "block" }} />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Selected day events */}
            {selected && (
              <div style={{ borderTop: "1px solid #f1f5f9", padding: "14px 20px" }}>
                <p style={{ fontSize: "0.8rem", fontWeight: 700, color: "#157493", marginBottom: 8 }}>
                  <i className="fa-solid fa-calendar-check mr-2"></i>
                  {selected} {MONTHS[calMonth]} {calYear}
                </p>
                {selectedEvents.length === 0 ? (
                  <p style={{ fontSize: "0.8rem", color: "#94a3b8" }}>{t("noActivitiesToday")}</p>
                ) : selectedEvents.map((ev, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "6px 0" }}>
                    <span style={{ width: 10, height: 10, borderRadius: "50%", background: ev.color, flexShrink: 0, marginTop: 5 }} />
                    <div>
                      <p style={{ fontSize: "0.85rem", color: "#374151", fontWeight: 500 }}>{ev.title}</p>
                      {ev.description && (
                        <p style={{ fontSize: "0.78rem", color: "#94a3b8", marginTop: 2, lineHeight: 1.5 }}>{ev.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Upcoming events sidebar */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }} data-aos="fade-left" data-aos-delay="150">

            {/* Legend */}
            {legend.length > 0 && (
              <div style={{ background: "#fff", borderRadius: 16, padding: "16px 18px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
                <p style={{ fontSize: "0.78rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>{t("symbolsLabel")}</p>
                {legend.map((l) => (
                  <div key={l.color} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    <span style={{ width: 10, height: 10, borderRadius: "50%", background: l.color, flexShrink: 0 }} />
                    <span style={{ fontSize: "0.8rem", color: "#374151" }}>{l.label}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Upcoming */}
            <div style={{ background: "#fff", borderRadius: 16, padding: "16px 18px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
              <p style={{ fontSize: "0.78rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>
                <i className="fa-solid fa-clock mr-1.5" style={{ color: "#157493" }}></i>
                {t("calendarUpcoming")}
              </p>
              {upcomingEvents.length === 0 ? (
                <div style={{ textAlign: "center", padding: "24px 0" }}>
                  <i className="fa-regular fa-calendar" style={{ fontSize: "1.5rem", color: "#cbd5e1", display: "block", marginBottom: 8 }}></i>
                  <p style={{ color: "#94a3b8", fontSize: "0.82rem" }}>{t("noUpcoming")}</p>
                </div>
              ) : upcomingEvents.map((ev, i) => {
                const p = parts(ev.date);
                return (
                  <div key={i} className="upcoming-item">
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: ev.color, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <span style={{ color: "#fff", fontSize: "0.7rem", fontWeight: 700, lineHeight: 1 }}>{MONTHS[p.month].slice(0, 3)}</span>
                      <span style={{ color: "#fff", fontSize: "1rem", fontWeight: 800, lineHeight: 1.1 }}>{p.day}</span>
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <p style={{ fontSize: "0.82rem", fontWeight: 600, color: "#1e293b", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{ev.title}</p>
                      <p style={{ fontSize: "0.72rem", color: "#94a3b8", marginTop: 2 }}>{formatDate(ev.date)}</p>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
