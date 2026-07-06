import Link from "next/link";
import ResourceForm from "@/components/admin/resource-form";

export default function NewResourcePage() {
  return (
    <div className="p-8 max-w-2xl">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/admin/resources" className="text-gray-500 hover:text-gray-900 transition-colors">
          <i className="fa-solid fa-arrow-left"></i>
        </Link>
        <div>
          <h1 className="text-gray-900 text-2xl font-bold">เพิ่มทรัพยากร</h1>
          <p className="text-gray-500 text-sm mt-0.5">เพิ่มรายการในคลังค้นคว้า</p>
        </div>
      </div>
      <div
        className="rounded-2xl p-8"
        style={{ background: "#fff", border: "1px solid #e5e7eb" }}
      >
        <ResourceForm />
      </div>
    </div>
  );
}
