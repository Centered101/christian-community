"use client";

import { useState } from "react";
import MembersSection from "./sections/members-section";
import MemberModal from "./member-modal";
import type { Member } from "@/lib/types";

export default function MembersPageClient({
  members,
  pageTitle,
  pageTitleEn,
  pageSubtitle,
  pageSubtitleEn,
}: {
  members: Member[];
  pageTitle?: string;
  pageTitleEn?: string;
  pageSubtitle?: string;
  pageSubtitleEn?: string;
}) {
  const [modalMember, setModalMember] = useState<Member | null>(null);
  return (
    <>
      <MembersSection
        members={members}
        onOpenMember={setModalMember}
        pageTitle={pageTitle}
        pageTitleEn={pageTitleEn}
        pageSubtitle={pageSubtitle}
        pageSubtitleEn={pageSubtitleEn}
      />
      <MemberModal member={modalMember} onClose={() => setModalMember(null)} />
    </>
  );
}
