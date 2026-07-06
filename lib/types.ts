export type SectionName =
  | "home"
  | "calendar"
  | "members"
  | "activities"
  | "อื่นๆ"
  | "chat"
  | "shop"
  | "bible";

/** สมาชิกในชุมชน — เก็บในตาราง Supabase `members` */
export type Member = {
  id?: string;
  name: string;
  role: string;
  avatar: string;
  phone: string;
  email: string;
  birthday: string;
  address: string;
  joinDate: string;
  calling: string;
  testimony: string;
  tags: string[];
  /** ฉบับภาษาอังกฤษ (ไม่บังคับ) — ใช้แสดงตอนสลับเป็น EN */
  role_en: string;
  calling_en: string;
  testimony_en: string;
};

/** กิจกรรมในปฏิทิน — เก็บในตาราง Supabase `events` */
export type EventItem = {
  id?: string;
  /** วันที่แบบ ISO string: YYYY-MM-DD */
  date: string;
  title: string;
  color: string;
  /** ชื่อหมวดหมู่ที่จับคู่กับสี — สัญลักษณ์ในหน้าปฏิทินสาธารณะดึงมาจากคู่ (สี, หมวดหมู่) ที่ไม่ซ้ำกัน */
  category: string;
  description: string;
};

/** โพสต์กิจกรรม — เก็บในตาราง Supabase `activities` */
export type ActivityItem = {
  id?: string;
  title: string;
  date: string;
  description: string;
  img: string;
  title_en: string;
  description_en: string;
};

/** ข้อความแชตที่เก็บใน Supabase */
export type ChatMessage = {
  id?: string;
  name: string;
  message: string;
  pinned?: boolean;
  hidden?: boolean;
  created_at?: string;
};

/** ทรัพยากรในคลังค้นคว้า — เก็บในตาราง Supabase `resources` */
export type Resource = {
  id?: string;
  title: string;
  title_en: string;
  description: string;
  description_en: string;
  category: string;
  url: string;
  file_url: string;
  tags: string[];
  sort_order?: number;
};

/** ลิงก์พระคัมภีร์ภายนอก (Holy Bible, Book of Mormon ฯลฯ) — เก็บในตาราง Supabase `scripture_links` */
export type ScriptureLink = {
  id?: string;
  label: string;
  sub: string;
  url: string;
  icon: string;
  label_en: string;
  sub_en: string;
};

/** วิดีโอ — เก็บในตาราง Supabase `videos` */
export type VideoItem = {
  id?: string;
  title: string;
  title_en: string;
  video_url: string;
  /** ตั้งเป็นวิดีโอหลักได้ทีละ 1 อัน — แสดงที่ปุ่ม "ดูวิดีโอ" หลัก (navbar, hero, Bible sheet) */
  is_featured: boolean;
};

/** ชื่อเว็บไซต์/ข้อมูลติดต่อทั้งเว็บ — เก็บในแถวเดียว (id=1) ของตาราง `site_settings` */
export type SiteSettings = {
  id?: string;
  site_name: string;
  site_subtitle: string;
  address: string;
  phone: string;
  email: string;
  /** หัวข้อหลักของ Hero หน้าแรก — ใช้ตัวอักษรขึ้นบรรทัดใหม่แบ่งบรรทัด */
  hero_title: string;
  /** ข้อความรองของ Hero หน้าแรก — ใช้ตัวอักษรขึ้นบรรทัดใหม่แบ่งบรรทัด */
  hero_subtitle: string;
  /** <title> ของทั้งเว็บ — ถ้าว่างจะใช้ site_name แทน */
  meta_title: string;
  /** meta description สำหรับเสิร์ชเอนจินและตัวอย่างตอนแชร์ลิงก์ */
  meta_description: string;
  /** URL รูปภาพตอนแชร์ลิงก์ (Open Graph) */
  og_image: string;
  /** ข้อคิดทางวิญญาณบนหน้าแรก */
  verse_text: string;
  verse_ref: string;
  /** ฉบับภาษาอังกฤษ (ไม่บังคับ) — ใช้แสดงตอนสลับเป็น EN */
  site_name_en: string;
  site_subtitle_en: string;
  hero_title_en: string;
  hero_subtitle_en: string;
  verse_text_en: string;
  verse_ref_en: string;
};

/** การ์ดหัวข้อบนหน้าแรก ("สำรวจศรัทธาของเรา") — เก็บในตาราง Supabase `home_topic_cards` */
export type TopicCard = {
  id?: string;
  icon: string;
  title: string;
  description: string;
  color: string;
  href: string;
  title_en: string;
  description_en: string;
};

/** คำถามที่พบบ่อยบนหน้าแรก — เก็บในตาราง Supabase `faqs` */
export type Faq = {
  id?: string;
  question: string;
  answer: string;
  icon: string;
  question_en: string;
  answer_en: string;
};

/** การ์ดแนะนำเพิ่มเติมบนหน้าแรก ("สำรวจเพิ่มเติม") — เก็บในตาราง Supabase `home_highlights` */
export type HomeHighlight = {
  id?: string;
  icon: string;
  title: string;
  description: string;
  img: string;
  href: string;
  cta_label: string;
  title_en: string;
  description_en: string;
  cta_label_en: string;
};

/** ลิงก์เมนู navbar — เก็บในตาราง Supabase `nav_items` ชุดหน้า (href) คงที่ แอดมินเปลี่ยนชื่อ/ลำดับ/ซ่อน-แสดงได้เท่านั้น */
export type NavItem = {
  id?: string;
  key: string;
  href: string;
  label: string;
  is_visible: boolean;
  sort_order?: number;
};

/** การ "เข้าใช้งาน" หนึ่งครั้งจากหน้า /login สาธารณะ — เลขสมาชิกไม่ได้ถูกตรวจสอบ แค่บันทึกไว้เท่านั้น */
export type AccessLog = {
  id?: string;
  member_id: string;
  user_agent: string;
  created_at?: string;
};
