import React from "react";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/utils";
import { getSiteSettings } from "@/lib/site-settings";

interface QuickContactBannerProps {
  className?: string;
}

export async function QuickContactBanner({ className }: QuickContactBannerProps) {
  const settings = await getSiteSettings();

  return (
    <section className={cn("relative w-full bg-[#f1f2f6] overflow-hidden pt-4 pb-8 sm:py-12", className)}>
      {/* Top Wave Graphic */}
      <div className="w-full overflow-hidden leading-none pointer-events-none select-none">
        <svg
          viewBox="0 0 1440 90"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-8 sm:h-12 md:h-16 block text-[#ddd9f5] preserve-3d"
          preserveAspectRatio="none"
        >
          <path
            d="M0,45 C320,85 480,10 720,50 C960,90 1120,15 1440,55 L1440,90 L0,90 Z"
            fill="currentColor"
          />
        </svg>
      </div>

      {/* Main Banner Content with Lavender Background */}
      <div className="w-full bg-[#ddd9f5] py-5 sm:py-7 md:py-9">
        <Container size="xl">
          <div className="grid grid-cols-2 gap-2 sm:gap-8 md:gap-12 items-center justify-between max-w-4xl lg:max-w-5xl mx-auto">
            {/* Left: Phone */}
            <a
              href={`tel:${settings.phoneRaw}`}
              className="flex items-center gap-2 min-[380px]:gap-3 sm:gap-4 md:gap-5 p-1.5 sm:p-3 md:p-4 rounded-2xl hover:bg-white/40 transition-all cursor-pointer group active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-purple/50 min-w-0"
            >
              <div className="relative w-9 h-9 min-[380px]:w-11 min-[380px]:h-11 sm:w-16 sm:h-16 md:w-20 md:h-20 shrink-0 transform group-hover:scale-105 transition-transform">
                <Image
                  src="/images/phone.webp"
                  alt="Телефон"
                  fill
                  sizes="(max-width: 640px) 44px, (max-width: 768px) 64px, 80px"
                  className="object-contain"
                />
              </div>
              <div className="text-left min-w-0">
                <p className="text-[11px] min-[380px]:text-xs sm:text-sm md:text-base font-heading font-bold text-brand-dark/80 tracking-wide uppercase leading-tight truncate">
                  ИМАТЕ ВЪПРОСИ?
                </p>
                <p className="font-heading font-bold text-xs min-[380px]:text-sm sm:text-2xl md:text-3xl text-brand-purple tracking-tight sm:tracking-normal mt-0.5 whitespace-nowrap">
                  {settings.phoneDisplay.replace(/\s+/g, "")}
                </p>
              </div>
            </a>

            {/* Right: Location */}
            <a
              href={settings.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 min-[380px]:gap-3 sm:gap-4 md:gap-5 p-1.5 sm:p-3 md:p-4 rounded-2xl hover:bg-white/40 transition-all cursor-pointer group active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-purple/50 min-w-0"
            >
              <div className="relative w-9 h-9 min-[380px]:w-11 min-[380px]:h-11 sm:w-16 sm:h-16 md:w-20 md:h-20 shrink-0 transform group-hover:scale-105 transition-transform">
                <Image
                  src="/images/location.webp"
                  alt="Локация"
                  fill
                  sizes="(max-width: 640px) 44px, (max-width: 768px) 64px, 80px"
                  className="object-contain"
                />
              </div>
              <div className="text-left min-w-0">
                <p className="text-[11px] min-[380px]:text-xs sm:text-sm md:text-base font-heading font-bold text-brand-dark/80 tracking-wide uppercase leading-tight truncate">
                  КЪДЕ?
                </p>
                <p className="font-heading font-bold text-[11px] min-[380px]:text-xs sm:text-base md:text-xl text-brand-purple uppercase leading-tight mt-0.5 break-words">
                  БУРГАС, СЛАВЕЙКОВ,
                </p>
                <p className="font-heading font-bold text-[10px] min-[380px]:text-[11px] sm:text-sm md:text-base text-brand-purple/90 uppercase leading-tight">
                  БЛ. 48 ПАРТЕР
                </p>
              </div>
            </a>
          </div>
        </Container>
      </div>

      {/* Bottom Wave Graphic */}
      <div className="w-full overflow-hidden leading-none pointer-events-none select-none">
        <svg
          viewBox="0 0 1440 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-6 sm:h-9 md:h-12 block text-[#ddd9f5] rotate-180"
          preserveAspectRatio="none"
        >
          <path
            d="M0,25 C320,55 480,5 720,30 C960,55 1120,10 1440,35 L1440,60 L0,60 Z"
            fill="currentColor"
          />
        </svg>
      </div>
    </section>
  );
}
