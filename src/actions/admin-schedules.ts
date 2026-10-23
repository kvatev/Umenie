"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase/admin";
import {
  ScheduleItem,
  RecurrenceRule,
  DEFAULT_SCHEDULES,
  mapRowToScheduleItem,
  formatDateKey,
  parseDateKey,
  getDayOfWeekNumber,
  getEventOccurrenceDates,
} from "@/lib/schedule-data";
import { randomUUID } from "crypto";

const MEDIA_BUCKET = "site-media";
const FALLBACK_BUCKET = "site-assets";
const EXTENDED_SCHEDULE_FILE = "schedules_extended.json";

function revalidatePublicPages() {
  revalidatePath("/");
  revalidatePath("/za-nas");
  revalidatePath("/grafik");
  revalidatePath("/uslugi");
  revalidatePath("/admin/pages/schedule");
  revalidatePath("/admin/schedule");
  revalidatePath("/admin");
}

export interface ScheduleFormData {
  title: string;
  title_en?: string;
  titleEn?: string;
  category: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  age_group: string;
  location?: string;
  is_active?: boolean;
  capacity?: number;
  date?: string | null;           // "YYYY-MM-DD"
  recurrence?: RecurrenceRule | null;
  series_id?: string | null;
  additional_days?: number[];     // Multi-day selection
  excluded_dates?: string[];
  excludedDates?: string[];
}

/**
 * Storage helpers for extended schedule metadata (zero-downtime persistence)
 */
async function getStoredExtendedSchedules(): Promise<ScheduleItem[] | null> {
  try {
    const { data, error } = await supabaseAdmin.storage
      .from(MEDIA_BUCKET)
      .download(EXTENDED_SCHEDULE_FILE);

    if (!error && data) {
      const text = await data.text();
      const parsed = JSON.parse(text);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((row) => mapRowToScheduleItem(row));
      }
    }
  } catch (err) {
    // Continue
  }
  return null;
}

async function saveStoredExtendedSchedules(items: ScheduleItem[]): Promise<boolean> {
  try {
    const jsonString = JSON.stringify(items, null, 2);
    const buffer = Buffer.from(jsonString, "utf-8");

    // Ensure bucket exists
    try {
      await supabaseAdmin.storage.createBucket(MEDIA_BUCKET, { public: true });
    } catch {}

    const { error } = await supabaseAdmin.storage
      .from(MEDIA_BUCKET)
      .upload(EXTENDED_SCHEDULE_FILE, buffer, {
        contentType: "application/json",
        upsert: true,
      });

    return !error;
  } catch (err) {
    console.error("Error saving extended schedules to storage:", err);
    return false;
  }
}

/**
 * Universal schedule fetcher:
 * 1. schedule_events table (primary modern store with recurrence & dates)
 * 2. schedules table in Supabase (merges & auto-syncs any legacy/baseline items)
 * 3. schedules_extended.json in storage
 * 4. DEFAULT_SCHEDULES fallback
 * Guarantees zero events disappear when creating new ones.
 */
