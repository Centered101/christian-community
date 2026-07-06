import Link from "next/link";
import { getEvents } from "@/lib/data";
import EventForm from "@/components/admin/event-form";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let event;
  let categorySuggestions: string[] = [];
  try {
    const events = await getEvents();
    event = events.find((e) => e.id === id);
    categorySuggestions = [...new Set(events.map((e) => e.category).filter(Boolean))];
  } catch {}

  if (!event) notFound();

  return (
    <div className="p-8 max-w-2xl">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/admin/events" className="text-gray-500 hover:text-gray-900 transition-colors">
          <i className="fa-solid fa-arrow-left"></i>
        </Link>
        <div>
          <h1 className="text-gray-900 text-2xl font-bold">แก้ไขกิจกรรม</h1>
          <p className="text-gray-500 text-sm mt-0.5">{event.title}</p>
        </div>
      </div>
      <div
        className="rounded-2xl p-8"
        style={{ background: "#fff", border: "1px solid #e5e7eb" }}
      >
        <EventForm event={event} categorySuggestions={categorySuggestions} />
      </div>
    </div>
  );
}
