"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import { useUploadLock } from "@/lib/admin-upload-lock";

const MENU_SECTIONS = [
  {
    title: "ภาพรวม",
    items: [
      { href: "/admin", icon: "fa-solid fa-gauge", label: "แดชบอร์ด" },
    ],
  },
  {
    title: "เนื้อหาเว็บไซต์",
    items: [
      { href: "/admin/members", icon: "fa-solid fa-users", label: "สมาชิก" },
      { href: "/admin/activities", icon: "fa-solid fa-star", label: "กิจกรรม" },
      { href: "/admin/events", icon: "fa-solid fa-calendar-days", label: "ปฏิทิน" },
      { href: "/admin/chat", icon: "fa-solid fa-comments", label: "แชต" },
      { href: "/admin/resources", icon: "fa-solid fa-book-open", label: "คลังค้นคว้า" },
      { href: "/admin/scripture-links", icon: "fa-solid fa-book-open", label: "ลิงก์พระคัมภีร์" },
      { href: "/admin/videos", icon: "fa-solid fa-video", label: "วิดีโอ" },
    ],
  },
  {
    title: "หน้าแรก",
    items: [
      { href: "/admin/home-topics", icon: "fa-solid fa-list-check", label: "หัวข้อความเชื่อ" },
      { href: "/admin/spiritual-thoughts", icon: "fa-solid fa-book-open", label: "ข้อคิดทางวิญญาณ" },
      { href: "/admin/find-church", icon: "fa-solid fa-map-location-dot", label: "ส่วนค้นหาโบสถ์" },
      { href: "/admin/home-invite", icon: "fa-solid fa-hand-holding-heart", label: "คำเชิญท้ายหน้าแรก" },
      { href: "/admin/faqs", icon: "fa-solid fa-circle-question", label: "คำถามที่พบบ่อย" },
    ],
  },
  {
    title: "ระบบ",
    items: [
      { href: "/admin/nav-items", icon: "fa-solid fa-bars", label: "เมนูนำทาง" },
      { href: "/admin/access-logs", icon: "fa-solid fa-clock-rotate-left", label: "บันทึกการเข้าใช้งาน" },
      { href: "/admin/settings", icon: "fa-solid fa-gear", label: "ตั้งค่า" },
    ],
  },
];

