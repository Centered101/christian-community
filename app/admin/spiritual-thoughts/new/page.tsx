import SpiritualThoughtForm from "@/components/admin/spiritual-thought-form";

export default function NewSpiritualThoughtPage() {
  return (
    <div className="p-3 sm:p-8 max-w-2xl">
      <h1 className="text-gray-900 text-2xl font-bold mb-8">เพิ่มข้อคิดทางวิญญาณ</h1>
      <SpiritualThoughtForm />
    </div>
  );
}
