"use client";

import React, { useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

interface LanguageSwitcherProps {
  className?: string;
  variant?: "desktop" | "mobile";
}

export function LanguageSwitcher({ className, variant = "desktop" }: LanguageSwitcherProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentLang = searchParams?.get("lang")?.toLowerCase() === "en" ? "en" : "bg";

  const switchLanguage = (targetLang: "bg" | "en") => {
    if (targetLang === currentLang) return;

    try {
      document.cookie = `umenie_lang=${targetLang}; path=/; max-age=31536000; SameSite=Lax`;
    } catch {}

    const params = new URLSearchParams(searchParams ? searchParams.toString() : "");
    if (targetLang === "en") {
      params.set("lang", "en");
    } else {
      params.delete("lang");
    }

    const newQuery = params.toString();
    const newUrl = newQuery ? `${pathname}?${newQuery}` : pathname;

    startTransition(() => {
      router.push(newUrl);
      router.refresh();
    });
  };

  if (variant === "mobile") {
    return (
      <div
        className={cn(
          "inline-flex items-center p-1 rounded-full bg-brand-purple/10 border border-brand-purple/20 shadow-xs",
          className
        )}
      >
        <button
          type="button"
          onClick={() => switchLanguage("bg")}
          disabled={isPending}
          className={cn(
            "px-3 py-1 rounded-full text-xs font-heading font-bold transition-all cursor-pointer",
            currentLang === "bg"
              ? "bg-brand-purple text-white shadow-xs"
              : "text-brand-dark/70 hover:text-brand-purple"
          )}
          aria-label="Превключи на Български"
        >
          BG
        </button>
        <button
          type="button"
          onClick={() => switchLanguage("en")}
          disabled={isPending}
          className={cn(
            "px-3 py-1 rounded-full text-xs font-heading font-bold transition-all cursor-pointer",
            currentLang === "en"
              ? "bg-brand-purple text-white shadow-xs"
              : "text-brand-dark/70 hover:text-brand-purple"
          )}
          aria-label="Switch to English"
        >
          EN
        </button>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "inline-flex items-center p-0.5 rounded-full bg-brand-purple/10 border border-brand-purple/20 shadow-xs",
        className
      )}
    >
      <button
        type="button"
        onClick={() => switchLanguage("bg")}
        disabled={isPending}
        className={cn(
          "px-2.5 py-1 rounded-full text-xs font-heading font-bold transition-all cursor-pointer",
          currentLang === "bg"
            ? "bg-brand-purple text-white shadow-xs"
            : "text-brand-dark/70 hover:text-brand-purple"
        )}
        aria-label="Превключи на Български"
      >
        BG
      </button>
      <button
        type="button"
        onClick={() => switchLanguage("en")}
        disabled={isPending}
        className={cn(
          "px-2.5 py-1 rounded-full text-xs font-heading font-bold transition-all cursor-pointer",
          currentLang === "en"
            ? "bg-brand-purple text-white shadow-xs"
            : "text-brand-dark/70 hover:text-brand-purple"
        )}
        aria-label="Switch to English"
      >
        EN
      </button>
    </div>
  );
}
