import Link from "next/link";
import { getFaqs } from "@/lib/data";
import AdminPageHeader from "@/components/admin/page-header";
import AdminTable from "@/components/admin/admin-table";

export const dynamic = "force-dynamic";

export default async function AdminFaqsPage() {
  let faqs: Awaited<ReturnType<typeof getFaqs>> = [];
  try {
    faqs = await getFaqs();
  } catch {}

  return (
    <div className="p-3 sm:p-8">
      <AdminPageHeader
        title="คำถามที่พบบ่อย (หน้าแรก)"
        subtitle={`${faqs.length} รายการ`}
        action={{ href: "/admin/faqs/new", label: "เพิ่มคำถาม" }}
      />

      <AdminTable
        headers={["คำถาม", "คำตอบ", ""]}
        data={faqs}
        getKey={(f) => f.id}
        emptyMessage="ยังไม่มีคำถาม"
        renderRow={(f) => (
          <tr style={{ borderBottom: "1px solid #f3f4f6" }} className="hover:bg-white/5 transition-colors">
            <td className="px-5 py-3 text-gray-900 text-sm font-medium max-w-[240px] truncate">
              <i className={f.icon} style={{ color: "#157493", marginRight: 8 }}></i>{f.question}
            </td>
            <td className="px-5 py-3 text-gray-500 text-sm max-w-[320px] truncate">{f.answer}</td>
            <td className="px-5 py-3">
              <Link href={`/admin/faqs/${f.id}`} className="text-gray-500 hover:text-[#157493] text-sm transition-colors">
                <i className="fa-solid fa-pen-to-square"></i>
              </Link>
            </td>
          </tr>
        )}
      />
    </div>
  );
}
