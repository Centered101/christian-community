-- ═══════════════════════════════════════════════════════════════════════
--  Christian Community — database schema
--
--  วิธีใช้:
--  1. รัน supabase/schema.sql
--  2. รัน supabase/storage.sql
--  3. รัน supabase/seed.sql ถ้ามีข้อมูลเริ่มต้นที่ต้อง insert/upsert
--
--  รันได้ปลอดภัยแม้รันซ้ำ (ใช้ IF NOT EXISTS ทุกจุด)
--
--  ไฟล์นี้เก็บเฉพาะตาราง ฟังก์ชัน index และ RLS policy
-- ═══════════════════════════════════════════════════════════════════════


-- ┌─────────────────────────────────────────────────────────────────────┐
-- │  0. ระบบสิทธิ์ผู้ดูแล (Admin helper)                                    │
-- │     ใช้ตรวจสอบว่าใครมีสิทธิ์แก้ไขข้อมูล — ตารางอื่นๆ ทั้งหมดจะอ้างอิงมาที่นี่   │
-- └─────────────────────────────────────────────────────────────────────┘

create table if not exists public.admins (
  user_id     uuid primary key references auth.users (id) on delete cascade,
  created_at  timestamptz not null default now()
);

alter table public.admins enable row level security;

drop policy if exists "Admins can read admins" on public.admins;
create policy "Admins can read admins"
  on public.admins for select
  to authenticated
  using (auth.uid() = user_id);

-- คืนค่า true เมื่อผู้เรียกเป็นแอดมิน (ใช้ในทุก policy ด้านล่าง)
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from public.admins where user_id = auth.uid()
  );
$$;

-- หมายเหตุ: เว็บนี้ล็อกอินแอดมินด้วยระบบ cookie ของตัวเอง (ไม่ใช้ Supabase Auth
-- โดยตรง) การเขียนข้อมูลจริงจากหน้า /admin ทำผ่าน service-role key ฝั่งเซิร์ฟเวอร์
-- (ข้าม RLS) หลังตรวจสอบ cookie แล้ว — policy is_admin() ด้านล่างจึงทำหน้าที่เป็น
-- ด่านป้องกันสำรอง (กันไม่ให้ anon key เขียนข้อมูลตรงได้)


-- ┌─────────────────────────────────────────────────────────────────────┐
-- │  1. สมาชิก (Members)                                                    │
-- └─────────────────────────────────────────────────────────────────────┘

create table if not exists public.members (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  name_en     text not null default '',
  role        text not null default '',
  avatar      text,
  phone       text,
  email       text,
  birthday    text,
  address     text,
  join_date   text,
  calling     text,
  certificate_expires_at text,
  testimony   text,
  tags        text[] not null default '{}',
  sort_order  int not null default 0,
  created_at  timestamptz not null default now(),
  -- ฉบับภาษาอังกฤษ (ไม่บังคับ) — ถ้าว่างเว็บจะโชว์ค่าภาษาไทยแทนตอนสลับเป็น EN
  role_en      text not null default '',
  calling_en   text not null default '',
  testimony_en text not null default ''
);

-- เผื่อรันไฟล์นี้ซ้ำกับฐานข้อมูลที่สร้างตารางไว้ก่อนมีคอลัมน์ _en
alter table public.members add column if not exists name_en text not null default '';
alter table public.members add column if not exists role_en text not null default '';
alter table public.members add column if not exists calling_en text not null default '';
alter table public.members add column if not exists testimony_en text not null default '';
alter table public.members add column if not exists certificate_expires_at text;

alter table public.members enable row level security;

drop policy if exists "Public read members" on public.members;
create policy "Public read members" on public.members
  for select to anon, authenticated using (true);

drop policy if exists "Admin insert members" on public.members;
create policy "Admin insert members" on public.members
  for insert to authenticated with check (public.is_admin());

drop policy if exists "Admin update members" on public.members;
create policy "Admin update members" on public.members
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Admin delete members" on public.members;
create policy "Admin delete members" on public.members
  for delete to authenticated using (public.is_admin());


