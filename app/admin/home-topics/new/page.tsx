import TopicCardForm from "@/components/admin/topic-card-form";

export default function NewTopicCardPage() {
  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-gray-900 text-2xl font-bold mb-8">เพิ่มหัวข้อความเชื่อ</h1>
      <TopicCardForm />
    </div>
  );
}
