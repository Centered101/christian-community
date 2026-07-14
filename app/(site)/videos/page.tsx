import type { Metadata } from "next";
import VideosSection from "@/components/sections/videos-section";
import { getNavItems, getVideos } from "@/lib/data";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "วิดีโอ | ศาสนาจักรของพระเยซูคริสต์" };

export default async function VideosPage() {
  let videos: Awaited<ReturnType<typeof getVideos>> = [];
  try {
    videos = await getVideos();
  } catch {}
  let navItem: Awaited<ReturnType<typeof getNavItems>>[number] | undefined;
  try {
    navItem = (await getNavItems()).find((item) => item.href === "/videos");
  } catch {}
  return (
    <VideosSection
      videos={videos}
      pageTitle={navItem?.page_title}
      pageTitleEn={navItem?.page_title_en}
      pageSubtitle={navItem?.page_subtitle}
      pageSubtitleEn={navItem?.page_subtitle_en}
    />
  );
}
