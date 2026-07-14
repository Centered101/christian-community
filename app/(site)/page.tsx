import type { Metadata } from "next";
import HomeSection from "@/components/sections/home-section";
import { getFaqs, getHomeHighlights, getSiteSettings, getSpiritualThoughts, getTopicCards } from "@/lib/data";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "หน้าหลัก | ศาสนาจักรของพระเยซูคริสต์" };

export default async function HomePage() {
  const settings = await getSiteSettings();

  let topicCards: Awaited<ReturnType<typeof getTopicCards>> = [];
  let faqs: Awaited<ReturnType<typeof getFaqs>> = [];
  let highlights: Awaited<ReturnType<typeof getHomeHighlights>> = [];
  let spiritualThoughts: Awaited<ReturnType<typeof getSpiritualThoughts>> = [];
  try {
    [topicCards, faqs, highlights, spiritualThoughts] = await Promise.all([
      getTopicCards(),
      getFaqs(),
      getHomeHighlights(),
      getSpiritualThoughts({ visibleOnly: true }),
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
      spiritualThoughts={spiritualThoughts}
      siteName={settings.site_name}
      siteNameEn={settings.site_name_en}
      siteSubtitle={settings.site_subtitle}
      siteSubtitleEn={settings.site_subtitle_en}
      findChurchImage={settings.find_church_image}
      findChurchEyebrow={settings.find_church_eyebrow}
      findChurchEyebrowEn={settings.find_church_eyebrow_en}
      findChurchTitle={settings.find_church_title}
      findChurchTitleEn={settings.find_church_title_en}
      findChurchBody={settings.find_church_body}
      findChurchBodyEn={settings.find_church_body_en}
      findChurchTime={settings.find_church_time}
      findChurchTimeEn={settings.find_church_time_en}
      findChurchPrimaryLabel={settings.find_church_primary_label}
      findChurchPrimaryLabelEn={settings.find_church_primary_label_en}
      findChurchPrimaryUrl={settings.find_church_primary_url}
      findChurchSecondaryLabel={settings.find_church_secondary_label}
      findChurchSecondaryLabelEn={settings.find_church_secondary_label_en}
      findChurchSecondaryUrl={settings.find_church_secondary_url}
      homeQuote={settings.home_quote}
      homeQuoteEn={settings.home_quote_en}
      homeQuoteAuthor={settings.home_quote_author}
      homeQuoteAuthorEn={settings.home_quote_author_en}
      homeCtaEyebrow={settings.home_cta_eyebrow}
      homeCtaEyebrowEn={settings.home_cta_eyebrow_en}
      homeCtaPrimaryLabel={settings.home_cta_primary_label}
      homeCtaPrimaryLabelEn={settings.home_cta_primary_label_en}
      homeCtaPrimaryUrl={settings.home_cta_primary_url}
      homeCtaSecondaryLabel={settings.home_cta_secondary_label}
      homeCtaSecondaryLabelEn={settings.home_cta_secondary_label_en}
      homeCtaSecondaryUrl={settings.home_cta_secondary_url}
      homeCtaTertiaryLabel={settings.home_cta_tertiary_label}
      homeCtaTertiaryLabelEn={settings.home_cta_tertiary_label_en}
      homeCtaTertiaryUrl={settings.home_cta_tertiary_url}
    />
  );
}
