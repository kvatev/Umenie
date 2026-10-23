import { unstable_noStore as noStore } from "next/cache";
import { SiteSettings, DEFAULT_SETTINGS } from "@/lib/types/site-settings";
import { supabaseAdmin } from "@/lib/supabase/admin";

export * from "@/lib/types/site-settings";

const FILE_NAME = "settings.json";
const OVERRIDES_FILE = "settings/site-overrides.json";

export function mergeSettingsWithDefaults(json: Record<string, any>, dbRow?: Record<string, any> | null): SiteSettings {
  const resolvedReviewUrl = dbRow?.testimonial_image_url || json.reviewScreenshotUrl?.trim() || "";
  let resolvedReviewScreenshots: string[] = [];
  if (Array.isArray(json.reviewScreenshots) && json.reviewScreenshots.length > 0) {
    resolvedReviewScreenshots = json.reviewScreenshots;
  } else if (resolvedReviewUrl) {
    resolvedReviewScreenshots = [resolvedReviewUrl];
  }

  return {
    phoneDisplay: json.phoneDisplay?.trim() || DEFAULT_SETTINGS.phoneDisplay,
    phoneFull: json.phoneFull?.trim() || DEFAULT_SETTINGS.phoneFull,
    phoneRaw: json.phoneRaw?.trim() || DEFAULT_SETTINGS.phoneRaw,
    locationShort: json.locationShort?.trim() || DEFAULT_SETTINGS.locationShort,
    locationFull: json.locationFull?.trim() || DEFAULT_SETTINGS.locationFull,
    googleMapsUrl: json.googleMapsUrl?.trim() || DEFAULT_SETTINGS.googleMapsUrl,
    email: (!json.email || json.email.trim() === "umenie48@gmail.com") ? DEFAULT_SETTINGS.email : json.email.trim(),
    tagline: json.tagline?.trim() || DEFAULT_SETTINGS.tagline,
    facebookUrl: json.facebookUrl?.trim() || DEFAULT_SETTINGS.facebookUrl,
    instagramUrl: json.instagramUrl?.trim() || DEFAULT_SETTINGS.instagramUrl,
    tiktokUrl: json.tiktokUrl?.trim() || json.tiktok_url?.trim() || DEFAULT_SETTINGS.tiktokUrl,
    heroBannerUrl: (dbRow?.hero_media_type === "image" ? dbRow?.hero_media_url : null) || json.heroBannerUrl?.trim() || "",
    heroVideoUrl: (dbRow?.hero_media_type === "video" ? dbRow?.hero_media_url : null) || json.heroVideoUrl?.trim() || "",
    heroMediaType: dbRow?.hero_media_type || (json.heroMediaType === "video" ? "video" : "image"),
    heroTitleEn: json.heroTitleEn !== undefined ? json.heroTitleEn : (DEFAULT_SETTINGS.heroTitleEn || ""),
    heroSubtitleEn: json.heroSubtitleEn !== undefined ? json.heroSubtitleEn : (DEFAULT_SETTINGS.heroSubtitleEn || ""),
    reviewScreenshotUrl: resolvedReviewUrl,
    reviewScreenshots: resolvedReviewScreenshots,
    kidsGalleryOrder: Array.isArray(json.kidsGalleryOrder) ? json.kidsGalleryOrder : [],
    scheduleFileUrl: json.scheduleFileUrl?.trim() || "",
    scheduleFileName: json.scheduleFileName?.trim() || "",
    aboutValues: Array.isArray(json.aboutValues) && json.aboutValues.length > 0 ? json.aboutValues : DEFAULT_SETTINGS.aboutValues,
    aboutFeatures: Array.isArray(json.aboutFeatures) && json.aboutFeatures.length > 0 ? json.aboutFeatures : DEFAULT_SETTINGS.aboutFeatures,
    servicesOverrides: typeof json.servicesOverrides === "object" && json.servicesOverrides !== null ? json.servicesOverrides : {},
  };
}

/**
 * Server-side helper to fetch site contacts & settings directly from Supabase (DB + Storage).
 * Zero local filesystem usage — 100% cloud persistent on Vercel Serverless.
 */
export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    noStore();
  } catch {}

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY;

  if (!supabaseUrl || !serviceKey || supabaseUrl.includes("placeholder")) {
    return mergeSettingsWithDefaults({});
  }

  try {
    // 1. Primary: Query Supabase Postgres settings key-value table
    let dbKeyVal: Record<string, any> | null = null;
    try {
      const { data } = await supabaseAdmin
        .from("settings")
        .select("value")
        .eq("key", "site_settings")
        .maybeSingle();
      if (data?.value && typeof data.value === "object") {
        dbKeyVal = data.value;
      }
    } catch {}

    // 2. Secondary: Query site_settings table if present
    let dbRow: Record<string, any> | null = null;
    try {
      const { data } = await supabaseAdmin
        .from("site_settings")
        .select("*")
        .eq("id", 1)
        .maybeSingle();
      dbRow = data;
    } catch {}

    // 3. Tertiary: Read from Supabase Storage (site-media bucket)
    let storageJson: Partial<SiteSettings> = {};
    const candidateFiles = [OVERRIDES_FILE, FILE_NAME];

    for (const file of candidateFiles) {
      try {
        const { data: storageData } = await supabaseAdmin.storage
          .from("site-media")
          .download(file);
        if (storageData) {
          const text = await storageData.text();
          if (text && text.trim().startsWith("{")) {
            const parsed = JSON.parse(text);
            storageJson = { ...storageJson, ...parsed };
          }
        }
      } catch {}
    }

    const mergedJson: Record<string, any> = {
      ...storageJson,
      ...(dbRow?.settings_json || {}),
      ...(dbKeyVal || {}),
    };

    return mergeSettingsWithDefaults(mergedJson, dbRow);
  } catch (err) {
    console.warn("Failed to load site settings from Supabase, falling back to defaults:", err);
    return mergeSettingsWithDefaults({});
  }
}
