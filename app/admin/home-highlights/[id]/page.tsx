import { getHomeHighlights } from "@/lib/data";
import HomeHighlightForm from "@/components/admin/home-highlight-form";

export const dynamic = "force-dynamic";

export default async function EditHomeHighlightPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let highlight;
  try {
    const all = await getHomeHighlights();
    highlight = all.find((h) => h.id === id);
  } catch {}

  return (
    <div className="p-3 sm:p-8 max-w-2xl">
      <h1 className="text-gray-900 text-2xl font-bold mb-8">
        {highlight ? `แก้ไข: ${highlight.title}` : "แก้ไขเนื้อหาแนะนำ"}
      </h1>
      <HomeHighlightForm highlight={highlight} />
    </div>
  );
}
