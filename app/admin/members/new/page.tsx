import Link from "next/link";
import MemberForm from "@/components/admin/member-form";

export default function NewMemberPage() {
  return (
    <div className="p-3 sm:p-8 max-w-3xl">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/admin/members" className="text-gray-500 hover:text-gray-900 transition-colors">
          <i className="fa-solid fa-arrow-left"></i>
        </Link>
        <div>
          <h1 className="text-gray-900 text-2xl font-bold">เพิ่มสมาชิกใหม่</h1>
          <p className="text-gray-500 text-sm mt-0.5">กรอกข้อมูลสมาชิก</p>
        </div>
      </div>
      <div
        className="rounded-2xl p-8"
        style={{ background: "#fff", border: "1px solid #e5e7eb" }}
      >
        <MemberForm />
      </div>
    </div>
  );
}
