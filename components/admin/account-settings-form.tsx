"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const FIELD_STYLES = {
  background: "#fff",
  border: "1.5px solid #d1d5db",
  color: "#111827",
};

export default function AccountSettingsForm({ currentUsername }: { currentUsername: string }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    currentPassword: "",
    newUsername: currentUsername,
    newPassword: "",
    confirmPassword: "",
  });

  const inputClass = "w-full px-4 py-3 rounded-xl text-sm outline-none transition-all";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.newPassword && form.newPassword !== form.confirmPassword) {
      toast.error("รหัสผ่านใหม่และการยืนยันไม่ตรงกัน");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: form.currentPassword,
          newUsername: form.newUsername,
          newPassword: form.newPassword || undefined,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "บันทึกไม่สำเร็จ");
      toast.success("บันทึกบัญชีผู้ดูแลระบบสำเร็จ!");
      setForm((f) => ({ ...f, currentPassword: "", newPassword: "", confirmPassword: "" }));
      router.refresh();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "เกิดข้อผิดพลาด");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-gray-600 text-xs font-semibold mb-1.5 uppercase tracking-wider">
          ชื่อผู้ใช้
        </label>
        <input
          type="text"
          required
          value={form.newUsername}
          onChange={(e) => setForm((f) => ({ ...f, newUsername: e.target.value }))}
          className={inputClass}
          style={FIELD_STYLES}
        />
      </div>

      <div>
        <label className="block text-gray-600 text-xs font-semibold mb-1.5 uppercase tracking-wider">
          รหัสผ่านใหม่ (เว้นว่างถ้าไม่เปลี่ยน)
        </label>
        <input
          type="password"
          autoComplete="new-password"
          value={form.newPassword}
          onChange={(e) => setForm((f) => ({ ...f, newPassword: e.target.value }))}
          className={inputClass}
          style={FIELD_STYLES}
        />
      </div>

      {form.newPassword && (
        <div>
          <label className="block text-gray-600 text-xs font-semibold mb-1.5 uppercase tracking-wider">
            ยืนยันรหัสผ่านใหม่
          </label>
          <input
            type="password"
            autoComplete="new-password"
            value={form.confirmPassword}
            onChange={(e) => setForm((f) => ({ ...f, confirmPassword: e.target.value }))}
            className={inputClass}
            style={FIELD_STYLES}
          />
        </div>
      )}

      <div>
        <label className="block text-gray-600 text-xs font-semibold mb-1.5 uppercase tracking-wider">
          รหัสผ่านปัจจุบัน *
        </label>
        <input
          type="password"
          required
          autoComplete="current-password"
          value={form.currentPassword}
          onChange={(e) => setForm((f) => ({ ...f, currentPassword: e.target.value }))}
          className={inputClass}
          style={FIELD_STYLES}
          placeholder="ต้องกรอกเพื่อยืนยันตัวตนก่อนบันทึก"
        />
      </div>

      <button
        type="submit"
        disabled={saving}
        className="px-6 py-3 rounded-xl font-semibold text-sm disabled:opacity-50"
        style={{ background: "linear-gradient(135deg,#157493,#0f6280)", color: "#fff" }}
      >
        {saving ? "กำลังบันทึก…" : "บันทึกบัญชีผู้ดูแลระบบ"}
      </button>
    </form>
  );
}
