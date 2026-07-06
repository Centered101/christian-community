"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { adminCreate, adminUpdate, adminDelete } from "@/lib/admin-api";
import IconPicker from "@/components/admin/icon-picker";
import type { Faq } from "@/lib/types";

const FIELD_STYLES = {
  background: "#fff",
  border: "1.5px solid #d1d5db",
  color: "#111827",
};

export default function FaqForm({ faq }: { faq?: Faq }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    question: faq?.question ?? "",
    answer: faq?.answer ?? "",
    icon: faq?.icon ?? "fa-solid fa-circle-question",
    question_en: faq?.question_en ?? "",
    answer_en: faq?.answer_en ?? "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      if (faq?.id) {
        await adminUpdate("faqs", faq.id, form);
      } else {
        await adminCreate("faqs", form);
      }
      toast.success("บันทึกสำเร็จ!");
      router.push("/admin/faqs");
      router.refresh();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "เกิดข้อผิดพลาด");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!faq?.id || !confirm(`ลบคำถาม "${faq.question}"?`)) return;
    setDeleting(true);
    try {
      await adminDelete("faqs", faq.id);
      router.push("/admin/faqs");
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
          คำถาม *
        </label>
        <input
          type="text"
          required
          value={form.question}
          onChange={(e) => setForm((f) => ({ ...f, question: e.target.value }))}
          className={inputClass}
          style={FIELD_STYLES}
        />
        <input
          type="text"
          value={form.question_en}
          onChange={(e) => setForm((f) => ({ ...f, question_en: e.target.value }))}
          className={`${inputClass} mt-2`}
          style={FIELD_STYLES}
          placeholder="ฉบับภาษาอังกฤษ (ไม่บังคับ)"
        />
      </div>

      <div>
        <label className="block text-gray-600 text-xs font-semibold mb-1.5 uppercase tracking-wider">
          คำตอบ *
        </label>
        <textarea
          required
          value={form.answer}
          onChange={(e) => setForm((f) => ({ ...f, answer: e.target.value }))}
          rows={4}
          className={`${inputClass} resize-none`}
          style={FIELD_STYLES}
        />
        <textarea
          value={form.answer_en}
          onChange={(e) => setForm((f) => ({ ...f, answer_en: e.target.value }))}
          rows={4}
          className={`${inputClass} resize-none mt-2`}
          style={FIELD_STYLES}
          placeholder="ฉบับภาษาอังกฤษ (ไม่บังคับ)"
        />
      </div>

      <IconPicker value={form.icon} onChange={(icon) => setForm((f) => ({ ...f, icon }))} />

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-3 rounded-xl font-semibold text-sm disabled:opacity-50"
          style={{ background: "#157493", color: "#fff" }}
        >
          {saving ? "กำลังบันทึก…" : faq ? "บันทึกการเปลี่ยนแปลง" : "เพิ่มคำถาม"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/faqs")}
          className="px-6 py-3 rounded-xl text-gray-500 text-sm hover:text-white transition-colors"
          style={{ background: "rgba(226,232,240,0.5)" }}
        >
          ยกเลิก
        </button>
        {faq && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
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
