import VideoForm from "@/components/admin/video-form";

export default function NewVideoPage() {
  return (
    <div className="p-3 sm:p-8 max-w-2xl">
      <h1 className="text-gray-900 text-2xl font-bold mb-8">เพิ่มวิดีโอใหม่</h1>
      <VideoForm />
    </div>
  );
}
