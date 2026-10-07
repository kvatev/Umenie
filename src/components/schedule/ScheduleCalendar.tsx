"use client";

import React, { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  User,
  ChevronRight as ArrowRightIcon,
} from "lucide-react";
import { ScheduleItem, DEFAULT_SCHEDULES } from "@/lib/schedule-data";
import { BookingModal } from "./BookingModal";
import { getActivityIcon } from "@/lib/schedule-icons";
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

  // Track today's live date
  const [today, setToday] = useState(() => new Date());

  // Current year & month view (defaults dynamically to today's date)
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [selectedDayNumber, setSelectedDayNumber] = useState<number>(() => new Date().getDate());
  const [selectedSchedule, setSelectedSchedule] = useState<{
    item: ScheduleItem;
    dateStr: string;
  } | null>(null);

  // Synchronize with client's actual system date upon mount
  useEffect(() => {
    const now = new Date();
    setToday(now);
    setCurrentDate(now);
    setSelectedDayNumber(now.getDate());
  }, []);

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const todayDate = today.getDate();
  const todayMonth = today.getMonth();
  const todayYear = today.getFullYear();

  // Navigation handlers
  const handlePrevMonth = () => {
    setCurrentDate((prev) => {
      const newD = new Date(prev.getFullYear(), prev.getMonth() - 1, 1);
      if (newD.getFullYear() === todayYear && newD.getMonth() === todayMonth) {
        setSelectedDayNumber(todayDate);
      } else {
        setSelectedDayNumber(1);
      }
      return newD;
    });
  };

  const handleNextMonth = () => {
    setCurrentDate((prev) => {
      const newD = new Date(prev.getFullYear(), prev.getMonth() + 1, 1);
      if (newD.getFullYear() === todayYear && newD.getMonth() === todayMonth) {
        setSelectedDayNumber(todayDate);
      } else {
        setSelectedDayNumber(1);
      }
      return newD;
    });
  };

  const handleToday = () => {
    setCurrentDate(new Date(todayYear, todayMonth, 1));
    setSelectedDayNumber(todayDate);
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
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-brand-purple/10 pb-5">
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={handlePrevMonth}
              aria-label="Предишен месец"
              className="p-2 sm:p-2.5 rounded-full bg-brand-bg hover:bg-brand-purple/15 text-brand-purple transition-all cursor-pointer hover:scale-105 active:scale-95"
            >
              <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
            </button>

            <h2 className="font-heading font-bold text-xl sm:text-2xl lg:text-3xl text-brand-dark min-w-[180px] sm:min-w-[200px] text-center tracking-wide">
              {MONTH_NAMES[currentMonth]} {currentYear}
            </h2>

            <button
              onClick={handleNextMonth}
              aria-label="Следващ месец"
              className="p-2 sm:p-2.5 rounded-full bg-brand-bg hover:bg-brand-purple/15 text-brand-purple transition-all cursor-pointer hover:scale-105 active:scale-95"
            >
              <ChevronRight className="w-5 h-5 stroke-[2.5]" />
            </button>

            <button
              onClick={handleToday}
              className="ml-1 sm:ml-2 px-3 py-1.5 rounded-full text-xs font-heading font-bold border border-brand-purple/20 text-brand-purple hover:bg-brand-purple/10 active:scale-95 transition-all cursor-pointer"
              title="Към днешна дата"
            >
              Днес
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
                const isToday =
                  cell.isCurrentMonth &&
                  cell.dayNumber === todayDate &&
                  currentMonth === todayMonth &&
                  currentYear === todayYear;

                return (
                  <div
                    key={index}
                    className={cn(
                      "min-h-[125px] p-2 flex flex-col justify-start transition-colors relative",
                      cell.isCurrentMonth
                        ? isToday
                          ? "bg-brand-purple/[0.04] ring-2 ring-inset ring-brand-purple/50"
                          : "bg-white hover:bg-brand-purple/[0.02]"
                        : "bg-gray-50/60 opacity-40 pointer-events-none"
                    )}
                  >
                    {/* Date Number & Today badge */}
                    <div className="flex items-center justify-between mb-1.5">
                      <span
                        className={cn(
                          "font-heading font-bold text-xs flex items-center justify-center transition-all",
                          isToday
                            ? "bg-brand-purple text-white w-6 h-6 rounded-full shadow-xs"
                            : cell.isCurrentMonth
                            ? "text-brand-dark"
                            : "text-gray-400"
                        )}
                      >
                        {cell.dayNumber}
                      </span>
                      {isToday && (
                        <span className="text-[10px] font-heading font-bold uppercase tracking-wider text-brand-purple bg-brand-purple/15 px-2 py-0.5 rounded-full">
                          Днес
                        </span>
                      )}
                    </div>

                    {/* Activity Pill Badges */}
                    <div className="space-y-1 overflow-y-auto max-h-[140px] pr-0.5 scrollbar-none">
                      {dayActivities.map((act) => (
                        <div
                          key={act.id}
                          onClick={() => openBooking(act, cell.dayNumber, cell.dayOfWeek)}
                          className={cn(
                            "px-2 py-1 rounded-lg border text-[11px] leading-tight font-medium cursor-pointer transition-all duration-150 shadow-xs hover:scale-[1.02] hover:shadow-sm active:scale-[0.98] flex items-center justify-between gap-1.5 group",
                            act.badgeBg,
                            act.badgeBorder,
                            act.badgeText
                          )}
                          title={`${act.startTime} ${act.title} (${act.ageGroup})`}
                        >
                          <div className="relative w-4 h-4 rounded-full overflow-hidden shrink-0 bg-white border border-brand-purple/20 shadow-xs flex items-center justify-center">
                            <Image
                              src={getActivityIcon(act.title, act.category)}
                              alt=""
                              width={16}
                              height={16}
                              className="w-full h-full object-contain"
                            />
                          </div>
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
                const isToday =
                  cell.isCurrentMonth &&
                  cell.dayNumber === todayDate &&
                  currentMonth === todayMonth &&
                  currentYear === todayYear;
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
                      "flex flex-col items-center justify-center py-1 cursor-pointer select-none rounded-xl transition-all relative",
                      !cell.isCurrentMonth && "opacity-30 pointer-events-none text-gray-400"
                    )}
                  >
                    <div
                      className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center font-heading font-bold text-xs transition-all relative",
                        isSelected
                          ? "bg-brand-purple text-white shadow-md scale-105"
                          : isToday
                          ? "border-2 border-brand-purple text-brand-purple font-extrabold bg-brand-purple/10"
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
            <h3 className="font-heading font-bold text-lg text-brand-dark px-1 flex items-center gap-2">
              <span>
                Занимания на {selectedDayNumber} {MONTH_NAMES[currentMonth].toLowerCase()} {currentYear}
              </span>
              {selectedDayNumber === todayDate &&
                currentMonth === todayMonth &&
                currentYear === todayYear && (
                  <span className="text-[11px] font-heading font-bold uppercase tracking-wider text-brand-purple bg-brand-purple/15 px-2 py-0.5 rounded-full">
                    Днес
                  </span>
                )}
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
                      <div className="relative w-12 h-12 rounded-full overflow-hidden bg-white border border-brand-purple/20 flex items-center justify-center shrink-0 shadow-xs">
                        <Image
                          src={getActivityIcon(item.title, item.category)}
                          alt={item.title}
                          width={48}
                          height={48}
                          className="w-full h-full object-contain"
                        />
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
