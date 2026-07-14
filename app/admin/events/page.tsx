import Link from "next/link";
import { getEvents } from "@/lib/data";
import AdminPageHeader from "@/components/admin/page-header";
import AdminTable from "@/components/admin/admin-table";

export const dynamic = "force-dynamic";

export default async function AdminEventsPage() {
  let events: Awaited<ReturnType<typeof getEvents>> = [];
  try {
    events = await getEvents();
  } catch {}

  return (
    <div className="p-3 sm:p-8">
      <AdminPageHeader
        title="ปฏิทิน"
        subtitle={`${events.length} รายการ`}
        action={{ href: "/admin/events/new", label: "เพิ่มกิจกรรม" }}
      />

      <AdminTable
        headers={["วันที่", "หัวข้อ", "สี", "หมวดหมู่", ""]}
        data={events}
        getKey={(ev) => ev.id}
        emptyMessage="ยังไม่มีกิจกรรม"
        renderRow={(ev) => (
          <tr style={{ borderBottom: "1px solid #f3f4f6" }} className="hover:bg-white/5 transition-colors">
            <td className="px-5 py-3 text-slate-300 text-sm">{ev.date}</td>
            <td className="px-5 py-3 text-gray-900 text-sm font-medium">{ev.title}</td>
            <td className="px-5 py-3">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full" style={{ background: ev.color }} />
                <span className="text-gray-500 text-xs">{ev.color}</span>
              </div>
            </td>
            <td className="px-5 py-3 text-slate-300 text-sm">{ev.category || "—"}</td>
            <td className="px-5 py-3">
              <Link href={`/admin/events/${ev.id}`} className="text-gray-500 hover:text-[#157493] text-sm transition-colors">
                <i className="fa-solid fa-pen-to-square"></i>
              </Link>
            </td>
          </tr>
        )}
      />
    </div>
  );
}
