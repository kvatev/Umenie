"use client";

import React, { useState, useEffect, useMemo } from "react";
import { X, Loader2, Calendar, Clock, AlertCircle, Info, Check, Plus } from "lucide-react";
import {
  DAYS_OF_WEEK,
  RecurrenceRule,
  RecurrenceType,
  ScheduleItem,
  formatDateKey,
  parseDateKey,
  getDayOfWeekNumber,
  formatDateHumanBg,
  isEventOnDate,
  getRecurrenceHumanSummary,
  itemToRecord,
  CATEGORY_STYLES,
} from "@/lib/schedule-data";
import {
  createScheduleAction,
  updateScheduleAction,
  ScheduleFormData,
} from "@/actions/admin-schedules";

export interface ScheduleRecord {
  id: string;
  title: string;
  titleEn?: string;
  title_en?: string;
  category: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  age_group: string;
  location?: string;
  capacity?: number;
  is_active: boolean;
  date?: string | null;
  recurrence?: RecurrenceRule | null;
  seriesId?: string | null;
  series_id?: string | null;
  excludedDates?: string[];
  excluded_dates?: string[];
}

interface ScheduleModalProps {
  isOpen: boolean;
  scheduleToEdit: ScheduleRecord | null;
  allSchedules?: ScheduleRecord[];
  initialDate?: string | null; // e.g. clicked date in calendar
  onClose: () => void;
  onSaved: (savedItems?: ScheduleRecord[]) => void;
}

const CATEGORIES = [
  { value: "art", label: "Арт занимания и рисуване" },
  { value: "knitting", label: "Плетиво и приложни изкуства" },
  { value: "chess", label: "Шахмат" },
  { value: "reading", label: "Читателски клуб „Лигериа“" },
  { value: "math", label: "Математика (Уроци и курсове)" },
  { value: "english", label: "Английски език (Уроци и курсове)" },
  { value: "study_hall", label: "Учебна занималня" },
  { value: "stem", label: "STEM клуб" },
];

