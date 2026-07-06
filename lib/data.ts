import { getSupabaseServer } from "./supabase/server";
import { getSupabaseAdmin } from "./supabase/admin";
import type { AccessLog, ActivityItem, ChatMessage, EventItem, Faq, HomeHighlight, Member, NavItem, Resource, ScriptureLink, SiteSettings, TopicCard, VideoItem } from "./types";

type MemberRow = {
  id: string;
  name: string;
  role: string;
  avatar: string | null;
  phone: string | null;
  email: string | null;
  birthday: string | null;
  address: string | null;
  join_date: string | null;
  calling: string | null;
  testimony: string | null;
  tags: string[] | null;
  sort_order: number | null;
  role_en: string | null;
  calling_en: string | null;
  testimony_en: string | null;
};

type EventRow = {
  id: string;
  event_date: string;
  title: string;
  color: string | null;
  category: string | null;
  description: string | null;
};

type ActivityRow = {
  id: string;
  title: string;
  date: string;
  description: string | null;
  img: string | null;
  sort_order: number | null;
  title_en: string | null;
  description_en: string | null;
};

function rowToMember(r: MemberRow): Member {
  return {
    id: r.id,
    name: r.name,
    role: r.role,
    avatar: r.avatar ?? "",
    phone: r.phone ?? "",
    email: r.email ?? "",
    birthday: r.birthday ?? "",
    address: r.address ?? "",
    joinDate: r.join_date ?? "",
    calling: r.calling ?? "",
    testimony: r.testimony ?? "",
    tags: r.tags ?? [],
    role_en: r.role_en ?? "",
    calling_en: r.calling_en ?? "",
    testimony_en: r.testimony_en ?? "",
  };
}

function rowToEvent(r: EventRow): EventItem {
  return {
    id: r.id,
    date: r.event_date,
    title: r.title,
    color: r.color ?? "#2563eb",
    category: r.category ?? "",
    description: r.description ?? "",
  };
}

function requireClient() {
  const sb = getSupabaseServer();
  if (!sb) throw new Error("Supabase is not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.");
  return sb;
}

export async function getMembers(): Promise<Member[]> {
  const sb = requireClient();
  const { data, error } = await sb
    .from("members")
    .select("id,name,role,avatar,phone,email,birthday,address,join_date,calling,testimony,tags,sort_order,role_en,calling_en,testimony_en")
    .order("sort_order", { ascending: true });
  if (error) throw new Error(`Failed to load members: ${error.message}`);
  return (data as MemberRow[]).map(rowToMember);
}

export async function getActivities(): Promise<ActivityItem[]> {
  const sb = requireClient();
  const { data, error } = await sb
    .from("activities")
    .select("id,title,date,description,img,sort_order,title_en,description_en")
    .order("sort_order", { ascending: true });
  if (error) throw new Error(`Failed to load activities: ${error.message}`);
  return (data as ActivityRow[]).map((r) => ({
    id: r.id,
    title: r.title,
    date: r.date,
    description: r.description ?? "",
    img: r.img ?? "",
    title_en: r.title_en ?? "",
    description_en: r.description_en ?? "",
  }));
}

export async function getEvents(): Promise<EventItem[]> {
  const sb = requireClient();
  const { data, error } = await sb
    .from("events")
    .select("id,event_date,title,color,category,description")
    .order("event_date", { ascending: true });
  if (error) throw new Error(`Failed to load events: ${error.message}`);
  return (data as EventRow[]).map(rowToEvent);
}

export async function getChatMessages(limit = 100): Promise<ChatMessage[]> {
  const sb = requireClient();
  const { data, error } = await sb
    .from("chat_messages")
    .select("id,name,message,pinned,hidden,created_at")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw new Error(`Failed to load chat: ${error.message}`);
  return (data as ChatMessage[]);
}

type ResourceRow = {
  id: string;
  title: string;
  title_en: string | null;
  description: string | null;
  description_en: string | null;
  category: string;
  url: string | null;
  file_url: string | null;
  tags: string[] | null;
  sort_order: number | null;
};

export async function getResources(): Promise<Resource[]> {
  const sb = requireClient();
  const { data, error } = await sb
    .from("resources")
    .select("id,title,title_en,description,description_en,category,url,file_url,tags,sort_order")
    .order("sort_order", { ascending: true });
  if (error) throw new Error(`Failed to load resources: ${error.message}`);
  return (data as ResourceRow[]).map((r) => ({
    id: r.id,
    title: r.title,
    title_en: r.title_en ?? "",
    description: r.description ?? "",
    description_en: r.description_en ?? "",
    category: r.category,
    url: r.url ?? "",
    file_url: r.file_url ?? "",
    tags: r.tags ?? [],
    sort_order: r.sort_order ?? 0,
  }));
}