export async function getSchedulesAction(): Promise<ScheduleItem[]> {
  try {
    const itemMap = new Map<string, ScheduleItem>();

    // 1. Primary: Try schedule_events table
    try {
      const { data: eventData, error: eventErr } = await supabaseAdmin
        .from("schedule_events")
        .select("*")
        .order("day_of_week", { ascending: true })
        .order("start_time", { ascending: true });

      if (!eventErr && eventData && eventData.length > 0) {
        for (const row of eventData) {
          itemMap.set(row.id, mapRowToScheduleItem(row));
        }
      }
    } catch (e) {
      console.warn("Could not query schedule_events table:", e);
    }

    // 2. Compatibility & Fallback: Query schedules table to ensure NO existing/legacy schedule is ever lost
    try {
      const { data: schedData, error: schedErr } = await supabaseAdmin
        .from("schedules")
        .select("*")
        .order("day_of_week", { ascending: true })
        .order("start_time", { ascending: true });

      if (!schedErr && schedData && schedData.length > 0) {
        for (const row of schedData) {
          if (!itemMap.has(row.id)) {
            const mapped = mapRowToScheduleItem(row);
            itemMap.set(row.id, mapped);

            // Automatically mirror into schedule_events
            try {
              await supabaseAdmin.from("schedule_events").upsert({
                id: row.id,
                title: row.title,
                category: row.category,
                day_of_week: row.day_of_week,
                start_time: row.start_time,
                end_time: row.end_time,
                age_group: row.age_group,
                location: row.location || "Славейков, блок 48, партер",
                capacity: 10,
                is_active: row.is_active ?? true,
                event_date: null,
                recurrence_type: "none",
                recurrence_count: null,
                recurrence_until: null,
                series_id: null,
              });
            } catch {}
          }
        }
      }
    } catch (e) {
      console.warn("Could not query schedules table:", e);
    }

    // 3. Extended storage fallback
    if (itemMap.size === 0) {
      const stored = await getStoredExtendedSchedules();
      if (stored && stored.length > 0) {
        for (const item of stored) {
          if (!itemMap.has(item.id)) {
            itemMap.set(item.id, item);
          }
        }
      }
    }

    if (itemMap.size > 0) {
      const allItems = Array.from(itemMap.values());
      return allItems.sort((a, b) => {
        if (a.dayOfWeek !== b.dayOfWeek) {
          return a.dayOfWeek - b.dayOfWeek;
        }
        return a.startTime.localeCompare(b.startTime);
      });
    }

    return DEFAULT_SCHEDULES;
  } catch (err) {
    console.error("Error fetching schedules in action:", err);
    return DEFAULT_SCHEDULES;
  }
}

/**
 * Create Schedule Item (Single or Recurring Series, with Multi-day Support)
 */
export async function createScheduleAction(data: ScheduleFormData) {
  try {
    const isRecurring = Boolean(data.recurrence && data.recurrence.type !== "none");
    const hasMultipleDays = Boolean(data.additional_days && data.additional_days.length > 0);
    const seriesId = isRecurring || hasMultipleDays ? (data.series_id || randomUUID()) : null;

    const allDays = [data.day_of_week, ...(data.additional_days || [])].filter(
      (v, i, a) => a.indexOf(v) === i
    );

    const currentList = await getSchedulesAction();
    const newItems: ScheduleItem[] = [];

    for (const dow of allDays) {
      const newId = randomUUID();

      // Determine initial start date for this day of week
      let eventDate = data.date || null;
      if (data.date) {
        const baseDate = parseDateKey(data.date);
        const baseDow = getDayOfWeekNumber(baseDate);
        if (dow !== baseDow) {
          // Adjust date forward to match this specific day of week
          const diff = (dow - baseDow + 7) % 7;
          const adjusted = new Date(baseDate);
          adjusted.setDate(adjusted.getDate() + diff);
          eventDate = formatDateKey(adjusted);
        }
      }

      // 1. Try insert into schedule_events table
      try {
        await supabaseAdmin.from("schedule_events").insert({
          id: newId,
          title: data.title,
          title_en: data.title_en || data.titleEn || null,
          category: data.category,
          day_of_week: dow,
          start_time: data.start_time,
          end_time: data.end_time,
          age_group: data.age_group,
          location: data.location || "Славейков, блок 48, партер",
          capacity: data.capacity || 10,
          is_active: data.is_active ?? true,
          event_date: eventDate,
          recurrence_type: data.recurrence?.type || "none",
          recurrence_count: data.recurrence?.count || null,
          recurrence_until: data.recurrence?.untilDate || null,
          series_id: seriesId,
        });
      } catch {}

      // 2. Insert into schedules table (legacy compatibility)
      try {
        await supabaseAdmin.from("schedules").insert({
          id: newId,
          title: data.title,
          category: data.category,
          day_of_week: dow,
          start_time: data.start_time,
          end_time: data.end_time,
          age_group: data.age_group,
          location: data.location || "Славейков, блок 48, партер",
          is_active: data.is_active ?? true,
        });
      } catch {}

      const newItem = mapRowToScheduleItem({
        id: newId,
        title: data.title,
        title_en: data.title_en || data.titleEn || null,
        titleEn: data.title_en || data.titleEn || null,
        category: data.category,
        day_of_week: dow,
        start_time: data.start_time,
        end_time: data.end_time,
        age_group: data.age_group,
        location: data.location || "Славейков, блок 48, партер",
        capacity: data.capacity || 10,
        is_active: data.is_active ?? true,
        date: eventDate,
        recurrence: data.recurrence || null,
        seriesId,
      });

      newItems.push(newItem);
    }

    // Save extended state
    const updatedList = [...currentList, ...newItems];
    await saveStoredExtendedSchedules(updatedList);

    revalidatePublicPages();

    return {
      success: true,
      message: `Успешно ${newItems.length > 1 ? `бяха добавени ${newItems.length} занятия` : "беше добавено занятието"}!`,
      ids: newItems.map((item) => item.id),
      seriesId,
      items: newItems,
    };
  } catch (err: unknown) {
    console.error("Create schedule exception:", err);
    return { success: false, message: "Грешка при създаване на занятие." };
  }
}

