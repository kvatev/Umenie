import React from "react";
import { Metadata } from "next";
import { ScheduleTable } from "@/components/admin/ScheduleTable";
import { ScheduleRecord } from "@/components/admin/ScheduleModal";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { DEFAULT_SCHEDULES } from "@/lib/schedule-data";
import { getSiteSettings } from "@/lib/site-settings";

export const metadata: Metadata = {
  title: "Управление на график | Административен панел",
};

export const dynamic = "force-dynamic";

export default async function AdminSchedulePage() {
  const settings = await getSiteSettings();
  let schedules: ScheduleRecord[] = [];

  try {
    const { data, error } = await supabaseAdmin
      .from("schedules")
      .select("*")
      .order("day_of_week", { ascending: true })
      .order("start_time", { ascending: true });

    if (error || !data || data.length === 0) {
      // Fallback for initial demo setup
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
      schedules = data as ScheduleRecord[];
    }
  } catch (err) {
    console.error("Schedule page fetch error:", err);
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <span className="text-xs font-bold text-brand-purple uppercase tracking-wider">
          Календар и програма
        </span>
        <h1 className="font-heading font-bold text-2xl sm:text-3xl text-brand-dark mt-1">
          Управление на седмичния график
        </h1>
        <p className="text-brand-muted text-xs sm:text-sm font-sans mt-0.5">
          Качвайте актуален графичен файл (PDF/снимка) или управлявайте часовете ред по ред в таблицата.
        </p>
      </div>

      {/* Schedule Table Component with File Upload */}
      <ScheduleTable
        initialSchedules={schedules}
        initialScheduleFileUrl={settings.scheduleFileUrl || ""}
        initialScheduleFileName={settings.scheduleFileName || ""}
      />
    </div>
  );
}
