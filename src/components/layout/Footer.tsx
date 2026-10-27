import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Phone, MapPin, Mail } from "lucide-react";
import { SITE_CONFIG, FOOTER_LEGAL_LINKS } from "@/lib/constants";
import { Container } from "@/components/ui/Container";
import { getSiteSettings } from "@/lib/site-settings";
import { resolveLocalized, getLocaleFromContext } from "@/lib/dictionaries";

export async function Footer() {
  const currentYear = new Date().getFullYear();
  const settings = await getSiteSettings();
  const locale = await getLocaleFromContext();

  const isEn = locale === "en";

  const locationFull = resolveLocalized(
    locale,
    settings.locationFull,
    settings.locationFullEn,
    SITE_CONFIG.locationFull,
    "Slaveykov complex, block 48, ground floor, Burgas"
  );

  const tagline = resolveLocalized(
    locale,
    settings.tagline,
    settings.taglineEn,
    SITE_CONFIG.tagline,
    "Educational club for successful children in Burgas"
  );

  const contactsTitle = isEn ? "CONTACTS" : "КОНТАКТИ";
  const allRightsReserved = isEn
    ? `© ${currentYear} Educational Club "Umenie" Burgas. All rights reserved.`
    : `© ${currentYear} Образователен клуб „УМеНИе“ Бургас. Всички права запазени.`;

  return (
    <footer className="w-full bg-[#f1f2f6] border-t border-brand-purple/20 pt-10 sm:pt-14 pb-8 mt-auto">
      <Container size="xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 items-start pb-8 sm:pb-10 border-b border-brand-purple/15">
          {/* Column 1: Contacts */}
          <div className="space-y-4">
            <h3 className="font-heading font-bold text-xl md:text-2xl text-brand-purple tracking-wide">
              {contactsTitle}
            </h3>
            <ul className="space-y-3.5 text-sm md:text-base font-medium text-brand-dark">
              <li>
                <a
                  href={`tel:${settings.phoneRaw}`}
                  className="inline-flex items-center gap-3 hover:text-brand-purple transition-colors group"
                >
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-purple/10 text-brand-purple group-hover:bg-brand-purple group-hover:text-white transition-colors shrink-0">
                    <Phone className="w-4 h-4 shrink-0" />
                  </span>
                  <span className="font-semibold">{settings.phoneFull}</span>
                </a>
              </li>
              <li>
                <a
                  href={settings.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 hover:text-brand-purple transition-colors group"
                >
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-purple/10 text-brand-purple group-hover:bg-brand-purple group-hover:text-white transition-colors shrink-0">
                    <MapPin className="w-4 h-4 shrink-0" />
                  </span>
                  <span className="text-xs md:text-sm font-medium">
                    {locationFull}
                  </span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${settings.email}`}
                  className="inline-flex items-center gap-3 hover:text-brand-purple transition-colors group"
                >
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-purple/10 text-brand-purple group-hover:bg-brand-purple group-hover:text-white transition-colors shrink-0">
                    <Mail className="w-4 h-4 shrink-0" />
                  </span>
                  <span className="text-xs md:text-sm font-medium">
                    {settings.email}
                  </span>
                </a>
              </li>
            </ul>

            {/* Mobile Social Icons */}
            <div className="flex md:hidden items-center gap-3.5 pt-3">
              <a
                href={settings.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook страница на УМеНИе"
                className="relative w-11 h-11 rounded-full p-2 bg-brand-purple/10 text-brand-purple hover:bg-brand-purple hover:text-white transition-all transform hover:scale-110 shadow-sm active:scale-95 flex items-center justify-center"
              >
                <div className="relative w-6 h-6">
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
                href={settings.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram профил на УМеНИе"
                className="relative w-11 h-11 rounded-full p-2 bg-brand-purple/10 text-brand-purple hover:bg-brand-purple hover:text-white transition-all transform hover:scale-110 shadow-sm active:scale-95 flex items-center justify-center"
              >
                <div className="relative w-6 h-6">
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
                href={settings.tiktokUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok профил на УМеНИе"
                className="relative w-11 h-11 rounded-full p-2 bg-brand-purple/10 text-brand-purple hover:bg-brand-purple hover:text-white transition-all transform hover:scale-110 shadow-sm active:scale-95 flex items-center justify-center"
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

          {/* Column 2: Socials & Brand Identity (Visible on Desktop) */}
          <div className="hidden md:flex flex-col items-center justify-center text-center space-y-4 py-2">
            <Link href={isEn ? "/?lang=en" : "/"} className="relative block h-16 w-48">
              <Image
                src="/images/logo.webp"
                alt={SITE_CONFIG.name}
                fill
                className="object-contain"
                sizes="192px"
              />
            </Link>
            <p className="text-xs md:text-sm text-brand-muted max-w-xs font-medium">
              {tagline}
            </p>
            <div className="flex items-center gap-4 pt-2">
              <a
                href={settings.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook страница на УМеНИе"
                className="relative w-12 h-12 rounded-full p-2.5 bg-brand-purple/10 text-brand-purple hover:bg-brand-purple hover:text-white transition-all transform hover:scale-110 shadow-sm flex items-center justify-center"
              >
                <div className="relative w-7 h-7">
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
                href={settings.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram профил на УМеНИе"
                className="relative w-12 h-12 rounded-full p-2.5 bg-brand-purple/10 text-brand-purple hover:bg-brand-purple hover:text-white transition-all transform hover:scale-110 shadow-sm flex items-center justify-center"
              >
                <div className="relative w-7 h-7">
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
                href={settings.tiktokUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok профил на УМеНИе"
                className="relative w-12 h-12 rounded-full p-2.5 bg-brand-purple/10 text-brand-purple hover:bg-brand-purple hover:text-white transition-all transform hover:scale-110 shadow-sm flex items-center justify-center"
              >
                <div className="relative w-6 h-6 flex items-center justify-center">
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

          {/* Column 3: Legal & Information Links */}
          <div className="space-y-4 md:text-right">
            <h3 className="font-heading font-bold text-xl md:text-2xl text-brand-purple tracking-wide">
              {isEn ? "INFORMATION" : "ИНФОРМАЦИЯ"}
            </h3>
            <ul className="space-y-2.5 text-xs md:text-sm font-medium text-brand-dark/80">
              {FOOTER_LEGAL_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={isEn ? `${link.href}?lang=en` : link.href}
                    className="hover:text-brand-purple transition-colors inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright notice */}
        <div className="pt-6 sm:pt-8 text-center text-xs text-brand-muted">
          <p>{allRightsReserved}</p>
        </div>
      </Container>
    </footer>
  );
}
