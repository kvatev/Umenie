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
