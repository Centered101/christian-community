import Link from "next/link";
import { notFound } from "next/navigation";
import { getResources } from "@/lib/data";
import ResourceForm from "@/components/admin/resource-form";

export const dynamic = "force-dynamic";

export default async function EditResourcePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let resource;
  try {
    const all = await getResources();
    resource = all.find((r) => r.id === id);
  } catch {}

  if (!resource) notFound();

  return (
    <div className="p-3 sm:p-8 max-w-2xl">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/admin/resources" className="text-gray-500 hover:text-gray-900 transition-colors">
          <i className="fa-solid fa-arrow-left"></i>
        </Link>
        <div>
          <h1 className="text-gray-900 text-2xl font-bold">แก้ไขทรัพยากร</h1>
          <p className="text-gray-500 text-sm mt-0.5 truncate">{resource.title}</p>
        </div>
      </div>
      <div
        className="rounded-2xl p-8"
        style={{ background: "#fff", border: "1px solid #e5e7eb" }}
      >
        <ResourceForm resource={resource} />
      </div>
    </div>
  );
}
