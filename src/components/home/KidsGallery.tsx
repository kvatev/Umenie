"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

const GALLERY_IMAGES = [
  { src: "/images/gallery-painted-hands.jpg", alt: "Творчество и детски арт занимания в УМеНИе" },
  { src: "/images/banner/1.webp", alt: "Уроци и курсове по езици и математика" },
  { src: "/images/banner/2.webp", alt: "Учебна занималня и самостоятелност" },
  { src: "/images/banner/4.webp", alt: "Арт занимания и детски картини" },
  { src: "/images/banner/3.webp", alt: "Плетиво и фина моторика" },
  { src: "/images/banner/6.webp", alt: "Шахмат и логическо мислене" },
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
    const interval = setInterval(nextSlide, 4000);
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
      <div className="relative max-w-4xl mx-auto h-[240px] xs:h-[280px] sm:h-[380px] md:h-[440px] px-1 sm:px-4">
        {GALLERY_IMAGES.map((img, idx) => {
          // Calculate relative position with side peek previews on all screens
          let position = "opacity-0 pointer-events-none scale-95 translate-x-full";
          if (idx === currentIndex) {
            position = "opacity-100 pointer-events-auto scale-100 translate-x-0 z-20";
          } else if (
            idx === (currentIndex - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length
          ) {
            position = "opacity-40 -translate-x-[75%] sm:-translate-x-[70%] scale-90 z-10 block pointer-events-none";
          } else if (idx === (currentIndex + 1) % GALLERY_IMAGES.length) {
            position = "opacity-40 translate-x-[75%] sm:translate-x-[70%] scale-90 z-10 block pointer-events-none";
          }

          return (
            <div
              key={idx}
              className={`absolute inset-0 transition-all duration-700 ease-out flex items-center justify-center ${position}`}
            >
              <div className="relative w-[78%] sm:w-full h-full max-w-2xl rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border-2 sm:border-4 border-white bg-white">
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 80vw, 700px"
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
          className="absolute left-1 sm:left-4 top-1/2 -translate-y-1/2 z-30 p-2 sm:p-3 rounded-full bg-white/95 text-brand-purple hover:bg-brand-purple hover:text-white shadow-xl backdrop-blur-sm transition-all transform hover:scale-110 active:scale-95 cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6" />
        </button>

        {/* Right Arrow Button */}
        <button
          onClick={nextSlide}
          aria-label="Следваща снимка"
          className="absolute right-1 sm:right-4 top-1/2 -translate-y-1/2 z-30 p-2 sm:p-3 rounded-full bg-white/95 text-brand-purple hover:bg-brand-purple hover:text-white shadow-xl backdrop-blur-sm transition-all transform hover:scale-110 active:scale-95 cursor-pointer"
        >
          <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6" />
        </button>
      </div>

      {/* Dots Indicator */}
      <div className="flex items-center justify-center gap-2 sm:gap-2.5 mt-5 sm:mt-6">
        {GALLERY_IMAGES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            aria-label={`Отиди на снимка ${idx + 1}`}
            className={`transition-all duration-300 rounded-full cursor-pointer ${
              idx === currentIndex
                ? "w-6 sm:w-8 h-2 sm:h-2.5 bg-brand-purple"
                : "w-2 sm:w-2.5 h-2 sm:h-2.5 bg-brand-purple/30 hover:bg-brand-purple/60"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
