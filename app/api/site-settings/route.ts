import { NextResponse } from "next/server";
import { getSiteSettings } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET() {
  const settings = await getSiteSettings();
  return NextResponse.json({
    site_name: settings.site_name,
    site_subtitle: settings.site_subtitle,
    site_name_en: settings.site_name_en,
    site_subtitle_en: settings.site_subtitle_en,
  });
}
