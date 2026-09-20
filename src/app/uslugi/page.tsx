import React from "react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { SERVICES_DATA } from "@/lib/services-data";
import { ServiceCard } from "@/components/services/ServiceCard";
import { SITE_CONFIG } from "@/lib/constants";
import { Calendar } from "lucide-react";

export const metadata: Metadata = {
  title: "Услуги и занимания за деца | Образователен клуб УМеНИе Бургас",
  description:
    "Уроци, курсове и занимания за деца в гр. Бургас, к-с Славейков: Плетиво, Учебна занималня, Уроци и курсове (БЕЛ, математика, английски), Арт занимания, Читателски клуб и Шах.",
  alternates: {
    canonical: "https://www.umenie.net/uslugi",
  },
  openGraph: {
    title: "Услуги и занимания за деца | Образователен клуб УМеНИе Бургас",
    description:
      "Уроци, курсове, учебна занималня, шах, плетиво и творчески ателиета за деца в Бургас.",
    url: "https://www.umenie.net/uslugi",
  },
};

export default function ServicesPage() {
  return (
    <div className="w-full bg-brand-bg py-12 sm:py-16">
      <Container size="xl">
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-12 sm:mb-16 relative">
          <div className="flex items-center justify-center gap-3">
            <h1 className="font-heading font-bold text-4xl sm:text-5xl lg:text-6xl text-brand-purple tracking-wide">
              УСЛУГИ
            </h1>
            <div className="relative w-12 h-12 sm:w-16 sm:h-16">
              <Image
                src="/images/bulb.png"
                alt=""
                fill
                className="object-contain"
              />
            </div>
          </div>
          <p className="text-brand-dark text-base sm:text-xl font-medium">
            Изберете занимание, за да научите повече.
          </p>
        </div>

        {/* Interactive 6-Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
          {SERVICES_DATA.map((service) => (
            <ServiceCard
              key={service.slug}
              service={service}
              variant="interactive"
            />
          ))}
        </div>

        {/* Action Button to Schedule */}
        <div className="text-center mt-12 sm:mt-16">
          <Link href="/grafik">
            <Button size="lg" className="text-base sm:text-lg shadow-xl px-10 py-4">
              <Calendar className="w-5 h-5 mr-2" />
              ВИЖТЕ ГРАФИКА
            </Button>
          </Link>
        </div>

        {/* Quick Contact Banner */}
        <div className="w-full bg-[#e9e7f8] py-8 sm:py-12 px-6 rounded-3xl border border-brand-purple/20 mt-16 sm:mt-24">
          <div className="flex flex-col md:flex-row items-center justify-around gap-8 text-center md:text-left">
            <a
              href={`tel:${SITE_CONFIG.phoneRaw}`}
              className="flex items-center gap-4 group p-3 rounded-2xl hover:bg-white/50 transition-all"
            >
              <div className="relative w-14 h-14 sm:w-16 sm:h-16 shrink-0 transform group-hover:scale-105 transition-transform">
                <Image
                  src="/images/phone.png"
                  alt="Телефон"
                  fill
                  className="object-contain"
                />
              </div>
              <div className="text-left">
                <p className="text-xs sm:text-sm font-heading font-bold text-brand-dark tracking-wide uppercase">
                  ИМАТЕ ВЪПРОСИ? ОБАДЕТЕ НИ СЕ!
                </p>
                <p className="font-heading font-bold text-2xl sm:text-3xl text-brand-purple">
                  {SITE_CONFIG.phoneDisplay}
                </p>
              </div>
            </a>

            <a
              href={SITE_CONFIG.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 group p-3 rounded-2xl hover:bg-white/50 transition-all"
            >
              <div className="relative w-14 h-14 sm:w-16 sm:h-16 shrink-0 transform group-hover:scale-105 transition-transform">
                <Image
                  src="/images/location.png"
                  alt="Локация"
                  fill
                  className="object-contain"
                />
              </div>
              <div className="text-left">
                <p className="text-xs sm:text-sm font-heading font-bold text-brand-dark tracking-wide uppercase">
                  КЪДЕ?
                </p>
                <p className="font-heading font-bold text-lg sm:text-xl text-brand-purple uppercase">
                  {SITE_CONFIG.locationShort}
                </p>
              </div>
            </a>
          </div>
        </div>
      </Container>
    </div>
  );
}
