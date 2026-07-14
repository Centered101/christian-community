"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import { uploadFile, uploadFromUrl, type UploadProgressPhase } from "@/lib/supabase/storage";
import { useUploadLock } from "@/lib/admin-upload-lock";
import ImagePreviewButton from "@/components/admin/image-preview-button";

type Props = {
  value: string;
  onChange: (url: string) => void;
  folder: string;
  accept?: string;
  label?: string;
  labelClassName?: string;
};

const PHASE_LABEL: Record<UploadProgressPhase, string> = {
  uploading: "กำลังอัปโหลดรูปภาพ...",
  processing: "กำลังแปลงไฟล์...",
};

export default function ImageUpload({
  value,
  onChange,
  folder,
  accept = "image/*",
  label = "รูปภาพ",
  labelClassName = "text-gray-600",
}: Props) {
  const { lock, unlock } = useUploadLock();
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<UploadProgressPhase>("uploading");
  const [mode, setMode] = useState<"file" | "url">("file");
  const [urlDraft, setUrlDraft] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const isImage = accept.startsWith("image");

  const beginUpload = () => {
    setUploading(true);
    setProgress(0);
    setPhase("uploading");
    lock();
  };

  const endUpload = () => {
    setUploading(false);
    setProgress(0);
    unlock();
  };

  const handleCancel = () => {
    abortRef.current?.abort();
  };

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    const controller = new AbortController();
    abortRef.current = controller;
    beginUpload();
    try {
      const result = await uploadFile(folder, file, isImage ? "image" : "raw", {
        signal: controller.signal,
        onProgress: (percent, p) => {
          setProgress(percent);
          setPhase(p);
        },
      });
      // การลบไฟล์เดิมจะเกิดขึ้นหลังจากฟอร์มบันทึกข้อมูลลง database สำเร็จเท่านั้น
      // (ดู cleanupReplacedFile ที่เรียกจากฟอร์มแม่) — ที่นี่แค่ผูก URL ใหม่เข้ากับฟอร์ม
      onChange(result.url);
      toast.success("อัปโหลดสำเร็จ!");
    } catch (err: unknown) {
      if (err instanceof DOMException && err.name === "AbortError") {
        toast.message("ยกเลิกการอัปโหลดแล้ว");
      } else {
        toast.error(err instanceof Error ? err.message : "อัปโหลดไม่สำเร็จ");
      }
    } finally {
      abortRef.current = null;
      endUpload();
    }
  };

  const handleUrlSubmit = async () => {
    const url = urlDraft.trim();
    if (!url) return;

    const controller = new AbortController();
    abortRef.current = controller;
    beginUpload();
    setPhase("processing"); // ฝั่งเซิร์ฟเวอร์ดึงรูป+แปลงไฟล์ในคำขอเดียว ไม่มีความคืบหน้าราย byte ให้ติดตาม
    try {
      const result = await uploadFromUrl(folder, url, { signal: controller.signal });
      onChange(result.url);
      setUrlDraft("");
      toast.success("เพิ่มรูปภาพจาก URL สำเร็จ!");
    } catch (err: unknown) {
      if (err instanceof DOMException && err.name === "AbortError") {
        toast.message("ยกเลิกการอัปโหลดแล้ว");
      } else {
        toast.error(err instanceof Error ? err.message : "เพิ่มรูปภาพจาก URL ไม่สำเร็จ");
      }
    } finally {
      abortRef.current = null;
      endUpload();
    }
  };

  const handleRemove = () => {
    if (!value) return;
    // แค่เคลียร์ค่าในฟอร์ม — ไฟล์จริงใน storage จะถูกลบหลังบันทึกฟอร์มสำเร็จเท่านั้น
    // (เพื่อไม่ให้ไฟล์เดิมหายไปก่อน ถ้าผู้ใช้กดยกเลิก/ออกจากหน้าโดยไม่บันทึก)
    onChange("");
  };

  return (
    <div>
      <label className={`block ${labelClassName} text-xs font-semibold mb-1.5 uppercase tracking-wider`}>
        {label}
      </label>

      {value && isImage && !uploading && (
        <ImagePreviewButton
          src={value}
          title="ดูรูปภาพ"
          className="mb-2 h-32 w-full rounded-xl"
        />
      )}
      {value && !isImage && !uploading && (
        <a href={value} target="_blank" rel="noreferrer" className="block mb-2 text-sm text-blue-500 truncate">
          {value}
        </a>
      )}

      {uploading && (
        <div className="mb-2.5 p-3 rounded-xl border border-blue-100" style={{ background: "rgba(59,130,246,0.06)" }}>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-blue-600">{PHASE_LABEL[phase]}</span>
            {phase === "uploading" && <span className="text-xs text-blue-500">{progress}%</span>}
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(59,130,246,0.15)" }}>
            <div
              className="h-full rounded-full transition-all duration-150"
              style={{
                background: "#2563eb",
                width: phase === "uploading" ? `${progress}%` : "100%",
                ...(phase === "processing" ? { animation: "imageUploadPulse 1.1s ease-in-out infinite" } : {}),
              }}
            />
          </div>
          <style>{`@keyframes imageUploadPulse { 0%,100% { opacity: 0.5; } 50% { opacity: 1; } }`}</style>
          <button
            type="button"
            onClick={handleCancel}
            className="mt-2.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-red-500 hover:bg-red-50"
          >
            <i className="fa-solid fa-xmark mr-1"></i>ยกเลิกการอัปโหลด
          </button>
        </div>
      )}

      <input ref={inputRef} type="file" accept={accept} onChange={handleFile} className="hidden" disabled={uploading} />

      {isImage && !uploading && (
        <div className="flex items-center gap-1 mb-2.5 p-1 rounded-lg bg-slate-100 w-fit">
          <button
            type="button"
            onClick={() => setMode("file")}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
              mode === "file" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500"
            }`}
          >
            อัปโหลดไฟล์
          </button>
          <button
            type="button"
            onClick={() => setMode("url")}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
              mode === "url" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500"
            }`}
          >
            วาง URL รูปภาพ
          </button>
        </div>
      )}

      {uploading ? null : mode === "url" && isImage ? (
        <div>
          <div className="flex items-center gap-2">
            <input
              type="url"
              value={urlDraft}
              onChange={(e) => setUrlDraft(e.target.value)}
              placeholder="https://example.com/image.png"
              disabled={uploading}
              className="flex-1 px-3 py-2.5 rounded-xl text-sm border border-gray-300 outline-none disabled:opacity-50"
            />
            <button
              type="button"
              onClick={handleUrlSubmit}
              disabled={uploading || !urlDraft.trim()}
              className="px-4 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-50"
              style={{ background: "rgba(59,130,246,0.15)", color: "#2563eb" }}
            >
              เพิ่มรูป
            </button>
          </div>
          {urlDraft.trim() && (
            <div className="mt-2 rounded-xl overflow-hidden h-24 border border-gray-200">
              {/* client-side preview only — the server re-validates and re-encodes the image on submit */}
              <img
                src={urlDraft.trim()}
                className="w-full h-full object-cover"
                alt=""
                onError={(e) => { (e.target as HTMLImageElement).style.opacity = "0.2"; }}
              />
            </div>
          )}
          {value && (
            <button
              type="button"
              onClick={handleRemove}
              disabled={uploading}
              className="mt-2 px-3 py-2 rounded-xl text-sm text-red-500 hover:bg-red-50 disabled:opacity-50"
            >
              ลบรูปปัจจุบัน
            </button>
          )}
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="px-4 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-50"
            style={{ background: "rgba(59,130,246,0.15)", color: "#2563eb" }}
          >
            {value ? "แทนที่ไฟล์" : "อัปโหลดไฟล์"}
          </button>
          {value && (
            <button
              type="button"
              onClick={handleRemove}
              disabled={uploading}
              className="px-3 py-2.5 rounded-xl text-sm text-red-500 hover:bg-red-50 disabled:opacity-50"
            >
              ลบ
            </button>
          )}
        </div>
      )}
    </div>
  );
}
