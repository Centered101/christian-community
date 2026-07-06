/** ตาราง + คอลัมน์ที่แก้ไขได้ (allow-list) สำหรับ API generic /api/admin/[table] */
export const ADMIN_TABLES: Record<string, string[]> = {
  members: ["name", "role", "avatar", "phone", "email", "birthday", "join_date", "calling", "testimony", "tags", "role_en", "calling_en", "testimony_en"],
  activities: ["title", "date", "description", "img", "title_en", "description_en"],
  events: ["event_date", "title", "color", "category", "description"],
  resources: ["title", "description", "category", "url", "file_url", "tags", "sort_order", "title_en", "description_en"],
  scripture_links: ["label", "sub", "url", "icon", "label_en", "sub_en"],
  videos: ["title", "video_url", "title_en"],
  chat_messages: ["pinned", "hidden"],
  site_settings: ["site_name", "site_subtitle", "address", "phone", "email", "hero_title", "hero_subtitle", "meta_title", "meta_description", "og_image", "verse_text", "verse_ref", "site_name_en", "site_subtitle_en", "hero_title_en", "hero_subtitle_en", "verse_text_en", "verse_ref_en"],
  home_topic_cards: ["icon", "title", "description", "color", "href", "title_en", "description_en"],
  faqs: ["question", "answer", "icon", "question_en", "answer_en"],
  home_highlights: ["icon", "title", "description", "img", "href", "cta_label", "title_en", "description_en", "cta_label_en"],
  nav_items: ["label", "is_visible", "sort_order"],
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
