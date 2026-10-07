"use client";

import React, { useState, useTransition } from "react";
import Image from "next/image";
import {
  Upload,
  Trash2,
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Sparkles,
  MessageSquareQuote,
} from "lucide-react";
import {
  uploadReviewImageAction,
  deleteReviewImageAction,
  reorderReviewImagesAction,
  ReviewImageRecord,
} from "@/actions/admin-media";
import { saveAboutPageContentAction } from "@/actions/admin-services";
import { AboutTextItem, SiteSettings } from "@/lib/types/site-settings";
import { cn } from "@/lib/utils";

interface AboutPageEditorProps {
  initialSettings: SiteSettings;
  initialReviewsImages: ReviewImageRecord[];
}

export function AboutPageEditor({
  initialSettings,
  initialReviewsImages,
}: AboutPageEditorProps) {
  const [isPending, startTransition] = useTransition();
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // 1. REVIEWS IMAGES STATE
  const [reviewsImages, setReviewsImages] = useState<ReviewImageRecord[]>(initialReviewsImages);
  const [uploadFile, setUploadFile] = useState<File | null>(null);

  // 2. VALUES STATE
  const [values, setValues] = useState<AboutTextItem[]>(() => {
    return initialSettings.aboutValues && initialSettings.aboutValues.length >= 3
      ? initialSettings.aboutValues
      : [
          {
            title: "УМЕНИЯ ОТВЪД УРОЦИТЕ",
            text: "Децата развиват умения отвъд уроците, които ще носят цял живот – увереност, отговорност, работа в екип и критично мислене.",
          },
          {
            title: "СРЕДА, БЛИЗКА ДО ДОМА",
            text: "Място, където всяко дете се чувства прието и спокойно да бъде себе си, а уважението, добротата и отношението към другите са част от всеки ден.",
          },
          {
            title: "ИНДИВИДУАЛЕН ПОДХОД",
            text: "В малки групи всяко дете получава лично внимание и подкрепа, защото започваме от неговото ниво и го издигаме нагоре.",
          },
        ];
  });

  // 3. FEATURES STATE
  const [features, setFeatures] = useState<AboutTextItem[]>(() => {
    return initialSettings.aboutFeatures && initialSettings.aboutFeatures.length >= 3
      ? initialSettings.aboutFeatures
      : [
          {
            title: "БЕЗ ЕКРАНИ",
            text: "Екраните остават настрана, за да има място за знание, мечти и истински приятелства.",
          },
          {
            title: "УЧЕНЕ ЧРЕЗ ПРАКТИКА",
            text: "Знанията влизат в действие чрез задачи, игри и практика, вместо да остават само на хартия.",
          },
          {
            title: "РОДИТЕЛЯТ Е ЧАСТ ОТ ПРОЦЕСА",
            text: "Регулярната обратна връзка ви държи близо до напредъка, интересите и нуждите на детето.",
          },
        ];
  });

  // --- REVIEWS HANDLERS ---
  const handleUploadReviewImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];

    startTransition(async () => {
      const formData = new FormData();
      formData.append("file", file);

      const res = await uploadReviewImageAction(formData);
      if (res.success && res.url) {
        const newItem: ReviewImageRecord = {
          id: res.url,
          public_url: res.url,
          display_order: reviewsImages.length + 1,
        };
        setReviewsImages((prev) => [...prev, newItem]);
        setStatusMessage({ type: "success", text: "Снимката на отзива е качена успешно!" });
      } else {
        setStatusMessage({ type: "error", text: res.message || "Грешка при качване на отзива." });
      }
    });
  };

  const handleDeleteReviewImage = (id: string, publicUrl?: string) => {
    if (!confirm("Сигурни ли сте, че искате да изтриете този отзив?")) return;

    startTransition(async () => {
      const res = await deleteReviewImageAction(id, publicUrl);
      if (res.success) {
        setReviewsImages((prev) => prev.filter((img) => img.id !== id));
        setStatusMessage({ type: "success", text: "Отзивът е изтрит успешно." });
      } else {
        setStatusMessage({ type: "error", text: res.message || "Грешка при изтриване." });
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

    startTransition(async () => {
      const orderedIds = updated.map((img) => img.id);
      const res = await reorderReviewImagesAction(orderedIds);
      if (res.success) {
        setStatusMessage({ type: "success", text: "Подредбата на отзивите е запазена!" });
      }
    });
  };

  // --- TEXTS HANDLERS ---
  const handleSaveTexts = () => {
    setStatusMessage(null);
    startTransition(async () => {
      const res = await saveAboutPageContentAction(values, features);
      if (res.success) {
        setStatusMessage({ type: "success", text: "Текстовете за страница „За нас“ бяха запазени успешно на живо!" });
      } else {
        setStatusMessage({ type: "error", text: res.message || "Грешка при записване." });
      }
    });
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
            Страница: За нас
          </h1>
          <p className="text-brand-muted text-xs sm:text-sm font-sans mt-0.5">
            Управлявайте галерията от отзиви от родители и текстовете на ценностите и принципите.
          </p>
        </div>

        <a
          href="/za-nas"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-brand-bg text-brand-purple font-heading font-bold text-xs hover:bg-brand-purple/10 transition-all border border-brand-purple/20 self-start sm:self-auto"
        >
          <span>Преглед на живо</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
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

      {/* ============================================================ */}
      {/* SECTION 1: PARENT REVIEWS MANAGER */}
      {/* ============================================================ */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-card border border-brand-purple/15 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-brand-purple/10">
          <div>
            <div className="flex items-center gap-2">
              <MessageSquareQuote className="w-5 h-5 text-brand-purple" />
              <h2 className="font-heading font-bold text-xl text-brand-dark">
                Секция „Ето какво казват родителите“ ({reviewsImages.length} отзива)
              </h2>
            </div>
            <p className="text-xs text-brand-muted mt-1">
              Качвайте екранни снимки на реални препоръки от Facebook, Viber или Instagram. Те се показват във въртележката на `/za-nas`.
            </p>
          </div>

          <label className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-brand-purple text-white font-heading font-bold text-xs uppercase tracking-wider shadow-button hover:bg-brand-purple-hover transition-all cursor-pointer self-start sm:self-auto">
            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            <span>+ Качи нов отзив</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleUploadReviewImage}
              className="hidden"
            />
          </label>
        </div>

        {reviewsImages.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {reviewsImages.map((img, idx) => (
              <div
                key={img.id}
                className="bg-brand-bg/50 rounded-2xl border border-brand-purple/15 overflow-hidden flex flex-col justify-between group hover:border-brand-purple transition-all"
              >
                <div className="relative aspect-[4/3] w-full bg-slate-900 overflow-hidden">
                  <Image
                    src={img.public_url}
                    alt={`Отзив ${idx + 1}`}
                    fill
                    className="object-contain p-2 group-hover:scale-105 transition-transform duration-200"
                  />
                  <div className="absolute top-2 left-2 bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                    #{idx + 1}
                  </div>
                </div>

                <div className="p-3 flex items-center justify-between border-t border-brand-purple/10 bg-white">
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleMoveReviewImage(idx, "left")}
                      disabled={idx === 0 || isPending}
                      className="p-1.5 rounded-lg bg-brand-bg hover:bg-brand-purple hover:text-white transition-colors disabled:opacity-30 cursor-pointer"
                      title="Премести наляво"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMoveReviewImage(idx, "right")}
                      disabled={idx === reviewsImages.length - 1 || isPending}
                      className="p-1.5 rounded-lg bg-brand-bg hover:bg-brand-purple hover:text-white transition-colors disabled:opacity-30 cursor-pointer"
                      title="Премести надясно"
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeleteReviewImage(img.id, img.public_url)}
                    disabled={isPending}
                    className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-colors cursor-pointer"
                    title="Изтрий отзива"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-brand-muted text-xs font-sans">
            Все още няма качени скрийншоти на отзиви. Натиснете бутона „Качи нов отзив“, за да добавите.
          </div>
        )}
      </div>

      {/* ============================================================ */}
      {/* SECTION 2: 3 MAIN VALUES ("ЗАЩО ДА ИЗБЕРЕТЕ УМЕНИЕ?") */}
      {/* ============================================================ */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-card border border-brand-purple/15 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-brand-purple/10">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-brand-purple" />
              <h2 className="font-heading font-bold text-xl text-brand-dark">
                2. Трите основни ценности („ЗАЩО ДА ИЗБЕРЕТЕ УМЕНИЕ?“)
              </h2>
            </div>
            <p className="text-xs text-brand-muted mt-1">
              Редактирайте заглавията и описанията в горната 3-колонна секция на `/za-nas`.
            </p>
          </div>

          <button
            type="button"
            onClick={handleSaveTexts}
            disabled={isPending}
            className="px-5 py-2.5 rounded-full bg-brand-purple text-white font-heading font-bold text-xs uppercase tracking-wider shadow-button hover:bg-brand-purple-hover transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 self-start sm:self-auto"
          >
            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Запази всички текстове</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {values.map((val, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-brand-bg/50 border border-brand-purple/15 space-y-3">
              <span className="inline-block px-2.5 py-0.5 rounded-md bg-brand-purple/10 text-brand-purple text-[10px] font-bold">
                Ценност #{idx + 1}
              </span>

              <div>
                <label className="block text-xs font-bold text-brand-dark mb-1">
                  Заглавие
                </label>
                <input
                  type="text"
                  value={val.title}
                  onChange={(e) => {
                    const updated = [...values];
                    updated[idx] = { ...updated[idx], title: e.target.value };
                    setValues(updated);
                  }}
                  className="w-full px-3.5 py-2 rounded-xl border border-brand-purple/20 text-xs font-heading font-bold text-brand-dark focus:ring-2 focus:ring-brand-purple focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-dark mb-1">
                  Описание
                </label>
                <textarea
                  rows={4}
                  value={val.text}
                  onChange={(e) => {
                    const updated = [...values];
                    updated[idx] = { ...updated[idx], text: e.target.value };
                    setValues(updated);
                  }}
                  className="w-full px-3.5 py-2 rounded-xl border border-brand-purple/20 text-xs text-brand-dark focus:ring-2 focus:ring-brand-purple focus:outline-none leading-relaxed"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ============================================================ */}
      {/* SECTION 3: 3 SECONDARY FEATURES ("И ОЩЕ НЕЩО ВАЖНО") */}
      {/* ============================================================ */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-card border border-brand-purple/15 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-brand-purple/10">
          <div>
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-brand-purple" />
              <h2 className="font-heading font-bold text-xl text-brand-dark">
                3. Вторични акценти („И ОЩЕ НЕЩО ВАЖНО“)
              </h2>
            </div>
            <p className="text-xs text-brand-muted mt-1">
              Редактирайте заглавията и текстовете в долната 3-колонна секция на `/za-nas`.
            </p>
          </div>

          <button
            type="button"
            onClick={handleSaveTexts}
            disabled={isPending}
            className="px-5 py-2.5 rounded-full bg-brand-purple text-white font-heading font-bold text-xs uppercase tracking-wider shadow-button hover:bg-brand-purple-hover transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 self-start sm:self-auto"
          >
            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Запази всички текстове</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feat, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-brand-bg/50 border border-brand-purple/15 space-y-3">
              <span className="inline-block px-2.5 py-0.5 rounded-md bg-blue-100 text-blue-800 text-[10px] font-bold">
                Акцент #{idx + 1}
              </span>

              <div>
                <label className="block text-xs font-bold text-brand-dark mb-1">
                  Заглавие
                </label>
                <input
                  type="text"
                  value={feat.title}
                  onChange={(e) => {
                    const updated = [...features];
                    updated[idx] = { ...updated[idx], title: e.target.value };
                    setFeatures(updated);
                  }}
                  className="w-full px-3.5 py-2 rounded-xl border border-brand-purple/20 text-xs font-heading font-bold text-brand-dark focus:ring-2 focus:ring-brand-purple focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-dark mb-1">
                  Описание
                </label>
                <textarea
                  rows={4}
                  value={feat.text}
                  onChange={(e) => {
                    const updated = [...features];
                    updated[idx] = { ...updated[idx], text: e.target.value };
                    setFeatures(updated);
                  }}
                  className="w-full px-3.5 py-2 rounded-xl border border-brand-purple/20 text-xs text-brand-dark focus:ring-2 focus:ring-brand-purple focus:outline-none leading-relaxed"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