export function ScheduleModal({
  isOpen,
  scheduleToEdit,
  allSchedules = [],
  initialDate,
  onClose,
  onSaved,
}: ScheduleModalProps) {
  const isEditing = Boolean(scheduleToEdit);

  // Form states
  const [title, setTitle] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [category, setCategory] = useState("art");
  const [startDateStr, setStartDateStr] = useState<string>(() => formatDateKey(new Date()));
  const [dayOfWeek, setDayOfWeek] = useState<number>(1);
  const [additionalDays, setAdditionalDays] = useState<number[]>([]);
  const [startTime, setStartTime] = useState("16:00");
  const [endTime, setEndTime] = useState("17:30");
  const [ageGroup, setAgeGroup] = useState("6-10 години");
  const [location, setLocation] = useState("Славейков, блок 48, партер");
  const [capacity, setCapacity] = useState<number>(10);
  const [isActive, setIsActive] = useState(true);

  // Recurrence states
  const [recurrenceType, setRecurrenceType] = useState<RecurrenceType>("none");
  const [recurrenceCount, setRecurrenceCount] = useState<number>(2);
  const [untilDateStr, setUntilDateStr] = useState<string>("");
  const [biweeklySpan, setBiweeklySpan] = useState<"eoy" | "count" | "until">("eoy");

  // Edit scope (single vs series)
  const [editScope, setEditScope] = useState<"single" | "series">("series");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Synchronize on open / edit
  useEffect(() => {
    if (!isOpen) return;

    if (scheduleToEdit) {
      setTitle(scheduleToEdit.title);
      setTitleEn(scheduleToEdit.titleEn || (scheduleToEdit as any).title_en || "");
      setCategory(scheduleToEdit.category);
      setDayOfWeek(scheduleToEdit.day_of_week);
      setStartTime(scheduleToEdit.start_time.slice(0, 5));
      setEndTime(scheduleToEdit.end_time.slice(0, 5));
      setAgeGroup(scheduleToEdit.age_group);
      setLocation(scheduleToEdit.location || "Славейков, блок 48, партер");
      setCapacity(scheduleToEdit.capacity || 10);
      setIsActive(scheduleToEdit.is_active);

      const d = scheduleToEdit.date || formatDateKey(new Date());
      setStartDateStr(d);

      if (scheduleToEdit.recurrence) {
        setRecurrenceType(scheduleToEdit.recurrence.type);
        setRecurrenceCount(scheduleToEdit.recurrence.count || 2);
        setUntilDateStr(scheduleToEdit.recurrence.untilDate || "");
        setBiweeklySpan(scheduleToEdit.recurrence.biweeklySpan || "eoy");
      } else {
        setRecurrenceType("none");
      }
      setEditScope("series");
    } else {
      // New item reset
      setTitle("");
      setTitleEn("");
      setCategory("art");
      const d = initialDate || formatDateKey(new Date());
      setStartDateStr(d);
      const parsedD = parseDateKey(d);
      setDayOfWeek(getDayOfWeekNumber(parsedD));
      setAdditionalDays([]);
      setStartTime("16:00");
      setEndTime("17:30");
      setAgeGroup("6-10 години");
      setLocation("Славейков, блок 48, партер");
      setCapacity(10);
      setIsActive(true);
      setRecurrenceType("none");
      setRecurrenceCount(2);

      // Default untilDate to 2 months ahead
      const nextMonth = new Date(parsedD);
      nextMonth.setMonth(nextMonth.getMonth() + 2);
      setUntilDateStr(formatDateKey(nextMonth));
      setBiweeklySpan("eoy");
    }
    setErrorMessage(null);
  }, [scheduleToEdit, isOpen, initialDate]);

  // When start date changes, sync dayOfWeek automatically
  const handleStartDateChange = (newDateStr: string) => {
    setStartDateStr(newDateStr);
    try {
      const d = parseDateKey(newDateStr);
      const dow = getDayOfWeekNumber(d);
      setDayOfWeek(dow);
    } catch {}
  };

  // Find existing classes on the selected start date (to avoid double booking)
  const existingEventsOnSelectedDate = useMemo(() => {
    if (!startDateStr || !allSchedules || allSchedules.length === 0) return [];
    try {
      const targetDate = parseDateKey(startDateStr);
      // Map records to ScheduleItems for isEventOnDate
      return allSchedules
        .filter((rec) => {
          if (scheduleToEdit && rec.id === scheduleToEdit.id) return false;
          const asItem: ScheduleItem = {
            id: rec.id,
            title: rec.title,
            category: rec.category as any,
            dayOfWeek: rec.day_of_week,
            dayName: "",
            startTime: rec.start_time.slice(0, 5),
            endTime: rec.end_time.slice(0, 5),
            ageGroup: rec.age_group,
            location: rec.location || "",
            badgeBg: "",
            badgeText: "",
            badgeBorder: "",
            date: rec.date,
            recurrence: rec.recurrence,
            isActive: rec.is_active,
          };
          return isEventOnDate(asItem, targetDate);
        })
        .sort((a, b) => a.start_time.localeCompare(b.start_time));
    } catch {
      return [];
    }
  }, [startDateStr, allSchedules, scheduleToEdit]);

  // Construct current recurrence rule
  const currentRecurrenceRule: RecurrenceRule | null = useMemo(() => {
    if (recurrenceType === "none") return null;
    return {
      type: recurrenceType,
      count: recurrenceType === "weekly_count" ? Number(recurrenceCount) : (biweeklySpan === "count" ? Number(recurrenceCount) : undefined),
      untilDate: recurrenceType === "custom_until" || (recurrenceType === "biweekly" && biweeklySpan === "until") ? untilDateStr : undefined,
      biweeklySpan: recurrenceType === "biweekly" ? biweeklySpan : undefined,
    };
  }, [recurrenceType, recurrenceCount, untilDateStr, biweeklySpan]);

  // Human summary text
  const liveSummary = useMemo(() => {
    try {
      return getRecurrenceHumanSummary(
        title || "Занятие",
        startTime,
        endTime,
        startDateStr,
        currentRecurrenceRule,
        dayOfWeek
      );
    } catch {
      return "";
    }
  }, [title, startTime, endTime, startDateStr, currentRecurrenceRule, dayOfWeek]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!title.trim()) {
      setErrorMessage("Моля, въведете заглавие на занятието.");
      return;
    }

    setIsSubmitting(true);

    const payload: ScheduleFormData = {
      title: title.trim(),
      category,
      day_of_week: Number(dayOfWeek),
      start_time: startTime,
      end_time: endTime,
      age_group: ageGroup.trim(),
      location: location.trim(),
      capacity: Number(capacity) || 10,
      is_active: isActive,
      date: startDateStr,
      recurrence: currentRecurrenceRule,
      additional_days: additionalDays.length > 0 ? additionalDays : undefined,
    };

    try {
      if (isEditing && scheduleToEdit) {
        const res = await updateScheduleAction(scheduleToEdit.id, payload, editScope);
        if (res.success) {
          onSaved(res.items ? res.items.map(itemToRecord) : undefined);
          onClose();
        } else {
          setErrorMessage(res.message || "Грешка при запис.");
        }
      } else {
        const res = await createScheduleAction(payload);
        if (res.success) {
          onSaved(res.items ? res.items.map(itemToRecord) : undefined);
          onClose();
        } else {
          setErrorMessage(res.message || "Грешка при създаване.");
        }
      }
    } catch (err: any) {
      setErrorMessage(err?.message || "Възникна непредвидена грешка.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleAdditionalDay = (dow: number) => {
    if (dow === dayOfWeek) return;
    setAdditionalDays((prev) =>
      prev.includes(dow) ? prev.filter((d) => d !== dow) : [...prev, dow]
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-brand-dark/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-5 sm:p-8 z-10 border border-brand-purple/20 my-6 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-brand-purple/10">
          <div>
            <span className="text-[11px] font-bold text-brand-purple uppercase tracking-wider">
              {isEditing ? "Редакция на график" : "Ново занятие"}
            </span>
            <h3 className="font-heading font-bold text-xl sm:text-2xl text-brand-dark">
              {isEditing ? "Редактиране на занятие" : "Добавяне на ново занятие"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-brand-muted hover:text-brand-purple hover:bg-brand-purple/10 transition-colors"
            aria-label="Затвори"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMessage && (
          <div className="mt-3 p-3 rounded-2xl bg-red-50 text-red-600 text-xs font-medium border border-red-200 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 mt-4 overflow-y-auto pr-1">
          {/* If editing a series, allow choosing scope */}
          {isEditing && (scheduleToEdit?.seriesId || scheduleToEdit?.recurrence) && (
            <div className="p-3.5 rounded-2xl bg-brand-purple/10 border border-brand-purple/25 space-y-2">
              <span className="text-xs font-bold text-brand-purple uppercase tracking-wide flex items-center gap-1.5">
                <Info className="w-4 h-4" />
                Това занятие е част от серия
              </span>
              <div className="flex flex-wrap gap-4 pt-1 text-xs font-medium text-brand-dark">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="editScope"
                    value="series"
                    checked={editScope === "series"}
                    onChange={() => setEditScope("series")}
                    className="text-brand-purple focus:ring-brand-purple"
                  />
                  <span>Всички занятия от серията (препоръчително)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="editScope"
                    value="single"
                    checked={editScope === "single"}
                    onChange={() => setEditScope("single")}
                    className="text-brand-purple focus:ring-brand-purple"
                  />
                  <span>Само това конкретно занятие</span>
                </label>
              </div>
            </div>
          )}

          {/* Title & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-brand-dark uppercase tracking-wider mb-1">
                Заглавие на занятието *
              </label>
              <input
                type="text"
                placeholder="напр. Арт работилница, Шахмат..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-2xl bg-brand-bg text-sm text-brand-dark border border-brand-purple/20 focus:outline-none focus:ring-2 focus:ring-brand-purple"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-brand-dark uppercase tracking-wider mb-1">
                Категория *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-brand-bg text-sm text-brand-dark border border-brand-purple/20 focus:outline-none focus:ring-2 focus:ring-brand-purple cursor-pointer"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* DATE PICKER & DAY PREVIEW CARD (Anti-Double-Booking) */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 border border-brand-purple/20 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <label className="block text-xs font-bold text-brand-dark uppercase tracking-wider">
                  Избери начална дата на занятието *
                </label>
                <span className="text-[11px] text-brand-muted">
                  {formatDateHumanBg(startDateStr)}
                </span>
              </div>
              <div className="relative">
                <input
                  type="date"
                  value={startDateStr}
                  onChange={(e) => handleStartDateChange(e.target.value)}
                  className="px-3.5 py-1.5 rounded-xl bg-white text-xs sm:text-sm font-semibold text-brand-purple border border-brand-purple/30 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-purple cursor-pointer"
                />
              </div>
            </div>

            {/* Live Day Preview: Classes already scheduled on that day */}
            <div className="pt-2 border-t border-slate-200">
              <span className="text-[11px] font-bold text-brand-dark/80 uppercase tracking-wide block mb-1.5">
                Заети часове за тази дата ({formatDateHumanBg(startDateStr)}):
              </span>
              {existingEventsOnSelectedDate.length === 0 ? (
                <p className="text-xs text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200/60 inline-flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  Няма други насрочени занятия за този ден (денят е свободен).
                </p>
              ) : (
                <div className="space-y-1.5 max-h-32 overflow-y-auto">
                  {existingEventsOnSelectedDate.map((ev) => (
                    <div
                      key={ev.id}
                      className="flex items-center justify-between text-xs px-2.5 py-1.5 rounded-xl bg-white border border-slate-200 shadow-xs"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <Clock className="w-3.5 h-3.5 text-brand-purple shrink-0" />
                        <span className="font-bold text-brand-purple shrink-0">
                          {ev.start_time.slice(0, 5)} – {ev.end_time.slice(0, 5)}
                        </span>
                        <span className="font-semibold text-brand-dark truncate">{ev.title}</span>
                      </div>
                      <span className="text-[11px] text-brand-muted shrink-0 ml-2">
                        {ev.age_group}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Time Slot & Age Group */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-brand-dark uppercase tracking-wider mb-1">
                Начален час *
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-2xl bg-brand-bg text-sm text-brand-dark border border-brand-purple/20 focus:outline-none focus:ring-2 focus:ring-brand-purple"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-brand-dark uppercase tracking-wider mb-1">
                Краен час *
              </label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-2xl bg-brand-bg text-sm text-brand-dark border border-brand-purple/20 focus:outline-none focus:ring-2 focus:ring-brand-purple"
              />
            </div>

            <div className="col-span-2 sm:col-span-1">
              <label className="block text-xs font-bold text-brand-dark uppercase tracking-wider mb-1">
                Възрастова група
              </label>
              <input
                type="text"
                placeholder="напр. 6-10 г., 4 клас"
                value={ageGroup}
                onChange={(e) => setAgeGroup(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-brand-bg text-sm text-brand-dark border border-brand-purple/20 focus:outline-none focus:ring-2 focus:ring-brand-purple"
              />
            </div>
          </div>

          {/* RECURRENCE SECTION (Engine) */}
          <div className="p-4 rounded-2xl bg-brand-bg/80 border border-brand-purple/20 space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-brand-purple uppercase tracking-wider">
                Повторяемост на събитието (Recurrence)
              </label>
            </div>

            {/* Recurrence Type Selector */}
            <select
              value={recurrenceType}
              onChange={(e) => setRecurrenceType(e.target.value as RecurrenceType)}
              className="w-full px-4 py-2.5 rounded-2xl bg-white text-sm font-medium text-brand-dark border border-brand-purple/30 focus:outline-none focus:ring-2 focus:ring-brand-purple cursor-pointer"
            >
              <option value="none">Еднократно занятие (само на избраната дата)</option>
                            <option value="weekly_count">Повтаряй за определен брой седмици (напр. само за 2 седмици)</option>
              <option value="biweekly">През седмица (на всеки 2 седмици / 14 дни)</option>
              <option value="custom_until">Всяка седмица до избрана крайна дата</option>
            </select>

            {/* Conditional fields based on recurrence */}
            {recurrenceType === "weekly_count" && (
              <div className="flex items-center gap-3 pt-1">
                <span className="text-xs font-medium text-brand-dark">Брой седмици:</span>
                <input
                  type="number"
                  min="1"
                  max="52"
                  value={recurrenceCount}
                  onChange={(e) => setRecurrenceCount(Math.max(1, Number(e.target.value)))}
                  className="w-24 px-3 py-1.5 rounded-xl bg-white border border-brand-purple/30 text-xs font-bold text-center focus:ring-2 focus:ring-brand-purple"
                />
                <span className="text-xs text-brand-muted">
                  (напр. 2 = само за 2 седмици)
                </span>
              </div>
            )}

            {recurrenceType === "custom_until" && (
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 pt-1">
                <span className="text-xs font-medium text-brand-dark">Повтаряй всяка седмица до:</span>
                <input
                  type="date"
                  value={untilDateStr}
                  onChange={(e) => setUntilDateStr(e.target.value)}
                  min={startDateStr}
                  className="px-3 py-1.5 rounded-xl bg-white border border-brand-purple/30 text-xs font-bold focus:ring-2 focus:ring-brand-purple"
                />
              </div>
            )}

            {recurrenceType === "biweekly" && (
              <div className="space-y-2 pt-1 text-xs">
                <span className="font-semibold text-brand-dark block">Продължителност на презседмичното занятие:</span>
                <div className="flex flex-wrap gap-3">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="biweeklySpan"
                      value="eoy"
                      checked={biweeklySpan === "eoy"}
                      onChange={() => setBiweeklySpan("eoy")}
                      className="text-brand-purple focus:ring-brand-purple"
                    />
                    <span>До края на годината</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="biweeklySpan"
                      value="count"
                      checked={biweeklySpan === "count"}
                      onChange={() => setBiweeklySpan("count")}
                      className="text-brand-purple focus:ring-brand-purple"
                    />
                    <span>За N на брой пъти</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="biweeklySpan"
                      value="until"
                      checked={biweeklySpan === "until"}
                      onChange={() => setBiweeklySpan("until")}
                      className="text-brand-purple focus:ring-brand-purple"
                    />
                    <span>До избрана дата</span>
                  </label>
                </div>

                {biweeklySpan === "count" && (
                  <div className="flex items-center gap-2 pt-1">
                    <span>Брой пъти (сесии):</span>
                    <input
                      type="number"
                      min="1"
                      max="26"
                      value={recurrenceCount}
                      onChange={(e) => setRecurrenceCount(Math.max(1, Number(e.target.value)))}
                      className="w-20 px-2 py-1 rounded-lg border border-brand-purple/30 text-center font-bold"
                    />
                  </div>
                )}

                {biweeklySpan === "until" && (
                  <div className="flex items-center gap-2 pt-1">
                    <span>Крайна дата:</span>
                    <input
                      type="date"
                      value={untilDateStr}
                      onChange={(e) => setUntilDateStr(e.target.value)}
                      min={startDateStr}
                      className="px-2 py-1 rounded-lg border border-brand-purple/30 font-bold"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Optional multi-day selector */}
            {!isEditing && (
              <div className="pt-2 border-t border-brand-purple/10">
                <span className="text-[11px] font-bold text-brand-dark/70 uppercase tracking-wide block mb-1.5">
                  Добави същото занятие и в други дни от седмицата:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {DAYS_OF_WEEK.map((d) => {
                    const isBase = d.dayNumber === dayOfWeek;
                    const isChecked = isBase || additionalDays.includes(d.dayNumber);
                    return (
                      <button
                        type="button"
                        key={d.dayNumber}
                        disabled={isBase}
                        onClick={() => toggleAdditionalDay(d.dayNumber)}
                        className={`px-2.5 py-1 rounded-xl text-xs font-semibold transition-all ${
                          isBase
                            ? "bg-brand-purple text-white cursor-default"
                            : isChecked
                            ? "bg-brand-purple/20 text-brand-purple border border-brand-purple font-bold"
                            : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        {d.shortName}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Human Summary Box */}
            <div className="p-3 rounded-xl bg-purple-50/70 border border-purple-200/80 text-xs text-brand-dark/90 leading-relaxed">
              <strong className="text-brand-purple block font-semibold mb-0.5">
                Обобщение на насрочването:
              </strong>
              <span>{liveSummary}</span>
            </div>
          </div>

          {/* Location & Capacity */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-brand-dark uppercase tracking-wider mb-1">
                Локация / Зала
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-brand-bg text-sm text-brand-dark border border-brand-purple/20 focus:outline-none focus:ring-2 focus:ring-brand-purple"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-brand-dark uppercase tracking-wider mb-1">
                Капацитет (брой деца)
              </label>
              <input
                type="number"
                min="1"
                max="50"
                value={capacity}
                onChange={(e) => setCapacity(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-2xl bg-brand-bg text-sm text-brand-dark border border-brand-purple/20 focus:outline-none focus:ring-2 focus:ring-brand-purple"
              />
            </div>
          </div>

          {/* Active status checkbox */}
          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="isActiveCheck"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="w-4 h-4 text-brand-purple rounded border-gray-300 focus:ring-brand-purple cursor-pointer"
            />
            <label htmlFor="isActiveCheck" className="text-xs font-medium text-brand-dark cursor-pointer select-none">
              Активно занятие (видимо в графика на сайта)
            </label>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-brand-purple/10">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-full text-brand-muted hover:text-brand-dark text-sm font-semibold transition-colors"
            >
              Отказ
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-7 py-2.5 rounded-full bg-brand-purple text-white text-sm font-heading font-bold shadow-button hover:bg-brand-purple-hover hover:shadow-button-hover transition-all flex items-center gap-2 disabled:opacity-60 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Запазване...</span>
                </>
              ) : (
                <span>{isEditing ? "Запази промените" : "Добави занятие"}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}