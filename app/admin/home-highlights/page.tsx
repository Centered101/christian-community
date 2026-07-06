import Link from "next/link";
import { getHomeHighlights } from "@/lib/data";
import AdminPageHeader from "@/components/admin/page-header";
import AdminTable from "@/components/admin/admin-table";

export const dynamic = "force-dynamic";

export default async function AdminHomeHighlightsPage() {
  let highlights: Awaited<ReturnType<typeof getHomeHighlights>> = [];
  try {
    highlights = await getHomeHighlights();
  } catch {}

  return (
    <div className="p-8">
      <AdminPageHeader
        title="เนื้อหาแนะนำ (หน้าแรก)"
        subtitle={`${highlights.length} รายการ`}
        action={{ href: "/admin/home-highlights/new", label: "เพิ่มเนื้อหา" }}
      />

      <AdminTable
        headers={["รูป", "หัวข้อ", "คำอธิบาย", "ลิงก์", ""]}
        data={highlights}
        getKey={(h) => h.id}
        emptyMessage="ยังไม่มีเนื้อหาแนะนำ"
        renderRow={(h) => (
          <tr style={{ borderBottom: "1px solid #f3f4f6" }} className="hover:bg-white/5 transition-colors">
            <td className="px-5 py-3">
              {h.img ? (
                <img src={h.img} className="w-12 h-10 rounded-lg object-cover" alt="" />
              ) : (
                <div className="w-12 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
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
    </div>
  );
}
