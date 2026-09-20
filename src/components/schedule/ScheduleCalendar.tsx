"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Clock, User, Plus } from "lucide-react";
import { ScheduleItem, DAYS_OF_WEEK, DEFAULT_SCHEDULES } from "@/lib/schedule-data";
import { BookingModal } from "./BookingModal";
import { cn } from "@/lib/utils";

interface ScheduleCalendarProps {
  initialSchedules?: ScheduleItem[];
}

export function ScheduleCalendar({ initialSchedules }: ScheduleCalendarProps) {
  const schedules = initialSchedules && initialSchedules.length > 0 ? initialSchedules : DEFAULT_SCHEDULES;
  const [selectedSchedule, setSelectedSchedule] = useState<ScheduleItem | null>(null);
  const [activeMobileDay, setActiveMobileDay] = useState<number>(1);
  const [currentMonthIndex, setCurrentMonthIndex] = useState(9); // Октомври (0-indexed 9)
  const [currentYear] = useState(2026);

  const monthNames = [
    "Януари", "Февруари", "Март", "Април", "Май", "Юни",
    "Юли", "Август", "Септември", "Октомври", "Ноември", "Декември"
  ];

  const handlePrevMonth = () => {
    setCurrentMonthIndex((prev) => (prev === 0 ? 11 : prev - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonthIndex((prev) => (prev === 11 ? 0 : prev + 1));
  };

  // Group schedules by day of week (1 to 7)
  const schedulesByDay: Record<number, ScheduleItem[]> = {
    1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: []
  };

  schedules.forEach((item) => {
    if (schedulesByDay[item.dayOfWeek]) {
      schedulesByDay[item.dayOfWeek].push(item);
    }
  });

  return (
    <div className="w-full space-y-6">
      {/* Calendar Header with Month Navigation */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-card border border-brand-purple/15 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={handlePrevMonth}
            aria-label="Предишен месец"
            className="p-2.5 rounded-full bg-brand-purple/10 text-brand-purple hover:bg-brand-purple hover:text-white transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <h3 className="font-heading font-bold text-xl sm:text-2xl text-brand-dark min-w-[180px] text-center">
            {monthNames[currentMonthIndex]} {currentYear}
          </h3>

          <button
            onClick={handleNextMonth}
            aria-label="Следващ месец"
            className="p-2.5 rounded-full bg-brand-purple/10 text-brand-purple hover:bg-brand-purple hover:text-white transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="text-xs sm:text-sm font-semibold text-brand-purple bg-brand-purple-light px-4 py-2 rounded-full">
          💡 Кликнете върху занимание за бързо записване
        </div>
      </div>

      {/* MOBILE VIEW (Дни като табове + Списък със занимания) */}
      <div className="lg:hidden space-y-4">
        {/* Day Selector Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {DAYS_OF_WEEK.map((day) => {
            const isSelected = activeMobileDay === day.dayNumber;
            const count = schedulesByDay[day.dayNumber]?.length || 0;

            return (
              <button
                key={day.dayNumber}
                onClick={() => setActiveMobileDay(day.dayNumber)}
                className={cn(
                  "flex-shrink-0 px-4 py-2.5 rounded-2xl font-heading text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5",
                  isSelected
                    ? "bg-brand-purple text-white shadow-button"
                    : "bg-white text-brand-dark hover:bg-brand-purple/10 border border-brand-purple/15"
                )}
              >
                <span>{day.name}</span>
                <span
                  className={cn(
                    "text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold",
                    isSelected ? "bg-white text-brand-purple" : "bg-brand-purple/15 text-brand-purple"
                  )}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Day Activities List */}
        <div className="bg-white rounded-3xl p-5 shadow-card border border-brand-purple/15 space-y-3">
          <h4 className="font-heading font-bold text-lg text-brand-purple border-b border-brand-purple/15 pb-2">
            {DAYS_OF_WEEK.find((d) => d.dayNumber === activeMobileDay)?.name}
          </h4>

          {schedulesByDay[activeMobileDay]?.length > 0 ? (
            <div className="space-y-3">
              {schedulesByDay[activeMobileDay].map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedSchedule(item)}
                  className="p-4 rounded-2xl border border-brand-purple/20 bg-brand-bg/50 hover:bg-white hover:border-brand-purple hover:shadow-md transition-all cursor-pointer flex items-center justify-between group"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs font-bold text-brand-purple">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{item.startTime} - {item.endTime}</span>
                    </div>
                    <h5 className="font-heading font-bold text-base text-brand-dark group-hover:text-brand-purple transition-colors">
                      {item.title}
                    </h5>
                    <div className="flex items-center gap-1.5 text-xs text-brand-muted">
                      <User className="w-3 h-3 text-brand-purple/70" />
                      <span>{item.ageGroup}</span>
                    </div>
                  </div>

                  <span className="p-2 rounded-full bg-brand-purple text-white shadow-sm group-hover:scale-110 transition-transform">
                    <Plus className="w-4 h-4" />
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-brand-muted text-sm">
              Няма планирани групови занимания за този ден.
            </div>
          )}
        </div>
      </div>

      {/* DESKTOP VIEW (Пълна 7-дневна мрежа съгласно График Десктоп.png) */}
      <div className="hidden lg:block bg-white rounded-3xl shadow-card border border-brand-purple/15 overflow-hidden">
        {/* Days Header */}
        <div className="grid grid-cols-7 border-b border-brand-purple/15 bg-brand-purple/5">
          {DAYS_OF_WEEK.map((day) => (
            <div
              key={day.dayNumber}
              className="py-4 text-center font-heading font-bold text-sm text-brand-purple border-r last:border-r-0 border-brand-purple/15 uppercase tracking-wide"
            >
              {day.name}
            </div>
          ))}
        </div>

        {/* Days Columns */}
        <div className="grid grid-cols-7 divide-x divide-brand-purple/15 min-h-[520px]">
          {DAYS_OF_WEEK.map((day) => {
            const dayItems = schedulesByDay[day.dayNumber] || [];

            return (
              <div
                key={day.dayNumber}
                className="p-3 space-y-2.5 bg-[#f1f2f6]/30 hover:bg-white/70 transition-colors"
              >
                {dayItems.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedSchedule(item)}
                    className={cn(
                      "p-3 rounded-2xl border text-xs transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md transform hover:-translate-y-0.5 group",
                      item.badgeBg,
                      item.badgeBorder
                    )}
                  >
                    <div className="flex items-center justify-between text-[11px] font-bold text-brand-dark/80 mb-1">
                      <span className="inline-flex items-center gap-1">
                        <Clock className="w-3 h-3 text-brand-purple" />
                        {item.startTime}
                      </span>
                      <span className="text-[10px] font-normal opacity-75">
                        {item.ageGroup}
                      </span>
                    </div>

                    <h5 className="font-heading font-bold text-xs leading-tight text-brand-dark group-hover:text-brand-purple transition-colors">
                      {item.title}
                    </h5>
                  </div>
                ))}

                {dayItems.length === 0 && (
                  <div className="h-full flex items-center justify-center text-center p-2 text-brand-muted/40 text-xs italic">
                    Свободен ден
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Booking Modal */}
      <BookingModal
        schedule={selectedSchedule}
        onClose={() => setSelectedSchedule(null)}
      />
    </div>
  );
}