/**
 * Update Schedule Item (Single Occurrence or Entire Series)
 */
export async function updateScheduleAction(
  id: string,
  data: Partial<ScheduleFormData>,
  scope: "single" | "series" = "single"
) {
  try {
    const currentList = await getSchedulesAction();
    const target = currentList.find((item) => item.id === id);

    const updateAllSeries = scope === "series" && Boolean(target?.seriesId);
    const seriesId = target?.seriesId;

    // 1. Update in schedule_events table
    try {
      const updatePayload: Record<string, any> = {
        title: data.title,
        category: data.category,
        start_time: data.start_time,
        end_time: data.end_time,
        age_group: data.age_group,
        location: data.location,
        capacity: data.capacity,
        is_active: data.is_active,
        recurrence_type: data.recurrence?.type,
        recurrence_count: data.recurrence?.count || null,
        recurrence_until: data.recurrence?.untilDate || null,
      };
      if (data.title_en !== undefined || data.titleEn !== undefined) updatePayload.title_en = data.title_en ?? data.titleEn ?? null;
      if (data.day_of_week !== undefined) updatePayload.day_of_week = data.day_of_week;
      if (data.date !== undefined) updatePayload.event_date = data.date;

      const q = supabaseAdmin.from("schedule_events").update(updatePayload);
      if (updateAllSeries && seriesId) {
        await q.eq("series_id", seriesId);
      } else {
        await q.eq("id", id);
      }
    } catch {}

    // 2. Update in schedules table
    try {
      const schedPayload: Record<string, any> = {};
      if (data.title !== undefined) schedPayload.title = data.title;
      if (data.category !== undefined) schedPayload.category = data.category;
      if (data.day_of_week !== undefined) schedPayload.day_of_week = data.day_of_week;
      if (data.start_time !== undefined) schedPayload.start_time = data.start_time;
      if (data.end_time !== undefined) schedPayload.end_time = data.end_time;
      if (data.age_group !== undefined) schedPayload.age_group = data.age_group;
      if (data.location !== undefined) schedPayload.location = data.location;
      if (data.is_active !== undefined) schedPayload.is_active = data.is_active;

      await supabaseAdmin.from("schedules").update(schedPayload).eq("id", id);
    } catch {}

    // 3. Update in extended storage
    const updatedList = currentList.map((item) => {
      const isTarget = updateAllSeries && seriesId ? item.seriesId === seriesId : item.id === id;
      if (!isTarget) return item;

      return {
        ...item,
        title: data.title ?? item.title,
        titleEn: (data.titleEn !== undefined ? data.titleEn : (data.title_en !== undefined ? data.title_en : item.titleEn)),
        title_en: (data.title_en !== undefined ? data.title_en : (data.titleEn !== undefined ? data.titleEn : item.title_en)),
        category: (data.category ?? item.category) as ScheduleItem["category"],
        dayOfWeek: data.day_of_week ?? item.dayOfWeek,
        startTime: data.start_time ? data.start_time.slice(0, 5) : item.startTime,
        endTime: data.end_time ? data.end_time.slice(0, 5) : item.endTime,
        ageGroup: data.age_group ?? item.ageGroup,
        location: data.location ?? item.location,
        capacity: data.capacity ?? item.capacity,
        isActive: data.is_active ?? item.isActive,
        date: data.date !== undefined ? data.date : item.date,
        recurrence: data.recurrence !== undefined ? data.recurrence : item.recurrence,
        excludedDates: (data.excluded_dates || data.excludedDates) !== undefined ? (data.excluded_dates || data.excludedDates) : item.excludedDates,
      };
    });

    await saveStoredExtendedSchedules(updatedList);

    revalidatePublicPages();

    return {
      success: true,
      message: updateAllSeries
        ? "Всички занятия от серията бяха обновени!"
        : "Занятието е обновено успешно!",
      items: updatedList.filter((item) =>
        updateAllSeries && seriesId ? item.seriesId === seriesId : item.id === id
      ),
    };
  } catch (err: unknown) {
    console.error("Update schedule exception:", err);
    return { success: false, message: "Грешка при обновяване на занятие." };
  }
}

