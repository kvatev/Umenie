"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  Globe,
  MoreHorizontal,
  ThumbsUp,
  Heart,
  Maximize2,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

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

interface ParentReviewsCarouselProps {
  screenshotUrl?: string | null;
}

export function ParentReviewsCarousel({ screenshotUrl }: ParentReviewsCarouselProps) {
  const reviews = useMemo(() => {
    if (screenshotUrl) {
      return [
        {
          id: "review-screenshot",
          name: "Родител в УМеНИе",
          date: "Актуален отзив",
          avatarBg: "bg-purple-200 text-purple-800",
          avatarText: "УМ",
          image: screenshotUrl,
          text: "Оригинален отзив от родител в клуб УМеНИе.",
          likesCount: 48,
          commentsCount: 7,
        },
        ...DEFAULT_REVIEWS,
      ];
    }
    return DEFAULT_REVIEWS;
  }, [screenshotUrl]);

  const [currentIndex, setCurrentIndex] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);

  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const total = reviews.length;

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? total - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === total - 1 ? 0 : prev + 1));
  };

  // Optional auto-rotation every 6 seconds
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(nextSlide, 6000);
    return () => clearInterval(interval);
  }, [isPaused, total]);

  // Touch Swipe handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchEndX.current = null;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current !== null && touchEndX.current !== null) {
      const diff = touchStartX.current - touchEndX.current;
      if (diff > 45) {
        nextSlide();
      } else if (diff < -45) {
        prevSlide();
      }
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  // Indices for 3 visible cards on desktop: prev, current, next
  const prevIndex = (currentIndex - 1 + total) % total;
  const nextIdx = (currentIndex + 1) % total;

  return (
    <div
      className="relative w-full max-w-5xl mx-auto px-2 sm:px-8 select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Navigation Arrow Left */}
      <button
        onClick={prevSlide}
        aria-label="Предишен отзив"
        className="absolute left-0 sm:left-2 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-white text-brand-purple shadow-xl flex items-center justify-center hover:bg-brand-purple hover:text-white transition-all transform hover:scale-110 active:scale-95 cursor-pointer focus:outline-none"
      >
        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
      </button>

      {/* Navigation Arrow Right */}
      <button
        onClick={nextSlide}
        aria-label="Следващ отзив"
        className="absolute right-0 sm:right-2 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-white text-brand-purple shadow-xl flex items-center justify-center hover:bg-brand-purple hover:text-white transition-all transform hover:scale-110 active:scale-95 cursor-pointer focus:outline-none"
      >
        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
      </button>

      {/* Cards View */}
      <div className="overflow-hidden py-4 sm:py-6">
        {/* DESKTOP 3-CARD VIEW */}
        <div className="hidden md:grid grid-cols-3 gap-5 sm:gap-6 items-center">
          {[prevIndex, currentIndex, nextIdx].map((reviewIdx, pos) => {
            const review = reviews[reviewIdx];
            const isCenter = pos === 1;

            return (
              <div
                key={`${review.id}-${pos}`}
                onClick={() => {
                  if (pos === 0) prevSlide();
                  if (pos === 2) nextSlide();
                }}
                className={cn(
                  "bg-white rounded-3xl p-5 sm:p-7 shadow-card transition-all duration-300 flex flex-col justify-between cursor-pointer border border-brand-purple/10 min-h-[300px]",
                  isCenter
                    ? "scale-105 shadow-2xl z-10 ring-4 ring-white/90 opacity-100"
                    : "scale-95 opacity-70 hover:opacity-90"
                )}
              >
                {review.image ? (
                  /* Screenshot Card: square/sub-rectangular container */
                  <div className="flex flex-col justify-between h-full space-y-3">
                    <div
                      className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer group"
                      onClick={(e) => {
                        e.stopPropagation();
                        setZoomedImage(review.image || null);
                      }}
                    >
                      <Image
                        src={review.image}
                        alt={review.name}
                        fill
                        className="object-cover object-top transition-transform duration-300 group-hover:scale-105"
                        sizes="320px"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 text-brand-dark text-xs font-semibold px-3 py-1.5 rounded-full shadow-md flex items-center gap-1.5">
                          <Maximize2 className="w-3.5 h-3.5 text-brand-purple" />
                          Преглед
                        </span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-brand-purple/10 flex items-center justify-between text-xs text-brand-muted">
                      <span className="font-semibold text-brand-dark/80">{review.name}</span>
                      <span className="text-brand-purple font-medium">Оригинален скрийншот</span>
                    </div>
                  </div>
                ) : (
                  /* Social Review Card (matching mockup 1:1) */
                  <div className="flex flex-col justify-between h-full">
                    <div>
                      {/* Header */}
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
                            <h4 className="font-heading font-bold text-sm text-brand-dark leading-snug">
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
                          {review.commentsCount} коментара
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* MOBILE SINGLE CARD VIEW (matching mobile mockup 1:1) */}
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
                      <span className="text-brand-purple font-medium">Оригинален скрийншот</span>
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
                        <span>{review.commentsCount} коментара</span>
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
      <div className="flex items-center justify-center gap-2 pt-2 sm:pt-4">
        {reviews.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            aria-label={`Отиди на отзив ${idx + 1}`}
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
              aria-label="Затвори"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="relative w-full h-[60vh]">
              <Image
                src={zoomedImage}
                alt="Пълен размер на отзива"
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