-- ┌─────────────────────────────────────────────────────────────────────┐
-- │  2. ปฏิทิน (Calendar events)                                            │
-- └─────────────────────────────────────────────────────────────────────┘

create table if not exists public.events (
  id          uuid primary key default gen_random_uuid(),
  event_date  date not null,
  title       text not null,
  color       text not null default '#2563eb',
  -- ชื่อหมวดหมู่ (จับคู่กับสี) — สัญลักษณ์ในหน้าปฏิทินสาธารณะดึงมาจากคู่ (สี, หมวดหมู่)
  -- ที่ไม่ซ้ำกันของ events ทั้งหมด ไม่ต้องมีตารางแยก
  category    text not null default '',
  -- คำอธิบายเพิ่มเติม แสดงเมื่อกดขยายดูวันนั้นๆ ในปฏิทิน
  description text not null default '',
  created_at  timestamptz not null default now()
);

create index if not exists events_event_date_idx on public.events (event_date);

alter table public.events enable row level security;

drop policy if exists "Public read events" on public.events;
create policy "Public read events" on public.events
  for select to anon, authenticated using (true);

drop policy if exists "Admin insert events" on public.events;
create policy "Admin insert events" on public.events
  for insert to authenticated with check (public.is_admin());

drop policy if exists "Admin update events" on public.events;
create policy "Admin update events" on public.events
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Admin delete events" on public.events;
create policy "Admin delete events" on public.events
  for delete to authenticated using (public.is_admin());


-- ┌─────────────────────────────────────────────────────────────────────┐
-- │  3. กิจกรรม (Activities)                                                │
-- └─────────────────────────────────────────────────────────────────────┘

create table if not exists public.activities (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  date        text not null,
  description text,
  img         text,
  sort_order  int not null default 0,
  created_at  timestamptz not null default now(),
  title_en       text not null default '',
  description_en text not null default ''
);

alter table public.activities add column if not exists title_en text not null default '';
alter table public.activities add column if not exists description_en text not null default '';

create index if not exists activities_sort_order_idx on public.activities (sort_order);

alter table public.activities enable row level security;

drop policy if exists "Public read activities" on public.activities;
create policy "Public read activities" on public.activities
  for select to anon, authenticated using (true);

drop policy if exists "Admin insert activities" on public.activities;
create policy "Admin insert activities" on public.activities
  for insert to authenticated with check (public.is_admin());

drop policy if exists "Admin update activities" on public.activities;
create policy "Admin update activities" on public.activities
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Admin delete activities" on public.activities;
create policy "Admin delete activities" on public.activities
  for delete to authenticated using (public.is_admin());


-- ┌─────────────────────────────────────────────────────────────────────┐
-- │  4. แชต (Chat messages — เหมือนกระดานข้อความ ไม่ต้องล็อกอิน)               │
-- └─────────────────────────────────────────────────────────────────────┘

create table if not exists public.chat_messages (
  id          uuid primary key default gen_random_uuid(),
  name        text not null default 'Guest',
  message     text not null,
  pinned      boolean not null default false,
  -- ข้อความที่แอดมินซ่อน จะไม่แสดงฝั่งผู้ใช้ทั่วไป (แต่แอดมินยังเห็นได้)
  hidden      boolean not null default false,
  created_at  timestamptz not null default now()
);

create index if not exists chat_messages_created_at_idx on public.chat_messages (created_at desc);

alter table public.chat_messages enable row level security;

drop policy if exists "Public read chat" on public.chat_messages;
create policy "Public read chat" on public.chat_messages
  for select to anon, authenticated using (hidden = false);

drop policy if exists "Admin read all chat" on public.chat_messages;
create policy "Admin read all chat" on public.chat_messages
  for select to authenticated using (public.is_admin());

drop policy if exists "Public insert chat" on public.chat_messages;
create policy "Public insert chat" on public.chat_messages
  for insert to anon, authenticated with check (true);

