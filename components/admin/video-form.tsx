"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { adminCreate, adminUpdate, adminDelete } from "@/lib/admin-api";
import { deleteFileByUrl, cleanupReplacedFile } from "@/lib/supabase/storage";
import ImageUpload from "@/components/admin/image-upload";
import { useUploadLock } from "@/lib/admin-upload-lock";
import type { VideoItem } from "@/lib/types";

const FIELD_STYLES = {
  background: "#fff",
  border: "1.5px solid #d1d5db",
  color: "#111827",
};

export default function VideoForm({ video }: { video?: VideoItem }) {
  const router = useRouter();
  const { isUploading } = useUploadLock();
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    title: video?.title ?? "",
    video_url: video?.video_url ?? "",
    title_en: video?.title_en ?? "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.video_url) {
      setError("กรุณาอัพโหลดวิดีโอ");
      return;
    }
    setSaving(true);
    try {
      if (video?.id) {
        await adminUpdate("videos", video.id, form);
      } else {
        await adminCreate("videos", form);
      }
      cleanupReplacedFile(video?.video_url, form.video_url);
      toast.success("บันทึกสำเร็จ!");
      router.push("/admin/videos");
      router.refresh();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "เกิดข้อผิดพลาด");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!video?.id || !confirm(`ลบวิดีโอ "${video.title}"?`)) return;
    setDeleting(true);
    try {
      await adminDelete("videos", video.id);
      if (video.video_url) void deleteFileByUrl(video.video_url);
      router.push("/admin/videos");
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
          ชื่อวิดีโอ *
        </label>
        <input
          type="text"
          required
          value={form.title}
          onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          className={inputClass}
          style={FIELD_STYLES}
          placeholder="เช่น วิดีโอแนะนำศาสนาจักร"
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

      <ImageUpload
        value={form.video_url}
        onChange={(url) => setForm((f) => ({ ...f, video_url: url }))}
        folder="videos"
        accept="video/*"
        label="ไฟล์วิดีโอ"
      />

      {form.video_url && (
        <div>
          <label className="block text-gray-600 text-xs font-semibold mb-1.5 uppercase tracking-wider">
            ดูตัวอย่าง
          </label>
          <video
            key={form.video_url}
            src={form.video_url}
            controls
            playsInline
            className="w-full rounded-xl bg-black"
            style={{ maxHeight: 320 }}
          />
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-2">
        <button
          type="submit"
          disabled={saving || isUploading}
          className="w-full sm:w-auto px-4 sm:px-6 py-3 rounded-xl font-semibold text-sm whitespace-nowrap disabled:opacity-50"
          style={{ background: "linear-gradient(135deg,#157493,#0f6280)", color: "#fff" }}
        >
          {saving ? "กำลังบันทึก…" : video ? "บันทึกการเปลี่ยนแปลง" : "เพิ่มวิดีโอ"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/videos")}
          disabled={isUploading}
          className="flex-1 sm:flex-none px-4 sm:px-6 py-3 rounded-xl text-gray-500 text-sm whitespace-nowrap hover:text-white transition-colors disabled:opacity-50"
          style={{ background: "rgba(226,232,240,0.5)" }}
        >
          ยกเลิก
        </button>
        {video && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting || isUploading}
            className="flex-1 sm:flex-none sm:ml-auto px-4 py-3 rounded-xl text-red-500 text-sm whitespace-nowrap hover:bg-red-50 transition-colors disabled:opacity-50"
          >
            <i className="fa-solid fa-trash mr-2"></i>
            {deleting ? "กำลังลบ…" : "ลบวิดีโอ"}
          </button>
        )}
      </div>
    </form>
  );
}
