"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { adminCreate, adminUpdate, adminDelete } from "@/lib/admin-api";
import IconPicker from "@/components/admin/icon-picker";
import type { TopicCard } from "@/lib/types";

const FIELD_STYLES = {
  background: "#fff",
  border: "1.5px solid #d1d5db",
  color: "#111827",
};

export default function TopicCardForm({ card }: { card?: TopicCard }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    icon: card?.icon ?? "fa-solid fa-star",
    title: card?.title ?? "",
    description: card?.description ?? "",
    color: card?.color ?? "#157493",
    href: card?.href ?? "/",
    title_en: card?.title_en ?? "",
    description_en: card?.description_en ?? "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      if (card?.id) {
        await adminUpdate("home_topic_cards", card.id, form);
      } else {
        await adminCreate("home_topic_cards", form);
      }
      toast.success("บันทึกสำเร็จ!");
      router.push("/admin/home-topics");
      router.refresh();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "เกิดข้อผิดพลาด");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!card?.id || !confirm(`ลบ "${card.title}"?`)) return;
    setDeleting(true);
    try {
      await adminDelete("home_topic_cards", card.id);
      router.push("/admin/home-topics");
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
        <label className="block text-gray-500 text-xs font-semibold mb-2 uppercase tracking-wider">
          สี
        </label>
        <input
          type="color"
          value={form.color}
          onChange={(e) => setForm((f) => ({ ...f, color: e.target.value }))}
          className="w-10 h-10 rounded-full cursor-pointer border-0"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="w-full sm:w-auto px-4 sm:px-6 py-3 rounded-xl font-semibold text-sm whitespace-nowrap disabled:opacity-50"
          style={{ background: "#157493", color: "#fff" }}
        >
          {saving ? "กำลังบันทึก…" : card ? "บันทึกการเปลี่ยนแปลง" : "เพิ่ม"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/home-topics")}
          className="flex-1 sm:flex-none px-4 sm:px-6 py-3 rounded-xl text-gray-500 text-sm whitespace-nowrap hover:text-white transition-colors"
          style={{ background: "rgba(226,232,240,0.5)" }}
        >
          ยกเลิก
        </button>
        {card && (
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