drop policy if exists "Admin update chat" on public.chat_messages;
create policy "Admin update chat" on public.chat_messages
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Admin delete chat" on public.chat_messages;
create policy "Admin delete chat" on public.chat_messages
  for delete to authenticated using (public.is_admin());


-- ┌─────────────────────────────────────────────────────────────────────┐
-- │  5. คลังค้นคว้า (Research library / Resources)                          │
-- └─────────────────────────────────────────────────────────────────────┘

create table if not exists public.resources (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  description text,
  category    text not null default 'ทั่วไป',
  url         text,
  file_url    text,
  tags        text[] not null default '{}',
  sort_order  int not null default 0,
  created_at  timestamptz not null default now(),
  title_en       text not null default '',
  description_en text not null default ''
);

alter table public.resources add column if not exists title_en text not null default '';
alter table public.resources add column if not exists description_en text not null default '';

create index if not exists resources_category_idx on public.resources (category);
create index if not exists resources_sort_order_idx on public.resources (sort_order);

alter table public.resources enable row level security;

drop policy if exists "Public read resources" on public.resources;
create policy "Public read resources" on public.resources
  for select to anon, authenticated using (true);

drop policy if exists "Admin insert resources" on public.resources;
create policy "Admin insert resources" on public.resources
  for insert to authenticated with check (public.is_admin());

drop policy if exists "Admin update resources" on public.resources;
create policy "Admin update resources" on public.resources
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Admin delete resources" on public.resources;
create policy "Admin delete resources" on public.resources
  for delete to authenticated using (public.is_admin());


-- ┌─────────────────────────────────────────────────────────────────────┐
-- │  6. ลิงก์พระคัมภีร์ (Scripture links — Holy Bible / Book of Mormon ฯลฯ)  │
-- │     ใช้ร่วมกันทั้งเมนู Bible dropdown, sheet บนมือถือ, และหน้า /bible        │
-- └─────────────────────────────────────────────────────────────────────┘

create table if not exists public.scripture_links (
  id          uuid primary key default gen_random_uuid(),
  label       text not null,
  sub         text,
  url         text not null,
  icon        text,
  sort_order  int default 0,
  created_at  timestamptz default now(),
  label_en    text not null default '',
  sub_en      text not null default ''
);

alter table public.scripture_links add column if not exists label_en text not null default '';
alter table public.scripture_links add column if not exists sub_en text not null default '';

alter table public.scripture_links enable row level security;

drop policy if exists "scripture_links_select" on public.scripture_links;
create policy "scripture_links_select" on public.scripture_links for select using (true);

drop policy if exists "scripture_links_insert" on public.scripture_links;
create policy "scripture_links_insert" on public.scripture_links for insert with check (is_admin());

drop policy if exists "scripture_links_update" on public.scripture_links;
create policy "scripture_links_update" on public.scripture_links for update using (is_admin());

drop policy if exists "scripture_links_delete" on public.scripture_links;
create policy "scripture_links_delete" on public.scripture_links for delete using (is_admin());


-- ┌─────────────────────────────────────────────────────────────────────┐
-- │  7. วิดีโอ (Videos)                                                     │
-- │     "is_featured" = วิดีโอหลักที่ปุ่ม "ดูวิดีโอ" (navbar/hero/Bible sheet)   │
-- │     เปิดโดยตรง — ตั้งได้ทีละ 1 อันเท่านั้น (unique index ด้านล่างบังคับไว้)    │
-- └─────────────────────────────────────────────────────────────────────┘

create table if not exists public.videos (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  video_url   text not null,
  is_featured boolean not null default false,
  sort_order  int default 0,
  created_at  timestamptz default now(),
  title_en    text not null default ''
);

alter table public.videos add column if not exists title_en text not null default '';

drop index if exists videos_single_featured;
create unique index videos_single_featured on public.videos ((is_featured)) where is_featured;

alter table public.videos enable row level security;

drop policy if exists "videos_select" on public.videos;
create policy "videos_select" on public.videos for select using (true);

