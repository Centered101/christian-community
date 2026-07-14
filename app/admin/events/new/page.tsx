import Link from "next/link";
import { getEvents } from "@/lib/data";
import EventForm from "@/components/admin/event-form";

export const dynamic = "force-dynamic";

export default async function NewEventPage() {
  let categorySuggestions: string[] = [];
  try {
    const events = await getEvents();
    categorySuggestions = [...new Set(events.map((e) => e.category).filter(Boolean))];
  } catch {}

  return (
    <div className="p-3 sm:p-8 max-w-2xl">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/admin/events" className="text-gray-500 hover:text-gray-900 transition-colors">
          <i className="fa-solid fa-arrow-left"></i>
        </Link>
        <div>
          <h1 className="text-gray-900 text-2xl font-bold">เพิ่มกิจกรรม</h1>
          <p className="text-gray-500 text-sm mt-0.5">กรอกข้อมูลกิจกรรมใหม่</p>
        </div>
      </div>
      <div
        className="rounded-2xl p-8"
        style={{ background: "#fff", border: "1px solid #e5e7eb" }}
      >
        <EventForm categorySuggestions={categorySuggestions} />
      </div>
    </div>
  );
}
