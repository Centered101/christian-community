"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { adminCreate, adminDelete, adminUpdate } from "@/lib/admin-api";
import type { SpiritualThought } from "@/lib/types";

const FIELD_STYLES = {
  background: "#fff",
  border: "1.5px solid #d1d5db",
  color: "#111827",
};

export default function SpiritualThoughtForm({ thought }: { thought?: SpiritualThought }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [form, setForm] = useState({
    text: thought?.text ?? "",
    text_en: thought?.text_en ?? "",
    ref: thought?.ref ?? "",
    ref_en: thought?.ref_en ?? "",
    is_visible: thought?.is_visible ?? true,
    sort_order: thought?.sort_order ?? 0,
  });

  const inputClass = "w-full px-4 py-3 rounded-xl text-sm outline-none transition-all";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (thought?.id) {
        await adminUpdate("spiritual_thoughts", thought.id, form);
      } else {
        await adminCreate("spiritual_thoughts", form);
      }
      toast.success("บันทึกข้อคิดสำเร็จ");
      router.push("/admin/spiritual-thoughts");
      router.refresh();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "บันทึกไม่สำเร็จ");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!thought?.id || !confirm("ลบข้อคิดนี้?")) return;
    setDeleting(true);
    try {
      await adminDelete("spiritual_thoughts", thought.id);
      router.push("/admin/spiritual-thoughts");
      router.refresh();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "ลบไม่สำเร็จ");
      setDeleting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-gray-600 text-xs font-semibold mb-1.5 uppercase tracking-wider">
          ข้อคิด (TH) *
        </label>
        <textarea
          required
          value={form.text}
          onChange={(e) => setForm((f) => ({ ...f, text: e.target.value }))}
          rows={4}
          className={`${inputClass} resize-none`}
          style={FIELD_STYLES}
        />
      </div>

      <div>
        <label className="block text-gray-600 text-xs font-semibold mb-1.5 uppercase tracking-wider">
          ข้อคิด (EN)
        </label>
        <textarea
          value={form.text_en}
          onChange={(e) => setForm((f) => ({ ...f, text_en: e.target.value }))}
          rows={4}
          className={`${inputClass} resize-none`}
          style={FIELD_STYLES}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-600 text-xs font-semibold mb-1.5 uppercase tracking-wider">
            อ้างอิง (TH)
          </label>
          <input
            type="text"
            value={form.ref}
            onChange={(e) => setForm((f) => ({ ...f, ref: e.target.value }))}
            className={inputClass}
            style={FIELD_STYLES}
            placeholder="เช่น ยอห์น 3:16"
          />
        </div>
        <div>
          <label className="block text-gray-600 text-xs font-semibold mb-1.5 uppercase tracking-wider">
            อ้างอิง (EN)
          </label>
          <input
            type="text"
            value={form.ref_en}
            onChange={(e) => setForm((f) => ({ ...f, ref_en: e.target.value }))}
            className={inputClass}
            style={FIELD_STYLES}
            placeholder="เช่น John 3:16"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">
          <input
            type="checkbox"
            checked={form.is_visible}
            onChange={(e) => setForm((f) => ({ ...f, is_visible: e.target.checked }))}
            className="h-4 w-4 accent-[#157493]"
          />
          แสดงในหน้าแรก
        </label>
        <div>
          <label className="block text-gray-600 text-xs font-semibold mb-1.5 uppercase tracking-wider">
            ลำดับ
          </label>
          <input
            type="number"
            value={form.sort_order}
            onChange={(e) => setForm((f) => ({ ...f, sort_order: Number(e.target.value) }))}
            className={inputClass}
            style={FIELD_STYLES}
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="w-full sm:w-auto px-4 sm:px-6 py-3 rounded-xl font-semibold text-sm whitespace-nowrap disabled:opacity-50"
          style={{ background: "#157493", color: "#fff" }}
        >
          {saving ? "กำลังบันทึก…" : thought ? "บันทึกการเปลี่ยนแปลง" : "เพิ่มข้อคิด"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/spiritual-thoughts")}
          className="flex-1 sm:flex-none px-4 sm:px-6 py-3 rounded-xl text-gray-500 text-sm whitespace-nowrap"
          style={{ background: "rgba(226,232,240,0.5)" }}
        >
          ยกเลิก
        </button>
        {thought && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
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
