import { getTopicCards } from "@/lib/data";
import TopicCardForm from "@/components/admin/topic-card-form";

export const dynamic = "force-dynamic";

export default async function EditTopicCardPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let card;
  try {
    const all = await getTopicCards();
    card = all.find((c) => c.id === id);
  } catch {}

  return (
    <div className="p-3 sm:p-8 max-w-2xl">
      <h1 className="text-gray-900 text-2xl font-bold mb-8">
        {card ? `แก้ไข: ${card.title}` : "แก้ไขหัวข้อ"}
      </h1>
      <TopicCardForm card={card} />
    </div>
  );
}
