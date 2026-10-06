"use server";

import { revalidatePath } from "next/cache";
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
  revalidatePath("/");
  revalidatePath("/za-nas");
  revalidatePath("/grafik");
  revalidatePath("/uslugi");
  revalidatePath("/admin");
  revalidatePath("/admin/media");
  revalidatePath("/admin/settings");
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
 * 3. Upload a review screenshot for "За Нас" page into reviews_images table
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

    // Insert into reviews_images table
    try {
      const { count } = await supabaseAdmin
        .from("reviews_images")
        .select("*", { count: "exact", head: true });

      await supabaseAdmin.from("reviews_images").insert({
        public_url: publicUrl,
        display_order: (count || 0) + 1,
      });
    } catch (err) {
      console.warn("Could not insert into reviews_images table:", err);
    }

    revalidatePublicPages();
    revalidatePath("/admin/media");
    revalidatePath("/admin");

    return {
      success: true,
      message: "Отзивът е качен успешно!",
      url: publicUrl,
    };
  } catch (err: unknown) {
    console.error("Upload review image exception:", err);
    return { success: false, message: "Грешка при качване на отзива." };
  }
}

/**
 * List "За Нас" review images from reviews_images table or reviews/ storage folder
 */
export async function listReviewsImagesAction(): Promise<{
  success: boolean;
  items: ReviewImageRecord[];
}> {
  try {
    // 1. Try querying reviews_images table
    const { data: dbRows } = await supabaseAdmin
      .from("reviews_images")
      .select("*")
      .order("display_order", { ascending: true });

    if (dbRows && dbRows.length > 0) {
      return { success: true, items: dbRows as ReviewImageRecord[] };
    }

    // 2. Fallback to storage folder reviews/
    const storageRes = await listMediaFolderAction("reviews");
    const fallbackItems: ReviewImageRecord[] = (storageRes.items || []).map((item, idx) => ({
      id: item.id || `storage-${idx}`,
      public_url: item.publicUrl,
      display_order: idx + 1,
    }));

    return { success: true, items: fallbackItems };
  } catch (err) {
    console.error("List reviews images exception:", err);
    return { success: false, items: [] };
  }
}

/**
 * Delete a review image from reviews_images table
 */
export async function deleteReviewImageAction(id: string, publicUrl?: string) {
  try {
    await supabaseAdmin.from("reviews_images").delete().eq("id", id);

    if (publicUrl) {
      try {
        const filename = publicUrl.split("/").pop();
        if (filename) {
          await supabaseAdmin.storage.from(MEDIA_BUCKET).remove([`reviews/${filename}`]);
          await supabaseAdmin.storage.from(FALLBACK_BUCKET).remove([`reviews/${filename}`]);
        }
      } catch {}
    }

    revalidatePublicPages();
    revalidatePath("/admin/media");
    revalidatePath("/admin");

    return { success: true, message: "Отзивът е изтрит успешно!" };
  } catch (err) {
    console.error("Delete review image exception:", err);
    return { success: false, message: "Грешка при изтриване на отзива." };
  }
}
