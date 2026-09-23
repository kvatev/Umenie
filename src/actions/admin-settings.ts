"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { getSiteSettings } from "@/lib/site-settings";
import { SiteSettings, DEFAULT_SETTINGS } from "@/lib/types/site-settings";

const BUCKET_NAME = "site-assets";
const FILE_NAME = "settings.json";

export async function getSiteSettingsAction(): Promise<SiteSettings> {
  return await getSiteSettings();
}

export async function updateSiteSettingsAction(formData: Partial<SiteSettings>) {
  try {
    // Current settings as base
    const current = await getSiteSettings();

    // Auto-calculate phoneRaw if phoneDisplay or phoneFull was updated
    let phoneRaw = formData.phoneRaw?.trim() || "";
    if (!phoneRaw && (formData.phoneFull || formData.phoneDisplay)) {
      const p = (formData.phoneFull || formData.phoneDisplay || "").replace(/\s+/g, "");
      if (p.startsWith("+")) {
        phoneRaw = p;
      } else if (p.startsWith("0")) {
        phoneRaw = "+359" + p.slice(1);
      } else {
        phoneRaw = p;
      }
    }

    const updatedSettings: SiteSettings = {
      phoneDisplay: formData.phoneDisplay?.trim() || current.phoneDisplay,
      phoneFull: formData.phoneFull?.trim() || current.phoneFull,
      phoneRaw: phoneRaw || current.phoneRaw,
      locationShort: formData.locationShort?.trim() || current.locationShort,
      locationFull: formData.locationFull?.trim() || current.locationFull,
      googleMapsUrl: formData.googleMapsUrl?.trim() || current.googleMapsUrl,
      email: formData.email?.trim() || current.email,
      tagline: formData.tagline?.trim() || current.tagline,
      facebookUrl: formData.facebookUrl?.trim() || current.facebookUrl,
      instagramUrl: formData.instagramUrl?.trim() || current.instagramUrl,
    };

    const jsonString = JSON.stringify(updatedSettings, null, 2);
    const buffer = Buffer.from(jsonString, "utf-8");

    const { error } = await supabaseAdmin.storage
      .from(BUCKET_NAME)
      .upload(FILE_NAME, buffer, {
        contentType: "application/json",
        upsert: true,
      });

    if (error) {
      console.error("Error saving site settings to Supabase:", error.message);
      return { success: false, message: error.message };
    }

    // Revalidate all pages using contacts
    revalidatePath("/");
    revalidatePath("/uslugi");
    revalidatePath("/za-nas");
    revalidatePath("/grafik");
    revalidatePath("/admin");
    revalidatePath("/admin/contacts");

    return {
      success: true,
      message: "Контактната информация и социалните мрежи са обновени успешно!",
      settings: updatedSettings,
    };
  } catch (err: unknown) {
    console.error("Update site settings exception:", err);
    return { success: false, message: "Възникна непредвидена грешка при запазване на настройките." };
  }
}
