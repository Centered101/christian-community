"use client";

import { useState } from "react";
import { toast } from "sonner";
import { adminUpdate } from "@/lib/admin-api";
import type { NavItem } from "@/lib/types";

export default function NavItemsListClient({ initialItems }: { initialItems: NavItem[] }) {
  const [items, setItems] = useState(initialItems);
  const [busyId, setBusyId] = useState<string | null>(null);

  const saveLabel = async (id: string, label: string) => {
    setBusyId(id);
    try {
      await adminUpdate("nav_items", id, { label });
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

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ background: "#fff", border: "1px solid #e5e7eb" }}
    >
      <table className="w-full">
        <thead>
          <tr style={{ borderBottom: "1px solid #e5e7eb" }}>
            {["ลำดับ", "หน้า", "ชื่อเมนู", "แสดง"].map((h) => (
              <th key={h} className="text-left px-5 py-3 text-gray-500 text-xs font-semibold uppercase tracking-wider">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map((item, i) => (
            <tr key={item.id} style={{ borderBottom: "1px solid #f3f4f6" }} className="hover:bg-white/5 transition-colors">
              <td className="px-5 py-3">
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => move(i, -1)}
                    disabled={i === 0}
                    className="w-6 h-6 rounded text-gray-400 hover:text-[#157493] disabled:opacity-25"
                  >
                    <i className="fa-solid fa-chevron-up text-xs"></i>
                  </button>
                  <button
                    type="button"
                    onClick={() => move(i, 1)}
                    disabled={i === items.length - 1}
                    className="w-6 h-6 rounded text-gray-400 hover:text-[#157493] disabled:opacity-25"
                  >
                    <i className="fa-solid fa-chevron-down text-xs"></i>
                  </button>
                </div>
              </td>
              <td className="px-5 py-3 text-gray-500 text-sm">{item.href}</td>
              <td className="px-5 py-3">
                <input
                  type="text"
                  defaultValue={item.label}
                  disabled={busyId === item.id}
                  onBlur={(e) => {
                    if (item.id && e.target.value.trim() && e.target.value !== item.label) {
                      saveLabel(item.id, e.target.value.trim());
                    }
                  }}
                  className="px-3 py-1.5 rounded-lg text-sm outline-none w-40"
                  style={{ background: "#fff", border: "1.5px solid #d1d5db", color: "#111827" }}
                />
              </td>
              <td className="px-5 py-3">
                <button
                  type="button"
                  onClick={() => toggleVisible(item)}
                  className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
                  style={
                    item.is_visible
                      ? { background: "rgba(21,116,147,0.1)", color: "#157493" }
                      : { background: "rgba(107,114,128,0.1)", color: "#6b7280" }
                  }
                >
                  <i className={`fa-solid ${item.is_visible ? "fa-eye" : "fa-eye-slash"} mr-1.5`}></i>
                  {item.is_visible ? "แสดงอยู่" : "ซ่อนอยู่"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
