"use client";

import React from "react";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/utils";
import { SITE_CONFIG } from "@/lib/constants";
import { useLanguage } from "@/lib/i18n";
import type { SiteSettings } from "@/lib/types/site-settings";

interface QuickContactBannerProps {
  className?: string;
  settings?: SiteSettings;
}

export function QuickContactBanner({ className, settings }: QuickContactBannerProps) {
  const { dict } = useLanguage();

  const phoneDisplay = settings?.phoneDisplay || SITE_CONFIG.phoneDisplay;
  const phoneRaw = settings?.phoneRaw || SITE_CONFIG.phoneRaw;
  const googleMapsUrl = settings?.googleMapsUrl || SITE_CONFIG.googleMapsUrl;

  return (
    <section
      className={cn(
        "relative w-full bg-[#ddd9f5] py-6 sm:py-8 md:py-10 border-y border-brand-purple/20 shadow-xs",
        className
      )}
    >
      <Container size="xl">
        <div className="grid grid-cols-2 gap-2 sm:gap-8 md:gap-12 items-center justify-between max-w-4xl lg:max-w-5xl mx-auto">
          {/* Left: Phone */}
          <a
            href={`tel:${phoneRaw}`}
            className="flex items-center gap-2 min-[380px]:gap-3 sm:gap-4 md:gap-5 p-1.5 sm:p-3 md:p-4 rounded-2xl hover:bg-white/40 transition-all cursor-pointer group active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-purple/50 min-w-0"
            aria-label={dict.common.quickContact.phoneAria}
          >
            <div className="relative w-9 h-9 min-[380px]:w-11 min-[380px]:h-11 sm:w-16 sm:h-16 md:w-20 md:h-20 shrink-0 transform group-hover:scale-105 transition-transform">
              <Image
                src="/images/phone.webp"
                alt={dict.common.phoneLabel}
                fill
                sizes="(max-width: 640px) 44px, (max-width: 768px) 64px, 80px"
                className="object-contain"
              />
            </div>
            <div className="text-left min-w-0">
              <p className="text-[11px] min-[380px]:text-xs sm:text-sm md:text-base font-heading font-bold text-brand-dark/80 tracking-wide uppercase leading-tight truncate">
                {dict.common.quickContact.questionsTitle}
              </p>
              <p className="font-heading font-bold text-xs min-[380px]:text-sm sm:text-2xl md:text-3xl text-brand-purple tracking-tight sm:tracking-normal mt-0.5 whitespace-nowrap">
                {phoneDisplay.replace(/\s+/g, "")}
              </p>
            </div>
          </a>

          {/* Right: Location */}
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 min-[380px]:gap-3 sm:gap-4 md:gap-5 p-1.5 sm:p-3 md:p-4 rounded-2xl hover:bg-white/40 transition-all cursor-pointer group active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-purple/50 min-w-0"
            aria-label={dict.common.quickContact.locationAria}
          >
            <div className="relative w-9 h-9 min-[380px]:w-11 min-[380px]:h-11 sm:w-16 sm:h-16 md:w-20 md:h-20 shrink-0 transform group-hover:scale-105 transition-transform">
              <Image
                src="/images/location.webp"
                alt={dict.common.locationLabel}
                fill
                sizes="(max-width: 640px) 44px, (max-width: 768px) 64px, 80px"
                className="object-contain"
              />
            </div>
            <div className="text-left min-w-0">
              <p className="text-[11px] min-[380px]:text-xs sm:text-sm md:text-base font-heading font-bold text-brand-dark/80 tracking-wide uppercase leading-tight truncate">
                {dict.common.quickContact.whereTitle}
              </p>
              <p className="font-heading font-bold text-[11px] min-[380px]:text-xs sm:text-base md:text-xl text-brand-purple uppercase leading-tight mt-0.5 break-words">
                {dict.common.quickContact.city}
              </p>
              <p className="font-heading font-bold text-[10px] min-[380px]:text-[11px] sm:text-sm md:text-base text-brand-purple/90 uppercase leading-tight">
                {dict.common.quickContact.building}
              </p>
            </div>
          </a>
        </div>
      </Container>
    </section>
  );
}
