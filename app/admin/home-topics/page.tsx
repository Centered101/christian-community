import Link from "next/link";
import { getTopicCards } from "@/lib/data";
import AdminPageHeader from "@/components/admin/page-header";
import AdminTable from "@/components/admin/admin-table";

export const dynamic = "force-dynamic";

export default async function AdminHomeTopicsPage() {
  let cards: Awaited<ReturnType<typeof getTopicCards>> = [];
  try {
    cards = await getTopicCards();
  } catch {}

  return (
    <div className="p-8">
      <AdminPageHeader
        title="หัวข้อความเชื่อ (หน้าแรก)"
        subtitle={`${cards.length} รายการ`}
        action={{ href: "/admin/home-topics/new", label: "เพิ่มหัวข้อ" }}
      />

      <AdminTable
        headers={["ไอคอน", "หัวข้อ", "คำอธิบาย", "ลิงก์", ""]}
        data={cards}
        getKey={(c) => c.id}
        emptyMessage="ยังไม่มีหัวข้อ"
        renderRow={(c) => (
          <tr style={{ borderBottom: "1px solid #f3f4f6" }} className="hover:bg-white/5 transition-colors">
            <td className="px-5 py-3">
              <i className={c.icon} style={{ color: c.color }}></i>
            </td>
            <td className="px-5 py-3 text-gray-900 text-sm font-medium whitespace-nowrap">{c.title}</td>
            <td className="px-5 py-3 text-gray-500 text-sm max-w-[280px] truncate">{c.description}</td>
            <td className="px-5 py-3 text-gray-500 text-sm whitespace-nowrap">{c.href}</td>
            <td className="px-5 py-3">
              <Link href={`/admin/home-topics/${c.id}`} className="text-gray-500 hover:text-[#157493] text-sm transition-colors">
                <i className="fa-solid fa-pen-to-square"></i>
              </Link>
            </td>
          </tr>
        )}
      />
    </div>
  );
}
