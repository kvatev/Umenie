import { SITE_CONFIG } from "@/lib/constants";
import { supabaseAdmin } from "@/lib/supabase/server";

export interface SiteSettings {
  phoneDisplay: string;
  phoneFull: string;
  phoneRaw: string;
  locationShort: string;
  locationFull: string;
  googleMapsUrl: string;
  email: string;
  tagline: string;
  facebookUrl: string;
  instagramUrl: string;
}

export const DEFAULT_SETTINGS: SiteSettings = {
  phoneDisplay: SITE_CONFIG.phoneDisplay,
  phoneFull: SITE_CONFIG.phoneFull,
  phoneRaw: SITE_CONFIG.phoneRaw,
  locationShort: SITE_CONFIG.locationShort,
  locationFull: SITE_CONFIG.locationFull,
  googleMapsUrl: SITE_CONFIG.googleMapsUrl,
  email: SITE_CONFIG.email,
  tagline: SITE_CONFIG.tagline,
  facebookUrl: SITE_CONFIG.social.facebook,
  instagramUrl: SITE_CONFIG.social.instagram,
};

const BUCKET_NAME = "site-assets";
const FILE_NAME = "settings.json";

/**
 * Server-side helper to fetch site contacts & settings.
 * Falls back safely to DEFAULT_SETTINGS (SITE_CONFIG) on any error.
 */
export async function getSiteSettings(): Promise<SiteSettings> {
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