type ScriptureLinkRow = {
  id: string;
  label: string;
  sub: string | null;
  url: string;
  icon: string | null;
  sort_order: number | null;
  label_en: string | null;
  sub_en: string | null;
};

export async function getScriptureLinks(): Promise<ScriptureLink[]> {
  const sb = requireClient();
  const { data, error } = await sb
    .from("scripture_links")
    .select("id,label,sub,url,icon,sort_order,label_en,sub_en")
    .order("sort_order", { ascending: true });
  if (error) throw new Error(`Failed to load scripture links: ${error.message}`);
  return (data as ScriptureLinkRow[]).map((r) => ({
    id: r.id,
    label: r.label,
    sub: r.sub ?? "",
    url: r.url,
    icon: r.icon ?? "",
    label_en: r.label_en ?? "",
    sub_en: r.sub_en ?? "",
  }));
}

type VideoRow = {
  id: string;
  title: string;
  title_en: string | null;
  video_url: string;
  sort_order: number | null;
  is_featured: boolean | null;
};

export async function getVideos(): Promise<VideoItem[]> {
  const sb = requireClient();
  const { data, error } = await sb
    .from("videos")
    .select("id,title,title_en,video_url,sort_order,is_featured")
    .order("sort_order", { ascending: true });
  if (error) throw new Error(`Failed to load videos: ${error.message}`);
  return (data as VideoRow[]).map((r) => ({
    id: r.id,
    title: r.title,
    title_en: r.title_en ?? "",
    video_url: r.video_url,
    is_featured: r.is_featured ?? false,
  }));
}

const DEFAULT_SITE_SETTINGS: SiteSettings = {
  site_name: "ศาสนาจักรของพระเยซูคริสต์",
  site_subtitle: "ลพบุรี วอร์ด",
  address: "",
  phone: "",
  email: "",
  hero_title: "พระผู้เป็นเจ้าทรง\nรู้จักและรักท่าน",
  hero_subtitle: "ค้นพบจุดประสงค์ ความสงบ และชุมชนที่อบอุ่น\nในพระกิตติคุณของพระเยซูคริสต์",
  meta_title: "ศาสนาจักรของพระเยซูคริสต์แห่งวิสุทธิชนยุคสุดท้าย ลพบุรี วอร์ด",
  meta_description: "ชุมชนวิสุทธิชนยุคสุดท้าย ลพบุรี วอร์ด — สถานที่แห่งศรัทธา ความหวัง และสันติสุข",
  og_image: "",
  verse_text: "ร่างกายของพวกท่านเป็นวิหารของพระวิญญาณบริสุทธิ์",
  verse_ref: "1 โครินธ์ 6:19-20",
  site_name_en: "",
  site_subtitle_en: "",
  hero_title_en: "",
  hero_subtitle_en: "",
  verse_text_en: "",
  verse_ref_en: "",
};

type SiteSettingsRow = {
  id: number;
  site_name: string | null;
  site_subtitle: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  hero_title: string | null;
  hero_subtitle: string | null;
  meta_title: string | null;
  meta_description: string | null;
  og_image: string | null;
  verse_text: string | null;
  verse_ref: string | null;
  site_name_en: string | null;
  site_subtitle_en: string | null;
  hero_title_en: string | null;
  hero_subtitle_en: string | null;
  verse_text_en: string | null;
  verse_ref_en: string | null;
};

export async function getSiteSettings(): Promise<SiteSettings> {
  const sb = getSupabaseServer();
  if (!sb) return DEFAULT_SITE_SETTINGS;

  const { data, error } = await sb
    .from("site_settings")
    .select("id,site_name,site_subtitle,address,phone,email,hero_title,hero_subtitle,meta_title,meta_description,og_image,verse_text,verse_ref,site_name_en,site_subtitle_en,hero_title_en,hero_subtitle_en,verse_text_en,verse_ref_en")
    .eq("id", 1)
    .maybeSingle();
  if (error || !data) return DEFAULT_SITE_SETTINGS;

  const row = data as SiteSettingsRow;
  return {
    id: String(row.id),
    site_name: row.site_name || DEFAULT_SITE_SETTINGS.site_name,
    site_subtitle: row.site_subtitle || DEFAULT_SITE_SETTINGS.site_subtitle,
    address: row.address ?? "",
    phone: row.phone ?? "",
    email: row.email ?? "",
    hero_title: row.hero_title || DEFAULT_SITE_SETTINGS.hero_title,
    hero_subtitle: row.hero_subtitle || DEFAULT_SITE_SETTINGS.hero_subtitle,
    meta_title: row.meta_title || DEFAULT_SITE_SETTINGS.meta_title,
    meta_description: row.meta_description || DEFAULT_SITE_SETTINGS.meta_description,
    og_image: row.og_image ?? "",
    verse_text: row.verse_text || DEFAULT_SITE_SETTINGS.verse_text,
    verse_ref: row.verse_ref || DEFAULT_SITE_SETTINGS.verse_ref,
    site_name_en: row.site_name_en ?? "",
    site_subtitle_en: row.site_subtitle_en ?? "",
    hero_title_en: row.hero_title_en ?? "",
    hero_subtitle_en: row.hero_subtitle_en ?? "",
    verse_text_en: row.verse_text_en ?? "",
    verse_ref_en: row.verse_ref_en ?? "",
  };
}

