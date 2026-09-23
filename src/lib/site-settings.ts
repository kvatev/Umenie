import { SiteSettings, DEFAULT_SETTINGS } from "@/lib/types/site-settings";
import { supabaseAdmin } from "@/lib/supabase/server";

export * from "@/lib/types/site-settings";

const BUCKET_NAME = "site-assets";
const FILE_NAME = "settings.json";

/**
 * Server-side helper to fetch site contacts & settings.
 * Falls back safely to DEFAULT_SETTINGS (SITE_CONFIG) on any error.
 */
export async function getSiteSettings(): Promise<SiteSettings> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey || supabaseUrl.includes("placeholder")) {
    return DEFAULT_SETTINGS;
  }

  try {
    const { data, error } = await supabaseAdmin.storage
      .from(BUCKET_NAME)
      .download(FILE_NAME);

    if (error || !data) {
      return DEFAULT_SETTINGS;
    }

    const text = await data.text();
    const json = JSON.parse(text);

    return {
      phoneDisplay: json.phoneDisplay?.trim() || DEFAULT_SETTINGS.phoneDisplay,
      phoneFull: json.phoneFull?.trim() || DEFAULT_SETTINGS.phoneFull,
      phoneRaw: json.phoneRaw?.trim() || DEFAULT_SETTINGS.phoneRaw,
      locationShort: json.locationShort?.trim() || DEFAULT_SETTINGS.locationShort,
      locationFull: json.locationFull?.trim() || DEFAULT_SETTINGS.locationFull,
      googleMapsUrl: json.googleMapsUrl?.trim() || DEFAULT_SETTINGS.googleMapsUrl,
      email: json.email?.trim() || DEFAULT_SETTINGS.email,
      tagline: json.tagline?.trim() || DEFAULT_SETTINGS.tagline,
      facebookUrl: json.facebookUrl?.trim() || DEFAULT_SETTINGS.facebookUrl,
      instagramUrl: json.instagramUrl?.trim() || DEFAULT_SETTINGS.instagramUrl,
    };
  } catch (err) {
    console.warn("Failed to load site settings from Supabase, using defaults:", err);
    return DEFAULT_SETTINGS;
  }
}
