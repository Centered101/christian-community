import type { Metadata } from "next";
import BibleSection from "@/components/sections/bible-section";
import { getScriptureLinks } from "@/lib/data";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "พระคัมภีร์ | ศาสนาจักรของพระเยซูคริสต์" };

export default async function BiblePage() {
  let scriptureLinks: Awaited<ReturnType<typeof getScriptureLinks>> = [];
  try {
    scriptureLinks = await getScriptureLinks();
  } catch {}
  return <BibleSection scriptureLinks={scriptureLinks} />;
}

