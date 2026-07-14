import SiteClient from "@/components/site-client";
import { getNavItems, getScriptureLinks, getSiteSettings, getVideos } from "@/lib/data";

export const dynamic = "force-dynamic";

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

  let navItems: Awaited<ReturnType<typeof getNavItems>> = [];
  try {
    navItems = await getNavItems();
  } catch {}
  navItems = navItems.filter((n) => n.is_visible);

  const siteSettings = await getSiteSettings();

  return (
    <SiteClient scriptureLinks={scriptureLinks} featuredVideo={featuredVideo} siteSettings={siteSettings} navItems={navItems}>
      {children}
    </SiteClient>
  );
}
