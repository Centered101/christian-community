"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { adminUpdate } from "@/lib/admin-api";
import { cleanupReplacedFile } from "@/lib/supabase/storage";
import ImageUpload from "@/components/admin/image-upload";
import { useUploadLock } from "@/lib/admin-upload-lock";
import type { SiteSettings } from "@/lib/types";

const FIELD_STYLES = {
  background: "#fff",
  border: "1.5px solid #d1d5db",
  color: "#111827",
};

export default function SiteSettingsForm({ settings }: { settings: SiteSettings }) {
  const router = useRouter();
  const { isUploading } = useUploadLock();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    site_name: settings.site_name,
    site_subtitle: settings.site_subtitle,
    address: settings.address,
    phone: settings.phone,
    email: settings.email,
    hero_title: settings.hero_title,
    hero_subtitle: settings.hero_subtitle,
    meta_title: settings.meta_title,
    meta_description: settings.meta_description,
    og_image: settings.og_image,
    verse_text: settings.verse_text,
    verse_ref: settings.verse_ref,
    site_name_en: settings.site_name_en,
    site_subtitle_en: settings.site_subtitle_en,
    hero_title_en: settings.hero_title_en,
    hero_subtitle_en: settings.hero_subtitle_en,
    verse_text_en: settings.verse_text_en,
    verse_ref_en: settings.verse_ref_en,
  });

  const inputClass = "w-full px-4 py-3 rounded-xl text-sm outline-none transition-all";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await adminUpdate("site_settings", settings.id ?? "1", form);
      cleanupReplacedFile(settings.og_image, form.og_image);
      toast.success("บันทึกข้อมูลเว็บไซต์สำเร็จ!");
      router.refresh();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "บันทึกไม่สำเร็จ");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-gray-600 text-xs font-semibold mb-1.5 uppercase tracking-wider">
          ชื่อเว็บไซต์ *
        </label>
        <input
          type="text"
          required
          value={form.site_name}
          onChange={(e) => setForm((f) => ({ ...f, site_name: e.target.value }))}
          className={inputClass}
          style={FIELD_STYLES}
        />
        <input
          type="text"
          value={form.site_name_en}
          onChange={(e) => setForm((f) => ({ ...f, site_name_en: e.target.value }))}
          className={`${inputClass} mt-2`}
          style={FIELD_STYLES}
          placeholder="ฉบับภาษาอังกฤษ (ไม่บังคับ)"
        />
      </div>

      <div>
        <label className="block text-gray-600 text-xs font-semibold mb-1.5 uppercase tracking-wider">
          ชื่อรอง (เช่น ชื่อวอร์ด)
        </label>
        <input
          type="text"
          value={form.site_subtitle}
          onChange={(e) => setForm((f) => ({ ...f, site_subtitle: e.target.value }))}
          className={inputClass}
          style={FIELD_STYLES}
        />
        <input
          type="text"
          value={form.site_subtitle_en}
          onChange={(e) => setForm((f) => ({ ...f, site_subtitle_en: e.target.value }))}
          className={`${inputClass} mt-2`}
          style={FIELD_STYLES}
          placeholder="ฉบับภาษาอังกฤษ (ไม่บังคับ)"
        />
      </div>

      <div>
        <label className="block text-gray-600 text-xs font-semibold mb-1.5 uppercase tracking-wider">
          ที่อยู่
        </label>
        <input
          type="text"
          value={form.address}
          onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
          className={inputClass}
          style={FIELD_STYLES}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-600 text-xs font-semibold mb-1.5 uppercase tracking-wider">
            เบอร์โทร
          </label>
          <input
            type="text"
            value={form.phone}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
            className={inputClass}
            style={FIELD_STYLES}
          />
        </div>
        <div>
          <label className="block text-gray-600 text-xs font-semibold mb-1.5 uppercase tracking-wider">
            อีเมล
          </label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            className={inputClass}
            style={FIELD_STYLES}
          />
        </div>
      </div>

      <div className="pt-4 border-t border-gray-100">
        <h3 className="text-gray-900 text-sm font-bold mb-1">Hero หน้าแรก</h3>
        <p className="text-gray-500 text-xs mb-4">ข้อความหลักที่แสดงบนสุดของหน้าแรก</p>

        <div className="mb-4">
          <label className="block text-gray-600 text-xs font-semibold mb-1.5 uppercase tracking-wider">
            หัวข้อหลัก
          </label>
          <textarea
            value={form.hero_title}
            onChange={(e) => setForm((f) => ({ ...f, hero_title: e.target.value }))}
            rows={2}
            className={`${inputClass} resize-none`}
            style={FIELD_STYLES}
            placeholder="กด Enter เพื่อขึ้นบรรทัดใหม่"
          />
          <textarea
            value={form.hero_title_en}
            onChange={(e) => setForm((f) => ({ ...f, hero_title_en: e.target.value }))}
            rows={2}
            className={`${inputClass} resize-none mt-2`}
            style={FIELD_STYLES}
            placeholder="ฉบับภาษาอังกฤษ (ไม่บังคับ)"
          />
        </div>

        <div>
          <label className="block text-gray-600 text-xs font-semibold mb-1.5 uppercase tracking-wider">
            ข้อความรอง
          </label>
          <textarea
            value={form.hero_subtitle}
            onChange={(e) => setForm((f) => ({ ...f, hero_subtitle: e.target.value }))}
            rows={2}
            className={`${inputClass} resize-none`}
            style={FIELD_STYLES}
            placeholder="กด Enter เพื่อขึ้นบรรทัดใหม่"
          />
          <textarea
            value={form.hero_subtitle_en}
            onChange={(e) => setForm((f) => ({ ...f, hero_subtitle_en: e.target.value }))}
            rows={2}
            className={`${inputClass} resize-none mt-2`}
            style={FIELD_STYLES}
            placeholder="ฉบับภาษาอังกฤษ (ไม่บังคับ)"
          />
        </div>
      </div>

      <div className="pt-4 border-t border-gray-100">
        <h3 className="text-gray-900 text-sm font-bold mb-1">ข้อคิดทางวิญญาณ (หน้าแรก)</h3>
        <p className="text-gray-500 text-xs mb-4">พระคัมภีร์ที่แสดงในส่วน "ความคิดทางวิญญาณ"</p>

        <div className="mb-4">
          <label className="block text-gray-600 text-xs font-semibold mb-1.5 uppercase tracking-wider">
            ข้อความ
          </label>
          <textarea
            value={form.verse_text}
            onChange={(e) => setForm((f) => ({ ...f, verse_text: e.target.value }))}
            rows={2}
            className={`${inputClass} resize-none`}
            style={FIELD_STYLES}
          />
          <textarea
            value={form.verse_text_en}
            onChange={(e) => setForm((f) => ({ ...f, verse_text_en: e.target.value }))}
            rows={2}
            className={`${inputClass} resize-none mt-2`}
            style={FIELD_STYLES}
            placeholder="ฉบับภาษาอังกฤษ (ไม่บังคับ)"
          />
        </div>

        <div>
          <label className="block text-gray-600 text-xs font-semibold mb-1.5 uppercase tracking-wider">
            อ้างอิง
          </label>
          <input
            type="text"
            value={form.verse_ref}
            onChange={(e) => setForm((f) => ({ ...f, verse_ref: e.target.value }))}
            className={inputClass}
            style={FIELD_STYLES}
            placeholder="เช่น 1 โครินธ์ 6:19-20"
          />
          <input
            type="text"
            value={form.verse_ref_en}
            onChange={(e) => setForm((f) => ({ ...f, verse_ref_en: e.target.value }))}
            className={`${inputClass} mt-2`}
            style={FIELD_STYLES}
            placeholder="ฉบับภาษาอังกฤษ (ไม่บังคับ) เช่น 1 Corinthians 6:19-20"
          />
        </div>
      </div>

      <div className="pt-4 border-t border-gray-100">
        <h3 className="text-gray-900 text-sm font-bold mb-1">SEO</h3>
        <p className="text-gray-500 text-xs mb-4">ข้อมูลที่แสดงบน Google และตอนแชร์ลิงก์เว็บไซต์ในโซเชียล</p>

        <div className="mb-4">
          <label className="block text-gray-600 text-xs font-semibold mb-1.5 uppercase tracking-wider">
            ชื่อเว็บไซต์ (Meta Title)
          </label>
          <input
            type="text"
            value={form.meta_title}
            onChange={(e) => setForm((f) => ({ ...f, meta_title: e.target.value }))}
            className={inputClass}
            style={FIELD_STYLES}
            placeholder="ชื่อที่แสดงบนแท็บเบราว์เซอร์และผลค้นหา Google"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-600 text-xs font-semibold mb-1.5 uppercase tracking-wider">
            คำอธิบายเว็บไซต์ (Meta Description)
          </label>
          <textarea
            value={form.meta_description}
            onChange={(e) => setForm((f) => ({ ...f, meta_description: e.target.value }))}
            rows={3}
            className={`${inputClass} resize-none`}
            style={FIELD_STYLES}
            placeholder="คำอธิบายสั้นๆ ที่แสดงใต้ชื่อเว็บไซต์ในผลค้นหา Google"
          />
        </div>

        <ImageUpload
          value={form.og_image}
          onChange={(url) => setForm((f) => ({ ...f, og_image: url }))}
          folder="seo"
          label="รูปภาพตอนแชร์ลิงก์ (OG Image)"
        />
      </div>

      <button
        type="submit"
        disabled={saving || isUploading}
        className="px-6 py-3 rounded-xl font-semibold text-sm disabled:opacity-50"
        style={{ background: "linear-gradient(135deg,#157493,#0f6280)", color: "#fff" }}
      >
        {saving ? "กำลังบันทึก…" : "บันทึกข้อมูลเว็บไซต์"}
      </button>
    </form>
  );
}
