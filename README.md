# Christian Community — Next.js + Supabase

เว็บชุมชน "Christian Community" (Young Single Adults — Lopburi Ward) สร้างด้วย
**Next.js (App Router) + Supabase** พร้อมระบบจัดการเนื้อหา (admin CMS) ในตัว —
เนื้อหาแทบทุกส่วนของเว็บไซต์แก้ไขได้ผ่านหน้า `/admin` โดยไม่ต้องแตะโค้ด

## ฟีเจอร์

**หน้าเว็บสาธารณะ**
- หน้าแรก: hero, การ์ดหัวข้อความเชื่อ, ข้อคิดทางวิญญาณ, คำถามที่พบบ่อย, เนื้อหาแนะนำ
- สมาชิก, กิจกรรม, ปฏิทิน (พร้อมสัญลักษณ์สีต่อหมวดหมู่), แชตกลุ่ม, คลังค้นคว้า
- พระคัมภีร์ (ลิงก์ Holy Bible / Book of Mormon แก้ไขได้), วิดีโอ (เลือกวิดีโอหลักได้)
- เมนู navbar ที่แอดมินเรียงลำดับ/ซ่อน-แสดงได้

**หน้าแอดมิน (`/admin`)**
- CRUD ครบสำหรับ: สมาชิก, กิจกรรม, ปฏิทิน, แชต (ปักหมุด/ซ่อน/ลบ), คลังค้นคว้า,
  ลิงก์พระคัมภีร์, วิดีโอ, หัวข้อความเชื่อ, คำถามที่พบบ่อย, เนื้อหาแนะนำ, เมนูนำทาง
- อัพโหลดรูป/ไฟล์/วิดีโอจริง (แทนที่ไฟล์เก่าอัตโนมัติเมื่ออัพโหลดใหม่) ผ่าน Supabase Storage
- ตั้งค่าเว็บไซต์ (ชื่อ/ที่อยู่/ติดต่อ), Hero หน้าแรก, ข้อคิดทางวิญญาณ, SEO
- เปลี่ยน username/password ผู้ดูแลระบบได้จากหน้าเว็บ (ไม่ต้องแก้ env)
- บันทึกการเข้าใช้งาน (access logs) ดูย้อนหลัง/ลบได้
- รองรับมือถือ (sidebar แบบ drawer)

## เทคโนโลยี

Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS · Supabase
(Postgres + RLS + Storage) · sharp (ประมวลผลรูปที่อัพโหลด) · sonner (toast)

## เริ่มใช้งาน

```bash
npm install
cp .env.local.example .env.local   # แล้วกรอกค่าตามขั้นตอนด้านล่าง
npm run dev                        # http://localhost:3000
```

## ตั้งค่า Supabase

1. สร้างโปรเจกต์ที่ https://supabase.com
2. ไปที่ **Project Settings → API** คัดลอก:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role secret** key (กด Reveal) → `SUPABASE_SERVICE_ROLE_KEY`
     ⚠️ คีย์นี้ข้าม RLS ทั้งหมด ห้ามใส่ prefix `NEXT_PUBLIC_` และห้ามหลุดไปฝั่ง client
3. ไปที่ **SQL Editor** แล้วรันไฟล์ `supabase/schema.sql` ทั้งไฟล์ครั้งเดียว
   (สร้างทุกตาราง, index, RLS policy, และ storage bucket — ไม่มีข้อมูลตัวอย่างติดมา
   รันซ้ำได้อย่างปลอดภัย ใช้ `if not exists` ทุกจุด)
4. ตั้งค่า `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
   SUPABASE_SERVICE_ROLE_KEY=eyJ...
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=changeme1234
   ADMIN_SECRET=any-long-random-string
   ```
5. `npm run dev` แล้วเข้า `/admin/login` ด้วย `ADMIN_USERNAME`/`ADMIN_PASSWORD` ที่ตั้งไว้
   จากนั้นกรอกเนื้อหาจริงทั้งหมด (สมาชิก, กิจกรรม, ปฏิทิน ฯลฯ) ผ่านหน้า `/admin`
   และเปลี่ยนรหัสผ่านที่ `/admin/settings` เพื่อไม่ต้องพึ่งค่าใน `.env.local` อีกต่อไป

> **โมเดลความปลอดภัย**: ผู้เข้าชมทั่วไป (anon key) อ่านข้อมูลสาธารณะได้อย่างเดียว
> การเขียน/แก้ไข/ลบทั้งหมดจากหน้า `/admin` ทำผ่าน API route ฝั่งเซิร์ฟเวอร์ที่ใช้
> service-role key (ข้าม RLS) หลังตรวจสอบ cookie ล็อกอินแอดมินแล้วเท่านั้น —
> ระบบล็อกอินแอดมินเป็น cookie ของแอปเอง ไม่ใช่ Supabase Auth โดยตรง

## โครงสร้างโปรเจกต์

```
app/
  (site)/             # หน้าเว็บสาธารณะ (มี layout ร่วม: navbar/footer/bottom-tab)
  admin/              # หน้าแอดมิน (มี layout แยก: sidebar + auth guard)
  api/admin/          # API routes สำหรับ CRUD, อัพโหลดไฟล์, ล็อกอิน/ออกจากระบบ
  login/              # หน้าล็อกอินฝั่งผู้ใช้ทั่วไป (บันทึกลง access_logs)
  globals.css         # CSS ต้นฉบับ + Tailwind
components/
  admin/              # ฟอร์ม/ตาราง/sidebar ของหน้าแอดมินทั้งหมด
  sections/           # เนื้อหาแต่ละหน้าของเว็บสาธารณะ
  navbar.tsx, bottom-tab.tsx, bible-sheet.tsx, video-modal.tsx, ...
lib/
  data.ts             # ดึงข้อมูลจาก Supabase (พร้อมค่า fallback ทุกฟังก์ชัน)
  admin-tables.ts      # allow-list ตาราง/คอลัมน์ที่แก้ผ่าน API generic ได้
  admin-auth.ts, admin-credentials.ts  # ระบบล็อกอินแอดมิน
  supabase/           # client ฝั่ง server / browser / service-role
supabase/
  schema.sql          # โครงสร้างฐานข้อมูลทั้งหมด (ไฟล์เดียว รันครั้งเดียวจบ)
public/               # รูป/วิดีโอ/favicon
```

## แก้ไขเนื้อหา

เนื้อหาแทบทั้งหมด (สมาชิก, กิจกรรม, ปฏิทิน, คลังค้นคว้า, พระคัมภีร์, วิดีโอ,
หัวข้อความเชื่อ, FAQ, เมนูนำทาง, ข้อมูลเว็บไซต์/Hero/SEO) แก้ไขได้จากหน้า `/admin`
โดยตรง ไม่ต้องแก้โค้ด — ข้อความ/สำเนาที่ยังฝังในโค้ด (เช่น หัวข้อ section, ข้อความ
การ์ด "ค้นหาโบสถ์") อยู่ใน `components/sections/*.tsx`