export default function AdminSidebar({ adminName, siteSubtitle }: { adminName?: string; siteSubtitle?: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { isUploading } = useUploadLock();

  if (pathname === "/admin/login") return null;

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  const guardNav = (e: React.MouseEvent) => {
    if (!isUploading) return;
    e.preventDefault();
    toast.error("กรุณายกเลิกหรือรอให้อัปโหลดเสร็จก่อนออกจากหน้านี้");
  };

  const handleLogout = async () => {
    if (isUploading) {
      toast.error("กรุณายกเลิกหรือรอให้อัปโหลดเสร็จก่อนออกจากระบบ");
      return;
    }
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <>
      {/* Mobile top bar */}
      <div
        className="md:hidden flex items-center justify-between px-4 h-14 shrink-0"
        style={{ background: "linear-gradient(180deg, #0f6280 0%, #157493 100%)" }}
      >
        <Link href="/admin" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg overflow-hidden">
            <img src="/favicon.webp" className="w-full h-full object-cover" alt="" />
          </div>
          <p className="text-white text-xs font-bold tracking-wider">แผงควบคุมผู้ดูแลระบบ</p>
        </Link>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="w-9 h-9 flex items-center justify-center rounded-lg active:scale-90 transition-transform"
          style={{ color: "#fff" }}
          aria-label="เปิดเมนู"
        >
          <i className="fa-solid fa-bars text-lg"></i>
        </button>
      </div>

      {/* Backdrop (mobile only, shown when drawer open) */}
      {open && (
        <div
          className="md:hidden fixed inset-0 z-40"
          style={{ background: "rgba(0,0,0,0.45)" }}
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`w-60 shrink-0 h-screen flex flex-col fixed inset-y-0 left-0 z-50 transition-transform duration-300 ease-out md:static md:z-auto md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ background: "linear-gradient(180deg, #0f6280 0%, #157493 100%)", borderRight: "none" }}
      >
        {/* Logo (desktop only — mobile has its own top bar above) */}
        <div className="hidden md:block px-6 py-5 border-b" style={{ borderColor: "rgba(255,255,255,0.12)" }}>
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl overflow-hidden" style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.2)" }}>
              <img src="/favicon.webp" className="w-full h-full object-cover" alt="" />
            </div>
            <div>
              <p className="text-white text-xs font-bold tracking-wider">แผงควบคุมผู้ดูแลระบบ</p>
              {siteSubtitle && (
                <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.68rem" }}>{siteSubtitle}</p>
              )}
            </div>
          </Link>
        </div>

        {/* Close button (mobile only) */}
        <div className="md:hidden flex justify-end px-3 pt-3">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="w-9 h-9 flex items-center justify-center rounded-lg active:scale-90 transition-transform"
            style={{ color: "rgba(255,255,255,0.7)" }}
            aria-label="ปิดเมนู"
          >
            <i className="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 min-h-0 overflow-y-auto px-3 py-4">
          {MENU_SECTIONS.map((section, sectionIndex) => (
            <div
              key={section.title}
              className={sectionIndex === 0 ? "" : "mt-5 border-t pt-4"}
              style={sectionIndex === 0 ? undefined : { borderColor: "rgba(255,255,255,0.12)" }}
            >
              <p
                className="mb-2 px-3 text-[0.66rem] font-bold uppercase tracking-[0.16em]"
                style={{ color: "rgba(255,255,255,0.38)" }}
              >
                {section.title}
              </p>
              <div className="space-y-1">
                {section.items.map((m) => (
                  <Link
                    key={m.href}
                    href={m.href}
                    onClick={(e) => {
                      guardNav(e);
                      if (!isUploading) setOpen(false);
                    }}
                    aria-disabled={isUploading}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all active:scale-95 ${isUploading ? "opacity-40 cursor-not-allowed" : ""}`}
                    style={
                      isActive(m.href)
                        ? { background: "rgba(255,255,255,0.18)", color: "#fff", fontWeight: 600 }
                        : { color: "rgba(255,255,255,0.6)" }
                    }
                  >
                    <i className={`${m.icon} w-4 text-center`}></i>
                    {m.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* User + Logout */}
        <div className="px-4 py-4 border-t" style={{ borderColor: "rgba(255,255,255,0.12)" }}>
          <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.72rem" }} className="truncate mb-3 px-1">
            <i className="fa-regular fa-user mr-1.5"></i>{adminName ?? process.env.NEXT_PUBLIC_ADMIN_DISPLAY ?? "Admin"}
          </p>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-all active:scale-95"
            style={{ color: "rgba(255,255,255,0.6)" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(239,68,68,0.15)"; e.currentTarget.style.color = "#fca5a5"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = ""; e.currentTarget.style.color = "rgba(255,255,255,0.6)"; }}
            onTouchStart={(e) => { e.currentTarget.style.background = "rgba(239,68,68,0.15)"; e.currentTarget.style.color = "#fca5a5"; }}
            onTouchEnd={(e) => { e.currentTarget.style.background = ""; e.currentTarget.style.color = "rgba(255,255,255,0.6)"; }}
          >
            <i className="fa-solid fa-arrow-right-from-bracket w-4 text-center"></i>
            ออกจากระบบ
          </button>
          <Link
            href="/"
            onClick={guardNav}
            aria-disabled={isUploading}
            className={`mt-1 w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-all active:scale-95 ${isUploading ? "opacity-40 cursor-not-allowed" : ""}`}
            style={{ color: "rgba(255,255,255,0.6)" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.1)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "")}
            onTouchStart={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.1)")}
            onTouchEnd={(e) => (e.currentTarget.style.background = "")}
          >
            <i className="fa-solid fa-globe w-4 text-center"></i>
            ดูเว็บไซต์
          </Link>
        </div>
      </aside>
    </>
  );
}
