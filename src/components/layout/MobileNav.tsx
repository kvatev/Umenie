"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { createPortal } from "react-dom";
import { Phone, MapPin, X, ArrowRight } from "lucide-react";
import { NAV_LINKS, SITE_CONFIG } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { LanguageSwitcher } from "@/components/common/LanguageSwitcher";
import { useLanguage } from "@/lib/i18n";
import type { SiteSettings } from "@/lib/types/site-settings";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  settings?: SiteSettings;
}

export function MobileNav({ isOpen, onClose, settings }: MobileNavProps) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const { dict, locale } = useLanguage();

  useEffect(() => {
    setMounted(true);
  }, []);

  const phoneDisplay = settings?.phoneDisplay || SITE_CONFIG.phoneDisplay;
  const phoneRaw = settings?.phoneRaw || SITE_CONFIG.phoneRaw;
  const locationFull = locale === "en" ? dict.common.locationFull : (settings?.locationFull || SITE_CONFIG.locationFull);
  const googleMapsUrl = settings?.googleMapsUrl || SITE_CONFIG.googleMapsUrl;
  const facebookUrl = settings?.facebookUrl || SITE_CONFIG.social.facebook;
  const instagramUrl = settings?.instagramUrl || SITE_CONFIG.social.instagram;
  const tiktokUrl = settings?.tiktokUrl || SITE_CONFIG.social.tiktok;

  const prevPathnameRef = useRef(pathname);

  // Prevent background scrolling when menu is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow || "";
      };
    }
  }, [isOpen]);

  // Close when pathname actually changes
  useEffect(() => {
    if (prevPathnameRef.current !== pathname) {
      prevPathnameRef.current = pathname;
      if (isOpen) {
        onClose();
      }
    }
  }, [pathname, isOpen, onClose]);

  // Close on Escape key press
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Localized navigation links
  const localizedNavLinks = useMemo(() => {
    return NAV_LINKS.map((link) => {
      let label = link.label;
      if (link.href === "/") label = dict.common.nav.home;
      else if (link.href === "/uslugi") label = dict.common.nav.services;
      else if (link.href === "/za-nas") label = dict.common.nav.about;
      else if (link.href === "/blog") label = dict.common.nav.blog;
      else if (link.href === "/grafik") label = dict.common.nav.schedule;
      return { ...link, label };
    });
  }, [dict]);

  if (!mounted) return null;

  return createPortal(
    <>
      {/* Backdrop overlay */}
      <div
        className={cn(
          "fixed inset-0 z-[9998] bg-brand-dark/50 backdrop-blur-sm transition-opacity duration-300 lg:hidden",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <aside
        className={cn(
          "fixed top-0 right-0 bottom-0 z-[9999] w-[85%] max-w-sm h-full max-h-[100dvh] overflow-y-auto bg-[#f1f2f6] shadow-2xl flex flex-col p-6 transition-transform duration-300 ease-out lg:hidden border-l border-brand-purple/20",
          isOpen ? "translate-x-0 pointer-events-auto" : "translate-x-full pointer-events-none"
        )}
        aria-label={dict.common.nav.mobileMenuLabel}
        aria-hidden={!isOpen}
      >
        <div className="flex-1 flex flex-col">
          {/* Drawer Header */}
          <div className="flex items-center justify-between pb-4 border-b border-brand-purple/15 shrink-0 gap-2">
            <Link href="/" prefetch={true} onClick={onClose} className="relative block h-12 w-32 focus:outline-none">
              <Image
                src="/images/logo.webp"
                alt={dict.common.siteName}
                fill
                className="object-contain"
                sizes="128px"
                priority
              />
            </Link>

            <div className="flex items-center gap-2">
              <LanguageSwitcher size="sm" />
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-full text-brand-dark hover:text-brand-purple hover:bg-brand-purple/10 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-purple cursor-pointer active:scale-95"
                aria-label={dict.common.nav.closeMenu}
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 py-6 space-y-1">
            {localizedNavLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  prefetch={true}
                  onClick={onClose}
                  className={cn(
                    "flex items-center justify-between px-4 py-3 rounded-2xl font-heading text-base font-bold transition-all duration-200 tracking-wide",
                    isActive
                      ? "bg-brand-purple text-white shadow-sm"
                      : "text-brand-dark hover:bg-brand-purple/10 hover:text-brand-purple"
                  )}
                >
                  <span>{link.label}</span>
                  <ArrowRight
                    className={cn(
                      "w-4 h-4 transition-transform",
                      isActive ? "text-white translate-x-1" : "text-brand-purple/40"
                    )}
                  />
                </Link>
              );
            })}
          </nav>

          {/* CTA Phone Button */}
          <div className="pt-2 pb-4">
            <a
              href={`tel:${phoneRaw}`}
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-brand-purple text-white font-heading font-bold text-sm tracking-wide shadow-button hover:bg-brand-purple-hover active:scale-[0.98] transition-all"
            >
              <Phone className="w-4 h-4 shrink-0" />
              <span>{phoneDisplay}</span>
            </a>
          </div>
        </div>

        {/* Drawer Footer: Contacts & Socials */}
        <div className="pt-4 border-t border-brand-purple/15 text-xs text-brand-dark/80 space-y-3 shrink-0">
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-2.5 hover:text-brand-purple transition-colors"
          >
            <MapPin className="w-4 h-4 text-brand-purple shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-brand-purple">{dict.common.locationLabel}</p>
              <p className="text-brand-muted">{locationFull}</p>
            </div>
          </a>

          {/* Social Icons */}
          <div className="flex items-center justify-center gap-3.5 pt-2">
            <a
              href={facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={dict.common.footer.facebookAria}
              className="p-2.5 rounded-full bg-white text-brand-purple shadow-sm hover:scale-110 hover:bg-brand-purple hover:text-white transition-all flex items-center justify-center"
            >
              <div className="relative w-5 h-5">
                <Image
                  src="/images/fb.webp"
                  alt="Facebook"
                  width={42}
                  height={42}
                  sizes="42px"
                  className="w-full h-full object-contain"
                />
              </div>
            </a>
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={dict.common.footer.instagramAria}
              className="p-2.5 rounded-full bg-white text-brand-purple shadow-sm hover:scale-110 hover:bg-brand-purple hover:text-white transition-all flex items-center justify-center"
            >
              <div className="relative w-5 h-5">
                <Image
                  src="/images/ig.webp"
                  alt="Instagram"
                  width={42}
                  height={42}
                  sizes="42px"
                  className="w-full h-full object-contain"
                />
              </div>
            </a>
            <a
              href={tiktokUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={dict.common.footer.tiktokAria}
              className="p-2.5 rounded-full bg-white text-brand-purple shadow-sm hover:scale-110 hover:bg-brand-purple hover:text-white transition-all flex items-center justify-center"
            >
              <div className="relative w-5 h-5 flex items-center justify-center">
                <svg
                  className="w-full h-full fill-current"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.49 6.27 6.27 0 0 0 1.94-4.52V8.78a8.16 8.16 0 0 0 4.77 1.53v-3.47a4.85 4.85 0 0 1-.94-.15z" />
                </svg>
              </div>
            </a>
          </div>
        </div>
      </aside>
    </>,
    document.body
  );
}
