"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Navbar from "./navbar";
import BottomTab from "./bottom-tab";
import BibleSheet from "./bible-sheet";
import VideoModal from "./video-modal";
import { LocaleProvider, useLocale } from "@/lib/i18n/locale-context";
import { pickLocale } from "@/lib/i18n/pick-locale";
import type { NavItem, ScriptureLink, SiteSettings, VideoItem } from "@/lib/types";

type Props = {
  children: React.ReactNode;
  scriptureLinks: ScriptureLink[];
  featuredVideo: VideoItem | null;
  siteSettings: SiteSettings;
  navItems: NavItem[];
};

export default function SiteClient(props: Props) {
  return (
    <LocaleProvider>
      <SiteClientInner {...props} />
    </LocaleProvider>
  );
}

function SiteClientInner({ children, scriptureLinks, featuredVideo, siteSettings, navItems }: Props) {
  const router = useRouter();
  const { t, locale } = useLocale();
  const [scrolled, setScrolled] = useState(false);
  const [bibleDropdownOpen, setBibleDropdownOpen] = useState(false);
  const [bibleSheetOpen, setBibleSheetOpen] = useState(false);
  const [videoOpen, setVideoOpen] = useState(false);

  useEffect(() => {
    const triggerFadeIn = () => {
      document.querySelectorAll<HTMLElement>(".fade-in").forEach((el) => {
        if (el.getBoundingClientRect().top < window.innerHeight - 50) el.classList.add("visible");
      });
    };
    const onScroll = () => {
      setScrolled(window.scrollY > 50);
      triggerFadeIn();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    triggerFadeIn();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const openVideo = () => {
      if (featuredVideo) setVideoOpen(true);
      else router.push("/videos");
    };
    window.addEventListener("open-video", openVideo);
    return () => window.removeEventListener("open-video", openVideo);
  }, [featuredVideo, router]);

  useEffect(() => {
    if (!bibleDropdownOpen) return;
    const onDocClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".bible-nav-wrapper")) setBibleDropdownOpen(false);
    };
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, [bibleDropdownOpen]);

  useEffect(() => {
    if (!bibleSheetOpen) return;
    const onDocClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("#bible-sheet") && !target.closest(".tab-bible-fab")) {
        setBibleSheetOpen(false);
      }
    };
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, [bibleSheetOpen]);

  const pathname = usePathname();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);

  // AOS (Animate On Scroll) engine — re-scans on every route change so newly
  // mounted page content animates in. Pairs with the [data-aos] CSS in globals.css.
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-aos]"));
    if (els.length === 0) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("aos-animate"));
      return;
    }

    // Reset so navigating back to a page replays the animations.
    els.forEach((el) => el.classList.remove("aos-animate"));

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;
          const delay = el.dataset.aosDelay;
          const duration = el.dataset.aosDuration;
          if (delay) el.style.transitionDelay = `${delay}ms`;
          if (duration) el.style.transitionDuration = `${duration}ms`;
          el.classList.add("aos-animate");
          io.unobserve(el);
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -8% 0px" },
    );

    const raf = requestAnimationFrame(() => els.forEach((el) => io.observe(el)));
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [pathname]);

  const goToBible = useCallback(() => {
    setBibleSheetOpen(false);
    setBibleDropdownOpen(false);
    router.push("/bible");
  }, [router]);

  return (
    <>
      <Navbar
        scrolled={scrolled}
        bibleOpen={bibleDropdownOpen}
        onToggleBible={() => setBibleDropdownOpen((v) => !v)}
        scriptureLinks={scriptureLinks}
        siteName={pickLocale(locale, siteSettings.site_name, siteSettings.site_name_en)}
        siteSubtitle={pickLocale(locale, siteSettings.site_subtitle, siteSettings.site_subtitle_en)}
        navItems={navItems}
      />
      <BottomTab onToggleBibleSheet={() => setBibleSheetOpen((v) => !v)} />
      <BibleSheet
        open={bibleSheetOpen}
        onMore={goToBible}
        scriptureLinks={scriptureLinks}
      />
      {featuredVideo && (
        <VideoModal
          open={videoOpen}
          onClose={() => setVideoOpen(false)}
          src={featuredVideo.video_url}
          title={pickLocale(locale, featuredVideo.title, featuredVideo.title_en)}
        />
      )}
      {children}
      <footer style={{ background: "#fff", color: "#222", borderTop: "1px solid #e5e7eb" }}>
        <style>{`
          .footer-link { color: #157493; font-size: 0.83rem; text-decoration: none; display: block; margin-bottom: 8px; line-height: 1.5; }
          .footer-link:hover { text-decoration: underline; }
          .footer-col-title { font-size: 0.82rem; font-weight: 700; color: #111; border-bottom: 1.5px solid #d1d5db; padding-bottom: 8px; margin-bottom: 12px; }
        `}</style>

        {/* Logo + heading — centered */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: "44px 24px 32px", borderBottom: "1px solid #e5e7eb" }}>
          <img src={`/images/logo-footer-${locale}.webp`} style={{ width: 160, height: "auto", objectFit: "contain", marginBottom: 18 }} alt="logo" />
          <h2 style={{ fontSize: "clamp(1rem,3vw,1.3rem)", fontWeight: 400, color: "#111" }}>
            {t("footerLearnMore")}
          </h2>
        </div>

        {/* 4-column links */}
        <div style={{ maxWidth: 1080, margin: "0 auto", padding: "32px 32px 28px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "24px 28px" }}>

          {/* คลัง */}
          <div>
            <p className="footer-col-title">{t("footerLibrary")}</p>
            <a className="footer-link" href="/shop">{t("footerResources")}</a>
            <a className="footer-link" href="/bible">{t("bible")}</a>
            <a className="footer-link" href="/videos">{t("watchVideo")}</a>
          </div>

          {/* กิจกรรม */}
          <div>
            <p className="footer-col-title">{t("footerActivities")}</p>
            <a className="footer-link" href="/activities">{t("footerAllActivities")}</a>
            <a className="footer-link" href="/calendar">{t("footerCalendar")}</a>
          </div>

          {/* เกี่ยวกับเรา */}
          <div>
            <p className="footer-col-title">{t("footerAbout")}</p>
            <a className="footer-link" href="/members">{t("footerMembers")}</a>
            <a className="footer-link" href="/">{t("home")}</a>
          </div>

          {/* ติดต่อ */}
          <div>
            <p className="footer-col-title">{t("footerContact")}</p>
            <a className="footer-link" href="/chat">{t("footerChatWithUs")}</a>
            <a className="footer-link" href="/members">{t("footerWardDirectory")}</a>
            {siteSettings.address && (
              <p className="footer-link" style={{ textDecoration: "none", color: "#555" }}>
                <i className="fa-solid fa-location-dot mr-1.5"></i>{siteSettings.address}
              </p>
            )}
            {siteSettings.phone && (
              <a className="footer-link" href={`tel:${siteSettings.phone}`}>
                <i className="fa-solid fa-phone mr-1.5"></i>{siteSettings.phone}
              </a>
            )}
            {siteSettings.email && (
              <a className="footer-link" href={`mailto:${siteSettings.email}`}>
                <i className="fa-solid fa-envelope mr-1.5"></i>{siteSettings.email}
              </a>
            )}
          </div>

        </div>

        {/* Copyright */}
        <div style={{ padding: "20px 24px", textAlign: "center" }}>
          <a href="/" style={{ color: "#157493", fontSize: "0.78rem", textDecoration: "none" }}>{t("footerAccessibility")}</a>
          <p style={{ fontSize: "0.72rem", color: "#555", marginTop: 2 }}>
            © {new Date().getFullYear()} {pickLocale(locale, siteSettings.site_name, siteSettings.site_name_en)} {pickLocale(locale, siteSettings.site_subtitle, siteSettings.site_subtitle_en)}
          </p>
        </div>
      </footer>
    </>
  );
}
