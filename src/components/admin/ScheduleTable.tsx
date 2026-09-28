"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
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
} from "lucide-react";
import { DAYS_OF_WEEK, CATEGORY_STYLES } from "@/lib/schedule-data";

function getDayName(dayNumber: number): string {
  return DAYS_OF_WEEK.find((d) => d.dayNumber === dayNumber)?.name || `Ден ${dayNumber}`;
}
import {
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

export function ScheduleTable({
  initialSchedules,
  initialScheduleFileUrl = "",
  initialScheduleFileName = "",
}: ScheduleTableProps) {
  const [schedules, setSchedules] = useState<ScheduleRecord[]>(initialSchedules);
  const [scheduleFileUrl, setScheduleFileUrl] = useState<string>(initialScheduleFileUrl);
  const [scheduleFileName, setScheduleFileName] = useState<string>(initialScheduleFileName);
  const [selectedScheduleFile, setSelectedScheduleFile] = useState<File | null>(null);
  const [scheduleFileMessage, setScheduleFileMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [activeDayFilter, setActiveDayFilter] = useState<number>(0); // 0 = All
  const [viewMode, setViewMode] = useState<"snippet" | "table">("snippet"); // default to live snippet
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<ScheduleRecord | null>(null);
  const [activeActionId, setActiveActionId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Filtered list
  const filtered = schedules.filter((item) => {
    if (activeDayFilter === 0) return true;
    return item.day_of_week === activeDayFilter;
  });

  // Sort by day and time
  filtered.sort((a, b) => {
    if (a.day_of_week !== b.day_of_week) {
      return a.day_of_week - b.day_of_week;
    }
    return a.start_time.localeCompare(b.start_time);
  });

  const handleToggleActive = async (id: string, current: boolean) => {
    setActiveActionId(id);
    startTransition(async () => {
      // Optimistic update
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

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Сигурни ли сте, че искате да изтриете занятието „${title}“?`)) {
      return;
    }

    setActiveActionId(id);
    startTransition(async () => {
      setSchedules((prev) => prev.filter((s) => s.id !== id));

      const res = await deleteScheduleAction(id);
      if (!res.success) {
        alert(res.message || "Грешка при изтриване.");
      }
      setActiveActionId(null);
    });
  };

  const openCreate = () => {
    setEditingSchedule(null);
    setModalOpen(true);
  };

  const openEdit = (schedule: ScheduleRecord) => {
    setEditingSchedule(schedule);
    setModalOpen(true);
  };

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
        setScheduleFileMessage({ type: "error", text: res.message || "Грешка при качване на файла." });
      }
    });
  };

  const handleDeleteScheduleFile = () => {
    if (!window.confirm("Сигурни ли сте, че искате да премахнете качения файл на седмичния график?")) return;

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

        {/* Feedback message */}
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

        {/* Current File Banner if exists */}
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

        {/* Upload form */}
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

      {/* View Mode Switcher + Add Button */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl shadow-card border border-brand-purple/15 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* View Toggle */}
        <div className="flex items-center gap-2 bg-brand-bg p-1.5 rounded-2xl border border-brand-purple/15 w-full md:w-auto">
          <button
            onClick={() => setViewMode("snippet")}
            className={cn(
              "flex-1 md:flex-initial px-4 py-2 rounded-xl font-heading text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer",
              viewMode === "snippet"
                ? "bg-brand-purple text-white shadow-button"
                : "text-brand-dark/80 hover:text-brand-purple"
            )}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Отрязък от сайта на живо</span>
          </button>

          <button
            onClick={() => setViewMode("table")}
            className={cn(
              "flex-1 md:flex-initial px-4 py-2 rounded-xl font-heading text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer",
              viewMode === "table"
                ? "bg-brand-purple text-white shadow-button"
                : "text-brand-dark/80 hover:text-brand-purple"
            )}
          >
            <TableIcon className="w-3.5 h-3.5" />
            <span>Табличен изглед ({schedules.length})</span>
          </button>
        </div>

        {/* Day Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
          <button
            onClick={() => setActiveDayFilter(0)}
            className={cn(
              "px-3.5 py-1.5 rounded-xl font-heading text-xs font-bold transition-all shrink-0 cursor-pointer",
              activeDayFilter === 0
                ? "bg-brand-purple text-white shadow-sm"
                : "bg-brand-bg text-brand-dark/80 hover:bg-brand-purple/10"
            )}
          >
            Всички ({schedules.length})
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
                    : "bg-brand-bg text-brand-dark/80 hover:bg-brand-purple/10"
                )}
              >
                <span>{day.shortName}</span>
                <span className="text-[10px] opacity-75">({count})</span>
              </button>
            );
          })}
        </div>

        {/* Add Button */}
        <button
          onClick={openCreate}
          className="w-full md:w-auto px-5 py-2.5 rounded-full bg-brand-purple text-white font-heading font-bold text-xs sm:text-sm shadow-button hover:bg-brand-purple-hover transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Добави занятие</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* VIEW 1: LIVE WEBSITE SCHEDULE SNIPPET */}
      {/* ======================================================== */}
      {viewMode === "snippet" && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-brand-purple/15 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-brand-purple/10">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <h3 className="font-heading font-bold text-base sm:text-lg text-brand-dark">
                  Отрязък на живо: Как родителите и учениците виждат графика на сайта (/grafik)
                </h3>
              </div>
              <Link
                href="/grafik"
                target="_blank"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-purple hover:underline"
              >
                <span>Отвори страницата с графика в сайта</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Live Calendar Cards Grid */}
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
                                {/* Active Status Tag */}
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

                                {/* Class Title and Age */}
                                <div>
                                  <h4 className="font-heading font-black text-lg text-brand-dark">
                                    {item.title}
                                  </h4>
                                  <div className="flex flex-wrap items-center gap-2 mt-2">
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

                                <div className="flex items-center gap-1 text-[11px] text-brand-muted">
                                  <MapPin className="w-3.5 h-3.5 text-brand-purple shrink-0" />
                                  <span className="truncate">{item.location}</span>
                                </div>

                                {/* Website CTA Button Preview & Admin Controls */}
                                <div className="pt-3 border-t border-brand-purple/10 flex items-center justify-between gap-2">
                                  <span className="px-3 py-1.5 rounded-full bg-brand-purple/10 text-brand-purple font-heading font-bold text-xs">
                                    Бутон „Запиши се“
                                  </span>

                                  {isWorking ? (
                                    <Loader2 className="w-4 h-4 animate-spin text-brand-purple" />
                                  ) : (
                                    <div className="flex items-center gap-1">
                                      <button
                                        onClick={() => openEdit(item)}
                                        className="p-1.5 rounded-lg bg-brand-purple/10 text-brand-purple hover:bg-brand-purple hover:text-white transition-colors"
                                        title="Редактирай часа"
                                      >
                                        <Edit2 className="w-3.5 h-3.5" />
                                      </button>
                                      <button
                                        onClick={() => handleDelete(item.id, item.title)}
                                        className="p-1.5 rounded-lg text-brand-muted hover:bg-red-100 hover:text-red-700 transition-colors"
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
      {/* VIEW 2: STANDARD MANAGEMENT TABLE */}
      {/* ======================================================== */}
      {viewMode === "table" && (
        <div className="space-y-6 animate-fade-in">
          {/* DESKTOP TABLE */}
          <div className="hidden lg:block bg-white rounded-3xl shadow-card border border-brand-purple/15 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-brand-purple/15 bg-brand-purple/5 text-[11px] font-heading font-bold text-brand-purple uppercase tracking-wider">
                    <th className="py-4 px-4">Ден</th>
                    <th className="py-4 px-4">Час</th>
                    <th className="py-4 px-4">Заглавие / Клас</th>
                    <th className="py-4 px-4">Категория</th>
                    <th className="py-4 px-4">Възрастова група</th>
                    <th className="py-4 px-4 text-center">Видимост</th>
                    <th className="py-4 px-4 text-right">Действия</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-purple/10 text-xs sm:text-sm">
                  {filtered.map((item) => {
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
                        {/* Day */}
                        <td className="py-4 px-4 font-bold text-brand-purple whitespace-nowrap">
                          {getDayName(item.day_of_week)}
                        </td>

                        {/* Time */}
                        <td className="py-4 px-4 whitespace-nowrap">
                          <span className="inline-flex items-center gap-1.5 font-semibold text-brand-dark">
                            <Clock className="w-3.5 h-3.5 text-brand-purple/70" />
                            {item.start_time.slice(0, 5)} - {item.end_time.slice(0, 5)}
                          </span>
                        </td>

                        {/* Title */}
                        <td className="py-4 px-4 font-bold text-brand-dark">
                          {item.title}
                        </td>

                        {/* Category Badge */}
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

                        {/* Age Group */}
                        <td className="py-4 px-4 text-brand-muted whitespace-nowrap">
                          {item.age_group}
                        </td>

                        {/* Active Toggle */}
                        <td className="py-4 px-4 text-center whitespace-nowrap">
                          <button
                            onClick={() => handleToggleActive(item.id, item.is_active)}
                            className={cn(
                              "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer",
                              item.is_active
                                ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                            )}
                            title="Кликнете за превключване на видимостта в сайта"
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

                        {/* Actions */}
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
                                onClick={() => handleDelete(item.id, item.title)}
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

            {filtered.length === 0 && (
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

          {/* MOBILE CARDS */}
          <div className="lg:hidden space-y-4">
            {filtered.map((item) => {
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
                      {getDayName(item.day_of_week)}
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
                          onClick={() => handleDelete(item.id, item.title)}
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

            {filtered.length === 0 && (
              <div className="bg-white rounded-3xl p-8 text-center space-y-2 border border-brand-purple/15">
                <p className="text-brand-dark font-heading font-bold text-sm">
                  Няма намерени часове
                </p>
                <p className="text-xs text-brand-muted">
                  Кликнете на бутона горе, за да добавите час в графика.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal Component */}
      <ScheduleModal
        isOpen={modalOpen}
        scheduleToEdit={editingSchedule}
        onClose={() => setModalOpen(false)}
        onSaved={() => {
          window.location.reload();
        }}
      />
    </div>
  );
}
