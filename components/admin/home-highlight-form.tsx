"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { adminCreate, adminUpdate, adminDelete } from "@/lib/admin-api";
import { deleteFileByUrl, cleanupReplacedFile } from "@/lib/supabase/storage";
import ImageUpload from "@/components/admin/image-upload";
import IconPicker from "@/components/admin/icon-picker";
import { useUploadLock } from "@/lib/admin-upload-lock";
import type { HomeHighlight } from "@/lib/types";

const FIELD_STYLES = {
  background: "#fff",
  border: "1.5px solid #d1d5db",
  color: "#111827",
};

export default function HomeHighlightForm({ highlight }: { highlight?: HomeHighlight }) {
  const router = useRouter();
  const { isUploading } = useUploadLock();
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    icon: highlight?.icon ?? "fa-solid fa-star",
    title: highlight?.title ?? "",
    description: highlight?.description ?? "",
    img: highlight?.img ?? "",
    href: highlight?.href ?? "/",
    cta_label: highlight?.cta_label ?? "เรียนรู้เพิ่มเติม",
    title_en: highlight?.title_en ?? "",
    description_en: highlight?.description_en ?? "",
    cta_label_en: highlight?.cta_label_en ?? "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      if (highlight?.id) {
        await adminUpdate("home_highlights", highlight.id, form);
      } else {
        await adminCreate("home_highlights", form);
      }
      cleanupReplacedFile(highlight?.img, form.img);
      toast.success("บันทึกสำเร็จ!");
      router.push("/admin/activities");
      router.refresh();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "เกิดข้อผิดพลาด");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!highlight?.id || !confirm(`ลบ "${highlight.title}"?`)) return;
    setDeleting(true);
    try {
      await adminDelete("home_highlights", highlight.id);
      if (highlight.img) void deleteFileByUrl(highlight.img);
      router.push("/admin/activities");
      router.refresh();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "ลบไม่สำเร็จ");
      setDeleting(false);
    }
  };

  const inputClass = "w-full px-4 py-3 rounded-xl text-sm outline-none transition-all";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
          {error}
        </div>
      )}

      <ImageUpload
        value={form.img}
        onChange={(url) => setForm((f) => ({ ...f, img: url }))}
        folder="home-highlights"
        label="รูปภาพ"
      />

      <IconPicker value={form.icon} onChange={(icon) => setForm((f) => ({ ...f, icon }))} />

      <div>
        <label className="block text-gray-600 text-xs font-semibold mb-1.5 uppercase tracking-wider">
          หัวข้อ *
        </label>
        <input
          type="text"
          required
          value={form.title}
          onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          className={inputClass}
          style={FIELD_STYLES}
        />
        <input
          type="text"
          value={form.title_en}
          onChange={(e) => setForm((f) => ({ ...f, title_en: e.target.value }))}
          className={`${inputClass} mt-2`}
          style={FIELD_STYLES}
          placeholder="ฉบับภาษาอังกฤษ (ไม่บังคับ)"
        />
      </div>

      <div>
        <label className="block text-gray-600 text-xs font-semibold mb-1.5 uppercase tracking-wider">
          คำอธิบาย
        </label>
        <textarea
          value={form.description}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          rows={3}
          className={`${inputClass} resize-none`}
          style={FIELD_STYLES}
        />
        <textarea
          value={form.description_en}
          onChange={(e) => setForm((f) => ({ ...f, description_en: e.target.value }))}
          rows={3}
          className={`${inputClass} resize-none mt-2`}
          style={FIELD_STYLES}
          placeholder="ฉบับภาษาอังกฤษ (ไม่บังคับ)"
        />
      </div>

      <div>
        <label className="block text-gray-600 text-xs font-semibold mb-1.5 uppercase tracking-wider">
          ลิงก์ปลายทาง
        </label>
        <input
          type="text"
          value={form.href}
          onChange={(e) => setForm((f) => ({ ...f, href: e.target.value }))}
          className={inputClass}
          style={FIELD_STYLES}
          placeholder="เช่น /activities"
        />
      </div>

      <div>
        <label className="block text-gray-600 text-xs font-semibold mb-1.5 uppercase tracking-wider">
          ข้อความปุ่ม
        </label>
        <input
          type="text"
          value={form.cta_label}
          onChange={(e) => setForm((f) => ({ ...f, cta_label: e.target.value }))}
          className={inputClass}
          style={FIELD_STYLES}
        />
        <input
          type="text"
          value={form.cta_label_en}
          onChange={(e) => setForm((f) => ({ ...f, cta_label_en: e.target.value }))}
          className={`${inputClass} mt-2`}
          style={FIELD_STYLES}
          placeholder="ฉบับภาษาอังกฤษ (ไม่บังคับ)"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-2">
        <button
          type="submit"
          disabled={saving || isUploading}
          className="w-full sm:w-auto px-4 sm:px-6 py-3 rounded-xl font-semibold text-sm whitespace-nowrap disabled:opacity-50"
          style={{ background: "#157493", color: "#fff" }}
        >
          {saving ? "กำลังบันทึก…" : highlight ? "บันทึกการเปลี่ยนแปลง" : "เพิ่ม"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/activities")}
          disabled={isUploading}
          className="flex-1 sm:flex-none px-4 sm:px-6 py-3 rounded-xl text-gray-500 text-sm whitespace-nowrap hover:text-white transition-colors disabled:opacity-50"
          style={{ background: "rgba(226,232,240,0.5)" }}
        >
          ยกเลิก
        </button>
        {highlight && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting || isUploading}
            className="flex-1 sm:flex-none sm:ml-auto px-4 py-3 rounded-xl text-red-500 text-sm whitespace-nowrap hover:bg-red-50 transition-colors disabled:opacity-50"
          >
            <i className="fa-solid fa-trash mr-2"></i>
            {deleting ? "กำลังลบ…" : "ลบ"}
          </button>
        )}
      </div>
    </form>
  );
}
