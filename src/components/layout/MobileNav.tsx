"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { X, Phone, MapPin, Mail, ArrowRight } from "lucide-react";
import { NAV_LINKS, SITE_CONFIG } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const pathname = usePathname();

  // Prevent background scrolling when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Close when pathname changes
  useEffect(() => {
    onClose();
  }, [pathname, onClose]);

  return (
    <>
      {/* Backdrop overlay */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-brand-dark/40 backdrop-blur-sm transition-opacity duration-300 md:hidden",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <aside
        className={cn(
          "fixed top-0 right-0 bottom-0 z-50 w-[85%] max-w-sm bg-[#f1f2f6] shadow-2xl flex flex-col justify-between p-6 transition-transform duration-300 ease-out md:hidden border-l border-brand-purple/20",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
        aria-label="Мобилно меню"
      >
        <div>
          {/* Drawer Header */}
          <div className="flex items-center justify-between pb-4 border-b border-brand-purple/15">
            <Link href="/" onClick={onClose} className="relative block h-12 w-32">
              <Image
                src="/images/logo.png"
                alt={SITE_CONFIG.name}
                fill
                className="object-contain"
                sizes="128px"
                priority
              />
            </Link>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-brand-dark hover:text-brand-purple hover:bg-brand-purple/10 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-purple"
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
                    "flex items-center justify-between px-4 py-3 rounded-2xl font-heading text-base font-bold transition-all",
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
        <div className="pt-6 border-t border-brand-purple/15 space-y-4">
          {/* Quick Call Button */}
          <a
            href={`tel:${SITE_CONFIG.phoneRaw}`}
            className="flex items-center justify-center gap-2 w-full py-3.5 px-4 bg-brand-purple text-white rounded-full font-heading font-bold text-sm shadow-button hover:bg-brand-purple-hover transition-all active:scale-[0.98]"
          >
            <Phone className="w-4 h-4" />
            <span>{SITE_CONFIG.phoneDisplay}</span>
          </a>

          {/* Location Badge */}
          <a
            href={SITE_CONFIG.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-2.5 p-3 rounded-2xl bg-white/70 hover:bg-white text-xs text-brand-dark transition-colors"
          >
            <MapPin className="w-4 h-4 text-brand-purple shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-brand-purple">Локация</p>
              <p className="text-brand-muted">{SITE_CONFIG.locationFull}</p>
            </div>
          </a>

          {/* Social Icons */}
          <div className="flex items-center justify-center gap-4 pt-2">
            <a
              href={SITE_CONFIG.social.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook страница"
              className="p-2.5 rounded-full bg-white text-brand-purple shadow-sm hover:scale-110 hover:bg-brand-purple hover:text-white transition-all"
            >
              <div className="relative w-5 h-5">
                <Image
                  src="/images/fb.png"
                  alt="Facebook"
                  fill
                  className="object-contain"
                />
              </div>
            </a>
            <a
              href={SITE_CONFIG.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram профил"
              className="p-2.5 rounded-full bg-white text-brand-purple shadow-sm hover:scale-110 hover:bg-brand-purple hover:text-white transition-all"
            >
              <div className="relative w-5 h-5">
                <Image
                  src="/images/ig.png"
                  alt="Instagram"
                  fill
                  className="object-contain"
                />
              </div>
            </a>
          </div>
        </div>
      </aside>
    </>
  );
}
