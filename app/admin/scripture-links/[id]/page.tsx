import { getScriptureLinks } from "@/lib/data";
import ScriptureLinkForm from "@/components/admin/scripture-link-form";

export const dynamic = "force-dynamic";

export default async function EditScriptureLinkPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let link;
  try {
    const all = await getScriptureLinks();
    link = all.find((l) => l.id === id);
  } catch {}

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-gray-900 text-2xl font-bold mb-8">
        {link ? `แก้ไข: ${link.label}` : "แก้ไขลิงก์พระคัมภีร์"}
      </h1>
      <ScriptureLinkForm link={link} />
    </div>
  );
}
