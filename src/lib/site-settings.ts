import { SiteSettings, DEFAULT_SETTINGS } from "@/lib/types/site-settings";
import { supabaseAdmin } from "@/lib/supabase/admin";

export * from "@/lib/types/site-settings";

const FILE_NAME = "settings.json";

/**
 * Server-side helper to fetch site contacts & settings.
 * Priority: Supabase site_settings table / storage settings.json > DEFAULT_SETTINGS.
 */
export async function getSiteSettings(): Promise<SiteSettings> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey || supabaseUrl.includes("placeholder")) {
    return DEFAULT_SETTINGS;
  }

  try {
    // 1. Try querying site_settings table
    let dbRow: Record<string, any> | null = null;
    try {
      const { data } = await supabaseAdmin
        .from("site_settings")
        .select("*")
        .eq("id", 1)
        .maybeSingle();
      dbRow = data;
    } catch {
      // Table might not be migrated or query failed
    }

    // 2. Try reading storage settings.json (bypassing CDN edge cache for instant live sync)
    let storageJson: Partial<SiteSettings> = {};
    try {
      const endpoint = `${supabaseUrl}/storage/v1/object/site-media/${FILE_NAME}?ts=${Date.now()}`;
      const res = await fetch(endpoint, {
        headers: { Authorization: `Bearer ${serviceKey}` },
        cache: "no-store",
      });
      if (res.ok) {
        storageJson = await res.json();
      } else {
        const { data: storageData } = await supabaseAdmin.storage
          .from("site-media")
          .download(FILE_NAME);
        if (storageData) {
          storageJson = JSON.parse(await storageData.text());
        }
      }
    } catch {
      // Storage file fallback
    }

    const json: Record<string, any> = {
      ...storageJson,
      ...(dbRow?.settings_json || {}),
    };

    const resolvedReviewUrl = dbRow?.testimonial_image_url || json.reviewScreenshotUrl?.trim() || "";
    let resolvedReviewScreenshots: string[] = [];
    if (Array.isArray(json.reviewScreenshots) && json.reviewScreenshots.length > 0) {
      resolvedReviewScreenshots = json.reviewScreenshots;
    } else if (resolvedReviewUrl) {
      resolvedReviewScreenshots = [resolvedReviewUrl];
    }

    const heroBannerUrl =
      (dbRow?.hero_media_type === "image" ? dbRow?.hero_media_url : null) ||
      json.heroBannerUrl?.trim() ||
      json.heroImageUrl?.trim() ||
      "";

    const heroVideoUrl =
      (dbRow?.hero_media_type === "video" ? dbRow?.hero_media_url : null) ||
      json.heroVideoUrl?.trim() ||
      "";

    return {
      phoneDisplay: json.phoneDisplay?.trim() || DEFAULT_SETTINGS.phoneDisplay,
      phoneFull: json.phoneFull?.trim() || DEFAULT_SETTINGS.phoneFull,
      phoneRaw: json.phoneRaw?.trim() || DEFAULT_SETTINGS.phoneRaw,
      locationShort: json.locationShort?.trim() || DEFAULT_SETTINGS.locationShort,
      locationShortEn: json.locationShortEn?.trim() || DEFAULT_SETTINGS.locationShortEn,
      locationFull: json.locationFull?.trim() || DEFAULT_SETTINGS.locationFull,
      locationFullEn: json.locationFullEn?.trim() || DEFAULT_SETTINGS.locationFullEn,
      googleMapsUrl: json.googleMapsUrl?.trim() || DEFAULT_SETTINGS.googleMapsUrl,
      email: (!json.email || json.email.trim() === "umenie48@gmail.com") ? DEFAULT_SETTINGS.email : json.email.trim(),
      tagline: json.tagline?.trim() || DEFAULT_SETTINGS.tagline,
      taglineEn: json.taglineEn?.trim() || DEFAULT_SETTINGS.taglineEn,
      facebookUrl: json.facebookUrl?.trim() || DEFAULT_SETTINGS.facebookUrl,
      instagramUrl: json.instagramUrl?.trim() || DEFAULT_SETTINGS.instagramUrl,
      tiktokUrl: json.tiktokUrl?.trim() || json.tiktok_url?.trim() || DEFAULT_SETTINGS.tiktokUrl,
      heroTitle: json.heroTitle?.trim() || DEFAULT_SETTINGS.heroTitle,
      heroTitleEn: json.heroTitleEn?.trim() || DEFAULT_SETTINGS.heroTitleEn,
      heroSubtitle: json.heroSubtitle?.trim() || DEFAULT_SETTINGS.heroSubtitle,
      heroSubtitleEn: json.heroSubtitleEn?.trim() || DEFAULT_SETTINGS.heroSubtitleEn,
      heroBannerUrl,
      heroImageUrl: heroBannerUrl,
      heroVideoUrl,
      heroMediaType: dbRow?.hero_media_type || (json.heroMediaType === "video" ? "video" : "image"),
      reviewScreenshotUrl: resolvedReviewUrl,
      reviewScreenshots: resolvedReviewScreenshots,
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
