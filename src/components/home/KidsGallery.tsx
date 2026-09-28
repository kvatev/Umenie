"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface GalleryImage {
  src: string;
  alt: string;
}

const DEFAULT_GALLERY_IMAGES: GalleryImage[] = [
  { src: "/images/gallery-painted-hands.webp", alt: "Творчество и детски арт занимания в УМеНИе" },
  { src: "/images/banner/1.webp", alt: "Уроци и курсове по езици и математика" },
  { src: "/images/banner/2.webp", alt: "Учебна занималня и самостоятелност" },
  { src: "/images/banner/4.webp", alt: "Арт занимания и детски картини" },
  { src: "/images/banner/3.webp", alt: "Плетиво и фина моторика" },
  { src: "/images/banner/6.webp", alt: "Шахмат и логическо мислене" },
];

interface KidsGalleryProps {
  images?: GalleryImage[];
}

export function KidsGallery({ images }: KidsGalleryProps) {
  const galleryImages = images && images.length > 0 ? images : DEFAULT_GALLERY_IMAGES;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const total = galleryImages.length;

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  // Autoplay rotation every 3.5 seconds
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(nextSlide, 3500);
    return () => clearInterval(interval);
  }, [isPaused, nextSlide]);

  // Touch Swipe handlers
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

  return (
    <div
      className="relative w-full overflow-hidden select-none py-2"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* 1. Desktop Multi-Item Carousel View (matching desktop mockup with 5 visible images) */}
      <div className="hidden md:block relative w-full overflow-hidden px-8">
        <div
          className="flex transition-transform duration-500 ease-out gap-4"
          style={{
            transform: `translateX(-${currentIndex * 25}%)`,
          }}
        >
          {galleryImages.concat(galleryImages.slice(0, 4)).map((img, idx) => (
            <div
              key={idx}
              className="w-[calc(25%-12px)] shrink-0 aspect-[4/3] relative rounded-2xl lg:rounded-3xl overflow-hidden shadow-card border-2 border-white bg-white group cursor-pointer"
              onClick={() => setCurrentIndex(idx % total)}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 1024px) 25vw, 320px"
              />
            </div>
          ))}
        </div>
      </div>

      {/* 2. Mobile Single-Item with Side-Peeks View (matching mobile mockup 1:1) */}
      <div className="block md:hidden relative max-w-md mx-auto h-[220px] xs:h-[260px] sm:h-[320px] px-4">
        {galleryImages.map((img, idx) => {
          let position = "opacity-0 pointer-events-none scale-95 translate-x-full";
          if (idx === currentIndex) {
            position = "opacity-100 pointer-events-auto scale-100 translate-x-0 z-20";
          } else if (idx === (currentIndex - 1 + total) % total) {
            position = "opacity-40 -translate-x-[78%] scale-90 z-10 block pointer-events-none";
          } else if (idx === (currentIndex + 1) % total) {
            position = "opacity-40 translate-x-[78%] scale-90 z-10 block pointer-events-none";
          }

          return (
            <div
              key={idx}
              className={`absolute inset-0 transition-all duration-500 ease-out flex items-center justify-center ${position}`}
            >
              <div className="relative w-[82%] h-full rounded-2xl overflow-hidden shadow-2xl border-2 border-white bg-white">
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover"
                  sizes="80vw"
                  priority={idx === 0}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Left Arrow */}
      <button
        onClick={prevSlide}
        aria-label="Предишна снимка"
        className="absolute left-0 sm:left-2 top-1/2 -translate-y-1/2 z-30 p-2 sm:p-3 rounded-full bg-white/95 text-brand-purple hover:bg-brand-purple hover:text-white shadow-xl backdrop-blur-sm transition-all transform hover:scale-110 active:scale-95 cursor-pointer"
      >
        <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6" />
      </button>

      {/* Navigation Right Arrow */}
      <button
        onClick={nextSlide}
        aria-label="Следваща снимка"
        className="absolute right-0 sm:right-2 top-1/2 -translate-y-1/2 z-30 p-2 sm:p-3 rounded-full bg-white/95 text-brand-purple hover:bg-brand-purple hover:text-white shadow-xl backdrop-blur-sm transition-all transform hover:scale-110 active:scale-95 cursor-pointer"
      >
        <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6" />
      </button>

      {/* Dots Indicator */}
      <div className="flex items-center justify-center gap-2 mt-5 sm:mt-6">
        {galleryImages.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            aria-label={`Снимка ${idx + 1}`}
            className={`transition-all duration-300 rounded-full cursor-pointer ${
              idx === currentIndex
                ? "w-6 sm:w-7 h-2 sm:h-2.5 bg-brand-purple"
                : "w-2 sm:w-2.5 h-2 sm:h-2.5 bg-brand-purple/30 hover:bg-brand-purple/60"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
