"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

const GALLERY_IMAGES = [
  { src: "/images/banner/1.png", alt: "Деца по време на занятие в УМеНИе" },
  { src: "/images/banner/2.png", alt: "Детски шах и стратегическо мислене" },
  { src: "/images/banner/3.png", alt: "Учебна занималня и активни ученици" },
  { src: "/images/banner/4.png", alt: "Рисуване и арт занимания за деца" },
  { src: "/images/banner/5.png", alt: "Творчески умения и усмивки" },
  { src: "/images/banner/6.png", alt: "Приятелства и знания в малки групи" },
];

export function KidsGallery() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % GALLERY_IMAGES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length);
  }, []);

  // Auto slide effect
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(nextSlide, 3500);
    return () => clearInterval(interval);
  }, [isPaused, nextSlide]);

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 40) {
      nextSlide();
    } else if (diff < -40) {
      prevSlide();
    }
    touchStartX.current = null;
  };

  return (
    <div
      className="relative w-full overflow-hidden select-none py-4"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Slides Container */}
      <div className="relative max-w-4xl mx-auto h-[280px] sm:h-[380px] md:h-[440px] px-4">
        {GALLERY_IMAGES.map((img, idx) => {
          // Calculate relative distance
          let position = "opacity-0 pointer-events-none scale-95 translate-x-full";
          if (idx === currentIndex) {
            position = "opacity-100 pointer-events-auto scale-100 translate-x-0 z-20";
          } else if (
            idx === (currentIndex - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length
          ) {
            position = "opacity-0 sm:opacity-40 -translate-x-[70%] scale-90 z-10 hidden sm:block";
          } else if (idx === (currentIndex + 1) % GALLERY_IMAGES.length) {
            position = "opacity-0 sm:opacity-40 translate-x-[70%] scale-90 z-10 hidden sm:block";
          }

          return (
            <div
              key={idx}
              className={`absolute inset-0 transition-all duration-700 ease-out flex items-center justify-center ${position}`}
            >
              <div className="relative w-full h-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 700px"
                  priority={idx === 0}
                />
              </div>
            </div>
          );
        })}

        {/* Left Arrow Button */}
        <button
          onClick={prevSlide}
          aria-label="Предишна снимка"
          className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-30 p-2.5 sm:p-3 rounded-full bg-white/90 text-brand-purple hover:bg-brand-purple hover:text-white shadow-lg backdrop-blur-sm transition-all transform hover:scale-110 active:scale-95"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Right Arrow Button */}
        <button
          onClick={nextSlide}
          aria-label="Следваща снимка"
          className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-30 p-2.5 sm:p-3 rounded-full bg-white/90 text-brand-purple hover:bg-brand-purple hover:text-white shadow-lg backdrop-blur-sm transition-all transform hover:scale-110 active:scale-95"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </div>

      {/* Dots Indicator */}
      <div className="flex items-center justify-center gap-2.5 mt-6">
        {GALLERY_IMAGES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            aria-label={`Отиди на снимка ${idx + 1}`}
            className={`transition-all duration-300 rounded-full ${
              idx === currentIndex
                ? "w-8 h-2.5 bg-brand-purple"
                : "w-2.5 h-2.5 bg-brand-purple/30 hover:bg-brand-purple/60"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
