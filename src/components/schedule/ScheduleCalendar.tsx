"use client";

import React, { useState, useMemo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  User,
  Palette,
  MessageSquare,
  BookOpen,
  Calculator,
  Sparkles,
  ChevronRight as ArrowRightIcon,
} from "lucide-react";
import { ScheduleItem, DEFAULT_SCHEDULES } from "@/lib/schedule-data";
import { BookingModal } from "./BookingModal";
import { cn } from "@/lib/utils";

interface ScheduleCalendarProps {
  initialSchedules?: ScheduleItem[];
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

// Category icon helper
function CategoryIcon({ category, className }: { category?: string; className?: string }) {
  switch (category) {
    case "chess":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
        >
          <path d="M19 20H5v-2a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v2z" />
          <path d="M9 15V8a3 3 0 0 1 6 0v7" />
          <path d="M10 4a2 2 0 1 1 4 0" />
        </svg>
      );
    case "english":
      return <MessageSquare className={className} />;
    case "art":
      return <Palette className={className} />;
    case "knitting":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
        >
          <circle cx="12" cy="12" r="8" />
          <path d="m4.93 4.93 14.14 14.14" />
          <path d="m14.83 9.17-5.66 5.66" />
        </svg>
      );
    case "math":
      return <Calculator className={className} />;
    case "reading":
      return <BookOpen className={className} />;
    case "stem":
      return <Sparkles className={className} />;
    default:
      return <Sparkles className={className} />;
  }
}

// Category dot color for mobile calendar
function getCategoryDotColor(category: string): string {
  switch (category) {
    case "english":
      return "bg-blue-400";
    case "math":
      return "bg-emerald-400";
    case "chess":
      return "bg-purple-500";
    case "art":
      return "bg-amber-400";
    case "knitting":
      return "bg-pink-400";
    case "stem":
      return "bg-indigo-400";
    case "reading":
      return "bg-rose-400";
    default:
      return "bg-brand-purple";
  }
}

