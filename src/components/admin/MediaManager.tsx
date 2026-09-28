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
  Video,
  MessageSquareQuote,
  ArrowUp,
  ArrowDown,
  Link as LinkIcon,
  RefreshCw,
  FileCheck,
} from "lucide-react";
import {
  uploadHeroBannerAction,
  uploadGalleryPhotoAction,
  deleteMediaObjectAction,
  saveHeroVideoUrlAction,
  uploadReviewScreenshotAction,
  deleteReviewScreenshotAction,
  saveKidsGalleryOrderAction,
  uploadReviewImageAction,
  deleteReviewImageAction,
  StorageMediaItem,
  ReviewImageRecord,
} from "@/actions/admin-media";
import { SERVICES_DATA, getServiceBySlug } from "@/lib/services-data";
import { cn } from "@/lib/utils";

interface MediaManagerProps {
  initialHeroUrl: string | null;
  initialKidsGallery: StorageMediaItem[];
  initialServiceMedia: StorageMediaItem[];
  initialHeroVideoUrl?: string;
  initialHeroMediaType?: "image" | "video";
  initialReviewScreenshotUrl?: string;
  initialReviewsImages?: ReviewImageRecord[];
  initialKidsGalleryOrder?: string[];
}

const DEFAULT_KIDS_PHOTOS = [
  { src: "/images/gallery-painted-hands.webp", title: "Творчество и детски арт занимания", tag: "Вградена в сайта" },
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
  initialHeroVideoUrl = "",
  initialHeroMediaType = "image",
  initialReviewScreenshotUrl = "",
  initialReviewsImages = [],
  initialKidsGalleryOrder = [],
}: MediaManagerProps) {
  const [activeTab, setActiveTab] = useState<"hero" | "reviews" | "kids" | "services">("hero");

  // 1. Hero banner state
  const [heroMediaType, setHeroMediaType] = useState<"image" | "video">(initialHeroMediaType);
  const [heroUrl, setHeroUrl] = useState<string>(initialHeroUrl || "/images/opening-photo.webp");
  const [heroVideoUrl, setHeroVideoUrl] = useState<string>(initialHeroVideoUrl);
  const [heroFile, setHeroFile] = useState<File | null>(null);
  const [heroPreview, setHeroPreview] = useState<string | null>(null);
  const [heroMessage, setHeroMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    if (initialHeroUrl) setHeroUrl(initialHeroUrl);
    if (initialHeroVideoUrl) setHeroVideoUrl(initialHeroVideoUrl);
    if (initialHeroMediaType) setHeroMediaType(initialHeroMediaType);
  }, [initialHeroUrl, initialHeroVideoUrl, initialHeroMediaType]);

  // 2. Reviews state (Homepage screenshot)
  const [reviewScreenshotUrl, setReviewScreenshotUrl] = useState<string>(initialReviewScreenshotUrl);
  const [reviewFile, setReviewFile] = useState<File | null>(null);
  const [reviewPreview, setReviewPreview] = useState<string | null>(null);
  const [reviewMessage, setReviewMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    if (initialReviewScreenshotUrl) setReviewScreenshotUrl(initialReviewScreenshotUrl);
  }, [initialReviewScreenshotUrl]);

  // 2b. "За Нас" parent reviews state (reviews_images table)
  const [reviewsImages, setReviewsImages] = useState<ReviewImageRecord[]>(initialReviewsImages);
  const [reviewImgFile, setReviewImgFile] = useState<File | null>(null);
  const [reviewImgPreview, setReviewImgPreview] = useState<string | null>(null);
  const [reviewImgMessage, setReviewImgMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    if (initialReviewsImages) setReviewsImages(initialReviewsImages);
  }, [initialReviewsImages]);

  // 3. Kids gallery state
  const [kidsItems, setKidsItems] = useState<StorageMediaItem[]>(initialKidsGallery);
  const [kidsFile, setKidsFile] = useState<File | null>(null);
  const [kidsMessage, setKidsMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [kidsSliderIndex, setKidsSliderIndex] = useState(0);

  // Combine and sort kids photos
  const rawKidsPhotos = [
    ...kidsItems.map((item) => ({
      src: item.publicUrl,
      title: item.name,
      tag: "Качена от вас (Storage)",
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

  // Apply custom order if saved
  const [orderedKidsPhotos, setOrderedKidsPhotos] = useState(rawKidsPhotos);

  useEffect(() => {
    if (initialKidsGalleryOrder && initialKidsGalleryOrder.length > 0) {
      const sorted = [...rawKidsPhotos].sort((a, b) => {
        const idxA = initialKidsGalleryOrder.indexOf(a.path);
        const idxB = initialKidsGalleryOrder.indexOf(b.path);
        if (idxA === -1 && idxB === -1) return 0;
        if (idxA === -1) return 1;
        if (idxB === -1) return -1;
        return idxA - idxB;
      });
      setOrderedKidsPhotos(sorted);
    } else {
      setOrderedKidsPhotos(rawKidsPhotos);
    }
  }, [kidsItems, initialKidsGalleryOrder]);

  // 4. Services state
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
    if (activeTab !== "kids" || orderedKidsPhotos.length === 0) return;
    const interval = setInterval(() => {
      setKidsSliderIndex((prev) => (prev + 1) % orderedKidsPhotos.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [activeTab, orderedKidsPhotos.length]);

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
        setHeroMediaType("image");
        setHeroMessage({ type: "success", text: res.message || "Банерът е обновен успешно!" });
      } else {
        setHeroMessage({ type: "error", text: res.message || "Грешка при качване." });
      }
    });
  };

  const handleSaveHeroVideo = (videoUrlToSave: string, mode: "video" | "image") => {
    startTransition(async () => {
      const res = await saveHeroVideoUrlAction(videoUrlToSave, mode);
      if (res.success) {
        setHeroMessage({ type: "success", text: res.message });
      } else {
        setHeroMessage({ type: "error", text: res.message || "Грешка при запазване." });
      }
    });
  };

  // REVIEWS UPLOAD HANDLER
  const handleReviewFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setReviewFile(file);
      setReviewPreview(URL.createObjectURL(file));
      setReviewMessage(null);
    }
  };

  const handleUploadReview = () => {
    if (!reviewFile) return;

    startTransition(async () => {
      const formData = new FormData();
      formData.append("file", reviewFile);

      const res = await uploadReviewScreenshotAction(formData);
      if (res.success && res.url) {
        setReviewScreenshotUrl(res.url);
        setReviewPreview(null);
        setReviewFile(null);
        setReviewMessage({ type: "success", text: res.message });
      } else {
        setReviewMessage({ type: "error", text: res.message || "Грешка при качване на отзива." });
      }
    });
  };

  const handleDeleteReview = () => {
    if (!window.confirm("Сигурни ли сте, че искате да премахнете качения скрийншот и да върнете стандартния отзив?")) {
      return;
    }

    startTransition(async () => {
      const res = await deleteReviewScreenshotAction();
      if (res.success) {
        setReviewScreenshotUrl("");
        setReviewPreview(null);
        setReviewMessage({ type: "success", text: res.message });
      } else {
        setReviewMessage({ type: "error", text: res.message || "Грешка при премахване." });
      }
    });
  };

  // "ЗА НАС" REVIEWS HANDLERS (reviews_images table)
  const handleReviewImgFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setReviewImgFile(file);
      setReviewImgPreview(URL.createObjectURL(file));
      setReviewImgMessage(null);
    }
  };

  const handleUploadReviewImage = () => {
    if (!reviewImgFile) return;

    startTransition(async () => {
      const formData = new FormData();
      formData.append("file", reviewImgFile);

      const res = await uploadReviewImageAction(formData);
      if (res.success && res.url) {
        const newRecord: ReviewImageRecord = {
          id: `review-${Date.now()}`,
          public_url: res.url,
          display_order: reviewsImages.length + 1,
        };
        setReviewsImages((prev) => [...prev, newRecord]);
        setReviewImgFile(null);
        setReviewImgPreview(null);
        setReviewImgMessage({ type: "success", text: res.message || "Отзивът е качен успешно!" });
      } else {
        setReviewImgMessage({ type: "error", text: res.message || "Грешка при качване на отзива." });
      }
    });
  };

  const handleDeleteReviewImage = (id: string, publicUrl?: string) => {
    if (!window.confirm("Сигурни ли сте, че искате да изтриете този отзив за страница 'За нас'?")) {
      return;
    }

    startTransition(async () => {
      setReviewsImages((prev) => prev.filter((item) => item.id !== id));
      const res = await deleteReviewImageAction(id, publicUrl);
      if (!res.success) {
        alert(res.message || "Грешка при изтриване на отзива.");
      }
    });
  };

  // KIDS GALLERY HANDLERS
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

  // REORDER KIDS PHOTOS
  const handleMoveKidsPhoto = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= orderedKidsPhotos.length) return;

    const newOrder = [...orderedKidsPhotos];
    const [moved] = newOrder.splice(index, 1);
    newOrder.splice(targetIndex, 0, moved);

    setOrderedKidsPhotos(newOrder);

    startTransition(async () => {
      const paths = newOrder.map((p) => p.path);
      const res = await saveKidsGalleryOrderAction(paths);
      if (res.success) {
        setKidsMessage({ type: "success", text: res.message });
      } else {
        setKidsMessage({ type: "error", text: "Грешка при запазване на подредбата." });
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
          <span>Главен банер / Видео</span>
        </button>

        <button
          onClick={() => setActiveTab("reviews")}
          className={cn(
            "px-5 py-2.5 rounded-2xl font-heading text-xs sm:text-sm font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer",
            activeTab === "reviews"
              ? "bg-brand-purple text-white shadow-button"
              : "bg-brand-bg text-brand-dark hover:bg-brand-purple/10"
          )}
        >
          <MessageSquareQuote className="w-4 h-4" />
          <span>Снимка Отзив</span>
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
          <span>Деца с умения (Подредба) ({orderedKidsPhotos.length})</span>
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
      {/* TAB 1: HERO BANNER & VIDEO */}
      {/* ======================================================== */}
      {activeTab === "hero" && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-brand-purple/15 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-brand-purple/10">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <h3 className="font-heading font-bold text-base sm:text-lg text-brand-dark">
                  Главен банер: Снимка или Видео
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

            {/* Media Mode Selector */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-brand-dark">Избор на тип банер:</span>
              <button
                type="button"
                onClick={() => {
                  setHeroMediaType("image");
                  handleSaveHeroVideo(heroVideoUrl, "image");
                }}
                className={cn(
                  "px-4 py-2 rounded-xl text-xs font-heading font-bold transition-all flex items-center gap-1.5",
                  heroMediaType === "image"
                    ? "bg-brand-purple text-white shadow-sm"
                    : "bg-brand-bg text-brand-dark hover:bg-brand-purple/10"
                )}
              >
                <ImageIcon className="w-4 h-4" />
                <span>Изображение / Снимка</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setHeroMediaType("video");
                  handleSaveHeroVideo(heroVideoUrl, "video");
                }}
                className={cn(
                  "px-4 py-2 rounded-xl text-xs font-heading font-bold transition-all flex items-center gap-1.5",
                  heroMediaType === "video"
                    ? "bg-brand-purple text-white shadow-sm"
                    : "bg-brand-bg text-brand-dark hover:bg-brand-purple/10"
                )}
              >
                <Video className="w-4 h-4" />
                <span>Видео банер</span>
              </button>
            </div>

            {/* Mockup Preview */}
            <div className="rounded-2xl border border-brand-purple/20 overflow-hidden bg-brand-bg shadow-lg">
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

              <div className="relative w-full h-[320px] sm:h-[400px] md:h-[450px] bg-black/90 overflow-hidden flex flex-col justify-center p-6 sm:p-12">
                {heroMediaType === "video" && heroVideoUrl ? (
                  <video
                    src={heroVideoUrl}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover object-center"
                  />
                ) : (
                  <Image
                    src={heroPreview || heroUrl || "/images/opening-photo.webp"}
                    alt="Главен банер"
                    fill
                    priority
                    className="object-cover object-center transition-all duration-500"
                  />
                )}

                <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/50 to-transparent" />

                <div className="relative z-10 space-y-4 max-w-xl text-white">
                  <h1 className="font-heading font-bold text-2xl sm:text-3xl md:text-4xl text-white drop-shadow-md leading-tight">
                    УРОЦИ, КУРСОВЕ И ЗАНИМАНИЯ ЗА УСПЕШНИ ДЕЦА
                  </h1>
                  <div className="pt-2">
                    <span className="inline-block px-7 py-3 rounded-full bg-brand-purple text-white font-heading font-bold text-xs sm:text-sm shadow-button">
                      НАУЧЕТЕ ПОВЕЧЕ
                    </span>
                  </div>
                </div>

                <div className="absolute top-4 right-4 z-10">
                  <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-600 text-white backdrop-blur-md shadow-md flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                    {heroMediaType === "video" ? "Активно видео" : "Активна снимка"}
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

            {/* Config Panels */}
            {heroMediaType === "video" ? (
              /* Video Link Config */
              <div className="bg-brand-bg/70 p-5 rounded-3xl border border-brand-purple/15 space-y-4">
                <div>
                  <h4 className="font-heading font-bold text-sm text-brand-dark">
                    Линк към видео за заглавния банер
                  </h4>
                  <p className="text-xs text-brand-muted mt-0.5">
                    Поставете директен линк към видео файл (MP4 / WebM) или видео хостинг.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <div className="relative flex-1 w-full">
                    <Video className="w-4 h-4 text-brand-purple absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="url"
                      value={heroVideoUrl}
                      onChange={(e) => setHeroVideoUrl(e.target.value)}
                      placeholder="https://example.com/video.mp4"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-brand-purple/20 bg-white text-xs sm:text-sm text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-purple"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => handleSaveHeroVideo(heroVideoUrl, "video")}
                    disabled={isPending}
                    className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-brand-purple text-white font-heading font-bold text-xs sm:text-sm shadow-button hover:bg-brand-purple-hover transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
                  >
                    {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                    <span>Запази видео линка</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Image Upload Config */
              <div className="bg-brand-bg/70 p-5 rounded-3xl border border-brand-purple/15 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-heading font-bold text-sm text-brand-dark">
                    Качване на ново фоново изображение
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
                            <span>Запази банера</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: REVIEWS SCREENSHOT */}
      {/* ======================================================== */}
      {activeTab === "reviews" && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-brand-purple/15 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-brand-purple/10">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <h3 className="font-heading font-bold text-base sm:text-lg text-brand-dark">
                  Снимка Отзив (Скрийншот в секцията за отзиви)
                </h3>
              </div>
              <span className="text-xs text-brand-muted">
                Статус: <strong className="text-brand-purple">{reviewScreenshotUrl ? "Качен потребителски скрийншот" : "Стандартен отзив"}</strong>
              </span>
            </div>

            {/* Current Active Preview */}
            <div className="rounded-3xl border border-brand-purple/20 overflow-hidden bg-brand-bg p-6 max-w-lg mx-auto">
              <p className="text-xs font-bold text-brand-purple uppercase tracking-wider mb-3 text-center">
                Преглед на живо на отзива в началната страница
              </p>
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-brand-purple/10">
                {reviewPreview || reviewScreenshotUrl ? (
                  <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden">
                    <Image
                      src={reviewPreview || reviewScreenshotUrl}
                      alt="Скрийншот на отзив"
                      fill
                      className="object-cover object-top"
                    />
                  </div>
                ) : (
                  <div className="space-y-3 p-2 text-center text-xs text-brand-muted">
                    <p className="font-semibold text-brand-dark">
                      В момента се визуализира вграденият форматиран отзив на Нели Иванова.
                    </p>
                    <p>Качете истински скрийншот от Facebook / Google Reviews чрез полето по-долу, за да се показва снимката.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Notification messages */}
            {reviewMessage && (
              <div
                className={cn(
                  "p-4 rounded-2xl text-xs sm:text-sm font-medium border flex items-center gap-2",
                  reviewMessage.type === "success"
                    ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                    : "bg-red-50 text-red-800 border-red-200"
                )}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{reviewMessage.text}</span>
              </div>
            )}

            {/* Upload review file */}
            <div className="bg-brand-bg/70 p-5 rounded-3xl border border-brand-purple/15 space-y-4">
              <div>
                <h4 className="font-heading font-bold text-sm text-brand-dark">
                  Качване на нов скрийншот на отзив
                </h4>
                <p className="text-xs text-brand-muted mt-0.5">
                  Формати: WebP, PNG, JPG. Скрийншотът мигновено се визуализира на началната страница.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4">
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/webp"
                  onChange={handleReviewFileChange}
                  className="block w-full text-xs text-brand-muted file:mr-4 file:py-2.5 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-heading file:font-bold file:bg-brand-purple/10 file:text-brand-purple hover:file:bg-brand-purple/20 cursor-pointer"
                />

                {reviewFile && (
                  <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                    <button
                      onClick={() => {
                        setReviewFile(null);
                        setReviewPreview(null);
                      }}
                      className="px-4 py-2.5 rounded-full bg-white text-brand-dark text-xs font-bold hover:bg-gray-100 transition-colors border border-brand-purple/20 cursor-pointer"
                    >
                      Отказ
                    </button>
                    <button
                      onClick={handleUploadReview}
                      disabled={isPending}
                      className="px-6 py-2.5 rounded-full bg-brand-purple text-white font-heading font-bold text-xs sm:text-sm shadow-button hover:bg-brand-purple-hover transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
                    >
                      {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                      <span>Качи отзива</span>
                    </button>
                  </div>
                )}
              </div>

              {reviewScreenshotUrl && (
                <div className="pt-2 border-t border-brand-purple/10 flex justify-end">
                  <button
                    type="button"
                    onClick={handleDeleteReview}
                    disabled={isPending}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Възстанови стандартния отзив</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* ======================================================== */}
          {/* SECTION 2: "ЗА НАС" REVIEWS SCREENSHOTS (reviews_images) */}
          {/* ======================================================== */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-brand-purple/15 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-brand-purple/10">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-brand-purple animate-pulse" />
                <h3 className="font-heading font-bold text-base sm:text-lg text-brand-dark">
                  Скрийншоти на отзиви за страница „За Нас“ (/za-nas)
                </h3>
              </div>
              <span className="text-xs text-brand-muted">
                Таблица <strong className="text-brand-purple">reviews_images</strong> ({reviewsImages.length} качени)
              </span>
            </div>

            <p className="text-xs sm:text-sm text-brand-muted">
              Качвайте директни скрийншоти от доволни родители. Те се появяват автоматично в карусела
              „Ето какво казват родителите“ в страницата <strong>/za-nas</strong>.
            </p>

            {/* Notification messages */}
            {reviewImgMessage && (
              <div
                className={cn(
                  "p-4 rounded-2xl text-xs sm:text-sm font-medium border flex items-center gap-2",
                  reviewImgMessage.type === "success"
                    ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                    : "bg-red-50 text-red-800 border-red-200"
                )}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{reviewImgMessage.text}</span>
              </div>
            )}

            {/* Upload form */}
            <div className="bg-brand-bg/70 p-5 rounded-3xl border border-brand-purple/15 space-y-4">
              <div>
                <h4 className="font-heading font-bold text-sm text-brand-dark">
                  Добавяне на нов скрийншот от родител
                </h4>
                <p className="text-xs text-brand-muted mt-0.5">
                  Формати: WebP, PNG, JPG (препоръчително хоризонтално или квадратно съотношение).
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4">
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/webp"
                  onChange={handleReviewImgFileChange}
                  className="block w-full text-xs text-brand-muted file:mr-4 file:py-2.5 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-heading file:font-bold file:bg-brand-purple/10 file:text-brand-purple hover:file:bg-brand-purple/20 cursor-pointer"
                />

                {reviewImgFile && (
                  <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                    <button
                      onClick={() => {
                        setReviewImgFile(null);
                        setReviewImgPreview(null);
                      }}
                      className="px-4 py-2.5 rounded-full bg-white text-brand-dark text-xs font-bold hover:bg-gray-100 transition-colors border border-brand-purple/20 cursor-pointer"
                    >
                      Отказ
                    </button>
                    <button
                      onClick={handleUploadReviewImage}
                      disabled={isPending}
                      className="px-6 py-2.5 rounded-full bg-brand-purple text-white font-heading font-bold text-xs sm:text-sm shadow-button hover:bg-brand-purple-hover transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
                    >
                      {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                      <span>Качи към „За Нас“</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Upload preview */}
              {reviewImgPreview && (
                <div className="relative w-48 h-32 rounded-xl overflow-hidden border border-brand-purple/20">
                  <Image
                    src={reviewImgPreview}
                    alt="Преглед на новия отзив"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
            </div>

            {/* List of uploaded reviews */}
            <div className="space-y-3">
              <h4 className="font-heading font-bold text-sm text-brand-dark">
                Качени отзиви в базата данни ({reviewsImages.length})
              </h4>

              {reviewsImages.length === 0 ? (
                <div className="text-center py-8 bg-brand-bg/50 rounded-2xl border border-dashed border-brand-purple/20">
                  <p className="text-xs text-brand-muted">
                    Все още няма качени скрийншоти в <code className="text-brand-purple">reviews_images</code>.
                    <br />
                    Страницата показва форматираните отзиви по подразбиране.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {reviewsImages.map((img, idx) => (
                    <div
                      key={img.id || idx}
                      className="relative group bg-brand-bg rounded-2xl overflow-hidden border border-brand-purple/15 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                    >
                      <div
                        className="relative w-full aspect-[4/3] cursor-pointer"
                        onClick={() =>
                          setLightboxImage({
                            src: img.public_url,
                            title: `Отзив от родител #${idx + 1}`,
                          })
                        }
                      >
                        <Image
                          src={img.public_url}
                          alt={`Отзив ${idx + 1}`}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          sizes="(max-width: 640px) 50vw, 25vw"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                          <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 text-brand-dark text-[11px] font-semibold px-2 py-1 rounded-full shadow flex items-center gap-1">
                            <Eye className="w-3 h-3 text-brand-purple" />
                            Преглед
                          </span>
                        </div>
                      </div>

                      <div className="p-2.5 flex items-center justify-between bg-white border-t border-brand-purple/10">
                        <span className="text-[11px] font-bold text-brand-purple">
                          #{idx + 1}
                        </span>

                        <button
                          type="button"
                          onClick={() => handleDeleteReviewImage(img.id, img.public_url)}
                          disabled={isPending}
                          className="p-1 rounded-lg text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                          title="Изтрий отзива"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: KIDS GALLERY SLIDER & REORDERING */}
      {/* ======================================================== */}
      {activeTab === "kids" && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-brand-purple/15 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-brand-purple/10">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <h3 className="font-heading font-bold text-base sm:text-lg text-brand-dark">
                  Слайдер „Нашите деца с умения“ (Добавяне, изтриване и подредба)
                </h3>
              </div>
              <span className="text-xs text-brand-muted">
                Снимки в слайдъра: <strong className="text-brand-purple">{orderedKidsPhotos.length}</strong>
              </span>
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
                    {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                    <span>Качи в слайдера</span>
                  </button>
                )}
              </div>
            </div>

            {/* REORDERING & CATALOG */}
            <div className="space-y-4 pt-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="font-heading font-bold text-sm sm:text-base text-brand-dark">
                    Подредба на кадрите в слайдъра (Използвайте стрелките за пренареждане)
                  </h4>
                  <p className="text-xs text-brand-muted">
                    Снимките се въртят в авто-слайдъра в реда, показан от 1 нататък.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {orderedKidsPhotos.map((photo, index) => (
                  <div
                    key={`${photo.path}-${index}`}
                    className="relative rounded-2xl overflow-hidden bg-white border border-brand-purple/20 shadow-sm p-3 space-y-3"
                  >
                    {/* Position badge */}
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-brand-purple text-white font-heading font-bold text-xs">
                        #{index + 1}
                      </span>
                      <span className="text-[10px] font-semibold text-brand-muted truncate max-w-[120px]">
                        {photo.tag}
                      </span>
                    </div>

                    {/* Image Thumbnail */}
                    <div
                      className="relative w-full aspect-[4/3] rounded-xl overflow-hidden cursor-pointer"
                      onClick={() => setLightboxImage({ src: photo.src, title: photo.title })}
                    >
                      <Image
                        src={photo.src}
                        alt={photo.title}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Reordering and Actions Toolbar */}
                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleMoveKidsPhoto(index, "up")}
                          disabled={index === 0 || isPending}
                          className="p-1.5 rounded-lg border border-brand-purple/20 hover:bg-brand-purple hover:text-white transition-colors disabled:opacity-30 disabled:pointer-events-none"
                          title="Премести по-напред"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveKidsPhoto(index, "down")}
                          disabled={index === orderedKidsPhotos.length - 1 || isPending}
                          className="p-1.5 rounded-lg border border-brand-purple/20 hover:bg-brand-purple hover:text-white transition-colors disabled:opacity-30 disabled:pointer-events-none"
                          title="Премести по-назад"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {photo.isUploaded && (
                        <button
                          type="button"
                          onClick={() => handleDeleteKidsPhoto(photo.path)}
                          disabled={isPending}
                          className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                          title="Изтрий снимката"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
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
      {/* TAB 4: SERVICES SLIDERS & PHOTOS */}
      {/* ======================================================== */}
      {activeTab === "services" && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-brand-purple/15 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-brand-purple/10">
              <div>
                <span className="text-xs font-bold text-brand-purple uppercase tracking-wider">
                  Избор на направление
                </span>
                <h3 className="font-heading font-bold text-lg sm:text-xl text-brand-dark mt-0.5">
                  Слайдери и снимки за: {currentServiceData.title}
                </h3>
              </div>

              <select
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                className="px-4 py-2.5 rounded-2xl border border-brand-purple/20 font-heading text-xs sm:text-sm font-bold text-brand-purple bg-brand-bg focus:outline-none focus:ring-2 focus:ring-brand-purple cursor-pointer"
              >
                {SERVICES_DATA.map((srv) => (
                  <option key={srv.slug} value={srv.slug}>
                    {srv.shortTitle}
                  </option>
                ))}
              </select>
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
            <div className="bg-brand-bg/70 p-5 rounded-3xl border border-brand-purple/15 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-heading font-bold text-sm text-brand-dark">
                  Качване на нова снимка към „{currentServiceData.shortTitle}“
                </h4>
                <span className="text-[11px] text-brand-muted">
                  Снимката ще влезе в страницата /uslugi/{selectedService}
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
                    {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                    <span>Качи към услугата</span>
                  </button>
                )}
              </div>
            </div>

            {/* Photos catalog for selected service */}
            <div className="space-y-3 pt-2">
              <label className="block text-xs font-bold text-brand-purple uppercase tracking-wider">
                Всички налични снимки за {currentServiceData.shortTitle} ({allServicePhotos.length})
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
                {allServicePhotos.map((photo, index) => (
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
      )}
    </div>
  );
}
