"use client";

import React, { useState, useTransition } from "react";
import Image from "next/image";
import {
  Save,
  Upload,
  Trash2,
  Plus,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Layers,
  Sparkles,
  Info,
} from "lucide-react";
import { SERVICES_DATA, ServiceData } from "@/lib/services-data";
import { ServiceOverride, SiteSettings } from "@/lib/types/site-settings";
import {
  saveServiceContentAction,
  uploadServiceImageAction,
  deleteServiceSliderImageAction,
} from "@/actions/admin-services";
import { getActivityIcon } from "@/lib/schedule-icons";
import { cn } from "@/lib/utils";

interface ServicesPageEditorProps {
  initialSettings: SiteSettings;
}

export function ServicesPageEditor({ initialSettings }: ServicesPageEditorProps) {
  const [selectedSlug, setSelectedSlug] = useState<string>("urotsi-i-kursove");
  const [overrides, setOverrides] = useState<Record<string, ServiceOverride>>(
    initialSettings.servicesOverrides || {}
  );
  const [isPending, startTransition] = useTransition();
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // File upload state for page-1 and page-2
  const [uploadingType, setUploadingType] = useState<string | null>(null);

  // Get active service merged with override
  const baseService = SERVICES_DATA.find((s) => s.slug === selectedSlug) || SERVICES_DATA[0];
  const activeOverride = overrides[selectedSlug] || {};

  // Local form state for currently selected service
  const currentTitle = activeOverride.title ?? baseService.title;
  const currentShortTitle = activeOverride.shortTitle ?? baseService.shortTitle;
  const currentSloganPart1 = activeOverride.sloganPart1 ?? baseService.sloganPart1;
  const currentSloganPart2 = activeOverride.sloganPart2 ?? baseService.sloganPart2;
  const currentIntro = activeOverride.intro ?? baseService.intro;
  const currentBullets = activeOverride.bulletPoints ?? baseService.bulletPoints;
  const currentPage1 = activeOverride.pageImages?.[0] || baseService.pageImages[0];
  const currentPage2 = activeOverride.pageImages?.[1] || baseService.pageImages[1] || baseService.pageImages[0];
  const currentSliderImages = activeOverride.sliderImages ?? baseService.sliderImages;
  const currentGalleryTitle = activeOverride.galleryTitle ?? baseService.galleryTitle;
  const currentHasSlider = activeOverride.hasSlider !== undefined ? activeOverride.hasSlider : baseService.hasSlider;

  const updateCurrentOverride = (partial: Partial<ServiceOverride>) => {
    setOverrides((prev) => ({
      ...prev,
      [selectedSlug]: {
        ...(prev[selectedSlug] || {}),
        ...partial,
      },
    }));
  };

  const handleSaveTextChanges = () => {
    setStatusMessage(null);
    startTransition(async () => {
      const dataToSave: ServiceOverride = {
        title: currentTitle,
        shortTitle: currentShortTitle,
        sloganPart1: currentSloganPart1,
        sloganPart2: currentSloganPart2,
        intro: currentIntro,
        bulletPoints: currentBullets,
        galleryTitle: currentGalleryTitle,
        hasSlider: currentHasSlider,
      };

      const res = await saveServiceContentAction(selectedSlug, dataToSave);
      if (res.success) {
        setStatusMessage({ type: "success", text: "Промените бяха запазени успешно и приложени на живо!" });
      } else {
        setStatusMessage({ type: "error", text: res.message || "Грешка при запазване." });
      }
    });
  };

  const handleToggleSlider = (newVal: boolean) => {
    updateCurrentOverride({ hasSlider: newVal });
    setStatusMessage(null);
    startTransition(async () => {
      const dataToSave: ServiceOverride = {
        title: currentTitle,
        shortTitle: currentShortTitle,
        sloganPart1: currentSloganPart1,
        sloganPart2: currentSloganPart2,
        intro: currentIntro,
        bulletPoints: currentBullets,
        galleryTitle: currentGalleryTitle,
        hasSlider: newVal,
      };

      const res = await saveServiceContentAction(selectedSlug, dataToSave);
      if (res.success) {
        setStatusMessage({
          type: "success",
          text: newVal
            ? `Слайдърът с галерия за „${baseService.shortTitle}“ е ВКЛЮЧЕН успешно!`
            : `Слайдърът с галерия за „${baseService.shortTitle}“ е ИЗКЛЮЧЕН успешно!`,
        });
      } else {
        setStatusMessage({ type: "error", text: res.message || "Грешка при промяна на слайдъра." });
      }
    });
  };

  const handleImageUpload = (
    imageType: "page-1" | "page-2" | "slider",
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];

    setUploadingType(imageType);
    setStatusMessage(null);

    startTransition(async () => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("slug", selectedSlug);
      formData.append("imageType", imageType);

      const res = await uploadServiceImageAction(formData);
      setUploadingType(null);

      if (res.success && res.url) {
        if (imageType === "page-1") {
          updateCurrentOverride({
            pageImages: [res.url, currentPage2],
          });
        } else if (imageType === "page-2") {
          updateCurrentOverride({
            pageImages: [currentPage1, res.url],
          });
        } else if (imageType === "slider") {
          updateCurrentOverride({
            sliderImages: [...currentSliderImages, res.url],
          });
        }
        setStatusMessage({ type: "success", text: res.message || "Снимката е качена успешно!" });
      } else {
        setStatusMessage({ type: "error", text: res.message || "Грешка при качване на снимката." });
      }
    });
  };

  const handleDeleteSliderImage = (imageUrl: string) => {
    if (!confirm("Сигурни ли сте, че искате да премахнете тази снимка от слайдъра?")) return;
    startTransition(async () => {
      const res = await deleteServiceSliderImageAction(selectedSlug, imageUrl);
      if (res.success) {
        updateCurrentOverride({
          sliderImages: currentSliderImages.filter((img) => img !== imageUrl),
        });
        setStatusMessage({ type: "success", text: "Снимката от слайдъра е изтрита успешно." });
      } else {
        setStatusMessage({ type: "error", text: res.message || "Грешка при изтриване." });
      }
    });
  };

  const handleBulletChange = (index: number, value: string) => {
    const updated = [...currentBullets];
    updated[index] = value;
    updateCurrentOverride({ bulletPoints: updated });
  };

  const handleAddBullet = () => {
    updateCurrentOverride({
      bulletPoints: [...currentBullets, "Нова акцентна точка..."],
    });
  };

  const handleRemoveBullet = (index: number) => {
    const updated = currentBullets.filter((_, i) => i !== index);
    updateCurrentOverride({ bulletPoints: updated });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-brand-purple uppercase tracking-wider">
            Редактор на съдържание
          </span>
          <h1 className="font-heading font-bold text-2xl sm:text-3xl text-brand-dark mt-1">
            Страница: Услуги и занимания
          </h1>
          <p className="text-brand-muted text-xs sm:text-sm font-sans mt-0.5">
            Редактирайте текстовете, слоганите, булетите и снимките на всяка от 6-те основни дейности.
          </p>
        </div>

        <a
          href={`/uslugi/${selectedSlug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-brand-bg text-brand-purple font-heading font-bold text-xs hover:bg-brand-purple/10 transition-all border border-brand-purple/20 self-start sm:self-auto"
        >
          <span>Преглед на живо</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Service Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {SERVICES_DATA.map((srv) => {
          const isSelected = srv.slug === selectedSlug;
          const iconUrl = getActivityIcon(srv.title);

          return (
            <button
              key={srv.slug}
              type="button"
              onClick={() => {
                setSelectedSlug(srv.slug);
                setStatusMessage(null);
              }}
              className={cn(
                "p-3 rounded-2xl border text-left transition-all flex flex-col justify-between space-y-2 cursor-pointer",
                isSelected
                  ? "bg-brand-purple text-white border-brand-purple shadow-button scale-[1.02]"
                  : "bg-white text-brand-dark border-brand-purple/15 hover:border-brand-purple hover:bg-brand-purple/5"
              )}
            >
              <div className="flex items-center justify-between">
                <div className="relative w-8 h-8 rounded-full overflow-hidden bg-white/20 shrink-0 border border-white/20 flex items-center justify-center">
                  <Image src={iconUrl} alt={srv.shortTitle} width={32} height={32} className="object-contain" />
                </div>
                {(() => {
                  const srvHasSlider = overrides[srv.slug]?.hasSlider !== undefined
                    ? overrides[srv.slug].hasSlider
                    : srv.hasSlider;
                  return (
                    <span
                      className={cn(
                        "text-[9px] font-bold px-1.5 py-0.5 rounded-md",
                        isSelected
                          ? "bg-white/20 text-white"
                          : srvHasSlider
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-slate-100 text-slate-400"
                      )}
                    >
                      {srvHasSlider ? "Слайдър" : "Без слайдър"}
                    </span>
                  );
                })()}
              </div>
              <div>
                <p className={cn("font-heading font-bold text-xs line-clamp-1", isSelected ? "text-white" : "text-brand-dark")}>
                  {srv.shortTitle}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {statusMessage && (
        <div
          className={cn(
            "p-4 rounded-2xl flex items-center gap-2 text-xs font-medium border animate-fade-in",
            statusMessage.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-red-50 text-red-800 border-red-200"
          )}
        >
          {statusMessage.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Editor Content for Selected Service */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-card border border-brand-purple/15 space-y-8">
        {/* Section 1: Texts & Slogans */}
        <div className="space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-brand-purple/10">
            <div>
              <h2 className="font-heading font-bold text-lg text-brand-dark">
                1. Текстове и Слогани ({baseService.shortTitle})
              </h2>
              <p className="text-xs text-brand-muted">
                Тези текстове се визуализират в горната виолетова карта на страницата на услугата.
              </p>
            </div>
            <button
              type="button"
              onClick={handleSaveTextChanges}
              disabled={isPending}
              className="px-5 py-2.5 rounded-full bg-brand-purple text-white font-heading font-bold text-xs uppercase tracking-wider shadow-button hover:bg-brand-purple-hover transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>Запази промените</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-brand-dark mb-1">
                Главно заглавие (Title)
              </label>
              <input
                type="text"
                value={currentTitle}
                onChange={(e) => updateCurrentOverride({ title: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-brand-purple/20 text-xs font-heading font-bold text-brand-dark focus:ring-2 focus:ring-brand-purple focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-brand-dark mb-1">
                Кратко заглавие (Badge)
              </label>
              <input
                type="text"
                value={currentShortTitle}
                onChange={(e) => updateCurrentOverride({ shortTitle: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-brand-purple/20 text-xs text-brand-dark focus:ring-2 focus:ring-brand-purple focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-brand-dark mb-1">
                Слоган - Част 1 (Горе)
              </label>
              <input
                type="text"
                value={currentSloganPart1}
                onChange={(e) => updateCurrentOverride({ sloganPart1: e.target.value })}
                placeholder="напр. Днес е урок."
                className="w-full px-4 py-2.5 rounded-xl border border-brand-purple/20 text-xs text-brand-dark focus:ring-2 focus:ring-brand-purple focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-brand-dark mb-1">
                Слоган - Част 2 (Удебелен акцент)
              </label>
              <input
                type="text"
                value={currentSloganPart2}
                onChange={(e) => updateCurrentOverride({ sloganPart2: e.target.value })}
                placeholder="напр. Утре е увереността..."
                className="w-full px-4 py-2.5 rounded-xl border border-brand-purple/20 text-xs font-bold text-brand-dark focus:ring-2 focus:ring-brand-purple focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-brand-dark mb-1">
              Въвеждащ текст (Intro Narrative)
            </label>
            <textarea
              rows={3}
              value={currentIntro}
              onChange={(e) => updateCurrentOverride({ intro: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-brand-purple/20 text-xs text-brand-dark focus:ring-2 focus:ring-brand-purple focus:outline-none leading-relaxed"
            />
          </div>
        </div>

        {/* Section 2: Bullet Points */}
        <div className="space-y-4 pt-4 border-t border-brand-purple/10">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-heading font-bold text-base text-brand-dark">
                2. Акцентни точки с крушка (Bullet Points)
              </h3>
              <p className="text-xs text-brand-muted">
                Използвайте **текст** за удебеляване на ключови думи (напр. **малки групи**).
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddBullet}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-brand-purple/10 text-brand-purple hover:bg-brand-purple hover:text-white transition-all text-xs font-bold cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Добави булет</span>
            </button>
          </div>

          <div className="space-y-2.5">
            {currentBullets.map((bullet, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div className="relative w-6 h-6 shrink-0">
                  <Image src="/images/bulb.webp" alt="" fill className="object-contain" />
                </div>
                <input
                  type="text"
                  value={bullet}
                  onChange={(e) => handleBulletChange(idx, e.target.value)}
                  className="flex-1 px-3.5 py-2 rounded-xl border border-brand-purple/20 text-xs text-brand-dark focus:ring-2 focus:ring-brand-purple focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveBullet(idx)}
                  className="p-2 rounded-xl text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                  title="Премахни"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Page Images (page-1 portrait & page-2 landscape) */}
        <div className="space-y-4 pt-4 border-t border-brand-purple/10">
          <div>
            <h3 className="font-heading font-bold text-base text-brand-dark">
              3. Основни снимки на страницата (2x2 Hero Grid)
            </h3>
            <p className="text-xs text-brand-muted">
              Управлявайте двете основни снимки: вертикален портрет (`page-1.webp`) и хоризонтален пейзаж (`page-2.webp`).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* page-1 portrait */}
            <div className="p-4 rounded-2xl bg-brand-bg/50 border border-brand-purple/15 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-brand-dark">Снимка 1: Портрет (4:5)</span>
                <span className="text-[10px] text-brand-muted">page-1.webp</span>
              </div>
              <div className="relative aspect-[4/5] w-full rounded-xl overflow-hidden bg-slate-200 border border-brand-purple/20">
                <Image src={currentPage1} alt="page-1" fill className="object-cover" />
              </div>
              <div>
                <label className="inline-flex items-center gap-2 w-full justify-center px-4 py-2 rounded-xl bg-brand-purple/10 text-brand-purple hover:bg-brand-purple hover:text-white transition-all text-xs font-heading font-bold cursor-pointer">
                  {uploadingType === "page-1" ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Upload className="w-4 h-4" />
                  )}
                  <span>Смени снимка 1 (Портрет)</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload("page-1", e)}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* page-2 landscape */}
            <div className="p-4 rounded-2xl bg-brand-bg/50 border border-brand-purple/15 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-brand-dark">Снимка 2: Пейзаж (16:9)</span>
                <span className="text-[10px] text-brand-muted">page-2.webp</span>
              </div>
              <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden bg-slate-200 border border-brand-purple/20">
                <Image src={currentPage2} alt="page-2" fill className="object-cover" />
              </div>
              <div>
                <label className="inline-flex items-center gap-2 w-full justify-center px-4 py-2 rounded-xl bg-brand-purple/10 text-brand-purple hover:bg-brand-purple hover:text-white transition-all text-xs font-heading font-bold cursor-pointer">
                  {uploadingType === "page-2" ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Upload className="w-4 h-4" />
                  )}
                  <span>Смени снимка 2 (Пейзаж)</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload("page-2", e)}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: Service Slider Toggle & Gallery Manager */}
        <div className="space-y-6 pt-6 border-t border-brand-purple/10">
          <div className="p-5 rounded-2xl bg-brand-bg/50 border border-brand-purple/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="font-heading font-bold text-base text-brand-dark">
                  4. Долен слайдър с галерия ({baseService.shortTitle})
                </h3>
                <span
                  className={cn(
                    "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider",
                    currentHasSlider
                      ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                      : "bg-slate-200 text-slate-600 border border-slate-300"
                  )}
                >
                  {currentHasSlider ? "Включен" : "Изключен"}
                </span>
              </div>
              <p className="text-xs text-brand-muted max-w-xl">
                {currentHasSlider
                  ? "Слайдърът е АКТИВЕН. Долната интерактивна фото галерия ще се визуализира на публичната страница на услугата."
                  : "Слайдърът е СКРИТ. Долният компонент с галерия е напълно деактивиран на публичната страница на тази услуга."}
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <span className="text-xs font-bold text-brand-dark">
                Показвай долен слайдър с галерия:
              </span>
              <button
                type="button"
                role="switch"
                aria-checked={currentHasSlider}
                onClick={() => handleToggleSlider(!currentHasSlider)}
                disabled={isPending}
                className={cn(
                  "relative inline-flex h-7 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand-purple focus:ring-offset-2 disabled:opacity-50",
                  currentHasSlider ? "bg-emerald-500" : "bg-slate-300"
                )}
                title={currentHasSlider ? "Кликнете за изключване" : "Кликнете за включване"}
              >
                <span
                  className={cn(
                    "pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out",
                    currentHasSlider ? "translate-x-7" : "translate-x-0"
                  )}
                />
              </button>
            </div>
          </div>

          {currentHasSlider ? (
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="flex-1 max-w-md">
                  <label className="block text-xs font-bold text-brand-dark mb-1">
                    Заглавие над слайдъра (Gallery Title)
                  </label>
                  <input
                    type="text"
                    value={currentGalleryTitle}
                    onChange={(e) => updateCurrentOverride({ galleryTitle: e.target.value })}
                    placeholder="напр. ВИЖТЕ ТВОРЧЕСТВОТО С ПОВЕЧЕ УМЕНИЕ"
                    className="w-full px-4 py-2 rounded-xl border border-brand-purple/20 text-xs text-brand-dark focus:ring-2 focus:ring-brand-purple focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleSaveTextChanges}
                    disabled={isPending}
                    className="px-4 py-2 rounded-xl bg-brand-purple/10 text-brand-purple hover:bg-brand-purple hover:text-white transition-all text-xs font-heading font-bold cursor-pointer flex items-center gap-1.5"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Запази заглавие</span>
                  </button>

                  <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-purple text-white font-heading font-bold text-xs shadow-button hover:bg-brand-purple-hover transition-all cursor-pointer">
                    {uploadingType === "slider" ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Upload className="w-3.5 h-3.5" />
                    )}
                    <span>+ Добави снимка ({currentSliderImages.length})</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload("slider", e)}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {currentSliderImages.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 pt-2">
                  {currentSliderImages.map((img, i) => (
                    <div
                      key={i}
                      className="relative aspect-[4/3] rounded-xl overflow-hidden border border-brand-purple/15 bg-slate-100 group shadow-xs"
                    >
                      <Image src={img} alt={`Слайд ${i + 1}`} fill className="object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2">
                        <button
                          type="button"
                          onClick={() => handleDeleteSliderImage(img)}
                          className="p-2 rounded-full bg-red-600 text-white hover:bg-red-700 transition-colors shadow-md cursor-pointer"
                          title="Изтрий от слайдъра"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="absolute bottom-1 left-1 bg-black/50 backdrop-blur-xs text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                        #{i + 1}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 rounded-2xl border border-dashed border-brand-purple/30 text-center space-y-2 bg-brand-bg/20">
                  <p className="text-xs font-bold text-brand-dark">
                    Все още няма качени снимки за този слайдър.
                  </p>
                  <p className="text-[11px] text-brand-muted">
                    Кликнете върху „+ Добави снимка“, за да качите първите кадри.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="p-6 rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 text-center space-y-2">
              <p className="text-xs font-semibold text-slate-700">
                Долният слайдър с галерия за „{baseService.shortTitle}“ в момента е ИЗКЛЮЧЕН.
              </p>
              <p className="text-[11px] text-slate-500 max-w-md mx-auto">
                Публичната страница на тази услуга няма да показва фото слайдър. За да го активирате, просто превключете бутона „Показвай долен слайдър с галерия“ по-горе.
                {currentSliderImages.length > 0 && ` (В галерията има запазени ${currentSliderImages.length} снимки)`}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
