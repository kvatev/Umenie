"use client";

import React, { useState, useTransition, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Upload,
  Trash2,
  Image as ImageIcon,
  Loader2,
  CheckCircle2,
  Layers,
  Sparkles,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
  Eye,
  Info,
} from "lucide-react";
import {
  uploadHeroBannerAction,
  uploadGalleryPhotoAction,
  deleteMediaObjectAction,
  StorageMediaItem,
} from "@/actions/admin-media";
import { SERVICES_DATA, getServiceBySlug } from "@/lib/services-data";
import { cn } from "@/lib/utils";

interface MediaManagerProps {
  initialHeroUrl: string | null;
  initialKidsGallery: StorageMediaItem[];
  initialServiceMedia: StorageMediaItem[];
}

const DEFAULT_KIDS_PHOTOS = [
  { src: "/images/banner/1.webp", title: "Занятие и творчество в малка група", tag: "Вградена в сайта" },
  { src: "/images/banner/2.webp", title: "Детски шах и концентрация", tag: "Вградена в сайта" },
  { src: "/images/banner/3.webp", title: "Учебна занималня и подготовка", tag: "Вградена в сайта" },
  { src: "/images/banner/4.webp", title: "Рисуване и арт занимания", tag: "Вградена в сайта" },
  { src: "/images/banner/5.webp", title: "Творчески умения и усмивки", tag: "Вградена в сайта" },
  { src: "/images/banner/6.webp", title: "Приятелства и знания", tag: "Вградена в сайта" },
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
  const [kidsSliderIndex, setKidsSliderIndex] = useState(0);

  // 3. Services state
  const [selectedService, setSelectedService] = useState<string>("pletivo");
  const [serviceItems, setServiceItems] = useState<StorageMediaItem[]>(initialServiceMedia);
  const [serviceFile, setServiceFile] = useState<File | null>(null);
  const [serviceMessage, setServiceMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [serviceSliderIndex, setServiceSliderIndex] = useState(0);

  // Lightbox modal state
  const [lightboxImage, setLightboxImage] = useState<{ src: string; title: string } | null>(null);

  const [isPending, startTransition] = useTransition();

  // Active service object from metadata
  const currentServiceData = getServiceBySlug(selectedService) || SERVICES_DATA[0];

  // Combined kids photos (built-in + uploaded)
  const allKidsPhotos = [
    ...kidsItems.map((item) => ({
      src: item.publicUrl,
      title: item.name,
      tag: "Качена в Supabase Storage",
      isUploaded: true,
      path: item.path,
    })),
    ...DEFAULT_KIDS_PHOTOS.map((item) => ({
      src: item.src,
      title: item.title,
      tag: "Вградена в сайта",
      isUploaded: false,
      path: item.src,
    })),
  ];

  // Filter service items by selected category
  const uploadedForService = serviceItems
    .filter((item) => item.path.startsWith(`services/${selectedService}`))
    .map((item) => ({
      src: item.publicUrl,
      title: item.name,
      tag: "Качена от вас (Storage)",
      isUploaded: true,
      path: item.path,
    }));

  const builtInForService = [
    ...(currentServiceData.sliderImages || []).map((img, idx) => ({
      src: img,
      title: `${currentServiceData.shortTitle} – слайд ${idx + 1}`,
      tag: "Слайдер в сайта",
      isUploaded: false,
      path: img,
    })),
    ...(currentServiceData.pageImages || []).map((img, idx) => ({
      src: img,
      title: `${currentServiceData.shortTitle} – детайл ${idx + 1}`,
      tag: "Галерия в страницата",
      isUploaded: false,
      path: img,
    })),
  ];

  const allServicePhotos = [...uploadedForService, ...builtInForService];

  // Auto rotate kids slider mockup
  useEffect(() => {
    if (activeTab !== "kids" || allKidsPhotos.length === 0) return;
    const interval = setInterval(() => {
      setKidsSliderIndex((prev) => (prev + 1) % allKidsPhotos.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [activeTab, allKidsPhotos.length]);

  // Reset service slider index when switching services
  useEffect(() => {
    setServiceSliderIndex(0);
  }, [selectedService]);

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
        setHeroMessage({ type: "success", text: res.message || "Банерът е обновен успешно!" });
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
        setKidsMessage({ type: "success", text: "Снимката е качена успешно в галерията!" });
        setKidsFile(null);
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
        setServiceMessage({ type: "success", text: "Снимката за услугата е качена успешно!" });
        setServiceFile(null);
        setTimeout(() => window.location.reload(), 800);
      } else {
        setServiceMessage({ type: "error", text: res.message || "Грешка при качване." });
      }
    });
  };

  const handleDeleteServicePhoto = (path: string) => {
    if (!window.confirm("Сигурни ли сте, че искате да изтриете тази качена снимка?")) {
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

  return (
    <div className="space-y-6">
      {/* Lightbox Modal */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setLightboxImage(null)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] w-full bg-white rounded-3xl overflow-hidden shadow-2xl p-2 animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-3 border-b border-brand-purple/10">
              <span className="font-heading font-bold text-sm text-brand-dark">
                {lightboxImage.title}
              </span>
              <button
                onClick={() => setLightboxImage(null)}
                className="p-1.5 rounded-full hover:bg-brand-purple/10 text-brand-dark transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="relative w-full h-[65vh] bg-brand-bg rounded-2xl overflow-hidden mt-2">
              <Image
                src={lightboxImage.src}
                alt={lightboxImage.title}
                fill
                className="object-contain"
                sizes="(max-width: 1024px) 100vw, 80vw"
              />
            </div>
          </div>
        </div>
      )}

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
          <span>Слайдер „Нашите деца с умения“ ({allKidsPhotos.length})</span>
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
          <span>Слайдери за дейностите ({SERVICES_DATA.length})</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: HERO BANNER */}
      {/* ======================================================== */}
      {activeTab === "hero" && (
        <div className="space-y-6 animate-fade-in">
          {/* LIVE SNIPPET PREVIEW: Как изглежда началният банер на сайта в момента */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-brand-purple/15 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-brand-purple/10">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <h3 className="font-heading font-bold text-base sm:text-lg text-brand-dark">
                  Отрязък на живо: Как изглежда заглавният екран на сайта
                </h3>
              </div>
              <a
                href="/"
                target="_blank"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-purple hover:underline"
              >
                <span>Отвори началната страница в нов прозорец</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Browser Mockup Window */}
            <div className="rounded-2xl border border-brand-purple/20 overflow-hidden bg-brand-bg shadow-lg">
              {/* Fake Browser Toolbar */}
              <div className="bg-[#e4e7eb] px-4 py-2 flex items-center gap-2 border-b border-brand-purple/15 text-xs text-brand-muted font-mono">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-red-400 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-amber-400 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block" />
                </div>
                <div className="flex-1 bg-white/80 rounded-full px-3 py-1 text-[11px] text-center text-brand-dark/70 truncate">
                  https://www.umenie.net/
                </div>
              </div>

              {/* Realistic Hero Mockup */}
              <div className="relative w-full h-[320px] sm:h-[420px] md:h-[480px] bg-brand-bg overflow-hidden flex flex-col justify-end p-6 sm:p-10">
                <Image
                  src={heroPreview || heroUrl}
                  alt="Главен банер"
                  fill
                  priority
                  className="object-cover object-center transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/85 via-brand-dark/40 to-black/20" />

                {/* Live Floating Badge */}
                <div className="relative z-10 space-y-3 max-w-xl text-white">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-purple/90 text-white text-xs font-bold uppercase tracking-wider backdrop-blur-sm shadow-sm">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Образователен клуб „УМеНИе“ • Бургас</span>
                  </div>
                  <h1 className="font-heading font-black text-xl sm:text-3xl md:text-4xl text-white drop-shadow-md leading-tight">
                    УРОЦИ, КУРСОВЕ И ЗАНИМАНИЯ ЗА УСПЕШНИ ДЕЦА
                  </h1>
                  <p className="text-white/85 text-xs sm:text-sm line-clamp-2 max-w-md drop-shadow">
                    Уроци и курсове по английски, математика, български език, учебна занималня, шах, плетиво и арт занимания.
                  </p>

                  <div className="pt-2 flex flex-wrap items-center gap-3">
                    <span className="px-5 py-2 rounded-full bg-brand-purple text-white font-heading font-bold text-xs shadow-button">
                      Калeндар / График →
                    </span>
                    <span className="px-5 py-2 rounded-full bg-white/20 text-white font-heading font-bold text-xs backdrop-blur-sm border border-white/30">
                      0877 488 481
                    </span>
                  </div>
                </div>

                {/* State Tag bottom right */}
                <div className="absolute top-4 right-4 z-10">
                  <span
                    className={cn(
                      "px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md shadow-md flex items-center gap-1.5",
                      heroPreview
                        ? "bg-amber-500 text-white"
                        : "bg-emerald-600 text-white"
                    )}
                  >
                    <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                    {heroPreview ? "Предварителен преглед на новия файл" : "Текущо активно на сайта"}
                  </span>
                </div>
              </div>
            </div>

            {/* Notification messages */}
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

            {/* Upload form */}
            <div className="bg-brand-bg/70 p-5 rounded-3xl border border-brand-purple/15 space-y-3 mt-4">
              <div className="flex items-center justify-between">
                <h4 className="font-heading font-bold text-sm text-brand-dark">
                  Смяна на банера с ново изображение
                </h4>
                <span className="text-[11px] text-brand-muted">
                  Препоръчително: WebP, JPG или PNG (1920x1080px)
                </span>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4">
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/webp"
                  onChange={handleHeroFileChange}
                  className="block w-full text-xs text-brand-muted file:mr-4 file:py-2.5 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-heading file:font-bold file:bg-brand-purple/10 file:text-brand-purple hover:file:bg-brand-purple/20 cursor-pointer"
                />

                {heroFile && (
                  <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                    <button
                      onClick={() => {
                        setHeroFile(null);
                        setHeroPreview(null);
                      }}
                      className="px-4 py-2.5 rounded-full bg-white text-brand-dark text-xs font-bold hover:bg-gray-100 transition-colors border border-brand-purple/20 cursor-pointer"
                    >
                      Отказ
                    </button>
                    <button
                      onClick={handleUploadHero}
                      disabled={isPending}
                      className="px-6 py-2.5 rounded-full bg-brand-purple text-white font-heading font-bold text-xs sm:text-sm shadow-button hover:bg-brand-purple-hover transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
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
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: KIDS GALLERY SLIDER */}
      {/* ======================================================== */}
      {activeTab === "kids" && (
        <div className="space-y-6 animate-fade-in">
          {/* LIVE SNIPPET PREVIEW: Как изглежда ротационният слайдер на началната страница */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-brand-purple/15 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-brand-purple/10">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <h3 className="font-heading font-bold text-base sm:text-lg text-brand-dark">
                  Отрязък на живо: Слайдер „Нашите деца с умения“ на началната страница
                </h3>
              </div>
              <span className="text-xs text-brand-muted">
                Активни кадри в ротация: <strong className="text-brand-purple">{allKidsPhotos.length}</strong>
              </span>
            </div>

            {/* Interactive Website Slider Mockup */}
            <div className="rounded-3xl border border-brand-purple/20 overflow-hidden bg-brand-bg p-4 sm:p-6 shadow-inner relative">
              <div className="text-center mb-4">
                <span className="text-[11px] font-bold text-brand-purple uppercase tracking-wider bg-brand-purple/10 px-3 py-1 rounded-full">
                  Фотогалерия от уебсайта
                </span>
                <h4 className="font-heading font-black text-xl sm:text-2xl text-brand-dark mt-2">
                  НАШИТЕ ДЕЦА С <span className="text-brand-purple">УМЕНИЯ</span>
                </h4>
              </div>

              {/* Slider Viewport */}
              <div className="relative w-full h-64 sm:h-80 md:h-96 rounded-2xl overflow-hidden bg-black/5 shadow-md">
                {allKidsPhotos.length > 0 && (
                  <>
                    <Image
                      src={allKidsPhotos[kidsSliderIndex].src}
                      alt={allKidsPhotos[kidsSliderIndex].title}
                      fill
                      className="object-cover object-center transition-all duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                    {/* Slide caption */}
                    <div className="absolute bottom-4 left-4 right-4 z-10 text-white flex items-end justify-between">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-brand-purple/90 px-2 py-0.5 rounded">
                          {allKidsPhotos[kidsSliderIndex].tag}
                        </span>
                        <p className="font-heading font-bold text-sm sm:text-base mt-1 drop-shadow">
                          {allKidsPhotos[kidsSliderIndex].title}
                        </p>
                      </div>

                      <button
                        onClick={() =>
                          setLightboxImage({
                            src: allKidsPhotos[kidsSliderIndex].src,
                            title: allKidsPhotos[kidsSliderIndex].title,
                          })
                        }
                        className="p-2 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-sm transition-colors cursor-pointer"
                        title="Увеличи снимката"
                      >
                        <Maximize2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Navigation Arrows */}
                    <button
                      onClick={() =>
                        setKidsSliderIndex(
                          (prev) => (prev - 1 + allKidsPhotos.length) % allKidsPhotos.length
                        )
                      }
                      className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white/90 text-brand-dark shadow-md flex items-center justify-center hover:bg-brand-purple hover:text-white transition-colors cursor-pointer"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() =>
                        setKidsSliderIndex((prev) => (prev + 1) % allKidsPhotos.length)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white/90 text-brand-dark shadow-md flex items-center justify-center hover:bg-brand-purple hover:text-white transition-colors cursor-pointer"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>

              {/* Slider Dots */}
              <div className="flex items-center justify-center gap-1.5 mt-3">
                {allKidsPhotos.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setKidsSliderIndex(idx)}
                    className={cn(
                      "h-2 rounded-full transition-all cursor-pointer",
                      kidsSliderIndex === idx
                        ? "w-6 bg-brand-purple"
                        : "w-2 bg-brand-purple/20 hover:bg-brand-purple/40"
                    )}
                  />
                ))}
              </div>
            </div>

            {/* Notification messages */}
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
            <div className="bg-brand-bg/70 p-5 rounded-3xl border border-brand-purple/15 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-heading font-bold text-sm text-brand-dark">
                  Добавяне на нова снимка към ротационния слайдер
                </h4>
                <span className="text-[11px] text-brand-muted">
                  Снимката веднага ще се добави към слайдера на началната страница
                </span>
              </div>
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
                        <span>Качи снимка в слайдера</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* ALL ACTIVE PHOTOS CATALOG (Visualizer) */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-brand-purple uppercase tracking-wider">
                  Пълен визуален каталог на снимките в слайдера ({allKidsPhotos.length})
                </label>
                <span className="text-xs text-brand-muted">
                  Кликнете на снимка за голям предварителен преглед
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
                {allKidsPhotos.map((photo, index) => (
                  <div
                    key={`${photo.src}-${index}`}
                    onClick={() => setLightboxImage({ src: photo.src, title: photo.title })}
                    className="relative group rounded-2xl overflow-hidden bg-brand-bg border border-brand-purple/20 shadow-sm aspect-square cursor-pointer hover:shadow-md transition-all hover:scale-[1.02]"
                  >
                    <Image
                      src={photo.src}
                      alt={photo.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Tag badge top */}
                    <div className="absolute top-1.5 left-1.5 right-1.5 z-10 pointer-events-none">
                      <span
                        className={cn(
                          "text-[9px] font-bold px-2 py-0.5 rounded-full shadow-sm block truncate text-center",
                          photo.isUploaded
                            ? "bg-purple-600 text-white"
                            : "bg-black/60 text-white backdrop-blur-sm"
                        )}
                      >
                        {photo.tag}
                      </span>
                    </div>

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setLightboxImage({ src: photo.src, title: photo.title });
                        }}
                        className="p-2 rounded-full bg-white/90 text-brand-dark hover:bg-white transition-colors shadow"
                        title="Преглед"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {photo.isUploaded && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteKidsPhoto(photo.path);
                          }}
                          className="p-2 rounded-full bg-red-600 text-white hover:bg-red-700 transition-colors shadow"
                          title="Изтрий от Storage"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: SERVICES SLIDERS & PHOTOS */}
      {/* ======================================================== */}
      {activeTab === "services" && (
        <div className="space-y-6 animate-fade-in">
          {/* Service Selector Header */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-brand-purple/15 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-brand-purple/10">
              <div>
                <span className="text-xs font-bold text-brand-purple uppercase tracking-wider">
                  Дейност за преглед и редакция
                </span>
                <h2 className="font-heading font-bold text-xl sm:text-2xl text-brand-dark mt-0.5">
                  Слайдери и снимки за: <span className="text-brand-purple">{currentServiceData.title}</span>
                </h2>
              </div>

              {/* Service selector tabs / dropdown */}
              <div className="w-full md:w-72">
                <select
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-brand-bg text-sm font-bold text-brand-purple border border-brand-purple/30 focus:outline-none focus:ring-2 focus:ring-brand-purple cursor-pointer shadow-sm"
                >
                  {SERVICES_DATA.map((srv) => (
                    <option key={srv.slug} value={srv.slug}>
                      {srv.shortTitle}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* LIVE SNIPPET PREVIEW: Как изглежда страницата на избраната услуга на живо */}
            <div className="rounded-3xl border border-brand-purple/20 overflow-hidden bg-brand-bg p-5 sm:p-8 shadow-inner space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-brand-purple/15">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-heading font-bold text-sm sm:text-base text-brand-dark">
                    Отрязък от страницата „/uslugi/{currentServiceData.slug}“ на живо
                  </span>
                </div>
                <Link
                  href={`/uslugi/${currentServiceData.slug}`}
                  target="_blank"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-purple hover:underline"
                >
                  <span>Виж страницата в сайта</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Mockup Card of Service Page Header & Live Slider */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center bg-white p-6 sm:p-8 rounded-3xl border border-brand-purple/15 shadow-card">
                {/* Left: Slogan & Details */}
                <div className="lg:col-span-6 space-y-4">
                  <div className="inline-block px-3 py-1 rounded-full bg-brand-purple/10 text-brand-purple text-xs font-bold uppercase tracking-wider">
                    {currentServiceData.title}
                  </div>
                  <h3 className="font-heading font-black text-2xl sm:text-3xl text-brand-dark leading-tight">
                    {currentServiceData.sloganPart1}{" "}
                    <span className="text-brand-purple block">{currentServiceData.sloganPart2}</span>
                  </h3>
                  <p className="text-brand-muted text-xs sm:text-sm font-sans line-clamp-3">
                    {currentServiceData.intro}
                  </p>

                  <div className="pt-2 flex items-center gap-3">
                    <span className="px-5 py-2.5 rounded-full bg-brand-purple text-white font-heading font-bold text-xs shadow-button inline-flex items-center gap-1.5">
                      <span>Запиши се за {currentServiceData.shortTitle}</span>
                    </span>
                    <span className="text-xs font-semibold text-brand-muted">
                      Общо {allServicePhotos.length} снимки за услугата
                    </span>
                  </div>
                </div>

                {/* Right: Live Interactive Slider Preview */}
                <div className="lg:col-span-6">
                  <div className="relative w-full h-56 sm:h-72 rounded-2xl overflow-hidden bg-brand-bg border border-brand-purple/20 shadow-md">
                    {allServicePhotos.length > 0 ? (
                      <>
                        <Image
                          src={allServicePhotos[serviceSliderIndex].src}
                          alt={allServicePhotos[serviceSliderIndex].title}
                          fill
                          className="object-cover object-center transition-all duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                        {/* Slide Tag & Title */}
                        <div className="absolute bottom-3 left-3 right-3 text-white flex items-end justify-between z-10">
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider bg-brand-purple/90 px-2 py-0.5 rounded">
                              {allServicePhotos[serviceSliderIndex].tag}
                            </span>
                            <p className="text-xs font-bold drop-shadow mt-1 truncate max-w-[200px] sm:max-w-xs">
                              {allServicePhotos[serviceSliderIndex].title}
                            </p>
                          </div>

                          <button
                            onClick={() =>
                              setLightboxImage({
                                src: allServicePhotos[serviceSliderIndex].src,
                                title: allServicePhotos[serviceSliderIndex].title,
                              })
                            }
                            className="p-1.5 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-sm transition-colors cursor-pointer"
                          >
                            <Maximize2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Slider Controls */}
                        <button
                          onClick={() =>
                            setServiceSliderIndex(
                              (prev) => (prev - 1 + allServicePhotos.length) % allServicePhotos.length
                            )
                          }
                          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white/90 text-brand-dark shadow flex items-center justify-center hover:bg-brand-purple hover:text-white transition-colors cursor-pointer"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() =>
                            setServiceSliderIndex((prev) => (prev + 1) % allServicePhotos.length)
                          }
                          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white/90 text-brand-dark shadow flex items-center justify-center hover:bg-brand-purple hover:text-white transition-colors cursor-pointer"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <div className="h-full flex items-center justify-center text-xs text-brand-muted">
                        Няма снимки за показване
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-xs text-brand-muted mt-2 px-1">
                    <span>Слайд {serviceSliderIndex + 1} от {allServicePhotos.length}</span>
                    <span>Така изглежда слайдерът в страницата</span>
                  </div>
                </div>
              </div>

              {/* Notification messages */}
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
              <div className="bg-white p-5 rounded-3xl border border-brand-purple/15 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-heading font-bold text-sm text-brand-dark">
                    Добавяне на нова снимка към слайдера на „{currentServiceData.shortTitle}“
                  </h4>
                  <span className="text-[11px] text-brand-muted">
                    Качва се директно в Supabase Storage
                  </span>
                </div>

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
                          <span>Качи снимка за {currentServiceData.shortTitle}</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>

              {/* FULL VISUAL CATALOG OF ACTIVE IMAGES FOR THIS SERVICE */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-brand-purple uppercase tracking-wider">
                    Всички активни снимки за „{currentServiceData.shortTitle}“ ({allServicePhotos.length})
                  </label>
                  <span className="text-xs text-brand-muted">
                    Кликнете на снимка за голям преглед
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
                  {allServicePhotos.map((photo, idx) => (
                    <div
                      key={`${photo.src}-${idx}`}
                      onClick={() => setLightboxImage({ src: photo.src, title: photo.title })}
                      className="relative group rounded-2xl overflow-hidden bg-white border border-brand-purple/20 shadow-sm aspect-square cursor-pointer hover:shadow-md transition-all hover:scale-[1.02]"
                    >
                      <Image
                        src={photo.src}
                        alt={photo.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />

                      {/* Tag Badge */}
                      <div className="absolute top-1.5 left-1.5 right-1.5 z-10 pointer-events-none">
                        <span
                          className={cn(
                            "text-[9px] font-bold px-2 py-0.5 rounded-full shadow-sm block truncate text-center",
                            photo.isUploaded
                              ? "bg-purple-600 text-white"
                              : "bg-black/60 text-white backdrop-blur-sm"
                          )}
                        >
                          {photo.tag}
                        </span>
                      </div>

                      {/* Overlay */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setLightboxImage({ src: photo.src, title: photo.title });
                          }}
                          className="p-2 rounded-full bg-white/90 text-brand-dark hover:bg-white transition-colors shadow"
                          title="Преглед"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {photo.isUploaded && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteServicePhoto(photo.path);
                            }}
                            className="p-2 rounded-full bg-red-600 text-white hover:bg-red-700 transition-colors shadow"
                            title="Изтрий от Storage"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
