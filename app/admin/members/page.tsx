import Link from "next/link";
import { getMembers } from "@/lib/data";
import AdminPageHeader from "@/components/admin/page-header";
import AdminTable from "@/components/admin/admin-table";
import ImagePreviewButton from "@/components/admin/image-preview-button";
import { calculateAge, isMemberAgeEligible } from "@/lib/member-age";

export const dynamic = "force-dynamic";

export default async function AdminMembersPage() {
  let members: Awaited<ReturnType<typeof getMembers>> = [];
  try {
    members = await getMembers();
  } catch {}

  const activeMembers = members.filter((m) => isMemberAgeEligible(m));
  const inactiveMembers = members.filter((m) => !isMemberAgeEligible(m));

  const renderMemberRow = (m: Awaited<ReturnType<typeof getMembers>>[number]) => {
    const age = calculateAge(m.birthday);
    const eligible = isMemberAgeEligible(m);

    return (
      <tr style={{ borderBottom: "1px solid #f3f4f6" }} className="hover:bg-white/5 transition-colors">
        <td className="px-5 py-3">
          <div className="flex items-center gap-3">
            <ImagePreviewButton
              src={m.avatar || "/favicon.webp"}
              alt={m.name}
              title="ดูรูปสมาชิก"
              className="w-9 min-w-[2.25rem] h-9 shrink-0 rounded-xl border border-slate-700"
            />
            <div>
              <p className="text-gray-900 text-sm font-medium">{m.name}</p>
              <p className="text-slate-500 text-xs">{m.email}</p>
              <p className={eligible ? "text-slate-400 text-xs" : "text-red-400 text-xs"}>
                {age === null ? "ยังไม่ได้เลือกวันเกิด" : `อายุ ${age} ปี`}
                {eligible ? "" : " • ไม่แสดงในหน้าสมาชิก"}
              </p>
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
    );
  };

  return (
    <div className="p-3 sm:p-8">
      <AdminPageHeader
        title="สมาชิก"
        subtitle={`${activeMembers.length} คนที่แสดงหน้าเว็บ / ${inactiveMembers.length} คนที่ไม่แสดง`}
        action={{ href: "/admin/members/new", label: "เพิ่มสมาชิก" }}
      />

      <section>
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="text-sm font-bold text-gray-900">แสดงในหน้าสมาชิก (18-35 ปี)</h2>
          <span className="text-xs text-slate-500">{activeMembers.length} คน</span>
        </div>
        <AdminTable
          headers={["สมาชิก", "ตำแหน่ง", "หน้าที่", "แท็ก", ""]}
          data={activeMembers}
          getKey={(m) => m.id}
          emptyMessage="ยังไม่มีสมาชิกในช่วงอายุ 18-35 ปี"
          renderRow={renderMemberRow}
        />
      </section>

      <section className="mt-8">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="text-sm font-bold text-gray-900">ไม่แสดงในหน้าสมาชิก</h2>
          <span className="text-xs text-slate-500">{inactiveMembers.length} คน</span>
        </div>
        <AdminTable
          headers={["สมาชิก", "ตำแหน่ง", "หน้าที่", "แท็ก", ""]}
          data={inactiveMembers}
          getKey={(m) => m.id}
          emptyMessage="ยังไม่มีสมาชิกนอกช่วงอายุ"
          renderRow={renderMemberRow}
        />
      </section>
    </div>
  );
}
