import Link from "next/link";
import { getActivities } from "@/lib/data";
import AdminPageHeader from "@/components/admin/page-header";
import AdminTable from "@/components/admin/admin-table";

export const dynamic = "force-dynamic";

export default async function AdminActivitiesPage() {
  let activities: Awaited<ReturnType<typeof getActivities>> = [];
  try {
    activities = await getActivities();
  } catch {}

  return (
    <div className="p-8">
      <AdminPageHeader
        title="กิจกรรม"
        subtitle={`${activities.length} รายการ`}
        action={{ href: "/admin/activities/new", label: "เพิ่มกิจกรรม" }}
      />

      <AdminTable
        headers={["รูป", "หัวข้อ", "วันที่", "คำอธิบาย", ""]}
        data={activities}
        getKey={(a) => a.id}
        emptyMessage="ยังไม่มีกิจกรรม"
        renderRow={(a) => (
          <tr style={{ borderBottom: "1px solid #f3f4f6" }} className="hover:bg-white/5 transition-colors">
            <td className="px-5 py-3">
              {a.img ? (
                <img src={a.img} className="w-12 h-10 rounded-lg object-cover" alt="" />
              ) : (
                <div className="w-12 h-10 rounded-lg bg-slate-700 flex items-center justify-center">
                  <i className="fa-solid fa-image text-slate-500 text-xs"></i>
                </div>
              )}
            </td>
            <td className="px-5 py-3 text-gray-900 text-sm font-medium max-w-[200px] truncate">{a.title}</td>
            <td className="px-5 py-3 text-slate-300 text-sm whitespace-nowrap">{a.date}</td>
            <td className="px-5 py-3 text-gray-500 text-sm max-w-[240px] truncate">{a.description}</td>
            <td className="px-5 py-3">
              <Link href={`/admin/activities/${a.id}`} className="text-gray-500 hover:text-[#157493] text-sm transition-colors">
                <i className="fa-solid fa-pen-to-square"></i>
              </Link>
            </td>
          </tr>
        )}
      />
    </div>
  );
}
