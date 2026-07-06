"use client";

import { useState } from "react";
import MembersSection from "./sections/members-section";
import MemberModal from "./member-modal";
import type { Member } from "@/lib/types";

export default function MembersPageClient({ members }: { members: Member[] }) {
  const [modalMember, setModalMember] = useState<Member | null>(null);
  return (
    <>
      <MembersSection members={members} onOpenMember={setModalMember} />
      <MemberModal member={modalMember} onClose={() => setModalMember(null)} />
    </>
  );
}
