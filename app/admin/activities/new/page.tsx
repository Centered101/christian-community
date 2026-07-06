import ActivityForm from "@/components/admin/activity-form";

export default function NewActivityPage() {
  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-gray-900 text-2xl font-bold mb-8">เพิ่มกิจกรรมใหม่</h1>
      <ActivityForm />
    </div>
  );
}
