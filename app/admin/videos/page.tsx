import { getVideos } from "@/lib/data";
import VideoListClient from "@/components/admin/video-list-client";
import AdminPageHeader from "@/components/admin/page-header";

export const dynamic = "force-dynamic";

export default async function AdminVideosPage() {
  let videos: Awaited<ReturnType<typeof getVideos>> = [];
  try {
    videos = await getVideos();
  } catch {}

  return (
    <div className="p-8">
      <AdminPageHeader
        title="วิดีโอ"
        subtitle={`${videos.length} รายการ`}
        action={{ href: "/admin/videos/new", label: "เพิ่มวิดีโอ" }}
      />

      <VideoListClient initialVideos={videos} />
    </div>
  );
}
