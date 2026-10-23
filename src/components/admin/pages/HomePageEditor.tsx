"use client";

import React, { useState, useTransition, useEffect } from "react";
import Image from "next/image";
import {
  Upload,
  Trash2,
  Sparkles,
  Video,
  Image as ImageIcon,
  MessageSquareQuote,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  Save,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Plus,
} from "lucide-react";
import {
  uploadHeroBannerAction,
  saveHeroVideoUrlAction,
  uploadReviewScreenshotAction,
  deleteReviewScreenshotAction,
  uploadReviewImageAction,
  deleteReviewImageAction,
  reorderReviewImagesAction,
  ReviewImageRecord,
  uploadGalleryPhotoAction,
  deleteMediaObjectAction,
  saveKidsGalleryOrderAction,
  StorageMediaItem,
} from "@/actions/admin-media";
import { cn } from "@/lib/utils";
import { BulgarianFlagSvg, UkFlagSvg } from "@/components/common/LanguageSwitcher";

interface HomePageEditorProps {
  initialHeroUrl: string | null;
  initialHeroVideoUrl?: string;
  initialHeroMediaType?: "image" | "video";
  initialReviewScreenshotUrl?: string;
  initialReviewsImages?: ReviewImageRecord[];
  initialKidsGallery: StorageMediaItem[];
  initialKidsGalleryOrder?: string[];
  initialHeroTitleEn?: string;
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

export function HomePageEditor({
  initialHeroUrl,
  initialHeroVideoUrl = "",
  initialHeroMediaType = "image",
  initialReviewScreenshotUrl = "",
  initialReviewsImages = [],
  initialKidsGallery,
  initialKidsGalleryOrder = [],
  initialHeroTitleEn = "",
}: HomePageEditorProps) {
  const [activeSubTab, setActiveSubTab] = useState<"hero" | "reviews" | "kids">("hero");
  const [isPending, startTransition] = useTransition();

  // 1. HERO BANNER STATE
  const [heroMediaType, setHeroMediaType] = useState<"image" | "video">(initialHeroMediaType);
  const [heroUrl, setHeroUrl] = useState<string>(initialHeroUrl || "/images/opening-photo.webp");
  const [heroVideoUrl, setHeroVideoUrl] = useState<string>(initialHeroVideoUrl);
  const [heroFile, setHeroFile] = useState<File | null>(null);
  const [heroPreview, setHeroPreview] = useState<string | null>(null);
  const [heroMessage, setHeroMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);


  // Hero bilingual text state
  const [heroTitleEn, setHeroTitleEn] = useState<string>(initialHeroTitleEn || "EDUCATIONAL CLUB UMENIE");
  const [heroTextLocale, setHeroTextLocale] = useState<"bg" | "en">("bg");
  const [isTranslatingHeroText, setIsTranslatingHeroText] = useState(false);

  const handleAutoTranslateHeroText = async () => {
    setIsTranslatingHeroText(true);
    setHeroMessage(null);
    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: "ОБРАЗОВАТЕЛЕН КЛУБ УМЕНИЕ", from: "bg", to: "en" }),
      });
      const data = await res.json();
      if (data.success && data.text) {
        setHeroTitleEn(data.text);
        setHeroTextLocale("en");
        setHeroMessage({
          type: "success",
          text: "Заглавието на началния банер беше преведено успешно на английски!",
        });
      }
    } catch (err) {
      console.error("Auto translate hero text exception:", err);
    } finally {
      setIsTranslatingHeroText(false);
    }
  };

  const handleSaveHeroTexts = () => {
    setHeroMessage(null);
    startTransition(async () => {
      const { updateSiteSettingsAction } = await import("@/actions/admin-settings");
      const res = await updateSiteSettingsAction({
        heroTitleEn: heroTitleEn.trim(),
      });
      if (res.success) {
        setHeroMessage({
          type: "success",
          text: "Текстовете на началния банер бяха запазени успешно на живо!",
        });
      } else {
        setHeroMessage({
          type: "error",
          text: res.message || "Грешка при запазване.",
        });
      }
    });
  };

  // 2. REVIEWS SCREENSHOTS & CAROUSEL STATE
  const [reviewsImages, setReviewsImages] = useState<ReviewImageRecord[]>(initialReviewsImages);
  const [reviewMessage, setReviewMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [previewReviewIndex, setPreviewReviewIndex] = useState<number>(0);

  // 3. KIDS GALLERY STATE
  const [kidsGallery, setKidsGallery] = useState<StorageMediaItem[]>(initialKidsGallery);
  const [kidsOrder, setKidsOrder] = useState<string[]>(() => {
    if (initialKidsGalleryOrder && initialKidsGalleryOrder.length > 0) {
      return initialKidsGalleryOrder;
    }
    return [
      ...initialKidsGallery.map((k) => k.path),
      ...DEFAULT_KIDS_PHOTOS.map((k) => k.src),
    ];
  });
  const [kidsFile, setKidsFile] = useState<File | null>(null);
  const [kidsMessage, setKidsMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [replacingIndex, setReplacingIndex] = useState<number | null>(null);

  // Build combined ordered photos list for Kids Carousel
  const uploadedMap = new Map<string, StorageMediaItem>();
  kidsGallery.forEach((item) => {
    uploadedMap.set(item.path, item);
    uploadedMap.set(item.publicUrl, item);
  });
  const defaultMap = new Map(DEFAULT_KIDS_PHOTOS.map((item) => [item.src, item]));

  const orderedKidsPhotos: { src: string; title: string; tag: string; isUploaded: boolean; path: string }[] = [];
  kidsOrder.forEach((path) => {
    if (uploadedMap.has(path)) {
      const item = uploadedMap.get(path)!;
      orderedKidsPhotos.push({
        src: item.publicUrl,
        title: item.name,
        tag: "Качена от Админ",
        isUploaded: true,
        path: item.path,
      });
    } else if (defaultMap.has(path)) {
      const def = defaultMap.get(path)!;
      orderedKidsPhotos.push({
        src: def.src,
        title: def.title,
        tag: def.tag,
        isUploaded: false,
        path: def.src,
      });
    } else if (path.startsWith("http") || path.startsWith("/")) {
      orderedKidsPhotos.push({
        src: path,
        title: path.split("/").pop() || "Снимка",
        tag: path.startsWith("http") ? "Качена от Админ" : "Вградена в сайта",
        isUploaded: path.startsWith("http"),
        path: path,
      });
    }
  });

  // --- HANDLERS: HERO ---
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
        setHeroMessage({ type: "success", text: res.message || "Главният банер е качен успешно!" });
      } else {
        setHeroMessage({ type: "error", text: res.message || "Грешка при качване на банера." });
      }
    });
  };

  const handleSaveHeroVideo = (videoUrlToSave: string, mode: "video" | "image") => {
    startTransition(async () => {
      const res = await saveHeroVideoUrlAction(videoUrlToSave, mode);
      if (res.success) {
        setHeroMessage({ type: "success", text: res.message });
      } else {
        setHeroMessage({ type: "error", text: res.message || "Грешка при записване на видеото." });
      }
    });
  };

  // --- HANDLERS: REVIEWS (MULTI-REVIEW CAROUSEL) ---
  const handleUploadReviewImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setReviewMessage(null);
    startTransition(async () => {
      let successCount = 0;
      const added: ReviewImageRecord[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append("file", file);
        const res = await uploadReviewImageAction(formData);
        if (res.success && res.url) {
          successCount++;
          added.push({
            id: res.item?.id || res.url,
            public_url: res.url,
            display_order: reviewsImages.length + added.length + 1,
          });
        }
      }

      if (successCount > 0) {
        setReviewsImages((prev) => [...prev, ...added]);
        setReviewMessage({
          type: "success",
          text: `Успешно ${successCount === 1 ? "качихте 1 нов отзив" : `качихте ${successCount} нови отзива`}! Слайдърът на началната страница е обновен на живо.`,
        });
      } else {
        setReviewMessage({ type: "error", text: "Грешка при качване на скрийншотите за отзиви." });
      }
      e.target.value = "";
    });
  };

  const handleDeleteReviewImage = (id: string, publicUrl?: string) => {
    if (!confirm("Сигурни ли сте, че искате да премахнете този отзив от слайдъра?")) return;
    setReviewMessage(null);
    startTransition(async () => {
      const res = await deleteReviewImageAction(id, publicUrl);
      if (res.success) {
        setReviewsImages((prev) => prev.filter((img) => img.id !== id && img.public_url !== publicUrl));
        setReviewMessage({ type: "success", text: "Отзивът беше премахнат успешно!" });
      } else {
        setReviewMessage({ type: "error", text: res.message || "Грешка при изтриване на отзива." });
      }
    });
  };

  const handleMoveReviewImage = (index: number, direction: "left" | "right") => {
    const targetIdx = direction === "left" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= reviewsImages.length) return;

    const updated = [...reviewsImages];
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;

    setReviewsImages(updated);
    setReviewMessage(null);

    startTransition(async () => {
      const orderedIds = updated.map((img) => img.id);
      const res = await reorderReviewImagesAction(orderedIds);
      if (res.success) {
        setReviewMessage({ type: "success", text: "Подредбата на отзивите в слайдъра е запазена на живо!" });
      } else {
        setReviewMessage({ type: "error", text: res.message || "Грешка при пренареждане." });
      }
    });
  };

  // --- HANDLERS: KIDS GALLERY ---
  const handleKidsFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setKidsFile(e.target.files[0]);
      setKidsMessage(null);
    }
  };

  const handleUploadKidsPhoto = () => {
    if (!kidsFile) return;
    setKidsMessage(null);
    startTransition(async () => {
      const formData = new FormData();
      formData.append("file", kidsFile);
      formData.append("folder", "kids-gallery");
      const res = await uploadGalleryPhotoAction(formData);
      if (res.success && res.path && res.url) {
        const newItem: StorageMediaItem = {
          name: kidsFile.name,
          id: res.path,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          last_accessed_at: new Date().toISOString(),
          metadata: {},
          publicUrl: res.url,
          path: res.path,
        };
        const newOrder = [res.path, ...kidsOrder];
        setKidsGallery((prev) => [newItem, ...prev]);
        setKidsOrder(newOrder);
        setKidsFile(null);
        await saveKidsGalleryOrderAction(newOrder);
        setKidsMessage({ type: "success", text: "Снимката е качена успешно и добавена в слайдъра!" });
      } else {
        setKidsMessage({ type: "error", text: res.message || "Грешка при качване на снимката." });
      }
    });
  };

  const handleReplaceKidsPhoto = (targetIndex: number, file: File) => {
    if (!file) return;
    setReplacingIndex(targetIndex);
    setKidsMessage(null);
    startTransition(async () => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "kids-gallery");
      const res = await uploadGalleryPhotoAction(formData);
      setReplacingIndex(null);

      if (res.success && res.path && res.url) {
        const newItem: StorageMediaItem = {
          name: file.name,
          id: res.path,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          last_accessed_at: new Date().toISOString(),
          metadata: {},
          publicUrl: res.url,
          path: res.path,
        };

        const oldTarget = orderedKidsPhotos[targetIndex];
        if (oldTarget && oldTarget.isUploaded && oldTarget.path) {
          try {
            await deleteMediaObjectAction(oldTarget.path);
          } catch {}
        }

        const newOrder = [...kidsOrder];
        newOrder[targetIndex] = res.path;
        setKidsGallery((prev) => [newItem, ...prev.filter((k) => k.path !== oldTarget?.path)]);
        setKidsOrder(newOrder);
        await saveKidsGalleryOrderAction(newOrder);
        setKidsMessage({ type: "success", text: `Снимката в позиция #${targetIndex + 1} беше заменена успешно!` });
      } else {
        setKidsMessage({ type: "error", text: res.message || "Грешка при замяна на снимката." });
      }
    });
  };

  const handleDeleteKidsPhoto = (targetIndex: number, photo: { path: string; isUploaded: boolean }) => {
    if (!confirm("Сигурни ли сте, че искате да премахнете тази снимка от слайдъра?")) return;
    setKidsMessage(null);
    startTransition(async () => {
      if (photo.isUploaded) {
        try {
          await deleteMediaObjectAction(photo.path);
        } catch {}
        setKidsGallery((prev) => prev.filter((k) => k.path !== photo.path && k.publicUrl !== photo.path));
      }
      const newOrder = kidsOrder.filter((_, idx) => idx !== targetIndex);
      setKidsOrder(newOrder);
      await saveKidsGalleryOrderAction(newOrder);
      setKidsMessage({ type: "success", text: "Снимката беше изтрита успешно от слайдъра!" });
    });
  };

  const handleSaveKidsOrder = () => {
    setKidsMessage(null);
    startTransition(async () => {
      const res = await saveKidsGalleryOrderAction(kidsOrder);
      if (res.success) {
        setKidsMessage({ type: "success", text: "Списъкът и подредбата на слайдъра са запазени на живо!" });
      } else {
        setKidsMessage({ type: "error", text: res.message || "Грешка при запазване." });
      }
    });
  };

  const handleResetDefaultKidsPhotos = () => {
    if (!confirm("Връщане на фабричните 7 снимки в слайдъра?")) return;
    setKidsMessage(null);
    const defaultPaths = DEFAULT_KIDS_PHOTOS.map((k) => k.src);
    setKidsOrder(defaultPaths);
    startTransition(async () => {
      const res = await saveKidsGalleryOrderAction(defaultPaths);
      if (res.success) {
        setKidsMessage({ type: "success", text: "Фабричните снимки бяха възстановени успешно!" });
      }
    });
  };

  const handleMoveKidsPhoto = (index: number, direction: "up" | "down") => {
    const newIdx = direction === "up" ? index - 1 : index + 1;
    if (newIdx < 0 || newIdx >= orderedKidsPhotos.length) return;

    const currentPaths = orderedKidsPhotos.map((p) => p.path);
    const temp = currentPaths[index];
    currentPaths[index] = currentPaths[newIdx];
    currentPaths[newIdx] = temp;

    setKidsOrder(currentPaths);
    startTransition(async () => {
      const res = await saveKidsGalleryOrderAction(currentPaths);
      if (res.success) {
        setKidsMessage({ type: "success", text: "Подредбата е запазена на живо!" });
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <span className="text-xs font-bold text-brand-purple uppercase tracking-wider">
          Редактор на съдържание
        </span>
        <h1 className="font-heading font-bold text-2xl sm:text-3xl text-brand-dark mt-1">
          Страница: Начало
        </h1>
        <p className="text-brand-muted text-xs sm:text-sm font-sans mt-0.5">
          Управлявайте главния банер или видео, отзивите от родители (интерактивен слайдър) и детската въртележка „Нашите деца с умения“.
        </p>
      </div>

      {/* Sub-tab Switcher */}
      <div className="bg-white p-2.5 rounded-3xl shadow-card border border-brand-purple/15 flex items-center gap-2 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveSubTab("hero")}
          className={cn(
            "px-5 py-2.5 rounded-2xl font-heading text-xs sm:text-sm font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer",
            activeSubTab === "hero"
              ? "bg-brand-purple text-white shadow-button"
              : "bg-brand-bg text-brand-dark hover:bg-brand-purple/10"
          )}
        >
          <Sparkles className="w-4 h-4" />
          <span>1. Главен банер / Видео</span>
        </button>

        <button
          onClick={() => setActiveSubTab("reviews")}
          className={cn(
            "px-5 py-2.5 rounded-2xl font-heading text-xs sm:text-sm font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer",
            activeSubTab === "reviews"
              ? "bg-brand-purple text-white shadow-button"
              : "bg-brand-bg text-brand-dark hover:bg-brand-purple/10"
          )}
        >
          <MessageSquareQuote className="w-4 h-4" />
          <span>2. Секция Отзиви ({reviewsImages.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab("kids")}
          className={cn(
            "px-5 py-2.5 rounded-2xl font-heading text-xs sm:text-sm font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer",
            activeSubTab === "kids"
              ? "bg-brand-purple text-white shadow-button"
              : "bg-brand-bg text-brand-dark hover:bg-brand-purple/10"
          )}
        >
          <ImageIcon className="w-4 h-4" />
          <span>3. Слайдър „Деца с умения“ ({orderedKidsPhotos.length})</span>
        </button>
      </div>

      {/* ============================================================ */}
      {/* 1. HERO SECTION CONTROLS */}
      {/* ============================================================ */}
      {activeSubTab === "hero" && (
        <div className="space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-card border border-brand-purple/15 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-brand-purple/10">
              <div>
                <h2 className="font-heading font-bold text-xl text-brand-dark">
                  Hero секция (Главно представяне)
                </h2>
                <p className="text-xs text-brand-muted mt-0.5">
                  Изберете дали уебсайтът да показва статично заглавно изображение или динамично видео в началото.
                </p>
              </div>

              {/* Mode Toggle */}
              <div className="inline-flex p-1 rounded-2xl bg-brand-bg border border-brand-purple/15 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => {
                    setHeroMediaType("image");
                    handleSaveHeroVideo(heroVideoUrl, "image");
                  }}
                  className={cn(
                    "px-4 py-2 rounded-xl text-xs font-heading font-bold transition-all flex items-center gap-1.5 cursor-pointer",
                    heroMediaType === "image"
                      ? "bg-brand-purple text-white shadow-xs"
                      : "text-brand-dark/80 hover:text-brand-purple"
                  )}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Снимка / Банер</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setHeroMediaType("video");
                    handleSaveHeroVideo(heroVideoUrl, "video");
                  }}
                  className={cn(
                    "px-4 py-2 rounded-xl text-xs font-heading font-bold transition-all flex items-center gap-1.5 cursor-pointer",
                    heroMediaType === "video"
                      ? "bg-brand-purple text-white shadow-xs"
                      : "text-brand-dark/80 hover:text-brand-purple"
                  )}
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>Видео</span>
                </button>
              </div>
            </div>

            {heroMessage && (
              <div
                className={cn(
                  "p-3.5 rounded-2xl flex items-center gap-2 text-xs font-medium border",
                  heroMessage.type === "success"
                    ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                    : "bg-red-50 text-red-800 border-red-200"
                )}
              >
                {heroMessage.type === "success" ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0" />
                )}
                <span>{heroMessage.text}</span>
              </div>
            )}

            {heroMediaType === "image" ? (
              /* A. Image Banner Upload Mode */
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                <div className="space-y-4">
                  <h3 className="font-heading font-bold text-sm text-brand-dark">
                    Качване на нов главен банер
                  </h3>
                  <p className="text-xs text-brand-muted leading-relaxed font-sans">
                    Препоръчителен размер: 1920x1080px (съотношение 16:9), WebP или JPEG формат за максимално бързо зареждане.
                  </p>

                  <div className="p-4 rounded-2xl bg-brand-bg/60 border border-dashed border-brand-purple/30 space-y-3">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleHeroFileChange}
                      className="block w-full text-xs text-brand-muted file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-heading file:font-bold file:bg-brand-purple/10 file:text-brand-purple hover:file:bg-brand-purple hover:file:text-white file:transition-colors cursor-pointer"
                    />

                    {heroFile && (
                      <button
                        onClick={handleUploadHero}
                        disabled={isPending}
                        className="w-full py-2.5 px-4 rounded-xl bg-brand-purple text-white font-heading font-bold text-xs uppercase tracking-wider shadow-button hover:bg-brand-purple-hover transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                      >
                        {isPending ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Upload className="w-4 h-4" />
                        )}
                        <span>Качи банера</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Preview */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-brand-dark">Текущ активен банер:</span>
                    <span className="text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded-md text-[10px]">
                      Активен
                    </span>
                  </div>
                  <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden border border-brand-purple/20 bg-slate-900 shadow-sm">
                    <Image
                      src={heroPreview || heroUrl}
                      alt="Hero banner preview"
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                </div>
              </div>
            ) : (
              /* B. Video URL Mode */
              <div className="space-y-4 max-w-2xl">
                <h3 className="font-heading font-bold text-sm text-brand-dark">
                  Директна връзка към видео
                </h3>
                <p className="text-xs text-brand-muted leading-relaxed font-sans">
                  Въведете директен MP4 линк или видео източник, който да се възпроизвежда като фон на началната страница.
                </p>

                <div className="flex items-center gap-2">
                  <input
                    type="url"
                    placeholder="https://example.com/video.mp4"
                    value={heroVideoUrl}
                    onChange={(e) => setHeroVideoUrl(e.target.value)}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-brand-purple/20 text-xs text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-purple"
                  />
                  <button
                    onClick={() => handleSaveHeroVideo(heroVideoUrl, "video")}
                    disabled={isPending}
                    className="px-5 py-2.5 rounded-xl bg-brand-purple text-white font-heading font-bold text-xs shadow-button hover:bg-brand-purple-hover transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shrink-0"
                  >
                    {isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    <span>Запази видео</span>
                  </button>
                </div>
              </div>
            )}
          </div>
          {/* Hero Bilingual Texts Card */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-card border border-brand-purple/15 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-brand-purple/10">
              <div>
                <h3 className="font-heading font-bold text-lg text-brand-dark flex items-center gap-2">
                  <span>Текстове на началния банер (Hero Title)</span>
                  <span className={cn(
                    "text-xs px-2.5 py-0.5 rounded-full font-bold",
                    heroTextLocale === "bg" ? "bg-purple-100 text-purple-800" : "bg-blue-100 text-blue-800"
                  )}>
                    {heroTextLocale === "bg" ? "🇧🇬 Български" : "🇬🇧 Английски"}
                  </span>
                </h3>
                <p className="text-xs text-brand-muted mt-0.5">
                  Редактирайте главното заглавие върху банера на български и английски език.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleAutoTranslateHeroText}
                  disabled={isTranslatingHeroText || isPending}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-heading font-bold text-xs shadow-sm hover:from-purple-700 hover:to-indigo-700 transition-all cursor-pointer disabled:opacity-50"
                >
                  {isTranslatingHeroText && (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  )}
                  <span>Преведи автоматично</span>
                </button>

                <button
                  type="button"
                  onClick={handleSaveHeroTexts}
                  disabled={isPending}
                  className="px-5 py-2 rounded-xl bg-brand-purple text-white font-heading font-bold text-xs uppercase tracking-wider shadow-button hover:bg-brand-purple-hover transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                  <span>Запази текст</span>
                </button>
              </div>
            </div>

            {/* Language Switcher Bar */}
            <div className="inline-flex items-center rounded-xl bg-brand-bg p-1 border border-brand-purple/15 shadow-xs">
              <button
                type="button"
                onClick={() => setHeroTextLocale("bg")}
                className={cn(
                  "inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-heading font-bold transition-all cursor-pointer",
                  heroTextLocale === "bg"
                    ? "bg-[#887ed8] text-white shadow-sm"
                    : "text-slate-600 hover:text-[#887ed8]"
                )}
              >
                <BulgarianFlagSvg className="w-4 h-2.5" />
                <span>🇧🇬 Български текст</span>
              </button>
              <button
                type="button"
                onClick={() => setHeroTextLocale("en")}
                className={cn(
                  "inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-heading font-bold transition-all cursor-pointer",
                  heroTextLocale === "en"
                    ? "bg-[#887ed8] text-white shadow-sm"
                    : "text-slate-600 hover:text-[#887ed8]"
                )}
              >
                <UkFlagSvg className="w-4 h-2.5" />
                <span>🇬🇧 Английски превод (EN)</span>
              </button>
            </div>

            {heroTextLocale === "bg" ? (
              <div>
                <label className="block text-xs font-bold text-brand-dark mb-1">
                  Заглавие върху банера (BG)
                </label>
                <input
                  type="text"
                  disabled
                  value="ОБРАЗОВАТЕЛЕН КЛУБ УМЕНИЕ"
                  className="w-full px-4 py-2.5 rounded-xl border border-brand-purple/20 text-xs font-heading font-bold text-brand-dark bg-slate-50 cursor-not-allowed"
                />
                <span className="text-[11px] text-brand-muted mt-1 inline-block">
                  Основното заглавие на български е официалното име на клуба.
                </span>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-bold text-brand-dark mb-1">
                  Заглавие върху банера на английски (Title EN)
                </label>
                <input
                  type="text"
                  value={heroTitleEn}
                  onChange={(e) => setHeroTitleEn(e.target.value)}
                  placeholder="e.g. EDUCATIONAL CLUB UMENIE"
                  className="w-full px-4 py-2.5 rounded-xl border border-brand-purple/20 text-xs font-heading font-bold text-brand-dark focus:ring-2 focus:ring-brand-purple focus:outline-none"
                />
              </div>
            )}
          </div>

        </div>
      )}

      {/* ============================================================ */}
      {/* 2. REVIEWS SECTION CONTROLS (Multi-review Slider / Carousel) */}
      {/* ============================================================ */}
      {activeSubTab === "reviews" && (
        <div className="space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-card border border-brand-purple/15 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-brand-purple/10">
              <div>
                <h2 className="font-heading font-bold text-xl text-brand-dark flex items-center gap-2">
                  <span>Секция Отзиви: Интерактивен слайдър</span>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-brand-purple/15 text-brand-purple">
                    {reviewsImages.length} {reviewsImages.length === 1 ? "отзив" : "отзива"}
                  </span>
                </h2>
                <p className="text-xs text-brand-muted mt-1 max-w-2xl font-sans leading-relaxed">
                  Качвайте скрийншоти от доволни родители (Facebook, Viber, Instagram). Когато има 1 отзив, той се показва статично. Когато качите 2 или повече, на началната страница автоматично се включва динамичен слайдър със стрелки, точки за превъртане и touch-swipe поддръжка!
                </p>
              </div>

              {/* Upload Action */}
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <label className="px-4 py-2.5 rounded-2xl bg-brand-purple text-white font-heading font-bold text-xs shadow-button hover:bg-brand-purple-hover transition-all flex items-center gap-2 cursor-pointer">
                  {isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                  <span>Добави отзив(и)</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    disabled={isPending}
                    onChange={handleUploadReviewImages}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {reviewMessage && (
              <div
                className={cn(
                  "p-3.5 rounded-2xl flex items-center gap-2 text-xs font-medium border",
                  reviewMessage.type === "success"
                    ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                    : "bg-red-50 text-red-800 border-red-200"
                )}
              >
                {reviewMessage.type === "success" ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0" />
                )}
                <span>{reviewMessage.text}</span>
              </div>
            )}

            {/* List of uploaded reviews */}
            {reviewsImages.length === 0 ? (
              <div className="p-8 rounded-2xl border-2 border-dashed border-brand-purple/20 text-center space-y-3 bg-brand-bg/40">
                <div className="w-12 h-12 rounded-full bg-brand-purple/10 text-brand-purple flex items-center justify-center mx-auto">
                  <MessageSquareQuote className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-sm text-brand-dark">
                    Няма качени скрийншоти с отзиви
                  </h4>
                  <p className="text-xs text-brand-muted mt-1 max-w-md mx-auto">
                    В момента на началната страница се показва фабричният примерен отзив на Нели Иванова. Натиснете бутона „Добави отзив(и)“ по-горе, за да качите реални екранни снимки.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <h3 className="font-heading font-bold text-sm text-brand-dark mb-3">
                    Качени отзиви в слайдъра (плъзнете или използвайте стрелките за пренареждане):
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {reviewsImages.map((review, idx) => (
                      <div
                        key={review.id}
                        className="bg-brand-bg/50 rounded-2xl border border-brand-purple/15 overflow-hidden flex flex-col justify-between group hover:border-brand-purple transition-all shadow-xs"
                      >
                        <div className="relative aspect-[4/3] w-full bg-slate-900 overflow-hidden flex items-center justify-center">
                          <Image
                            src={review.public_url}
                            alt={`Отзив #${idx + 1}`}
                            fill
                            className="object-contain"
                          />
                          <div className="absolute top-2 left-2 bg-brand-purple text-white text-[10px] font-heading font-bold px-2 py-0.5 rounded-md shadow-xs">
                            #{idx + 1}
                          </div>
                        </div>

                        <div className="p-3 space-y-2">
                          <div className="flex items-center justify-between pt-1 border-t border-brand-purple/10">
                            {/* Reorder Buttons */}
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => handleMoveReviewImage(idx, "left")}
                                disabled={idx === 0 || isPending}
                                className="p-1.5 rounded-lg bg-white border border-brand-purple/20 text-brand-dark hover:bg-brand-purple hover:text-white transition-colors disabled:opacity-30 cursor-pointer"
                                title="Премести напред"
                              >
                                <ArrowLeft className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleMoveReviewImage(idx, "right")}
                                disabled={idx === reviewsImages.length - 1 || isPending}
                                className="p-1.5 rounded-lg bg-white border border-brand-purple/20 text-brand-dark hover:bg-brand-purple hover:text-white transition-colors disabled:opacity-30 cursor-pointer"
                                title="Премести назад"
                              >
                                <ArrowRight className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <div className="flex items-center gap-1">
                              {/* Open link */}
                              <a
                                href={review.public_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 rounded-lg bg-white border border-brand-purple/20 text-brand-purple hover:bg-brand-purple hover:text-white transition-colors cursor-pointer"
                                title="Преглед в пълен размер"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>

                              {/* Delete button */}
                              <button
                                type="button"
                                onClick={() => handleDeleteReviewImage(review.id, review.public_url)}
                                disabled={isPending}
                                className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-colors cursor-pointer"
                                title="Изтрий отзива"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Live Slider Preview for Admin */}
                <div className="pt-4 border-t border-brand-purple/10">
                  <h3 className="font-heading font-bold text-sm text-brand-dark mb-1">
                    Интерактивен предварителен преглед на слайдъра:
                  </h3>
                  <p className="text-xs text-brand-muted mb-4 font-sans">
                    Ето как посетителите на началната страница виждат и прелистват отзивите:
                  </p>

                  <div className="w-full max-w-xl mx-auto bg-slate-950 rounded-2xl p-4 shadow-card border border-brand-purple/20 relative">
                    <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden flex items-center justify-center">
                      <Image
                        key={reviewsImages[previewReviewIndex]?.public_url || reviewsImages[0]?.public_url}
                        src={reviewsImages[previewReviewIndex]?.public_url || reviewsImages[0]?.public_url}
                        alt="Преглед на отзив"
                        fill
                        className="object-contain"
                      />

                      {reviewsImages.length >= 2 && (
                        <>
                          <button
                            type="button"
                            onClick={() =>
                              setPreviewReviewIndex((prev) =>
                                prev === 0 ? reviewsImages.length - 1 : prev - 1
                              )
                            }
                            className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-brand-purple shadow-md flex items-center justify-center cursor-pointer transition-transform hover:scale-110"
                          >
                            <ChevronLeft className="w-5 h-5" />
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setPreviewReviewIndex((prev) =>
                                prev === reviewsImages.length - 1 ? 0 : prev + 1
                              )
                            }
                            className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-brand-purple shadow-md flex items-center justify-center cursor-pointer transition-transform hover:scale-110"
                          >
                            <ChevronRight className="w-5 h-5" />
                          </button>
                        </>
                      )}
                    </div>

                    {reviewsImages.length >= 2 && (
                      <div className="flex justify-center items-center gap-1.5 mt-3">
                        {reviewsImages.map((_, dotIdx) => (
                          <button
                            key={dotIdx}
                            type="button"
                            onClick={() => setPreviewReviewIndex(dotIdx)}
                            className={cn(
                              "h-2 rounded-full transition-all cursor-pointer",
                              previewReviewIndex === dotIdx
                                ? "w-6 bg-brand-purple"
                                : "w-2 bg-brand-purple/40"
                            )}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 3. KIDS GALLERY CAROUSEL CONTROLS */}
      {/* ============================================================ */}
      {activeSubTab === "kids" && (
        <div className="space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-card border border-brand-purple/15 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-brand-purple/10">
              <div>
                <h2 className="font-heading font-bold text-xl text-brand-dark">
                  Слайдър „Нашите деца с умения“
                </h2>
                <p className="text-xs text-brand-muted mt-0.5">
                  Качвайте нови снимки, променяйте подредбата им и премахвайте стари кадри за детската въртележка.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={handleSaveKidsOrder}
                  disabled={isPending}
                  className="px-4 py-2 rounded-xl bg-brand-purple text-white font-heading font-bold text-xs shadow-button hover:bg-brand-purple-hover transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  title="Запази текущия ред и списък"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Запази промените</span>
                </button>

                <button
                  type="button"
                  onClick={handleResetDefaultKidsPhotos}
                  disabled={isPending}
                  className="px-3 py-2 rounded-xl bg-brand-bg text-brand-muted hover:text-brand-dark hover:bg-slate-200 transition-colors text-xs font-semibold flex items-center gap-1 cursor-pointer"
                  title="Възстанови фабричните 7 снимки"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Фабрични</span>
                </button>

                <div className="p-2 rounded-2xl bg-brand-bg/60 border border-brand-purple/20 flex items-center gap-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleKidsFileChange}
                    className="text-xs text-brand-muted file:mr-2 file:py-1 file:px-2.5 file:rounded-xl file:border-0 file:text-[11px] file:font-heading file:font-bold file:bg-brand-purple/10 file:text-brand-purple hover:file:bg-brand-purple hover:file:text-white file:transition-colors cursor-pointer"
                  />
                  {kidsFile && (
                    <button
                      onClick={handleUploadKidsPhoto}
                      disabled={isPending}
                      className="px-3.5 py-1.5 rounded-xl bg-brand-purple text-white font-heading font-bold text-xs shadow-button hover:bg-brand-purple-hover transition-all flex items-center gap-1 cursor-pointer disabled:opacity-50 shrink-0"
                    >
                      {isPending ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Upload className="w-3.5 h-3.5" />
                      )}
                      <span>Качи</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {kidsMessage && (
              <div
                className={cn(
                  "p-3.5 rounded-2xl flex items-center gap-2 text-xs font-medium border",
                  kidsMessage.type === "success"
                    ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                    : "bg-red-50 text-red-800 border-red-200"
                )}
              >
                {kidsMessage.type === "success" ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0" />
                )}
                <span>{kidsMessage.text}</span>
              </div>
            )}

            {/* Photos Grid with Reordering, Replace & Delete */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {orderedKidsPhotos.map((photo, idx) => (
                <div
                  key={`${photo.path}-${idx}`}
                  className="bg-brand-bg/40 rounded-2xl border border-brand-purple/15 overflow-hidden flex flex-col justify-between group hover:border-brand-purple transition-all"
                >
                  <div className="relative aspect-[4/3] w-full bg-slate-100 overflow-hidden">
                    <Image
                      src={photo.src}
                      alt={photo.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                    <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                      #{idx + 1}
                    </div>
                  </div>

                  <div className="p-3 space-y-2">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-brand-dark truncate pr-1">
                        {photo.title}
                      </span>
                      <span className="text-[9px] font-semibold text-brand-purple bg-brand-purple/10 px-1.5 py-0.5 rounded-md shrink-0">
                        {photo.tag}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-brand-purple/10">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleMoveKidsPhoto(idx, "up")}
                          disabled={idx === 0 || isPending}
                          className="p-1.5 rounded-lg bg-white border border-brand-purple/20 text-brand-dark hover:bg-brand-purple hover:text-white transition-colors disabled:opacity-30 cursor-pointer"
                          title="Премести напред"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveKidsPhoto(idx, "down")}
                          disabled={idx === orderedKidsPhotos.length - 1 || isPending}
                          className="p-1.5 rounded-lg bg-white border border-brand-purple/20 text-brand-dark hover:bg-brand-purple hover:text-white transition-colors disabled:opacity-30 cursor-pointer"
                          title="Премести назад"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center gap-1">
                        {/* Replace photo button */}
                        <label
                          className={cn(
                            "p-1.5 rounded-lg bg-white border border-brand-purple/20 text-brand-purple hover:bg-brand-purple hover:text-white transition-colors cursor-pointer flex items-center gap-1 text-[11px] font-bold",
                            replacingIndex === idx && "opacity-50 pointer-events-none"
                          )}
                          title="Замени тази снимка с нов файл"
                        >
                          {replacingIndex === idx ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Upload className="w-3.5 h-3.5" />
                          )}
                          <span className="text-[10px]">Замени</span>
                          <input
                            type="file"
                            accept="image/*"
                            disabled={isPending}
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                handleReplaceKidsPhoto(idx, e.target.files[0]);
                                e.target.value = "";
                              }
                            }}
                            className="hidden"
                          />
                        </label>

                        {/* Delete photo button */}
                        <button
                          type="button"
                          onClick={() => handleDeleteKidsPhoto(idx, photo)}
                          disabled={isPending}
                          className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-colors cursor-pointer"
                          title="Премахни снимката от слайдъра"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
