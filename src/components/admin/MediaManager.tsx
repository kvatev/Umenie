"use client";

import React, { useState, useTransition } from "react";
import Image from "next/image";
import {
  Upload,
  Trash2,
  Image as ImageIcon,
  Loader2,
  CheckCircle2,
  Layers,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import {
  uploadHeroBannerAction,
  uploadGalleryPhotoAction,
  deleteMediaObjectAction,
  StorageMediaItem,
} from "@/actions/admin-media";
import { cn } from "@/lib/utils";

interface MediaManagerProps {
  initialHeroUrl: string | null;
  initialKidsGallery: StorageMediaItem[];
  initialServiceMedia: StorageMediaItem[];
}

const SERVICE_OPTIONS = [
  { slug: "pletivo", name: "Плетиво" },
  { slug: "urotsi-i-kursove", name: "Уроци и курсове" },
  { slug: "uchebna-zanimalnya", name: "Учебна занималня" },
  { slug: "art-zanimaniya", name: "Арт занимания" },
  { slug: "chitatelski-klub", name: "Читателски клуб" },
  { slug: "shah", name: "Шах" },
];

export function MediaManager({
  initialHeroUrl,
  initialKidsGallery,
  initialServiceMedia,
}: MediaManagerProps) {
  const [activeTab, setActiveTab] = useState<"hero" | "kids" | "services">("hero");

  // 1. Hero banner state
  const [heroUrl, setHeroUrl] = useState<string>(
    initialHeroUrl || "/images/opening-photo.webp"
  );
  const [heroFile, setHeroFile] = useState<File | null>(null);
  const [heroPreview, setHeroPreview] = useState<string | null>(null);
  const [heroMessage, setHeroMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // 2. Kids gallery state
  const [kidsItems, setKidsItems] = useState<StorageMediaItem[]>(initialKidsGallery);
  const [kidsFile, setKidsFile] = useState<File | null>(null);
  const [kidsMessage, setKidsMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // 3. Services state
  const [selectedService, setSelectedService] = useState<string>("pletivo");
  const [serviceItems, setServiceItems] = useState<StorageMediaItem[]>(initialServiceMedia);
  const [serviceFile, setServiceFile] = useState<File | null>(null);
  const [serviceMessage, setServiceMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [isPending, startTransition] = useTransition();

  // HERO UPLOAD HANDLER
  const handleHeroFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setHeroFile(file);
      setHeroPreview(URL.createObjectURL(file));
      setHeroMessage(null);
    }
  };

  const handleUploadHero = () => {
    if (!heroFile) return;

    startTransition(async () => {
      const formData = new FormData();
      formData.append("file", heroFile);

      const res = await uploadHeroBannerAction(formData);
      if (res.success && res.url) {
        setHeroUrl(res.url);
        setHeroPreview(null);
        setHeroFile(null);
        setHeroMessage({ type: "success", text: res.message || "Банерът е обновен!" });
      } else {
        setHeroMessage({ type: "error", text: res.message || "Грешка при качване." });
      }
    });
  };

  // KIDS GALLERY UPLOAD HANDLER
  const handleKidsFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setKidsFile(e.target.files[0]);
      setKidsMessage(null);
    }
  };

  const handleUploadKidsPhoto = () => {
    if (!kidsFile) return;

    startTransition(async () => {
      const formData = new FormData();
      formData.append("file", kidsFile);
      formData.append("folder", "kids-gallery");

      const res = await uploadGalleryPhotoAction(formData);
      if (res.success) {
        setKidsMessage({ type: "success", text: "Снимката е качена успешно!" });
        setKidsFile(null);
        // Add optimistic preview or reload
        setTimeout(() => window.location.reload(), 800);
      } else {
        setKidsMessage({ type: "error", text: res.message || "Грешка при качване." });
      }
    });
  };

  const handleDeleteKidsPhoto = (path: string) => {
    if (!window.confirm("Сигурни ли сте, че искате да изтриете тази снимка от галерията?")) {
      return;
    }

    startTransition(async () => {
      setKidsItems((prev) => prev.filter((item) => item.path !== path));
      const res = await deleteMediaObjectAction(path);
      if (!res.success) {
        alert(res.message || "Грешка при изтриване.");
      }
    });
  };

  // SERVICE GALLERY UPLOAD HANDLER
  const handleServiceFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setServiceFile(e.target.files[0]);
      setServiceMessage(null);
    }
  };

  const handleUploadServicePhoto = () => {
    if (!serviceFile) return;

    startTransition(async () => {
      const formData = new FormData();
      formData.append("file", serviceFile);
      formData.append("folder", `services/${selectedService}`);

      const res = await uploadGalleryPhotoAction(formData);
      if (res.success) {
        setServiceMessage({ type: "success", text: "Снимката за услугата е качена!" });
        setServiceFile(null);
        setTimeout(() => window.location.reload(), 800);
      } else {
        setServiceMessage({ type: "error", text: res.message || "Грешка при качване." });
      }
    });
  };

  const handleDeleteServicePhoto = (path: string) => {
    if (!window.confirm("Сигурни ли сте, че искате да изтриете тази снимка?")) {
      return;
    }

    startTransition(async () => {
      setServiceItems((prev) => prev.filter((item) => item.path !== path));
      const res = await deleteMediaObjectAction(path);
      if (!res.success) {
        alert(res.message || "Грешка при изтриване.");
      }
    });
  };

  // Filter service items by selected category
  const filteredServicePhotos = serviceItems.filter((item) =>
    item.path.startsWith(`services/${selectedService}`)
  );

  return (
    <div className="space-y-6">
      {/* Tab Switcher */}
      <div className="bg-white p-3 sm:p-4 rounded-3xl shadow-card border border-brand-purple/15 flex items-center gap-2 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab("hero")}
          className={cn(
            "px-5 py-2.5 rounded-2xl font-heading text-xs sm:text-sm font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer",
            activeTab === "hero"
              ? "bg-brand-purple text-white shadow-button"
              : "bg-brand-bg text-brand-dark hover:bg-brand-purple/10"
          )}
        >
          <Sparkles className="w-4 h-4" />
          <span>Главен банер (Начална страница)</span>
        </button>

        <button
          onClick={() => setActiveTab("kids")}
          className={cn(
            "px-5 py-2.5 rounded-2xl font-heading text-xs sm:text-sm font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer",
            activeTab === "kids"
              ? "bg-brand-purple text-white shadow-button"
              : "bg-brand-bg text-brand-dark hover:bg-brand-purple/10"
          )}
        >
          <ImageIcon className="w-4 h-4" />
          <span>Слайдер „Нашите деца с умения“ ({kidsItems.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("services")}
          className={cn(
            "px-5 py-2.5 rounded-2xl font-heading text-xs sm:text-sm font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer",
            activeTab === "services"
              ? "bg-brand-purple text-white shadow-button"
              : "bg-brand-bg text-brand-dark hover:bg-brand-purple/10"
          )}
        >
          <Layers className="w-4 h-4" />
          <span>Слайдери за дейностите</span>
        </button>
      </div>

      {/* TAB 1: HERO BANNER */}
      {activeTab === "hero" && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-brand-purple/15 space-y-6 animate-fade-in">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-brand-purple/10">
            <div>
              <h2 className="font-heading font-bold text-xl text-brand-dark">
                Заглавен банер на Начална страница
              </h2>
              <p className="text-xs sm:text-sm text-brand-muted font-sans mt-0.5">
                Каченият файл се запазва като `hero-banner.webp` в публичния bucket `site-assets` и веднага се отразява на сайта.
              </p>
            </div>
            <a
              href="/"
              target="_blank"
              className="text-xs font-bold text-brand-purple hover:underline flex items-center gap-1 shrink-0"
            >
              <span>Виж на живо</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {heroMessage && (
            <div
              className={cn(
                "p-4 rounded-2xl text-xs sm:text-sm font-medium border flex items-center gap-2",
                heroMessage.type === "success"
                  ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                  : "bg-red-50 text-red-800 border-red-200"
              )}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{heroMessage.text}</span>
            </div>
          )}

          {/* Current Banner Preview */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-brand-purple uppercase tracking-wider">
              {heroPreview ? "Преглед на новото изображение" : "Текущ активен банер"}
            </label>
            <div className="relative w-full h-60 sm:h-80 md:h-96 rounded-3xl overflow-hidden border-2 border-dashed border-brand-purple/30 bg-brand-bg shadow-inner">
              <Image
                src={heroPreview || heroUrl}
                alt="Банер на началната страница"
                fill
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent flex items-center p-6 sm:p-10 pointer-events-none">
                <div className="text-white max-w-sm space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-brand-purple/80 px-2 py-0.5 rounded">
                    Визуализация
                  </span>
                  <h3 className="font-heading font-bold text-lg sm:text-xl">
                    УРОЦИ, КУРСОВЕ И ЗАНИМАНИЯ ЗА УСПЕШНИ ДЕЦА
                  </h3>
                </div>
              </div>
            </div>
          </div>

          {/* Upload Controls */}
          <div className="bg-brand-bg/60 p-5 rounded-3xl border border-brand-purple/15 space-y-4">
            <h4 className="font-heading font-bold text-sm text-brand-dark">
              Качи нов банер (препоръчително WebP, JPG или PNG до 10MB)
            </h4>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <input
                type="file"
                accept="image/png, image/jpeg, image/webp"
                onChange={handleHeroFileChange}
                className="block w-full text-xs text-brand-muted file:mr-4 file:py-2.5 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-heading file:font-bold file:bg-brand-purple/10 file:text-brand-purple hover:file:bg-brand-purple/20 cursor-pointer"
              />

              {heroFile && (
                <button
                  onClick={handleUploadHero}
                  disabled={isPending}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-brand-purple text-white font-heading font-bold text-xs sm:text-sm shadow-button hover:bg-brand-purple-hover transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0 disabled:opacity-70"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Качване...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      <span>Запази и обнови банера</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: KIDS GALLERY */}
      {activeTab === "kids" && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-brand-purple/15 space-y-6 animate-fade-in">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-brand-purple/10">
            <div>
              <h2 className="font-heading font-bold text-xl text-brand-dark">
                Слайдер „Нашите деца с умения“
              </h2>
              <p className="text-xs sm:text-sm text-brand-muted font-sans mt-0.5">
                Снимките се показват в ротационния слайдер на началната страница.
              </p>
            </div>
          </div>

          {kidsMessage && (
            <div
              className={cn(
                "p-4 rounded-2xl text-xs sm:text-sm font-medium border flex items-center gap-2",
                kidsMessage.type === "success"
                  ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                  : "bg-red-50 text-red-800 border-red-200"
              )}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{kidsMessage.text}</span>
            </div>
          )}

          {/* Upload New Photo */}
          <div className="bg-brand-bg/60 p-5 rounded-3xl border border-brand-purple/15 space-y-3">
            <h4 className="font-heading font-bold text-sm text-brand-dark">
              Добавяне на нова снимка към слайдера
            </h4>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <input
                type="file"
                accept="image/png, image/jpeg, image/webp"
                onChange={handleKidsFileChange}
                className="block w-full text-xs text-brand-muted file:mr-4 file:py-2.5 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-heading file:font-bold file:bg-brand-purple/10 file:text-brand-purple hover:file:bg-brand-purple/20 cursor-pointer"
              />

              {kidsFile && (
                <button
                  onClick={handleUploadKidsPhoto}
                  disabled={isPending}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-brand-purple text-white font-heading font-bold text-xs sm:text-sm shadow-button hover:bg-brand-purple-hover transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0 disabled:opacity-70"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Качване...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      <span>Качи снимка</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Photos Grid */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-brand-purple uppercase tracking-wider">
              Текущи снимки в Supabase Storage ({kidsItems.length})
            </label>

            {kidsItems.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {kidsItems.map((item) => (
                  <div
                    key={item.path}
                    className="relative group rounded-2xl overflow-hidden bg-brand-bg border border-brand-purple/20 shadow-sm aspect-square"
                  >
                    <Image
                      src={item.publicUrl}
                      alt={item.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Overlay with delete button */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2">
                      <button
                        onClick={() => handleDeleteKidsPhoto(item.path)}
                        className="p-2.5 rounded-full bg-red-600 text-white hover:bg-red-700 transition-colors shadow-lg cursor-pointer"
                        title="Изтрий снимката"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center text-brand-muted text-xs bg-brand-bg/40 rounded-3xl border border-dashed border-brand-purple/20">
                Все още няма качени снимки в папка `kids-gallery`. Използвайте формата горе, за да качите първите кадри.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: SERVICES MEDIA */}
      {activeTab === "services" && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-brand-purple/15 space-y-6 animate-fade-in">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-brand-purple/10">
            <div>
              <h2 className="font-heading font-bold text-xl text-brand-dark">
                Слайдери и снимки за отделните дейности
              </h2>
              <p className="text-xs sm:text-sm text-brand-muted font-sans mt-0.5">
                Изберете услуга, за да управлявате снимките в нейния слайдер.
              </p>
            </div>

            {/* Service selector */}
            <div className="w-full md:w-64">
              <select
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-brand-bg text-xs sm:text-sm font-bold text-brand-purple border border-brand-purple/20 focus:outline-none focus:ring-2 focus:ring-brand-purple cursor-pointer"
              >
                {SERVICE_OPTIONS.map((opt) => (
                  <option key={opt.slug} value={opt.slug}>
                    {opt.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {serviceMessage && (
            <div
              className={cn(
                "p-4 rounded-2xl text-xs sm:text-sm font-medium border flex items-center gap-2",
                serviceMessage.type === "success"
                  ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                  : "bg-red-50 text-red-800 border-red-200"
              )}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{serviceMessage.text}</span>
            </div>
          )}

          {/* Upload New Photo for Service */}
          <div className="bg-brand-bg/60 p-5 rounded-3xl border border-brand-purple/15 space-y-3">
            <h4 className="font-heading font-bold text-sm text-brand-dark">
              Добавяне на снимка за „{SERVICE_OPTIONS.find((s) => s.slug === selectedService)?.name}“
            </h4>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <input
                type="file"
                accept="image/png, image/jpeg, image/webp"
                onChange={handleServiceFileChange}
                className="block w-full text-xs text-brand-muted file:mr-4 file:py-2.5 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-heading file:font-bold file:bg-brand-purple/10 file:text-brand-purple hover:file:bg-brand-purple/20 cursor-pointer"
              />

              {serviceFile && (
                <button
                  onClick={handleUploadServicePhoto}
                  disabled={isPending}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-brand-purple text-white font-heading font-bold text-xs sm:text-sm shadow-button hover:bg-brand-purple-hover transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0 disabled:opacity-70"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Качване...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      <span>Качи снимка</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Grid of uploaded service photos */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-brand-purple uppercase tracking-wider">
              Снимки за услугата ({filteredServicePhotos.length})
            </label>

            {filteredServicePhotos.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {filteredServicePhotos.map((item) => (
                  <div
                    key={item.path}
                    className="relative group rounded-2xl overflow-hidden bg-brand-bg border border-brand-purple/20 shadow-sm aspect-square"
                  >
                    <Image
                      src={item.publicUrl}
                      alt={item.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2">
                      <button
                        onClick={() => handleDeleteServicePhoto(item.path)}
                        className="p-2.5 rounded-full bg-red-600 text-white hover:bg-red-700 transition-colors shadow-lg cursor-pointer"
                        title="Изтрий снимката"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center text-brand-muted text-xs bg-brand-bg/40 rounded-3xl border border-dashed border-brand-purple/20">
                Все още няма качени снимки за тази услуга в Supabase Storage.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
