import type { Metadata } from "next";
import { getEvents } from "@/lib/data";
import CalendarSection from "@/components/sections/calendar-section";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "ปฏิทินกิจกรรม | ศาสนาจักรของพระเยซูคริสต์" };

export default async function CalendarPage() {
  let events: Awaited<ReturnType<typeof getEvents>> = [];
  try {
    events = await getEvents();
  } catch {}
  return <CalendarSection events={events} />;
}
