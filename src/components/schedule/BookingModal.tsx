"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { X, Calendar, Clock, User, MapPin, Send, Loader2, CheckCircle2 } from "lucide-react";
import { ScheduleItem } from "@/lib/schedule-data";
import { createBookingAction } from "@/actions/booking";
import { cn } from "@/lib/utils";

interface BookingModalProps {
  schedule: ScheduleItem | null;
  onClose: () => void;
}

const AGE_OPTIONS = [
  "Избери възраст",
  "5 г.",
  "6 г.",
  "7 г.",
  "8 г.",
  "9 г.",
  "10 г.",
  "11 г.",
  "12+ г.",
];

export function BookingModal({ schedule, onClose }: BookingModalProps) {
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

  // Lock scroll
  useEffect(() => {
    if (schedule) {
      document.body.style.overflow = "hidden";
      // Reset form state on new schedule selection
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 bg-brand-dark/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden z-10 border border-brand-purple/20 transition-all my-8">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-brand-muted hover:text-brand-purple hover:bg-brand-purple/10 transition-colors z-20 focus:outline-none"
          aria-label="Затвори"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          /* SUCCESS VIEW (съгласно График 2 Десктоп.png) */
          <div className="p-8 sm:p-12 text-center flex flex-col items-center justify-center space-y-6 animate-fade-in">
            {/* Soft circle with airplane icon */}
            <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-brand-purple/10 flex items-center justify-center relative mb-2">
              <div className="w-16 h-16 sm:w-20 sm:h-20 text-brand-purple transform -rotate-12 flex items-center justify-center">
                <Send className="w-12 h-12 sm:w-16 sm:h-16 stroke-[1.5]" />
              </div>
            </div>

            <h2 className="font-heading font-bold text-3xl sm:text-4xl text-brand-purple tracking-wide">
              ЗАЯВКАТА Е ПРИЕТА
            </h2>

            <p className="text-brand-dark/90 text-sm sm:text-base leading-relaxed max-w-sm">
              Благодарим ви! Ще се свържем с Вас, на посочения телефон, за да потвърдим заявката.
            </p>

            <div className="pt-4 w-full">
              <button
                onClick={onClose}
                className="w-full py-3.5 px-8 rounded-full bg-brand-purple text-white font-heading font-bold text-base shadow-button hover:bg-brand-purple-hover hover:shadow-button-hover transition-all active:scale-[0.98]"
              >
                КЪМ ГРАФИКА
              </button>
            </div>
          </div>
        ) : (
          /* BOOKING FORM VIEW (съгласно График Десктоп.png) */
          <div className="p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            {/* Top Info Block */}
            <div className="pb-5 border-b border-brand-purple/15 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-brand-purple/15 text-brand-purple flex items-center justify-center font-heading font-bold text-xl shadow-sm">
                  {schedule.title.charAt(0)}
                </div>
                <div>
                  <h3 className="font-heading font-bold text-2xl text-brand-purple">
                    {schedule.title}
                  </h3>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-brand-purple-light text-brand-purple">
                    {schedule.ageGroup}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm text-brand-dark/90 pt-1">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-brand-purple shrink-0" />
                  <span>{schedule.dayName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-brand-purple shrink-0" />
                  <span>
                    {schedule.startTime} - {schedule.endTime}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-brand-purple shrink-0" />
                  <span>{schedule.ageGroup}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-brand-purple shrink-0" />
                  <span className="truncate">{schedule.location}</span>
                </div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <h4 className="font-heading font-bold text-lg text-brand-dark">
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
                  Име на детето *
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
                  Възраст на детето *
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
                  Име на родител *
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
                  Имейл адрес <span className="text-brand-muted font-normal">(по избор)</span>
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

              {/* Checkbox: Marketing Consent */}
              <div className="flex items-start gap-2.5 pt-2">
                <input
                  type="checkbox"
                  id="consentMarketing"
                  checked={consentMarketing}
                  onChange={(e) => setConsentMarketing(e.target.checked)}
                  className="w-4 h-4 mt-1 rounded border-gray-300 text-brand-purple focus:ring-brand-purple cursor-pointer shrink-0"
                />
                <label
                  htmlFor="consentMarketing"
                  className="text-xs text-brand-dark/80 leading-snug cursor-pointer select-none"
                >
                  Съгласявам се да получавам по имейл новини за предстоящи занимания, курсове
                  и събития на образователен клуб „УМеНИе“.
                </label>
              </div>

              {/* GDPR disclaimer text */}
              <p className="text-[11px] text-brand-muted leading-relaxed pt-1">
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
              <div className="pt-3">
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