/**
 * Toggle Active Status (Single or Series)
 */
export async function toggleScheduleActiveAction(
  id: string,
  currentStatus: boolean,
  scope: "single" | "series" = "single"
) {
  try {
    const currentList = await getSchedulesAction();
    const target = currentList.find((item) => item.id === id);
    const updateAllSeries = scope === "series" && Boolean(target?.seriesId);
    const seriesId = target?.seriesId;
    const newStatus = !currentStatus;

    try {
      const q = supabaseAdmin.from("schedule_events").update({ is_active: newStatus });
      if (updateAllSeries && seriesId) {
        await q.eq("series_id", seriesId);
      } else {
        await q.eq("id", id);
      }
    } catch {}

    try {
      await supabaseAdmin.from("schedules").update({ is_active: newStatus }).eq("id", id);
    } catch {}

    const updatedList = currentList.map((item) => {
      const isTarget = updateAllSeries && seriesId ? item.seriesId === seriesId : item.id === id;
      return isTarget ? { ...item, isActive: newStatus } : item;
    });

    await saveStoredExtendedSchedules(updatedList);

    revalidatePublicPages();

    return { success: true, message: "Видимостта е променена!" };
  } catch (err: unknown) {
    console.error("Toggle schedule active exception:", err);
    return { success: false, message: "Грешка при промяна на видимостта." };
  }
}

export type DeleteScheduleScope = "single" | "series" | "dates";

export interface DeleteScheduleOptions {
  scope?: DeleteScheduleScope;
  targetDate?: string;    // "YYYY-MM-DD"
  targetDates?: string[]; // array of "YYYY-MM-DD"
}

/**
 * Delete Schedule Item (Single, Specific Day / Days, or Entire Series)
 */
