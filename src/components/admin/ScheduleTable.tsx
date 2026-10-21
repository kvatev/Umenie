"use client";

import React, { useState, useEffect, useTransition, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Plus,
  Edit2,
  Trash2,
  Clock,
  MapPin,
  Loader2,
  CheckCircle2,
  EyeOff,
  Eye,
  ExternalLink,
  CalendarDays,
  Table as TableIcon,
  Sparkles,
  FileText,
  Download,
  FileUp,
  Upload,
  ChevronLeft,
  ChevronRight,
  Calendar,
  AlertCircle,
  X,
  Repeat,
  Layers,
  ChevronDown,
} from "lucide-react";
import {
  DAYS_OF_WEEK,
  CATEGORY_STYLES,
  formatDateKey,
  parseDateKey,
  getDayOfWeekNumber,
  formatDateHumanBg,
  isEventOnDate,
  getRecurrenceHumanSummary,
  itemToRecord,
} from "@/lib/schedule-data";
import { getActivityIcon } from "@/lib/schedule-icons";
import {
  getSchedulesAction,
  toggleScheduleActiveAction,
  deleteScheduleAction,
  uploadScheduleFileAction,
  deleteScheduleFileAction,
} from "@/actions/admin-schedules";
import { ScheduleModal, ScheduleRecord } from "./ScheduleModal";
import { cn } from "@/lib/utils";

interface ScheduleTableProps {
  initialSchedules: ScheduleRecord[];
  initialScheduleFileUrl?: string;
  initialScheduleFileName?: string;
}

const MONTH_NAMES = [
  "Януари",
  "Февруари",
  "Март",
  "Април",
  "Май",
  "Юни",
  "Юли",
  "Август",
  "Септември",
  "Октомври",
  "Ноември",
  "Декември",
];

const WEEKDAY_NAMES_BG = [
  "Понеделник",
  "Вторник",
  "Сряда",
  "Четвъртък",
  "Петък",
  "Събота",
  "Неделя",
];

const WEEKDAY_SHORTS_BG = ["Пон", "Вто", "Сря", "Чет", "Пет", "Съб", "Нед"];

function getDayName(dayNumber: number): string {
  return DAYS_OF_WEEK.find((d) => d.dayNumber === dayNumber)?.name || `Ден ${dayNumber}`;
}

function getCategoryDotColor(category: string): string {
  switch (category) {
    case "english":
      return "bg-blue-500";
    case "math":
      return "bg-emerald-500";
    case "chess":
      return "bg-purple-600";
    case "art":
      return "bg-amber-500";
    case "knitting":
      return "bg-pink-500";
    case "stem":
      return "bg-indigo-500";
    case "reading":
      return "bg-rose-500";
    default:
      return "bg-brand-purple";
  }
}

