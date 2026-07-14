"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { adminCreate, adminUpdate, adminDelete } from "@/lib/admin-api";
import type { EventItem } from "@/lib/types";

const PRESET_COLORS = [
  "#157493", "#7c3aed", "#059669", "#dc2626",
  "#d97706", "#0891b2", "#be185d", "#1e3a8a",
];

const FIELD_STYLES = {
  background: "#fff",
  border: "1.5px solid #d1d5db",
  color: "#111827",
};

export default function EventForm({ event, categorySuggestions = [] }: { event?: EventItem; categorySuggestions?: string[] }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    event_date: event?.date ?? "",
    title: event?.title ?? "",
    color: event?.color ?? "#157493",
    category: event?.category ?? "",
    description: event?.description ?? "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      if (event?.id) {
        await adminUpdate("events", event.id, form);
      } else {
        await adminCreate("events", form);
      }
      toast.success("บันทึกสำเร็จ!");
      router.push("/admin/events");
      router.refresh();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "เกิดข้อผิดพลาด");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!event?.id || !confirm(`ลบกิจกรรม "${event.title}"?`)) return;
    setDeleting(true);
    try {
      await adminDelete("events", event.id);
      router.push("/admin/events");
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
          วันที่ (YYYY-MM-DD) *
        </label>
        <input
          type="date"
          required
          value={form.event_date}
          onChange={(e) => setForm((f) => ({ ...f, event_date: e.target.value }))}
          className={inputClass}
          style={FIELD_STYLES}
        />
      </div>

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
          placeholder="เช่น การประชุมวันอาทิตย์"
        />
      </div>

      <div>
        <label className="block text-gray-600 text-xs font-semibold mb-1.5 uppercase tracking-wider">
          ชื่อหมวดหมู่ (สำหรับสัญลักษณ์ในปฏิทิน)
        </label>
        <input
          type="text"
          list="category-suggestions"
          value={form.category}
          onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
          className={inputClass}
          style={FIELD_STYLES}
          placeholder="เช่น การประชุมศีลระลึก"
        />
        <datalist id="category-suggestions">
          {categorySuggestions.map((c) => (
            <option key={c} value={c} />
          ))}
        </datalist>
        <p className="text-gray-400 text-xs mt-1.5">กิจกรรมที่ใช้ชื่อหมวดหมู่และสีเดียวกันจะแสดงเป็นสัญลักษณ์เดียวกันในหน้าปฏิทิน</p>
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
          placeholder="รายละเอียดกิจกรรม..."
        />
      </div>

      <div>
        <label className="block text-gray-500 text-xs font-semibold mb-2 uppercase tracking-wider">
          สี
        </label>
        <div className="flex items-center gap-3 flex-wrap">
          {PRESET_COLORS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setForm((f) => ({ ...f, color: c }))}
              className="w-8 h-8 rounded-full transition-transform"
              style={{
                background: c,
                transform: form.color === c ? "scale(1.25)" : "scale(1)",
                boxShadow: form.color === c ? `0 0 0 3px #fff, 0 0 0 5px ${c}` : "none",
              }}
            />
          ))}
          <input
            type="color"
            value={form.color}
            onChange={(e) => setForm((f) => ({ ...f, color: e.target.value }))}
            className="w-8 h-8 rounded-full cursor-pointer border-0"
            title="เลือกสีเอง"
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="w-full sm:w-auto px-4 sm:px-6 py-3 rounded-xl font-semibold text-sm whitespace-nowrap disabled:opacity-50"
          style={{ background: "linear-gradient(135deg,#157493,#0f6280)", color: "#fff" }}
        >
          {saving ? "กำลังบันทึก…" : event ? "บันทึกการเปลี่ยนแปลง" : "เพิ่มกิจกรรม"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/events")}
          className="flex-1 sm:flex-none px-4 sm:px-6 py-3 rounded-xl text-gray-500 text-sm whitespace-nowrap hover:text-white transition-colors"
          style={{ background: "rgba(226,232,240,0.5)" }}
        >
          ยกเลิก
        </button>
        {event && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
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
