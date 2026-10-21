"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import {
  ThumbsUp,
  Heart,
  Star,
  CheckCircle,
  Maximize2,
  X,
  MessageSquareQuote,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ReviewImageRecord } from "@/actions/admin-media";

interface ReviewsSectionProps {
  screenshotUrl?: string | null;
  reviewImages?: ReviewImageRecord[];
}

export function ReviewsSection({
  screenshotUrl,
  reviewImages,
}: ReviewsSectionProps) {
  // Collect all unique review image URLs
  const reviewsList: string[] = React.useMemo(() => {
    const list: string[] = [];
    if (reviewImages && reviewImages.length > 0) {
      reviewImages.forEach((img) => {
        if (img.public_url && !list.includes(img.public_url)) {
          list.push(img.public_url);
        }
      });
    }
    // Also include screenshotUrl if provided and not already in list
    if (screenshotUrl && !list.includes(screenshotUrl)) {
      list.push(screenshotUrl);
    }
    return list;
  }, [screenshotUrl, reviewImages]);

  const totalReviews = reviewsList.length;
  const isMultiReview = totalReviews >= 2;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Touch swipe handling
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? totalReviews - 1 : prev - 1));
  }, [totalReviews]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === totalReviews - 1 ? 0 : prev + 1));
  }, [totalReviews]);

  // Autoplay rotation when >= 2 reviews and not paused
  useEffect(() => {
    if (!isMultiReview || isPaused || isZoomed) return;
    const interval = setInterval(() => {
      handleNext();
    }, 5500);
    return () => clearInterval(interval);
  }, [isMultiReview, isPaused, isZoomed, handleNext]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!isZoomed) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsZoomed(false);
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isZoomed, handlePrev, handleNext]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 45) {
      // Swiped left -> next
      handleNext();
    } else if (diff < -45) {
      // Swiped right -> prev
      handlePrev();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <section className="py-12 sm:py-20 bg-brand-bg relative overflow-hidden">
      <Container size="xl">
        {/* Header */}
        <div className="text-left sm:text-center max-w-2xl mx-auto mb-8 sm:mb-12 space-y-2">
          <div className="text-left sm:text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-brand-purple/10 text-brand-purple px-4 py-1.5 text-xs sm:text-sm font-semibold tracking-wide">
              <MessageSquareQuote className="w-4 h-4" />
              Доверие от родителите
            </span>
          </div>
          <h2 className="font-heading font-bold text-2xl sm:text-4xl text-brand-purple tracking-wide uppercase text-left sm:text-center">
            ЕТО КАКВО КАЗВАТ РОДИТЕЛИТЕ
          </h2>
          <p className="text-brand-muted text-xs sm:text-base text-left sm:text-center">
            Реални отзиви и впечатления от семействата в образователен клуб „УМеНИе“.
          </p>
        </div>

        {/* Reviews Container */}
        <div className="w-full flex justify-center">
          {totalReviews === 0 ? (
            /* Fallback: Default authentic Facebook review card */
            <div className="w-full max-w-xl bg-white rounded-3xl p-5 sm:p-7 shadow-card border border-brand-purple/20 transition-all duration-300 hover:shadow-card-hover group relative">
              <div className="space-y-4">
                <div className="flex items-center gap-3.5 pb-3 border-b border-gray-100">
                  <div className="w-12 h-12 rounded-full bg-brand-purple text-white flex items-center justify-center font-heading font-bold text-xl shrink-0 shadow-sm">
                    Н
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-heading font-bold text-base text-brand-dark truncate">
                        Нели Иванова
                      </h4>
                      <span className="text-blue-500 shrink-0" title="Потвърден родител">
                        <CheckCircle className="w-4 h-4 fill-blue-500 text-white" />
                      </span>
                    </div>
                    <p className="text-xs text-brand-muted truncate">
                      12 март · Препоръчва <strong className="text-brand-purple">Образователен клуб „УМеНИе“</strong> · 🌐
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className="w-5 h-5 fill-brand-yellow text-brand-yellow drop-shadow-sm"
                    />
                  ))}
                  <span className="text-xs font-bold text-brand-dark/70 ml-2">
                    5.0 от 5
                  </span>
                </div>

                <p className="text-brand-dark text-sm sm:text-base leading-relaxed font-medium text-left">
                  „Искам да благодаря от сърце на прекрасния екип на клуб УМеНИе! Дъщеря ми посещава учебната занималня и уроците по английски език. Прибира се усмихната, уверена и с отлично подготвени уроци. Индивидуалният подход и грижата на преподавателите правят истински чудеса за мотивацията ѝ. Препоръчвам с две ръце на всички родители в Бургас!“
                </p>

                <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-brand-muted font-medium">
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-1 items-center">
                      <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-sm">
                        <ThumbsUp className="w-3.5 h-3.5 fill-white" />
                      </span>
                      <span className="w-6 h-6 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-sm">
                        <Heart className="w-3.5 h-3.5 fill-white" />
                      </span>
                    </div>
                    <span className="font-semibold text-brand-dark/80">48 харесвания</span>
                  </div>
                  <span>12 коментара</span>
                </div>
              </div>
            </div>
          ) : totalReviews === 1 ? (
            /* Clean single review display with click to zoom */
            <div className="w-full max-w-xl bg-white rounded-3xl p-4 sm:p-6 shadow-card border border-brand-purple/20 transition-all duration-300 hover:shadow-card-hover group relative">
              <div
                className="relative w-full aspect-[16/10] sm:aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer bg-slate-900"
                onClick={() => setIsZoomed(true)}
              >
                <Image
                  src={reviewsList[0]}
                  alt="Отзив за образователен клуб УМеНИе"
                  fill
                  className="object-contain transition-transform duration-300 group-hover:scale-[1.02]"
                  sizes="(max-width: 640px) 100vw, 580px"
                  priority
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors flex items-center justify-center">
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/95 text-brand-purple text-xs font-heading font-bold px-3.5 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 backdrop-blur-xs">
                    <Maximize2 className="w-3.5 h-3.5" />
                    Увеличи отзива
                  </span>
                </div>
              </div>
            </div>
          ) : (
            /* Interactive Slider / Carousel for 2 or more reviews */
            <div
              className="w-full max-w-2xl relative"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-card border border-brand-purple/20 relative group">
                {/* Review Counter Pill */}
                <div className="flex items-center justify-between pb-3 mb-2 border-b border-brand-purple/10 text-xs">
                  <span className="font-heading font-bold text-brand-purple uppercase tracking-wider flex items-center gap-1.5">
                    <MessageSquareQuote className="w-3.5 h-3.5" />
                    Отзив {currentIndex + 1} от {totalReviews}
                  </span>
                  <span className="text-[11px] text-brand-muted hidden xs:inline">
                    Плъзнете наляво/надясно или натиснете стрелките
                  </span>
                </div>

                {/* Main Slide / Active Image with touch listener */}
                <div
                  className="relative w-full aspect-[16/10] sm:aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer bg-slate-950 flex items-center justify-center select-none"
                  onClick={() => setIsZoomed(true)}
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                >
                  <Image
                    key={reviewsList[currentIndex]}
                    src={reviewsList[currentIndex]}
                    alt={`Отзив ${currentIndex + 1} за образователен клуб УМеНИе`}
                    fill
                    className="object-contain transition-all duration-300 group-hover:scale-[1.02]"
                    sizes="(max-width: 640px) 100vw, 680px"
                    priority
                  />

                  {/* Zoom Overlay on Hover */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors flex items-center justify-center pointer-events-none">
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/95 text-brand-purple text-xs font-heading font-bold px-4 py-2 rounded-full shadow-lg flex items-center gap-2 backdrop-blur-xs">
                      <Maximize2 className="w-4 h-4" />
                      Увеличи отзива
                    </span>
                  </div>

                  {/* Left Arrow Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePrev();
                    }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/90 hover:bg-white text-brand-purple shadow-xl border border-brand-purple/15 flex items-center justify-center transition-transform hover:scale-110 active:scale-95 cursor-pointer z-10"
                    aria-label="Предишен отзив"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>

                  {/* Right Arrow Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNext();
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/90 hover:bg-white text-brand-purple shadow-xl border border-brand-purple/15 flex items-center justify-center transition-transform hover:scale-110 active:scale-95 cursor-pointer z-10"
                    aria-label="Следващ отзив"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </div>

                {/* Pagination Dots */}
                <div className="flex justify-center items-center gap-2 mt-4 pt-1">
                  {reviewsList.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setCurrentIndex(idx)}
                      className={cn(
                        "h-2.5 rounded-full transition-all duration-300 cursor-pointer",
                        currentIndex === idx
                          ? "w-8 bg-brand-purple"
                          : "w-2.5 bg-brand-purple/25 hover:bg-brand-purple/50"
                      )}
                      aria-label={`Към отзив ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </Container>

      {/* Lightbox Modal for Zoomed Screenshot (Supports Left/Right arrow keys and buttons!) */}
      {isZoomed && reviewsList.length > 0 && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
          onClick={() => setIsZoomed(false)}
        >
          <div
            className="relative max-w-4xl w-full max-h-[92vh] bg-white rounded-3xl p-3 sm:p-5 shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 px-1 border-b border-brand-purple/10">
              <span className="font-heading font-bold text-xs sm:text-sm text-brand-purple uppercase">
                {isMultiReview
                  ? `Отзив ${currentIndex + 1} от ${totalReviews}`
                  : "Оригинален отзив"}
              </span>
              <button
                onClick={() => setIsZoomed(false)}
                className="p-1.5 rounded-full bg-brand-bg text-brand-dark hover:bg-brand-purple hover:text-white transition-colors cursor-pointer"
                aria-label="Затвори"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Image Area */}
            <div className="relative w-full h-[65vh] sm:h-[75vh] my-2 bg-slate-950 rounded-2xl overflow-hidden flex items-center justify-center">
              <Image
                src={reviewsList[currentIndex] || reviewsList[0]}
                alt={`Пълен размер на отзив ${currentIndex + 1}`}
                fill
                className="object-contain"
                priority
              />

              {/* Prev / Next inside modal if multi-review */}
              {isMultiReview && (
                <>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePrev();
                    }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-brand-purple shadow-xl flex items-center justify-center transition-transform hover:scale-110 active:scale-95 cursor-pointer z-10"
                    aria-label="Предишен отзив"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNext();
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-brand-purple shadow-xl flex items-center justify-center transition-transform hover:scale-110 active:scale-95 cursor-pointer z-10"
                    aria-label="Следващ отзив"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}
            </div>

            {/* Modal Footer / Dots */}
            {isMultiReview && (
              <div className="flex justify-center items-center gap-2 pt-1 pb-1">
                {reviewsList.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCurrentIndex(idx)}
                    className={cn(
                      "h-2 rounded-full transition-all duration-300 cursor-pointer",
                      currentIndex === idx
                        ? "w-6 bg-brand-purple"
                        : "w-2 bg-brand-purple/30"
                    )}
                    aria-label={`Към отзив ${idx + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
