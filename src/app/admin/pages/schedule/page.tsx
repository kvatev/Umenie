import React from "react";
import { Metadata } from "next";
import { ScheduleTable } from "@/components/admin/ScheduleTable";
import { ScheduleRecord } from "@/components/admin/ScheduleModal";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { DEFAULT_SCHEDULES, deduceCategory } from "@/lib/schedule-data";
import { getSiteSettings } from "@/lib/site-settings";

export const metadata: Metadata = {
  title: "Календар и График | Административен панел",
};

export const dynamic = "force-dynamic";

export default async function AdminPagesSchedulePage() {
  const settings = await getSiteSettings();
  let schedules: ScheduleRecord[] = [];

  try {
    // 1. Try schedule_events first (schema requirement)
    const { data: eventData, error: eventErr } = await supabaseAdmin
      .from("schedule_events")
      .select("*")
      .order("day_of_week", { ascending: true })
      .order("start_time", { ascending: true });

    if (!eventErr && eventData && eventData.length > 0) {
      schedules = eventData.map((row) => ({
        id: row.id,
        title: row.title,
        category: row.category || deduceCategory(row.title),
        day_of_week: row.day_of_week,
        start_time: row.start_time,
        end_time: row.end_time,
        age_group: row.age_group || "",
        location: row.location || "Славейков, блок 48, партер",
        capacity: row.capacity || 10,
        is_active: row.is_active ?? true,
      }));
    } else {
      // 2. Fallback to schedules table
      const { data, error } = await supabaseAdmin
        .from("schedules")
        .select("*")
        .order("day_of_week", { ascending: true })
        .order("start_time", { ascending: true });

      if (error || !data || data.length === 0) {
        schedules = DEFAULT_SCHEDULES.map((s) => ({
          id: s.id,
          title: s.title,
          category: s.category,
          day_of_week: s.dayOfWeek,
          start_time: s.startTime,
          end_time: s.endTime,
          age_group: s.ageGroup,
          location: s.location,
          is_active: true,
        }));
      } else {
        schedules = data.map((row) => ({
          id: row.id,
          title: row.title,
          category: row.category || deduceCategory(row.title),
          day_of_week: row.day_of_week,
          start_time: row.start_time,
          end_time: row.end_time,
          age_group: row.age_group || "",
          location: row.location || "Славейков, блок 48, партер",
          capacity: row.capacity || 10,
          is_active: row.is_active ?? true,
        }));
      }
    }
  } catch (err) {
    console.error("Error fetching schedules:", err);
    schedules = DEFAULT_SCHEDULES.map((s) => ({
      id: s.id,
      title: s.title,
      category: s.category,
      day_of_week: s.dayOfWeek,
      start_time: s.startTime,
      end_time: s.endTime,
      age_group: s.ageGroup,
      location: s.location,
      is_active: true,
    }));
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <span className="text-xs font-bold text-brand-purple uppercase tracking-wider">
          Редактор на съдържание
        </span>
        <h1 className="font-heading font-bold text-2xl sm:text-3xl text-brand-dark mt-1">
          Календар и Седмичен график
        </h1>
        <p className="text-brand-muted text-xs sm:text-sm font-sans mt-0.5">
          Добавяйте, редактирайте или скривайте часове от седмичната програма и качете официален график файл.
        </p>
      </div>

      <ScheduleTable
        initialSchedules={schedules}
        initialScheduleFileUrl={settings.scheduleFileUrl || ""}
        initialScheduleFileName={settings.scheduleFileName || ""}
      />
    </div>
  );
}
