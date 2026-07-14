import Link from "next/link";
import { getActivities, getHomeHighlights } from "@/lib/data";
import AdminPageHeader from "@/components/admin/page-header";
import AdminTable from "@/components/admin/admin-table";
import ImagePreviewButton from "@/components/admin/image-preview-button";

export const dynamic = "force-dynamic";

export default async function AdminActivitiesPage() {
  let activities: Awaited<ReturnType<typeof getActivities>> = [];
  let highlights: Awaited<ReturnType<typeof getHomeHighlights>> = [];
  try {
    [activities, highlights] = await Promise.all([getActivities(), getHomeHighlights()]);
  } catch {}

  return (
    <div className="space-y-8 p-3 sm:p-8">
      <AdminPageHeader
        title="กิจกรรม"
        subtitle={`กิจกรรม ${activities.length} รายการ · เนื้อหาแนะนำ ${highlights.length} รายการ`}
        action={{ href: "/admin/activities/new", label: "เพิ่มกิจกรรม" }}
      />

      <section className="space-y-3">
        <h2 className="text-gray-900 text-base font-bold">รายการกิจกรรม</h2>
        <AdminTable
          headers={["รูป", "หัวข้อ", "วันที่", "คำอธิบาย", ""]}
          data={activities}
          getKey={(a) => a.id}
          emptyMessage="ยังไม่มีกิจกรรม"
          renderRow={(a) => (
            <tr style={{ borderBottom: "1px solid #f3f4f6" }} className="hover:bg-white/5 transition-colors">
              <td className="px-5 py-3">
                {a.img ? (
                  <ImagePreviewButton
                    src={a.img}
                    alt={a.title}
                    title="ดูรูปกิจกรรม"
                    className="w-12 min-w-[3rem] h-10 shrink-0 rounded-lg"
                  />
                ) : (
                  <div className="w-12 min-w-[3rem] h-10 shrink-0 rounded-lg bg-slate-700 flex items-center justify-center">
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
      </section>

      <section className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-gray-900 text-base font-bold">เนื้อหาแนะนำหน้าแรก</h2>
            <p className="text-gray-500 text-sm">แสดงในส่วนแนะนำเพิ่มเติมของหน้าแรก</p>
          </div>
          <Link
            href="/admin/home-highlights/new"
            className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white"
            style={{ background: "#157493" }}
          >
            <i className="fa-solid fa-plus text-xs"></i>
            เพิ่มเนื้อหาแนะนำ
          </Link>
        </div>
        <AdminTable
          headers={["รูป", "หัวข้อ", "คำอธิบาย", "ลิงก์", ""]}
          data={highlights}
          getKey={(h) => h.id}
          emptyMessage="ยังไม่มีเนื้อหาแนะนำ"
          renderRow={(h) => (
            <tr style={{ borderBottom: "1px solid #f3f4f6" }} className="hover:bg-white/5 transition-colors">
              <td className="px-5 py-3">
                {h.img ? (
                  <ImagePreviewButton
                    src={h.img}
                    alt={h.title}
                    title="ดูรูปเนื้อหาแนะนำ"
                    className="w-12 min-w-[3rem] h-10 shrink-0 rounded-lg"
                  />
                ) : (
                  <div className="w-12 min-w-[3rem] h-10 shrink-0 rounded-lg bg-slate-100 flex items-center justify-center">
                    <i className="fa-solid fa-image text-slate-400 text-xs"></i>
                  </div>
                )}
              </td>
              <td className="px-5 py-3 text-gray-900 text-sm font-medium max-w-[200px] truncate">{h.title}</td>
              <td className="px-5 py-3 text-gray-500 text-sm max-w-[240px] truncate">{h.description}</td>
              <td className="px-5 py-3 text-gray-500 text-sm">{h.href}</td>
              <td className="px-5 py-3">
                <Link href={`/admin/home-highlights/${h.id}`} className="text-gray-500 hover:text-[#157493] text-sm transition-colors">
                  <i className="fa-solid fa-pen-to-square"></i>
                </Link>
              </td>
            </tr>
          )}
        />
      </section>
    </div>
  );
}
