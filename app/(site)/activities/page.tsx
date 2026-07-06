import type { Metadata } from "next";
import { getActivities } from "@/lib/data";
import ActivitiesSection from "@/components/sections/activities-section";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "กิจกรรม | ศาสนาจักรของพระเยซูคริสต์" };

export default async function ActivitiesPage() {
  let activities: Awaited<ReturnType<typeof getActivities>> = [];
  try {
    activities = await getActivities();
  } catch {}
  return <ActivitiesSection activities={activities} />;
}
