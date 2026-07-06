"use client";

import Link from "next/link";
import { useState } from "react";
import { useLocale } from "@/lib/i18n/locale-context";
import { pickLocale } from "@/lib/i18n/pick-locale";
import type { Faq, HomeHighlight, TopicCard } from "@/lib/types";

type Props = {
  heroTitle: string;
  heroTitleEn: string;
  heroSubtitle: string;
  heroSubtitleEn: string;
  topicCards: TopicCard[];
  faqs: Faq[];
  highlights: HomeHighlight[];
  verseText: string;
  verseTextEn: string;
  verseRef: string;
  verseRefEn: string;
};

function withLineBreaks(text: string) {
  return text.split("\n").map((line, i, arr) => (
    <span key={i}>
      {line}
      {i < arr.length - 1 && <br />}
    </span>
  ));
}

// ตำแหน่ง/จังหวะเวลาคงที่ เพื่อให้ starfield ที่กระพริบเรนเดอร์เหมือนกันทั้งฝั่งเซิร์ฟเวอร์และไคลเอนต์
const STARS = Array.from({ length: 55 }, (_, i) => {
  const seed = i * 37;
  return {
    top: `${(seed * 7) % 100}%`,
    left: `${(seed * 13) % 100}%`,
    size: 2 + (i % 4),
    dur: `${2.5 + (i % 5) * 0.6}s`,
    delay: `${(i % 9) * 0.4}s`,
    glow: i % 3 === 0,
  };
});

// จำนวนดาวมากกว่าช่วงเวลา stagger เพื่อให้ดวงใหม่เริ่มวาบก่อนที่รอบเก่าจะจบสนิท —
// ให้ความรู้สึกเหมือนเป็นสายที่ต่อเนื่อง ไม่ใช่รอแล้วค่อยวาบทีละดวง
const SHOOTING_STARS = Array.from({ length: 5 }, (_, i) => {
  const seed = i * 53;
  return {
    top: `${5 + ((seed * 11) % 55)}%`,
    delay: `${i * 0.5}s`,
    dur: `${3.5 + (i % 3) * 0.6}s`,
  };
});

