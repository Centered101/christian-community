import Link from "next/link";
import { getMembers } from "@/lib/data";
import AdminPageHeader from "@/components/admin/page-header";
import AdminTable from "@/components/admin/admin-table";

export const dynamic = "force-dynamic";

export default async function AdminMembersPage() {
  let members: Awaited<ReturnType<typeof getMembers>> = [];
  try {
    members = await getMembers();
  } catch {}

  return (
    <div className="p-8">
      <AdminPageHeader
        title="สมาชิก"
        subtitle={`${members.length} คน`}
        action={{ href: "/admin/members/new", label: "เพิ่มสมาชิก" }}
      />

      <AdminTable
        headers={["สมาชิก", "ตำแหน่ง", "หน้าที่", "แท็ก", ""]}
        data={members}
        getKey={(m) => m.id}
        emptyMessage="ยังไม่มีสมาชิก"
        renderRow={(m) => (
          <tr style={{ borderBottom: "1px solid #f3f4f6" }} className="hover:bg-white/5 transition-colors">
            <td className="px-5 py-3">
              <div className="flex items-center gap-3">
                <img
                  src={m.avatar || "/favicon.webp"}
                  className="w-9 h-9 rounded-full object-cover border border-slate-700"
                  alt=""
                />
                <div>
                  <p className="text-gray-900 text-sm font-medium">{m.name}</p>
                  <p className="text-slate-500 text-xs">{m.email}</p>
                </div>
              </div>
            </td>
            <td className="px-5 py-3 text-slate-300 text-sm">{m.role}</td>
            <td className="px-5 py-3 text-slate-300 text-sm">{m.calling}</td>
            <td className="px-5 py-3">
              <div className="flex flex-wrap gap-1">
                {m.tags.map((t) => (
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
              <Link href={`/admin/members/${m.id}`} className="text-gray-400 hover:text-[#157493] text-sm transition-colors">
                <i className="fa-solid fa-pen-to-square"></i>
              </Link>
            </td>
          </tr>
        )}
      />
    </div>
  );
}
