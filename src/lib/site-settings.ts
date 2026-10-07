import { SiteSettings, DEFAULT_SETTINGS } from "@/lib/types/site-settings";
import { supabaseAdmin } from "@/lib/supabase/admin";

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
    // 1. Try querying site_settings table (schema requirement 1)
    let dbRow: Record<string, any> | null = null;
    try {
      const { data } = await supabaseAdmin
        .from("site_settings")
        .select("*")
        .eq("id", 1)
        .maybeSingle();
      dbRow = data;
    } catch {
      // Table might not be migrated yet, ignore and fallback to storage
    }

    // 2. Also try reading storage settings.json
    let storageJson: Partial<SiteSettings> = {};
    try {
      const { data: storageData } = await supabaseAdmin.storage
        .from("site-media")
        .download(FILE_NAME);
      if (storageData) {
        storageJson = JSON.parse(await storageData.text());
      } else {
        const { data: fallbackData } = await supabaseAdmin.storage
          .from("site-assets")
          .download(FILE_NAME);
        if (fallbackData) {
          storageJson = JSON.parse(await fallbackData.text());
        }
      }
    } catch {
      // Fallback
    }

    const json = {
      ...storageJson,
      ...(dbRow?.settings_json || {}),
    };

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
      heroBannerUrl: (dbRow?.hero_media_type === "image" ? dbRow?.hero_media_url : null) || json.heroBannerUrl?.trim() || "",
      heroVideoUrl: (dbRow?.hero_media_type === "video" ? dbRow?.hero_media_url : null) || json.heroVideoUrl?.trim() || "",
      heroMediaType: dbRow?.hero_media_type || (json.heroMediaType === "video" ? "video" : "image"),
      reviewScreenshotUrl: dbRow?.testimonial_image_url || json.reviewScreenshotUrl?.trim() || "",
      kidsGalleryOrder: Array.isArray(json.kidsGalleryOrder) ? json.kidsGalleryOrder : [],
      scheduleFileUrl: json.scheduleFileUrl?.trim() || "",
      scheduleFileName: json.scheduleFileName?.trim() || "",
      aboutValues: Array.isArray(json.aboutValues) && json.aboutValues.length > 0 ? json.aboutValues : DEFAULT_SETTINGS.aboutValues,
      aboutFeatures: Array.isArray(json.aboutFeatures) && json.aboutFeatures.length > 0 ? json.aboutFeatures : DEFAULT_SETTINGS.aboutFeatures,
      servicesOverrides: typeof json.servicesOverrides === "object" && json.servicesOverrides !== null ? json.servicesOverrides : {},
    };
  } catch (err) {
    console.warn("Failed to load site settings from Supabase, using defaults:", err);
    return DEFAULT_SETTINGS;
  }
}
