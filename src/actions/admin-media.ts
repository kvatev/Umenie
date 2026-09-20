"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase/server";

const BUCKET_NAME = "site-assets";

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

/**
 * Upload or replace the main hero banner: site-assets/hero-banner.webp
 */
export async function uploadHeroBannerAction(formData: FormData) {
  try {
    const file = formData.get("file") as File;
    if (!file) {
      return { success: false, message: "Няма избран файл за качване." };
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Save as hero-banner.webp
    const { error } = await supabaseAdmin.storage
      .from(BUCKET_NAME)
      .upload("hero-banner.webp", buffer, {
        contentType: file.type || "image/webp",
        upsert: true,
      });

    if (error) {
      console.error("Hero banner upload error:", error.message);
      return { success: false, message: error.message };
    }

    const { data: urlData } = supabaseAdmin.storage
      .from(BUCKET_NAME)
      .getPublicUrl("hero-banner.webp");

    revalidatePath("/");
    revalidatePath("/admin/media");
    revalidatePath("/admin");

    return {
      success: true,
      message: "Главният банер е качен и обновен успешно!",
      url: `${urlData.publicUrl}?t=${Date.now()}`,
    };
  } catch (err: unknown) {
    console.error("Upload hero banner exception:", err);
    return { success: false, message: "Грешка при качване на банера." };
  }
}

/**
 * Upload a photo to a specific folder in site-assets (e.g., 'kids-gallery' or 'services/pletivo')
 */
export async function uploadGalleryPhotoAction(formData: FormData) {
  try {
    const file = formData.get("file") as File;
    const folder = (formData.get("folder") as string) || "kids-gallery";

    if (!file) {
      return { success: false, message: "Няма избран файл." };
    }

    // Generate clean filename
    const sanitizedName = file.name
      .toLowerCase()
      .replace(/[^a-z0-9.]/g, "-")
      .replace(/-+/g, "-");
    const filename = `${Date.now()}-${sanitizedName}`;
    const filePath = `${folder}/${filename}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { error } = await supabaseAdmin.storage
      .from(BUCKET_NAME)
      .upload(filePath, buffer, {
        contentType: file.type || "image/jpeg",
        upsert: false,
      });

    if (error) {
      console.error("Gallery photo upload error:", error.message);
      return { success: false, message: error.message };
    }

    revalidatePath("/");
    revalidatePath("/admin/media");
    revalidatePath("/uslugi");

    return {
      success: true,
      message: "Снимката е качена успешно!",
      path: filePath,
    };
  } catch (err: unknown) {
    console.error("Upload gallery photo exception:", err);
    return { success: false, message: "Грешка при качване на снимката." };
  }
}

/**
 * Delete a media object by path
 */
export async function deleteMediaObjectAction(path: string) {
  try {
    const { error } = await supabaseAdmin.storage
      .from(BUCKET_NAME)
      .remove([path]);

    if (error) {
      console.error("Delete media error:", error.message);
      return { success: false, message: error.message };
    }

    revalidatePath("/");
    revalidatePath("/admin/media");
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
    const { data, error } = await supabaseAdmin.storage
      .from(BUCKET_NAME)
      .list(folder, {
        limit: 100,
        sortBy: { column: "created_at", order: "desc" },
      });

    if (error) {
      console.warn("List media warning (bucket may be empty or not yet created):", error.message);
      return { success: true, items: [] };
    }

    const items: StorageMediaItem[] = (data || [])
      .filter((file) => file.name && !file.name.startsWith("."))
      .map((file) => {
        const fullPath = folder ? `${folder}/${file.name}` : file.name;
        const { data: urlData } = supabaseAdmin.storage
          .from(BUCKET_NAME)
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
