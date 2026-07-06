import { createBrowserClient } from "@supabase/ssr";

/**
 * Browser Supabase client (for any future client-side reads/writes, e.g. auth).
 * Returns `null` when env vars are not configured.
 */
export function getSupabaseBrowser() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key || url.includes("YOUR-PROJECT")) return null;
  return createBrowserClient(url, key);
}
