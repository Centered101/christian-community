"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  siteName: string;
  siteSubtitle: string;
};

export default function AdminLoginForm({ siteName, siteSubtitle }: Props) {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "เข้าสู่ระบบไม่สำเร็จ"); return; }
      router.push("/admin");
      router.refresh();
    } catch {
      setError("เกิดข้อผิดพลาด กรุณาลองใหม่");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", background: "#f0f9fb" }}>
      {/* Left panel — branding */}
      <div
        className="hidden lg:flex"
        style={{
          width: 420,
          flexShrink: 0,
          background: "linear-gradient(160deg, #157493 0%, #0f6280 60%, #093e53 100%)",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "48px 40px",
        }}
      >
        <div style={{ textAlign: "center", width: "100%" }}>
          <div style={{ width: 88, height: 88, borderRadius: 22, overflow: "hidden", margin: "0 auto 24px", boxShadow: "0 8px 32px rgba(0,0,0,0.25)" }}>
            <img src="/favicon.webp" style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="" />
          </div>
          <h1 style={{ color: "#fff", fontSize: "1.4rem", fontWeight: 800, letterSpacing: "0.04em", marginBottom: 6 }}>
            แผงควบคุมผู้ดูแลระบบ
          </h1>
          <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "0.83rem", lineHeight: 1.8 }}>
            {siteName}
          </p>
          <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.75rem", marginTop: 4 }}>{siteSubtitle}</p>

          <div style={{ marginTop: 48, display: "flex", flexDirection: "column", gap: 12, textAlign: "left" }}>
            {[
              { icon: "fa-solid fa-users", label: "จัดการสมาชิก" },
              { icon: "fa-solid fa-star", label: "จัดการกิจกรรม" },
              { icon: "fa-solid fa-calendar-days", label: "จัดการปฏิทิน" },
              { icon: "fa-solid fa-comments", label: "ดูแลแชต" },
              { icon: "fa-solid fa-book-open", label: "คลังค้นคว้า" },
            ].map((item) => (
              <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 12, color: "rgba(255,255,255,0.7)", fontSize: "0.85rem" }}>
                <div style={{ width: 34, height: 34, borderRadius: 9, background: "rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <i className={item.icon} style={{ fontSize: "0.8rem", color: "#fff" }}></i>
                </div>
                {item.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px 20px" }}>
        <div style={{ width: "100%", maxWidth: 400 }}>

          {/* Mobile logo */}
          <div className="flex lg:hidden" style={{ alignItems: "center", gap: 12, marginBottom: 32, justifyContent: "center" }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, overflow: "hidden", boxShadow: "0 4px 12px rgba(21,116,147,0.25)" }}>
              <img src="/favicon.webp" style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="" />
            </div>
            <div>
              <p style={{ fontSize: "0.9rem", fontWeight: 800, color: "#157493" }}>แผงควบคุมผู้ดูแลระบบ</p>
              <p style={{ fontSize: "0.72rem", color: "#6b7280" }}>{siteSubtitle}</p>
            </div>
          </div>

          <h2 style={{ fontSize: "1.7rem", fontWeight: 800, color: "#111827", marginBottom: 6 }}>เข้าสู่ระบบ</h2>
          <p style={{ fontSize: "0.85rem", color: "#6b7280", marginBottom: 32 }}>
            กรุณาใส่ข้อมูลเพื่อเข้าสู่หน้าจัดการ
          </p>

          {error && (
            <div style={{ marginBottom: 20, padding: "12px 16px", borderRadius: 10, background: "#fef2f2", border: "1px solid #fca5a5", color: "#dc2626", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: 8 }}>
              <i className="fa-solid fa-circle-exclamation"></i> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {/* Username */}
            <div>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#374151", marginBottom: 6 }}>
                <i className="fa-regular fa-user" style={{ marginRight: 6, color: "#9ca3af" }}></i>ชื่อผู้ใช้
              </label>
              <input
                type="text"
                required
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                style={{ width: "100%", padding: "12px 14px", borderRadius: 10, border: "1.5px solid #d1d5db", fontSize: "0.9rem", outline: "none", background: "#fff", color: "#111827", boxSizing: "border-box" }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#157493")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#d1d5db")}
              />
            </div>

            {/* Password */}
            <div>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#374151", marginBottom: 6 }}>
                <i className="fa-solid fa-lock" style={{ marginRight: 6, color: "#9ca3af" }}></i>รหัสผ่าน
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPw ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{ width: "100%", padding: "12px 44px 12px 14px", borderRadius: 10, border: "1.5px solid #d1d5db", fontSize: "0.9rem", outline: "none", background: "#fff", color: "#111827", boxSizing: "border-box" }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#157493")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "#d1d5db")}
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#9ca3af", padding: 4, lineHeight: 1 }}
                >
                  <i className={showPw ? "fa-solid fa-eye-slash" : "fa-solid fa-eye"}></i>
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{ width: "100%", padding: "14px", borderRadius: 10, background: "#157493", color: "#fff", fontWeight: 700, fontSize: "0.95rem", border: "none", cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, opacity: loading ? 0.75 : 1, transition: "background 0.2s, transform 0.15s" }}
              onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = "#0f6280"; }}
              onMouseLeave={(e) => { if (!loading) { e.currentTarget.style.background = "#157493"; e.currentTarget.style.transform = "scale(1)"; } }}
              onTouchStart={(e) => { if (!loading) { e.currentTarget.style.background = "#0f6280"; e.currentTarget.style.transform = "scale(0.97)"; } }}
              onTouchEnd={(e) => { if (!loading) { e.currentTarget.style.background = "#157493"; e.currentTarget.style.transform = "scale(1)"; } }}
            >
              {loading
                ? <><i className="fa-solid fa-circle-notch fa-spin"></i> กำลังเข้าสู่ระบบ…</>
                : <><i className="fa-solid fa-right-to-bracket"></i> เข้าสู่ระบบ</>
              }
            </button>
          </form>

          <p style={{ marginTop: 32, textAlign: "center", fontSize: "0.78rem", color: "#9ca3af" }}>
            <i className="fa-solid fa-shield-halved" style={{ marginRight: 4 }}></i>
            เฉพาะผู้ดูแลระบบที่ได้รับอนุญาตเท่านั้น
          </p>
        </div>
      </div>
    </div>
  );
}