export function ScheduleTable({
  initialSchedules,
  initialScheduleFileUrl = "",
  initialScheduleFileName = "",
}: ScheduleTableProps) {
  const [schedules, setSchedules] = useState<ScheduleRecord[]>(initialSchedules);

  useEffect(() => {
    setSchedules(initialSchedules);
  }, [initialSchedules]);
  const [scheduleFileUrl, setScheduleFileUrl] = useState<string>(initialScheduleFileUrl);
  const [scheduleFileName, setScheduleFileName] = useState<string>(initialScheduleFileName);
  const [selectedScheduleFile, setSelectedScheduleFile] = useState<File | null>(null);
  const [scheduleFileMessage, setScheduleFileMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // View modes: "calendar" (interactive month view) | "snippet" (live weekly) | "table" (data table)
  const [viewMode, setViewMode] = useState<"calendar" | "snippet" | "table">("calendar");

  // Day filter for snippet / table
  const [activeDayFilter, setActiveDayFilter] = useState<number>(0); // 0 = All

  // Calendar navigator state
  const [currentNavDate, setCurrentNavDate] = useState(() => new Date());
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<Date>(() => new Date());
  const [dayPreviewOpen, setDayPreviewOpen] = useState(false);

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<ScheduleRecord | null>(null);
  const [modalInitialDate, setModalInitialDate] = useState<string | null>(null);

  // Delete confirmation dialog state (for series vs single)
  const [deleteDialogItem, setDeleteDialogItem] = useState<ScheduleRecord | null>(null);

  // Action / Transition states
  const [activeActionId, setActiveActionId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const today = useMemo(() => new Date(), []);
  const todayKey = formatDateKey(today);

  const currentYear = currentNavDate.getFullYear();
  const currentMonth = currentNavDate.getMonth();

  // Calendar month navigation
  const handlePrevMonth = () => {
    setCurrentNavDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentNavDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const handlePrevYear = () => {
    setCurrentNavDate((prev) => new Date(prev.getFullYear() - 1, prev.getMonth(), 1));
  };

  const handleNextYear = () => {
    setCurrentNavDate((prev) => new Date(prev.getFullYear() + 1, prev.getMonth(), 1));
  };

  const handleJumpToToday = () => {
    const now = new Date();
    setCurrentNavDate(new Date(now.getFullYear(), now.getMonth(), 1));
    setSelectedCalendarDate(now);
    setDayPreviewOpen(true);
  };

  const handleSelectYear = (year: number) => {
    setCurrentNavDate(new Date(year, currentMonth, 1));
  };

  const handleSelectMonth = (monthIndex: number) => {
    setCurrentNavDate(new Date(currentYear, monthIndex, 1));
  };

  // Generate calendar grid cells (35 or 42 cells)
  const calendarCells = useMemo(() => {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const totalDays = lastDay.getDate();

    let startDow = firstDay.getDay(); // 0 = Sun
    startDow = startDow === 0 ? 7 : startDow;

    const prevMonthLastDay = new Date(currentYear, currentMonth, 0).getDate();
    const cells: {
      date: Date;
      dateKey: string;
      dayNumber: number;
      isCurrentMonth: boolean;
      dayOfWeek: number;
      events: ScheduleRecord[];
    }[] = [];

    // Prev month days
    for (let i = startDow - 1; i >= 1; i--) {
      const dNum = prevMonthLastDay - i + 1;
      const d = new Date(currentYear, currentMonth - 1, dNum);
      const dow = d.getDay() === 0 ? 7 : d.getDay();
      const k = formatDateKey(d);
      const evs = schedules.filter((s) => isEventOnDate(s, d));
      cells.push({
        date: d,
        dateKey: k,
        dayNumber: dNum,
        isCurrentMonth: false,
        dayOfWeek: dow,
        events: evs,
      });
    }

    // Current month days
    for (let dNum = 1; dNum <= totalDays; dNum++) {
      const d = new Date(currentYear, currentMonth, dNum);
      const dow = d.getDay() === 0 ? 7 : d.getDay();
      const k = formatDateKey(d);
      const evs = schedules.filter((s) => isEventOnDate(s, d));
      cells.push({
        date: d,
        dateKey: k,
        dayNumber: dNum,
        isCurrentMonth: true,
        dayOfWeek: dow,
        events: evs,
      });
    }

    // Next month overflow
    const totalSlots = cells.length > 35 ? 42 : 35;
    const remaining = totalSlots - cells.length;
    for (let dNum = 1; dNum <= remaining; dNum++) {
      const d = new Date(currentYear, currentMonth + 1, dNum);
      const dow = d.getDay() === 0 ? 7 : d.getDay();
      const k = formatDateKey(d);
      const evs = schedules.filter((s) => isEventOnDate(s, d));
      cells.push({
        date: d,
        dateKey: k,
        dayNumber: dNum,
        isCurrentMonth: false,
        dayOfWeek: dow,
        events: evs,
      });
    }

    return cells;
  }, [currentYear, currentMonth, schedules]);

  // Events for selected calendar date
  const eventsForSelectedCalendarDate = useMemo(() => {
    return schedules
      .filter((s) => isEventOnDate(s, selectedCalendarDate))
      .sort((a, b) => a.start_time.localeCompare(b.start_time));
  }, [schedules, selectedCalendarDate]);

  // Click on a calendar day
  const handleDayClick = (cellDate: Date) => {
    setSelectedCalendarDate(cellDate);
    setDayPreviewOpen(true);
  };

  // Open Create Modal
  const openCreate = () => {
    setEditingSchedule(null);
    setModalInitialDate(null);
    setModalOpen(true);
  };

  // Open Create Modal for a specific date
  const openCreateForDate = (dateKey: string) => {
    setEditingSchedule(null);
    setModalInitialDate(dateKey);
    setModalOpen(true);
  };

  // Open Edit Modal
  const openEdit = (schedule: ScheduleRecord) => {
    setEditingSchedule(schedule);
    setModalInitialDate(schedule.date || null);
    setModalOpen(true);
  };

  // Toggle Visibility
  const handleToggleActive = async (id: string, current: boolean) => {
    setActiveActionId(id);
    startTransition(async () => {
      setSchedules((prev) =>
        prev.map((s) => (s.id === id ? { ...s, is_active: !current } : s))
      );

      const res = await toggleScheduleActiveAction(id, current);
      if (!res.success) {
        alert(res.message || "Грешка при промяна на видимостта.");
      }
      setActiveActionId(null);
    });
  };

  // Trigger Delete Prompt
  const promptDelete = (item: ScheduleRecord) => {
    setDeleteDialogItem(item);
  };

  // Execute Delete
  const executeDelete = async (scope: "single" | "series") => {
    if (!deleteDialogItem) return;
    const itemToDelete = deleteDialogItem;
    setDeleteDialogItem(null);
    setActiveActionId(itemToDelete.id);

    startTransition(async () => {
      // Optimistic delete
      if (scope === "series" && (itemToDelete.seriesId || itemToDelete.series_id)) {
        const sId = itemToDelete.seriesId || itemToDelete.series_id;
        setSchedules((prev) =>
          prev.filter((s) => s.id !== itemToDelete.id && s.seriesId !== sId && s.series_id !== sId)
        );
      } else {
        setSchedules((prev) => prev.filter((s) => s.id !== itemToDelete.id));
      }

      const res = await deleteScheduleAction(itemToDelete.id, scope);
      if (!res.success) {
        alert(res.message || "Грешка при изтриване.");
      }
      setActiveActionId(null);
    });
  };

  // File Upload Handlers
  const handleScheduleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedScheduleFile(e.target.files[0]);
      setScheduleFileMessage(null);
    }
  };

  const handleUploadScheduleFile = () => {
    if (!selectedScheduleFile) return;

    startTransition(async () => {
      const formData = new FormData();
      formData.append("file", selectedScheduleFile);

      const res = await uploadScheduleFileAction(formData);
      if (res.success && res.url) {
        setScheduleFileUrl(res.url);
        setScheduleFileName(res.fileName || selectedScheduleFile.name);
        setSelectedScheduleFile(null);
        setScheduleFileMessage({ type: "success", text: res.message });
      } else {
        setScheduleFileMessage({
          type: "error",
          text: res.message || "Грешка при качване на файла.",
        });
      }
    });
  };

  const handleDeleteScheduleFile = () => {
    if (
      !window.confirm("Сигурни ли сте, че искате да премахнете качения файл на седмичния график?")
    )
      return;

    startTransition(async () => {
      const res = await deleteScheduleFileAction();
      if (res.success) {
        setScheduleFileUrl("");
        setScheduleFileName("");
        setScheduleFileMessage({ type: "success", text: res.message });
      } else {
        setScheduleFileMessage({ type: "error", text: res.message || "Грешка при премахване." });
      }
    });
  };

  // Filtered list for Table / Snippet views
  const filteredSchedules = useMemo(() => {
    const list = schedules.filter((item) => {
      if (activeDayFilter === 0) return true;
      return item.day_of_week === activeDayFilter;
    });
    return list.sort((a, b) => {
      if (a.day_of_week !== b.day_of_week) {
        return a.day_of_week - b.day_of_week;
      }
      return a.start_time.localeCompare(b.start_time);
    });
  }, [schedules, activeDayFilter]);

  // Year options for quick jumper (-2 to +5 years)
  const yearOptions = useMemo(() => {
    const y = new Date().getFullYear();
    return [y - 1, y, y + 1, y + 2, y + 3];
  }, []);

  return (
    <div className="space-y-6">
      {/* 1. WEEKLY SCHEDULE FILE UPLOAD / REPLACEMENT (PDF / Image) */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl shadow-card border border-brand-purple/15 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-brand-purple/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-brand-purple/10 text-brand-purple flex items-center justify-center shrink-0">
              <FileUp className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-base sm:text-lg text-brand-dark">
                Качване на актуален файл / снимка на графика
              </h3>
              <p className="text-xs text-brand-muted">
                Качете PDF или изображение (WebP, PNG, JPG). Родителите ще могат да го изтеглят или прегледат от сайта.
              </p>
            </div>
          </div>

          <span
            className={cn(
              "px-3 py-1 rounded-full text-xs font-bold shrink-0 self-start sm:self-auto",
              scheduleFileUrl
                ? "bg-emerald-100 text-emerald-800"
                : "bg-gray-100 text-brand-muted"
            )}
          >
            {scheduleFileUrl ? "Активен качен файл" : "Няма качен файл"}
          </span>
        </div>

        {scheduleFileMessage && (
          <div
            className={cn(
              "p-3.5 rounded-2xl text-xs sm:text-sm font-medium border flex items-center gap-2",
              scheduleFileMessage.type === "success"
                ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                : "bg-red-50 text-red-800 border-red-200"
            )}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{scheduleFileMessage.text}</span>
          </div>
        )}

        {scheduleFileUrl && (
          <div className="bg-brand-purple/5 p-4 rounded-2xl border border-brand-purple/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <FileText className="w-5 h-5 text-brand-purple shrink-0" />
              <div className="min-w-0">
                <p className="font-heading font-bold text-xs sm:text-sm text-brand-dark truncate">
                  {scheduleFileName || "Седмичен график (актуален)"}
                </p>
                <p className="text-[11px] text-brand-muted">
                  Визуализира се като линк за изтегляне в страница /grafik
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <a
                href={scheduleFileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-brand-purple text-white text-xs font-bold shadow-sm hover:bg-brand-purple-hover transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Преглед / Сваляне</span>
              </a>

              <button
                type="button"
                onClick={handleDeleteScheduleFile}
                disabled={isPending}
                className="p-2 rounded-full text-red-600 hover:bg-red-50 transition-colors"
                title="Премахни файла"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        <div className="bg-brand-bg/60 p-4 rounded-2xl border border-brand-purple/10 flex flex-col sm:flex-row items-center gap-3">
          <input
            type="file"
            accept=".pdf, image/png, image/jpeg, image/webp"
            onChange={handleScheduleFileChange}
            className="block w-full text-xs text-brand-muted file:mr-4 file:py-2.5 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-heading file:font-bold file:bg-brand-purple/10 file:text-brand-purple hover:file:bg-brand-purple/20 cursor-pointer"
          />

          {selectedScheduleFile && (
            <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
              <button
                type="button"
                onClick={() => setSelectedScheduleFile(null)}
                className="px-3.5 py-2 rounded-full bg-white text-xs text-brand-dark font-bold hover:bg-gray-100 transition-colors border border-brand-purple/20"
              >
                Отказ
              </button>
              <button
                type="button"
                onClick={handleUploadScheduleFile}
                disabled={isPending}
                className="px-5 py-2 rounded-full bg-brand-purple text-white font-heading font-bold text-xs shadow-button hover:bg-brand-purple-hover transition-all flex items-center gap-1.5 disabled:opacity-70"
              >
                {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                <span>{scheduleFileUrl ? "Замени файла" : "Качи файла"}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 2. TOP TOOLBAR & VIEW MODE SWITCHER */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl shadow-card border border-brand-purple/15 flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-4">
        {/* View Switcher: Calendar / Snippet / Table */}
        <div className="flex items-center gap-1.5 bg-brand-bg p-1.5 rounded-2xl border border-brand-purple/15 overflow-x-auto">
          <button
            onClick={() => setViewMode("calendar")}
            className={cn(
              "px-4 py-2 rounded-xl font-heading text-xs font-bold transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer",
              viewMode === "calendar"
                ? "bg-brand-purple text-white shadow-button"
                : "text-brand-dark/80 hover:text-brand-purple"
            )}
          >
            <CalendarDays className="w-4 h-4" />
            <span>Интерактивен календар</span>
          </button>

          <button
            onClick={() => setViewMode("snippet")}
            className={cn(
              "px-4 py-2 rounded-xl font-heading text-xs font-bold transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer",
              viewMode === "snippet"
                ? "bg-brand-purple text-white shadow-button"
                : "text-brand-dark/80 hover:text-brand-purple"
            )}
          >
            <Sparkles className="w-4 h-4" />
            <span>Седмичен изглед</span>
          </button>

          <button
            onClick={() => setViewMode("table")}
            className={cn(
              "px-4 py-2 rounded-xl font-heading text-xs font-bold transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer",
              viewMode === "table"
                ? "bg-brand-purple text-white shadow-button"
                : "text-brand-dark/80 hover:text-brand-purple"
            )}
          >
            <TableIcon className="w-4 h-4" />
            <span>Табличен изглед ({schedules.length})</span>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 justify-end">
          <Link
            href="/grafik"
            target="_blank"
            className="px-4 py-2.5 rounded-full border border-brand-purple/20 text-brand-purple hover:bg-brand-purple/10 font-heading font-bold text-xs transition-all inline-flex items-center gap-1.5"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Преглед на живо в сайта</span>
            <span className="sm:hidden">Сайт</span>
          </Link>

          <button
            onClick={openCreate}
            className="px-5 py-2.5 rounded-full bg-brand-purple text-white font-heading font-bold text-xs sm:text-sm shadow-button hover:bg-brand-purple-hover transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Добави занятие</span>
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* VIEW 1: INTERACTIVE ADMIN CALENDAR & DAY PREVIEW POPOVER */}
      {/* ======================================================== */}
      {viewMode === "calendar" && (
        <div className="space-y-6 animate-fade-in">
          {/* Calendar Container */}
          <div className="bg-white rounded-3xl p-5 sm:p-7 shadow-card border border-brand-purple/15 space-y-6">
            {/* Calendar Month & Year Navigator */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-4 border-b border-brand-purple/10">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrevYear}
                  className="px-2.5 py-1.5 rounded-xl border border-brand-purple/20 text-brand-purple hover:bg-brand-purple/10 text-xs font-bold transition-all"
                  title="Предишна година"
                >
                  -1 г.
                </button>
                <button
                  type="button"
                  onClick={handlePrevMonth}
                  className="p-2 rounded-full bg-brand-bg hover:bg-brand-purple/15 text-brand-purple transition-all"
                  aria-label="Предишен месец"
                >
                  <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
                </button>

                {/* Month & Year Title with Selectors */}
                <div className="flex items-center gap-2">
                  <select
                    value={currentMonth}
                    onChange={(e) => handleSelectMonth(Number(e.target.value))}
                    className="font-heading font-bold text-base sm:text-xl text-brand-dark bg-transparent border-none focus:ring-2 focus:ring-brand-purple rounded-xl cursor-pointer py-1"
                  >
                    {MONTH_NAMES.map((m, idx) => (
                      <option key={idx} value={idx}>
                        {m}
                      </option>
                    ))}
                  </select>

                  <select
                    value={currentYear}
                    onChange={(e) => handleSelectYear(Number(e.target.value))}
                    className="font-heading font-bold text-base sm:text-xl text-brand-dark bg-transparent border-none focus:ring-2 focus:ring-brand-purple rounded-xl cursor-pointer py-1"
                  >
                    {yearOptions.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="button"
                  onClick={handleNextMonth}
                  className="p-2 rounded-full bg-brand-bg hover:bg-brand-purple/15 text-brand-purple transition-all"
                  aria-label="Следващ месец"
                >
                  <ChevronRight className="w-5 h-5 stroke-[2.5]" />
                </button>
                <button
                  type="button"
                  onClick={handleNextYear}
                  className="px-2.5 py-1.5 rounded-xl border border-brand-purple/20 text-brand-purple hover:bg-brand-purple/10 text-xs font-bold transition-all"
                  title="Следваща година"
                >
                  +1 г.
                </button>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleJumpToToday}
                  className="px-4 py-2 rounded-full bg-brand-purple/10 text-brand-purple hover:bg-brand-purple hover:text-white font-heading font-bold text-xs transition-all shadow-xs cursor-pointer"
                >
                  Днес
                </button>
                <span className="text-xs text-brand-muted hidden sm:inline">
                  Кликнете върху дата за бърз преглед и управление
                </span>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="border border-brand-purple/15 rounded-2xl overflow-hidden">
              {/* Day Headers */}
              <div className="grid grid-cols-7 bg-brand-purple/5 border-b border-brand-purple/15 text-center">
                {WEEKDAY_SHORTS_BG.map((d, i) => (
                  <div
                    key={i}
                    className="py-2.5 text-xs font-heading font-bold text-brand-purple uppercase tracking-wider"
                  >
                    {d}
                  </div>
                ))}
              </div>

              {/* Month Days */}
              <div className="grid grid-cols-7 divide-x divide-y divide-brand-purple/15 bg-white">
                {calendarCells.map((cell, idx) => {
                  const isToday = cell.dateKey === todayKey;
                  const isSelected = formatDateKey(selectedCalendarDate) === cell.dateKey;
                  const hasEvents = cell.events.length > 0;

                  return (
                    <div
                      key={idx}
                      onClick={() => handleDayClick(cell.date)}
                      className={cn(
                        "min-h-[90px] sm:min-h-[115px] p-2 flex flex-col justify-between transition-all cursor-pointer relative group select-none",
                        cell.isCurrentMonth
                          ? isSelected
                            ? "bg-brand-purple/10 ring-2 ring-inset ring-brand-purple"
                            : isToday
                            ? "bg-brand-purple/5 hover:bg-brand-purple/10"
                            : "bg-white hover:bg-brand-purple/[0.04]"
                          : "bg-gray-50/70 opacity-40 hover:opacity-70"
                      )}
                    >
                      {/* Day number header */}
                      <div className="flex items-center justify-between">
                        <span
                          className={cn(
                            "w-6 h-6 rounded-full flex items-center justify-center text-xs font-heading font-bold transition-all",
                            isToday
                              ? "bg-brand-purple text-white shadow-xs"
                              : isSelected
                              ? "bg-brand-purple text-white"
                              : cell.isCurrentMonth
                              ? "text-brand-dark group-hover:text-brand-purple"
                              : "text-gray-400"
                          )}
                        >
                          {cell.dayNumber}
                        </span>

                        {isToday && (
                          <span className="hidden sm:inline-block text-[9px] font-bold text-brand-purple bg-brand-purple/15 px-1.5 py-0.5 rounded-full uppercase">
                            Днес
                          </span>
                        )}

                        {hasEvents && (
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-brand-purple/15 text-brand-purple">
                            {cell.events.length}
                          </span>
                        )}
                      </div>

                      {/* Event indicators / Mini cards */}
                      <div className="mt-1 space-y-1 overflow-hidden">
                        {/* Desktop pills */}
                        <div className="hidden sm:block space-y-1">
                          {cell.events.slice(0, 2).map((ev) => (
                            <div
                              key={ev.id}
                              className={cn(
                                "text-[10px] px-1.5 py-0.5 rounded border truncate font-medium flex items-center gap-1",
                                ev.is_active
                                  ? "bg-brand-purple/5 border-brand-purple/20 text-brand-dark"
                                  : "bg-gray-100 border-dashed border-gray-300 text-gray-500 opacity-60"
                              )}
                              title={`${ev.start_time.slice(0, 5)} ${ev.title}`}
                            >
                              <span className="font-bold text-brand-purple shrink-0">
                                {ev.start_time.slice(0, 5)}
                              </span>
                              <span className="truncate">{ev.title}</span>
                            </div>
                          ))}
                          {cell.events.length > 2 && (
                            <div className="text-[9px] font-bold text-brand-purple/80 pl-1">
                              +{cell.events.length - 2} още
                            </div>
                          )}
                        </div>

                        {/* Mobile dots */}
                        <div className="flex sm:hidden items-center justify-center gap-1 flex-wrap pt-1">
                          {cell.events.slice(0, 3).map((ev) => (
                            <span
                              key={ev.id}
                              className={cn("w-1.5 h-1.5 rounded-full", getCategoryDotColor(ev.category))}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* DAY SCHEDULE POPOVER / CARD (Always visible when a day is selected) */}
          {dayPreviewOpen && (
            <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-card border-2 border-brand-purple/30 space-y-5 animate-in fade-in slide-in-from-top-4 duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-brand-purple/15">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-brand-purple text-white flex items-center justify-center shrink-0 shadow-sm">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-heading font-black text-lg sm:text-xl text-brand-dark flex items-center gap-2">
                      <span>Програма за {formatDateHumanBg(selectedCalendarDate)}</span>
                      <span className="text-xs font-normal text-brand-muted">
                        ({getDayName(getDayOfWeekNumber(selectedCalendarDate))})
                      </span>
                    </h3>
                    <p className="text-xs text-brand-muted">
                      {eventsForSelectedCalendarDate.length === 0
                        ? "Няма насрочени занятия за този ден."
                        : `Насрочени са ${eventsForSelectedCalendarDate.length} ${eventsForSelectedCalendarDate.length === 1 ? "занятие" : "занятия"}.`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => openCreateForDate(formatDateKey(selectedCalendarDate))}
                    className="px-4 py-2 rounded-full bg-brand-purple text-white font-heading font-bold text-xs shadow-button hover:bg-brand-purple-hover transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>+ Добави занятие за този ден</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDayPreviewOpen(false)}
                    className="p-2 rounded-full text-brand-muted hover:bg-brand-purple/10 hover:text-brand-purple transition-colors"
                    title="Затвори прегледа за деня"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Day Events List */}
              {eventsForSelectedCalendarDate.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {eventsForSelectedCalendarDate.map((item) => {
                    const isWorking = activeActionId === item.id && isPending;
                    const catStyle = CATEGORY_STYLES[item.category] || {
                      bg: "bg-purple-100",
                      text: "text-purple-800",
                      border: "border-purple-300",
                    };
                    const hasSeries = Boolean(item.seriesId || item.series_id || item.recurrence);

                    return (
                      <div
                        key={item.id}
                        className={cn(
                          "bg-white rounded-2xl p-5 shadow-card border-2 transition-all flex flex-col justify-between space-y-3 group",
                          item.is_active
                            ? "border-brand-purple/20 hover:border-brand-purple/50 hover:shadow-lg"
                            : "border-dashed border-gray-300 opacity-60 bg-gray-50/80"
                        )}
                      >
                        {/* Top: Time & Active Toggle */}
                        <div className="flex items-center justify-between gap-2">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-purple/10 text-brand-purple text-xs font-bold">
                            <Clock className="w-3.5 h-3.5" />
                            <span>
                              {item.start_time.slice(0, 5)} - {item.end_time.slice(0, 5)}
                            </span>
                          </span>

                          <button
                            onClick={() => handleToggleActive(item.id, item.is_active)}
                            className={cn(
                              "px-2.5 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 transition-colors cursor-pointer",
                              item.is_active
                                ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                            )}
                          >
                            {item.is_active ? (
                              <>
                                <CheckCircle2 className="w-3 h-3" />
                                <span>Активно на сайта</span>
                              </>
                            ) : (
                              <>
                                <EyeOff className="w-3 h-3" />
                                <span>Скрито</span>
                              </>
                            )}
                          </button>
                        </div>

                        {/* Title, Category & Age */}
                        <div className="flex items-start gap-3">
                          <div className="relative w-10 h-10 rounded-full overflow-hidden bg-white border border-brand-purple/20 flex items-center justify-center shrink-0 shadow-xs">
                            <Image
                              src={getActivityIcon(item.title, item.category)}
                              alt={item.title}
                              width={40}
                              height={40}
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className="font-heading font-black text-base text-brand-dark truncate">
                              {item.title}
                            </h4>
                            <div className="flex flex-wrap items-center gap-1.5 mt-1">
                              <span
                                className={cn(
                                  "px-2 py-0.5 rounded-full text-[10px] font-bold border",
                                  catStyle.bg,
                                  catStyle.text,
                                  catStyle.border
                                )}
                              >
                                {item.category}
                              </span>
                              <span className="px-2 py-0.5 rounded-full bg-brand-purple-light text-brand-purple text-[10px] font-bold">
                                {item.age_group}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Recurrence Badge if applicable */}
                        {hasSeries && (
                          <div className="bg-brand-purple/5 p-2 rounded-xl text-[11px] text-brand-dark/90 flex items-center gap-1.5 border border-brand-purple/10">
                            <Repeat className="w-3.5 h-3.5 text-brand-purple shrink-0" />
                            <span className="truncate">
                              {item.recurrence
                                ? getRecurrenceHumanSummary(item.recurrence, item.date || "")
                                : "Серия от повтарящи се занятия"}
                            </span>
                          </div>
                        )}

                        {/* Location */}
                        <div className="flex items-center gap-1 text-[11px] text-brand-muted">
                          <MapPin className="w-3.5 h-3.5 text-brand-purple shrink-0" />
                          <span className="truncate">{item.location || "Славейков, бл. 48"}</span>
                        </div>

                        {/* Card Footer Actions */}
                        <div className="pt-3 border-t border-brand-purple/10 flex items-center justify-between gap-2">
                          <span className="text-[11px] text-brand-muted">
                            {item.is_active ? "Видимо в /grafik" : "Не се вижда на сайта"}
                          </span>

                          {isWorking ? (
                            <Loader2 className="w-4 h-4 animate-spin text-brand-purple" />
                          ) : (
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => openEdit(item)}
                                className="p-2 rounded-lg bg-brand-purple/10 text-brand-purple hover:bg-brand-purple hover:text-white transition-colors cursor-pointer"
                                title="Редактирай"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => promptDelete(item)}
                                className="p-2 rounded-lg text-brand-muted hover:bg-red-100 hover:text-red-700 transition-colors cursor-pointer"
                                title="Изтрий"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-8 text-center space-y-3 bg-brand-bg/50 rounded-2xl border border-dashed border-brand-purple/20">
                  <p className="text-sm font-semibold text-brand-dark">
                    Няма планирани групови или индивидуални занятия за тази дата.
                  </p>
                  <button
                    type="button"
                    onClick={() => openCreateForDate(formatDateKey(selectedCalendarDate))}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-brand-purple text-white text-xs font-bold hover:bg-brand-purple-hover transition-colors shadow-button cursor-pointer"
                  >
                    <Plus className="w-4 h-4 stroke-[2.5]" />
                    <span>Добави първо занятие за този ден</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* VIEW 2: LIVE WEBSITE WEEKLY SNIPPET */}
      {/* ======================================================== */}
      {viewMode === "snippet" && (
        <div className="space-y-6 animate-fade-in">
          {/* Day Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setActiveDayFilter(0)}
              className={cn(
                "px-3.5 py-1.5 rounded-xl font-heading text-xs font-bold transition-all shrink-0 cursor-pointer",
                activeDayFilter === 0
                  ? "bg-brand-purple text-white shadow-sm"
                  : "bg-white text-brand-dark/80 hover:bg-brand-purple/10 border border-brand-purple/15"
              )}
            >
              Всички дни ({schedules.length})
            </button>

            {DAYS_OF_WEEK.map((day) => {
              const count = schedules.filter((s) => s.day_of_week === day.dayNumber).length;
              const isSelected = activeDayFilter === day.dayNumber;

              return (
                <button
                  key={day.dayNumber}
                  onClick={() => setActiveDayFilter(day.dayNumber)}
                  className={cn(
                    "px-3 py-1.5 rounded-xl font-heading text-xs font-bold transition-all shrink-0 flex items-center gap-1 cursor-pointer",
                    isSelected
                      ? "bg-brand-purple text-white shadow-sm"
                      : "bg-white text-brand-dark/80 hover:bg-brand-purple/10 border border-brand-purple/15"
                  )}
                >
                  <span>{day.shortName}</span>
                  <span className="text-[10px] opacity-75">({count})</span>
                </button>
              );
            })}
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-brand-purple/15 space-y-6">
            <div className="flex items-center gap-2.5 pb-3 border-b border-brand-purple/10">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <h3 className="font-heading font-bold text-base sm:text-lg text-brand-dark">
                Седмичен преглед: Как занятията се разпределят по дни
              </h3>
            </div>

            <div className="rounded-3xl border border-brand-purple/20 bg-brand-bg p-4 sm:p-6 shadow-inner space-y-6">
              {DAYS_OF_WEEK.filter((d) => activeDayFilter === 0 || d.dayNumber === activeDayFilter).map(
                (day) => {
                  const daySchedules = schedules
                    .filter((s) => s.day_of_week === day.dayNumber)
                    .sort((a, b) => a.start_time.localeCompare(b.start_time));

                  if (activeDayFilter === 0 && daySchedules.length === 0) return null;

                  return (
                    <div key={day.dayNumber} className="space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 rounded-full bg-brand-purple text-white text-xs font-heading font-bold uppercase tracking-wider">
                          {day.name}
                        </span>
                        <span className="text-xs text-brand-muted">
                          ({daySchedules.length} {daySchedules.length === 1 ? "занятие" : "занятия"})
                        </span>
                      </div>

                      {daySchedules.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {daySchedules.map((item) => {
                            const isWorking = activeActionId === item.id && isPending;
                            const catStyle = CATEGORY_STYLES[item.category] || {
                              bg: "bg-purple-100",
                              text: "text-purple-800",
                              border: "border-purple-300",
                            };

                            return (
                              <div
                                key={item.id}
                                className={cn(
                                  "relative bg-white rounded-2xl p-5 shadow-card border-2 transition-all duration-300 flex flex-col justify-between space-y-3 group",
                                  item.is_active
                                    ? "border-brand-purple/20 hover:border-brand-purple/50 hover:shadow-lg"
                                    : "border-dashed border-gray-300 opacity-60 bg-gray-50/80"
                                )}
                              >
                                <div className="flex items-center justify-between gap-2">
                                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-purple/10 text-brand-purple text-xs font-bold">
                                    <Clock className="w-3.5 h-3.5" />
                                    <span>
                                      {item.start_time.slice(0, 5)} - {item.end_time.slice(0, 5)}
                                    </span>
                                  </span>

                                  <button
                                    onClick={() => handleToggleActive(item.id, item.is_active)}
                                    className={cn(
                                      "px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 transition-colors cursor-pointer",
                                      item.is_active
                                        ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                    )}
                                  >
                                    {item.is_active ? (
                                      <>
                                        <CheckCircle2 className="w-3 h-3" />
                                        <span>Активно</span>
                                      </>
                                    ) : (
                                      <>
                                        <EyeOff className="w-3 h-3" />
                                        <span>Скрито</span>
                                      </>
                                    )}
                                  </button>
                                </div>

                                <div className="flex items-start gap-3">
                                  <div className="relative w-10 h-10 rounded-full overflow-hidden bg-white border border-brand-purple/20 flex items-center justify-center shrink-0 shadow-xs">
                                    <Image
                                      src={getActivityIcon(item.title, item.category)}
                                      alt={item.title}
                                      width={40}
                                      height={40}
                                      className="w-full h-full object-contain"
                                    />
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <h4 className="font-heading font-black text-base text-brand-dark truncate">
                                      {item.title}
                                    </h4>
                                    <div className="flex flex-wrap items-center gap-1.5 mt-1">
                                      <span
                                        className={cn(
                                          "px-2.5 py-0.5 rounded-full text-[11px] font-bold border",
                                          catStyle.bg,
                                          catStyle.text,
                                          catStyle.border
                                        )}
                                      >
                                        {item.category}
                                      </span>
                                      <span className="px-2.5 py-0.5 rounded-full bg-brand-purple-light text-brand-purple text-[11px] font-bold">
                                        {item.age_group}
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                {item.recurrence && (
                                  <div className="bg-brand-purple/5 p-2 rounded-xl text-[11px] text-brand-dark/90 flex items-center gap-1.5 border border-brand-purple/10">
                                    <Repeat className="w-3.5 h-3.5 text-brand-purple shrink-0" />
                                    <span className="truncate">
                                      {getRecurrenceHumanSummary(item.recurrence, item.date || "")}
                                    </span>
                                  </div>
                                )}

                                <div className="flex items-center gap-1 text-[11px] text-brand-muted">
                                  <MapPin className="w-3.5 h-3.5 text-brand-purple shrink-0" />
                                  <span className="truncate">{item.location || "Славейков, бл. 48"}</span>
                                </div>

                                <div className="pt-3 border-t border-brand-purple/10 flex items-center justify-between gap-2">
                                  <span className="px-3 py-1 rounded-full bg-brand-purple/10 text-brand-purple font-heading font-bold text-xs">
                                    Бутон „Запиши се“
                                  </span>

                                  {isWorking ? (
                                    <Loader2 className="w-4 h-4 animate-spin text-brand-purple" />
                                  ) : (
                                    <div className="flex items-center gap-1">
                                      <button
                                        onClick={() => openEdit(item)}
                                        className="p-1.5 rounded-lg bg-brand-purple/10 text-brand-purple hover:bg-brand-purple hover:text-white transition-colors cursor-pointer"
                                        title="Редактирай"
                                      >
                                        <Edit2 className="w-3.5 h-3.5" />
                                      </button>
                                      <button
                                        onClick={() => promptDelete(item)}
                                        className="p-1.5 rounded-lg text-brand-muted hover:bg-red-100 hover:text-red-700 transition-colors cursor-pointer"
                                        title="Изтрий"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="py-6 text-center text-xs text-brand-muted bg-white/50 rounded-2xl border border-dashed border-brand-purple/20">
                          Няма насрочени часове за {day.name}.
                        </div>
                      )}
                    </div>
                  );
                }
              )}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* VIEW 3: STANDARD DATA TABLE VIEW */}
      {/* ======================================================== */}
      {viewMode === "table" && (
        <div className="space-y-6 animate-fade-in">
          {/* Day Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setActiveDayFilter(0)}
              className={cn(
                "px-3.5 py-1.5 rounded-xl font-heading text-xs font-bold transition-all shrink-0 cursor-pointer",
                activeDayFilter === 0
                  ? "bg-brand-purple text-white shadow-sm"
                  : "bg-white text-brand-dark/80 hover:bg-brand-purple/10 border border-brand-purple/15"
              )}
            >
              Всички дни ({schedules.length})
            </button>

            {DAYS_OF_WEEK.map((day) => {
              const count = schedules.filter((s) => s.day_of_week === day.dayNumber).length;
              const isSelected = activeDayFilter === day.dayNumber;

              return (
                <button
                  key={day.dayNumber}
                  onClick={() => setActiveDayFilter(day.dayNumber)}
                  className={cn(
                    "px-3 py-1.5 rounded-xl font-heading text-xs font-bold transition-all shrink-0 flex items-center gap-1 cursor-pointer",
                    isSelected
                      ? "bg-brand-purple text-white shadow-sm"
                      : "bg-white text-brand-dark/80 hover:bg-brand-purple/10 border border-brand-purple/15"
                  )}
                >
                  <span>{day.shortName}</span>
                  <span className="text-[10px] opacity-75">({count})</span>
                </button>
              );
            })}
          </div>

          {/* Desktop Table */}
          <div className="hidden lg:block bg-white rounded-3xl shadow-card border border-brand-purple/15 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-brand-purple/15 bg-brand-purple/5 text-[11px] font-heading font-bold text-brand-purple uppercase tracking-wider">
                    <th className="py-4 px-4">Ден / Дата</th>
                    <th className="py-4 px-4">Час</th>
                    <th className="py-4 px-4">Заглавие / Клас</th>
                    <th className="py-4 px-4">Повторяемост</th>
                    <th className="py-4 px-4">Категория</th>
                    <th className="py-4 px-4">Възрастова група</th>
                    <th className="py-4 px-4 text-center">Видимост</th>
                    <th className="py-4 px-4 text-right">Действия</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-purple/10 text-xs sm:text-sm">
                  {filteredSchedules.map((item) => {
                    const isWorking = activeActionId === item.id && isPending;
                    const catStyle = CATEGORY_STYLES[item.category] || {
                      bg: "bg-purple-100",
                      text: "text-purple-800",
                      border: "border-purple-300",
                    };

                    return (
                      <tr
                        key={item.id}
                        className={cn(
                          "hover:bg-brand-bg/60 transition-colors",
                          !item.is_active && "opacity-60 bg-gray-50/50"
                        )}
                      >
                        <td className="py-4 px-4 font-bold text-brand-purple whitespace-nowrap">
                          <div>{getDayName(item.day_of_week)}</div>
                          {item.date && (
                            <div className="text-[11px] text-brand-muted font-normal">
                              {item.date}
                            </div>
                          )}
                        </td>

                        <td className="py-4 px-4 whitespace-nowrap">
                          <span className="inline-flex items-center gap-1.5 font-semibold text-brand-dark">
                            <Clock className="w-3.5 h-3.5 text-brand-purple/70" />
                            {item.start_time.slice(0, 5)} - {item.end_time.slice(0, 5)}
                          </span>
                        </td>

                        <td className="py-4 px-4 font-bold text-brand-dark">
                          <div className="flex items-center gap-2">
                            <div className="relative w-6 h-6 rounded-full overflow-hidden bg-white border border-brand-purple/20 shrink-0">
                              <Image
                                src={getActivityIcon(item.title, item.category)}
                                alt=""
                                width={24}
                                height={24}
                                className="w-full h-full object-contain"
                              />
                            </div>
                            <span>{item.title}</span>
                          </div>
                        </td>

                        <td className="py-4 px-4 whitespace-nowrap text-xs text-brand-dark/80">
                          {item.recurrence ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-brand-purple/10 text-brand-purple text-[11px] font-semibold">
                              <Repeat className="w-3 h-3" />
                              <span>{getRecurrenceHumanSummary(item.recurrence, item.date || "")}</span>
                            </span>
                          ) : (
                            <span className="text-brand-muted">Ежеседмично</span>
                          )}
                        </td>

                        <td className="py-4 px-4 whitespace-nowrap">
                          <span
                            className={cn(
                              "px-2.5 py-1 rounded-full text-xs font-bold border",
                              catStyle.bg,
                              catStyle.text,
                              catStyle.border
                            )}
                          >
                            {item.category}
                          </span>
                        </td>

                        <td className="py-4 px-4 text-brand-muted whitespace-nowrap">
                          {item.age_group}
                        </td>

                        <td className="py-4 px-4 text-center whitespace-nowrap">
                          <button
                            onClick={() => handleToggleActive(item.id, item.is_active)}
                            className={cn(
                              "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer",
                              item.is_active
                                ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                            )}
                          >
                            {item.is_active ? (
                              <>
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Активно</span>
                              </>
                            ) : (
                              <>
                                <EyeOff className="w-3.5 h-3.5" />
                                <span>Скрито</span>
                              </>
                            )}
                          </button>
                        </td>

                        <td className="py-4 px-4 text-right whitespace-nowrap">
                          {isWorking ? (
                            <Loader2 className="w-5 h-5 animate-spin text-brand-purple inline-block" />
                          ) : (
                            <div className="inline-flex items-center gap-1.5">
                              <button
                                onClick={() => openEdit(item)}
                                className="p-2 rounded-xl bg-brand-purple/10 text-brand-purple hover:bg-brand-purple hover:text-white transition-colors cursor-pointer"
                                title="Редактирай"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>

                              <button
                                onClick={() => promptDelete(item)}
                                className="p-2 rounded-xl text-brand-muted hover:bg-red-100 hover:text-red-700 transition-colors cursor-pointer"
                                title="Изтрий"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {filteredSchedules.length === 0 && (
              <div className="py-16 text-center space-y-2">
                <p className="text-brand-dark font-heading font-bold text-base">
                  Няма намерени часове за този филтър
                </p>
                <p className="text-xs text-brand-muted">
                  Кликнете на „Добави занятие“, за да създадете нов час в графика.
                </p>
              </div>
            )}
          </div>

          {/* Mobile Cards for Table View */}
          <div className="lg:hidden space-y-4">
            {filteredSchedules.map((item) => {
              const isWorking = activeActionId === item.id && isPending;

              return (
                <div
                  key={item.id}
                  className={cn(
                    "bg-white p-5 rounded-3xl shadow-card border border-brand-purple/15 space-y-3",
                    !item.is_active && "opacity-75 bg-gray-50/50"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-heading font-bold text-xs text-brand-purple">
                      {getDayName(item.day_of_week)} {item.date && `(${item.date})`}
                    </span>
                    <span className="text-xs font-semibold text-brand-dark flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-brand-purple" />
                      {item.start_time.slice(0, 5)} - {item.end_time.slice(0, 5)}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-heading font-bold text-base text-brand-dark">
                      {item.title}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-semibold text-brand-muted">
                        {item.age_group}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-purple-light text-brand-purple">
                        {item.category}
                      </span>
                    </div>
                  </div>

                  {item.recurrence && (
                    <div className="text-[11px] text-brand-muted flex items-center gap-1">
                      <Repeat className="w-3 h-3 text-brand-purple" />
                      <span>{getRecurrenceHumanSummary(item.recurrence, item.date || "")}</span>
                    </div>
                  )}

                  <div className="pt-3 border-t border-brand-purple/10 flex items-center justify-between gap-2">
                    <button
                      onClick={() => handleToggleActive(item.id, item.is_active)}
                      className={cn(
                        "px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5",
                        item.is_active
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-gray-200 text-gray-700"
                      )}
                    >
                      {item.is_active ? "Активно" : "Скрито"}
                    </button>

                    {isWorking ? (
                      <Loader2 className="w-5 h-5 animate-spin text-brand-purple" />
                    ) : (
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => openEdit(item)}
                          className="p-2 rounded-xl bg-brand-purple/10 text-brand-purple hover:bg-brand-purple hover:text-white transition-colors"
                          title="Редактирай"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => promptDelete(item)}
                          className="p-2 rounded-xl text-brand-muted hover:bg-red-100 hover:text-red-700 transition-colors"
                          title="Изтрий"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. MODAL: CREATE / EDIT SCHEDULE */}
      <ScheduleModal
        isOpen={modalOpen}
        scheduleToEdit={editingSchedule}
        allSchedules={schedules}
        initialDate={modalInitialDate}
        onClose={() => setModalOpen(false)}
        onSaved={async (savedItems) => {
          if (savedItems && savedItems.length > 0) {
            setSchedules((prev) => {
              const newIds = new Set(savedItems.map((item) => item.id));
              const filtered = prev.filter((item) => !newIds.has(item.id));
              return [...filtered, ...savedItems];
            });
          }
          try {
            const fresh = await getSchedulesAction();
            if (fresh && fresh.length > 0) {
              setSchedules(fresh.map(itemToRecord));
            }
          } catch {}
        }}
      />

      {/* 5. MODAL: DELETE CONFIRMATION DIALOG (SINGLE vs SERIES) */}
      {deleteDialogItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-dark/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl border border-brand-purple/20 space-y-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                <Trash2 className="w-6 h-6" />
              </div>
              <div className="min-w-0">
                <h3 className="font-heading font-black text-lg text-brand-dark">
                  Изтриване на занятие
                </h3>
                <p className="text-xs text-brand-muted mt-1">
                  Сигурни ли сте, че искате да изтриете „<strong className="text-brand-dark">{deleteDialogItem.title}</strong>“?
                </p>
              </div>
            </div>

            {/* Check if item belongs to a recurring series */}
            {deleteDialogItem.seriesId || deleteDialogItem.series_id || deleteDialogItem.recurrence ? (
              <div className="space-y-3">
                <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
                  <span>
                    Това занятие е част от повтаряща се серия. Изберете обхвата на изтриване:
                  </span>
                </div>

                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => executeDelete("single")}
                    className="w-full py-2.5 px-4 rounded-2xl border-2 border-brand-purple/30 text-brand-dark font-heading font-bold text-xs sm:text-sm hover:bg-brand-purple/10 hover:border-brand-purple transition-all text-left flex items-center justify-between cursor-pointer"
                  >
                    <span>Само това занятие (на тази дата)</span>
                    <span className="text-[10px] text-brand-muted">1 занятие</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => executeDelete("series")}
                    className="w-full py-2.5 px-4 rounded-2xl bg-red-600 text-white font-heading font-bold text-xs sm:text-sm hover:bg-red-700 shadow-sm transition-all text-left flex items-center justify-between cursor-pointer"
                  >
                    <span>Всички занятия от тази серия</span>
                    <span className="text-[10px] text-white/80">Цялата серия</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setDeleteDialogItem(null)}
                  className="w-full py-2 text-center text-xs font-bold text-brand-muted hover:text-brand-dark cursor-pointer"
                >
                  Отказ
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setDeleteDialogItem(null)}
                  className="px-4 py-2.5 rounded-full border border-gray-300 text-brand-dark font-bold text-xs hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  Отказ
                </button>

                <button
                  type="button"
                  onClick={() => executeDelete("single")}
                  className="px-5 py-2.5 rounded-full bg-red-600 text-white font-heading font-bold text-xs hover:bg-red-700 shadow-button transition-colors cursor-pointer"
                >
                  Изтрий
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
