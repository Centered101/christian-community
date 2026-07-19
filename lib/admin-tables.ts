/** ตาราง + คอลัมน์ที่แก้ไขได้ (allow-list) สำหรับ API generic /api/admin/[table] */
export const ADMIN_TABLES: Record<string, string[]> = {
  members: ["name", "name_en", "role", "avatar", "phone", "email", "birthday", "address", "join_date", "calling", "testimony", "tags", "role_en", "calling_en", "testimony_en"],
  activities: ["title", "date", "description", "img", "title_en", "description_en"],
  events: ["event_date", "title", "color", "category", "description"],
  resources: ["title", "description", "category", "url", "file_url", "tags", "sort_order", "title_en", "description_en"],
  scripture_links: ["label", "sub", "url", "icon", "label_en", "sub_en"],
  videos: ["title", "video_url", "title_en"],
  chat_messages: ["pinned", "hidden"],
  site_settings: ["site_name", "site_subtitle", "address", "phone", "email", "hero_title", "hero_subtitle", "meta_title", "meta_description", "og_image", "verse_text", "verse_ref", "site_name_en", "site_subtitle_en", "hero_title_en", "hero_subtitle_en", "verse_text_en", "verse_ref_en", "find_church_image", "find_church_eyebrow", "find_church_eyebrow_en", "find_church_title", "find_church_title_en", "find_church_body", "find_church_body_en", "find_church_time", "find_church_time_en", "find_church_primary_label", "find_church_primary_label_en", "find_church_primary_url", "find_church_secondary_label", "find_church_secondary_label_en", "find_church_secondary_url", "home_quote", "home_quote_en", "home_quote_author", "home_quote_author_en", "home_cta_eyebrow", "home_cta_eyebrow_en", "home_cta_primary_label", "home_cta_primary_label_en", "home_cta_primary_url", "home_cta_secondary_label", "home_cta_secondary_label_en", "home_cta_secondary_url", "home_cta_tertiary_label", "home_cta_tertiary_label_en", "home_cta_tertiary_url"],
  home_topic_cards: ["icon", "title", "description", "color", "href", "title_en", "description_en"],
  faqs: ["question", "answer", "icon", "question_en", "answer_en"],
  spiritual_thoughts: ["text", "text_en", "ref", "ref_en", "is_visible", "sort_order"],
  home_highlights: ["icon", "title", "description", "img", "href", "cta_label", "title_en", "description_en", "cta_label_en"],
  nav_items: ["key", "href", "label", "label_en", "page_title", "page_title_en", "page_subtitle", "page_subtitle_en", "is_visible", "sort_order"],
  access_logs: [],
};

export function sanitizePayload(table: string, body: unknown): Record<string, unknown> | null {
  const allowed = ADMIN_TABLES[table];
  if (!allowed || typeof body !== "object" || body === null) return null;
  const out: Record<string, unknown> = {};
  for (const key of allowed) {
    if (key in (body as Record<string, unknown>)) out[key] = (body as Record<string, unknown>)[key];
  }
  return out;
}
