"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { adminCreate, adminUpdate, adminDelete } from "@/lib/admin-api";
import { deleteFileByUrl, cleanupReplacedFile } from "@/lib/supabase/storage";
import ImageUpload from "@/components/admin/image-upload";
import { useUploadLock } from "@/lib/admin-upload-lock";
import type { Resource } from "@/lib/types";

const CATEGORIES = [
  "ทั่วไป", "พระคัมภีร์", "ประวัติศาสตร์", "หลักคำสอน",
  "เพลงสวด", "การรับใช้", "ครอบครัว", "เยาวชน",
];

const FIELD_STYLES = {
  background: "#fff",
  border: "1.5px solid #d1d5db",
  color: "#111827",
};

export default function ResourceForm({ resource }: { resource?: Resource }) {
  const router = useRouter();
  const { isUploading } = useUploadLock();
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [form, setForm] = useState({
    title: resource?.title ?? "",
    description: resource?.description ?? "",
    category: resource?.category ?? "ทั่วไป",
    url: resource?.url ?? "",
    file_url: resource?.file_url ?? "",
    tags: resource?.tags ?? [] as string[],
    sort_order: resource?.sort_order ?? 0,
    title_en: resource?.title_en ?? "",
    description_en: resource?.description_en ?? "",
  });

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !form.tags.includes(t)) {
      setForm((f) => ({ ...f, tags: [...f.tags, t] }));
    }
    setTagInput("");
  };

  const removeTag = (tag: string) =>
    setForm((f) => ({ ...f, tags: f.tags.filter((t) => t !== tag) }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const payload = {
        title: form.title,
        description: form.description,
        category: form.category,
        url: form.url,
        file_url: form.file_url,
        tags: form.tags,
        sort_order: form.sort_order,
        title_en: form.title_en,
        description_en: form.description_en,
      };
      if (resource?.id) {
        await adminUpdate("resources", resource.id, payload);
      } else {
        await adminCreate("resources", payload);
      }
      cleanupReplacedFile(resource?.file_url, form.file_url);
      toast.success("บันทึกสำเร็จ!");
      router.push("/admin/resources");
      router.refresh();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "เกิดข้อผิดพลาด";
      setError(message);
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!resource?.id || !confirm(`ลบ "${resource.title}"?`)) return;
    setDeleting(true);
    try {
      await adminDelete("resources", resource.id);
      if (resource.file_url) void deleteFileByUrl(resource.file_url);
      router.push("/admin/resources");
      router.refresh();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "ลบไม่สำเร็จ");
      setDeleting(false);
    }
  };

  const inputClass = "w-full px-4 py-3 rounded-xl text-sm outline-none transition-all";
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="sm:col-span-2">
          <label className="block text-gray-600 text-xs font-semibold mb-1.5 uppercase tracking-wider">
            ชื่อเรื่อง *
          </label>
          <input
            type="text"
            required
            value={form.title}
            onChange={set("title")}
            className={inputClass}
            style={FIELD_STYLES}
            placeholder="เช่น หนังสือมอรมอน ฉบับศึกษา"
          />
          <input
            type="text"
            value={form.title_en}
            onChange={set("title_en")}
            className={`${inputClass} mt-2`}
            style={FIELD_STYLES}
            placeholder="ฉบับภาษาอังกฤษ (ไม่บังคับ)"
          />
        </div>

        <div>
          <label className="block text-gray-600 text-xs font-semibold mb-1.5 uppercase tracking-wider">
            หมวดหมู่
          </label>
          <select
            value={form.category}
            onChange={set("category")}
            className={inputClass}
            style={FIELD_STYLES}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-gray-600 text-xs font-semibold mb-1.5 uppercase tracking-wider">
            ลำดับ
          </label>
          <input
            type="number"
            value={form.sort_order}
            onChange={(e) => setForm((f) => ({ ...f, sort_order: parseInt(e.target.value) || 0 }))}
            className={inputClass}
            style={FIELD_STYLES}
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-gray-600 text-xs font-semibold mb-1.5 uppercase tracking-wider">
            คำอธิบาย
          </label>
          <textarea
            rows={3}
            value={form.description}
            onChange={set("description")}
            className={`${inputClass} resize-none`}
            style={FIELD_STYLES}
            placeholder="อธิบายสั้นๆ เกี่ยวกับทรัพยากรนี้"
          />
          <textarea
            rows={3}
            value={form.description_en}
            onChange={set("description_en")}
            className={`${inputClass} resize-none mt-2`}
            style={FIELD_STYLES}
            placeholder="ฉบับภาษาอังกฤษ (ไม่บังคับ)"
          />
        </div>

        <div>
          <label className="block text-gray-600 text-xs font-semibold mb-1.5 uppercase tracking-wider">
            URL ลิงก์
          </label>
          <input
            type="url"
            value={form.url}
            onChange={set("url")}
            className={inputClass}
            style={FIELD_STYLES}
            placeholder="https://..."
          />
        </div>

        <div>
          <ImageUpload
            value={form.file_url}
            onChange={(url) => setForm((f) => ({ ...f, file_url: url }))}
            folder="resources"
            accept="*/*"
            label="ไฟล์ (PDF/อื่นๆ)"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-gray-600 text-xs font-semibold mb-1.5 uppercase tracking-wider">
            แท็ก
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }}
              className={`${inputClass} flex-1`}
              style={FIELD_STYLES}
              placeholder="พิมพ์แท็กแล้วกด Enter"
            />
            <button
              type="button"
              onClick={addTag}
              className="px-4 py-3 rounded-xl text-sm font-semibold"
              style={{ background: "rgba(21,116,147,0.1)", color: "#157493" }}
            >
              เพิ่ม
            </button>
          </div>
          {form.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {form.tags.map((t) => (
                <span
                  key={t}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs"
                  style={{ background: "rgba(21,116,147,0.12)", color: "#157493" }}
                >
                  {t}
                  <button
                    type="button"
                    onClick={() => removeTag(t)}
                    className="opacity-60 hover:opacity-100"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={saving || isUploading}
          className="px-6 py-3 rounded-xl font-semibold text-sm disabled:opacity-50"
          style={{ background: "linear-gradient(135deg,#157493,#0f6280)", color: "#fff" }}
        >
          {saving ? "กำลังบันทึก…" : resource ? "บันทึกการเปลี่ยนแปลง" : "เพิ่มทรัพยากร"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/resources")}
          disabled={isUploading}
          className="px-6 py-3 rounded-xl text-gray-500 text-sm hover:text-white transition-colors disabled:opacity-50"
          style={{ background: "rgba(226,232,240,0.5)" }}
        >
          ยกเลิก
        </button>
        {resource && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting || isUploading}
            className="ml-auto px-4 py-3 rounded-xl text-red-500 text-sm hover:bg-red-50 transition-colors disabled:opacity-50"
          >
            <i className="fa-solid fa-trash mr-2"></i>
            {deleting ? "กำลังลบ…" : "ลบ"}
          </button>
        )}
      </div>
    </form>
  );
}
