import { getActivities } from "@/lib/data";
import ActivityForm from "@/components/admin/activity-form";

export const dynamic = "force-dynamic";

export default async function EditActivityPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let activity;
  try {
    const all = await getActivities();
    activity = all.find((a) => a.id === id);
  } catch {}

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-gray-900 text-2xl font-bold mb-8">
        {activity ? `แก้ไข: ${activity.title}` : "แก้ไขกิจกรรม"}
      </h1>
      <ActivityForm activity={activity} />
    </div>
  );
}
