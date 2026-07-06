"use client";

import { useState } from "react";
import { toast } from "sonner";
import { adminClearAll, adminDelete } from "@/lib/admin-api";
import AdminPageHeader from "@/components/admin/page-header";
import AdminTable from "@/components/admin/admin-table";
import type { AccessLog } from "@/lib/types";

function formatDate(ts?: string) {
  if (!ts) return "";
  return new Date(ts).toLocaleString("th-TH", { dateStyle: "medium", timeStyle: "short" });
}

export default function AccessLogsListClient({ initialLogs }: { initialLogs: AccessLog[] }) {
  const [logs, setLogs] = useState(initialLogs);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [clearing, setClearing] = useState(false);

  const handleDelete = async (id?: string) => {
    if (!id) return;
    setBusyId(id);
    try {
      await adminDelete("access_logs", id);
      setLogs((prev) => prev.filter((l) => l.id !== id));
      toast.success("ลบรายการแล้ว");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "ลบไม่สำเร็จ");
    } finally {
      setBusyId(null);
    }
  };

  const handleClearAll = async () => {
    if (logs.length === 0) return;
    if (!confirm(`ลบบันทึกการเข้าใช้งานทั้งหมด ${logs.length} รายการ? การกระทำนี้ไม่สามารถย้อนกลับได้`)) return;
    setClearing(true);
    try {
      await adminClearAll("access_logs");
      setLogs([]);
      toast.success("ลบบันทึกทั้งหมดแล้ว");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "ลบทั้งหมดไม่สำเร็จ");
    } finally {
      setClearing(false);
    }
  };

  return (
    <div className="p-4 sm:p-8">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <AdminPageHeader
          title="บันทึกการเข้าใช้งาน"
          subtitle={`${logs.length} รายการ — เลขสมาชิกไม่ได้ตรวจสอบกับฐานข้อมูล เป็นแค่บันทึกการเข้ามา`}
        />
        <button
          type="button"
          onClick={handleClearAll}
          disabled={clearing || logs.length === 0}
          className="px-4 py-2.5 rounded-xl text-sm font-semibold text-red-600 transition-colors disabled:opacity-40 active:scale-95"
          style={{ background: "rgba(239,68,68,0.1)" }}
        >
          <i className="fa-solid fa-trash mr-2"></i>
          {clearing ? "กำลังลบ…" : "ลบทั้งหมด"}
        </button>
      </div>

      <AdminTable
        headers={["เลขสมาชิก", "อุปกรณ์/เบราว์เซอร์", "เวลาที่เข้ามา", ""]}
        data={logs}
        getKey={(l) => l.id}
        emptyMessage="ยังไม่มีบันทึกการเข้าใช้งาน"
        renderRow={(l) => (
          <tr style={{ borderBottom: "1px solid #f3f4f6" }} className="hover:bg-white/5 transition-colors">
            <td className="px-5 py-3 text-gray-900 text-sm font-medium">{l.member_id}</td>
            <td className="px-5 py-3 text-gray-500 text-xs max-w-[320px] truncate">{l.user_agent}</td>
            <td className="px-5 py-3 text-slate-300 text-sm whitespace-nowrap">{formatDate(l.created_at)}</td>
            <td className="px-5 py-3">
              <button
                type="button"
                onClick={() => handleDelete(l.id)}
                disabled={busyId === l.id}
                className="text-gray-400 hover:text-red-500 text-sm transition-colors disabled:opacity-40"
              >
                <i className="fa-solid fa-trash"></i>
              </button>
            </td>
          </tr>
        )}
      />
    </div>
  );
}
