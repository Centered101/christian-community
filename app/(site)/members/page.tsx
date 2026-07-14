import type { Metadata } from "next";
import { getMembers, getNavItems } from "@/lib/data";
import { filterActiveMembers } from "@/lib/member-age";
import MembersPageClient from "@/components/members-page-client";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "สมาชิก | ศาสนาจักรของพระเยซูคริสต์" };

export default async function MembersPage() {
  let members: Awaited<ReturnType<typeof getMembers>> = [];
  try {
    members = await getMembers();
  } catch {}
  let navItem: Awaited<ReturnType<typeof getNavItems>>[number] | undefined;
  try {
    navItem = (await getNavItems()).find((item) => item.href === "/members");
  } catch {}
  return (
    <MembersPageClient
      members={filterActiveMembers(members)}
      pageTitle={navItem?.page_title}
      pageTitleEn={navItem?.page_title_en}
      pageSubtitle={navItem?.page_subtitle}
      pageSubtitleEn={navItem?.page_subtitle_en}
    />
  );
}
