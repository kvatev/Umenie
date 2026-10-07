"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  X,
  Calendar,
  Clock,
  User,
  MapPin,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import { ScheduleItem } from "@/lib/schedule-data";
import { createBookingAction } from "@/actions/booking";
import { getActivityIcon } from "@/lib/schedule-icons";
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

  const handleCloseAndReset = () => {
    setChildName("");
    setChildAge("");
    setParentName("");
    setPhone("");
    setEmail("");
    setConsentMarketing(false);
    setIsSuccess(false);
    setFieldErrors({});
    setGlobalError(null);
    onClose();
  };

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
    if (!phone.trim()) {
      errors.phone = "Моля, въведете телефонен номер (задължително)";
    } else {
      const cleanPhone = phone.replace(/[\s\-()]/g, "");
      const bgRegex = /^(\+359|0)[0-9]{9}$/;
      if (!bgRegex.test(cleanPhone)) {
        errors.phone = "Невалиден български телефон (напр. 0881234567 или +359881234567)";
      }
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
        onClick={handleCloseAndReset}
        aria-hidden="true"
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-lg bg-white rounded-3xl sm:rounded-4xl shadow-2xl overflow-hidden z-10 border border-brand-purple/20 transition-all my-auto max-h-[92vh] flex flex-col">
        {/* Top Header bar with close button & mobile back link */}
        <div className="flex items-center justify-between px-6 pt-5 pb-2">
          <button
            onClick={handleCloseAndReset}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-purple hover:underline cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Към графика</span>
          </button>

          <button
            onClick={handleCloseAndReset}
            className="p-1.5 rounded-full text-brand-muted hover:text-brand-purple hover:bg-brand-purple/10 transition-colors cursor-pointer"
            aria-label="Затвори"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          /* CONFIRMATION SCREEN (matching "График 2 Десктоп.png" & "График 3 - мобилна.png" 1:1) */
          <div className="p-8 sm:p-12 text-center flex flex-col items-center justify-center animate-fade-in overflow-y-auto">
            {/* Center container for success / sent confirmation icon */}
            <div className="relative w-32 h-32 sm:w-40 sm:h-40 mx-auto mb-6 flex items-center justify-center">
              <Image
                src="/images/icons/izprateno.png"
                alt="Заявката е приета"
                width={160}
                height={160}
                priority
                className="object-contain"
              />
            </div>

            <h2 className="font-heading font-bold text-2xl sm:text-4xl text-brand-purple tracking-wide uppercase">
              ЗАЯВКАТА Е ПРИЕТА
            </h2>

            <p className="text-brand-dark/90 text-sm sm:text-base leading-relaxed max-w-sm font-sans mt-3">
              Благодарим ви! Ще се свържем с Вас, на посочения телефон, за да потвърдим заявката.
            </p>

            <div className="pt-6 w-full max-w-xs">
              <button
                onClick={handleCloseAndReset}
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
            <div className="p-4 sm:p-5 rounded-2xl bg-brand-bg/80 border border-brand-purple/20 flex items-center gap-4">
              <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden shrink-0 shadow-sm border border-brand-purple/20 bg-white flex items-center justify-center">
                <Image
                  src={getActivityIcon(schedule.title, schedule.category)}
                  alt={schedule.title}
                  width={64}
                  height={64}
                  priority
                  className="w-full h-full object-contain"
                />
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
              <h4 className="font-heading font-bold text-base sm:text-lg text-brand-dark uppercase tracking-wide">
                ЗАПИШИ СЕ ЗА ТОВА ЗАНИМАНИЕ
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
                  required
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
