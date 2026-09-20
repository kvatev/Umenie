"use client";

import React, { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";
import { DAYS_OF_WEEK } from "@/lib/schedule-data";
import { createScheduleAction, updateScheduleAction, ScheduleFormData } from "@/actions/admin-schedules";

export interface ScheduleRecord {
  id: string;
  title: string;
  category: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  age_group: string;
  location?: string;
  is_active: boolean;
}

interface ScheduleModalProps {
  isOpen: boolean;
  scheduleToEdit: ScheduleRecord | null;
  onClose: () => void;
  onSaved: () => void;
}

const CATEGORIES = [
  { value: "english", label: "Английски език (Уроци и курсове)" },
  { value: "math", label: "Математика (Уроци и курсове)" },
  { value: "knitting", label: "Плетиво и приложни изкуства" },
  { value: "art", label: "Арт занимания и рисуване" },
  { value: "reading", label: "Читателски клуб" },
  { value: "chess", label: "Шахмат" },
  { value: "stem", label: "STEM клуб" },
  { value: "study_hall", label: "Учебна занималня" },
];

export function ScheduleModal({
  isOpen,
  scheduleToEdit,
  onClose,
  onSaved,
}: ScheduleModalProps) {
  const isEditing = Boolean(scheduleToEdit);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("art");
  const [dayOfWeek, setDayOfWeek] = useState<number>(1);
  const [startTime, setStartTime] = useState("16:00");
  const [endTime, setEndTime] = useState("17:30");
  const [ageGroup, setAgeGroup] = useState("6-10 години");
  const [location, setLocation] = useState("Славейков, блок 48, партер");
  const [isActive, setIsActive] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (scheduleToEdit) {
      setTitle(scheduleToEdit.title);
      setCategory(scheduleToEdit.category);
      setDayOfWeek(scheduleToEdit.day_of_week);
      setStartTime(scheduleToEdit.start_time.slice(0, 5));
      setEndTime(scheduleToEdit.end_time.slice(0, 5));
      setAgeGroup(scheduleToEdit.age_group);
      setLocation(scheduleToEdit.location || "Славейков, блок 48, партер");
      setIsActive(scheduleToEdit.is_active);
    } else {
      // Default reset
      setTitle("");
      setCategory("art");
      setDayOfWeek(1);
      setStartTime("16:00");
      setEndTime("17:30");
      setAgeGroup("6-10 години");
      setLocation("Славейков, блок 48, партер");
      setIsActive(true);
    }
    setErrorMessage(null);
  }, [scheduleToEdit, isOpen]);

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
      is_active: isActive,
    };

    try {
      if (isEditing && scheduleToEdit) {
        const res = await updateScheduleAction(scheduleToEdit.id, payload);
        if (res.success) {
          onSaved();
          onClose();
        } else {
          setErrorMessage(res.message || "Грешка при запис.");
        }
      } else {
        const res = await createScheduleAction(payload);
        if (res.success) {
          onSaved();
          onClose();
        } else {
          setErrorMessage(res.message || "Грешка при създаване.");
        }
      }
    } catch {
      setErrorMessage("Възникна непредвидена грешка.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-brand-dark/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 sm:p-8 z-10 border border-brand-purple/20 my-8">
        <div className="flex items-center justify-between pb-4 border-b border-brand-purple/10">
          <h3 className="font-heading font-bold text-xl text-brand-dark">
            {isEditing ? "Редактиране на занятие" : "Добавяне на ново занятие"}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-brand-muted hover:text-brand-purple hover:bg-brand-purple/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMessage && (
          <div className="mt-4 p-3 rounded-2xl bg-red-50 text-red-600 text-xs font-medium border border-red-200">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Day of week */}
          <div>
            <label className="block text-xs font-bold text-brand-dark uppercase tracking-wider mb-1">
              Ден от седмицата *
            </label>
            <select
              value={dayOfWeek}
              onChange={(e) => setDayOfWeek(Number(e.target.value))}
              className="w-full px-4 py-2.5 rounded-2xl bg-brand-bg text-sm text-brand-dark border border-brand-purple/20 focus:outline-none focus:ring-2 focus:ring-brand-purple cursor-pointer"
            >
              {DAYS_OF_WEEK.map((d) => (
                <option key={d.dayNumber} value={d.dayNumber}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          {/* Title / Class */}
          <div>
            <label className="block text-xs font-bold text-brand-dark uppercase tracking-wider mb-1">
              Заглавие / Клас *
            </label>
            <input
              type="text"
              required
              placeholder="Напр. Английски 3 клас или Творческо ателие"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl bg-brand-bg text-sm text-brand-dark border border-brand-purple/20 focus:outline-none focus:ring-2 focus:ring-brand-purple"
            />
          </div>

          {/* Category */}
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

          {/* Times: Start & End */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-brand-dark uppercase tracking-wider mb-1">
                Начален час *
              </label>
              <input
                type="time"
                required
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-brand-bg text-sm text-brand-dark border border-brand-purple/20 focus:outline-none focus:ring-2 focus:ring-brand-purple"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-brand-dark uppercase tracking-wider mb-1">
                Краен час *
              </label>
              <input
                type="time"
                required
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-brand-bg text-sm text-brand-dark border border-brand-purple/20 focus:outline-none focus:ring-2 focus:ring-brand-purple"
              />
            </div>
          </div>

          {/* Age Group */}
          <div>
            <label className="block text-xs font-bold text-brand-dark uppercase tracking-wider mb-1">
              Възрастова група *
            </label>
            <input
              type="text"
              required
              placeholder="Напр. 6-10 години или 4 клас"
              value={ageGroup}
              onChange={(e) => setAgeGroup(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl bg-brand-bg text-sm text-brand-dark border border-brand-purple/20 focus:outline-none focus:ring-2 focus:ring-brand-purple"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-xs font-bold text-brand-dark uppercase tracking-wider mb-1">
              Локация
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl bg-brand-bg text-sm text-brand-dark border border-brand-purple/20 focus:outline-none focus:ring-2 focus:ring-brand-purple"
            />
          </div>

          {/* Is Active Toggle */}
          <div className="flex items-center gap-3 pt-2">
            <input
              type="checkbox"
              id="isActive"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="w-4 h-4 rounded text-brand-purple focus:ring-brand-purple cursor-pointer"
            />
            <label htmlFor="isActive" className="text-xs font-semibold text-brand-dark cursor-pointer select-none">
              Активно занятие (видимо в календара на сайта)
            </label>
          </div>

          {/* Buttons */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-brand-purple/10">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-full text-xs font-bold text-brand-muted hover:bg-gray-100 transition-colors cursor-pointer"
            >
              Отказ
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-full bg-brand-purple text-white font-heading font-bold text-xs sm:text-sm shadow-button hover:bg-brand-purple-hover transition-all flex items-center gap-2 cursor-pointer disabled:opacity-70"
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
