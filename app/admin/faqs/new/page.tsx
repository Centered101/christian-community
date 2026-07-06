import FaqForm from "@/components/admin/faq-form";

export default function NewFaqPage() {
  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-gray-900 text-2xl font-bold mb-8">เพิ่มคำถามที่พบบ่อย</h1>
      <FaqForm />
    </div>
  );
}
