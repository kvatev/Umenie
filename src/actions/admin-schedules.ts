"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase/admin";

export interface ScheduleFormData {
  title: string;
  category: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  age_group: string;
  location?: string;
  is_active?: boolean;
}

export async function createScheduleAction(data: ScheduleFormData) {
  try {
    const { error, data: inserted } = await supabaseAdmin
      .from("schedules")
      .insert({
        title: data.title,
        category: data.category,
        day_of_week: data.day_of_week,
        start_time: data.start_time,
        end_time: data.end_time,
        age_group: data.age_group,
        location: data.location || "Славейков, блок 48, партер",
        is_active: data.is_active ?? true,
      })
      .select("id")
      .single();

    if (error) {
      console.error("Error creating schedule:", error.message);
      return { success: false, message: error.message };
    }

    revalidatePath("/grafik");
    revalidatePath("/admin/schedule");
    revalidatePath("/admin");
    return { success: true, message: "Занятието е добавено успешно!", id: inserted?.id };
  } catch (err: unknown) {
    console.error("Create schedule exception:", err);
    return { success: false, message: "Грешка при създаване на занятие." };
  }
}

export async function updateScheduleAction(id: string, data: Partial<ScheduleFormData>) {
  try {
    const { error } = await supabaseAdmin
      .from("schedules")
      .update(data)
      .eq("id", id);

    if (error) {
      console.error("Error updating schedule:", error.message);
      return { success: false, message: error.message };
    }

    revalidatePath("/grafik");
    revalidatePath("/admin/schedule");
    revalidatePath("/admin");
    return { success: true, message: "Занятието е актуализирано успешно!" };
  } catch (err: unknown) {
    console.error("Update schedule exception:", err);
    return { success: false, message: "Грешка при обновяване." };
  }
}

export async function toggleScheduleActiveAction(id: string, currentStatus: boolean) {
  try {
    const { error } = await supabaseAdmin
      .from("schedules")
      .update({ is_active: !currentStatus })
      .eq("id", id);

    if (error) {
      console.error("Error toggling schedule active:", error.message);
      return { success: false, message: error.message };
    }

    revalidatePath("/grafik");
    revalidatePath("/admin/schedule");
    revalidatePath("/admin");
    return { success: true, message: "Видимостта е променена!" };
  } catch (err: unknown) {
    console.error("Toggle schedule active exception:", err);
    return { success: false, message: "Грешка при превключване." };
  }
}

export async function deleteScheduleAction(id: string) {
  try {
    const { error } = await supabaseAdmin
      .from("schedules")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting schedule:", error.message);
      return { success: false, message: error.message };
    }

    revalidatePath("/grafik");
    revalidatePath("/admin/schedule");
    revalidatePath("/admin");
    return { success: true, message: "Занятието е изтрито успешно!" };
  } catch (err: unknown) {
    console.error("Delete schedule exception:", err);
    return { success: false, message: "Грешка при изтриване." };
  }
}

/**
 * Upload schedule file/image (PDF, PNG, JPG, WebP)
 */
export async function uploadScheduleFileAction(formData: FormData) {
  try {
    const file = formData.get("file") as File;
    if (!file) {
      return { success: false, message: "Няма избран файл." };
    }

    const extension = file.name.split(".").pop()?.toLowerCase() || "pdf";
    const storagePath = `schedule-file.${extension}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { error } = await supabaseAdmin.storage
      .from("site-assets")
      .upload(storagePath, buffer, {
        contentType: file.type || "application/pdf",
        upsert: true,
      });

    if (error) {
      console.error("Upload schedule file error:", error.message);
      return { success: false, message: error.message };
    }

    const { data: urlData } = supabaseAdmin.storage
      .from("site-assets")
      .getPublicUrl(storagePath);

    const publicUrl = `${urlData.publicUrl}?t=${Date.now()}`;

    const { updateSiteSettingsAction } = await import("./admin-settings");
    await updateSiteSettingsAction({
      scheduleFileUrl: publicUrl,
      scheduleFileName: file.name,
    });

    revalidatePath("/grafik");
    revalidatePath("/");
    revalidatePath("/admin/schedule");
    revalidatePath("/admin");

    return {
      success: true,
      message: "Файлът за графика е качен успешно!",
      url: publicUrl,
      fileName: file.name,
    };
  } catch (err: unknown) {
    console.error("Upload schedule file exception:", err);
    return { success: false, message: "Грешка при качване на файла за графика." };
  }
}

/**
 * Delete schedule file/image
 */
export async function deleteScheduleFileAction() {
  try {
    const { getSiteSettings } = await import("@/lib/site-settings");
    const settings = await getSiteSettings();

    if (settings.scheduleFileUrl) {
      // Find possible extensions
      await supabaseAdmin.storage
        .from("site-assets")
        .remove([
          "schedule-file.pdf",
          "schedule-file.jpg",
          "schedule-file.jpeg",
          "schedule-file.png",
          "schedule-file.webp",
        ]);
    }

    const { updateSiteSettingsAction } = await import("./admin-settings");
    await updateSiteSettingsAction({
      scheduleFileUrl: "",
      scheduleFileName: "",
    });

    revalidatePath("/grafik");
    revalidatePath("/");
    revalidatePath("/admin/schedule");
    revalidatePath("/admin");

    return {
      success: true,
      message: "Файлът за графика е премахнат успешно!",
    };
  } catch (err: unknown) {
    console.error("Delete schedule file exception:", err);
    return { success: false, message: "Грешка при изтриване на файла." };
  }
}
