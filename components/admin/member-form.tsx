"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { adminCreate, adminUpdate, adminDelete } from "@/lib/admin-api";
import { deleteFileByUrl, cleanupReplacedFile } from "@/lib/supabase/storage";
import ImageUpload from "@/components/admin/image-upload";
import { useUploadLock } from "@/lib/admin-upload-lock";
import { calculateAge, formatBirthdayForDateInput } from "@/lib/member-age";
import type { Member } from "@/lib/types";

type Props = {
  member?: Member;
};

const FIELD_STYLES = {
  background: "#fff",
  border: "1.5px solid #d1d5db",
  color: "#111827",
};

export default function MemberForm({ member }: Props) {
  const router = useRouter();
  const { isUploading } = useUploadLock();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [noTempleRecommend, setNoTempleRecommend] = useState(!member?.certificateExpiresAt);

  const [form, setForm] = useState({
    name: member?.name ?? "",
    name_en: member?.name_en ?? "",
    role: member?.role ?? "",
    avatar: member?.avatar ?? "",
    phone: member?.phone ?? "",
    email: member?.email ?? "",
    birthday: formatBirthdayForDateInput(member?.birthday ?? ""),
    address: member?.address ?? "",
    join_date: member?.joinDate ?? "",
    calling: member?.calling ?? "",
    certificate_expires_at: member?.certificateExpiresAt ?? "",
    testimony: member?.testimony ?? "",
    tags: member?.tags ?? [] as string[],
    role_en: member?.role_en ?? "",
    calling_en: member?.calling_en ?? "",
    testimony_en: member?.testimony_en ?? "",
  });

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !form.tags.includes(t)) {
      setForm((f) => ({ ...f, tags: [...f.tags, t] }));
    }
    setTagInput("");
  };

  const removeTag = (t: string) => setForm((f) => ({ ...f, tags: f.tags.filter((x) => x !== t) }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const payload = {
        ...form,
        certificate_expires_at: noTempleRecommend ? "" : form.certificate_expires_at,
      };
      if (member?.id) {
        await adminUpdate("members", member.id, payload);
      } else {
        await adminCreate("members", payload);
      }
      cleanupReplacedFile(member?.avatar, form.avatar);
      toast.success("บันทึกสำเร็จ!");
      router.push("/admin/members");
      router.refresh();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "เกิดข้อผิดพลาด");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!member?.id || !confirm(`ลบ ${member.name} ออกจากระบบ?`)) return;
    setDeleting(true);
    try {
      await adminDelete("members", member.id);
      if (member.avatar) void deleteFileByUrl(member.avatar);
      router.push("/admin/members");
      router.refresh();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "ลบไม่สำเร็จ");
      setDeleting(false);
    }
  };

  const inputClass = "w-full px-4 py-3 rounded-xl text-sm outline-none transition-all";
  const age = calculateAge(form.birthday);

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <ImageUpload
            value={form.avatar}
            onChange={(url) => setForm((f) => ({ ...f, avatar: url }))}
            folder="avatars"
            label="รูปประจำตัว"
          />
        </div>
        <div className="sm:col-span-2 rounded-2xl border border-amber-100 bg-amber-50/40 p-4">
          <label className="block text-amber-900 text-sm font-bold mb-1.5">
            ใบรับรองพระวิหาร
          </label>
          <p className="mb-3 text-xs text-amber-700/80">
            ตั้งเฉพาะวันหมดอายุเพื่อให้ระบบแสดงการนับถอยหลัง ไม่มีการอัปโหลดไฟล์หรือวาง URL
          </p>
          <label className="mb-3 flex items-center gap-2 rounded-xl border border-amber-100 bg-white/70 px-3 py-2 text-sm font-semibold text-amber-900">
            <input
              type="checkbox"
              checked={noTempleRecommend}
              onChange={(e) => {
                setNoTempleRecommend(e.target.checked);
                if (e.target.checked) {
                  setForm((f) => ({ ...f, certificate_expires_at: "" }));
                }
              }}
              className="h-4 w-4 rounded border-amber-300 text-amber-600"
            />
            ยังไม่ได้ใบรับรองพระวิหาร
          </label>
          <input
            type="date"
            value={form.certificate_expires_at}
            onChange={(e) => setForm((f) => ({ ...f, certificate_expires_at: e.target.value }))}
            disabled={noTempleRecommend}
            className={inputClass}
            style={FIELD_STYLES}
          />
        </div>
        {(
          [
            { key: "name", label: "ชื่อ (TH) *", required: true },
            { key: "name_en", label: "ชื่อ (EN, ไม่บังคับ)" },
            { key: "role", label: "ตำแหน่ง *", required: true },
            { key: "role_en", label: "ตำแหน่ง (อังกฤษ, ไม่บังคับ)" },
            { key: "phone", label: "เบอร์โทร" },
            { key: "email", label: "อีเมล" },
            { key: "birthday", label: "วันเกิดพร้อมปีเกิด" },
            { key: "address", label: "ที่อยู่" },
            { key: "join_date", label: "วันที่เข้าร่วม (เช่น 2024)" },
            { key: "calling", label: "หน้าที่รับผิดชอบ" },
            { key: "calling_en", label: "หน้าที่รับผิดชอบ (อังกฤษ, ไม่บังคับ)" },
          ] as { key: keyof typeof form; label: string; required?: boolean }[]
        ).map(({ key, label, required }) => (
          <div key={key} className={key === "address" || key === "calling" || key === "calling_en" ? "sm:col-span-2" : ""}>
            <label className="block text-gray-600 text-xs font-semibold mb-1.5 uppercase tracking-wider">
              {label}
            </label>
            <input
              type={key === "birthday" ? "date" : "text"}
              required={required}
              value={String(form[key])}
              onChange={set(key)}
              className={inputClass}
              style={FIELD_STYLES}
              max={key === "birthday" ? new Date().toISOString().slice(0, 10) : undefined}
            />
            {key === "birthday" && form.birthday.trim() && (
              <p className={`mt-1.5 text-xs ${age !== null && (age < 18 || age > 35) ? "text-red-500" : "text-slate-500"}`}>
                {age === null
                  ? "ใส่ปีเกิดด้วยเพื่อให้ระบบคำนวณอายุอัตโนมัติ"
                  : age < 18
                    ? `อายุ ${age} ปี — จะแสดงในหน้าสมาชิกเมื่ออายุครบ 18 ปี`
                    : age > 35
                    ? `อายุ ${age} ปี — ไม่อยู่ในช่วง 18-35 ปี จึงไม่แสดงในหน้าสมาชิก`
                    : `อายุ ${age} ปี`}
              </p>
            )}
          </div>
        ))}

        <div className="sm:col-span-2">
          <label className="block text-gray-600 text-xs font-semibold mb-1.5 uppercase tracking-wider">
            ประจักษ์พยาน
          </label>
          <textarea
            rows={3}
            value={form.testimony}
            onChange={set("testimony")}
            className={inputClass + " resize-none"}
            style={FIELD_STYLES}
          />
          <textarea
            rows={3}
            value={form.testimony_en}
            onChange={set("testimony_en")}
            className={inputClass + " resize-none mt-2"}
            style={FIELD_STYLES}
            placeholder="ฉบับภาษาอังกฤษ (ไม่บังคับ)"
          />
        </div>

        {/* Tags */}
        <div className="sm:col-span-2">
          <label className="block text-gray-600 text-xs font-semibold mb-1.5 uppercase tracking-wider">
            แท็ก
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") { e.preventDefault(); addTag(); }
              }}
              className={inputClass + " flex-1"}
              style={FIELD_STYLES}
              placeholder="พิมพ์ tag แล้วกด Enter"
            />
            <button
              type="button"
              onClick={addTag}
              className="px-4 py-3 rounded-xl text-sm font-semibold"
              style={{ background: "rgba(59,130,246,0.2)", color: "#60a5fa" }}
            >
              +
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {form.tags.map((t) => (
              <span
                key={t}
                className="flex items-center gap-1 px-3 py-1 rounded-full text-xs"
                style={{ background: "rgba(59,130,246,0.15)", color: "#60a5fa" }}
              >
                {t}
                <button type="button" onClick={() => removeTag(t)} className="hover:text-red-400 ml-1">
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-2">
        <button
          type="submit"
          disabled={saving || isUploading}
          className="w-full sm:w-auto px-4 sm:px-6 py-3 rounded-xl font-semibold text-sm whitespace-nowrap disabled:opacity-50"
          style={{ background: "linear-gradient(135deg,#157493,#0f6280)", color: "#fff" }}
        >
          {saving ? "กำลังบันทึก…" : member ? "บันทึกการเปลี่ยนแปลง" : "เพิ่มสมาชิก"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/members")}
          disabled={isUploading}
          className="flex-1 sm:flex-none px-4 sm:px-6 py-3 rounded-xl text-gray-500 text-sm whitespace-nowrap hover:text-white transition-colors disabled:opacity-50"
          style={{ background: "rgba(226,232,240,0.5)" }}
        >
          ยกเลิก
        </button>
        {member && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting || isUploading}
            className="flex-1 sm:flex-none sm:ml-auto px-4 py-3 rounded-xl text-red-500 text-sm whitespace-nowrap hover:bg-red-50 transition-colors disabled:opacity-50"
          >
            <i className="fa-solid fa-trash mr-2"></i>
            {deleting ? "กำลังลบ…" : "ลบสมาชิก"}
          </button>
        )}
      </div>
    </form>
  );
}
