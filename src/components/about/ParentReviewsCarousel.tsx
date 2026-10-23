"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  ThumbsUp,
  Heart,
  Globe,
  MoreHorizontal,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n";

export interface SocialReview {
  id: string;
  name: string;
  date: string;
  avatarBg: string;
  avatarText: string;
  image?: string;
  text: string;
  likesCount: number;
  commentsCount?: number;
}

const DEFAULT_REVIEWS: SocialReview[] = [
  {
    id: "review-1",
    name: "Даниела Петрова",
    date: "27 ноември 2024 г.",
    avatarBg: "bg-purple-200 text-purple-800",
    avatarText: "ДП",
    text: "Прекрасна атмосфера и отдаден екип! Дъщеря ми посещава занятията с удоволствие, работят с внимание и търпение. Радвам се, че ви открихме! ❤️",
    likesCount: 14,
    commentsCount: 2,
  },
  {
    id: "review-2",
    name: "Нели Иванова",
    date: "12 март",
    avatarBg: "bg-rose-200 text-rose-800",
    avatarText: "НИ",
    text: "Благодарим на целия екип на УМеНие! Дъщеря ми ходи с огромно желание на заниманията и винаги се прибира усмихната и пълна с нови идеи! 💜",
    likesCount: 42,
    commentsCount: 6,
  },
  {
    id: "review-3",
    name: "Иван Димитров",
    date: "3 март",
    avatarBg: "bg-blue-200 text-blue-800",
    avatarText: "ИД",
    text: "Страхотен екип и прекрасна атмосфера! Синът ми посещава курса по шах и вече има първи успехи. Благодаря за търпението и мотивацията! 💪",
    likesCount: 32,
    commentsCount: 4,
  },
  {
    id: "review-4",
    name: "Мария Георгиева",
    date: "18 януари",
    avatarBg: "bg-emerald-200 text-emerald-800",
    avatarText: "МГ",
    text: "Учебната занималня промени изцяло спокойствието у дома! Уроците са написани с лекота, а вкъщи имаме време за истински семейни разговори и почивка. Благодарим ви! 🌟",
    likesCount: 28,
    commentsCount: 5,
  },
  {
    id: "review-5",
    name: "Пламен Стоянов",
    date: "9 февруари",
    avatarBg: "bg-amber-200 text-amber-800",
    avatarText: "ПС",
    text: "Много сме доволни от уроците по английски и арт ателието. Личи си, че децата учат чрез практика и интерес, без излишен стрес и с лично внимание към всяко едно. Препоръчвам горещо! 🎨",
    likesCount: 37,
    commentsCount: 3,
  },
];

export interface ParentReviewImage {
  id: string;
  public_url: string;
  display_order?: number;
}

interface ParentReviewsCarouselProps {
  screenshotUrl?: string | null;
  reviewImages?: ParentReviewImage[];
}

