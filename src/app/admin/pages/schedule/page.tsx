import React from "react";
import { Metadata } from "next";
import { ScheduleTable } from "@/components/admin/ScheduleTable";
import { ScheduleRecord } from "@/components/admin/ScheduleModal";
import { getSchedulesAction } from "@/actions/admin-schedules";
import { getSiteSettings } from "@/lib/site-settings";
import { itemToRecord } from "@/lib/schedule-data";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Календар и График | Административен панел",
};

export default async function AdminPagesSchedulePage() {
  const [settings, scheduleItems] = await Promise.all([
    getSiteSettings(),
    getSchedulesAction(),
  ]);

  const schedules: ScheduleRecord[] = (scheduleItems || []).map(itemToRecord);

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
          Управлявайте часовете от календара и седмичната програма, настройте повторяемост и качете актуален файл на графика.
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
