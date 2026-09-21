import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Phone, MapPin, Mail } from "lucide-react";
import { SITE_CONFIG, FOOTER_LEGAL_LINKS } from "@/lib/constants";
import { Container } from "@/components/ui/Container";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#f1f2f6] border-t border-brand-purple/20 pt-12 pb-8 mt-auto">
      <Container size="xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-start pb-10 border-b border-brand-purple/15">
          {/* Column 1: Contacts */}
          <div className="space-y-4">
            <h3 className="font-heading font-bold text-xl md:text-2xl text-brand-purple tracking-wide">
              КОНТАКТИ
            </h3>
            <ul className="space-y-3.5 text-sm md:text-base font-medium text-brand-dark">
              <li>
                <a
                  href={`tel:${SITE_CONFIG.phoneRaw}`}
                  className="inline-flex items-center gap-3 hover:text-brand-purple transition-colors group"
                >
                  <span className="p-2 rounded-full bg-brand-purple/10 text-brand-purple group-hover:bg-brand-purple group-hover:text-white transition-colors">
                    <Phone className="w-4 h-4 shrink-0" />
                  </span>
                  <span className="font-semibold">{SITE_CONFIG.phoneFull}</span>
                </a>
              </li>
              <li>
                <a
                  href={SITE_CONFIG.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-start gap-3 hover:text-brand-purple transition-colors group"
                >
                  <span className="p-2 rounded-full bg-brand-purple/10 text-brand-purple group-hover:bg-brand-purple group-hover:text-white transition-colors mt-0.5">
                    <MapPin className="w-4 h-4 shrink-0" />
                  </span>
                  <span className="uppercase text-xs md:text-sm font-semibold leading-relaxed">
                    {SITE_CONFIG.locationFull}
                  </span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${SITE_CONFIG.email}`}
                  className="inline-flex items-center gap-3 hover:text-brand-purple transition-colors group"
                >
                  <span className="p-2 rounded-full bg-brand-purple/10 text-brand-purple group-hover:bg-brand-purple group-hover:text-white transition-colors">
                    <Mail className="w-4 h-4 shrink-0" />
                  </span>
                  <span className="uppercase text-xs md:text-sm font-semibold tracking-wide">
                    {SITE_CONFIG.email}
                  </span>
                </a>
              </li>
            </ul>
          </div>

          {/* Column 2: Socials & Brand Identity */}
          <div className="flex flex-col items-center justify-center text-center space-y-4 md:py-2">
            <Link href="/" className="relative block h-16 w-44">
              <Image
                src="/images/logo.webp"
                alt={SITE_CONFIG.name}
                fill
                className="object-contain"
                sizes="176px"
              />
            </Link>
            <p className="text-xs md:text-sm text-brand-muted max-w-xs font-medium">
              {SITE_CONFIG.tagline}
            </p>
            <div className="flex items-center gap-4 pt-2">
              <a
                href={SITE_CONFIG.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook страница на УМеНИе"
                className="relative w-12 h-12 rounded-full p-2.5 bg-brand-purple/10 text-brand-purple hover:bg-brand-purple hover:text-white transition-all transform hover:scale-110 shadow-sm"
              >
                <div className="relative w-full h-full">
                  <Image
                    src="/images/fb.webp"
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
                aria-label="Instagram профил на УМеНИе"
                className="relative w-12 h-12 rounded-full p-2.5 bg-brand-purple/10 text-brand-purple hover:bg-brand-purple hover:text-white transition-all transform hover:scale-110 shadow-sm"
              >
                <div className="relative w-full h-full">
                  <Image
                    src="/images/ig.webp"
                    alt="Instagram"
                    fill
                    className="object-contain"
                  />
                </div>
              </a>
            </div>
          </div>

          {/* Column 3: Quick / Legal Links */}
          <div className="space-y-4 md:text-right">
            <h3 className="font-heading font-bold text-xl md:text-2xl text-brand-purple tracking-wide">
              БЪРЗИ ВРЪЗКИ
            </h3>
            <ul className="space-y-2.5 text-xs md:text-sm font-semibold tracking-wide uppercase text-brand-dark">
              {FOOTER_LEGAL_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-brand-purple transition-colors inline-block py-1"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-brand-muted gap-3">
          <p>© {currentYear} Образователен клуб „УМеНИе“. Всички права запазени.</p>
          <p className="text-brand-muted/70">
            гр. Бургас, кв. Славейков
          </p>
        </div>
      </Container>
    </footer>
  );
}
