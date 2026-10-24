"use server";

import { revalidatePath, revalidateTag, unstable_cache } from "next/cache";
import { cache } from "react";
import { supabaseAdmin } from "@/lib/supabase/admin";

const MEDIA_BUCKET = "site-media";
const FALLBACK_BUCKET = "site-assets";

export interface StorageMediaItem {
  name: string;
  id: string;
  created_at: string;
  updated_at: string;
  last_accessed_at: string;
  metadata: Record<string, unknown>;
  publicUrl: string;
  path: string;
}

export interface ReviewImageRecord {
  id: string;
  public_url: string;
  display_order: number;
  created_at?: string;
}

/**
 * Revalidate all public pages that consume media or settings
 */
function revalidatePublicPages() {
  try {
    revalidateTag("site-settings");
    revalidateTag("reviews-images");
    revalidateTag("schedule-events");
  } catch {}
  try {
    revalidatePath("/", "layout");
    revalidatePath("/za-nas", "page");
    revalidatePath("/grafik", "page");
    revalidatePath("/uslugi", "layout");
    revalidatePath("/admin", "layout");
    revalidatePath("/admin/media");
    revalidatePath("/admin/settings");
    revalidatePath("/admin/pages/home");
    revalidatePath("/admin/pages/services");
    revalidatePath("/admin/pages/about");
    revalidatePath("/admin/pages/schedule");
  } catch {}
}

/**
 * Ensure public bucket exists
 */
async function ensureBucket(bucket: string = MEDIA_BUCKET) {
  try {
    await supabaseAdmin.storage.createBucket(bucket, {
      public: true,
      fileSizeLimit: 20971520, // 20MB
    });
  } catch {
    // Bucket likely already exists
  }
}

/**
 * Safe upload helper trying primary bucket then fallback
 */
async function safeUpload(
  path: string,
  buffer: Buffer,
  contentType: string,
  upsert: boolean = true
): Promise<{ bucket: string; publicUrl: string }> {
  await ensureBucket(MEDIA_BUCKET);

  const { error } = await supabaseAdmin.storage
    .from(MEDIA_BUCKET)
    .upload(path, buffer, { contentType, upsert });

  if (!error) {
    const { data } = supabaseAdmin.storage.from(MEDIA_BUCKET).getPublicUrl(path);
    return { bucket: MEDIA_BUCKET, publicUrl: data.publicUrl };
  }

  // Fallback to site-assets
  const { error: fbError } = await supabaseAdmin.storage
    .from(FALLBACK_BUCKET)
    .upload(path, buffer, { contentType, upsert });

  if (fbError) {
    throw new Error(error.message || fbError.message);
  }

  const { data } = supabaseAdmin.storage.from(FALLBACK_BUCKET).getPublicUrl(path);
  return { bucket: FALLBACK_BUCKET, publicUrl: data.publicUrl };
}

/**
 * 1. Upload or replace the main hero banner
 */
