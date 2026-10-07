"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { getSiteSettings } from "@/lib/site-settings";
import { updateSiteSettingsAction } from "@/actions/admin-settings";
import { ServiceOverride, AboutTextItem } from "@/lib/types/site-settings";

const MEDIA_BUCKET = "site-media";
const FALLBACK_BUCKET = "site-assets";

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
 * Safe upload helper
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
 * 1. Save or update service text and settings overrides
 */
export async function saveServiceContentAction(slug: string, overrideData: ServiceOverride) {
  try {
    const settings = await getSiteSettings();
    const currentOverrides = settings.servicesOverrides || {};

    const updatedOverrides = {
      ...currentOverrides,
      [slug]: {
        ...(currentOverrides[slug] || {}),
        ...overrideData,
      },
    };

    const res = await updateSiteSettingsAction({
      servicesOverrides: updatedOverrides,
    });

    if (res.success) {
      revalidatePath("/uslugi");
      revalidatePath(`/uslugi/${slug}`);
      revalidatePath("/");
      revalidatePath("/admin/pages/services");
    }

    return {
      success: true,
      message: "Данните за услугата бяха запазени успешно!",
    };
  } catch (err: unknown) {
    console.error("Save service content exception:", err);
    return { success: false, message: "Грешка при записване на услугата." };
  }
}

/**
 * 2. Upload image for a service (page-1, page-2 or slider)
 */
export async function uploadServiceImageAction(formData: FormData) {
  try {
    const file = formData.get("file") as File;
    const slug = (formData.get("slug") as string)?.trim();
    const imageType = (formData.get("imageType") as string)?.trim() as "page-1" | "page-2" | "slider";

    if (!file || !slug || !imageType) {
      return { success: false, message: "Невалидни данни за качване на снимка." };
    }

    const arrayBuffer = await file.arrayBuffer();
    let buffer = Buffer.from(arrayBuffer);
    let contentType = file.type || "image/webp";
    let extension = "webp";

    // Convert and optimize using high-fidelity WebP (quality 92, max 1920px, EXIF orientation preserved)
    try {
      const sharpModule = await import("sharp");
      const sharp = sharpModule.default;
      buffer = await sharp(buffer)
        .rotate()
        .resize(1920, 1920, { fit: "inside", withoutEnlargement: true })
        .webp({ quality: 92, effort: 4 })
        .toBuffer();
      contentType = "image/webp";
      extension = "webp";
    } catch (sharpErr) {
      console.warn("Sharp optimization skipped, uploading original buffer:", sharpErr);
    }

    let filePath = "";
    if (imageType === "page-1") {
      filePath = `services/${slug}/page-1.${extension}`;
    } else if (imageType === "page-2") {
      filePath = `services/${slug}/page-2.${extension}`;
    } else {
      const baseName = file.name
        .substring(0, file.name.lastIndexOf(".") > 0 ? file.name.lastIndexOf(".") : file.name.length)
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "-")
        .replace(/-+/g, "-");
      filePath = `services/${slug}/slider/${Date.now()}-${baseName || "slide"}.${extension}`;
    }

    const { publicUrl } = await safeUpload(filePath, buffer, contentType, true);
    const fullUrl = `${publicUrl}?t=${Date.now()}`;

    // Update service override in site settings
    const settings = await getSiteSettings();
    const currentOverrides = settings.servicesOverrides || {};
    const serviceOverride = currentOverrides[slug] || {};

    if (imageType === "page-1" || imageType === "page-2") {
      const pageImages = [...(serviceOverride.pageImages || [])];
      if (imageType === "page-1") {
        pageImages[0] = fullUrl;
      } else {
        pageImages[1] = fullUrl;
      }
      await updateSiteSettingsAction({
        servicesOverrides: {
          ...currentOverrides,
          [slug]: {
            ...serviceOverride,
            pageImages,
          },
        },
      });
    } else if (imageType === "slider") {
      const sliderImages = [...(serviceOverride.sliderImages || []), fullUrl];
      await updateSiteSettingsAction({
        servicesOverrides: {
          ...currentOverrides,
          [slug]: {
            ...serviceOverride,
            sliderImages,
          },
        },
      });
    }

    revalidatePath("/uslugi");
    revalidatePath(`/uslugi/${slug}`);
    revalidatePath("/");
    revalidatePath("/admin/pages/services");

    return {
      success: true,
      message: "Снимката е качена и оптимизирана с отлично качество!",
      url: fullUrl,
    };
  } catch (err: unknown) {
    console.error("Upload service image exception:", err);
    return { success: false, message: "Грешка при качване на снимката." };
  }
}

