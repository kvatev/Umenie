import { createClient as createAdminClient, SupabaseClient } from "@supabase/supabase-js";

let _client: SupabaseClient | null = null;
let _cachedUrl = "";
let _cachedKey = "";

export function getSupabaseAdmin(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY || "";

  if (!_client || _cachedUrl !== url || _cachedKey !== key) {
    _cachedUrl = url;
    _cachedKey = key;
    _client = createAdminClient(
      url || "https://placeholder.supabase.co",
      key || "placeholder_service_role_key",
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );
  }
  return _client;
}

/**
 * Elevated admin client (service_role) bypassing RLS for server-side operations.
 * Uses a Proxy to ensure late-bound process.env resolution and seamless Next.js execution.
 */
export const supabaseAdmin = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    const client = getSupabaseAdmin();
    const val = (client as any)[prop];
    if (typeof val === "function") {
      return val.bind(client);
    }
    return val;
  },
});
