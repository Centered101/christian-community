import { getSpiritualThoughts } from "@/lib/data";
import SpiritualThoughtForm from "@/components/admin/spiritual-thought-form";

export const dynamic = "force-dynamic";

export default async function EditSpiritualThoughtPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let thought;
  try {
    const all = await getSpiritualThoughts();
    thought = all.find((item) => item.id === id);
  } catch {}

  return (
    <div className="p-3 sm:p-8 max-w-2xl">
      <h1 className="text-gray-900 text-2xl font-bold mb-8">
        {thought ? "แก้ไขข้อคิดทางวิญญาณ" : "ไม่พบข้อคิด"}
      </h1>
      <SpiritualThoughtForm thought={thought} />
    </div>
  );
}
