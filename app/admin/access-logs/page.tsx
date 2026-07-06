import { getAccessLogs } from "@/lib/data";
import AccessLogsListClient from "@/components/admin/access-logs-list-client";

export const dynamic = "force-dynamic";

export default async function AdminAccessLogsPage() {
  let logs: Awaited<ReturnType<typeof getAccessLogs>> = [];
  try {
    logs = await getAccessLogs();
  } catch {}

  return <AccessLogsListClient initialLogs={logs} />;
}
