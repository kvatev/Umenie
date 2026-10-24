"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Locale, DEFAULT_LOCALE, LOCALE_COOKIE_NAME } from "./types";
import { getDictionary } from "./get-dictionary";
import type { Dictionary } from "./dictionaries";

interface LanguageContextType {
  locale: Locale;
  setLocale: (newLocale: Locale) => void;
  dict: Dictionary;
  t: (keyPath: string, fallback?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({
  children,
  initialLocale = DEFAULT_LOCALE,
}: {
  children: React.ReactNode;
  initialLocale?: Locale;
}) {
  const router = useRouter();
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  // Sync client state with browser cookie / localStorage if mismatched
  useEffect(() => {
    try {
      const match = document.cookie.match(new RegExp(`(^|;\\s*)${LOCALE_COOKIE_NAME}=([^;]*)`));
      const cookieLocale = match ? (decodeURIComponent(match[2]) as Locale) : null;
      const storedLocale = (localStorage.getItem(LOCALE_COOKIE_NAME) as Locale) || cookieLocale;
      if (storedLocale && (storedLocale === "bg" || storedLocale === "en") && storedLocale !== locale) {
        setLocaleState(storedLocale);
      }
    } catch {
      // safe fallback
    }
  }, [locale]);

  const setLocale = useCallback(
    (newLocale: Locale) => {
      if (newLocale === locale) return;
      setLocaleState(newLocale);

      try {
        // Set cookie valid for 1 year across whole domain
        document.cookie = `${LOCALE_COOKIE_NAME}=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
        localStorage.setItem(LOCALE_COOKIE_NAME, newLocale);
        document.documentElement.lang = newLocale;
      } catch {
        // safe fallback
      }

      // Re-trigger Server Components execution with updated cookies inside startTransition to ensure 0ms UI responsiveness
      React.startTransition(() => {
        router.refresh();
      });
    },
    [locale, router]
  );

  const dict = useMemo(() => getDictionary(locale), [locale]);

  const t = useCallback(
    (keyPath: string, fallback?: string): string => {
      const parts = keyPath.split(".");
      let current: any = dict;
      for (const part of parts) {
        if (current && typeof current === "object" && part in current) {
          current = current[part];
        } else {
          return fallback || keyPath;
        }
      }
      return typeof current === "string" ? current : fallback || keyPath;
    },
    [dict]
  );

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      dict,
      t,
    }),
    [locale, setLocale, dict, t]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
