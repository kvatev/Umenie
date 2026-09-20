"use client";

import React, { useState, useTransition } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Clock,
  MapPin,
  Loader2,
  CheckCircle2,
  EyeOff,
} from "lucide-react";
import { DAYS_OF_WEEK, CATEGORY_STYLES } from "@/lib/schedule-data";
import { toggleScheduleActiveAction, deleteScheduleAction } from "@/actions/admin-schedules";
import { ScheduleModal, ScheduleRecord } from "./ScheduleModal";
import { cn } from "@/lib/utils";

interface ScheduleTableProps {
  initialSchedules: ScheduleRecord[];
}

export function ScheduleTable({ initialSchedules }: ScheduleTableProps) {
  const [schedules, setSchedules] = useState<ScheduleRecord[]>(initialSchedules);
  const [activeDayFilter, setActiveDayFilter] = useState<number>(0); // 0 = All
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

  const getDayName = (dayNumber: number) => {
    return DAYS_OF_WEEK.find((d) => d.dayNumber === dayNumber)?.name || "Понеделник";
  };

  return (
    <div className="space-y-6">
      {/* Top Bar: Day Filters + Add Button */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl shadow-card border border-brand-purple/15 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Day Filters */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
          <button
            onClick={() => setActiveDayFilter(0)}
            className={cn(
              "px-4 py-2 rounded-2xl font-heading text-xs sm:text-sm font-bold transition-all shrink-0 cursor-pointer",
              activeDayFilter === 0
                ? "bg-brand-purple text-white shadow-button"
                : "bg-brand-bg text-brand-dark/80 hover:bg-brand-purple/10"
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
                  "px-3.5 py-2 rounded-2xl font-heading text-xs sm:text-sm font-bold transition-all shrink-0 flex items-center gap-1 cursor-pointer",
                  isSelected
                    ? "bg-brand-purple text-white shadow-button"
                    : "bg-brand-bg text-brand-dark/80 hover:bg-brand-purple/10"
                )}
              >
                <span>{day.shortName}</span>
                <span
                  className={cn(
                    "text-[10px] px-1 rounded-full font-bold",
                    isSelected ? "bg-white text-brand-purple" : "text-brand-muted"
                  )}
                >
                  ({count})
                </span>
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

      {/* Modal Component */}
      <ScheduleModal
        isOpen={modalOpen}
        scheduleToEdit={editingSchedule}
        onClose={() => setModalOpen(false)}
        onSaved={() => {
          // Re-trigger router refresh or reload state
          window.location.reload();
        }}
      />
    </div>
  );
}
