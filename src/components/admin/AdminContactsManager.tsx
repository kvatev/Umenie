"use client";

import React, { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Phone,
  MapPin,
  Mail,
  Share2,
  Save,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  RotateCcw,
  Sparkles,
  Globe,
  Info,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { SiteSettings, DEFAULT_SETTINGS, normalizePhoneNumber } from "@/lib/types/site-settings";
import { updateSiteSettingsAction } from "@/actions/admin-settings";
import { cn } from "@/lib/utils";

interface AdminContactsManagerProps {
  initialSettings: SiteSettings;
}

export function AdminContactsManager({ initialSettings }: AdminContactsManagerProps) {
  const [formData, setFormData] = useState<SiteSettings>(initialSettings);
  const [phoneInput, setPhoneInput] = useState<string>(() => {
    return initialSettings.phoneDisplay || initialSettings.phoneFull || initialSettings.phoneRaw || "";
  });
  const [showAdvancedPhone, setShowAdvancedPhone] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleSinglePhoneChange = (value: string) => {
    setPhoneInput(value);
    const normalized = normalizePhoneNumber(value);
    setFormData((prev) => ({
      ...prev,
      phoneDisplay: normalized.phoneDisplay || value,
      phoneFull: normalized.phoneFull || value,
      phoneRaw: normalized.phoneRaw || value.replace(/\s+/g, ""),
    }));
  };

  const handlePhoneBlur = () => {
    if (!phoneInput.trim()) return;
    const normalized = normalizePhoneNumber(phoneInput);
    if (normalized.phoneDisplay) {
      setPhoneInput(normalized.phoneDisplay);
      setFormData((prev) => ({
        ...prev,
        phoneDisplay: normalized.phoneDisplay,
        phoneFull: normalized.phoneFull,
        phoneRaw: normalized.phoneRaw,
      }));
    }
  };

  const handleChange = (field: keyof SiteSettings, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleReset = () => {
    if (confirm("Сигурни ли сте, че искате да върнете стандартните данни за контакти?")) {
      setFormData(DEFAULT_SETTINGS);
      setPhoneInput(DEFAULT_SETTINGS.phoneDisplay);
      setStatusMessage({
        type: "success",
        text: "Полетата бяха попълнени със стандартните стойности. Натиснете „Запази промените“, за да ги приложите.",
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    startTransition(async () => {
      const res = await updateSiteSettingsAction(formData);
      if (res.success) {
        setStatusMessage({ type: "success", text: res.message });
      } else {
        setStatusMessage({ type: "error", text: res.message || "Грешка при запис." });
      }
    });
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
      {/* LEFT COLUMN: EDIT FORM (7 COLS) */}
      <div className="xl:col-span-7 bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-brand-purple/15">
        <div className="flex items-center justify-between pb-6 border-b border-gray-100">
          <div>
            <span className="text-xs font-bold text-brand-purple uppercase tracking-wider flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5" /> Контакти & Социални мрежи
            </span>
            <h2 className="font-heading font-bold text-xl sm:text-2xl text-brand-dark mt-1">
              Редакция на контактната информация
            </h2>
            <p className="text-xs sm:text-sm text-brand-muted mt-0.5">
              Промените се отразяват мигновено в хедъра, футъра, контактните банери и мобилното меню.
            </p>
          </div>

          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-brand-muted hover:text-brand-purple hover:bg-brand-purple/5 transition-all cursor-pointer"
            title="Възстанови стандартните"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">По подразбиране</span>
          </button>
        </div>

        {statusMessage && (
          <div
            className={cn(
              "mt-6 p-4 rounded-2xl flex items-center gap-3 text-sm font-medium",
              statusMessage.type === "success"
                ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                : "bg-rose-50 text-rose-800 border border-rose-200"
            )}
          >
            {statusMessage.type === "success" ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          {/* SECTION 1: ТЕЛЕФОНЕН НОМЕР */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-bold text-sm sm:text-base text-brand-purple flex items-center gap-2">
                <Phone className="w-4 h-4" /> 1. Телефонен номер
              </h3>
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                Синхронизира се навсякъде
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-brand-dark mb-1.5">
                Основен телефонен номер на центъра
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={phoneInput}
                  onChange={(e) => handleSinglePhoneChange(e.target.value)}
                  onBlur={handlePhoneBlur}
                  placeholder="напр. 0877 488 481 или +359 877 488 481"
                  required
                  className="w-full pl-11 pr-4 py-3 rounded-2xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/20 transition-all text-base font-semibold text-brand-dark tracking-wide placeholder:font-normal placeholder:text-gray-400 shadow-xs"
                />
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 p-1.5 rounded-xl bg-brand-purple/10 text-brand-purple">
                  <Phone className="w-4 h-4" />
                </div>
              </div>
              <p className="text-[11px] text-brand-muted mt-1.5 flex items-center gap-1">
                <Info className="w-3.5 h-3.5 text-brand-purple shrink-0" />
                <span>
                  Въвежда се само на едно място. Системата автоматично го обновява във всички бутони, мобилното меню, футъра и линковете за обаждане.
                </span>
              </p>
            </div>

            {/* LIVE AUTO-GENERATED FORMATS PREVIEW */}
            <div className="p-3.5 rounded-2xl bg-brand-purple/5 border border-brand-purple/15 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-brand-purple flex items-center gap-1.5 text-xs">
                  <Sparkles className="w-3.5 h-3.5 text-brand-purple" />
                  Автоматично генерирани формати за сайта:
                </span>
                <button
                  type="button"
                  onClick={() => setShowAdvancedPhone(!showAdvancedPhone)}
                  className="text-[11px] font-semibold text-brand-purple hover:underline flex items-center gap-0.5 cursor-pointer"
                >
                  <span>{showAdvancedPhone ? "Скрий ръчните" : "Ръчни настройки"}</span>
                  {showAdvancedPhone ? (
                    <ChevronUp className="w-3 h-3" />
                  ) : (
                    <ChevronDown className="w-3 h-3" />
                  )}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-[11px]">
                <div className="bg-white/90 p-2.5 rounded-xl border border-brand-purple/10 shadow-xs">
                  <span className="text-[10px] text-brand-muted block font-medium">Бутони & Навигация:</span>
                  <span className="font-bold text-brand-dark truncate block mt-0.5">
                    {formData.phoneDisplay || "—"}
                  </span>
                </div>
                <div className="bg-white/90 p-2.5 rounded-xl border border-brand-purple/10 shadow-xs">
                  <span className="text-[10px] text-brand-muted block font-medium">Футър (международен):</span>
                  <span className="font-bold text-brand-dark truncate block mt-0.5">
                    {formData.phoneFull || "—"}
                  </span>
                </div>
                <div className="bg-white/90 p-2.5 rounded-xl border border-brand-purple/10 shadow-xs">
                  <span className="text-[10px] text-brand-muted block font-medium">Директно набиране (tel:):</span>
                  <span className="font-mono font-bold text-brand-purple truncate block mt-0.5">
                    {formData.phoneRaw || "—"}
                  </span>
                </div>
              </div>
            </div>

            {/* OPTIONAL ADVANCED MANUAL OVERRIDE */}
            {showAdvancedPhone && (
              <div className="mt-3 p-4 rounded-2xl bg-gray-50 border border-dashed border-gray-300 space-y-3">
                <div className="text-xs font-bold text-brand-dark">
                  Ръчна фина настройка на отделните формати (по избор):
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-brand-dark mb-1">
                      Формат за показване (бутони & хедър)
                    </label>
                    <input
                      type="text"
                      value={formData.phoneDisplay}
                      onChange={(e) => handleChange("phoneDisplay", e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-gray-200 text-xs font-medium text-brand-dark"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-brand-dark mb-1">
                      Пълен формат за футъра
                    </label>
                    <input
                      type="text"
                      value={formData.phoneFull}
                      onChange={(e) => handleChange("phoneFull", e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-gray-200 text-xs font-medium text-brand-dark"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-brand-dark mb-1">
                    Технически линк за набиране (<code className="text-brand-purple">tel:</code>)
                  </label>
                  <input
                    type="text"
                    value={formData.phoneRaw}
                    onChange={(e) => handleChange("phoneRaw", e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-gray-200 text-xs font-mono font-medium text-brand-dark"
                  />
                </div>
              </div>
            )}
          </div>

          <hr className="border-gray-100" />

          {/* SECTION 2: АДРЕС И ЛОКАЦИЯ */}
          <div className="space-y-4">
            <h3 className="font-heading font-bold text-sm sm:text-base text-brand-purple flex items-center gap-2">
              <MapPin className="w-4 h-4" /> 2. Адрес и Локация
            </h3>

            <div>
              <label className="block text-xs font-bold text-brand-dark mb-1">
                Пълен адрес (за футъра)
              </label>
              <input
                type="text"
                value={formData.locationFull}
                onChange={(e) => handleChange("locationFull", e.target.value)}
                placeholder="ж.к. Славейков, блок 48, партер"
                required
                className="w-full px-4 py-2.5 rounded-2xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/20 transition-all text-sm font-medium text-brand-dark"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-brand-dark mb-1">
                  Кратък адрес (за горната лента и банерите)
                </label>
                <input
                  type="text"
                  value={formData.locationShort}
                  onChange={(e) => handleChange("locationShort", e.target.value)}
                  placeholder="Бургас, Славейков, бл. 48"
                  required
                  className="w-full px-4 py-2.5 rounded-2xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/20 transition-all text-sm font-medium text-brand-dark"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-dark mb-1">
                  Линк към Google Maps
                </label>
                <input
                  type="url"
                  value={formData.googleMapsUrl}
                  onChange={(e) => handleChange("googleMapsUrl", e.target.value)}
                  placeholder="https://maps.google.com/?q=..."
                  required
                  className="w-full px-4 py-2.5 rounded-2xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/20 transition-all text-sm font-medium text-brand-dark"
                />
              </div>
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* SECTION 3: ИМЕЙЛ И СЛОГАН */}
          <div className="space-y-4">
            <h3 className="font-heading font-bold text-sm sm:text-base text-brand-purple flex items-center gap-2">
              <Mail className="w-4 h-4" /> 3. Имейл адрес & Слоган
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-brand-dark mb-1">
                  Официален имейл за запитвания
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="umenie48@gmail.com"
                  required
                  className="w-full px-4 py-2.5 rounded-2xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/20 transition-all text-sm font-medium text-brand-dark"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-dark mb-1">
                  Девиз / Слоган под логото
                </label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => handleChange("tagline", e.target.value)}
                  placeholder="Уроци, курсове и занимания за успешни деца"
                  required
                  className="w-full px-4 py-2.5 rounded-2xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/20 transition-all text-sm font-medium text-brand-dark"
                />
              </div>
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* SECTION 4: СОЦИАЛНИ МРЕЖИ */}
          <div className="space-y-4">
            <h3 className="font-heading font-bold text-sm sm:text-base text-brand-purple flex items-center gap-2">
              <Share2 className="w-4 h-4" /> 4. Социални мрежи
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-brand-dark mb-1 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-600 inline-block" /> Facebook страница
                </label>
                <input
                  type="url"
                  value={formData.facebookUrl}
                  onChange={(e) => handleChange("facebookUrl", e.target.value)}
                  placeholder="https://www.facebook.com/..."
                  required
                  className="w-full px-4 py-2.5 rounded-2xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/20 transition-all text-sm font-medium text-brand-dark"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-dark mb-1 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-pink-600 inline-block" /> Instagram профил
                </label>
                <input
                  type="url"
                  value={formData.instagramUrl}
                  onChange={(e) => handleChange("instagramUrl", e.target.value)}
                  placeholder="https://www.instagram.com/..."
                  required
                  className="w-full px-4 py-2.5 rounded-2xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/20 transition-all text-sm font-medium text-brand-dark"
                />
              </div>
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isPending}
              className={cn(
                "w-full sm:w-auto px-8 py-3.5 rounded-full font-heading font-bold text-sm text-white shadow-button transition-all flex items-center justify-center gap-2 cursor-pointer",
                isPending
                  ? "bg-brand-purple/70 cursor-not-allowed"
                  : "bg-brand-purple hover:bg-brand-purple-hover hover:shadow-button-hover active:scale-[0.98]"
              )}
            >
              <Save className="w-4 h-4" />
              <span>{isPending ? "Запазване на промените..." : "Запази промените"}</span>
            </button>
          </div>
        </form>
      </div>

      {/* RIGHT COLUMN: LIVE WEBSITE MOCKUPS (5 COLS) */}
      <div className="xl:col-span-5 space-y-6 xl:sticky xl:top-6">
        {/* HEADER OF MOCKUP SECTION */}
        <div className="bg-white rounded-3xl p-6 shadow-card border border-brand-purple/15 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
              <h3 className="font-heading font-bold text-sm sm:text-base text-brand-dark">
                Отрязък от сайта на живо
              </h3>
            </div>
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-brand-purple/10 text-brand-purple">
              В реално време
            </span>
          </div>

          <p className="text-xs text-brand-muted font-sans">
            Докато попълвате формата отляво, този отрязък веднага визуализира как точно ще изглежда уебсайтът за Вашите посетители.
          </p>
        </div>

        {/* 1. FOOTER LIVE MOCKUP (Exact replica of user screenshot) */}
        <div className="bg-white rounded-3xl overflow-hidden shadow-card border border-brand-purple/15">
          <div className="bg-gray-100 px-4 py-2.5 border-b border-gray-200 flex items-center justify-between text-xs text-brand-dark/70 font-mono">
            <span className="font-bold flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-400 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-400 inline-block" />
              <span className="ml-1 text-[11px]">Футър (Долна част на сайта)</span>
            </span>
            <span className="text-[10px] text-gray-500 font-sans">umenie.net/#footer</span>
          </div>

          <div className="bg-[#f1f2f6] p-5 sm:p-6 border-b border-brand-purple/10">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-start">
              {/* Left: Contacts */}
              <div className="space-y-3">
                <h4 className="font-heading font-bold text-xs sm:text-sm text-brand-purple tracking-wide uppercase">
                  КОНТАКТИ
                </h4>
                <ul className="space-y-2.5 text-xs font-medium text-brand-dark">
                  <li className="flex items-center gap-2">
                    <span className="p-1.5 rounded-full bg-brand-purple/10 text-brand-purple shrink-0">
                      <Phone className="w-3 h-3" />
                    </span>
                    <span className="font-semibold text-brand-dark truncate">
                      {formData.phoneFull || "—"}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="p-1.5 rounded-full bg-brand-purple/10 text-brand-purple shrink-0 mt-0.5">
                      <MapPin className="w-3 h-3" />
                    </span>
                    <span className="uppercase text-[11px] font-semibold leading-tight text-brand-dark/90">
                      {formData.locationFull || "—"}
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="p-1.5 rounded-full bg-brand-purple/10 text-brand-purple shrink-0">
                      <Mail className="w-3 h-3" />
                    </span>
                    <span className="uppercase text-[10px] font-semibold tracking-wide text-brand-dark truncate">
                      {formData.email || "—"}
                    </span>
                  </li>
                </ul>
              </div>

              {/* Center: Brand & Socials */}
              <div className="flex flex-col items-center justify-center text-center space-y-2">
                <div className="relative h-10 w-28">
                  <Image
                    src="/images/logo.webp"
                    alt="УМеНИе"
                    fill
                    className="object-contain"
                  />
                </div>
                <p className="text-[11px] text-brand-muted font-medium line-clamp-2 leading-tight">
                  {formData.tagline || "—"}
                </p>
                <div className="flex items-center gap-3 pt-1">
                  <a
                    href={formData.facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={formData.facebookUrl}
                    className="relative w-8 h-8 rounded-full p-1.5 bg-brand-purple/10 text-brand-purple hover:bg-brand-purple hover:text-white transition-all shadow-sm"
                  >
                    <Image
                      src="/images/fb.webp"
                      alt="Facebook"
                      fill
                      className="object-contain p-1"
                    />
                  </a>
                  <a
                    href={formData.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={formData.instagramUrl}
                    className="relative w-8 h-8 rounded-full p-1.5 bg-brand-purple/10 text-brand-purple hover:bg-brand-purple hover:text-white transition-all shadow-sm"
                  >
                    <Image
                      src="/images/ig.webp"
                      alt="Instagram"
                      fill
                      className="object-contain p-1"
                    />
                  </a>
                </div>
              </div>

              {/* Right: Quick Links */}
              <div className="space-y-2 text-right hidden sm:block">
                <h4 className="font-heading font-bold text-xs sm:text-sm text-brand-purple tracking-wide uppercase">
                  БЪРЗИ ВРЪЗКИ
                </h4>
                <div className="space-y-1 text-[11px] font-semibold text-brand-dark/70 uppercase">
                  <p>ПОЛИТИКА ЗА ПОВЕРИТЕЛНОСТ</p>
                  <p>ОБЩИ УСЛОВИЯ</p>
                  <p>ЗА НАС</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. HEADER LIVE MOCKUP */}
        <div className="bg-white rounded-3xl overflow-hidden shadow-card border border-brand-purple/15">
          <div className="bg-gray-100 px-4 py-2.5 border-b border-gray-200 flex items-center justify-between text-xs text-brand-dark/70 font-mono">
            <span className="font-bold flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-purple inline-block" />
              <span className="ml-1 text-[11px]">Хедър (Горна навигационна лента)</span>
            </span>
            <span className="text-[10px] text-gray-500 font-sans">umenie.net/#header</span>
          </div>

          <div className="bg-[#f1f2f6] border-b border-brand-purple/15">
            {/* Micro top bar */}
            <div className="bg-[#887ed8]/10 border-b border-[#887ed8]/15 px-4 py-1 text-[10px] flex items-center justify-between text-brand-dark font-medium">
              <div className="flex items-center gap-2 truncate">
                <span className="flex items-center gap-1 text-brand-purple font-bold">
                  <MapPin className="w-3 h-3" />
                  <span>{formData.locationShort || "—"}</span>
                </span>
                <span className="text-brand-purple/30">•</span>
                <span className="text-brand-muted truncate">{formData.tagline || "—"}</span>
              </div>
              <span className="flex items-center gap-1 font-bold text-brand-dark shrink-0">
                <Phone className="w-3 h-3 text-brand-purple" />
                <span>{formData.phoneDisplay || "—"}</span>
              </span>
            </div>

            {/* Main nav bar mockup */}
            <div className="px-4 py-2.5 flex items-center justify-between bg-white/70 backdrop-blur-sm">
              <div className="relative h-8 w-24">
                <Image
                  src="/images/logo.webp"
                  alt="УМеНИе"
                  fill
                  className="object-contain"
                />
              </div>

              <div className="flex items-center gap-2">
                <div className="hidden sm:flex items-center gap-1.5 text-[10px] font-bold text-brand-dark">
                  <span className="px-2 py-0.5 rounded-full bg-brand-purple/10 text-brand-purple">НАЧАЛО</span>
                  <span className="px-2 py-0.5">УСЛУГИ</span>
                  <span className="px-2 py-0.5">ЗА НАС</span>
                  <span className="px-2 py-0.5">ГРАФИК</span>
                </div>

                <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-brand-purple text-white font-heading font-bold text-[10px] shadow-sm">
                  <Phone className="w-2.5 h-2.5" />
                  <span>{formData.phoneDisplay || "—"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