drop policy if exists "videos_insert" on public.videos;
create policy "videos_insert" on public.videos for insert with check (is_admin());

drop policy if exists "videos_update" on public.videos;
create policy "videos_update" on public.videos for update using (is_admin());

drop policy if exists "videos_delete" on public.videos;
create policy "videos_delete" on public.videos for delete using (is_admin());


-- ┌─────────────────────────────────────────────────────────────────────┐
-- │  8. หน้าแรก (Home page content — topic cards / FAQ / highlights / nav)   │
-- └─────────────────────────────────────────────────────────────────────┘

-- 8.1 การ์ดหัวข้อ ("สำรวจศรัทธาของเรา")
create table if not exists public.home_topic_cards (
  id          uuid primary key default gen_random_uuid(),
  icon        text not null,
  title       text not null,
  description text not null,
  color       text not null default '#157493',
  href        text not null default '/',
  sort_order  int default 0,
  created_at  timestamptz default now(),
  title_en       text not null default '',
  description_en text not null default ''
);
alter table public.home_topic_cards add column if not exists title_en text not null default '';
alter table public.home_topic_cards add column if not exists description_en text not null default '';
alter table public.home_topic_cards enable row level security;
drop policy if exists "home_topic_cards_select" on public.home_topic_cards;
create policy "home_topic_cards_select" on public.home_topic_cards for select using (true);
drop policy if exists "home_topic_cards_insert" on public.home_topic_cards;
create policy "home_topic_cards_insert" on public.home_topic_cards for insert with check (is_admin());
drop policy if exists "home_topic_cards_update" on public.home_topic_cards;
create policy "home_topic_cards_update" on public.home_topic_cards for update using (is_admin());
drop policy if exists "home_topic_cards_delete" on public.home_topic_cards;
create policy "home_topic_cards_delete" on public.home_topic_cards for delete using (is_admin());

-- 8.2 คำถามที่พบบ่อย (FAQ)
create table if not exists public.faqs (
  id          uuid primary key default gen_random_uuid(),
  question    text not null,
  answer      text not null,
  icon        text not null default 'fa-solid fa-circle-question',
  sort_order  int default 0,
  created_at  timestamptz default now(),
  question_en text not null default '',
  answer_en   text not null default ''
);
alter table public.faqs add column if not exists question_en text not null default '';
alter table public.faqs add column if not exists answer_en text not null default '';
alter table public.faqs enable row level security;
drop policy if exists "faqs_select" on public.faqs;
create policy "faqs_select" on public.faqs for select using (true);
drop policy if exists "faqs_insert" on public.faqs;
create policy "faqs_insert" on public.faqs for insert with check (is_admin());
drop policy if exists "faqs_update" on public.faqs;
create policy "faqs_update" on public.faqs for update using (is_admin());
drop policy if exists "faqs_delete" on public.faqs;
create policy "faqs_delete" on public.faqs for delete using (is_admin());

-- 8.3 การ์ดแนะนำเพิ่มเติม ("สำรวจเพิ่มเติม")
create table if not exists public.home_highlights (
  id          uuid primary key default gen_random_uuid(),
  icon        text not null,
  title       text not null,
  description text not null,
  img         text not null default '',
  href        text not null default '/',
  cta_label   text not null default 'เรียนรู้เพิ่มเติม',
  sort_order  int default 0,
  created_at  timestamptz default now(),
  title_en       text not null default '',
  description_en text not null default '',
  cta_label_en   text not null default ''
);
alter table public.home_highlights add column if not exists title_en text not null default '';
alter table public.home_highlights add column if not exists description_en text not null default '';
alter table public.home_highlights add column if not exists cta_label_en text not null default '';
alter table public.home_highlights enable row level security;
drop policy if exists "home_highlights_select" on public.home_highlights;
create policy "home_highlights_select" on public.home_highlights for select using (true);
drop policy if exists "home_highlights_insert" on public.home_highlights;
create policy "home_highlights_insert" on public.home_highlights for insert with check (is_admin());
drop policy if exists "home_highlights_update" on public.home_highlights;
create policy "home_highlights_update" on public.home_highlights for update using (is_admin());
drop policy if exists "home_highlights_delete" on public.home_highlights;
create policy "home_highlights_delete" on public.home_highlights for delete using (is_admin());

