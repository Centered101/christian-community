import type { Metadata } from "next";
import ShopSection from "@/components/sections/shop-section";
import { getNavItems, getResources } from "@/lib/data";
import type { Resource } from "@/lib/types";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "คลังค้นคว้า | ศาสนาจักรของพระเยซูคริสต์" };

export default async function ShopPage() {
  let resources: Resource[] = [];
  try {
    resources = await getResources();
  } catch {}
  let navItem: Awaited<ReturnType<typeof getNavItems>>[number] | undefined;
  try {
    navItem = (await getNavItems()).find((item) => item.href === "/shop");
  } catch {}

  return (
    <ShopSection
      resources={resources}
      pageTitle={navItem?.page_title}
      pageTitleEn={navItem?.page_title_en}
      pageSubtitle={navItem?.page_subtitle}
      pageSubtitleEn={navItem?.page_subtitle_en}
    />
  );
}
