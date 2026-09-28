"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ServiceData } from "@/lib/services-data";
import { cn } from "@/lib/utils";

interface ServiceCardProps {
  service: ServiceData;
  variant?: "home" | "interactive";
}

export function ServiceCard({ service, variant = "home" }: ServiceCardProps) {
  const [isTapped, setIsTapped] = useState(false);

  if (variant === "home") {
    return (
      <Link
        href={`/uslugi/${service.slug}`}
        className="group flex flex-col items-center text-center space-y-3 focus:outline-none"
      >
        <div className="relative w-full aspect-square rounded-3xl overflow-hidden shadow-card group-hover:shadow-card-hover transition-all duration-300 border-2 border-white transform group-hover:-translate-y-1 bg-white">
          <Image
            src={service.cardImage}
            alt={service.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>

        {/* Purple Pill Button with Title */}
        <div className="w-full pt-0.5">
          <span className="inline-flex items-center justify-center w-full min-h-[38px] sm:min-h-[44px] py-1.5 sm:py-2.5 px-2 sm:px-4 rounded-full bg-brand-purple text-white font-heading font-bold text-[11px] xs:text-xs sm:text-sm tracking-wide sm:tracking-wider uppercase shadow-button group-hover:bg-brand-purple-hover group-hover:shadow-button-hover transition-all active:scale-[0.97] text-center leading-tight">
            {service.title}
          </span>
        </div>
      </Link>
    );
  }

  // Interactive variant for /uslugi
  return (
    <div
      onClick={() => setIsTapped((prev) => !prev)}
      className="group relative aspect-square rounded-3xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 border-2 border-white cursor-pointer select-none bg-white"
    >
      {/* Background Image */}
      <Image
        src={service.cardImage}
        alt={service.title}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      />

      {/* Default Overlay with Yellow Title + Arrow */}
      <div
        className={cn(
          "absolute inset-0 bg-black/45 flex flex-col items-center justify-center p-6 text-center transition-opacity duration-300",
          isTapped ? "opacity-0 pointer-events-none" : "group-hover:opacity-0"
        )}
      >
        <h3 className="font-heading font-bold text-2xl sm:text-3xl text-brand-yellow drop-shadow-md tracking-wider">
          {service.title}
        </h3>
        <div className="text-brand-yellow text-3xl sm:text-4xl mt-1 font-bold animate-pulse">
          →
        </div>
      </div>

      {/* Hover / Tapped Overlay with Full Short Description & Link */}
      <div
        className={cn(
          "absolute inset-0 bg-brand-dark/85 backdrop-blur-sm p-6 flex flex-col justify-between text-left transition-all duration-300 opacity-0 pointer-events-none",
          isTapped ? "opacity-100 pointer-events-auto" : "group-hover:opacity-100 group-hover:pointer-events-auto"
        )}
      >
        <div>
          <div className="flex items-center justify-between pb-2 border-b border-brand-purple/30 mb-3">
            <h4 className="font-heading font-bold text-lg sm:text-xl text-brand-yellow">
              {service.title}
            </h4>
            <span className="text-brand-yellow font-bold text-xl">→</span>
          </div>

          <p className="text-xs sm:text-sm text-white/95 leading-relaxed font-medium">
            {service.shortDescription}
          </p>
        </div>

        <div className="pt-3">
          <Link
            href={`/uslugi/${service.slug}`}
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-2 py-2 px-5 rounded-full bg-brand-purple text-white font-heading font-bold text-xs shadow-button hover:bg-brand-purple-hover transition-all active:scale-[0.98]"
          >
            <span>НАУЧЕТЕ ПОВЕЧЕ</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
