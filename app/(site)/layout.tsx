import SiteClient from "@/components/site-client";
import { getNavItems, getScriptureLinks, getSiteSettings, getVideos } from "@/lib/data";
import type { NavItem } from "@/lib/types";

export const dynamic = "force-dynamic";

const DEFAULT_NAV_ITEMS: NavItem[] = [
  { key: "members", href: "/members", label: "สมาชิก", is_visible: true },
  { key: "activities", href: "/activities", label: "กิจกรรม", is_visible: true },
  { key: "calendar", href: "/calendar", label: "ปฏิทิน", is_visible: true },
  { key: "chat", href: "/chat", label: "แชต", is_visible: true },
  { key: "shop", href: "/shop", label: "คลังค้นคว้า", is_visible: true },
];

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  let scriptureLinks: Awaited<ReturnType<typeof getScriptureLinks>> = [];
  try {
    scriptureLinks = await getScriptureLinks();
  } catch {}

  let featuredVideo: Awaited<ReturnType<typeof getVideos>>[number] | null = null;
  try {
    const videos = await getVideos();
    featuredVideo = videos.find((v) => v.is_featured) ?? videos[0] ?? null;
  } catch {}

  let navItems = DEFAULT_NAV_ITEMS;
  try {
    const items = await getNavItems();
    if (items.length > 0) navItems = items;
  } catch {}
  navItems = navItems.filter((n) => n.is_visible);

  const siteSettings = await getSiteSettings();

  return (
    <SiteClient scriptureLinks={scriptureLinks} featuredVideo={featuredVideo} siteSettings={siteSettings} navItems={navItems}>
      {children}
    </SiteClient>
  );
}
