import Link from "next/link";
import { getChatMessages, getEvents, getMembers, getResources, getScriptureLinks, getVideos } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  let memberCount = 0;
  let eventCount = 0;
  let chatCount = 0;
  let resourceCount = 0;
  let videoCount = 0;
  let scriptureLinkCount = 0;
  let recentMembers: Awaited<ReturnType<typeof getMembers>> = [];
  let upcomingEvents: Awaited<ReturnType<typeof getEvents>> = [];

  try {
    const [members, events, chats, resources, videos, scriptureLinks] = await Promise.all([
      getMembers(), getEvents(), getChatMessages(999), getResources(), getVideos(), getScriptureLinks(),
    ]);
    memberCount = members.length;
    eventCount = events.length;
    chatCount = chats.length;
    resourceCount = resources.length;
    videoCount = videos.length;
    scriptureLinkCount = scriptureLinks.length;
    recentMembers = members.slice(0, 5);
    const today = new Date().toISOString().split("T")[0];
    upcomingEvents = events.filter((e) => e.date >= today).slice(0, 5);
  } catch {}

  const STATS = [
    { label: "สมาชิก", value: memberCount, icon: "fa-solid fa-users", color: "#157493", bg: "#e0f2f7", href: "/admin/members" },
    { label: "ปฏิทิน", value: eventCount, icon: "fa-solid fa-calendar-days", color: "#7c3aed", bg: "#ede9fe", href: "/admin/events" },
    { label: "กิจกรรมที่จะมา", value: upcomingEvents.length, icon: "fa-solid fa-bell", color: "#d97706", bg: "#fef3c7", href: "/admin/events" },
    { label: "ข้อความแชต", value: chatCount, icon: "fa-solid fa-comments", color: "#0891b2", bg: "#e0f2fe", href: "/admin/chat" },
    { label: "คลังค้นคว้า", value: resourceCount, icon: "fa-solid fa-book-open", color: "#059669", bg: "#d1fae5", href: "/admin/resources" },
    { label: "วิดีโอ", value: videoCount, icon: "fa-solid fa-video", color: "#be185d", bg: "#fce7f3", href: "/admin/videos" },
    { label: "ลิงก์พระคัมภีร์", value: scriptureLinkCount, icon: "fa-solid fa-book-bible", color: "#0f766e", bg: "#ccfbf1", href: "/admin/scripture-links" },
  ];

  const QUICK_ACTIONS = [
    { href: "/admin/members/new", label: "เพิ่มสมาชิก", icon: "fa-solid fa-user-plus", color: "#157493", bg: "#e0f2f7", border: "#157493" },
    { href: "/admin/activities/new", label: "เพิ่มกิจกรรม", icon: "fa-solid fa-plus-circle", color: "#d97706", bg: "#fef3c7", border: "#d97706" },
    { href: "/admin/events/new", label: "เพิ่มปฏิทิน", icon: "fa-solid fa-calendar-plus", color: "#7c3aed", bg: "#ede9fe", border: "#7c3aed" },
    { href: "/admin/chat", label: "จัดการแชต", icon: "fa-solid fa-comments", color: "#0891b2", bg: "#e0f2fe", border: "#0891b2" },
    { href: "/admin/resources/new", label: "เพิ่มคลัง", icon: "fa-solid fa-book-medical", color: "#059669", bg: "#d1fae5", border: "#059669" },
    { href: "/admin/videos/new", label: "เพิ่มวิดีโอ", icon: "fa-solid fa-video", color: "#be185d", bg: "#fce7f3", border: "#be185d" },
  ];

  return (
    <div className="p-4 sm:p-8" style={{ minHeight: "100vh" }}>
      <style>{`
        .stat-card { transition: box-shadow 0.2s, transform 0.2s; }
        .qa-link { transition: opacity 0.15s, transform 0.15s; }
        .edit-link { color: #d1d5db; transition: color 0.15s; }
        @media (hover: hover) and (pointer: fine) {
          .stat-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.1); transform: translateY(-1px); }
          .qa-link:hover { opacity: 0.85; }
          .edit-link:hover { color: #157493; }
          .edit-link-purple:hover { color: #7c3aed; }
        }
        .stat-card:active { transform: scale(0.98); }
        .qa-link:active { transform: scale(0.96); opacity: 0.85; }
        .edit-link:active { color: #157493; }
        .edit-link-purple:active { color: #7c3aed; }
      `}</style>

      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#111827", marginBottom: 4 }}>
          <i className="fa-solid fa-gauge mr-2" style={{ color: "#157493" }}></i>แดชบอร์ด
        </h1>
        <p style={{ color: "#6b7280", fontSize: "0.85rem" }}>ภาพรวมชุมชน ลพบุรี วอร์ด</p>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 16, marginBottom: 28 }}>
        {STATS.map((s) => (
          <Link key={s.label} href={s.href} style={{ textDecoration: "none" }}>
            <div className="stat-card" style={{ background: "#fff", borderRadius: 14, padding: "18px 16px", border: "1px solid #e5e7eb", display: "flex", alignItems: "flex-start", gap: 12, cursor: "pointer" }}>
              <div style={{ width: 42, height: 42, borderRadius: 11, background: s.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <i className={s.icon} style={{ color: s.color, fontSize: "1rem" }}></i>
              </div>
              <div>
                <p style={{ color: "#6b7280", fontSize: "0.75rem", marginBottom: 4 }}>{s.label}</p>
                <p style={{ color: "#111827", fontSize: "1.7rem", fontWeight: 800, lineHeight: 1 }}>{s.value}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div style={{ marginBottom: 28 }}>
        <p style={{ fontSize: "0.78rem", fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>
          <i className="fa-solid fa-bolt" style={{ marginRight: 6 }}></i>การดำเนินการด่วน
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          {QUICK_ACTIONS.map((a) => (
            <Link key={a.href} href={a.href} className="qa-link"
              style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 16px", borderRadius: 10, background: a.bg, color: a.color, fontWeight: 600, fontSize: "0.83rem", textDecoration: "none", border: `1px solid ${a.border}30`, transition: "opacity 0.15s" }}>
              <i className={a.icon} style={{ fontSize: "0.8rem" }}></i>
              {a.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Tables */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
        {/* Recent Members */}
        {recentMembers.length > 0 && (
          <div style={{ background: "#fff", borderRadius: 14, overflow: "hidden", border: "1px solid #e5e7eb" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 18px", borderBottom: "1px solid #f3f4f6" }}>
              <h2 style={{ fontSize: "0.88rem", fontWeight: 700, color: "#111827" }}>
                <i className="fa-solid fa-users mr-2" style={{ color: "#157493" }}></i>สมาชิกล่าสุด
              </h2>
              <Link href="/admin/members" style={{ color: "#157493", fontSize: "0.78rem", fontWeight: 600, textDecoration: "none" }}>ดูทั้งหมด →</Link>
            </div>
            <div>
              {recentMembers.map((m) => (
                <div key={m.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 18px", borderBottom: "1px solid #f9fafb" }}>
                  <img src={m.avatar || "/favicon.webp"} style={{ width: 34, height: 34, borderRadius: "50%", objectFit: "cover", border: "2px solid #e0f2f7" }} alt="" />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "#111827", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.name}</p>
                    <p style={{ fontSize: "0.75rem", color: "#9ca3af", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.role}</p>
                  </div>
                  <Link href={`/admin/members/${m.id}`} className="edit-link" style={{ fontSize: "0.8rem", textDecoration: "none", transition: "color 0.15s" }}>
                    <i className="fa-solid fa-pen-to-square"></i>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upcoming Events */}
        <div style={{ background: "#fff", borderRadius: 14, overflow: "hidden", border: "1px solid #e5e7eb" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 18px", borderBottom: "1px solid #f3f4f6" }}>
            <h2 style={{ fontSize: "0.88rem", fontWeight: 700, color: "#111827" }}>
              <i className="fa-solid fa-calendar-days mr-2" style={{ color: "#7c3aed" }}></i>กิจกรรมที่กำลังจะมา
            </h2>
            <Link href="/admin/events" style={{ color: "#7c3aed", fontSize: "0.78rem", fontWeight: 600, textDecoration: "none" }}>ดูทั้งหมด →</Link>
          </div>
          <div>
            {upcomingEvents.length === 0 ? (
              <p style={{ color: "#9ca3af", fontSize: "0.85rem", padding: "24px 18px", textAlign: "center" }}>ยังไม่มีกิจกรรมที่กำลังจะมา</p>
            ) : upcomingEvents.map((ev) => (
              <div key={ev.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 18px", borderBottom: "1px solid #f9fafb" }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: ev.color, flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "#111827", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{ev.title}</p>
                  <p style={{ fontSize: "0.75rem", color: "#9ca3af" }}>
                    <i className="fa-regular fa-calendar mr-1"></i>{ev.date}
                  </p>
                </div>
                <Link href={`/admin/events/${ev.id}`} className="edit-link edit-link-purple" style={{ fontSize: "0.8rem", textDecoration: "none", transition: "color 0.15s" }}>
                  <i className="fa-solid fa-pen-to-square"></i>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
