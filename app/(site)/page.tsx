import type { Metadata } from "next";
import HomeSection from "@/components/sections/home-section";
import { getFaqs, getHomeHighlights, getSiteSettings, getTopicCards } from "@/lib/data";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "หน้าหลัก | ศาสนาจักรของพระเยซูคริสต์" };

export default async function HomePage() {
  const settings = await getSiteSettings();

  let topicCards: Awaited<ReturnType<typeof getTopicCards>> = [];
  let faqs: Awaited<ReturnType<typeof getFaqs>> = [];
  let highlights: Awaited<ReturnType<typeof getHomeHighlights>> = [];
  try {
    [topicCards, faqs, highlights] = await Promise.all([
      getTopicCards(),
      getFaqs(),
      getHomeHighlights(),
    ]);
  } catch {}

  return (
    <HomeSection
      heroTitle={settings.hero_title}
      heroTitleEn={settings.hero_title_en}
      heroSubtitle={settings.hero_subtitle}
      heroSubtitleEn={settings.hero_subtitle_en}
      topicCards={topicCards}
      faqs={faqs}
      highlights={highlights}
      verseText={settings.verse_text}
      verseTextEn={settings.verse_text_en}
      verseRef={settings.verse_ref}
      verseRefEn={settings.verse_ref_en}
    />
  );
}