-- 8.4 ข้อคิดทางวิญญาณบนหน้าแรก — เพิ่มได้หลายรายการและสุ่มแสดงในหน้าเว็บ
create table if not exists public.spiritual_thoughts (
  id          uuid primary key default gen_random_uuid(),
  text        text not null default '',
  text_en     text not null default '',
  ref         text not null default '',
  ref_en      text not null default '',
  is_visible  boolean not null default true,
  sort_order  integer not null default 0,
  created_at  timestamptz default now()
);
alter table public.spiritual_thoughts add column if not exists text_en text not null default '';
alter table public.spiritual_thoughts add column if not exists ref_en text not null default '';
alter table public.spiritual_thoughts add column if not exists is_visible boolean not null default true;
alter table public.spiritual_thoughts add column if not exists sort_order integer not null default 0;
alter table public.spiritual_thoughts enable row level security;
drop policy if exists "spiritual_thoughts_select" on public.spiritual_thoughts;
create policy "spiritual_thoughts_select" on public.spiritual_thoughts for select using (true);
drop policy if exists "spiritual_thoughts_insert" on public.spiritual_thoughts;
create policy "spiritual_thoughts_insert" on public.spiritual_thoughts for insert with check (is_admin());
drop policy if exists "spiritual_thoughts_update" on public.spiritual_thoughts;
create policy "spiritual_thoughts_update" on public.spiritual_thoughts for update using (is_admin());
drop policy if exists "spiritual_thoughts_delete" on public.spiritual_thoughts;
create policy "spiritual_thoughts_delete" on public.spiritual_thoughts for delete using (is_admin());

-- 8.5 เมนูนำทาง (Navbar links) — ข้อมูลเมนูและหัวข้อหน้าต้องมาจากตารางนี้เท่านั้น
create table if not exists public.nav_items (
  id          uuid primary key default gen_random_uuid(),
  key         text not null unique,
  href        text not null,
  label       text not null,
  label_en    text not null default '',
  page_title  text not null default '',
  page_title_en text not null default '',
  page_subtitle text not null default '',
  page_subtitle_en text not null default '',
  is_visible  boolean not null default true,
  sort_order  int default 0,
  created_at  timestamptz default now()
);
alter table public.nav_items add column if not exists label_en text not null default '';
alter table public.nav_items add column if not exists page_title text not null default '';
alter table public.nav_items add column if not exists page_title_en text not null default '';
alter table public.nav_items add column if not exists page_subtitle text not null default '';
alter table public.nav_items add column if not exists page_subtitle_en text not null default '';
alter table public.nav_items enable row level security;
drop policy if exists "nav_items_select" on public.nav_items;
create policy "nav_items_select" on public.nav_items for select using (true);
drop policy if exists "nav_items_insert" on public.nav_items;
create policy "nav_items_insert" on public.nav_items for insert with check (is_admin());
drop policy if exists "nav_items_update" on public.nav_items;
create policy "nav_items_update" on public.nav_items for update using (is_admin());
drop policy if exists "nav_items_delete" on public.nav_items;
create policy "nav_items_delete" on public.nav_items for delete using (is_admin());


-- ┌─────────────────────────────────────────────────────────────────────┐
-- │  9. ตั้งค่าระบบ (Settings — /admin/settings)                            │
-- └─────────────────────────────────────────────────────────────────────┘

