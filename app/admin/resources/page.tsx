import Link from "next/link";
import { getResources } from "@/lib/data";
import AdminPageHeader from "@/components/admin/page-header";
import AdminTable from "@/components/admin/admin-table";

export const dynamic = "force-dynamic";

const CATEGORY_COLORS: Record<string, string> = {
  "พระคัมภีร์": "#f59e0b",
  "ประวัติศาสตร์": "#8b5cf6",
  "หลักคำสอน": "#2563eb",
  "เพลงสวด": "#db2777",
  "การรับใช้": "#059669",
  "ครอบครัว": "#0891b2",
  "เยาวชน": "#f97316",
  "ทั่วไป": "#64748b",
};

export default async function AdminResourcesPage() {
  let resources: Awaited<ReturnType<typeof getResources>> = [];
  try {
    resources = await getResources();
  } catch {}

  return (
    <div className="p-3 sm:p-8">
      <AdminPageHeader
        title="คลังค้นคว้า"
        subtitle={`${resources.length} รายการ`}
        action={{ href: "/admin/resources/new", label: "เพิ่มทรัพยากร" }}
      />

      <AdminTable
        headers={["ชื่อเรื่อง", "หมวดหมู่", "แท็ก", "ลิงก์", ""]}
        data={resources}
        getKey={(r) => r.id}
        emptyMessage={<>ยังไม่มีทรัพยากร — <Link href="/admin/resources/new" className="text-[#157493] underline">เพิ่มรายการแรก</Link></>}
        renderRow={(r) => {
          const color = CATEGORY_COLORS[r.category] ?? "#64748b";
          return (
            <tr style={{ borderBottom: "1px solid #f3f4f6" }} className="hover:bg-white/5 transition-colors">
              <td className="px-5 py-3">
                <p className="text-gray-900 text-sm font-medium">{r.title}</p>
                {r.description && (
                  <p className="text-slate-500 text-xs mt-0.5 truncate max-w-xs">{r.description}</p>
                )}
              </td>
              <td className="px-5 py-3">
                <span
                  className="px-2.5 py-1 rounded-full text-xs font-medium"
                  style={{ background: `${color}22`, color }}
                >
                  {r.category}
                </span>
              </td>
              <td className="px-5 py-3">
                <div className="flex flex-wrap gap-1">
                  {r.tags.map((t) => (
                    <span
                      key={t}
                      className="px-2 py-0.5 rounded-full text-xs"
                      style={{ background: "rgba(21,116,147,0.12)", color: "#157493" }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </td>
              <td className="px-5 py-3">
                <div className="flex gap-2">
                  {r.url && (
                    <a
                      href={r.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#157493] hover:opacity-70 text-xs"
                      title="เปิดลิงก์"
                    >
                      <i className="fa-solid fa-link mr-1"></i>Link
                    </a>
                  )}
                  {r.file_url && (
                    <a
                      href={r.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-amber-500 hover:opacity-70 text-xs"
                      title="ดาวน์โหลดไฟล์"
                    >
                      <i className="fa-solid fa-file mr-1"></i>File
                    </a>
                  )}
                </div>
              </td>
              <td className="px-5 py-3">
                <Link href={`/admin/resources/${r.id}`} className="text-gray-500 hover:text-[#157493] text-sm transition-colors">
                  <i className="fa-solid fa-pen-to-square"></i>
                </Link>
              </td>
            </tr>
          );
        }}
      />
    </div>
  );
}
