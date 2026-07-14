import { getVideos } from "@/lib/data";
import VideoForm from "@/components/admin/video-form";

export const dynamic = "force-dynamic";

export default async function EditVideoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let video;
  try {
    const all = await getVideos();
    video = all.find((v) => v.id === id);
  } catch {}

  return (
    <div className="p-3 sm:p-8 max-w-2xl">
      <h1 className="text-gray-900 text-2xl font-bold mb-8">
        {video ? `แก้ไข: ${video.title}` : "แก้ไขวิดีโอ"}
      </h1>
      <VideoForm video={video} />
    </div>
  );
}
