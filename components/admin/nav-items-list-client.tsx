"use client";

import { useState } from "react";
import { toast } from "sonner";
import { adminCreate, adminUpdate } from "@/lib/admin-api";
import type { NavItem } from "@/lib/types";

const EMPTY_NEW_ITEM = {
  key: "",
  href: "",
  label: "",
  label_en: "",
  page_title: "",
  page_title_en: "",
  page_subtitle: "",
  page_subtitle_en: "",
  is_visible: true,
};

export default function NavItemsListClient({
  initialItems,
  loadError,
}: {
  initialItems: NavItem[];
  loadError?: string;
}) {
  const [items, setItems] = useState(initialItems);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [newItem, setNewItem] = useState(EMPTY_NEW_ITEM);

  const createItem = async (e: React.FormEvent) => {
    e.preventDefault();
    const key = newItem.key.trim();
    const href = newItem.href.trim();
    const label = newItem.label.trim();
    if (!key || !href || !label) {
      toast.error("กรอก key, href และชื่อเมนู (TH) ก่อน");
      return;
    }
    setCreating(true);
    try {
      const created = await adminCreate("nav_items", {
        key,
        href,
        label,
        label_en: newItem.label_en.trim(),
        page_title: newItem.page_title.trim(),
        page_title_en: newItem.page_title_en.trim(),
        page_subtitle: newItem.page_subtitle.trim(),
        page_subtitle_en: newItem.page_subtitle_en.trim(),
        is_visible: newItem.is_visible,
        sort_order: items.length,
      });
      setItems((prev) => [...prev, created as NavItem]);
      setNewItem(EMPTY_NEW_ITEM);
      toast.success("เพิ่มหน้าแล้ว");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "เพิ่มเมนูไม่สำเร็จ");
    } finally {
      setCreating(false);
    }
  };

  const saveTextField = async (
    id: string,
    field: "key" | "href" | "label" | "label_en" | "page_title" | "page_title_en" | "page_subtitle" | "page_subtitle_en",
    value: string,
  ) => {
    setBusyId(id);
    try {
      await adminUpdate("nav_items", id, { [field]: value });
      setItems((prev) => prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
      toast.success("บันทึกแล้ว");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "บันทึกไม่สำเร็จ");
    } finally {
      setBusyId(null);
    }
  };

  const toggleVisible = async (item: NavItem) => {
    if (!item.id) return;
    const nextVisible = !item.is_visible;
    setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, is_visible: nextVisible } : i)));
    try {
      await adminUpdate("nav_items", item.id, { is_visible: nextVisible });
    } catch (err: unknown) {
      setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, is_visible: item.is_visible } : i)));
      toast.error(err instanceof Error ? err.message : "บันทึกไม่สำเร็จ");
    }
  };

  const move = async (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= items.length) return;
    const a = items[index];
    const b = items[target];
    if (!a.id || !b.id) return;

    const reordered = [...items];
    reordered[index] = b;
    reordered[target] = a;
    setItems(reordered);

    try {
      await Promise.all([
        adminUpdate("nav_items", a.id, { sort_order: b.sort_order ?? target }),
        adminUpdate("nav_items", b.id, { sort_order: a.sort_order ?? index }),
      ]);
    } catch (err: unknown) {
      setItems(items);
      toast.error(err instanceof Error ? err.message : "จัดลำดับไม่สำเร็จ");
    }
  };

  const inputClass = "w-full rounded-lg px-3 py-2 text-sm outline-none";
  const inputStyle = { background: "#fff", border: "1.5px solid #d1d5db", color: "#111827" };

  return (
    <div className="space-y-3">
      {loadError && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          <p className="font-semibold">โหลดข้อมูลจาก DB ไม่สำเร็จ</p>
          <p className="mt-1">{loadError}</p>
          <p className="mt-2 text-xs text-amber-700">
            ถ้าเพิ่งเพิ่มระบบ TH/EN ให้รัน SQL เพิ่มคอลัมน์ `label_en`, `page_title_en`, `page_subtitle_en` ในตาราง `nav_items` ก่อน
          </p>
        </div>
      )}

      <form
        onSubmit={createItem}
        className="rounded-2xl p-4"
        style={{ background: "#fff", border: "1px solid #e5e7eb" }}
      >
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-gray-900">เพิ่มหน้าใหม่</h2>
            <p className="text-xs text-gray-500">
              สร้างข้อมูลหน้าใน DB ก่อน แล้วเลือกได้ว่าจะให้แสดงบน Navbar หรือเก็บไว้เป็นหน้าอย่างเดียว
            </p>
          </div>
          <button
            type="submit"
            disabled={creating}
            className="rounded-xl px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
            style={{ background: "#157493" }}
          >
            <i className="fa-solid fa-plus mr-2 text-xs"></i>
            {creating ? "กำลังเพิ่ม…" : "เพิ่ม"}
          </button>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500">Key *</span>
            <input
              type="text"
              value={newItem.key}
              onChange={(e) => setNewItem((v) => ({ ...v, key: e.target.value }))}
              placeholder="เช่น chat"
              className={inputClass}
              style={inputStyle}
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500">Href *</span>
            <input
              type="text"
              value={newItem.href}
              onChange={(e) => setNewItem((v) => ({ ...v, href: e.target.value }))}
              placeholder="เช่น /chat"
              className={inputClass}
              style={inputStyle}
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500">ชื่อเมนู (TH) *</span>
            <input
              type="text"
              value={newItem.label}
              onChange={(e) => setNewItem((v) => ({ ...v, label: e.target.value }))}
              className={inputClass}
              style={inputStyle}
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500">ชื่อเมนู (EN)</span>
            <input
              type="text"
              value={newItem.label_en}
              onChange={(e) => setNewItem((v) => ({ ...v, label_en: e.target.value }))}
              className={inputClass}
              style={inputStyle}
            />
          </label>
        </div>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500">หัวข้อหน้า (TH)</span>
            <input
              type="text"
              value={newItem.page_title}
              onChange={(e) => setNewItem((v) => ({ ...v, page_title: e.target.value }))}
              className={inputClass}
              style={inputStyle}
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500">หัวข้อหน้า (EN)</span>
            <input
              type="text"
              value={newItem.page_title_en}
              onChange={(e) => setNewItem((v) => ({ ...v, page_title_en: e.target.value }))}
              className={inputClass}
              style={inputStyle}
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500">คำอธิบายหน้า (TH)</span>
            <input
              type="text"
              value={newItem.page_subtitle}
              onChange={(e) => setNewItem((v) => ({ ...v, page_subtitle: e.target.value }))}
              className={inputClass}
              style={inputStyle}
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500">คำอธิบายหน้า (EN)</span>
            <input
              type="text"
              value={newItem.page_subtitle_en}
              onChange={(e) => setNewItem((v) => ({ ...v, page_subtitle_en: e.target.value }))}
              className={inputClass}
              style={inputStyle}
            />
          </label>
        </div>
        <label className="mt-3 flex items-center gap-3 rounded-xl bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700">
          <input
            type="checkbox"
            checked={newItem.is_visible}
            onChange={(e) => setNewItem((v) => ({ ...v, is_visible: e.target.checked }))}
            className="h-4 w-4 accent-[#157493]"
          />
          แสดงหน้านี้บน Navbar และเมนูมือถือ
        </label>
      </form>

      {items.length === 0 && !loadError && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center text-sm text-slate-500">
          ยังไม่มีหน้าใน DB ให้เพิ่มจากฟอร์มด้านบน
        </div>
      )}

      {items.map((item, i) => (
        <div
          key={item.id ?? item.key}
          className="rounded-2xl p-4"
          style={{ background: "#fff", border: "1px solid #e5e7eb" }}
        >
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs font-semibold text-slate-400">หน้า</p>
              <p className="truncate text-sm font-semibold text-gray-900">{item.href}</p>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => move(i, -1)}
                disabled={i === 0}
                className="h-8 w-8 rounded-lg text-gray-400 hover:text-[#157493] disabled:opacity-25"
                aria-label="เลื่อนขึ้น"
              >
                <i className="fa-solid fa-chevron-up text-xs"></i>
              </button>
              <button
                type="button"
                onClick={() => move(i, 1)}
                disabled={i === items.length - 1}
                className="h-8 w-8 rounded-lg text-gray-400 hover:text-[#157493] disabled:opacity-25"
                aria-label="เลื่อนลง"
              >
                <i className="fa-solid fa-chevron-down text-xs"></i>
              </button>
              <button
                type="button"
                onClick={() => toggleVisible(item)}
                className="flex h-8 items-center justify-center rounded-lg px-3 text-xs font-semibold transition-colors"
                style={
                  item.is_visible
                    ? { background: "rgba(21,116,147,0.1)", color: "#157493" }
                    : { background: "rgba(107,114,128,0.1)", color: "#6b7280" }
                }
              >
                <i className={`fa-solid ${item.is_visible ? "fa-eye" : "fa-eye-slash"} mr-1.5`}></i>
                {item.is_visible ? "อยู่ใน Nav" : "ไม่อยู่ใน Nav"}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500">Key</span>
              <input
                type="text"
                defaultValue={item.key}
                disabled={busyId === item.id}
                onBlur={(e) => {
                  const value = e.target.value.trim();
                  if (item.id && value && value !== item.key) saveTextField(item.id, "key", value);
                }}
                className={inputClass}
                style={inputStyle}
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500">Href</span>
              <input
                type="text"
                defaultValue={item.href}
                disabled={busyId === item.id}
                onBlur={(e) => {
                  const value = e.target.value.trim();
                  if (item.id && value && value !== item.href) saveTextField(item.id, "href", value);
                }}
                className={inputClass}
                style={inputStyle}
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500">ชื่อเมนู (TH)</span>
              <input
                type="text"
                defaultValue={item.label}
                disabled={busyId === item.id}
                onBlur={(e) => {
                  const value = e.target.value.trim();
                  if (item.id && value && value !== item.label) saveTextField(item.id, "label", value);
                }}
                className={inputClass}
                style={inputStyle}
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500">ชื่อเมนู (EN)</span>
              <input
                type="text"
                defaultValue={item.label_en ?? ""}
                disabled={busyId === item.id}
                onBlur={(e) => {
                  const value = e.target.value.trim();
                  if (item.id && value !== (item.label_en ?? "")) saveTextField(item.id, "label_en", value);
                }}
                className={inputClass}
                style={inputStyle}
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500">หัวข้อหน้า (TH)</span>
              <input
                type="text"
                defaultValue={item.page_title ?? ""}
                disabled={busyId === item.id}
                onBlur={(e) => {
                  const value = e.target.value.trim();
                  if (item.id && value !== (item.page_title ?? "")) saveTextField(item.id, "page_title", value);
                }}
                className={inputClass}
                style={inputStyle}
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500">หัวข้อหน้า (EN)</span>
              <input
                type="text"
                defaultValue={item.page_title_en ?? ""}
                disabled={busyId === item.id}
                onBlur={(e) => {
                  const value = e.target.value.trim();
                  if (item.id && value !== (item.page_title_en ?? "")) saveTextField(item.id, "page_title_en", value);
                }}
                className={inputClass}
                style={inputStyle}
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500">คำอธิบายหน้า (TH)</span>
              <input
                type="text"
                defaultValue={item.page_subtitle ?? ""}
                disabled={busyId === item.id}
                onBlur={(e) => {
                  const value = e.target.value.trim();
                  if (item.id && value !== (item.page_subtitle ?? "")) saveTextField(item.id, "page_subtitle", value);
                }}
                className={inputClass}
                style={inputStyle}
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500">คำอธิบายหน้า (EN)</span>
              <input
                type="text"
                defaultValue={item.page_subtitle_en ?? ""}
                disabled={busyId === item.id}
                onBlur={(e) => {
                  const value = e.target.value.trim();
                  if (item.id && value !== (item.page_subtitle_en ?? "")) saveTextField(item.id, "page_subtitle_en", value);
                }}
                className={inputClass}
                style={inputStyle}
              />
            </label>
          </div>
        </div>
      ))}
    </div>
  );
}
