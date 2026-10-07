"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { cn } from "@/lib/utils";

export interface GalleryImage {
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
  { src: "/images/banner/5.webp", alt: "Читателски клуб и книги за деца" },
];

interface KidsGalleryProps {
  images?: GalleryImage[];
  order?: string[];
}

export function KidsGallery({ images, order }: KidsGalleryProps) {
  let galleryImages: GalleryImage[] = [];

  if (images && images.length > 0) {
    galleryImages = images;
  } else if (order && order.length > 0) {
    const defaultMap = new Map(DEFAULT_GALLERY_IMAGES.map((img) => [img.src, img]));
    order.forEach((path) => {
      if (defaultMap.has(path)) {
        galleryImages.push(defaultMap.get(path)!);
      } else {
        galleryImages.push({
          src: path,
          alt: "Деца с умения в образователен клуб УМеНИе",
        });
      }
    });
  }

  if (galleryImages.length === 0) {
    galleryImages = DEFAULT_GALLERY_IMAGES;
  }

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: "center",
      skipSnaps: false,
    },
    [
      Autoplay({
        delay: 3500,
        stopOnInteraction: false,
        stopOnMouseEnter: true,
      }),
    ]
  );

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const scrollTo = useCallback(
    (index: number) => {
      if (emblaApi) emblaApi.scrollTo(index);
    },
    [emblaApi]
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    requestAnimationFrame(() => {
      if (emblaApi) {
        setSelectedIndex(emblaApi.selectedScrollSnap());
      }
    });
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <div className="relative w-full overflow-hidden select-none py-2">
      {/* Embla Carousel Viewport */}
      <div className="overflow-hidden w-full cursor-grab active:cursor-grabbing px-2 sm:px-6" ref={emblaRef}>
        <div className="flex -ml-3 sm:-ml-5 items-center">
          {galleryImages.map((img, idx) => (
            <div
              key={idx}
              className="flex-[0_0_82%] xs:flex-[0_0_75%] sm:flex-[0_0_48%] md:flex-[0_0_33.33%] lg:flex-[0_0_25%] min-w-0 pl-3 sm:pl-5"
            >
              <div
                onClick={() => scrollTo(idx)}
                className={cn(
                  "relative aspect-[4/3] rounded-2xl sm:rounded-3xl overflow-hidden shadow-card hover:shadow-card-hover border-2 border-white bg-white group transition-all duration-300 transform",
                  idx === selectedIndex ? "scale-[1.02] ring-2 ring-brand-purple/20" : "scale-100 opacity-90 sm:opacity-100"
                )}
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 80vw, (max-width: 1024px) 33vw, 25vw"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Left Arrow */}
      <button
        onClick={scrollPrev}
        aria-label="Предишна снимка"
        className="absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-3 rounded-full bg-white/95 text-brand-purple hover:bg-brand-purple hover:text-white shadow-xl backdrop-blur-sm transition-all transform hover:scale-110 active:scale-95 cursor-pointer"
      >
        <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6" />
      </button>

      {/* Navigation Right Arrow */}
      <button
        onClick={scrollNext}
        aria-label="Следваща снимка"
        className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-3 rounded-full bg-white/95 text-brand-purple hover:bg-brand-purple hover:text-white shadow-xl backdrop-blur-sm transition-all transform hover:scale-110 active:scale-95 cursor-pointer"
      >
        <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6" />
      </button>

      {/* Dots Indicator */}
      <div className="flex items-center justify-center gap-2 mt-5 sm:mt-6">
        {scrollSnaps.map((_, idx) => (
          <button
            key={idx}
            onClick={() => scrollTo(idx)}
            aria-label={`Снимка ${idx + 1}`}
            className={cn(
              "transition-all duration-300 rounded-full cursor-pointer",
              idx === selectedIndex
                ? "w-6 sm:w-7 h-2 sm:h-2.5 bg-brand-purple"
                : "w-2 sm:w-2.5 h-2 sm:h-2.5 bg-brand-purple/30 hover:bg-brand-purple/60"
            )}
          />
        ))}
      </div>
    </div>
  );
}
