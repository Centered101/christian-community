import type { Metadata } from "next";
import { getActivities, getNavItems } from "@/lib/data";
import ActivitiesSection from "@/components/sections/activities-section";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "กิจกรรม | ศาสนาจักรของพระเยซูคริสต์" };

export default async function ActivitiesPage() {
  let activities: Awaited<ReturnType<typeof getActivities>> = [];
  try {
    activities = await getActivities();
  } catch {}
  let navItem: Awaited<ReturnType<typeof getNavItems>>[number] | undefined;
  try {
    navItem = (await getNavItems()).find((item) => item.href === "/activities");
  } catch {}
  return (
    <ActivitiesSection
      activities={activities}
      pageTitle={navItem?.page_title}
      pageTitleEn={navItem?.page_title_en}
      pageSubtitle={navItem?.page_subtitle}
      pageSubtitleEn={navItem?.page_subtitle_en}
    />
  );
}
