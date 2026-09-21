import React from "react";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { SITE_CONFIG } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface QuickContactBannerProps {
  className?: string;
}

export function QuickContactBanner({ className }: QuickContactBannerProps) {
  return (
    <section
      className={cn(
        "w-full bg-[#e9e7f8] py-8 sm:py-12 border-y border-brand-purple/20",
        className
      )}
    >
      <Container size="xl">
        <div className="flex flex-col md:flex-row items-center justify-around gap-8 text-center md:text-left">
          {/* Phone callout */}
          <a
            href={`tel:${SITE_CONFIG.phoneRaw}`}
            className="flex items-center gap-4 group p-3 rounded-2xl hover:bg-white/50 transition-all cursor-pointer"
          >
            <div className="relative w-14 h-14 sm:w-16 sm:h-16 shrink-0 transform group-hover:scale-105 transition-transform">
              <Image
                src="/images/phone.webp"
                alt="Телефон"
                fill
                sizes="64px"
                className="object-contain"
              />
            </div>
            <div className="text-left">
              <p className="text-xs sm:text-sm font-heading font-bold text-brand-dark tracking-wide uppercase">
                ИМАТЕ ВЪПРОСИ? ОБАДЕТЕ НИ СЕ!
              </p>
              <p className="font-heading font-bold text-2xl sm:text-3xl text-brand-purple">
                {SITE_CONFIG.phoneDisplay}
              </p>
            </div>
          </a>

          {/* Location callout */}
          <a
            href={SITE_CONFIG.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 group p-3 rounded-2xl hover:bg-white/50 transition-all cursor-pointer"
          >
            <div className="relative w-14 h-14 sm:w-16 sm:h-16 shrink-0 transform group-hover:scale-105 transition-transform">
              <Image
                src="/images/location.webp"
                alt="Локация"
                fill
                sizes="64px"
                className="object-contain"
              />
            </div>
            <div className="text-left">
              <p className="text-xs sm:text-sm font-heading font-bold text-brand-dark tracking-wide uppercase">
                КЪДЕ?
              </p>
              <p className="font-heading font-bold text-lg sm:text-xl text-brand-purple uppercase">
                СЛАВЕЙКОВ, БЛ. 48 ПАРТЕР
              </p>
            </div>
          </a>
        </div>
      </Container>
    </section>
  );
}