export async function deleteScheduleAction(
  id: string,
  optionsOrScope: DeleteScheduleScope | DeleteScheduleOptions = "single",
  datesParam?: string[]
) {
  try {
    let scope: DeleteScheduleScope = "single";
    let targetDates: string[] = [];

    if (typeof optionsOrScope === "string") {
      scope = optionsOrScope;
      if (datesParam && Array.isArray(datesParam)) {
        targetDates = datesParam;
      }
    } else if (optionsOrScope && typeof optionsOrScope === "object") {
      scope = optionsOrScope.scope || "single";
      if (optionsOrScope.targetDates && Array.isArray(optionsOrScope.targetDates)) {
        targetDates = optionsOrScope.targetDates;
      } else if (optionsOrScope.targetDate) {
        targetDates = [optionsOrScope.targetDate];
      }
    }

    const currentList = await getSchedulesAction();
    const target = currentList.find((item) => item.id === id);

    if (!target) {
      return { success: false, message: "Занятието не е намерено." };
    }

    const deleteAllSeries = scope === "series" && Boolean(target.seriesId);
    const seriesId = target.seriesId;

    // A. Specific Date(s) Deletion from a Recurring Series
    if (scope === "dates" || targetDates.length > 0) {
      const isRecurring = Boolean(
        (target.recurrence && target.recurrence.type !== "none") ||
        target.seriesId ||
        target.date
      );

      // If it is a recurring series, exclude the dates without deleting the parent event
      if (isRecurring) {
        const existingExcluded = target.excludedDates || [];
        const mergedExcluded = Array.from(new Set([...existingExcluded, ...targetDates]));

        // Check if all occurrences are now excluded
        const allOccurrences = getEventOccurrenceDates(target, true);
        const remainingOccurrences = allOccurrences.filter((d) => !mergedExcluded.includes(d));

        if (allOccurrences.length > 0 && remainingOccurrences.length === 0) {
          // No occurrences left: delete the entire record
          try {
            await supabaseAdmin.from("schedule_events").delete().eq("id", id);
          } catch {}
          try {
            await supabaseAdmin.from("schedules").delete().eq("id", id);
          } catch {}

          const updatedList = currentList.filter((item) => item.id !== id);
          await saveStoredExtendedSchedules(updatedList);
          revalidatePublicPages();

          return {
            success: true,
            message: "Всички дати от серията бяха изтрити, занятието беше премахнато.",
          };
        }

        // Otherwise update excluded_dates
        try {
          await supabaseAdmin
            .from("schedule_events")
            .update({ excluded_dates: mergedExcluded })
            .eq("id", id);
        } catch {}

        const updatedList = currentList.map((item) => {
          if (item.id === id) {
            return {
              ...item,
              excludedDates: mergedExcluded,
            };
          }
          return item;
        });

        await saveStoredExtendedSchedules(updatedList);
        revalidatePublicPages();

        const count = targetDates.length;
        const msg =
          count === 1
            ? "Занятието за избрания ден беше изтрито успешно!"
            : "Избраните " + count + " дни бяха изтрити успешно!";

        return {
          success: true,
          message: msg,
        };
      }
    }

    // B. Full Delete (Entire Series or Single Item)
    // 1. Delete from schedule_events table
    try {
      const q = supabaseAdmin.from("schedule_events").delete();
      if (deleteAllSeries && seriesId) {
        await q.eq("series_id", seriesId);
      } else {
        await q.eq("id", id);
      }
    } catch {}

    // 2. Delete from schedules table
    try {
      await supabaseAdmin.from("schedules").delete().eq("id", id);
    } catch {}

    // 3. Delete from extended storage
    const updatedList = currentList.filter((item) => {
      if (deleteAllSeries && seriesId) {
        return item.seriesId !== seriesId;
      }
      return item.id !== id;
    });

    await saveStoredExtendedSchedules(updatedList);
    revalidatePublicPages();

    return {
      success: true,
      message: deleteAllSeries
        ? "Цялата серия от занятия беше изтрита!"
        : "Занятието е изтрито успешно!",
    };
  } catch (err: unknown) {
    console.error("Delete schedule exception:", err);
    return { success: false, message: "Грешка при изтриване на занятие." };
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

    return {
      success: true,
      message: "Файлът за графика е премахнат успешно!",
    };
  } catch (err: unknown) {
    console.error("Delete schedule file exception:", err);
    return { success: false, message: "Грешка при изтриване на файла." };
  }
}