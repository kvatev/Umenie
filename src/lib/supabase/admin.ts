import { createClient as createAdminClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

/**
 * Elevated admin client (service_role) bypassing RLS for server-side operations.
 * Isolated in its own module without next/headers to prevent bundler contamination.
 */
export const supabaseAdmin = createAdminClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseServiceRoleKey || "placeholder_service_role_key",
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);
