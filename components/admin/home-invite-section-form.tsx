"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { adminUpdate } from "@/lib/admin-api";
import type { SiteSettings } from "@/lib/types";

const FIELD_STYLES = {
  background: "#fff",
  border: "1.5px solid #d1d5db",
  color: "#111827",
};

export default function HomeInviteSectionForm({ settings }: { settings: SiteSettings }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    home_quote: settings.home_quote,
    home_quote_en: settings.home_quote_en,
    home_quote_author: settings.home_quote_author,
    home_quote_author_en: settings.home_quote_author_en,
    home_cta_eyebrow: settings.home_cta_eyebrow,
    home_cta_eyebrow_en: settings.home_cta_eyebrow_en,
    home_cta_primary_label: settings.home_cta_primary_label,
    home_cta_primary_label_en: settings.home_cta_primary_label_en,
    home_cta_primary_url: settings.home_cta_primary_url,
    home_cta_secondary_label: settings.home_cta_secondary_label,
    home_cta_secondary_label_en: settings.home_cta_secondary_label_en,
    home_cta_secondary_url: settings.home_cta_secondary_url,
    home_cta_tertiary_label: settings.home_cta_tertiary_label,
    home_cta_tertiary_label_en: settings.home_cta_tertiary_label_en,
    home_cta_tertiary_url: settings.home_cta_tertiary_url,
  });

  const inputClass = "w-full px-4 py-3 rounded-xl text-sm outline-none transition-all";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await adminUpdate("site_settings", settings.id ?? "1", form);
      toast.success("บันทึกส่วนคำเชิญหน้าแรกสำเร็จ");
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
          Quote (TH)
        </label>
        <textarea
          value={form.home_quote}
          onChange={(e) => setForm((f) => ({ ...f, home_quote: e.target.value }))}
          rows={4}
          className={`${inputClass} resize-none`}
          style={FIELD_STYLES}
        />
        <textarea
          value={form.home_quote_en}
          onChange={(e) => setForm((f) => ({ ...f, home_quote_en: e.target.value }))}
          rows={4}
          className={`${inputClass} resize-none mt-2`}
          style={FIELD_STYLES}
          placeholder="Quote (EN)"
        />
      </div>

      <div>
        <label className="block text-gray-600 text-xs font-semibold mb-1.5 uppercase tracking-wider">
          ผู้กล่าว / แหล่งที่มา
        </label>
        <input
          type="text"
          value={form.home_quote_author}
          onChange={(e) => setForm((f) => ({ ...f, home_quote_author: e.target.value }))}
          className={inputClass}
          style={FIELD_STYLES}
        />
        <input
          type="text"
          value={form.home_quote_author_en}
          onChange={(e) => setForm((f) => ({ ...f, home_quote_author_en: e.target.value }))}
          className={`${inputClass} mt-2`}
          style={FIELD_STYLES}
          placeholder="ฉบับภาษาอังกฤษ (ไม่บังคับ)"
        />
      </div>

      <div>
        <label className="block text-gray-600 text-xs font-semibold mb-1.5 uppercase tracking-wider">
          ข้อความเหนือปุ่ม
        </label>
        <textarea
          value={form.home_cta_eyebrow}
          onChange={(e) => setForm((f) => ({ ...f, home_cta_eyebrow: e.target.value }))}
          rows={2}
          className={`${inputClass} resize-none`}
          style={FIELD_STYLES}
          placeholder="ข้อความเหนือปุ่ม (TH)"
        />
        <textarea
          value={form.home_cta_eyebrow_en}
          onChange={(e) => setForm((f) => ({ ...f, home_cta_eyebrow_en: e.target.value }))}
          rows={2}
          className={`${inputClass} resize-none mt-2`}
          style={FIELD_STYLES}
          placeholder="ข้อความเหนือปุ่ม (EN)"
        />
        <p className="mt-2 text-xs text-gray-500">
          ข้อความนี้จะแสดงรวมกับปุ่ม ถ้าไม่มีปุ่มเลย ทั้งส่วนนี้จะไม่แสดง
        </p>
      </div>

      <div className="pt-4 border-t border-gray-100">
        <h3 className="text-gray-900 text-sm font-bold mb-1">ปุ่มคำเชิญด้านล่าง</h3>
        <p className="text-gray-500 text-xs mb-4">ถ้าข้อความปุ่มหรือลิงก์ว่าง ปุ่มนั้นจะไม่แสดง</p>

        {([
          ["primary", "ปุ่มที่ 1 - ข้อความและลิงก์"],
          ["secondary", "ปุ่มที่ 2 - ข้อความและลิงก์"],
          ["tertiary", "ปุ่มที่ 3 - ข้อความและลิงก์"],
        ] as const).map(([key, label]) => (
          <div key={key} className="mb-4">
            <label className="block text-gray-600 text-xs font-semibold mb-1.5 uppercase tracking-wider">
              {label}
            </label>
            <input
              type="text"
              value={form[`home_cta_${key}_label`]}
              onChange={(e) => setForm((f) => ({ ...f, [`home_cta_${key}_label`]: e.target.value }))}
              className={inputClass}
              style={FIELD_STYLES}
              placeholder="ข้อความปุ่ม (TH)"
            />
            <input
              type="text"
              value={form[`home_cta_${key}_label_en`]}
              onChange={(e) => setForm((f) => ({ ...f, [`home_cta_${key}_label_en`]: e.target.value }))}
              className={`${inputClass} mt-2`}
              style={FIELD_STYLES}
              placeholder="ข้อความปุ่ม (EN)"
            />
            <input
              type="text"
              value={form[`home_cta_${key}_url`]}
              onChange={(e) => setForm((f) => ({ ...f, [`home_cta_${key}_url`]: e.target.value }))}
              className={`${inputClass} mt-2`}
              style={FIELD_STYLES}
              placeholder="ลิงก์ เช่น /members หรือ https://..."
            />
          </div>
        ))}
      </div>

      <button
        type="submit"
        disabled={saving}
        className="px-6 py-3 rounded-xl font-semibold text-sm disabled:opacity-50"
        style={{ background: "linear-gradient(135deg,#157493,#0f6280)", color: "#fff" }}
      >
        {saving ? "กำลังบันทึก…" : "บันทึกส่วนคำเชิญ"}
      </button>
    </form>
  );
}
