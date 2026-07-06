import { getFaqs } from "@/lib/data";
import FaqForm from "@/components/admin/faq-form";

export const dynamic = "force-dynamic";

export default async function EditFaqPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let faq;
  try {
    const all = await getFaqs();
    faq = all.find((f) => f.id === id);
  } catch {}

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-gray-900 text-2xl font-bold mb-8">
        {faq ? "แก้ไขคำถาม" : "แก้ไขคำถามที่พบบ่อย"}
      </h1>
      <FaqForm faq={faq} />
    </div>
  );
}
