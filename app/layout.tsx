import type { Metadata, Viewport } from "next";
import Script from "next/script";
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
    <html lang="th" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <Script id="strip-extension-form-attrs" strategy="beforeInteractive">
          {`
            (() => {
              const strip = () => {
                document.querySelectorAll('[fdprocessedid]').forEach((el) => {
                  el.removeAttribute('fdprocessedid');
                });
              };
              strip();
              const observer = new MutationObserver(strip);
              observer.observe(document.documentElement, {
                attributes: true,
                childList: true,
                subtree: true,
                attributeFilter: ['fdprocessedid'],
              });
              window.addEventListener('load', () => {
                strip();
                window.setTimeout(() => observer.disconnect(), 1000);
              });
            })();
          `}
        </Script>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Sarabun:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&display=swap"
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
