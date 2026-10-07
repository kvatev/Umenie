"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ServiceData } from "@/lib/services-data";

interface ServiceCardProps {
  service: ServiceData;
  variant?: "home" | "interactive";
}

export function ServiceCard({ service, variant = "home" }: ServiceCardProps) {
  const router = useRouter();
  const [isRevealed, setIsRevealed] = useState(false);

  if (variant === "home") {
    return (
      <Link
        href={`/uslugi/${service.slug}`}
        className="group bg-white rounded-2xl sm:rounded-3xl p-2.5 sm:p-3.5 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between items-center text-center w-full h-full border border-brand-purple/10 transform hover:-translate-y-1 focus:outline-none"
      >
        {/* Image wrapper */}
        <div className="relative w-full aspect-square rounded-xl sm:rounded-2xl overflow-hidden mb-2 sm:mb-3 shadow-inner bg-slate-50">
          <Image
            src={service.cardImage}
            alt={service.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>

        {/* Purple Pill Button */}
        <div className="w-full mt-auto">
          <span className="w-full bg-[#887ed8] group-hover:bg-[#776dc7] text-white rounded-xl sm:rounded-2xl py-2 sm:py-2.5 px-1.5 sm:px-3 flex items-center justify-center min-h-[44px] shadow-sm font-heading font-bold text-xs sm:text-sm uppercase tracking-wide leading-tight text-center transition-colors">
            {service.title}
          </span>
        </div>
      </Link>
    );
  }

  // Interactive variant for /uslugi (Full photo with centered yellow title in State 1, translucent dark reveal in State 2)
  const handleCardClick = (e: React.MouseEvent) => {
    // If on a touch-only screen and not yet revealed, reveal it first
    if (typeof window !== "undefined" && window.matchMedia("(hover: none)").matches && !isRevealed) {
      e.preventDefault();
      setIsRevealed(true);
      return;
    }
    // Otherwise (desktop hover or second tap), navigate to the service page
    router.push(`/uslugi/${service.slug}`);
  };

  return (
    <div
      onClick={handleCardClick}
      onMouseEnter={() => setIsRevealed(true)}
      onMouseLeave={() => setIsRevealed(false)}
      className="group relative aspect-[4/5] sm:aspect-square w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer select-none bg-slate-900 border border-brand-purple/15 hover:border-brand-purple/40"
    >
      {/* Background Activity Photograph */}
      <Image
        src={service.cardImage}
        alt={service.title}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw"
      />

      {/* STATE 1: Default Display (Crisp Photo + Dark Vignette + Centered Yellow Title & Arrow) */}
      <div
        className={`absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-black/30 flex flex-col items-center justify-center p-3 sm:p-5 text-center transition-opacity duration-300 ${
          isRevealed ? "opacity-0 pointer-events-none" : "opacity-100 group-hover:opacity-0"
        }`}
      >
        <div className="flex flex-col items-center justify-center space-y-1 sm:space-y-2">
          {service.titleLines && service.titleLines.length > 0 ? (
            service.titleLines.map((line, idx) => (
              <span
                key={idx}
                className="font-heading font-extrabold text-base sm:text-xl md:text-2xl lg:text-3xl text-amber-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] tracking-wide uppercase leading-tight"
              >
                {line}
              </span>
            ))
          ) : (
            <span className="font-heading font-extrabold text-base sm:text-xl md:text-2xl lg:text-3xl text-amber-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] tracking-wide uppercase leading-tight">
              {service.title}
            </span>
          )}

          {/* Yellow Doodle Arrow */}
          <span className="text-amber-300 text-2xl sm:text-3xl lg:text-4xl leading-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] pt-1 transform group-hover:translate-x-1 transition-transform">
            →
          </span>
        </div>
      </div>

      {/* STATE 2: Translucent Dark Backdrop Reveal (Hover on desktop / Tap on mobile) */}
      <div
        className={`absolute inset-0 bg-[#2b2d42]/90 backdrop-blur-sm p-3.5 sm:p-5 md:p-6 flex flex-col justify-between text-left transition-all duration-300 ${
          isRevealed ? "opacity-100 pointer-events-auto" : "opacity-0 group-hover:opacity-100"
        }`}
      >
        {/* Top Header: Title & Arrow */}
        <div className="flex items-start justify-between gap-1 border-b border-white/10 pb-2">
          <h3 className="font-heading font-bold text-xs sm:text-sm md:text-base text-amber-400 uppercase leading-snug line-clamp-2">
            {service.title}
          </h3>
          <span className="text-amber-400 text-sm sm:text-base shrink-0 font-bold ml-1">→</span>
        </div>

        {/* Middle Area: Short Description */}
        <p className="text-[11px] sm:text-xs md:text-sm text-white/95 leading-relaxed font-sans line-clamp-4 sm:line-clamp-5 my-auto">
          {service.shortDescription}
        </p>

        {/* Bottom Pinned Button */}
        <div className="mt-auto pt-2 w-full">
          <Link
            href={`/uslugi/${service.slug}`}
            onClick={(e) => e.stopPropagation()}
            className="w-full bg-[#887ed8] hover:bg-[#776dc7] text-white rounded-xl sm:rounded-2xl py-2 px-2.5 sm:px-3 flex items-center justify-between text-[11px] sm:text-xs md:text-sm font-bold tracking-wider uppercase transition-all shadow-md active:scale-95"
          >
            <span className="truncate">НАУЧЕТЕ ПОВЕЧЕ</span>
            <span className="shrink-0 ml-1 text-sm sm:text-base">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
