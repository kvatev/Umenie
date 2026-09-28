"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase/admin";

const MEDIA_BUCKET = "site-media";
const FALLBACK_BUCKET = "site-assets";

function revalidatePublicPages() {
  revalidatePath("/");
  revalidatePath("/za-nas");
  revalidatePath("/grafik");
  revalidatePath("/uslugi");
}

export interface ScheduleFormData {
  title: string;
  category: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  age_group: string;
  location?: string;
  is_active?: boolean;
  capacity?: number;
}

export async function createScheduleAction(data: ScheduleFormData) {
  try {
    // 1. Insert into schedule_events table (schema requirement 4)
    try {
      await supabaseAdmin.from("schedule_events").insert({
        title: data.title,
        day_of_week: data.day_of_week,
        start_time: data.start_time,
        end_time: data.end_time,
        age_group: data.age_group,
        location: data.location || "Славейков, блок 48, партер",
        capacity: data.capacity || 10,
      });
    } catch (e) {
      console.warn("Could not insert into schedule_events (table may need migration):", e);
    }

    // 2. Insert into schedules table
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
      console.error("Error creating schedule in schedules table:", error.message);
      return { success: false, message: error.message };
    }

    revalidatePublicPages();
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
    // 1. Update in schedules table
    const { error } = await supabaseAdmin
      .from("schedules")
      .update(data)
      .eq("id", id);

    // 2. Also attempt update in schedule_events
    try {
      await supabaseAdmin
        .from("schedule_events")
        .update({
          title: data.title,
          day_of_week: data.day_of_week,
          start_time: data.start_time,
          end_time: data.end_time,
          age_group: data.age_group,
          location: data.location,
          capacity: data.capacity,
        })
        .eq("id", id);
    } catch {}

    if (error) {
      console.error("Error updating schedule:", error.message);
      return { success: false, message: error.message };
    }

    revalidatePublicPages();
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

    revalidatePublicPages();
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
    // 1. Delete from schedules
    const { error } = await supabaseAdmin
      .from("schedules")
      .delete()
      .eq("id", id);

    // 2. Delete from schedule_events
    try {
      await supabaseAdmin
        .from("schedule_events")
        .delete()
        .eq("id", id);
    } catch {}

    if (error) {
      console.error("Error deleting schedule:", error.message);
      return { success: false, message: error.message };
    }

    revalidatePublicPages();
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

    let publicUrl = "";

    // Upload to site-media (primary)
    try {
      await supabaseAdmin.storage.createBucket(MEDIA_BUCKET, { public: true });
    } catch {}

    const { error } = await supabaseAdmin.storage
      .from(MEDIA_BUCKET)
      .upload(storagePath, buffer, {
        contentType: file.type || "application/pdf",
        upsert: true,
      });

    if (!error) {
      const { data: urlData } = supabaseAdmin.storage
        .from(MEDIA_BUCKET)
        .getPublicUrl(storagePath);
      publicUrl = `${urlData.publicUrl}?t=${Date.now()}`;
    } else {
      // Fallback
      await supabaseAdmin.storage
        .from(FALLBACK_BUCKET)
        .upload(storagePath, buffer, {
          contentType: file.type || "application/pdf",
          upsert: true,
        });
      const { data: urlData } = supabaseAdmin.storage
        .from(FALLBACK_BUCKET)
        .getPublicUrl(storagePath);
      publicUrl = `${urlData.publicUrl}?t=${Date.now()}`;
    }

    const { updateSiteSettingsAction } = await import("./admin-settings");
    await updateSiteSettingsAction({
      scheduleFileUrl: publicUrl,
      scheduleFileName: file.name,
    });

    revalidatePublicPages();
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
    const filesToRemove = [
      "schedule-file.pdf",
      "schedule-file.jpg",
      "schedule-file.jpeg",
      "schedule-file.png",
      "schedule-file.webp",
    ];

    await supabaseAdmin.storage.from(MEDIA_BUCKET).remove(filesToRemove);
    await supabaseAdmin.storage.from(FALLBACK_BUCKET).remove(filesToRemove);

    const { updateSiteSettingsAction } = await import("./admin-settings");
    await updateSiteSettingsAction({
      scheduleFileUrl: "",
      scheduleFileName: "",
    });

    revalidatePublicPages();
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
