import type { Metadata } from "next";
import VideosSection from "@/components/sections/videos-section";
import { getVideos } from "@/lib/data";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "วิดีโอ | ศาสนาจักรของพระเยซูคริสต์" };

export default async function VideosPage() {
  let videos: Awaited<ReturnType<typeof getVideos>> = [];
  try {
    videos = await getVideos();
  } catch {}
  return <VideosSection videos={videos} />;
}