export function ScheduleCalendar({ initialSchedules }: ScheduleCalendarProps) {
  const schedules =
    initialSchedules && initialSchedules.length > 0 ? initialSchedules : DEFAULT_SCHEDULES;

  // Current year & month view (defaults to current date, with Oct 2025 as featured mockup anchor)
  const [currentDate, setCurrentDate] = useState(() => new Date(2025, 9, 15)); // 15 Октомври 2025 as in mockup
  const [selectedDayNumber, setSelectedDayNumber] = useState<number>(15);
  const [selectedSchedule, setSelectedSchedule] = useState<{
    item: ScheduleItem;
    dateStr: string;
  } | null>(null);

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  // Navigation handlers
  const handlePrevMonth = () => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
    setSelectedDayNumber(1);
  };

  const handleNextMonth = () => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
    setSelectedDayNumber(1);
  };

  // Group schedules by day of week (1 = Mon ... 7 = Sun)
  const schedulesByDayOfWeek = useMemo(() => {
    const map: Record<number, ScheduleItem[]> = { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [] };
    schedules.forEach((item) => {
      if (map[item.dayOfWeek]) {
        map[item.dayOfWeek].push(item);
      }
    });
    return map;
  }, [schedules]);

  // Generate calendar grid for current month
  const calendarDays = useMemo(() => {
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
    const totalDaysInMonth = lastDayOfMonth.getDate();

    // 0 = Sunday, 1 = Monday ... convert to Monday = 1 ... Sunday = 7
    let startDayOfWeek = firstDayOfMonth.getDay();
    startDayOfWeek = startDayOfWeek === 0 ? 7 : startDayOfWeek;

    // Previous month overflow days
    const prevMonthLastDay = new Date(currentYear, currentMonth, 0).getDate();
    const prevDays: { dayNumber: number; isCurrentMonth: boolean; dayOfWeek: number; date: Date }[] = [];
    for (let i = startDayOfWeek - 1; i >= 1; i--) {
      const dNum = prevMonthLastDay - i + 1;
      const d = new Date(currentYear, currentMonth - 1, dNum);
      let dow = d.getDay();
      dow = dow === 0 ? 7 : dow;
      prevDays.push({ dayNumber: dNum, isCurrentMonth: false, dayOfWeek: dow, date: d });
    }

    // Current month days
    const currentDays: { dayNumber: number; isCurrentMonth: boolean; dayOfWeek: number; date: Date }[] = [];
    for (let d = 1; d <= totalDaysInMonth; d++) {
      const dateObj = new Date(currentYear, currentMonth, d);
      let dow = dateObj.getDay();
      dow = dow === 0 ? 7 : dow;
      currentDays.push({ dayNumber: d, isCurrentMonth: true, dayOfWeek: dow, date: dateObj });
    }

    // Next month overflow days to complete grid (up to 35 or 42 cells)
    const combinedLength = prevDays.length + currentDays.length;
    const totalCells = combinedLength > 35 ? 42 : 35;
    const nextDaysNeeded = totalCells - combinedLength;
    const nextDays: { dayNumber: number; isCurrentMonth: boolean; dayOfWeek: number; date: Date }[] = [];
    for (let d = 1; d <= nextDaysNeeded; d++) {
      const dateObj = new Date(currentYear, currentMonth + 1, d);
      let dow = dateObj.getDay();
      dow = dow === 0 ? 7 : dow;
      nextDays.push({ dayNumber: d, isCurrentMonth: false, dayOfWeek: dow, date: dateObj });
    }

    return [...prevDays, ...currentDays, ...nextDays];
  }, [currentYear, currentMonth]);

  // Activities for the selected day in mobile view
  const selectedDayDate = useMemo(() => {
    return new Date(currentYear, currentMonth, selectedDayNumber);
  }, [currentYear, currentMonth, selectedDayNumber]);

  let selectedDayOfWeek = selectedDayDate.getDay();
  selectedDayOfWeek = selectedDayOfWeek === 0 ? 7 : selectedDayOfWeek;
  const mobileDayActivities = schedulesByDayOfWeek[selectedDayOfWeek] || [];

  const formattedSelectedDate = `${WEEKDAY_NAMES_BG[selectedDayOfWeek - 1]}, ${selectedDayNumber} ${MONTH_NAMES[currentMonth].toLowerCase()} ${currentYear}`;

  const openBooking = (item: ScheduleItem, dayNum: number, dow: number) => {
    const dateStr = `${WEEKDAY_NAMES_BG[dow - 1]}, ${dayNum} ${MONTH_NAMES[currentMonth].toLowerCase()} ${currentYear}`;
    setSelectedSchedule({ item, dateStr });
  };

  return (
    <div className="w-full space-y-6">
      {/* 1. CALENDAR CONTAINER CARD */}
      <div className="bg-white rounded-3xl sm:rounded-4xl shadow-card border border-brand-purple/15 p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Month & Year Navigation Header (matching mockups 1:1) */}
        <div className="flex items-center justify-between border-b border-brand-purple/10 pb-5">
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrevMonth}
              aria-label="Предишен месец"
              className="p-2 sm:p-2.5 rounded-full bg-brand-bg hover:bg-brand-purple/15 text-brand-purple transition-all cursor-pointer hover:scale-105 active:scale-95"
            >
              <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
            </button>

            <h2 className="font-heading font-bold text-xl sm:text-2xl lg:text-3xl text-brand-dark min-w-[200px] text-center tracking-wide">
              {MONTH_NAMES[currentMonth]} {currentYear}
            </h2>

            <button
              onClick={handleNextMonth}
              aria-label="Следващ месец"
              className="p-2 sm:p-2.5 rounded-full bg-brand-bg hover:bg-brand-purple/15 text-brand-purple transition-all cursor-pointer hover:scale-105 active:scale-95"
            >
              <ChevronRight className="w-5 h-5 stroke-[2.5]" />
            </button>
          </div>

          <div className="hidden sm:inline-flex items-center gap-2 text-xs font-semibold text-brand-purple bg-brand-purple/10 px-3.5 py-1.5 rounded-full">
            <span>💡 Изберете занимание от календара за бързо записване</span>
          </div>
        </div>

        {/* 2. DESKTOP FULL MONTHLY GRID (matching "График Десктоп.png" 1:1) */}
        <div className="hidden lg:block overflow-x-auto">
          <div className="min-w-[900px] border border-brand-purple/15 rounded-2xl overflow-hidden">
            {/* Weekday Columns Header */}
            <div className="grid grid-cols-7 bg-brand-bg/80 border-b border-brand-purple/15">
              {WEEKDAY_NAMES_BG.map((dayName, idx) => (
                <div
                  key={idx}
                  className="py-3 text-center font-heading font-bold text-xs uppercase tracking-wider text-brand-purple border-r last:border-r-0 border-brand-purple/15"
                >
                  {dayName}
                </div>
              ))}
            </div>

            {/* Monthly Calendar Cells Grid */}
            <div className="grid grid-cols-7 divide-x divide-y divide-brand-purple/15 bg-white">
              {calendarDays.map((cell, index) => {
                const dayActivities = cell.isCurrentMonth
                  ? schedulesByDayOfWeek[cell.dayOfWeek] || []
                  : [];

                return (
                  <div
                    key={index}
                    className={cn(
                      "min-h-[125px] p-2 flex flex-col justify-start transition-colors",
                      cell.isCurrentMonth
                        ? "bg-white hover:bg-brand-purple/[0.02]"
                        : "bg-gray-50/60 opacity-40 pointer-events-none"
                    )}
                  >
                    {/* Date Number */}
                    <div className="flex items-center justify-between mb-1.5">
                      <span
                        className={cn(
                          "font-heading font-bold text-xs",
                          cell.isCurrentMonth ? "text-brand-dark" : "text-gray-400"
                        )}
                      >
                        {cell.dayNumber}
                      </span>
                    </div>

                    {/* Activity Pill Badges */}
                    <div className="space-y-1 overflow-y-auto max-h-[140px] pr-0.5 scrollbar-none">
                      {dayActivities.map((act) => (
                        <div
                          key={act.id}
                          onClick={() => openBooking(act, cell.dayNumber, cell.dayOfWeek)}
                          className={cn(
                            "px-2 py-1 rounded-lg border text-[11px] leading-tight font-medium cursor-pointer transition-all duration-150 shadow-xs hover:scale-[1.02] hover:shadow-sm active:scale-[0.98] flex items-center justify-between gap-1 group",
                            act.badgeBg,
                            act.badgeBorder,
                            act.badgeText
                          )}
                          title={`${act.startTime} ${act.title} (${act.ageGroup})`}
                        >
                          <span className="font-bold text-[10px] shrink-0 opacity-90">
                            {act.startTime}
                          </span>
                          <span className="truncate flex-1 font-semibold text-brand-dark text-[11px]">
                            {act.title}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 3. MOBILE MINI-CALENDAR GRID (matching "График 1 - мобилна.png" 1:1) */}
        <div className="block lg:hidden space-y-6">
          <div className="border border-brand-purple/15 rounded-2xl p-3 bg-brand-bg/40">
            {/* Weekdays header */}
            <div className="grid grid-cols-7 text-center font-heading font-bold text-xs text-brand-purple pb-2 border-b border-brand-purple/10">
              {WEEKDAY_SHORTS_BG.map((sh, idx) => (
                <div key={idx}>{sh}</div>
              ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-y-2 pt-2 text-center text-xs">
              {calendarDays.map((cell, idx) => {
                const isSelected = cell.isCurrentMonth && cell.dayNumber === selectedDayNumber;
                const activities = cell.isCurrentMonth
                  ? schedulesByDayOfWeek[cell.dayOfWeek] || []
                  : [];
                const firstAct = activities[0];

                return (
                  <div
                    key={idx}
                    onClick={() => {
                      if (cell.isCurrentMonth) {
                        setSelectedDayNumber(cell.dayNumber);
                      }
                    }}
                    className={cn(
                      "flex flex-col items-center justify-center py-1 cursor-pointer select-none rounded-xl transition-all",
                      !cell.isCurrentMonth && "opacity-30 pointer-events-none text-gray-400"
                    )}
                  >
                    <div
                      className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center font-heading font-bold text-xs transition-all",
                        isSelected
                          ? "bg-brand-purple text-white shadow-md scale-105"
                          : "text-brand-dark hover:bg-brand-purple/10"
                      )}
                    >
                      {cell.dayNumber}
                    </div>

                    {/* Colored dot indicator if day has activities */}
                    <div className="h-1.5 flex items-center justify-center gap-0.5 mt-0.5">
                      {cell.isCurrentMonth && firstAct && !isSelected && (
                        <span
                          className={cn(
                            "w-1.5 h-1.5 rounded-full",
                            getCategoryDotColor(firstAct.category)
                          )}
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Activities List for Selected Day (matching "График 1 - мобилна.png" 1:1) */}
          <div className="space-y-3 pt-1">
            <h3 className="font-heading font-bold text-lg text-brand-dark px-1">
              Занимания на {selectedDayNumber} {MONTH_NAMES[currentMonth].toLowerCase()} {currentYear}
            </h3>

            {mobileDayActivities.length > 0 ? (
              <div className="space-y-3">
                {mobileDayActivities.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => openBooking(item, selectedDayNumber, selectedDayOfWeek)}
                    className="p-3.5 sm:p-4 rounded-2xl bg-white border border-brand-purple/20 shadow-sm hover:border-brand-purple hover:shadow-md transition-all cursor-pointer flex items-center justify-between gap-3 group active:scale-[0.99]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-brand-purple/15 text-brand-purple flex items-center justify-center shrink-0">
                        <CategoryIcon category={item.category} className="w-5 h-5" />
                      </div>
                      <div className="space-y-0.5">
                        <h4 className="font-heading font-bold text-base text-brand-dark group-hover:text-brand-purple transition-colors">
                          {item.title}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-brand-muted">
                          <span className="font-semibold text-brand-dark/80">
                            {item.startTime} – {item.endTime}
                          </span>
                          <span>•</span>
                          <span>{item.ageGroup}</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-2 rounded-full text-brand-purple group-hover:bg-brand-purple/10 transition-colors shrink-0">
                      <ArrowRightIcon className="w-4 h-4 stroke-[2.5]" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-brand-bg text-center text-brand-muted text-xs sm:text-sm">
                Няма планирани групови занимания за този ден.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 4. INTERACTIVE BOOKING MODAL */}
      <BookingModal
        schedule={selectedSchedule?.item || null}
        selectedDateStr={selectedSchedule?.dateStr}
        onClose={() => setSelectedSchedule(null)}
      />
    </div>
  );
}
