import type { Metadata } from "next";
import { getEvents, getNavItems } from "@/lib/data";
import CalendarSection from "@/components/sections/calendar-section";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "ปฏิทินกิจกรรม | ศาสนาจักรของพระเยซูคริสต์" };

export default async function CalendarPage() {
  let events: Awaited<ReturnType<typeof getEvents>> = [];
  try {
    events = await getEvents();
  } catch {}
  let navItem: Awaited<ReturnType<typeof getNavItems>>[number] | undefined;
  try {
    navItem = (await getNavItems()).find((item) => item.href === "/calendar");
  } catch {}
  return (
    <CalendarSection
      events={events}
      pageTitle={navItem?.page_title}
      pageTitleEn={navItem?.page_title_en}
      pageSubtitle={navItem?.page_subtitle}
      pageSubtitleEn={navItem?.page_subtitle_en}
    />
  );
}
