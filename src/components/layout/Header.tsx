"use client";

import React, { useState, useCallback, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Phone, MapPin, Menu, X } from "lucide-react";
import { NAV_LINKS, SITE_CONFIG } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/Container";
import { MobileNav } from "./MobileNav";
import { LanguageSwitcher } from "@/components/common/LanguageSwitcher";
import { useLanguage } from "@/lib/i18n";
import type { SiteSettings } from "@/lib/types/site-settings";

interface HeaderProps {
  initialSettings?: SiteSettings;
}

export function Header({ initialSettings }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { dict, locale } = useLanguage();

  // Do not render public header in the admin panel
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const phoneDisplay = initialSettings?.phoneDisplay || SITE_CONFIG.phoneDisplay;
  const phoneRaw = initialSettings?.phoneRaw || SITE_CONFIG.phoneRaw;
  const locationShort = locale === "en" ? dict.common.locationShort : (initialSettings?.locationShort || SITE_CONFIG.locationShort);
  const googleMapsUrl = initialSettings?.googleMapsUrl || SITE_CONFIG.googleMapsUrl;
  const tagline = locale === "en" ? dict.common.tagline : (initialSettings?.tagline || SITE_CONFIG.tagline);

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev);
  }, []);

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

  return (
    <>
      {/* Top micro bar for desktop info: Location & Phone (scrolls away naturally) */}
      <div className="hidden lg:block bg-[#887ed8]/10 border-b border-[#887ed8]/15 text-xs text-brand-dark py-1.5">
        <Container size="xl" className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-brand-dark/80 hover:text-brand-purple transition-colors font-medium"
            >
              <MapPin className="w-3.5 h-3.5 text-brand-purple shrink-0" />
              <span>{locationShort}</span>
            </a>
            <span className="text-brand-purple/30">•</span>
            <span className="text-brand-muted">{tagline}</span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href={`tel:${phoneRaw}`}
              className="flex items-center gap-1.5 text-brand-dark font-bold hover:text-brand-purple transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-brand-purple shrink-0" />
              <span>{phoneDisplay}</span>
            </a>
          </div>
        </Container>
      </div>

      {/* Main navigation bar (stays sticky at top when scrolling) */}
      <header className="sticky top-0 z-40 w-full bg-[#f1f2f6]/95 backdrop-blur-md border-b border-brand-purple/15 shadow-sm transition-all duration-200">
        <Container size="xl" className="flex items-center justify-between h-20 md:h-24">
          {/* Logo */}
          <Link
            href="/"
            className="relative flex items-center h-16 w-48 sm:h-20 sm:w-60 md:w-64 focus:outline-none group"
            aria-label={dict.common.nav.home}
          >
            <Image
              src="/images/logo.webp"
              alt={dict.common.siteName}
              fill
              className="object-contain transition-transform duration-200 group-hover:scale-[1.02]"
              sizes="(max-width: 640px) 192px, 256px"
              priority
            />
          </Link>

          {/* Desktop Navigation Links */}
          <nav
            aria-label={dict.common.nav.ariaNav}
            className="hidden md:flex items-center gap-1 lg:gap-3"
          >
            {localizedNavLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative px-4 py-2 rounded-full font-heading text-sm lg:text-base font-bold transition-all duration-200 tracking-wide",
                    isActive
                      ? "text-brand-purple bg-brand-purple/10"
                      : "text-brand-dark hover:text-brand-purple hover:bg-brand-purple/5"
                  )}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-brand-purple rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Right CTA: Language Switcher + Phone */}
          <div className="hidden md:flex items-center gap-3">
            <LanguageSwitcher size="md" />
            <a
              href={`tel:${phoneRaw}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-brand-purple text-white font-heading font-bold text-sm shadow-button hover:bg-brand-purple-hover hover:shadow-button-hover transition-all active:scale-[0.98]"
            >
              <Phone className="w-4 h-4 shrink-0" />
              <span>{phoneDisplay}</span>
            </a>
          </div>

          {/* Mobile Right Controls: Language Switcher + Hamburger Button */}
          <div className="flex md:hidden items-center gap-2">
            <LanguageSwitcher size="sm" />
            <button
              type="button"
              onClick={toggleMobileMenu}
              className="flex flex-col justify-center items-center w-11 h-11 rounded-2xl bg-brand-purple/10 text-brand-purple hover:bg-brand-purple/20 transition-all focus:outline-none focus:ring-2 focus:ring-brand-purple cursor-pointer active:scale-95"
              aria-label={isMobileMenuOpen ? dict.common.nav.closeMenu : dict.common.nav.openMenu}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-brand-purple" />
              ) : (
                <Menu className="w-6 h-6 text-brand-purple" />
              )}
            </button>
          </div>
        </Container>
      </header>

      {/* Mobile Drawer */}
      <MobileNav
        isOpen={isMobileMenuOpen}
        onClose={closeMobileMenu}
        settings={initialSettings}
      />
    </>
  );
}
