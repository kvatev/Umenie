"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Play, Pause, Sparkles, Users, Home, Puzzle } from "lucide-react";

interface ClubTourVideoProps {
  src: string;
  poster: string;
}

const HIGHLIGHTS = [
  { icon: Home, text: "Светли и уютни зали, близки до домашната среда" },
  { icon: Users, text: "Малки групи и внимание към всяко дете" },
  { icon: Puzzle, text: "Кътове за учене, шах, игри и творчество" },
];

/**
 * "Как изглежда нашият клуб" – vertical tour video shown on both
 * mobile and desktop. The video is lazy-loaded when it approaches the
 * viewport, autoplays muted in a loop while visible and pauses when
 * scrolled away. Visitors can tap to pause/resume playback.
 */
export function ClubTourVideo({ src, poster }: ClubTourVideoProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isNear, setIsNear] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isPaused, setIsPaused] = useState(false); // user-initiated pause

  // 1. Lazy-load: attach the source only when the block gets close
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
      ([entry]) => setIsVisible(entry.isIntersecting),
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
      className="relative py-14 sm:py-20 lg:py-24 overflow-hidden bg-gradient-to-b from-brand-bg via-[#e9e7fa] to-brand-bg"
    >
      {/* Soft ambient glows */}
      <div className="pointer-events-none absolute -top-24 -left-24 w-72 h-72 rounded-full bg-brand-purple/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 -right-20 w-80 h-80 rounded-full bg-brand-yellow/20 blur-3xl" />

      <Container size="xl" className="relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* Text column */}
          <div className="lg:col-span-6 lg:order-1 order-1 text-center lg:text-left space-y-5 sm:space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/80 backdrop-blur px-4 py-1.5 text-xs sm:text-sm font-semibold tracking-wide text-brand-purple shadow-sm border border-brand-purple/15">
              <Sparkles className="w-4 h-4" />
              Разходка из клуба
            </span>

            <h2
              id="club-tour-heading"
              className="font-heading font-bold text-2xl sm:text-4xl text-brand-purple leading-tight tracking-wide uppercase"
            >
              Как изглежда
              <br className="hidden sm:block" /> нашият клуб
            </h2>

            <p className="text-brand-dark/90 text-base sm:text-lg leading-relaxed max-w-xl mx-auto lg:mx-0">
              Надникнете вътре и вижте мястото, където децата учат, играят и
              творят всеки ден – подредено, светло и създадено с мисъл за тях.
            </p>

            <ul className="hidden lg:flex flex-col gap-3 pt-1">
              {HIGHLIGHTS.map(({ icon: Icon, text }) => (
                <li
                  key={text}
                  className="flex items-center gap-3 rounded-2xl bg-white/70 backdrop-blur-sm px-4 py-3 border border-brand-purple/10 shadow-sm transition-all duration-300 hover:translate-x-1 hover:shadow-card"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-purple/10 text-brand-purple">
                    <Icon className="w-5 h-5" />
                  </span>
                  <span className="text-brand-dark/90 font-medium">{text}</span>
                </li>
              ))}
            </ul>

            <div className="hidden lg:flex pt-2">
              <Link
                href="/za-nas"
                className="inline-flex items-center justify-center px-10 py-4 rounded-full bg-brand-purple text-white font-heading font-bold text-sm sm:text-base tracking-wider uppercase shadow-button hover:bg-brand-purple-hover hover:shadow-button-hover transition-all active:scale-95"
              >
                ЗА НАС
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
                className="pointer-events-none absolute -bottom-8 -right-12 w-20 h-20 sm:w-24 sm:h-24 opacity-35"
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
                  loop
                  muted
                  playsInline
                  preload="none"
                  disablePictureInPicture
                  onClick={togglePlay}
                  className="absolute inset-0 w-full h-full object-cover cursor-pointer"
                  aria-label="Видео: как изглежда образователен клуб УМеНИе отвътре"
                />

                {/* Bottom gradient for control legibility */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/55 to-transparent" />

                {/* Big play overlay when paused by user */}
                {isPaused && (
                  <button
                    type="button"
                    onClick={togglePlay}
                    aria-label="Пусни видеото"
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
                    Клуб „УМеНИе“
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      id="club-tour-play-toggle"
                      onClick={togglePlay}
                      aria-label={isPaused ? "Пусни видеото" : "Спри видеото"}
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
          <div className="lg:hidden order-3 flex justify-center">
            <Link
              href="/za-nas"
              className="inline-flex items-center justify-center px-10 py-4 rounded-full bg-brand-purple text-white font-heading font-bold text-sm tracking-wider uppercase shadow-button hover:bg-brand-purple-hover transition-all active:scale-95"
            >
              ЗА НАС
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