/**
 * 3. Save framing & crop settings for an individual slider image
 */
export async function saveSliderImageSettingAction(
  slug: string,
  imageUrl: string,
  setting: { fit?: "cover" | "contain"; position?: string; scale?: number }
) {
  try {
    const settings = await getSiteSettings();
    const currentOverrides = settings.servicesOverrides || {};
    const serviceOverride = currentOverrides[slug] || {};
    const currentSettings = serviceOverride.sliderImageSettings || {};

    const fileName = imageUrl.split("/").pop() || imageUrl;

    const updatedSettings = {
      ...currentSettings,
      [imageUrl]: setting,
      [fileName]: setting,
    };

    await updateSiteSettingsAction({
      servicesOverrides: {
        ...currentOverrides,
        [slug]: {
          ...serviceOverride,
          sliderImageSettings: updatedSettings,
        },
      },
    });

    revalidatePath("/uslugi");
    revalidatePath(`/uslugi/${slug}`);
    revalidatePath("/");
    revalidatePath("/admin/pages/services");

    return {
      success: true,
      message: "Настройките за кадъра бяха запазени успешно!",
    };
  } catch (err: unknown) {
    console.error("Save slider image setting exception:", err);
    return { success: false, message: "Грешка при запазване на настройките на кадъра." };
  }
}

/**
 * 3. Delete a slider image from a service
 */
export async function deleteServiceSliderImageAction(slug: string, imageUrlOrPath: string) {
  try {
    const settings = await getSiteSettings();
    const currentOverrides = settings.servicesOverrides || {};
    const serviceOverride = currentOverrides[slug] || {};

    const currentSlider = serviceOverride.sliderImages || [];
    const updatedSlider = currentSlider.filter((img) => img !== imageUrlOrPath);

    await updateSiteSettingsAction({
      servicesOverrides: {
        ...currentOverrides,
        [slug]: {
          ...serviceOverride,
          sliderImages: updatedSlider,
        },
      },
    });

    // Also attempt deletion from storage if it is a storage path/url
    try {
      const cleanPath = imageUrlOrPath.split("?")[0];
      const match = cleanPath.match(/services\/[a-z0-9\-]+\/slider\/[a-z0-9\-.]+/);
      if (match) {
        await supabaseAdmin.storage.from(MEDIA_BUCKET).remove([match[0]]);
        await supabaseAdmin.storage.from(FALLBACK_BUCKET).remove([match[0]]);
      }
    } catch {}

    revalidatePath("/uslugi");
    revalidatePath(`/uslugi/${slug}`);
    revalidatePath("/");
    revalidatePath("/admin/pages/services");

    return {
      success: true,
      message: "Снимката от слайдъра е изтрита успешно!",
    };
  } catch (err: unknown) {
    console.error("Delete service slider image exception:", err);
    return { success: false, message: "Грешка при изтриване на снимката." };
  }
}

/**
 * 4. Save About page values and feature points
 */
export async function saveAboutPageContentAction(
  aboutValues: AboutTextItem[],
  aboutFeatures: AboutTextItem[]
) {
  try {
    const res = await updateSiteSettingsAction({
      aboutValues,
      aboutFeatures,
    });

    if (res.success) {
      revalidatePath("/za-nas");
      revalidatePath("/");
      revalidatePath("/admin/pages/about");
    }

    return {
      success: true,
      message: "Текстовете за страница „За нас“ бяха запазени успешно!",
    };
  } catch (err: unknown) {
    console.error("Save about page content exception:", err);
    return { success: false, message: "Грешка при записване на текстовете." };
  }
}
