"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Play, Pause, Users, Home, Puzzle } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

interface ClubTourVideoProps {
  src: string;
  poster: string;
}

const HIGHLIGHT_ICONS = [Users, Home, Puzzle];

export function ClubTourVideo({ src, poster }: ClubTourVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isNear, setIsNear] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const { dict } = useLanguage();

  // 1. Dual-threshold observer: lazy load nearby (400px), autoplay strictly in viewport (35%)
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    const nearObs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsNear(true);
          nearObs.disconnect();
        }
      },
      { rootMargin: "400px 0px" }
    );

    const visObs = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.35 }
    );

    nearObs.observe(el);
    visObs.observe(el);
    return () => {
      nearObs.disconnect();
      visObs.disconnect();
    };
  }, []);

  // 2. Autoplay while visible, pause when scrolled away
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isNear) return;
    if (isVisible && !isPaused) {
      video.muted = true;
      const p = video.play();
      if (p) p.catch(() => {});
    } else {
      video.pause();
    }
  }, [isVisible, isNear, isPaused]);

  const togglePlay = () => setIsPaused((p) => !p);

  return (
    <section
      id="club-tour"
      aria-labelledby="club-tour-heading"
      className="relative pt-12 sm:pt-16 lg:pt-20 pb-12 sm:pb-16 lg:pb-20 overflow-hidden bg-gradient-to-b from-brand-bg via-[#eceafc] to-[#e4e1f7]"
    >
      {/* Soft ambient glows */}
      <div className="pointer-events-none absolute -top-24 -left-24 w-72 h-72 rounded-full bg-brand-purple/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 -right-20 w-80 h-80 rounded-full bg-brand-yellow/20 blur-3xl" />

      <Container size="xl" className="relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* Text column - left aligned on mobile and desktop */}
          <div className="lg:col-span-6 lg:order-1 order-1 text-left space-y-5 sm:space-y-6">
            <h2
              id="club-tour-heading"
              className="font-heading font-bold text-2xl sm:text-4xl text-brand-purple leading-tight tracking-wide uppercase text-left"
            >
              {dict.home.clubTour.titleLine1}
              <br className="hidden sm:block" /> {dict.home.clubTour.titleLine2}
            </h2>

            <p className="text-brand-dark/90 text-base sm:text-lg leading-relaxed max-w-xl text-left">
              {dict.home.clubTour.description}
            </p>

            <ul className="hidden lg:flex flex-col gap-3 pt-1">
              {dict.home.clubTour.highlights.map((text, idx) => {
                const Icon = HIGHLIGHT_ICONS[idx % HIGHLIGHT_ICONS.length];
                return (
                  <li
                    key={text}
                    className="flex items-center gap-3 rounded-2xl bg-white/70 backdrop-blur-sm px-4 py-3 border border-brand-purple/10 shadow-sm transition-all duration-300 hover:translate-x-1 hover:shadow-card"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-purple/10 text-brand-purple">
                      <Icon className="w-5 h-5" />
                    </span>
                    <span className="text-brand-dark/90 font-medium">{text}</span>
                  </li>
                );
              })}
            </ul>

            <div className="hidden lg:flex pt-2">
              <Link
                href="/za-nas"
                className="inline-flex items-center justify-center px-10 py-4 rounded-full bg-brand-purple text-white font-heading font-bold text-sm sm:text-base tracking-wider uppercase shadow-button hover:bg-brand-purple-hover hover:shadow-button-hover transition-all active:scale-95"
              >
                {dict.home.clubTour.button}
              </Link>
            </div>
          </div>

          {/* Video column */}
          <div className="lg:col-span-6 lg:order-2 order-2 flex justify-center">
            <div ref={wrapperRef} className="relative w-[78vw] max-w-[340px] sm:max-w-[360px]">
              {/* Decorative bulbs */}
              <div
                className="pointer-events-none absolute -top-10 -left-12 w-20 h-20 sm:w-24 sm:h-24 opacity-40"
                style={{ transform: "rotate(-18deg)" }}
              >
                <Image src="/images/bulb.webp" alt="" fill className="object-contain" />
              </div>
              <div
                className="pointer-events-none absolute -bottom-6 -right-6 sm:-bottom-8 sm:-right-10 w-20 h-20 sm:w-24 sm:h-24 opacity-35"
                style={{ transform: "rotate(22deg)" }}
              >
                <Image src="/images/bulb.webp" alt="" fill className="object-contain" />
              </div>

              {/* Glow behind the frame */}
              <div className="absolute -inset-3 rounded-[2.5rem] bg-gradient-to-br from-brand-purple/40 via-brand-purple/10 to-brand-yellow/30 blur-2xl" />

              {/* Video frame */}
              <div className="group relative aspect-[9/16] w-full overflow-hidden rounded-[2rem] border-4 border-white bg-brand-dark shadow-[0_25px_60px_-15px_rgba(42,43,61,0.45)]">
                <video
                  ref={videoRef}
                  src={isNear ? src : undefined}
                  poster={poster}
                  loop={true}
                  muted={true}
                  playsInline={true}
                  preload="none"
                  disablePictureInPicture
                  onClick={togglePlay}
                  onEnded={(e) => {
                    e.currentTarget.currentTime = 0;
                    e.currentTarget.play().catch(() => {});
                  }}
                  className="absolute inset-0 w-full h-full object-cover cursor-pointer"
                  aria-label={dict.home.clubTour.videoAria}
                />

                {/* Bottom gradient for control legibility */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/55 to-transparent" />

                {/* Big play overlay when paused by user */}
                {isPaused && (
                  <button
                    type="button"
                    onClick={togglePlay}
                    aria-label={dict.home.clubTour.playAria}
                    className="absolute inset-0 flex items-center justify-center bg-black/25 transition-colors"
                  >
                    <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 text-brand-purple shadow-xl transition-transform hover:scale-110">
                      <Play className="w-7 h-7 ml-1 fill-current" />
                    </span>
                  </button>
                )}

                {/* Controls */}
                <div className="absolute bottom-4 inset-x-4 flex items-center justify-between">
                  <span className="rounded-full bg-black/35 backdrop-blur-md px-3 py-1 text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-white/95">
                    {dict.home.clubTour.videoBadge}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      id="club-tour-play-toggle"
                      onClick={togglePlay}
                      aria-label={isPaused ? dict.home.clubTour.playAria : dict.home.clubTour.pauseAria}
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-md text-white border border-white/30 transition-all hover:bg-white/35 active:scale-90"
                    >
                      {isPaused ? <Play className="w-4 h-4 fill-current" /> : <Pause className="w-4 h-4 fill-current" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile CTA under the video */}
          <div className="lg:hidden order-3 flex justify-start sm:justify-center">
            <Link
              href="/za-nas"
              className="inline-flex items-center justify-center px-10 py-4 rounded-full bg-brand-purple text-white font-heading font-bold text-sm tracking-wider uppercase shadow-button hover:bg-brand-purple-hover transition-all active:scale-95"
            >
              {dict.home.clubTour.button}
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
