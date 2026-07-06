import Link from "next/link";
import { getMembers } from "@/lib/data";
import MemberForm from "@/components/admin/member-form";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function EditMemberPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let member;
  try {
    const members = await getMembers();
    member = members.find((m) => m.id === id);
  } catch {}

  if (!member) notFound();

  return (
    <div className="p-8 max-w-3xl">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/admin/members" className="text-gray-500 hover:text-gray-900 transition-colors">
          <i className="fa-solid fa-arrow-left"></i>
        </Link>
        <div>
          <h1 className="text-gray-900 text-2xl font-bold">แก้ไขสมาชิก</h1>
          <p className="text-gray-500 text-sm mt-0.5">{member.name}</p>
        </div>
      </div>
      <div
        className="rounded-2xl p-8"
        style={{ background: "#fff", border: "1px solid #e5e7eb" }}
      >
        <MemberForm member={member} />
      </div>
    </div>
  );
}
