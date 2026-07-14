"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { adminCreate, adminUpdate, adminDelete } from "@/lib/admin-api";
import { deleteFileByUrl, cleanupReplacedFile } from "@/lib/supabase/storage";
import ImageUpload from "@/components/admin/image-upload";
import { useUploadLock } from "@/lib/admin-upload-lock";
import type { ActivityItem } from "@/lib/types";

const FIELD_STYLES = {
  background: "#fff",
  border: "1.5px solid #d1d5db",
  color: "#111827",
};

export default function ActivityForm({ activity }: { activity?: ActivityItem }) {
  const router = useRouter();
  const { isUploading } = useUploadLock();
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    title: activity?.title ?? "",
    date: activity?.date ?? "",
    description: activity?.description ?? "",
    img: activity?.img ?? "",
    title_en: activity?.title_en ?? "",
    description_en: activity?.description_en ?? "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      if (activity?.id) {
        await adminUpdate("activities", activity.id, form);
      } else {
        await adminCreate("activities", form);
      }
      cleanupReplacedFile(activity?.img, form.img);
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
    if (!activity?.id || !confirm(`ลบกิจกรรม "${activity.title}"?`)) return;
    setDeleting(true);
    try {
      await adminDelete("activities", activity.id);
      if (activity.img) void deleteFileByUrl(activity.img);
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

      <div>
        <label className="block text-gray-600 text-xs font-semibold mb-1.5 uppercase tracking-wider">
          หัวข้อกิจกรรม *
        </label>
        <input
          type="text"
          required
          value={form.title}
          onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          className={inputClass}
          style={FIELD_STYLES}
          placeholder="เช่น Sunday Worship Service"
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
          วันที่ / เวลา
        </label>
        <input
          type="text"
          value={form.date}
          onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
          className={inputClass}
          style={FIELD_STYLES}
          placeholder="เช่น Every Sunday, 9:00 AM หรือ April 20, 2025"
        />
      </div>

      <div>
        <label className="block text-gray-600 text-xs font-semibold mb-1.5 uppercase tracking-wider">
          คำอธิบาย
        </label>
        <textarea
          value={form.description}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          className={`${inputClass} min-h-[100px] resize-none`}
          style={FIELD_STYLES}
          placeholder="คำอธิบายกิจกรรม..."
        />
        <textarea
          value={form.description_en}
          onChange={(e) => setForm((f) => ({ ...f, description_en: e.target.value }))}
          className={`${inputClass} min-h-[100px] resize-none mt-2`}
          style={FIELD_STYLES}
          placeholder="ฉบับภาษาอังกฤษ (ไม่บังคับ)"
        />
      </div>

      <ImageUpload
        value={form.img}
        onChange={(url) => setForm((f) => ({ ...f, img: url }))}
        folder="activities"
        label="รูปภาพ"
      />

      <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-2">
        <button
          type="submit"
          disabled={saving || isUploading}
          className="w-full sm:w-auto px-4 sm:px-6 py-3 rounded-xl font-semibold text-sm whitespace-nowrap disabled:opacity-50"
          style={{ background: "linear-gradient(135deg,#157493,#0f6280)", color: "#fff" }}
        >
          {saving ? "กำลังบันทึก…" : activity ? "บันทึกการเปลี่ยนแปลง" : "เพิ่มกิจกรรม"}
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
        {activity && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting || isUploading}
            className="flex-1 sm:flex-none sm:ml-auto px-4 py-3 rounded-xl text-red-500 text-sm whitespace-nowrap hover:bg-red-50 transition-colors disabled:opacity-50"
          >
            <i className="fa-solid fa-trash mr-2"></i>
            {deleting ? "กำลังลบ…" : "ลบกิจกรรม"}
          </button>
        )}
      </div>
    </form>
  );
}
