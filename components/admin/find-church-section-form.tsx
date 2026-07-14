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

export default function FindChurchSectionForm({ settings }: { settings: SiteSettings }) {
  const router = useRouter();
  const { isUploading } = useUploadLock();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    find_church_image: settings.find_church_image,
    find_church_eyebrow: settings.find_church_eyebrow,
    find_church_eyebrow_en: settings.find_church_eyebrow_en,
    find_church_title: settings.find_church_title,
    find_church_title_en: settings.find_church_title_en,
    find_church_body: settings.find_church_body,
    find_church_body_en: settings.find_church_body_en,
    find_church_time: settings.find_church_time,
    find_church_time_en: settings.find_church_time_en,
    find_church_primary_label: settings.find_church_primary_label,
    find_church_primary_label_en: settings.find_church_primary_label_en,
    find_church_primary_url: settings.find_church_primary_url,
    find_church_secondary_label: settings.find_church_secondary_label,
    find_church_secondary_label_en: settings.find_church_secondary_label_en,
    find_church_secondary_url: settings.find_church_secondary_url,
  });

  const inputClass = "w-full px-4 py-3 rounded-xl text-sm outline-none transition-all";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await adminUpdate("site_settings", settings.id ?? "1", form);
      cleanupReplacedFile(settings.find_church_image, form.find_church_image);
      toast.success("บันทึกส่วนค้นหาโบสถ์สำเร็จ");
      router.refresh();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "บันทึกไม่สำเร็จ");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <ImageUpload
        value={form.find_church_image}
        onChange={(url) => setForm((f) => ({ ...f, find_church_image: url }))}
        folder="site"
        label="รูปพื้นหลัง"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-600 text-xs font-semibold mb-1.5 uppercase tracking-wider">
            คำกำกับ (TH)
          </label>
          <input
            type="text"
            value={form.find_church_eyebrow}
            onChange={(e) => setForm((f) => ({ ...f, find_church_eyebrow: e.target.value }))}
            className={inputClass}
            style={FIELD_STYLES}
          />
        </div>
        <div>
          <label className="block text-gray-600 text-xs font-semibold mb-1.5 uppercase tracking-wider">
            คำกำกับ (EN)
          </label>
          <input
            type="text"
            value={form.find_church_eyebrow_en}
            onChange={(e) => setForm((f) => ({ ...f, find_church_eyebrow_en: e.target.value }))}
            className={inputClass}
            style={FIELD_STYLES}
          />
        </div>
      </div>

      <div>
        <label className="block text-gray-600 text-xs font-semibold mb-1.5 uppercase tracking-wider">
          หัวข้อ (TH)
        </label>
        <input
          type="text"
          value={form.find_church_title}
          onChange={(e) => setForm((f) => ({ ...f, find_church_title: e.target.value }))}
          className={inputClass}
          style={FIELD_STYLES}
        />
        <input
          type="text"
          value={form.find_church_title_en}
          onChange={(e) => setForm((f) => ({ ...f, find_church_title_en: e.target.value }))}
          className={`${inputClass} mt-2`}
          style={FIELD_STYLES}
          placeholder="ฉบับภาษาอังกฤษ (ไม่บังคับ)"
        />
      </div>

      <div>
        <label className="block text-gray-600 text-xs font-semibold mb-1.5 uppercase tracking-wider">
          รายละเอียด
        </label>
        <textarea
          value={form.find_church_body}
          onChange={(e) => setForm((f) => ({ ...f, find_church_body: e.target.value }))}
          rows={3}
          className={`${inputClass} resize-none`}
          style={FIELD_STYLES}
        />
        <textarea
          value={form.find_church_body_en}
          onChange={(e) => setForm((f) => ({ ...f, find_church_body_en: e.target.value }))}
          rows={3}
          className={`${inputClass} resize-none mt-2`}
          style={FIELD_STYLES}
          placeholder="ฉบับภาษาอังกฤษ (ไม่บังคับ)"
        />
      </div>

      <div>
        <label className="block text-gray-600 text-xs font-semibold mb-1.5 uppercase tracking-wider">
          เวลา
        </label>
        <input
          type="text"
          value={form.find_church_time}
          onChange={(e) => setForm((f) => ({ ...f, find_church_time: e.target.value }))}
          className={inputClass}
          style={FIELD_STYLES}
        />
        <input
          type="text"
          value={form.find_church_time_en}
          onChange={(e) => setForm((f) => ({ ...f, find_church_time_en: e.target.value }))}
          className={`${inputClass} mt-2`}
          style={FIELD_STYLES}
          placeholder="ฉบับภาษาอังกฤษ (ไม่บังคับ)"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-600 text-xs font-semibold mb-1.5 uppercase tracking-wider">
            ปุ่มหลัก
          </label>
          <input
            type="text"
            value={form.find_church_primary_label}
            onChange={(e) => setForm((f) => ({ ...f, find_church_primary_label: e.target.value }))}
            className={inputClass}
            style={FIELD_STYLES}
            placeholder="ข้อความปุ่ม (TH)"
          />
          <input
            type="text"
            value={form.find_church_primary_label_en}
            onChange={(e) => setForm((f) => ({ ...f, find_church_primary_label_en: e.target.value }))}
            className={`${inputClass} mt-2`}
            style={FIELD_STYLES}
            placeholder="ข้อความปุ่ม (EN)"
          />
          <input
            type="text"
            value={form.find_church_primary_url}
            onChange={(e) => setForm((f) => ({ ...f, find_church_primary_url: e.target.value }))}
            className={`${inputClass} mt-2`}
            style={FIELD_STYLES}
            placeholder="ลิงก์ เช่น https://... หรือ /members"
          />
        </div>
        <div>
          <label className="block text-gray-600 text-xs font-semibold mb-1.5 uppercase tracking-wider">
            ปุ่มรอง
          </label>
          <input
            type="text"
            value={form.find_church_secondary_label}
            onChange={(e) => setForm((f) => ({ ...f, find_church_secondary_label: e.target.value }))}
            className={inputClass}
            style={FIELD_STYLES}
            placeholder="ข้อความปุ่ม (TH)"
          />
          <input
            type="text"
            value={form.find_church_secondary_label_en}
            onChange={(e) => setForm((f) => ({ ...f, find_church_secondary_label_en: e.target.value }))}
            className={`${inputClass} mt-2`}
            style={FIELD_STYLES}
            placeholder="ข้อความปุ่ม (EN)"
          />
          <input
            type="text"
            value={form.find_church_secondary_url}
            onChange={(e) => setForm((f) => ({ ...f, find_church_secondary_url: e.target.value }))}
            className={`${inputClass} mt-2`}
            style={FIELD_STYLES}
            placeholder="ลิงก์ เช่น /activities"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={saving || isUploading}
        className="px-6 py-3 rounded-xl font-semibold text-sm disabled:opacity-50"
        style={{ background: "linear-gradient(135deg,#157493,#0f6280)", color: "#fff" }}
      >
        {saving ? "กำลังบันทึก…" : "บันทึกส่วนค้นหาโบสถ์"}
      </button>
    </form>
  );
}
