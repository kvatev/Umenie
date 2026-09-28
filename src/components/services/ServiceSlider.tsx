"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ServiceSliderProps {
  images: string[];
  title?: string;
}

export function ServiceSlider({
  images,
  title = "НАДНИКНЕТЕ В ЗАНИМАНИЯТА",
}: ServiceSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const nextSlide = useCallback(() => {
    if (images.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const prevSlide = useCallback(() => {
    if (images.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  useEffect(() => {
    if (isPaused || images.length <= 1) return;
    const timer = setInterval(nextSlide, 3500);
    return () => clearInterval(timer);
  }, [isPaused, images.length, nextSlide]);

  if (!images || images.length === 0) return null;

  return (
    <section className="py-10 sm:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <h3 className="font-heading font-extrabold text-2xl sm:text-3xl lg:text-4xl text-brand-purple text-center mb-8 sm:mb-10 uppercase tracking-wide">
          {title}
        </h3>

        <div
          className="relative max-w-4xl mx-auto h-[280px] sm:h-[400px] md:h-[480px]"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={(e) => {
            touchStartX.current = e.touches[0].clientX;
          }}
          onTouchEnd={(e) => {
            if (touchStartX.current === null) return;
            const diff = touchStartX.current - e.changedTouches[0].clientX;
            if (diff > 40) nextSlide();
            else if (diff < -40) prevSlide();
            touchStartX.current = null;
          }}
        >
          {images.map((imgSrc, idx) => {
            const isActive = idx === currentIndex;
            return (
              <div
                key={idx}
                className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                  isActive
                    ? "opacity-100 scale-100 z-10 pointer-events-auto"
                    : "opacity-0 scale-95 z-0 pointer-events-none"
                }`}
              >
                <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                  <Image
                    src={imgSrc}
                    alt={`${title} - снимка ${idx + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 850px"
                    priority={idx === 0}
                  />
                </div>
              </div>
            );
          })}

          {/* Controls */}
          {images.length > 1 && (
            <>
              <button
                onClick={prevSlide}
                aria-label="Предишна снимка"
                className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 p-2.5 sm:p-3 rounded-full bg-white/90 text-brand-purple hover:bg-brand-purple hover:text-white shadow-lg backdrop-blur-sm transition-all transform hover:scale-110 active:scale-95"
              >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>

              <button
                onClick={nextSlide}
                aria-label="Следваща снимка"
                className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 p-2.5 sm:p-3 rounded-full bg-white/90 text-brand-purple hover:bg-brand-purple hover:text-white shadow-lg backdrop-blur-sm transition-all transform hover:scale-110 active:scale-95"
              >
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </>
          )}
        </div>

        {/* Dots */}
        {images.length > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6 flex-wrap">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Снимка ${idx + 1}`}
                className={`transition-all duration-300 rounded-full ${
                  idx === currentIndex
                    ? "w-8 h-2.5 bg-brand-purple"
                    : "w-2.5 h-2.5 bg-brand-purple/30 hover:bg-brand-purple/60"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