type TopicCardRow = {
  id: string; icon: string; title: string; description: string; color: string; href: string; sort_order: number | null;
  title_en: string | null; description_en: string | null;
};

export async function getTopicCards(): Promise<TopicCard[]> {
  const sb = requireClient();
  const { data, error } = await sb
    .from("home_topic_cards")
    .select("id,icon,title,description,color,href,sort_order,title_en,description_en")
    .order("sort_order", { ascending: true });
  if (error) throw new Error(`Failed to load topic cards: ${error.message}`);
  return (data as TopicCardRow[]).map((r) => ({
    id: r.id,
    icon: r.icon,
    title: r.title,
    description: r.description,
    color: r.color,
    href: r.href,
    title_en: r.title_en ?? "",
    description_en: r.description_en ?? "",
  }));
}

type FaqRow = {
  id: string; question: string; answer: string; icon: string; sort_order: number | null;
  question_en: string | null; answer_en: string | null;
};

export async function getFaqs(): Promise<Faq[]> {
  const sb = requireClient();
  const { data, error } = await sb
    .from("faqs")
    .select("id,question,answer,icon,sort_order,question_en,answer_en")
    .order("sort_order", { ascending: true });
  if (error) throw new Error(`Failed to load FAQs: ${error.message}`);
  return (data as FaqRow[]).map((r) => ({
    id: r.id,
    question: r.question,
    answer: r.answer,
    icon: r.icon,
    question_en: r.question_en ?? "",
    answer_en: r.answer_en ?? "",
  }));
}

type HomeHighlightRow = {
  id: string;
  icon: string;
  title: string;
  description: string;
  img: string;
  href: string;
  cta_label: string;
  sort_order: number | null;
  title_en: string | null;
  description_en: string | null;
  cta_label_en: string | null;
};

export async function getHomeHighlights(): Promise<HomeHighlight[]> {
  const sb = requireClient();
  const { data, error } = await sb
    .from("home_highlights")
    .select("id,icon,title,description,img,href,cta_label,sort_order,title_en,description_en,cta_label_en")
    .order("sort_order", { ascending: true });
  if (error) throw new Error(`Failed to load home highlights: ${error.message}`);
  return (data as HomeHighlightRow[]).map((r) => ({
    id: r.id,
    icon: r.icon,
    title: r.title,
    description: r.description,
    img: r.img,
    href: r.href,
    cta_label: r.cta_label,
    title_en: r.title_en ?? "",
    description_en: r.description_en ?? "",
    cta_label_en: r.cta_label_en ?? "",
  }));
}

type NavItemRow = {
  id: string;
  key: string;
  href: string;
  label: string;
  is_visible: boolean;
  sort_order: number | null;
};

export async function getNavItems(): Promise<NavItem[]> {
  const sb = requireClient();
  const { data, error } = await sb
    .from("nav_items")
    .select("id,key,href,label,is_visible,sort_order")
    .order("sort_order", { ascending: true });
  if (error) throw new Error(`Failed to load nav items: ${error.message}`);
  return (data as NavItemRow[]).map((r) => ({
    id: r.id,
    key: r.key,
    href: r.href,
    label: r.label,
    is_visible: r.is_visible,
    sort_order: r.sort_order ?? 0,
  }));
}

type AccessLogRow = { id: string; member_id: string; user_agent: string | null; created_at: string };

/**
 * access_logs has no public select policy (privacy — see migration 0016), so
 * this must go through the service-role client instead of requireClient().
 * Only call this from /admin pages, which are already gated by middleware.
 */
export async function getAccessLogs(limit = 200): Promise<AccessLog[]> {
  const sb = getSupabaseAdmin();
  if (!sb) throw new Error("Supabase is not configured.");
  const { data, error } = await sb
    .from("access_logs")
    .select("id,member_id,user_agent,created_at")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw new Error(`Failed to load access logs: ${error.message}`);
  return (data as AccessLogRow[]).map((r) => ({
    id: r.id,
    member_id: r.member_id,
    user_agent: r.user_agent ?? "",
    created_at: r.created_at,
  }));
}
