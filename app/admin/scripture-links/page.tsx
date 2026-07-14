import Link from "next/link";
import { getScriptureLinks } from "@/lib/data";
import AdminPageHeader from "@/components/admin/page-header";
import AdminTable from "@/components/admin/admin-table";
import ImagePreviewButton from "@/components/admin/image-preview-button";

export const dynamic = "force-dynamic";

export default async function AdminScriptureLinksPage() {
  let links: Awaited<ReturnType<typeof getScriptureLinks>> = [];
  try {
    links = await getScriptureLinks();
  } catch {}

  return (
    <div className="p-3 sm:p-8">
      <AdminPageHeader
        title="ลิงก์พระคัมภีร์"
        subtitle={`${links.length} รายการ`}
        action={{ href: "/admin/scripture-links/new", label: "เพิ่มลิงก์" }}
      />

      <AdminTable
        headers={["ไอคอน", "ชื่อ", "คำอธิบายย่อย", "ลิงก์", ""]}
        data={links}
        getKey={(l) => l.id}
        emptyMessage="ยังไม่มีลิงก์พระคัมภีร์"
        renderRow={(l) => (
          <tr style={{ borderBottom: "1px solid #f3f4f6" }} className="hover:bg-white/5 transition-colors">
            <td className="w-16 px-4 py-3 whitespace-nowrap">
              {l.icon ? (
                <ImagePreviewButton
                  src={l.icon}
                  alt={l.label}
                  title="ดูไอคอน"
                  className="w-10 min-w-[2.5rem] h-10 shrink-0 rounded-lg"
                  imageClassName="object-contain"
                />
              ) : (
                <div className="w-10 min-w-[2.5rem] h-10 shrink-0 rounded-lg bg-slate-100 flex items-center justify-center">
                  <i className="fa-solid fa-book-open text-slate-400 text-xs"></i>
                </div>
              )}
            </td>
            <td className="min-w-[120px] px-4 py-3 text-gray-900 text-sm font-medium whitespace-nowrap">{l.label}</td>
            <td className="px-5 py-3 text-gray-500 text-sm max-w-[240px] truncate">{l.sub}</td>
            <td className="px-5 py-3 text-gray-500 text-sm max-w-[240px] truncate">{l.url}</td>
            <td className="px-5 py-3">
              <Link href={`/admin/scripture-links/${l.id}`} className="text-gray-500 hover:text-[#157493] text-sm transition-colors">
                <i className="fa-solid fa-pen-to-square"></i>
              </Link>
            </td>
          </tr>
        )}
      />
    </div>
  );
}
