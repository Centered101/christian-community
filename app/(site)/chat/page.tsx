import type { Metadata } from "next";
import ChatSection from "@/components/sections/chat-section";
import { getNavItems } from "@/lib/data";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "แชต | ศาสนาจักรของพระเยซูคริสต์" };

export default async function ChatPage() {
  let navItem: Awaited<ReturnType<typeof getNavItems>>[number] | undefined;
  try {
    navItem = (await getNavItems()).find((item) => item.href === "/chat");
  } catch {}

  return (
    <ChatSection
      pageTitle={navItem?.page_title}
      pageTitleEn={navItem?.page_title_en}
      pageSubtitle={navItem?.page_subtitle}
      pageSubtitleEn={navItem?.page_subtitle_en}
    />
  );
}
