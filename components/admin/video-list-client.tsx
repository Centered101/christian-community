"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { adminSetFeatured } from "@/lib/admin-api";
import AdminTable from "@/components/admin/admin-table";
import VideoModal from "@/components/video-modal";
import type { VideoItem } from "@/lib/types";

export default function VideoListClient({ initialVideos }: { initialVideos: VideoItem[] }) {
  const [videos, setVideos] = useState(initialVideos);
  const [busy, setBusy] = useState<string | null>(null);
  const [preview, setPreview] = useState<VideoItem | null>(null);

  const handleSetFeatured = async (id: string) => {
    setBusy(id);
    try {
      await adminSetFeatured("videos", id);
      setVideos((prev) => prev.map((v) => ({ ...v, is_featured: v.id === id })));
      toast.success("ตั้งเป็นวิดีโอหลักแล้ว");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "ตั้งเป็นวิดีโอหลักไม่สำเร็จ");
    } finally {
      setBusy(null);
    }
  };

  return (
    <>
      <AdminTable
        headers={["วิดีโอ", "ชื่อ", "วิดีโอหลัก", ""]}
        data={videos}
        getKey={(v) => v.id}
        emptyMessage="ยังไม่มีวิดีโอ"
        renderRow={(v) => (
          <tr style={{ borderBottom: "1px solid #f3f4f6" }} className="hover:bg-white/5 transition-colors">
            <td className="px-5 py-3">
              <button
                type="button"
                onClick={() => setPreview(v)}
                title="ดูตัวอย่างวิดีโอ"
                className="w-16 h-10 rounded-lg bg-slate-800 flex items-center justify-center hover:bg-slate-700 transition-colors"
              >
                <i className="fa-solid fa-circle-play text-white text-sm"></i>
              </button>
            </td>
            <td className="px-5 py-3 text-gray-900 text-sm font-medium">
              {v.title}
              {v.is_featured && (
                <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-semibold" style={{ background: "rgba(21,116,147,0.12)", color: "#157493" }}>
                  หลัก
                </span>
              )}
            </td>
            <td className="px-5 py-3">
              {v.is_featured ? (
                <span className="text-gray-400 text-xs">วิดีโอหลักปัจจุบัน</span>
              ) : (
                <button
                  onClick={() => v.id && handleSetFeatured(v.id)}
                  disabled={busy === v.id}
                  className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
                  style={{ background: "rgba(21,116,147,0.1)", color: "#157493" }}
                >
                  {busy === v.id ? "กำลังตั้งค่า…" : "ตั้งเป็นวิดีโอหลัก"}
                </button>
              )}
            </td>
            <td className="px-5 py-3">
              <Link href={`/admin/videos/${v.id}`} className="text-gray-500 hover:text-[#157493] text-sm transition-colors">
                <i className="fa-solid fa-pen-to-square"></i>
              </Link>
            </td>
          </tr>
        )}
      />

      {preview && (
        <VideoModal
          open={!!preview}
          onClose={() => setPreview(null)}
          src={preview.video_url}
          title={preview.title}
        />
      )}
    </>
  );
}
