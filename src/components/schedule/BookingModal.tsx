"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  X,
  Calendar,
  Clock,
  User,
  MapPin,
  Loader2,
  Palette,
  MessageSquare,
  BookOpen,
  Calculator,
  Sparkles,
  ArrowLeft,
} from "lucide-react";
import { ScheduleItem } from "@/lib/schedule-data";
import { createBookingAction } from "@/actions/booking";
import { cn } from "@/lib/utils";

interface BookingModalProps {
  schedule: ScheduleItem | null;
  selectedDateStr?: string;
  onClose: () => void;
}

const AGE_OPTIONS = [
  "Избери възраст",
  "5 години",
  "6 години",
  "7 години",
  "8 години",
  "9 години",
  "10 години",
  "11 години",
  "12 години",
  "13+ години",
];

// Custom Category Icon
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

export function BookingModal({ schedule, selectedDateStr, onClose }: BookingModalProps) {
  const [childName, setChildName] = useState("");
  const [childAge, setChildAge] = useState("");
  const [parentName, setParentName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [consentMarketing, setConsentMarketing] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [globalError, setGlobalError] = useState<string | null>(null);

  // Lock body scroll when open
  useEffect(() => {
    if (schedule) {
      document.body.style.overflow = "hidden";
      setIsSuccess(false);
      setFieldErrors({});
      setGlobalError(null);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [schedule]);

  if (!schedule) return null;

  const displayDate = selectedDateStr || `${schedule.dayName}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    setGlobalError(null);

    // Client-side quick checks
    const errors: Record<string, string> = {};
    if (!childName.trim() || childName.trim().length < 2) {
      errors.childName = "Моля, въведете име на детето (поне 2 букви)";
    }
    if (!childAge || childAge === "Избери възраст") {
      errors.childAge = "Моля, изберете възраст на детето";
    }
    if (!parentName.trim() || parentName.trim().length < 2) {
      errors.parentName = "Моля, въведете име на родител (поне 2 букви)";
    }
    const cleanPhone = phone.replace(/[\s\-()]/g, "");
    const bgRegex = /^(\+359|0)[0-9]{9}$/;
    if (!bgRegex.test(cleanPhone)) {
      errors.phone = "Невалиден български телефон (напр. 0881234567 или +359881234567)";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await createBookingAction({
        scheduleId: schedule.id,
        activityName: schedule.title,
        childName,
        childAge,
        parentName,
        phone,
        email,
        consentMarketing,
      });

      if (result.success) {
        setIsSuccess(true);
      } else {
        if (result.errors) {
          setFieldErrors(result.errors);
        }
        setGlobalError(result.message || "Възникна грешка. Моля, опитайте отново.");
      }
    } catch {
      setGlobalError("Възникна неочаквана грешка при връзка със сървъра.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 bg-brand-dark/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-lg bg-white rounded-3xl sm:rounded-4xl shadow-2xl overflow-hidden z-10 border border-brand-purple/20 transition-all my-auto max-h-[92vh] flex flex-col">
        {/* Top Header bar with close button & mobile back link */}
        <div className="flex items-center justify-between px-6 pt-5 pb-2">
          <button
            onClick={onClose}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-purple hover:underline cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Към графика</span>
          </button>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-brand-muted hover:text-brand-purple hover:bg-brand-purple/10 transition-colors cursor-pointer"
            aria-label="Затвори"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          /* CONFIRMATION SCREEN (matching "График 2 Десктоп.png" & "График 3 - мобилна.png" 1:1) */
          <div className="p-8 sm:p-12 text-center flex flex-col items-center justify-center space-y-6 animate-fade-in overflow-y-auto">
            {/* Soft circular background with paper airplane & dashed trail */}
            <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-[#f1effd] flex items-center justify-center relative mb-1">
              <svg
                viewBox="0 0 160 130"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-28 h-24 text-brand-purple"
              >
                {/* Curved dashed flight path */}
                <path
                  d="M20,105 C50,110 80,95 110,50"
                  stroke="currentColor"
                  strokeWidth="2.8"
                  strokeDasharray="6 6"
                  strokeLinecap="round"
                />
                {/* Hand-drawn paper airplane */}
                <path
                  d="M105,52 L145,20 L124,78 L114,60 L105,52 Z"
                  stroke="currentColor"
                  strokeWidth="2.8"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
                <path
                  d="M145,20 L114,60"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <h2 className="font-heading font-bold text-2xl sm:text-4xl text-brand-purple tracking-wide uppercase">
              ЗАЯВКАТА Е ПРИЕТА
            </h2>

            <p className="text-brand-dark/90 text-sm sm:text-base leading-relaxed max-w-sm font-sans">
              Благодарим ви! Ще се свържем с Вас, на посочения телефон, за да потвърдим заявката.
            </p>

            <div className="pt-4 w-full max-w-xs">
              <button
                onClick={onClose}
                className="w-full py-3.5 px-8 rounded-full bg-brand-purple text-white font-heading font-bold text-sm sm:text-base uppercase tracking-wider shadow-button hover:bg-brand-purple-hover hover:shadow-button-hover transition-all cursor-pointer active:scale-[0.98]"
              >
                КЪМ ГРАФИКА
              </button>
            </div>
          </div>
        ) : (
          /* BOOKING FORM VIEW (matching "График Десктоп.png" & "График 2 - мобилна.png" 1:1) */
          <div className="px-6 pb-6 pt-2 overflow-y-auto space-y-5">
            {/* Activity Info Card */}
            <div className="p-4 sm:p-5 rounded-2xl bg-brand-bg/80 border border-brand-purple/20 flex items-start gap-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-brand-purple/15 text-brand-purple flex items-center justify-center shrink-0 shadow-sm">
                <CategoryIcon category={schedule.category} className="w-6 h-6 sm:w-7 sm:h-7" />
              </div>
              <div className="space-y-1.5 flex-1 min-w-0">
                <h3 className="font-heading font-bold text-xl sm:text-2xl text-brand-dark leading-tight">
                  {schedule.title}
                </h3>
                <div className="space-y-1 text-xs text-brand-dark/85">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-brand-purple shrink-0" />
                    <span className="font-semibold">{displayDate}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-brand-purple shrink-0" />
                    <span>{schedule.startTime} – {schedule.endTime}</span>
                    <span className="mx-1">•</span>
                    <User className="w-3.5 h-3.5 text-brand-purple shrink-0" />
                    <span>{schedule.ageGroup}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-brand-muted">
                    <MapPin className="w-3.5 h-3.5 text-brand-purple shrink-0" />
                    <span className="truncate">{schedule.location}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              <h4 className="font-heading font-bold text-base sm:text-lg text-brand-dark">
                Запиши се за това занимание
              </h4>

              {globalError && (
                <div className="p-3 rounded-2xl bg-red-50 text-red-600 text-xs font-medium border border-red-200">
                  {globalError}
                </div>
              )}

              {/* Child Name */}
              <div>
                <label className="block text-xs font-bold text-brand-dark mb-1">
                  Име на детето
                </label>
                <input
                  type="text"
                  placeholder="Напр. Елена"
                  value={childName}
                  onChange={(e) => setChildName(e.target.value)}
                  className={cn(
                    "w-full px-4 py-2.5 rounded-2xl bg-brand-bg text-sm text-brand-dark border focus:outline-none focus:ring-2 focus:ring-brand-purple transition-all",
                    fieldErrors.childName
                      ? "border-red-400 bg-red-50/50"
                      : "border-brand-purple/20 focus:border-brand-purple"
                  )}
                />
                {fieldErrors.childName && (
                  <p className="text-red-500 text-xs mt-1">{fieldErrors.childName}</p>
                )}
              </div>

              {/* Child Age */}
              <div>
                <label className="block text-xs font-bold text-brand-dark mb-1">
                  Възраст на детето
                </label>
                <select
                  value={childAge}
                  onChange={(e) => setChildAge(e.target.value)}
                  className={cn(
                    "w-full px-4 py-2.5 rounded-2xl bg-brand-bg text-sm text-brand-dark border focus:outline-none focus:ring-2 focus:ring-brand-purple transition-all cursor-pointer",
                    fieldErrors.childAge
                      ? "border-red-400 bg-red-50/50"
                      : "border-brand-purple/20 focus:border-brand-purple"
                  )}
                >
                  {AGE_OPTIONS.map((opt, idx) => (
                    <option key={idx} value={idx === 0 ? "" : opt} disabled={idx === 0}>
                      {opt}
                    </option>
                  ))}
                </select>
                {fieldErrors.childAge && (
                  <p className="text-red-500 text-xs mt-1">{fieldErrors.childAge}</p>
                )}
              </div>

              {/* Parent Name */}
              <div>
                <label className="block text-xs font-bold text-brand-dark mb-1">
                  Име на родител
                </label>
                <input
                  type="text"
                  placeholder="Напр. Мария Петрова"
                  value={parentName}
                  onChange={(e) => setParentName(e.target.value)}
                  className={cn(
                    "w-full px-4 py-2.5 rounded-2xl bg-brand-bg text-sm text-brand-dark border focus:outline-none focus:ring-2 focus:ring-brand-purple transition-all",
                    fieldErrors.parentName
                      ? "border-red-400 bg-red-50/50"
                      : "border-brand-purple/20 focus:border-brand-purple"
                  )}
                />
                {fieldErrors.parentName && (
                  <p className="text-red-500 text-xs mt-1">{fieldErrors.parentName}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-bold text-brand-dark mb-1">
                  Телефон *
                </label>
                <input
                  type="tel"
                  placeholder="Напр. 088 123 45 67"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={cn(
                    "w-full px-4 py-2.5 rounded-2xl bg-brand-bg text-sm text-brand-dark border focus:outline-none focus:ring-2 focus:ring-brand-purple transition-all",
                    fieldErrors.phone
                      ? "border-red-400 bg-red-50/50"
                      : "border-brand-purple/20 focus:border-brand-purple"
                  )}
                />
                {fieldErrors.phone && (
                  <p className="text-red-500 text-xs mt-1">{fieldErrors.phone}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-brand-dark mb-1">
                  Имейл адрес
                </label>
                <input
                  type="email"
                  placeholder="Напр. maria@email.bg"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={cn(
                    "w-full px-4 py-2.5 rounded-2xl bg-brand-bg text-sm text-brand-dark border focus:outline-none focus:ring-2 focus:ring-brand-purple transition-all",
                    fieldErrors.email
                      ? "border-red-400 bg-red-50/50"
                      : "border-brand-purple/20 focus:border-brand-purple"
                  )}
                />
                {fieldErrors.email && (
                  <p className="text-red-500 text-xs mt-1">{fieldErrors.email}</p>
                )}
              </div>

              {/* Newsletter Consent Checkbox */}
              <div className="flex items-start gap-2.5 pt-1">
                <input
                  type="checkbox"
                  id="consentMarketing"
                  checked={consentMarketing}
                  onChange={(e) => setConsentMarketing(e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded border-gray-300 text-brand-purple focus:ring-brand-purple cursor-pointer shrink-0"
                />
                <label
                  htmlFor="consentMarketing"
                  className="text-xs text-brand-dark/80 leading-snug cursor-pointer select-none"
                >
                  Съгласявам се да получавам по имейл новини за предстоящи занимания, курсове
                  и събития на образователен клуб „УМеНИе“.
                </label>
              </div>

              {/* Privacy disclaimer */}
              <p className="text-[11px] text-brand-muted leading-relaxed">
                Предоставените данни се обработват за целите на заявката за записване съгласно{" "}
                <Link
                  href="/politika-za-poveritelnost"
                  target="_blank"
                  className="text-brand-purple underline hover:text-brand-purple-hover"
                >
                  Политиката за поверителност
                </Link>
                .
              </p>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-6 rounded-full bg-brand-purple text-white font-heading font-bold text-sm sm:text-base shadow-button hover:bg-brand-purple-hover hover:shadow-button-hover transition-all flex items-center justify-center gap-2 disabled:opacity-70 cursor-pointer active:scale-[0.98]"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Изпращане...</span>
                    </>
                  ) : (
                    <>
                      <span>Изпрати заявка</span>
                      <span>→</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
