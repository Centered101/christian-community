import type { Metadata, Viewport } from "next";
import "./globals.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import ImageProtect from "@/components/image-protect";
import { Toaster } from "sonner";
import { getSiteSettings } from "@/lib/data";

export const viewport: Viewport = {
  themeColor: "#157493",
};

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    title: settings.meta_title || settings.site_name,
    description: settings.meta_description,
    icons: { icon: "/favicon.webp" },
    openGraph: {
      title: settings.meta_title || settings.site_name,
      description: settings.meta_description,
      images: settings.og_image ? [settings.og_image] : undefined,
    },
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Lato:wght@300;400;700&family=Ubuntu:ital,wght@0,300;0,400;0,500;0,700;1,300;1,400;1,500;1,700&family=Sarabun:ital,wght@0,300;0,400;0,500;0,700;1,300;1,400;1,500;1,700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Google+Sans+Flex:ital,opsz,wght@0,6..144,100..700;1,6..144,100..700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ImageProtect />
        <Toaster
          position="top-right"
          richColors
          toastOptions={{
            style: { fontFamily: "inherit" },
          }}
        />
        {children}
      </body>
    </html>
  );
}
