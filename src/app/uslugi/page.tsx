import React from "react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { SERVICES_DATA } from "@/lib/services-data";
import { ServiceCard } from "@/components/services/ServiceCard";
import { QuickContactBanner } from "@/components/common/QuickContactBanner";
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
    siteName: "Образователен клуб „УМеНИе“",
    locale: "bg_BG",
    type: "website",
    images: [
      {
        url: "https://www.umenie.net/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Услуги и дейности в образователен клуб „УМеНИе“ Бургас",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Услуги и занимания за деца | Образователен клуб УМеНИе Бургас",
    description:
      "Уроци, курсове, учебна занималня, шах, плетиво и творчески ателиета за деца в Бургас.",
    images: ["https://www.umenie.net/og-image.jpg"],
  },
};

export default function ServicesPage() {
  return (
    <div className="w-full bg-brand-bg pt-28 sm:pt-32 pb-12 sm:pb-16">
      <Container size="xl">
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-12 sm:mb-16 relative">
          <div className="flex items-center justify-center gap-3">
            <h1 className="font-heading font-bold text-4xl sm:text-5xl lg:text-6xl text-brand-purple tracking-wide">
              УСЛУГИ
            </h1>
            <div className="relative w-12 h-12 sm:w-16 sm:h-16">
              <Image
                src="/images/bulb.webp"
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
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 lg:gap-8 max-w-6xl mx-auto">
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
        <QuickContactBanner className="rounded-3xl border border-brand-purple/20 mt-16 sm:mt-24" />
      </Container>
    </div>
  );
}
