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
          className="w-full h-8 sm:h-14 block text-[#ddd9f5] preserve-3d"
          preserveAspectRatio="none"
        >
          <path
            d="M0,45 C320,85 480,10 720,50 C960,90 1120,15 1440,55 L1440,90 L0,90 Z"
            fill="currentColor"
          />
        </svg>
      </div>

      {/* Main Banner Content with Lavender Background */}
      <div className="w-full bg-[#ddd9f5] py-4 sm:py-6">
        <Container size="xl">
          <div className="grid grid-cols-2 gap-3 sm:gap-8 items-center justify-between max-w-4xl mx-auto">
            {/* Left: Phone */}
            <a
              href={`tel:${settings.phoneRaw}`}
              className="flex items-center gap-2 sm:gap-4 p-2 sm:p-3 rounded-2xl hover:bg-white/40 transition-all cursor-pointer group active:scale-95"
            >
              <div className="relative w-9 h-9 sm:w-14 sm:h-14 shrink-0 transform group-hover:scale-105 transition-transform">
                <Image
                  src="/images/phone.webp"
                  alt="Телефон"
                  fill
                  sizes="(max-width: 640px) 36px, 56px"
                  className="object-contain"
                />
              </div>
              <div className="text-left">
                <p className="text-[10px] sm:text-xs font-heading font-bold text-brand-dark/80 tracking-wide uppercase leading-tight">
                  ИМАТЕ ВЪПРОСИ?
                </p>
                <p className="text-[10px] sm:text-xs font-heading font-bold text-brand-dark/80 tracking-wide uppercase leading-tight hidden xs:block">
                  ОБАДЕТЕ НИ СЕ!
                </p>
                <p className="font-heading font-bold text-sm sm:text-2xl text-brand-purple tracking-tight sm:tracking-normal mt-0.5">
                  {settings.phoneDisplay.replace(/\s+/g, "")}
                </p>
              </div>
            </a>

            {/* Right: Location */}
            <a
              href={settings.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 sm:gap-4 p-2 sm:p-3 rounded-2xl hover:bg-white/40 transition-all cursor-pointer group active:scale-95"
            >
              <div className="relative w-9 h-9 sm:w-14 sm:h-14 shrink-0 transform group-hover:scale-105 transition-transform">
                <Image
                  src="/images/location.webp"
                  alt="Локация"
                  fill
                  sizes="(max-width: 640px) 36px, 56px"
                  className="object-contain"
                />
              </div>
              <div className="text-left">
                <p className="text-[10px] sm:text-xs font-heading font-bold text-brand-dark/80 tracking-wide uppercase leading-tight">
                  КЪДЕ?
                </p>
                <p className="font-heading font-bold text-xs sm:text-base text-brand-purple uppercase leading-tight mt-0.5">
                  БУРГАС, СЛАВЕЙКОВ,
                </p>
                <p className="font-heading font-bold text-[10px] sm:text-sm text-brand-purple/90 uppercase leading-tight">
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
          className="w-full h-6 sm:h-10 block text-[#ddd9f5] rotate-180"
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
