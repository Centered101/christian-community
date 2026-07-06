import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Service-role Supabase client — bypasses RLS. Server-only: never import this
 * from client components. Used by /api/admin/* routes after verifying the
 * admin_token cookie via lib/admin-auth.
 */
export function getSupabaseAdmin(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key || url.includes("YOUR-PROJECT")) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}
