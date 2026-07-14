"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getSupabaseBrowser } from "@/lib/supabase/client";
import { useLocale } from "@/lib/i18n/locale-context";
import { setMemberSession } from "@/lib/member-session";

type View = "user" | "admin";

export default function LoginPage() {
  const router = useRouter();
  const { t } = useLocale();
  const [siteName, setSiteName] = useState("");
  const [siteSubtitle, setSiteSubtitle] = useState("");
  const [view, setView] = useState<View>("user");
  const [memberId, setMemberId] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let alive = true;
    fetch("/api/site-settings")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!alive || !data) return;
        setSiteName(data.site_name ?? "");
        setSiteSubtitle(data.site_subtitle ?? "");
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  const switchView = (v: View) => {
    setView(v);
    setError("");
  };

  const goBack = () => {
    if (window.history.length > 1) router.back();
    else router.push("/");
    router.refresh();
  };

  const handleUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const id = memberId.trim();
    // การบันทึกนี้ทำแบบ best-effort — ถ้า Supabase มีปัญหาไม่ควรบล็อกการเข้าใช้งาน
    // เพราะเลขสมาชิกไม่ได้ถูกตรวจสอบกับข้อมูลจริงอยู่แล้ว
    try {
      const sb = getSupabaseBrowser();
      if (sb) await sb.from("access_logs").insert({ member_id: id, user_agent: navigator.userAgent });
    } catch { /* ข้าม */ }

    setMemberSession(id);
    window.dispatchEvent(new CustomEvent("member-login"));
    toast.success(t("loginSuccess"));
    setLoading(false);
    goBack();
  };

  const handleAdminSubmit = async (e: React.FormEvent) => {
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
      if (!res.ok) { setError(data.error ?? t("invalidCredentials")); return; }
      toast.success(t("loginSuccess"));
      router.push("/admin");
      router.refresh();
    } catch {
      setError(t("genericError"));
    } finally {
      setLoading(false);
    }
  };

  const panelLeft = view === "user";

  const userFields = (
    <>
      <div style={{ position: "relative" }}>
        <input
          type="text" required autoComplete="off" inputMode="numeric"
          value={memberId} onChange={(e) => setMemberId(e.target.value)}
          placeholder={t("memberNumber")}
          style={inputStyle}
          onFocus={(e) => { e.currentTarget.style.borderColor = "#157493"; e.currentTarget.style.background = "#fff"; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = "#e5e7eb"; e.currentTarget.style.background = "#f9fafb"; }}
        />
        <i className="fa-solid fa-id-card" style={iconStyle}></i>
      </div>
      <p style={{ fontSize: "0.72rem", color: "#9ca3af", lineHeight: 1.6 }}>
        {t("memberIdHint")}
      </p>
    </>
  );

  const adminFields = (
    <>
      <div style={{ position: "relative" }}>
        <input
          type="text" required autoComplete="username"
          value={username} onChange={(e) => setUsername(e.target.value)}
          placeholder={t("usernamePlaceholder")}
          style={inputStyle}
          onFocus={(e) => { e.currentTarget.style.borderColor = "#157493"; e.currentTarget.style.background = "#fff"; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = "#e5e7eb"; e.currentTarget.style.background = "#f9fafb"; }}
        />
        <i className="fa-regular fa-user" style={iconStyle}></i>
      </div>
      <div style={{ position: "relative" }}>
        <input
          type={showPw ? "text" : "password"} required autoComplete="current-password"
          value={password} onChange={(e) => setPassword(e.target.value)}
          placeholder={t("passwordPlaceholder")}
          style={{ ...inputStyle, paddingRight: 44 }}
          onFocus={(e) => { e.currentTarget.style.borderColor = "#157493"; e.currentTarget.style.background = "#fff"; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = "#e5e7eb"; e.currentTarget.style.background = "#f9fafb"; }}
        />
        <i className="fa-solid fa-lock" style={iconStyle}></i>
        <button
          type="button" onClick={() => setShowPw(!showPw)}
          style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#9ca3af", padding: 4, lineHeight: 1 }}
        >
          <i className={showPw ? "fa-solid fa-eye-slash" : "fa-solid fa-eye"} style={{ fontSize: "0.85rem" }}></i>
        </button>
      </div>
    </>
  );

  const errorBanner = error && (
    <div style={{ marginBottom: 16, padding: "10px 14px", borderRadius: 10, background: "#fef2f2", border: "1px solid #fca5a5", color: "#dc2626", fontSize: "0.82rem", display: "flex", alignItems: "center", gap: 8 }}>
      <i className="fa-solid fa-circle-exclamation"></i> {error}
    </div>
  );

  const toggleBtn = (
    <button
      type="button"
      onClick={() => switchView(view === "user" ? "admin" : "user")}
      style={panelBtnStyle}
      onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.25)")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.12)")}
    >
      <i className={view === "user" ? "fa-solid fa-user-shield" : "fa-solid fa-user"}></i>
      {view === "user" ? t("adminShort") : t("generalUser")}
    </button>
  );

  return (
    <div
      className="pt-24 pb-16 min-h-screen flex items-center justify-center px-4"
      style={{ background: "linear-gradient(135deg, #c7e8f0 0%, #e0f2f7 50%, #f0f9fb 100%)" }}
    >
      <style>{`
        @keyframes loginSwitchIn {
          from { opacity: 0; transform: translateY(10px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .login-switch { animation: loginSwitchIn 0.7s cubic-bezier(.34,1.2,.64,1); }
      `}</style>

      {/* ── Desktop / tablet-landscape: sliding blob card ── */}
      <div className="hidden md:block" style={{
        position: "relative",
        width: "min(820px, 90vw)",
        height: "min(460px, 88vh)",
        background: "#fff",
        borderRadius: 28,
        boxShadow: "0 24px 80px rgba(21,116,147,0.18)",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", top: 0, bottom: 0, left: 0,
          width: "42%",
          background: "linear-gradient(145deg, #157493 0%, #0f6280 100%)",
          transform: `translateX(${panelLeft ? "0%" : "138.1%"})`,
          borderRadius: panelLeft ? "0 80px 80px 0" : "80px 0 0 80px",
          transition: "transform 1.1s cubic-bezier(0.65, 0, 0.35, 1), border-radius 1.1s cubic-bezier(0.65, 0, 0.35, 1)",
          willChange: "transform",
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          padding: "36px 28px", zIndex: 10,
        }}>
          <div style={{ width: 68, height: 68, borderRadius: 18, overflow: "hidden", marginBottom: 18, boxShadow: "0 8px 28px rgba(0,0,0,0.25)" }}>
            <img src="/favicon.webp" style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="" />
          </div>
          <h2 style={{ color: "#fff", fontSize: "1.4rem", fontWeight: 900, textAlign: "center", marginBottom: 8 }}>
            {view === "user" ? t("welcomeBack") : t("adminPanel")}
          </h2>
          <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "0.83rem", textAlign: "center", lineHeight: 1.8, marginBottom: 28 }}>
            {view === "user" ? <>{siteName}<br />{siteSubtitle}</> : t("adminOnlyNote")}
          </p>
          {toggleBtn}
        </div>

        {/* Admin form slot (panel on right when view=admin, so form sits left) */}
        <div style={{
          position: "absolute", top: 0, bottom: 0, left: 0,
          width: "58%",
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "32px 44px",
          opacity: view === "admin" ? 1 : 0,
          pointerEvents: view === "admin" ? "auto" : "none",
          transition: "opacity 0.7s ease 0.35s",
          zIndex: 1,
        }}>
          <div style={{ width: "100%", maxWidth: 290 }}>
            <h3 style={{ fontSize: "1.5rem", fontWeight: 900, color: "#111827", marginBottom: 4 }}>{t("adminLogin")}</h3>
            <p style={{ fontSize: "0.8rem", color: "#9ca3af", marginBottom: 24, display: "flex", alignItems: "center", gap: 5 }}>
              <i className="fa-solid fa-dove" style={{ color: "#157493" }}></i> {t("administrator")}
            </p>
            {errorBanner}
            <form onSubmit={handleAdminSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {adminFields}
              <SubmitButton loading={loading} />
            </form>
          </div>
        </div>

        {/* User form slot (panel on left when view=user, so form sits right) */}
        <div style={{
          position: "absolute", top: 0, bottom: 0, right: 0,
          width: "58%",
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "32px 44px",
          opacity: view === "user" ? 1 : 0,
          pointerEvents: view === "user" ? "auto" : "none",
          transition: "opacity 0.7s ease 0.35s",
          zIndex: 1,
        }}>
          <div style={{ width: "100%", maxWidth: 290 }}>
            <h3 style={{ fontSize: "1.5rem", fontWeight: 900, color: "#111827", marginBottom: 4 }}>{t("login")}</h3>
            <p style={{ fontSize: "0.8rem", color: "#9ca3af", marginBottom: 24, display: "flex", alignItems: "center", gap: 5 }}>
              <i className="fa-solid fa-dove" style={{ color: "#157493" }}></i> {siteSubtitle}
            </p>
            {errorBanner}
            <form onSubmit={handleUserSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {userFields}
              <SubmitButton loading={loading} />
            </form>
          </div>
        </div>
      </div>

      {/* ── Mobile / narrow tablet: stacked card ── */}
      <div className="md:hidden w-full" style={{ maxWidth: 400, background: "#fff", borderRadius: 28, boxShadow: "0 24px 80px rgba(21,116,147,0.18)", overflow: "hidden" }}>
        <div style={{ background: "linear-gradient(145deg, #157493 0%, #0f6280 100%)", padding: "32px 28px", display: "flex", flexDirection: "column", alignItems: "center", overflow: "hidden" }}>
          <div key={view} className="login-switch" style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
            <div style={{ width: 60, height: 60, borderRadius: 16, overflow: "hidden", marginBottom: 14, boxShadow: "0 8px 28px rgba(0,0,0,0.25)" }}>
              <img src="/favicon.webp" style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="" />
            </div>
            <h2 style={{ color: "#fff", fontSize: "1.25rem", fontWeight: 900, textAlign: "center", marginBottom: 6 }}>
              {view === "user" ? t("welcomeBack") : t("adminPanel")}
            </h2>
            <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "0.8rem", textAlign: "center", lineHeight: 1.7, marginBottom: 20 }}>
              {view === "user" ? <>{siteName}<br />{siteSubtitle}</> : t("adminOnlyNote")}
            </p>
          </div>
          {toggleBtn}
        </div>

        <div style={{ padding: "32px 28px", overflow: "hidden" }}>
          {errorBanner}
          <div key={view} className="login-switch">
            {view === "user" ? (
              <form onSubmit={handleUserSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {userFields}
                <SubmitButton loading={loading} />
              </form>
            ) : (
              <form onSubmit={handleAdminSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {adminFields}
                <SubmitButton loading={loading} />
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function SubmitButton({ loading }: { loading: boolean }) {
  const { t } = useLocale();
  return (
    <button
      type="submit" disabled={loading}
      style={{ padding: "13px", borderRadius: 30, background: "#157493", color: "#fff", fontWeight: 700, fontSize: "0.92rem", border: "none", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.75 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 4, transition: "background 0.2s" }}
      onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = "#0f6280"; }}
      onMouseLeave={(e) => { if (!loading) e.currentTarget.style.background = "#157493"; }}
    >
      {loading
        ? <><i className="fa-solid fa-circle-notch fa-spin"></i> {t("loggingIn")}</>
        : <><i className="fa-solid fa-right-to-bracket"></i> {t("login")}</>
      }
    </button>
  );
}

const panelBtnStyle: React.CSSProperties = {
  padding: "8px 22px",
  border: "2px solid rgba(255,255,255,0.65)",
  borderRadius: 30,
  color: "#fff",
  background: "rgba(255,255,255,0.12)",
  fontWeight: 700, fontSize: "0.8rem", cursor: "pointer",
  display: "flex", alignItems: "center", gap: 8,
  transition: "background 0.2s",
};

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "12px 14px 12px 42px",
  borderRadius: 30, border: "1.5px solid #e5e7eb",
  fontSize: "0.88rem", outline: "none",
  background: "#f9fafb", color: "#111827",
  boxSizing: "border-box",
  transition: "border-color 0.2s, background 0.2s",
};

const iconStyle: React.CSSProperties = {
  position: "absolute", left: 16, top: "50%",
  transform: "translateY(-50%)", color: "#9ca3af", fontSize: "0.85rem",
};
