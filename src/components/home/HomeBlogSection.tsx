"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { Container } from "@/components/ui/Container";
import { BlogCard } from "@/components/blog/BlogCard";
import { BlogPost } from "@/lib/types/blog";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n";

interface HomeBlogSectionProps {
  posts: BlogPost[];
}

export function HomeBlogSection({ posts }: HomeBlogSectionProps) {
  const { dict, locale } = useLanguage();

  // Localize posts if English dictionary has translation for the slug
  const localizedPosts = useMemo(() => {
    if (!posts) return [];
    return posts.map((post) => {
      const trans = (dict.blogPosts as any)?.[post.slug];
      if (locale === "en" && trans) {
        return {
          ...post,
          title: trans.title || post.title,
          excerpt: trans.excerpt || post.excerpt,
          category: trans.category || post.category,
          readTime: trans.readTime || post.readTime,
        };
      }
      return post;
    });
  }, [posts, dict, locale]);

  // Display latest articles (up to 6)
  const displayPosts = useMemo(() => {
    return localizedPosts.slice(0, 6);
  }, [localizedPosts]);

  // To guarantee truly seamless infinite looping across 3-column desktop and mobile views,
  // ensure at least 12 slides in the Embla track by repeating the articles cyclically
  const loopMultiplier = useMemo(() => {
    if (displayPosts.length === 0) return 1;
    return Math.max(3, Math.ceil(12 / displayPosts.length));
  }, [displayPosts.length]);

  const loopedPosts = useMemo(() => {
    const list: { post: BlogPost; uniqueKey: string; originalIndex: number }[] = [];
    for (let r = 0; r < loopMultiplier; r++) {
      displayPosts.forEach((post, i) => {
        list.push({
          post,
          uniqueKey: `${post.id}-loop-${r}-${i}`,
          originalIndex: i,
        });
      });
    }
    return list;
  }, [displayPosts, loopMultiplier]);

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: "start",
      skipSnaps: false,
      duration: 28,
    },
    [
      Autoplay({
        delay: 5000,
        stopOnInteraction: false,
        stopOnMouseEnter: true,
      }),
    ]
  );

  const [activeIndex, setActiveIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi || displayPosts.length === 0) return;
    const currentSnap = emblaApi.selectedScrollSnap();
    const realIdx = ((currentSnap % displayPosts.length) + displayPosts.length) % displayPosts.length;
    setActiveIndex(realIdx);
  }, [emblaApi, displayPosts.length]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const scrollToDot = useCallback(
    (targetIdx: number) => {
      if (!emblaApi || displayPosts.length === 0) return;
      const currentSnap = emblaApi.selectedScrollSnap();
      const currentReal = ((currentSnap % displayPosts.length) + displayPosts.length) % displayPosts.length;
      let diff = targetIdx - currentReal;
      const half = displayPosts.length / 2;
      if (diff > half) diff -= displayPosts.length;
      if (diff < -half) diff += displayPosts.length;
      emblaApi.scrollTo(currentSnap + diff);
    },
    [emblaApi, displayPosts.length]
  );

  if (!displayPosts || displayPosts.length === 0) {
    return null;
  }

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
              {dict.home.blog.badge}
            </span>
            <h2 className="font-heading font-extrabold text-2xl sm:text-4xl lg:text-5xl text-brand-purple tracking-wide uppercase text-left">
              {dict.home.blog.heading}
            </h2>
            <p className="text-brand-dark/80 text-sm sm:text-base md:text-lg max-w-xl text-left">
              {dict.home.blog.subtitle}
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-end">
            {/* Left & Right Arrow Buttons (Infinitely scrollable) */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={scrollPrev}
                aria-label={dict.home.blog.prevAria}
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white text-brand-purple border border-brand-purple/20 hover:bg-brand-purple hover:text-white shadow-sm flex items-center justify-center transition-all cursor-pointer active:scale-95"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={scrollNext}
                aria-label={dict.home.blog.nextAria}
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white text-brand-purple border border-brand-purple/20 hover:bg-brand-purple hover:text-white shadow-sm flex items-center justify-center transition-all cursor-pointer active:scale-95"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            <Link
              href="/blog"
              className="inline-flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 rounded-full bg-white text-brand-purple border border-brand-purple/20 hover:bg-brand-purple hover:text-white transition-all transform hover:scale-[1.02] active:scale-95 shadow-sm font-heading font-bold text-xs sm:text-sm uppercase tracking-wide group"
            >
              <span>{dict.home.blog.allArticles}</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        {/* Embla Viewport */}
        <div
          ref={emblaRef}
          className="overflow-hidden w-full cursor-grab active:cursor-grabbing pb-4 pt-1 select-none"
        >
          {/* Embla Container */}
          <div className="flex -ml-4 sm:-ml-6 items-stretch touch-pan-y">
            {loopedPosts.map(({ post, uniqueKey }) => (
              <div
                key={uniqueKey}
                className="flex-[0_0_86%] xs:flex-[0_0_82%] sm:flex-[0_0_48%] lg:flex-[0_0_33.333333%] min-w-0 pl-4 sm:pl-6 flex flex-col h-auto"
              >
                <BlogCard post={post} />
              </div>
            ))}
          </div>
        </div>

        {/* Pagination Dots (Cyclic matching original articles) */}
        {displayPosts.length > 1 && (
          <div className="flex justify-center items-center gap-2 mt-6 pt-2">
            {displayPosts.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => scrollToDot(idx)}
                className={cn(
                  "h-2.5 rounded-full transition-all duration-300 cursor-pointer",
                  activeIndex === idx
                    ? "w-8 bg-brand-purple"
                    : "w-2.5 bg-brand-purple/25 hover:bg-brand-purple/50"
                )}
                aria-label={`Article ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
