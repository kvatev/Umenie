"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";

interface HeroMobileVideoProps {
  src: string;
  poster: string;
}

/**
 * Mobile-only hero background video (hidden from `md` breakpoint up).
 * - The <video> element is mounted only on small screens, so desktop
 *   visitors never download the file.
 * - Muted, inline, endless loop (required for autoplay on iOS/Android).
 * - Explicit fallback loop event handler ensures it never stops on mobile Safari/Chrome.
 */
export function HeroMobileVideo({ src, poster }: HeroMobileVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [shouldMount, setShouldMount] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setShouldMount(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!shouldMount || !video) return;
    // iOS Safari requires the muted property to be set before play()
    video.muted = true;
    video.defaultMuted = true;
    const p = video.play();
    if (p) p.catch(() => {});
  }, [shouldMount]);

  return (
    <div className="absolute inset-0 md:hidden" aria-hidden="true">
      {/* Poster frame: instant paint before the video starts */}
      <Image
        src={poster}
        alt=""
        fill
        priority
        fetchPriority="high"
        sizes="100vw"
        className="object-cover object-center"
      />

      {shouldMount && (
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          autoPlay
          loop={true}
          muted={true}
          playsInline={true}
          preload="auto"
          disablePictureInPicture
          onPlaying={() => setIsPlaying(true)}
          onEnded={(e) => {
            e.currentTarget.currentTime = 0;
            e.currentTarget.play().catch(() => {});
          }}
          className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-700 ${
            isPlaying ? "opacity-100" : "opacity-0"
          }`}
        />
      )}

      {/* Subtle dark filter to keep white hero typography crisp and legible */}
      <div className="absolute inset-0 bg-black/35" />
    </div>
  );
}
