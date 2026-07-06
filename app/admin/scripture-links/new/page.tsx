import ScriptureLinkForm from "@/components/admin/scripture-link-form";

export default function NewScriptureLinkPage() {
  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-gray-900 text-2xl font-bold mb-8">เพิ่มลิงก์พระคัมภีร์</h1>
      <ScriptureLinkForm />
    </div>
  );
}