export default function HomeSection({ heroTitle, heroTitleEn, heroSubtitle, heroSubtitleEn, topicCards, faqs, highlights, verseText, verseTextEn, verseRef, verseRefEn }: Props) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const { t, locale } = useLocale();
  const heroTitleText = pickLocale(locale, heroTitle, heroTitleEn);
  const heroSubtitleText = pickLocale(locale, heroSubtitle, heroSubtitleEn);
  const verseTextText = pickLocale(locale, verseText, verseTextEn);
  const verseRefText = pickLocale(locale, verseRef, verseRefEn);

  return (
    <div className="md:pt-16" style={{ background: "#fff" }}>

      {/* ── HERO ── */}
      <div
        style={{
          position: "relative",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          background: "linear-gradient(160deg, #0a1e4a 0%, #157493 55%, #1e3a8a 100%)",
        }}
      >
        <div id="hero-stars">
          {STARS.map((s, i) => (
            <span
              key={i}
              className={`star${s.glow ? " glow" : ""}`}
              style={{
                top: s.top,
                left: s.left,
                width: s.size,
                height: s.size,
                animationDelay: s.delay,
                ["--dur" as string]: s.dur,
              } as React.CSSProperties}
            />
          ))}
          {SHOOTING_STARS.map((s, i) => (
            <span
              key={i}
              className="shooting-star"
              style={{
                top: s.top,
                animationDelay: s.delay,
                ["--sdur" as string]: s.dur,
              } as React.CSSProperties}
            />
          ))}
        </div>

        <style>{`
          @keyframes christusGlow {
            0%, 100% { filter: drop-shadow(0 0 55px rgba(147,197,253,0.65)) drop-shadow(0 0 110px rgba(191,219,253,0.4)) brightness(1); }
            50% { filter: drop-shadow(0 0 90px rgba(147,197,253,0.9)) drop-shadow(0 0 160px rgba(191,219,253,0.6)) brightness(1.15); }
          }
          .hero-christus {
            position: relative;
            animation: christusGlow 4.5s ease-in-out infinite;
          }
          @keyframes auraPulse {
            0%, 100% { opacity: 0.55; transform: translate(-50%, -50%) scale(1); }
            50% { opacity: 0.9; transform: translate(-50%, -50%) scale(1.12); }
          }
          .hero-aura {
            position: absolute;
            top: 46%;
            left: 50%;
            width: 620px;
            height: 620px;
            transform: translate(-50%, -50%);
            border-radius: 50%;
            background: radial-gradient(circle, rgba(191,219,253,0.55) 0%, rgba(147,197,253,0.25) 35%, transparent 70%);
            filter: blur(20px);
            animation: auraPulse 4.5s ease-in-out infinite;
            pointer-events: none;
            z-index: 0;
          }
        `}</style>

        <div data-aos="fade-up" data-aos-duration="1000" style={{ position: "relative", zIndex: 2, textAlign: "center", maxWidth: 720, padding: "64px 32px 64px" }}>
          <div className="hero-aura" />
          <img
            src="/images/hero.png"
            alt=""
            className="hero-christus"
            style={{ position: "relative", zIndex: 1, width: 500, margin: "0 auto 12px", opacity: 0.97 }}
          />
          <h1 style={{ marginBottom: 20 }}>
            <img src={locale === "en" ? "/images/sub-hero-en.webp" : "/images/sub-hero-th.webp"} alt={heroTitleText} style={{ maxWidth: "100%", width: 480, margin: "0 auto" }} />
          </h1>
          <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "1.05rem", fontStyle: "italic", marginBottom: 36, lineHeight: 1.8 }}>
            {withLineBreaks(heroSubtitleText)}
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
            <Link
              href="/videos"
              style={{ padding: "13px 28px", background: "#157493", color: "#fff", border: "none", borderRadius: 6, fontWeight: 700, fontSize: "0.9rem", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}
            >
              <i className="fa-solid fa-circle-play"></i> {t("watchIntro")}
            </Link>
            <Link href="/members" style={{ padding: "13px 28px", background: "rgba(255,255,255,0.12)", color: "#fff", border: "2px solid rgba(255,255,255,0.5)", borderRadius: 6, fontWeight: 600, fontSize: "0.9rem", textDecoration: "none", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", gap: 8 }}>
              <i className="fa-solid fa-users"></i> {t("knowMembers")}
            </Link>
          </div>
        </div>

        {/* Scroll hint */}
        <div style={{ position: "absolute", bottom: 28, left: "50%", transform: "translateX(-50%)", color: "rgba(255,255,255,0.5)", textAlign: "center", zIndex: 2 }}>
          <i className="fa-solid fa-chevron-down fa-beat" style={{ fontSize: "1.2rem" }}></i>
        </div>
      </div>

      {/* ── TOPIC CARDS ── */}
      {topicCards.length > 0 && (
        <div style={{ background: "#f9fafb", padding: "72px 0" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
            <div data-aos="fade-up" style={{ textAlign: "center", marginBottom: 48 }}>
              <p style={{ color: "#157493", fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 10 }}>
                <i className="fa-solid fa-star mr-2"></i>{t("exploreFaith")}
              </p>
              <h2 style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 800, color: "#111827" }}>
                {t("startJourney")}
              </h2>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 24 }}>
              {topicCards.map((c, i) => (
                <Link
                  key={c.id}
                  href={c.href}
                  data-aos="fade-up"
                  data-aos-delay={String((i % 4) * 100)}
                  style={{ textDecoration: "none", borderRadius: 12, overflow: "hidden", background: "#fff", boxShadow: "0 1px 4px rgba(0,0,0,0.08)", display: "block" }}
                >
                  <div style={{ height: 6, background: c.color }} />
                  <div style={{ padding: "24px 22px 26px" }}>
                    <div style={{ width: 48, height: 48, borderRadius: 12, background: c.color + "15", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
                      <i className={c.icon} style={{ color: c.color, fontSize: "1.3rem" }}></i>
                    </div>
                    <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#111827", marginBottom: 8 }}>{pickLocale(locale, c.title, c.title_en)}</h3>
                    <p style={{ fontSize: "0.85rem", color: "#6b7280", lineHeight: 1.7, marginBottom: 16 }}>{pickLocale(locale, c.description, c.description_en)}</p>
                    <span style={{ fontSize: "0.82rem", color: c.color, fontWeight: 700, display: "flex", alignItems: "center", gap: 6 }}>
                      {t("learnMore")} <i className="fa-solid fa-arrow-right" style={{ fontSize: "0.75rem" }}></i>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── FIND A CHURCH ── */}
      <div style={{ position: "relative", overflow: "hidden" }}>
        <img src="https://www.churchofjesuschrist.org/imgs/9422a20c6ece11eea874eeeeac1e2d774a5d3500/full/!800%2C533/0/default" alt="" style={{ width: "100%", height: 360, objectFit: "cover" }} />
        <div style={{ position: "absolute", inset: 0, background: "rgba(10,25,65,0.78)", display: "flex", alignItems: "center" }}>
          <div style={{ maxWidth: 1200, width: "100%", margin: "0 auto", padding: "0 32px", display: "flex", flexWrap: "wrap", alignItems: "center", gap: 40, justifyContent: "space-between" }}>
            <div data-aos="fade-right">
              <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "0.8rem", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 12 }}>
                <i className="fa-solid fa-location-dot mr-2"></i>{t("joinUs")}
              </p>
              <h2 style={{ color: "#fff", fontSize: "clamp(1.4rem, 3vw, 2rem)", fontWeight: 800, marginBottom: 10 }}>
                {t("findChurchNear")}
              </h2>
              <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.95rem", maxWidth: 400, lineHeight: 1.8 }}>
                {t("worldwideWelcome")}<br />
                <i className="fa-regular fa-clock mr-1"></i>{t("sundayTime")}
              </p>
            </div>
            <div data-aos="fade-left" data-aos-delay="150" style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <a href="https://www.churchofjesuschrist.org/welcome/find-a-church?lang=eng&location=ลพบุรี" target="_blank" rel="noopener noreferrer"
                style={{ padding: "14px 28px", background: "#fff", color: "#157493", borderRadius: 6, fontWeight: 700, fontSize: "0.9rem", textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }}>
                <i className="fa-solid fa-map-location-dot"></i> {t("findChurch")}
              </a>
              <Link href="/activities" style={{ padding: "14px 28px", color: "#fff", border: "2px solid rgba(255,255,255,0.45)", borderRadius: 6, fontWeight: 600, fontSize: "0.9rem", textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }}>
                <i className="fa-solid fa-calendar-days"></i> {t("viewActivities")}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── VERSE ── */}
      {verseTextText && (
        <div style={{ background: "#fff", padding: "72px 0" }}>
          <div data-aos="zoom-in" style={{ maxWidth: 720, margin: "0 auto", padding: "0 24px", textAlign: "center" }}>
            <i className="fa-solid fa-quote-left" style={{ color: "#157493", fontSize: "2.5rem", opacity: 0.2, marginBottom: 16, display: "block" }}></i>
            <p style={{ fontSize: "0.78rem", color: "#157493", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 20 }}>
              <i className="fa-solid fa-book-bible mr-2"></i>{t("spiritualThought")}
            </p>
            <blockquote style={{ fontSize: "clamp(1.1rem, 2.5vw, 1.5rem)", color: "#1f2937", fontStyle: "italic", lineHeight: 1.9, marginBottom: 20, fontWeight: 500 }}>
              "{verseTextText}"
            </blockquote>
            {verseRefText && (
              <p style={{ color: "#157493", fontWeight: 700, fontSize: "0.9rem", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                <i className="fa-solid fa-bookmark"></i> {verseRefText}
              </p>
            )}
            <div style={{ width: 48, height: 3, background: "#157493", borderRadius: 99, margin: "20px auto 0" }} />
          </div>
        </div>
      )}

      {/* ── FAQ ── */}
      {faqs.length > 0 && (
        <div style={{ background: "#f9fafb", padding: "72px 0" }}>
          <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 24px" }}>
            <div data-aos="fade-up" style={{ textAlign: "center", marginBottom: 48 }}>
              <p style={{ color: "#157493", fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 10 }}>
                <i className="fa-solid fa-circle-question mr-2"></i>{t("generalQuestions")}
              </p>
              <h2 style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 800, color: "#111827" }}>
                {t("faq")}
              </h2>
            </div>
            <div data-aos="fade-up" data-aos-delay="100" style={{ borderRadius: 12, overflow: "hidden", border: "1px solid #e5e7eb", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
              {faqs.map((f, i) => (
                <div key={f.id} style={{ borderBottom: i < faqs.length - 1 ? "1px solid #e5e7eb" : "none" }}>
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    style={{ width: "100%", padding: "18px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#fff", border: "none", cursor: "pointer", textAlign: "left", fontWeight: 600, fontSize: "0.95rem", color: "#1f2937", gap: 12 }}
                  >
                    <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <i className={f.icon} style={{ color: "#157493", fontSize: "0.9rem", width: 18, textAlign: "center" }}></i>
                      {pickLocale(locale, f.question, f.question_en)}
                    </span>
                    <i className="fa-solid fa-chevron-down" style={{ color: "#157493", fontSize: "0.8rem", transition: "transform 0.25s", transform: openFaq === i ? "rotate(180deg)" : "rotate(0)", flexShrink: 0 }} />
                  </button>
                  {openFaq === i && (
                    <div style={{ padding: "0 24px 20px 56px", background: "#f9fafb", color: "#4b5563", fontSize: "0.9rem", lineHeight: 1.8 }}>
                      {pickLocale(locale, f.answer, f.answer_en)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── QUOTE ── */}
      <div style={{ background: "#157493", padding: "72px 0" }}>
        <div data-aos="zoom-in" style={{ maxWidth: 720, margin: "0 auto", padding: "0 24px", textAlign: "center" }}>
          <i className="fa-solid fa-quote-left" style={{ color: "rgba(255,255,255,0.15)", fontSize: "3rem", marginBottom: 24, display: "block" }}></i>
          <blockquote style={{ color: "#fff", fontSize: "clamp(1.05rem, 2.5vw, 1.35rem)", fontStyle: "italic", lineHeight: 1.9, marginBottom: 28 }}>
            "{t("homeQuote")}"
          </blockquote>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
            <div style={{ width: 40, height: 40, borderRadius: "50%", overflow: "hidden", border: "2px solid rgba(255,255,255,0.3)" }}>
              <img src="/favicon.webp" alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "0.85rem", fontWeight: 600 }}>
              <i className="fa-solid fa-map-pin mr-1"></i> {t("quoteLocation")}
            </p>
          </div>
        </div>
      </div>

      {/* ── HIGHLIGHTS ── */}
      {highlights.length > 0 && (
        <div style={{ background: "#fff", padding: "72px 0" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
            <div data-aos="fade-up" style={{ textAlign: "center", marginBottom: 48 }}>
              <p style={{ color: "#157493", fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 10 }}>
                <i className="fa-solid fa-compass mr-2"></i>{t("exploreMore")}
              </p>
              <h2 style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 800, color: "#111827" }}>
                {t("communityLife")}
              </h2>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 32 }}>
              {highlights.map((h, i) => (
                <div key={h.id} data-aos="fade-up" data-aos-delay={String((i % 4) * 120)}>
                  <div style={{ height: 200, borderRadius: 10, overflow: "hidden", marginBottom: 18, position: "relative" }}>
                    {h.img && <img src={h.img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
                    <div style={{ position: "absolute", top: 12, left: 12, width: 36, height: 36, borderRadius: 8, background: "#157493", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <i className={h.icon} style={{ color: "#fff", fontSize: "0.9rem" }}></i>
                    </div>
                  </div>
                  <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#111827", marginBottom: 8 }}>{pickLocale(locale, h.title, h.title_en)}</h3>
                  <p style={{ fontSize: "0.85rem", color: "#6b7280", lineHeight: 1.7, marginBottom: 14 }}>{pickLocale(locale, h.description, h.description_en)}</p>
                  <Link href={h.href} style={{ fontSize: "0.85rem", color: "#157493", fontWeight: 700, textDecoration: "none", display: "flex", alignItems: "center", gap: 6 }}>
                    {pickLocale(locale, h.cta_label, h.cta_label_en)} <i className="fa-solid fa-arrow-right" style={{ fontSize: "0.75rem" }}></i>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── FOOTER CTA ── */}
      <div style={{ background: "#f3f4f6", padding: "52px 0", borderTop: "1px solid #e5e7eb" }}>
        <div data-aos="fade-up" style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          <p style={{ textAlign: "center", color: "#6b7280", fontSize: "0.82rem", marginBottom: 20, letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600 }}>
            <i className="fa-solid fa-hand-holding-heart mr-2 text-blue-800"></i>{t("weWelcomeYou")}
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14 }}>
            {[
              { icon: "fa-solid fa-map-location-dot", label: t("findChurch"), href: "https://www.churchofjesuschrist.org/welcome/find-a-church?lang=eng", external: true },
              { icon: "fa-solid fa-users", label: t("meetMembers"), href: "/members", external: false },
              { icon: "fa-solid fa-book-bible", label: t("getBookOfMormon"), href: "/bible", external: false },
            ].map((btn) =>
              btn.external ? (
                <a key={btn.label} href={btn.href} target="_blank" rel="noopener noreferrer"
                  style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, padding: "16px 24px", background: "#157493", color: "#fff", borderRadius: 8, fontWeight: 700, fontSize: "0.9rem", textDecoration: "none" }}>
                  <i className={btn.icon}></i> {btn.label}
                </a>
              ) : (
                <Link key={btn.label} href={btn.href}
                  style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, padding: "16px 24px", background: "#157493", color: "#fff", borderRadius: 8, fontWeight: 700, fontSize: "0.9rem", textDecoration: "none" }}>
                  <i className={btn.icon}></i> {btn.label}
                </Link>
              )
            )}
          </div>
        </div>
      </div>

    </div>
  );
}