export function ParentReviewsCarousel({
  screenshotUrl,
  reviewImages = [],
}: ParentReviewsCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const { dict, locale } = useLanguage();

  // If dynamic images are supplied via Supabase Media Manager, prioritize them
  const reviews: SocialReview[] = useMemo(() => {
    if (reviewImages && reviewImages.length > 0) {
      return reviewImages.map((img, idx) => ({
        id: img.id,
        name: `${dict.about.reviewsHeading} ${idx + 1}`,
        date: "",
        avatarBg: "bg-purple-200 text-purple-800",
        avatarText: `О${idx + 1}`,
        image: img.public_url,
        text: "",
        likesCount: 20 + idx * 3,
      }));
    }

    if (locale === "en" && (dict.about as any).reviews) {
      const enReviewsList = (dict.about as any).reviews;
      return DEFAULT_REVIEWS.map((r, i) => {
        const trans = enReviewsList[i];
        if (trans) {
          return {
            ...r,
            name: trans.name,
            date: trans.date,
            avatarText: trans.avatarText,
            text: trans.text,
          };
        }
        return r;
      });
    }

    return DEFAULT_REVIEWS;
  }, [reviewImages, dict, locale]);

  const total = reviews.length;

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? total - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === total - 1 ? 0 : prev + 1));
  };

  return (
    <div className="relative max-w-6xl mx-auto px-2 sm:px-6">
      {/* Navigation Arrows for Desktop & Tablet */}
      <div className="hidden sm:flex items-center justify-between absolute top-1/2 -translate-y-1/2 left-0 right-0 z-20 pointer-events-none px-0 lg:-mx-4">
        <button
          onClick={handlePrev}
          aria-label="Previous review"
          className="p-3 rounded-full bg-white text-brand-purple shadow-xl hover:bg-[#887ed8] hover:text-white transition-all transform hover:scale-110 active:scale-95 pointer-events-auto cursor-pointer border border-brand-purple/20"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={handleNext}
          aria-label="Next review"
          className="p-3 rounded-full bg-white text-brand-purple shadow-xl hover:bg-[#887ed8] hover:text-white transition-all transform hover:scale-110 active:scale-95 pointer-events-auto cursor-pointer border border-brand-purple/20"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Main Viewport Container */}
      <div className="overflow-hidden py-4">
        {/* DESKTOP 3-CARD GRID VIEW */}
        <div className="hidden md:grid md:grid-cols-3 gap-6 items-stretch">
          {[0, 1, 2].map((offset) => {
            const index = (currentIndex + offset) % total;
            const review = reviews[index];

            return (
              <div
                key={`${review.id}-${offset}`}
                className={cn(
                  "bg-white rounded-3xl p-5 lg:p-6 shadow-xl border border-brand-purple/15 flex flex-col justify-between transition-all duration-500 min-h-[300px]",
                  offset === 1
                    ? "scale-105 z-10 shadow-2xl ring-2 ring-white/60"
                    : "opacity-95 hover:opacity-100"
                )}
              >
                {review.image ? (
                  <div className="flex flex-col justify-between h-full space-y-3">
                    <div
                      className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer group"
                      onClick={() => setZoomedImage(review.image || null)}
                    >
                      <Image
                        src={review.image}
                        alt={review.name}
                        fill
                        className="object-cover object-top transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 1024px) 50vw, 380px"
                      />
                    </div>
                    <div className="pt-2 border-t border-brand-purple/10 flex items-center justify-between text-xs text-brand-muted">
                      <span className="font-semibold text-brand-dark/80">{review.name}</span>
                      <span className="text-brand-purple font-medium">{dict.about.originalScreenshotBadge}</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col justify-between h-full">
                    <div>
                      {/* Social Header */}
                      <div className="flex items-center justify-between gap-3 mb-3.5">
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className={cn(
                              "w-11 h-11 rounded-full flex items-center justify-center font-heading font-bold text-sm shadow-inner shrink-0",
                              review.avatarBg
                            )}
                          >
                            {review.avatarText}
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-heading font-bold text-base text-brand-dark leading-snug truncate">
                              {review.name}
                            </h4>
                            <div className="flex items-center gap-1.5 text-xs text-brand-muted">
                              <span>{review.date}</span>
                              <span>•</span>
                              <Globe className="w-3 h-3 text-brand-muted/70" />
                            </div>
                          </div>
                        </div>
                        <MoreHorizontal className="w-5 h-5 text-brand-muted/50 shrink-0" />
                      </div>

                      {/* Body Text */}
                      <p className="text-sm text-brand-dark/90 leading-relaxed font-sans min-h-[90px]">
                        {review.text}
                      </p>
                    </div>

                    {/* Footer with reactions */}
                    <div className="pt-3.5 border-t border-brand-purple/10 mt-4 flex items-center justify-between text-xs text-brand-muted">
                      <div className="flex items-center gap-1.5">
                        <span className="flex -space-x-1 items-center">
                          <span className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center text-[10px] shadow-sm">
                            <ThumbsUp className="w-3 h-3 fill-current" />
                          </span>
                          <span className="w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center text-[10px] shadow-sm">
                            <Heart className="w-3 h-3 fill-current" />
                          </span>
                        </span>
                        <span className="font-semibold text-brand-dark/80 pl-1">
                          {review.likesCount}
                        </span>
                      </div>

                      {review.commentsCount && (
                        <span className="hover:underline cursor-pointer">
                          {review.commentsCount} {dict.about.commentsSuffix}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* MOBILE SINGLE CARD VIEW */}
        <div className="md:hidden">
          {(() => {
            const review = reviews[currentIndex];
            return (
              <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-xl border border-brand-purple/15 flex flex-col justify-between min-h-[270px] animate-fade-in mx-1">
                {review.image ? (
                  <div className="flex flex-col justify-between h-full space-y-3">
                    <div
                      className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer"
                      onClick={() => setZoomedImage(review.image || null)}
                    >
                      <Image
                        src={review.image}
                        alt={review.name}
                        fill
                        className="object-cover object-top"
                        sizes="(max-width: 640px) 100vw, 320px"
                      />
                    </div>
                    <div className="pt-2 border-t border-brand-purple/10 flex items-center justify-between text-xs text-brand-muted">
                      <span className="font-semibold text-brand-dark/80">{review.name}</span>
                      <span className="text-brand-purple font-medium">{dict.about.originalScreenshotBadge}</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col justify-between h-full">
                    <div>
                      <div className="flex items-center justify-between gap-3 mb-3.5">
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              "w-11 h-11 rounded-full flex items-center justify-center font-heading font-bold text-sm shadow-inner shrink-0",
                              review.avatarBg
                            )}
                          >
                            {review.avatarText}
                          </div>
                          <div>
                            <h4 className="font-heading font-bold text-base text-brand-dark leading-snug">
                              {review.name}
                            </h4>
                            <div className="flex items-center gap-1.5 text-xs text-brand-muted">
                              <span>{review.date}</span>
                              <span>•</span>
                              <Globe className="w-3 h-3 text-brand-muted/70" />
                            </div>
                          </div>
                        </div>
                        <MoreHorizontal className="w-5 h-5 text-brand-muted/50" />
                      </div>

                      <p className="text-sm text-brand-dark/90 leading-relaxed font-sans">
                        {review.text}
                      </p>
                    </div>

                    <div className="pt-3.5 border-t border-brand-purple/10 mt-4 flex items-center justify-between text-xs text-brand-muted">
                      <div className="flex items-center gap-1.5">
                        <span className="flex -space-x-1 items-center">
                          <span className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center text-[10px] shadow-sm">
                            <ThumbsUp className="w-3 h-3 fill-current" />
                          </span>
                          <span className="w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center text-[10px] shadow-sm">
                            <Heart className="w-3 h-3 fill-current" />
                          </span>
                        </span>
                        <span className="font-semibold text-brand-dark/80 pl-1">
                          {review.likesCount}
                        </span>
                      </div>

                      {review.commentsCount && (
                        <span>{review.commentsCount} {dict.about.commentsSuffix}</span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      </div>

      {/* Pagination Dots */}
      <div className="flex items-center justify-center gap-2 mt-4 sm:mt-6">
        {reviews.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            aria-label={`Review ${idx + 1}`}
            className={cn(
              "h-2.5 rounded-full transition-all duration-300 cursor-pointer",
              currentIndex === idx
                ? "w-8 bg-white"
                : "w-2.5 bg-white/50 hover:bg-white/75"
            )}
          />
        ))}
      </div>

      {/* Lightbox Zoom Modal for Screenshot */}
      {zoomedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setZoomedImage(null)}
        >
          <div className="relative max-w-3xl w-full max-h-[90vh] bg-white rounded-3xl p-4 shadow-2xl">
            <button
              onClick={() => setZoomedImage(null)}
              className="absolute -top-3 -right-3 p-2 bg-white text-brand-dark rounded-full shadow-lg hover:bg-brand-purple hover:text-white transition-colors cursor-pointer"
              aria-label={dict.about.lightboxClose}
            >
              <X className="w-5 h-5" />
            </button>
            <div className="relative w-full h-[60vh]">
              <Image
                src={zoomedImage}
                alt="Review"
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