-- 9.1 บัญชีผู้ดูแลระบบ (username/password ที่ตั้งจากหน้า /admin/settings)
-- ไม่ seed แถวเริ่มต้นไว้ — แอปจะ fallback ไปใช้ ADMIN_USERNAME/ADMIN_PASSWORD
-- จาก .env.local จนกว่าแอดมินจะเปลี่ยนรหัสผ่านครั้งแรกจากหน้าตั้งค่า
create table if not exists public.admin_settings (
  id            smallint primary key default 1,
  username      text not null,
  password_hash text not null,
  password_salt text not null,
  updated_at    timestamptz default now(),
  constraint admin_settings_singleton check (id = 1)
);
alter table public.admin_settings enable row level security;
-- ตั้งใจไม่มี policy ใดๆ เลย — เข้าถึงได้เฉพาะ service-role client
-- (ฝั่งเซิร์ฟเวอร์ หลังตรวจสอบ cookie แอดมินแล้ว) เท่านั้น

-- 9.2 ข้อมูลเว็บไซต์ + Hero หน้าแรก + ข้อคิดทางวิญญาณ + SEO (แถวเดียว id=1)
create table if not exists public.site_settings (
  id                smallint primary key default 1,
  site_name         text not null default '',
  site_subtitle     text not null default '',
  address           text not null default '',
  phone             text not null default '',
  email             text not null default '',
  -- Hero หน้าแรก — ใช้ \n ขึ้นบรรทัดใหม่
  hero_title        text not null default '',
  hero_subtitle     text not null default '',
  -- ข้อคิดทางวิญญาณ (การ์ดพระคัมภีร์บนหน้าแรก)
  verse_text        text not null default '',
  verse_ref         text not null default '',
  -- SEO — ใช้โดย generateMetadata() ใน app/layout.tsx
  meta_title        text not null default '',
  meta_description  text not null default '',
  og_image          text not null default '',
  updated_at        timestamptz default now(),
  constraint site_settings_singleton check (id = 1),
  -- ฉบับภาษาอังกฤษ (ไม่บังคับ) — ใช้ตอนสลับเป็น EN แทนที่ค่าไทยด้านบน
  site_name_en      text not null default '',
  site_subtitle_en  text not null default '',
  hero_title_en     text not null default '',
  hero_subtitle_en  text not null default '',
  verse_text_en     text not null default '',
  verse_ref_en      text not null default '',
  find_church_image text not null default '',
  find_church_eyebrow text not null default '',
  find_church_eyebrow_en text not null default '',
  find_church_title text not null default '',
  find_church_title_en text not null default '',
  find_church_body text not null default '',
  find_church_body_en text not null default '',
  find_church_time text not null default '',
  find_church_time_en text not null default '',
  find_church_primary_label text not null default '',
  find_church_primary_label_en text not null default '',
  find_church_primary_url text not null default '',
  find_church_secondary_label text not null default '',
  find_church_secondary_label_en text not null default '',
  find_church_secondary_url text not null default '',
  home_quote text not null default '',
  home_quote_en text not null default '',
  home_quote_author text not null default '',
  home_quote_author_en text not null default '',
  home_cta_eyebrow text not null default '',
  home_cta_eyebrow_en text not null default '',
  home_cta_primary_label text not null default '',
  home_cta_primary_label_en text not null default '',
  home_cta_primary_url text not null default '',
  home_cta_secondary_label text not null default '',
  home_cta_secondary_label_en text not null default '',
  home_cta_secondary_url text not null default '',
  home_cta_tertiary_label text not null default '',
  home_cta_tertiary_label_en text not null default '',
  home_cta_tertiary_url text not null default ''
);

