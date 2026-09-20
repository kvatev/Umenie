"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Globe, MoreHorizontal, ThumbsUp, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

interface SocialReview {
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

const REVIEWS: SocialReview[] = [
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

export function ParentReviewsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(1); // Default to middle card (Нели Иванова)
  const [isPaused, setIsPaused] = useState(false);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? REVIEWS.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === REVIEWS.length - 1 ? 0 : prev + 1));
  };

  // Optional auto-rotation every 6 seconds
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 6000);
    return () => clearInterval(interval);
  }, [isPaused, currentIndex]);

  // Determine indices for 3 visible cards on desktop: prev, current, next
  const prevIndex = (currentIndex - 1 + REVIEWS.length) % REVIEWS.length;
  const nextIdx = (currentIndex + 1) % REVIEWS.length;

  return (
    <div
      className="relative w-full max-w-5xl mx-auto px-4 sm:px-8"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Navigation Arrow Left */}
      <button
        onClick={prevSlide}
        aria-label="Предишен отзив"
        className="absolute left-0 sm:left-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white text-brand-purple shadow-lg flex items-center justify-center hover:bg-brand-purple hover:text-white transition-all transform hover:scale-110 active:scale-95 cursor-pointer focus:outline-none"
      >
        <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
      </button>

      {/* Navigation Arrow Right */}
      <button
        onClick={nextSlide}
        aria-label="Следващ отзив"
        className="absolute right-0 sm:right-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white text-brand-purple shadow-lg flex items-center justify-center hover:bg-brand-purple hover:text-white transition-all transform hover:scale-110 active:scale-95 cursor-pointer focus:outline-none"
      >
        <ChevronRight className="w-6 h-6 stroke-[2.5]" />
      </button>

      {/* Cards View */}
      <div className="overflow-hidden py-6">
        {/* DESKTOP 3-CARD VIEW */}
        <div className="hidden md:grid grid-cols-3 gap-6 items-stretch">
          {[prevIndex, currentIndex, nextIdx].map((reviewIdx, pos) => {
            const review = REVIEWS[reviewIdx];
            const isCenter = pos === 1;

            return (
              <div
                key={`${review.id}-${pos}`}
                onClick={() => {
                  if (pos === 0) prevSlide();
                  if (pos === 2) nextSlide();
                }}
                className={cn(
                  "bg-white rounded-3xl p-6 sm:p-7 shadow-card transition-all duration-300 flex flex-col justify-between cursor-pointer border border-brand-purple/10",
                  isCenter
                    ? "scale-105 shadow-2xl z-10 ring-2 ring-white/80 opacity-100"
                    : "scale-95 opacity-70 hover:opacity-90"
                )}
              >
                {/* Header */}
                <div>
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "w-12 h-12 rounded-full flex items-center justify-center font-heading font-bold text-sm shadow-inner",
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
                    <MoreHorizontal className="w-5 h-5 text-brand-muted/50" />
                  </div>

                  {/* Body Text */}
                  <p className="text-sm text-brand-dark/90 leading-relaxed font-sans min-h-[90px]">
                    {review.text}
                  </p>
                </div>

                {/* Footer with reactions */}
                <div className="pt-4 border-t border-brand-purple/10 mt-4 flex items-center justify-between text-xs text-brand-muted">
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
            );
          })}
        </div>

        {/* MOBILE SINGLE CARD VIEW */}
        <div className="md:hidden">
          {(() => {
            const review = REVIEWS[currentIndex];
            return (
              <div className="bg-white rounded-3xl p-6 shadow-xl border border-brand-purple/15 flex flex-col justify-between min-h-[260px] animate-fade-in">
                <div>
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "w-12 h-12 rounded-full flex items-center justify-center font-heading font-bold text-sm shadow-inner",
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

                <div className="pt-4 border-t border-brand-purple/10 mt-5 flex items-center justify-between text-xs text-brand-muted">
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
            );
          })()}
        </div>
      </div>

      {/* Pagination Dots */}
      <div className="flex items-center justify-center gap-2 pt-4">
        {REVIEWS.map((_, idx) => (
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
    </div>
  );
}
