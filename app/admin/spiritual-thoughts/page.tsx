import Link from "next/link";
import { getSpiritualThoughts } from "@/lib/data";
import AdminPageHeader from "@/components/admin/page-header";
import AdminTable from "@/components/admin/admin-table";

export const dynamic = "force-dynamic";

export default async function AdminSpiritualThoughtsPage() {
  let thoughts: Awaited<ReturnType<typeof getSpiritualThoughts>> = [];
  try {
    thoughts = await getSpiritualThoughts();
  } catch {}

  return (
    <div className="p-3 sm:p-8">
      <AdminPageHeader
        title="ข้อคิดทางวิญญาณ (หน้าแรก)"
        subtitle={`${thoughts.length} รายการ`}
        action={{ href: "/admin/spiritual-thoughts/new", label: "เพิ่มข้อคิด" }}
      />

      <AdminTable
        headers={["ข้อคิด", "อ้างอิง", "สถานะ", ""]}
        data={thoughts}
        getKey={(thought) => thought.id}
        emptyMessage="ยังไม่มีข้อคิดทางวิญญาณ"
        renderRow={(thought) => (
          <tr style={{ borderBottom: "1px solid #f3f4f6" }} className="hover:bg-white/5 transition-colors">
            <td className="px-5 py-3 text-gray-900 text-sm font-medium max-w-[360px] truncate">
              <i className="fa-solid fa-book-open mr-2" style={{ color: "#157493" }}></i>
              {thought.text}
            </td>
            <td className="px-5 py-3 text-gray-500 text-sm max-w-[180px] truncate">{thought.ref}</td>
            <td className="px-5 py-3">
              <span
                className="rounded-lg px-2.5 py-1 text-xs font-semibold"
                style={
                  thought.is_visible
                    ? { background: "rgba(21,116,147,0.1)", color: "#157493" }
                    : { background: "rgba(107,114,128,0.1)", color: "#6b7280" }
                }
              >
                {thought.is_visible ? "แสดง" : "ซ่อน"}
              </span>
            </td>
            <td className="px-5 py-3">
              <Link href={`/admin/spiritual-thoughts/${thought.id}`} className="text-gray-500 hover:text-[#157493] text-sm transition-colors">
                <i className="fa-solid fa-pen-to-square"></i>
              </Link>
            </td>
          </tr>
        )}
      />
    </div>
  );
}
