"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { adminCreate, adminUpdate, adminDelete } from "@/lib/admin-api";
import { deleteFileByUrl, cleanupReplacedFile } from "@/lib/supabase/storage";
import ImageUpload from "@/components/admin/image-upload";
import { useUploadLock } from "@/lib/admin-upload-lock";
import type { ScriptureLink } from "@/lib/types";

const FIELD_STYLES = {
  background: "#fff",
  border: "1.5px solid #d1d5db",
  color: "#111827",
};

export default function ScriptureLinkForm({ link }: { link?: ScriptureLink }) {
  const router = useRouter();
  const { isUploading } = useUploadLock();
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    label: link?.label ?? "",
    sub: link?.sub ?? "",
    url: link?.url ?? "",
    icon: link?.icon ?? "",
    label_en: link?.label_en ?? "",
    sub_en: link?.sub_en ?? "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      if (link?.id) {
        await adminUpdate("scripture_links", link.id, form);
      } else {
        await adminCreate("scripture_links", form);
      }
      cleanupReplacedFile(link?.icon, form.icon);
      toast.success("บันทึกสำเร็จ!");
      router.push("/admin/scripture-links");
      router.refresh();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "เกิดข้อผิดพลาด");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!link?.id || !confirm(`ลบ "${link.label}"?`)) return;
    setDeleting(true);
    try {
      await adminDelete("scripture_links", link.id);
      if (link.icon) void deleteFileByUrl(link.icon);
      router.push("/admin/scripture-links");
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
        value={form.icon}
        onChange={(url) => setForm((f) => ({ ...f, icon: url }))}
        folder="scripture-links"
        label="ไอคอน"
      />

      <div>
        <label className="block text-gray-600 text-xs font-semibold mb-1.5 uppercase tracking-wider">
          ชื่อ *
        </label>
        <input
          type="text"
          required
          value={form.label}
          onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))}
          className={inputClass}
          style={FIELD_STYLES}
          placeholder="เช่น Holy Bible"
        />
        <input
          type="text"
          value={form.label_en}
          onChange={(e) => setForm((f) => ({ ...f, label_en: e.target.value }))}
          className={`${inputClass} mt-2`}
          style={FIELD_STYLES}
          placeholder="ฉบับภาษาอังกฤษ (ไม่บังคับ)"
        />
      </div>

      <div>
        <label className="block text-gray-600 text-xs font-semibold mb-1.5 uppercase tracking-wider">
          คำอธิบายย่อย
        </label>
        <input
          type="text"
          value={form.sub}
          onChange={(e) => setForm((f) => ({ ...f, sub: e.target.value }))}
          className={inputClass}
          style={FIELD_STYLES}
          placeholder="เช่น YouVersion · App Store"
        />
        <input
          type="text"
          value={form.sub_en}
          onChange={(e) => setForm((f) => ({ ...f, sub_en: e.target.value }))}
          className={`${inputClass} mt-2`}
          style={FIELD_STYLES}
          placeholder="ฉบับภาษาอังกฤษ (ไม่บังคับ)"
        />
      </div>

      <div>
        <label className="block text-gray-600 text-xs font-semibold mb-1.5 uppercase tracking-wider">
          ลิงก์ปลายทาง *
        </label>
        <input
          type="url"
          required
          value={form.url}
          onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))}
          className={inputClass}
          style={FIELD_STYLES}
          placeholder="https://..."
        />
      </div>

      <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-2">
        <button
          type="submit"
          disabled={saving || isUploading}
          className="w-full sm:w-auto px-4 sm:px-6 py-3 rounded-xl font-semibold text-sm whitespace-nowrap disabled:opacity-50"
          style={{ background: "linear-gradient(135deg,#157493,#0f6280)", color: "#fff" }}
        >
          {saving ? "กำลังบันทึก…" : link ? "บันทึกการเปลี่ยนแปลง" : "เพิ่มลิงก์"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/scripture-links")}
          disabled={isUploading}
          className="flex-1 sm:flex-none px-4 sm:px-6 py-3 rounded-xl text-gray-500 text-sm whitespace-nowrap hover:text-white transition-colors disabled:opacity-50"
          style={{ background: "rgba(226,232,240,0.5)" }}
        >
          ยกเลิก
        </button>
        {link && (
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
