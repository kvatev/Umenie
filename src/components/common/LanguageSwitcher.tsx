"use client";

import React from "react";
import { useLanguage } from "@/lib/i18n";
import { cn } from "@/lib/utils";

interface LanguageSwitcherProps {
  className?: string;
  size?: "sm" | "md";
}

export function LanguageSwitcher({ className, size = "md" }: LanguageSwitcherProps) {
  const { locale, setLocale } = useLanguage();

  return (
    <div
      role="group"
      aria-label="Избор на език / Language selection"
      className={cn(
        "inline-flex items-center rounded-full bg-white/90 p-0.5 border border-brand-purple/20 shadow-xs backdrop-blur-sm select-none shrink-0",
        size === "sm" ? "text-xs" : "text-xs sm:text-sm",
        className
      )}
    >
      <button
        type="button"
        onClick={() => setLocale("bg")}
        aria-pressed={locale === "bg"}
        aria-label="Български език (BG)"
        className={cn(
          "rounded-full font-heading font-bold transition-all duration-200 cursor-pointer focus:outline-none focus:ring-1 focus:ring-brand-purple/50",
          size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-2.5 sm:px-3 py-1 text-xs",
          locale === "bg"
            ? "bg-[#887ed8] text-white shadow-xs"
            : "text-slate-600 hover:text-[#887ed8]"
        )}
      >
        BG
      </button>
      <button
        type="button"
        onClick={() => setLocale("en")}
        aria-pressed={locale === "en"}
        aria-label="English language (EN)"
        className={cn(
          "rounded-full font-heading font-bold transition-all duration-200 cursor-pointer focus:outline-none focus:ring-1 focus:ring-brand-purple/50",
          size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-2.5 sm:px-3 py-1 text-xs",
          locale === "en"
            ? "bg-[#887ed8] text-white shadow-xs"
            : "text-slate-600 hover:text-[#887ed8]"
        )}
      >
        EN
      </button>
    </div>
  );
}
