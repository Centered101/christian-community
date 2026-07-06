import type { Metadata } from "next";
import { getMembers } from "@/lib/data";
import MembersPageClient from "@/components/members-page-client";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "สมาชิก | ศาสนาจักรของพระเยซูคริสต์" };

export default async function MembersPage() {
  let members: Awaited<ReturnType<typeof getMembers>> = [];
  try {
    members = await getMembers();
  } catch {}
  return <MembersPageClient members={members} />;
}
