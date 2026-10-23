"use client";

import React from "react";
import { useLanguage } from "@/lib/i18n";
import { cn } from "@/lib/utils";

interface LanguageSwitcherProps {
  className?: string;
  size?: "sm" | "md";
}

/**
 * Crisp inline SVG of the Bulgarian flag (Horizontal tricolor: White, Green, Red)
 * Ratio 5:3 with subtle border for contrast on white backgrounds
 */
export function BulgarianFlagSvg({ className = "w-4 h-3" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 60 36"
      className={cn("shrink-0 rounded-[2px] shadow-[0_0_0_1px_rgba(0,0,0,0.12)]", className)}
      style={{ overflow: "hidden" }}
      aria-hidden="true"
    >
      <rect width="60" height="12" y="0" fill="#FFFFFF" />
      <rect width="60" height="12" y="12" fill="#00966E" />
      <rect width="60" height="12" y="24" fill="#D62612" />
    </svg>
  );
}

/**
 * Crisp inline SVG of the Union Jack (UK flag)
 * Geometric vector representation with authentic colors and layered crosses
 */
export function UkFlagSvg({ className = "w-4 h-3" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 60 30"
      className={cn("shrink-0 rounded-[2px] shadow-[0_0_0_1px_rgba(0,0,0,0.12)]", className)}
      style={{ overflow: "hidden" }}
      aria-hidden="true"
    >
      {/* Blue background */}
      <rect width="60" height="30" fill="#012169" />
      {/* White diagonal saltire */}
      <path d="M0 0 L60 30 M60 0 L0 30" stroke="#FFFFFF" strokeWidth="6" />
      {/* Red diagonal saltire */}
      <path d="M0 0 L60 30 M60 0 L0 30" stroke="#C8102E" strokeWidth="2" />
      {/* White central cross */}
      <path d="M30 0 V30 M0 15 H60" stroke="#FFFFFF" strokeWidth="10" />
      {/* Red central cross */}
      <path d="M30 0 V30 M0 15 H60" stroke="#C8102E" strokeWidth="6" />
    </svg>
  );
}

export function LanguageSwitcher({ className, size = "md" }: LanguageSwitcherProps) {
  const { locale, setLocale } = useLanguage();

  return (
    <div
      role="group"
      aria-label="Избор на език / Language selection"
      className={cn(
        "inline-flex items-center rounded-full bg-white/95 p-1 border border-brand-purple/20 shadow-xs backdrop-blur-sm select-none shrink-0 transition-all",
        size === "sm" ? "gap-0.5" : "gap-1",
        className
      )}
    >
      {/* Bulgarian Option */}
      <button
        type="button"
        onClick={() => setLocale("bg")}
        aria-pressed={locale === "bg"}
        aria-label="Български език (BG)"
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full font-heading font-bold transition-all duration-200 cursor-pointer focus:outline-none focus:ring-1 focus:ring-brand-purple/50",
          size === "sm"
            ? "px-2 py-0.5 text-[11px]"
            : "px-2.5 sm:px-3 py-1 text-xs",
          locale === "bg"
            ? "bg-[#887ed8] text-white shadow-sm"
            : "text-slate-600 hover:text-[#887ed8] hover:bg-brand-purple/5"
        )}
      >
        <BulgarianFlagSvg
          className={size === "sm" ? "w-3.5 h-2.5" : "w-4 h-2.5 sm:h-3"}
        />
        <span>BG</span>
      </button>

      {/* English Option */}
      <button
        type="button"
        onClick={() => setLocale("en")}
        aria-pressed={locale === "en"}
        aria-label="English language (EN)"
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full font-heading font-bold transition-all duration-200 cursor-pointer focus:outline-none focus:ring-1 focus:ring-brand-purple/50",
          size === "sm"
            ? "px-2 py-0.5 text-[11px]"
            : "px-2.5 sm:px-3 py-1 text-xs",
          locale === "en"
            ? "bg-[#887ed8] text-white shadow-sm"
            : "text-slate-600 hover:text-[#887ed8] hover:bg-brand-purple/5"
        )}
      >
        <UkFlagSvg
          className={size === "sm" ? "w-3.5 h-2.5" : "w-4 h-2.5 sm:h-3"}
        />
        <span>EN</span>
      </button>
    </div>
  );
}