alter table public.site_settings add column if not exists site_name_en text not null default '';
alter table public.site_settings add column if not exists site_subtitle_en text not null default '';
alter table public.site_settings add column if not exists hero_title_en text not null default '';
alter table public.site_settings add column if not exists hero_subtitle_en text not null default '';
alter table public.site_settings add column if not exists verse_text_en text not null default '';
alter table public.site_settings add column if not exists verse_ref_en text not null default '';
alter table public.site_settings add column if not exists find_church_image text not null default '';
alter table public.site_settings add column if not exists find_church_eyebrow text not null default '';
alter table public.site_settings add column if not exists find_church_eyebrow_en text not null default '';
alter table public.site_settings add column if not exists find_church_title text not null default '';
alter table public.site_settings add column if not exists find_church_title_en text not null default '';
alter table public.site_settings add column if not exists find_church_body text not null default '';
alter table public.site_settings add column if not exists find_church_body_en text not null default '';
alter table public.site_settings add column if not exists find_church_time text not null default '';
alter table public.site_settings add column if not exists find_church_time_en text not null default '';
alter table public.site_settings add column if not exists find_church_primary_label text not null default '';
alter table public.site_settings add column if not exists find_church_primary_label_en text not null default '';
alter table public.site_settings add column if not exists find_church_primary_url text not null default '';
alter table public.site_settings add column if not exists find_church_secondary_label text not null default '';
alter table public.site_settings add column if not exists find_church_secondary_label_en text not null default '';
alter table public.site_settings add column if not exists find_church_secondary_url text not null default '';
alter table public.site_settings add column if not exists home_quote text not null default '';
alter table public.site_settings add column if not exists home_quote_en text not null default '';
alter table public.site_settings add column if not exists home_quote_author text not null default '';
alter table public.site_settings add column if not exists home_quote_author_en text not null default '';
alter table public.site_settings add column if not exists home_cta_eyebrow text not null default '';
alter table public.site_settings add column if not exists home_cta_eyebrow_en text not null default '';
alter table public.site_settings add column if not exists home_cta_primary_label text not null default '';
alter table public.site_settings add column if not exists home_cta_primary_label_en text not null default '';
alter table public.site_settings add column if not exists home_cta_primary_url text not null default '';
alter table public.site_settings add column if not exists home_cta_secondary_label text not null default '';
alter table public.site_settings add column if not exists home_cta_secondary_label_en text not null default '';
alter table public.site_settings add column if not exists home_cta_secondary_url text not null default '';
alter table public.site_settings add column if not exists home_cta_tertiary_label text not null default '';
alter table public.site_settings add column if not exists home_cta_tertiary_label_en text not null default '';
alter table public.site_settings add column if not exists home_cta_tertiary_url text not null default '';

alter table public.site_settings enable row level security;

drop policy if exists "site_settings_select" on public.site_settings;
create policy "site_settings_select" on public.site_settings for select using (true);
-- เขียนได้เฉพาะ service-role client (ฝั่งเซิร์ฟเวอร์) เช่นเดียวกับ admin_settings


-- ┌─────────────────────────────────────────────────────────────────────┐
-- │  10. บันทึกการเข้าใช้งาน (Access logs — หน้า /login ของผู้ใช้ทั่วไป)      │
-- │      เลขสมาชิกที่กรอกไม่ได้ตรวจสอบกับตารางไหนเลย — ใครพิมพ์อะไรก็เข้าได้    │
-- │      ตารางนี้แค่บันทึกไว้ให้แอดมินดูย้อนหลังว่าใครอ้างว่าเข้ามาเมื่อไหร่      │
-- └─────────────────────────────────────────────────────────────────────┘

create table if not exists public.access_logs (
  id          uuid primary key default gen_random_uuid(),
  member_id   text not null,
  user_agent  text,
  created_at  timestamptz not null default now()
);

create index if not exists access_logs_created_at_idx on public.access_logs (created_at desc);

alter table public.access_logs enable row level security;

-- ตั้งใจไม่มี select policy เลย — อ่านได้เฉพาะ service-role client
-- (หน้า /admin/access-logs) เท่านั้น กัน anon key อ่าน log ของคนอื่นได้
drop policy if exists "access_logs_insert" on public.access_logs;
create policy "access_logs_insert" on public.access_logs
  for insert to anon, authenticated with check (true);


-- ═══════════════════════════════════════════════════════════════════════
--  เสร็จแล้ว! รัน supabase/storage.sql ต่อ แล้วใส่ข้อมูลจริงผ่านหน้า /admin
--  หรือเพิ่ม seed/upsert ใน supabase/seed.sql
-- ═══════════════════════════════════════════════════════════════════════
