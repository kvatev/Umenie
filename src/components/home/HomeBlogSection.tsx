"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { BlogCard } from "@/components/blog/BlogCard";
import { BlogPost } from "@/lib/types/blog";
import { cn } from "@/lib/utils";

interface HomeBlogSectionProps {
  posts: BlogPost[];
}

export function HomeBlogSection({ posts }: HomeBlogSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  if (!posts || posts.length === 0) {
    return null;
  }

  // Display latest articles (up to 6)
  const displayPosts = posts.slice(0, 6);

  // Update active dot and arrow states on scroll
  const handleScroll = useCallback(() => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;

    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);

    const firstCard = scrollRef.current.firstElementChild as HTMLElement | null;
    if (firstCard) {
      const cardWidth = firstCard.offsetWidth + 16; // width + gap
      const newIndex = Math.round(scrollLeft / cardWidth);
      setActiveIndex(Math.min(Math.max(0, newIndex), displayPosts.length - 1));
    }
  }, [displayPosts.length]);

  useEffect(() => {
    handleScroll();
    window.addEventListener("resize", handleScroll);
    return () => window.removeEventListener("resize", handleScroll);
  }, [handleScroll]);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const firstCard = scrollRef.current.firstElementChild as HTMLElement | null;
    const step = firstCard ? firstCard.offsetWidth + 16 : 320;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -step : step,
      behavior: "smooth",
    });
  };

  const scrollToCard = (index: number) => {
    if (!scrollRef.current) return;
    const firstCard = scrollRef.current.firstElementChild as HTMLElement | null;
    const step = firstCard ? firstCard.offsetWidth + 16 : 320;
    scrollRef.current.scrollTo({
      left: index * step,
      behavior: "smooth",
    });
  };

  return (
    <section className="py-14 sm:py-20 md:py-24 relative overflow-hidden bg-brand-bg">
      {/* Decorative ambient lightbulbs */}
      <div
        className="absolute pointer-events-none select-none -top-4 -left-6 sm:left-6 w-24 h-24 opacity-25"
        style={{ transform: "rotate(-18deg)" }}
      >
        <Image src="/images/bulb.webp" alt="" fill className="object-contain" />
      </div>

      <div
        className="absolute pointer-events-none select-none hidden sm:block bottom-6 -right-6 sm:right-6 w-28 h-28 opacity-25"
        style={{ transform: "rotate(22deg)" }}
      >
        <Image src="/images/bulb.webp" alt="" fill className="object-contain" />
      </div>

      <Container size="xl" className="relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 gap-4">
          <div className="space-y-2 text-left">
            <span className="inline-block px-3.5 py-1 rounded-full bg-brand-purple/10 text-brand-purple font-heading font-bold text-xs uppercase tracking-wider">
              ПОЛЕЗНО ЗА РОДИТЕЛИ И ДЕЦА
            </span>
            <h2 className="font-heading font-extrabold text-2xl sm:text-4xl lg:text-5xl text-brand-purple tracking-wide uppercase text-left">
              ОТ НАШИЯ БЛОГ
            </h2>
            <p className="text-brand-dark/80 text-sm sm:text-base md:text-lg max-w-xl text-left">
              Практични съвети, идеи за развитие и вдъхновение от екипа на клуб „УМеНИе“.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-end">
            {/* Left & Right Arrow Buttons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => scroll("left")}
                disabled={!canScrollLeft}
                aria-label="Предишна статия"
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white text-brand-purple border border-brand-purple/20 hover:bg-brand-purple hover:text-white shadow-sm flex items-center justify-center transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-brand-purple"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => scroll("right")}
                disabled={!canScrollRight}
                aria-label="Следваща статия"
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white text-brand-purple border border-brand-purple/20 hover:bg-brand-purple hover:text-white shadow-sm flex items-center justify-center transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-brand-purple"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            <Link
              href="/blog"
              className="inline-flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 rounded-full bg-white text-brand-purple border border-brand-purple/20 hover:bg-brand-purple hover:text-white transition-all transform hover:scale-[1.02] active:scale-95 shadow-sm font-heading font-bold text-xs sm:text-sm uppercase tracking-wide group"
            >
              <span>ВСИЧКИ СТАТИИ</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        {/* Horizontal Carousel (Mobile swipeable & desktop scrollable with Left/Right arrows) */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
          className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar gap-4 sm:gap-6 pb-4 pt-1 -mx-4 px-4 sm:mx-0 sm:px-0"
        >
          {displayPosts.map((post) => (
            <div
              key={post.id}
              className="w-[85%] sm:w-[46%] lg:w-[calc(33.333%-1.05rem)] shrink-0 snap-start flex flex-col h-auto"
            >
              <BlogCard post={post} />
            </div>
          ))}
        </div>

        {/* Pagination Dots */}
        {displayPosts.length > 1 && (
          <div className="flex justify-center items-center gap-2 mt-6 pt-2">
            {displayPosts.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => scrollToCard(idx)}
                className={cn(
                  "h-2.5 rounded-full transition-all duration-300 cursor-pointer",
                  activeIndex === idx
                    ? "w-8 bg-brand-purple"
                    : "w-2.5 bg-brand-purple/25 hover:bg-brand-purple/50"
                )}
                aria-label={`Към статия ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
