"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { getSiteSettings } from "@/lib/site-settings";
import { SiteSettings, DEFAULT_SETTINGS, normalizePhoneNumber } from "@/lib/types/site-settings";

const FILE_NAME = "settings.json";
const OVERRIDES_FILE = "settings/site-overrides.json";

export async function getSiteSettingsAction(): Promise<SiteSettings> {
  return await getSiteSettings();
}

export async function updateSiteSettingsAction(formData: Partial<SiteSettings>) {
  try {
    // Current settings as base
    const current = await getSiteSettings();

    // Auto-synchronize phone fields if any phone field was provided
    let phoneDisplay = formData.phoneDisplay?.trim() || current.phoneDisplay;
    let phoneFull = formData.phoneFull?.trim() || current.phoneFull;
    let phoneRaw = formData.phoneRaw?.trim() || current.phoneRaw;

    const phoneInput = formData.phoneDisplay || formData.phoneFull || formData.phoneRaw;
    if (phoneInput) {
      const normalized = normalizePhoneNumber(phoneInput);
      phoneDisplay = formData.phoneDisplay?.trim() || normalized.phoneDisplay;
      phoneFull = formData.phoneFull?.trim() || normalized.phoneFull;
      phoneRaw = formData.phoneRaw?.trim() || normalized.phoneRaw;
    }

    const updatedSettings: SiteSettings = {
      phoneDisplay,
      phoneFull,
      phoneRaw,
      locationShort: formData.locationShort?.trim() ?? current.locationShort,
      locationFull: formData.locationFull?.trim() ?? current.locationFull,
      googleMapsUrl: formData.googleMapsUrl?.trim() ?? current.googleMapsUrl,
      email: formData.email?.trim() ?? current.email,
      tagline: formData.tagline?.trim() ?? current.tagline,
      facebookUrl: formData.facebookUrl?.trim() ?? current.facebookUrl,
      instagramUrl: formData.instagramUrl?.trim() ?? current.instagramUrl,
      tiktokUrl: formData.tiktokUrl?.trim() ?? current.tiktokUrl,
      heroBannerUrl: formData.heroBannerUrl !== undefined ? formData.heroBannerUrl.trim() : (current.heroBannerUrl || ""),
      heroVideoUrl: formData.heroVideoUrl !== undefined ? formData.heroVideoUrl.trim() : (current.heroVideoUrl || ""),
      heroMediaType: formData.heroMediaType ?? (current.heroMediaType || "image"),
      heroTitleEn: formData.heroTitleEn !== undefined ? formData.heroTitleEn.trim() : (current.heroTitleEn || ""),
      heroSubtitleEn: formData.heroSubtitleEn !== undefined ? formData.heroSubtitleEn.trim() : (current.heroSubtitleEn || ""),
      reviewScreenshotUrl: formData.reviewScreenshotUrl !== undefined ? formData.reviewScreenshotUrl.trim() : (current.reviewScreenshotUrl || ""),
      reviewScreenshots: formData.reviewScreenshots ?? (current.reviewScreenshots || []),
      kidsGalleryOrder: formData.kidsGalleryOrder ?? (current.kidsGalleryOrder || []),
      scheduleFileUrl: formData.scheduleFileUrl !== undefined ? formData.scheduleFileUrl.trim() : (current.scheduleFileUrl || ""),
      scheduleFileName: formData.scheduleFileName !== undefined ? formData.scheduleFileName.trim() : (current.scheduleFileName || ""),
      aboutValues: formData.aboutValues ?? (current.aboutValues || DEFAULT_SETTINGS.aboutValues),
      aboutFeatures: formData.aboutFeatures ?? (current.aboutFeatures || DEFAULT_SETTINGS.aboutFeatures),
      servicesOverrides: formData.servicesOverrides ?? (current.servicesOverrides || {}),
    };

    const jsonString = JSON.stringify(updatedSettings, null, 2);
    const buffer = Buffer.from(jsonString, "utf-8");

    // 1. Sync to Supabase Postgres settings table (key-value store, primary)
    try {
      await supabaseAdmin
        .from("settings")
        .upsert({
          key: "site_settings",
          value: updatedSettings,
          updated_at: new Date().toISOString(),
        });
    } catch (dbErr) {
      console.warn("Could not upsert to settings table:", dbErr);
    }

    // 2. Sync to site_settings table if present
    try {
      await supabaseAdmin
        .from("site_settings")
        .upsert({
          id: 1,
          hero_media_type: updatedSettings.heroMediaType,
          hero_media_url: updatedSettings.heroMediaType === "video" ? updatedSettings.heroVideoUrl : updatedSettings.heroBannerUrl,
          testimonial_image_url: updatedSettings.reviewScreenshotUrl,
          settings_json: updatedSettings,
          updated_at: new Date().toISOString(),
        });
    } catch {}

    // 3. Sync to Supabase Storage (site-media and site-assets) with cacheControl: "0"
    const buckets = ["site-media", "site-assets"];
    const files = [FILE_NAME, OVERRIDES_FILE];

    for (const b of buckets) {
      for (const f of files) {
        try {
          await supabaseAdmin.storage
            .from(b)
            .upload(f, buffer, {
              contentType: "application/json",
              upsert: true,
              cacheControl: "0",
            });
        } catch {}
      }
    }

    // 4. Revalidate all cached pages and tags that use settings or media
    try {
      revalidateTag("site-settings");
      revalidateTag("reviews-images");
      revalidateTag("schedule-events");
      revalidatePath("/", "layout");
      revalidatePath("/uslugi", "layout");
      revalidatePath("/uslugi/[slug]", "page");
      revalidatePath("/za-nas", "page");
      revalidatePath("/grafik", "page");
      revalidatePath("/admin", "layout");
      revalidatePath("/admin/contacts");
      revalidatePath("/admin/media");
      revalidatePath("/admin/settings");
      revalidatePath("/admin/pages/home");
      revalidatePath("/admin/pages/services");
      revalidatePath("/admin/pages/about");
    } catch (e) {
      // Ignore if called outside an active Next.js request context
    }

    return {
      success: true,
      message: "Контактната информация и настройките са обновени успешно!",
      settings: updatedSettings,
    };
  } catch (err: unknown) {
    console.error("Update site settings exception:", err);
    return { success: false, message: "Възникна непредвидена грешка при запазване на настройките." };
  }
}