export async function uploadHeroBannerAction(formData: FormData) {
  try {
    const file = formData.get("file") as File;
    if (!file) {
      return { success: false, message: "Няма избран файл за качване." };
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { publicUrl } = await safeUpload("hero-banner.webp", buffer, file.type || "image/webp", true);
    const freshUrl = `${publicUrl}?t=${Date.now()}`;

    // Update site_settings table
    try {
      await supabaseAdmin.from("site_settings").upsert({
        id: 1,
        hero_media_type: "image",
        hero_media_url: freshUrl,
        updated_at: new Date().toISOString(),
      });
    } catch {}

    const { updateSiteSettingsAction } = await import("./admin-settings");
    await updateSiteSettingsAction({
      heroBannerUrl: freshUrl,
      heroMediaType: "image",
    });

    revalidatePublicPages();
    revalidatePath("/admin/media");
    revalidatePath("/admin");

    return {
      success: true,
      message: "Главният банер е качен и обновен успешно!",
      url: freshUrl,
    };
  } catch (err: unknown) {
    console.error("Upload hero banner exception:", err);
    return { success: false, message: "Грешка при качване на банера." };
  }
}

/**
 * 2. Upload a photo to gallery or service folder, inserting into gallery_images
 */
export async function uploadGalleryPhotoAction(formData: FormData) {
  try {
    const file = formData.get("file") as File;
    const folder = (formData.get("folder") as string) || "kids-gallery";

    if (!file) {
      return { success: false, message: "Няма избран файл." };
    }

    const sanitizedName = file.name
      .toLowerCase()
      .replace(/[^a-z0-9.]/g, "-")
      .replace(/-+/g, "-");
    const filename = `${Date.now()}-${sanitizedName}`;
    const filePath = `${folder}/${filename}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { publicUrl } = await safeUpload(filePath, buffer, file.type || "image/jpeg", false);

    // If uploading to kids-gallery, insert into gallery_images table
    if (folder.includes("kids")) {
      try {
        const { count } = await supabaseAdmin
          .from("gallery_images")
          .select("*", { count: "exact", head: true });

        await supabaseAdmin.from("gallery_images").insert({
          bucket_path: filePath,
          public_url: publicUrl,
          display_order: (count || 0) + 1,
          caption: file.name,
        });
      } catch (tableErr) {
        console.warn("Could not insert into gallery_images table:", tableErr);
      }
    }

    revalidatePublicPages();
    revalidatePath("/admin/media");
    revalidatePath("/admin");

    return {
      success: true,
      message: "Снимката е качена успешно!",
      path: filePath,
      url: publicUrl,
    };
  } catch (err: unknown) {
    console.error("Upload gallery photo exception:", err);
    return { success: false, message: "Грешка при качване на снимката." };
  }
}

/**
 * Delete a media object by path and remove from gallery_images
 */
export async function deleteMediaObjectAction(path: string) {
  try {
    // Delete from both buckets
    await supabaseAdmin.storage.from(MEDIA_BUCKET).remove([path]);
    await supabaseAdmin.storage.from(FALLBACK_BUCKET).remove([path]);

    // Also delete from gallery_images table if matched
    try {
      await supabaseAdmin.from("gallery_images").delete().eq("bucket_path", path);
    } catch {}

    revalidatePublicPages();
    revalidatePath("/admin/media");
    revalidatePath("/admin");
    return { success: true, message: "Снимката е изтрита успешно!" };
  } catch (err: unknown) {
    console.error("Delete media exception:", err);
    return { success: false, message: "Грешка при изтриване на снимката." };
  }
}

/**
 * List media items in a specific storage folder
 */
export async function listMediaFolderAction(folder: string = ""): Promise<{
  success: boolean;
  items: StorageMediaItem[];
  message?: string;
}> {
  try {
    // Try primary bucket first
    let { data, error } = await supabaseAdmin.storage
      .from(MEDIA_BUCKET)
      .list(folder, {
        limit: 100,
        sortBy: { column: "created_at", order: "desc" },
      });

    let currentBucket = MEDIA_BUCKET;

    if (error || !data || data.length === 0) {
      // Fallback
      const fb = await supabaseAdmin.storage.from(FALLBACK_BUCKET).list(folder, {
        limit: 100,
        sortBy: { column: "created_at", order: "desc" },
      });
      if (fb.data && fb.data.length > 0) {
        data = fb.data;
        currentBucket = FALLBACK_BUCKET;
      }
    }

    const items: StorageMediaItem[] = (data || [])
      .filter((file) => file.name && !file.name.startsWith("."))
      .map((file) => {
        const fullPath = folder ? `${folder}/${file.name}` : file.name;
        const { data: urlData } = supabaseAdmin.storage
          .from(currentBucket)
          .getPublicUrl(fullPath);

        return {
          ...file,
          path: fullPath,
          publicUrl: urlData.publicUrl,
        } as StorageMediaItem;
      });

    return { success: true, items };
  } catch (err: unknown) {
    console.error("List media folder exception:", err);
    return { success: false, items: [], message: "Грешка при извличане на медиите." };
  }
}

/**
 * Save external/direct video link for Hero Banner
 */
export async function saveHeroVideoUrlAction(videoUrl: string, mediaType: "video" | "image" = "video") {
  try {
    const freshUrl = videoUrl.trim();

    try {
      await supabaseAdmin.from("site_settings").upsert({
        id: 1,
        hero_media_type: mediaType,
        hero_media_url: freshUrl,
        updated_at: new Date().toISOString(),
      });
    } catch {}

    const { updateSiteSettingsAction } = await import("./admin-settings");
    await updateSiteSettingsAction({
      heroVideoUrl: freshUrl,
      heroMediaType: mediaType,
    });

    revalidatePublicPages();
    revalidatePath("/admin/media");
    revalidatePath("/admin");

    return {
      success: true,
      message: mediaType === "video" ? "Видеото за заглавния банер е запазено успешно!" : "Заглавният банер е настроен на изображение!",
    };
  } catch (err: unknown) {
    console.error("Save hero video url exception:", err);
    return { success: false, message: "Грешка при запазване на видеото." };
  }
}

/**
 * Upload a review screenshot to review-screenshot.webp
 */
export async function uploadReviewScreenshotAction(formData: FormData) {
  try {
    const file = formData.get("file") as File;
    if (!file) {
      return { success: false, message: "Няма избран файл за отзив." };
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { publicUrl } = await safeUpload("review-screenshot.webp", buffer, file.type || "image/webp", true);
    const fullUrl = `${publicUrl}?t=${Date.now()}`;

    // Update site_settings table
    try {
      await supabaseAdmin.from("site_settings").upsert({
        id: 1,
        testimonial_image_url: fullUrl,
        updated_at: new Date().toISOString(),
      });
    } catch {}

    const { updateSiteSettingsAction } = await import("./admin-settings");
    await updateSiteSettingsAction({
      reviewScreenshotUrl: fullUrl,
    });

    revalidatePublicPages();
    revalidatePath("/admin/media");
    revalidatePath("/admin");

    return {
      success: true,
      message: "Снимката/скрийншотът на отзива е обновен успешно!",
      url: fullUrl,
    };
  } catch (err: unknown) {
    console.error("Upload review screenshot exception:", err);
    return { success: false, message: "Грешка при качване на отзива." };
  }
}

/**
 * Delete custom review screenshot (resets to default)
 */
export async function deleteReviewScreenshotAction() {
  try {
    await supabaseAdmin.storage.from(MEDIA_BUCKET).remove(["review-screenshot.webp"]);
    await supabaseAdmin.storage.from(FALLBACK_BUCKET).remove(["review-screenshot.webp"]);

    try {
      await supabaseAdmin.from("site_settings").upsert({
        id: 1,
        testimonial_image_url: "",
        updated_at: new Date().toISOString(),
      });
    } catch {}

    const { updateSiteSettingsAction } = await import("./admin-settings");
    await updateSiteSettingsAction({
      reviewScreenshotUrl: "",
    });

    revalidatePublicPages();
    revalidatePath("/admin/media");
    revalidatePath("/admin");

    return {
      success: true,
      message: "Скрийншотът е премахнат! Уебсайтът ще показва стандартния отзив.",
    };
  } catch (err: unknown) {
    console.error("Delete review screenshot exception:", err);
    return { success: false, message: "Грешка при премахване." };
  }
}

/**
 * Save custom ordering for Kids Gallery slides in gallery_images and settings
 */
export async function saveKidsGalleryOrderAction(orderedPaths: string[]) {
  try {
    // 1. Sync to gallery_images table
    try {
      for (let i = 0; i < orderedPaths.length; i++) {
        const path = orderedPaths[i];
        await supabaseAdmin
          .from("gallery_images")
          .update({ display_order: i + 1 })
          .or(`bucket_path.eq.${path},public_url.eq.${path}`);
      }
    } catch {}

    // 2. Sync to site settings
    const { updateSiteSettingsAction } = await import("./admin-settings");
    await updateSiteSettingsAction({
      kidsGalleryOrder: orderedPaths,
    });

    revalidatePublicPages();
    revalidatePath("/admin/media");
    revalidatePath("/admin");

    return {
      success: true,
      message: "Подредбата на снимките в слайдъра е запазена успешно!",
    };
  } catch (err: unknown) {
    console.error("Save gallery order exception:", err);
    return { success: false, message: "Грешка при записване на подредбата." };
  }
}

/**
 * 3. Upload a review screenshot into reviews_images table and site_settings.reviewScreenshots
 */
export async function uploadReviewImageAction(formData: FormData) {
  try {
    const file = formData.get("file") as File;
    if (!file) {
      return { success: false, message: "Няма избран файл." };
    }

    const sanitizedName = file.name
      .toLowerCase()
      .replace(/[^a-z0-9.]/g, "-")
      .replace(/-+/g, "-");
    const filename = `${Date.now()}-${sanitizedName}`;
    const filePath = `reviews/${filename}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { publicUrl } = await safeUpload(filePath, buffer, file.type || "image/jpeg", false);

    // 1. Insert into reviews_images table (if present)
    let newId = `rev-${Date.now()}`;
    try {
      const { count } = await supabaseAdmin
        .from("reviews_images")
        .select("*", { count: "exact", head: true });

      const { data: inserted } = await supabaseAdmin
        .from("reviews_images")
        .insert({
          public_url: publicUrl,
          display_order: (count || 0) + 1,
        })
        .select()
        .single();

      if (inserted?.id) {
        newId = inserted.id;
      }
    } catch (err) {
      console.warn("Could not insert into reviews_images table (syncing with site_settings):", err);
    }

    // 2. Sync to site_settings.reviewScreenshots
    try {
      const { getSiteSettings } = await import("@/lib/site-settings");
      const { updateSiteSettingsAction } = await import("./admin-settings");
      const currentSettings = await getSiteSettings();
      const existing = Array.isArray(currentSettings.reviewScreenshots)
        ? [...currentSettings.reviewScreenshots]
        : [];
      if (!existing.includes(publicUrl)) {
        existing.push(publicUrl);
      }
      await updateSiteSettingsAction({
        reviewScreenshots: existing,
        reviewScreenshotUrl: currentSettings.reviewScreenshotUrl || publicUrl,
      });
    } catch (settingsErr) {
      console.warn("Could not sync review to site_settings:", settingsErr);
    }

    revalidatePublicPages();
    revalidatePath("/admin/media");
    revalidatePath("/admin");
    revalidatePath("/admin/pages/home");
    revalidatePath("/");
    revalidatePath("/za-nas");

    return {
      success: true,
      message: "Отзивът е качен успешно!",
      url: publicUrl,
      item: {
        id: newId,
        public_url: publicUrl,
        display_order: 999,
      },
    };
  } catch (err: unknown) {
    console.error("Upload review image exception:", err);
    return { success: false, message: "Грешка при качване на отзива." };
  }
}

/**
 * List review images from reviews_images table, site_settings, or storage folder
 */
/**
 * Raw uncached reviews images fetcher from Supabase.
 */
async function fetchRawReviewsImages(): Promise<ReviewImageRecord[]> {
  // 1. Try querying reviews_images table
  try {
    const { data: dbRows, error: dbErr } = await supabaseAdmin
      .from("reviews_images")
      .select("*")
      .order("display_order", { ascending: true });

    if (!dbErr && dbRows && dbRows.length > 0) {
      return dbRows as ReviewImageRecord[];
    }
  } catch {}

  // 2. Check site settings reviewScreenshots
  try {
    const { getSiteSettings } = await import("@/lib/site-settings");
    const settings = await getSiteSettings();
    if (settings.reviewScreenshots && settings.reviewScreenshots.length > 0) {
      return settings.reviewScreenshots.map((url, idx) => ({
        id: `settings-${idx}`,
        public_url: url,
        display_order: idx + 1,
      }));
    }
  } catch {}

  // 3. Fallback to storage folder reviews/
  try {
    const storageRes = await listMediaFolderAction("reviews");
    return (storageRes.items || []).map((item, idx) => ({
      id: item.id || `storage-${idx}`,
      public_url: item.publicUrl,
      display_order: idx + 1,
    }));
  } catch {}

  return [];
}

/**
 * High-performance on-demand tagged cache for reviews images.
 * Instant edge reads for home & about pages; invalidated on admin uploads/deletes.
 */
export const getCachedReviewsImages = cache(
  unstable_cache(
    async (): Promise<ReviewImageRecord[]> => {
      return await fetchRawReviewsImages();
    },
    ["reviews-images-cache-key"],
    { tags: ["reviews-images"], revalidate: 3600 }
  )
);

/**
 * List review images from reviews_images table, site_settings, or storage folder
 */
export async function listReviewsImagesAction(): Promise<{
  success: boolean;
  items: ReviewImageRecord[];
}> {
  try {
    const items = await getCachedReviewsImages();
    return { success: true, items };
  } catch (err) {
    console.error("List reviews images exception:", err);
    return { success: false, items: [] };
  }
}

/**
 * Delete a review image from reviews_images table, site_settings, and storage
 */
export async function deleteReviewImageAction(id: string, publicUrl?: string) {
  try {
    try {
      await supabaseAdmin.from("reviews_images").delete().eq("id", id);
    } catch {}

    if (publicUrl) {
      try {
        const filename = publicUrl.split("/").pop()?.split("?")[0];
        if (filename) {
          await supabaseAdmin.storage.from(MEDIA_BUCKET).remove([`reviews/${filename}`]);
          await supabaseAdmin.storage.from(FALLBACK_BUCKET).remove([`reviews/${filename}`]);
        }
      } catch {}

      try {
        const { getSiteSettings } = await import("@/lib/site-settings");
        const { updateSiteSettingsAction } = await import("./admin-settings");
        const currentSettings = await getSiteSettings();
        const existing = Array.isArray(currentSettings.reviewScreenshots)
          ? [...currentSettings.reviewScreenshots]
          : [];
        const filtered = existing.filter((u) => u !== publicUrl && !u.includes(id));
        await updateSiteSettingsAction({
          reviewScreenshots: filtered,
          reviewScreenshotUrl:
            currentSettings.reviewScreenshotUrl === publicUrl
              ? (filtered[0] || "")
              : currentSettings.reviewScreenshotUrl,
        });
      } catch {}
    }

    revalidatePublicPages();
    revalidatePath("/admin/media");
    revalidatePath("/admin");
    revalidatePath("/admin/pages/home");
    revalidatePath("/");
    revalidatePath("/za-nas");

    return { success: true, message: "Отзивът е изтрит успешно!" };
  } catch (err) {
    console.error("Delete review image exception:", err);
    return { success: false, message: "Грешка при изтриване на отзива." };
  }
}

/**
 * Reorder review screenshots in reviews_images table and site_settings
 */
export async function reorderReviewImagesAction(orderedUrlsOrIds: string[]) {
  try {
    // 1. Try table update
    try {
      for (let i = 0; i < orderedUrlsOrIds.length; i++) {
        const item = orderedUrlsOrIds[i];
        await supabaseAdmin
          .from("reviews_images")
          .update({ display_order: i + 1 })
          .or(`id.eq.${item},public_url.eq.${item}`);
      }
    } catch {}

    // 2. Sync site_settings
    try {
      const { updateSiteSettingsAction } = await import("./admin-settings");
      await updateSiteSettingsAction({
        reviewScreenshots: orderedUrlsOrIds,
      });
    } catch {}

    revalidatePublicPages();
    revalidatePath("/admin/media");
    revalidatePath("/admin");
    revalidatePath("/admin/pages/home");
    revalidatePath("/");
    revalidatePath("/za-nas");

    return {
      success: true,
      message: "Подредбата на отзивите е запазена успешно!",
    };
  } catch (err: unknown) {
    console.error("Reorder review images exception:", err);
    return { success: false, message: "Грешка при записване на подредбата." };
  }
}
