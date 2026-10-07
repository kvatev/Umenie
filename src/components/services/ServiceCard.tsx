"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ServiceData } from "@/lib/services-data";

interface ServiceCardProps {
  service: ServiceData;
  variant?: "home" | "interactive";
}

export function ServiceCard({ service, variant = "home" }: ServiceCardProps) {
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

  // Interactive variant for /uslugi (Solid dark card with equal height & bottom-pinned button)
  return (
    <div className="bg-[#2b2d42] text-white rounded-2xl sm:rounded-3xl p-3 sm:p-4 md:p-5 flex flex-col justify-between h-full shadow-sm border border-slate-700/40 hover:border-brand-purple/50 transition-colors">
      <div className="flex flex-col h-full justify-between">
        {/* Top Area: Title & Header Arrow */}
        <div className="flex items-start justify-between gap-1 mb-2">
          <h3 className="font-heading font-bold text-xs sm:text-sm md:text-base text-amber-400 uppercase leading-snug line-clamp-2 min-h-[2rem] sm:min-h-[2.5rem]">
            {service.title}
          </h3>
          <span className="text-amber-400 text-xs sm:text-sm shrink-0">→</span>
        </div>

        {/* Middle Area: Description */}
        <p className="text-[11px] sm:text-xs md:text-sm text-slate-300 line-clamp-3 sm:line-clamp-4 mb-3 sm:mb-4 flex-1">
          {service.shortDescription}
        </p>

        {/* Bottom Area: Pinned Button (NEVER CUT OFF) */}
        <div className="mt-auto pt-1 w-full">
          <Link
            href={`/uslugi/${service.slug}`}
            className="w-full bg-[#887ed8] hover:bg-[#776dc7] text-white rounded-xl sm:rounded-2xl py-2 px-2.5 sm:px-3 flex items-center justify-between text-[11px] sm:text-xs md:text-sm font-bold tracking-wide uppercase transition-all shadow-sm active:scale-95"
          >
            <span className="truncate">НАУЧЕТЕ ПОВЕЧЕ</span>
            <span className="shrink-0 ml-1">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
