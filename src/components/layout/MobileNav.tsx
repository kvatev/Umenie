"use client";

import React, { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { X, Phone, MapPin, ArrowRight } from "lucide-react";
import { NAV_LINKS, SITE_CONFIG } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { SiteSettings } from "@/lib/types/site-settings";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  settings?: SiteSettings;
}

export function MobileNav({ isOpen, onClose, settings }: MobileNavProps) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const phoneDisplay = settings?.phoneDisplay || SITE_CONFIG.phoneDisplay;
  const phoneRaw = settings?.phoneRaw || SITE_CONFIG.phoneRaw;
  const locationFull = settings?.locationFull || SITE_CONFIG.locationFull;
  const googleMapsUrl = settings?.googleMapsUrl || SITE_CONFIG.googleMapsUrl;
  const facebookUrl = settings?.facebookUrl || SITE_CONFIG.social.facebook;
  const instagramUrl = settings?.instagramUrl || SITE_CONFIG.social.instagram;

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

  // Close when pathname actually changes (e.g. navigation via browser history or link)
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

  if (!mounted) return null;

  return createPortal(
    <>
      {/* Backdrop overlay */}
      <div
        className={cn(
          "fixed inset-0 z-[9998] bg-brand-dark/50 backdrop-blur-sm transition-opacity duration-300 md:hidden",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <aside
        className={cn(
          "fixed top-0 right-0 bottom-0 z-[9999] w-[85%] max-w-sm h-full max-h-[100dvh] overflow-y-auto bg-[#f1f2f6] shadow-2xl flex flex-col p-6 transition-transform duration-300 ease-out md:hidden border-l border-brand-purple/20",
          isOpen ? "translate-x-0 pointer-events-auto" : "translate-x-full pointer-events-none"
        )}
        aria-label="Мобилно меню"
        aria-hidden={!isOpen}
      >
        <div className="flex-1 flex flex-col">
          {/* Drawer Header */}
          <div className="flex items-center justify-between pb-4 border-b border-brand-purple/15 shrink-0">
            <Link href="/" onClick={onClose} className="relative block h-12 w-32 focus:outline-none">
              <Image
                src="/images/logo.webp"
                alt={SITE_CONFIG.name}
                fill
                className="object-contain"
                sizes="128px"
                priority
              />
            </Link>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full text-brand-dark hover:text-brand-purple hover:bg-brand-purple/10 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-purple cursor-pointer active:scale-95"
              aria-label="Затвори менюто"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="mt-6 flex flex-col space-y-2">
            {NAV_LINKS.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    "flex items-center justify-between px-4 py-3.5 rounded-2xl font-heading text-base font-bold transition-all",
                    isActive
                      ? "bg-brand-purple text-white shadow-button"
                      : "text-brand-dark hover:bg-white/80 hover:text-brand-purple"
                  )}
                >
                  <span>{item.label}</span>
                  <ArrowRight
                    className={cn(
                      "w-4 h-4 transition-transform",
                      isActive ? "text-white translate-x-1" : "text-brand-purple/50"
                    )}
                  />
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Drawer Footer Contact Info */}
        <div className="mt-8 pt-6 border-t border-brand-purple/15 space-y-4 shrink-0">
          {/* Quick Call Button */}
          <a
            href={`tel:${phoneRaw}`}
            className="flex items-center justify-center gap-2 w-full py-3.5 px-4 bg-brand-purple text-white rounded-full font-heading font-bold text-sm shadow-button hover:bg-brand-purple-hover transition-all active:scale-[0.98]"
          >
            <Phone className="w-4 h-4" />
            <span>{phoneDisplay}</span>
          </a>

          {/* Location Badge */}
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-2.5 p-3 rounded-2xl bg-white/70 hover:bg-white text-xs text-brand-dark transition-colors"
          >
            <MapPin className="w-4 h-4 text-brand-purple shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-brand-purple">Локация</p>
              <p className="text-brand-muted">{locationFull}</p>
            </div>
          </a>

          {/* Social Icons */}
          <div className="flex items-center justify-center gap-4 pt-2">
            <a
              href={facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook страница"
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
              aria-label="Instagram профил"
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
          </div>
        </div>
      </aside>
    </>,
    document.body
  );
}
