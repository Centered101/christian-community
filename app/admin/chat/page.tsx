import { getChatMessages } from "@/lib/data";
import ChatAdminClient from "@/components/admin/chat-admin-client";
import AdminPageHeader from "@/components/admin/page-header";

export const dynamic = "force-dynamic";

export default async function AdminChatPage() {
  let messages: Awaited<ReturnType<typeof getChatMessages>> = [];
  try {
    messages = await getChatMessages(200);
  } catch {}

  return (
    <div className="p-8">
      <AdminPageHeader title="แชต" subtitle={`${messages.length} ข้อความล่าสุด`} />
      <ChatAdminClient initialMessages={messages} />
    </div>
  );
}
