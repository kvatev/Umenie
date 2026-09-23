import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { SITE_CONFIG } from "@/lib/constants";
import { SERVICES_DATA } from "@/lib/services-data";
import { ServiceCard } from "@/components/services/ServiceCard";
import { KidsGallery } from "@/components/home/KidsGallery";
import { ReviewsSection } from "@/components/home/ReviewsSection";
import { ScheduleBanner } from "@/components/home/ScheduleBanner";
import { Metadata } from "next";
import { supabaseAdmin } from "@/lib/supabase/server";

export const revalidate = 60; // revalidate on demand or every 60s

export const metadata: Metadata = {
  title: "Образователен клуб „УМеНИе“ – Начало | Бургас",
  description:
    "Образователен клуб „УМеНИе“ в гр. Бургас, к-с Славейков. Уроци и курсове по английски, математика, български език, учебна занималня, шах, плетиво и арт занимания за успешни деца.",
  alternates: {
    canonical: "https://www.umenie.net",
  },
  openGraph: {
    title: "Образователен клуб „УМеНИе“ – Начало | Бургас",
    description:
      "Образователен клуб „УМеНИе“ в гр. Бургас, к-с Славейков. Уроци и курсове по английски, математика, български език, учебна занималня, шах, плетиво и арт занимания за успешни деца.",
    url: "https://www.umenie.net",
    siteName: "Образователен клуб „УМеНИе“",
    locale: "bg_BG",
    type: "website",
    images: [
      {
        url: "https://www.umenie.net/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Образователен клуб „УМеНИе“ Бургас",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Образователен клуб „УМеНИе“ – Начало | Бургас",
    description:
      "Уроци, курсове, учебна занималня, шах, плетиво и арт занимания за успешни деца в гр. Бургас, ж.к. Славейков.",
    images: ["https://www.umenie.net/og-image.jpg"],
  },
};

export default async function HomePage() {
  let heroBannerSrc = "/images/opening-photo.webp";

  try {
    const { data: files } = await supabaseAdmin.storage
      .from("site-assets")
      .list("", { search: "hero-banner" });

    if (files && files.some((f) => f.name === "hero-banner.webp")) {
      const { data: urlData } = supabaseAdmin.storage
        .from("site-assets")
        .getPublicUrl("hero-banner.webp");

      if (urlData?.publicUrl) {
        heroBannerSrc = urlData.publicUrl;
      }
    }
  } catch (err) {
    console.warn("Storage banner check warning:", err);
  }

  return (
    <div className="w-full">
      {/* 1. Hero Section */}
      <section className="relative w-full h-[400px] sm:h-[500px] lg:h-[580px] overflow-hidden flex items-center justify-center">
        {/* Background Banner Image */}
        <Image
          src={heroBannerSrc}
          alt="Деца в образователен клуб УМеНИе"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        {/* Soft dark overlay for crisp text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/40 to-transparent" />

        <Container size="xl" className="relative z-10">
          <div className="max-w-xl text-white space-y-6">
            <h1 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl leading-tight tracking-wide drop-shadow-md">
              УРОЦИ, КУРСОВЕ И ЗАНИМАНИЯ ЗА УСПЕШНИ ДЕЦА
            </h1>
            <p className="text-base sm:text-lg text-white/95 font-medium drop-shadow-sm">
              Място, където всяко дете развива увереност, самостоятелност и радост от знанието.
            </p>
            <div>
              <Link href="#activities">
                <Button size="lg" className="shadow-2xl text-base tracking-wider">
                  НАУЧЕТЕ ПОВЕЧЕ
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* 2. Intro Section */}
      <section className="py-16 md:py-24 relative overflow-hidden bg-brand-bg">
        {/* Decorative light bulbs from assets */}
        <div className="absolute -left-8 top-8 w-28 h-28 sm:w-44 sm:h-44 opacity-35 pointer-events-none -rotate-12">
          <Image
            src="/images/bulb.webp"
            alt=""
            fill
            className="object-contain"
          />
        </div>
        <div className="absolute -right-8 top-12 w-28 h-28 sm:w-44 sm:h-44 opacity-35 pointer-events-none rotate-12">
          <Image
            src="/images/bulb.webp"
            alt=""
            fill
            className="object-contain"
          />
        </div>

        <Container size="md" className="relative z-10 text-center space-y-8">
          <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl text-brand-dark leading-snug font-bold">
            В образователен клуб „УМеНИе“ децата{" "}
            <span className="text-brand-purple">растат с едно умение</span> повече
            всеки ден.
          </h2>

          <div className="space-y-5 text-base sm:text-lg text-brand-dark/90 leading-relaxed font-normal max-w-2xl mx-auto">
            <p>
              Английски, български, математика, шах, плетиво и учебна занималня.
              Различни занимания с една обща цел – детето да вземе от всяко от тях
              нещо, което остава и след края на часа.
            </p>
            <p>
              В <strong className="text-brand-purple font-bold">малки групи</strong> и с{" "}
              <strong className="text-brand-purple font-bold">внимание към всяко дете</strong>{" "}
              превръщаме различните занимания в начин то да се учи да мисли
              самостоятелно, да довършва започнатото, да намира решение и да
              работи с другите.
            </p>
          </div>
        </Container>
      </section>

      {/* 3. 6 Main Activities Section */}
      <section id="activities" className="py-12 sm:py-16 bg-brand-bg scroll-mt-24">
        <Container size="xl">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <h2 className="font-heading font-bold text-3xl sm:text-4xl text-brand-purple tracking-wide uppercase">
              ОСНОВНИ ЗАНИМАНИЯ
            </h2>
            <p className="text-brand-muted text-sm sm:text-base mt-2">
              Изберете направление, за да научите повече за програмата и записването.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
            {SERVICES_DATA.map((service) => (
              <ServiceCard
                key={service.slug}
                service={service}
                variant="home"
              />
            ))}
          </div>
        </Container>
      </section>

      {/* 4. Quick Contact Banner 1 (Mid-page) with Cloud Element */}
      <section className="relative w-full my-6 sm:my-10 px-4 sm:px-6">
        <div className="relative max-w-6xl mx-auto py-8 sm:py-12 px-6 sm:px-12 flex items-center justify-center">
          {/* Cloud Graphic Background */}
          <div className="absolute inset-0 w-full h-full pointer-events-none -z-10">
            <Image
              src="/images/cloud.webp"
              alt="Облак фон"
              fill
              priority
              className="object-fill drop-shadow-sm"
            />
          </div>

          <div className="w-full flex flex-col md:flex-row items-center justify-around gap-8 text-center md:text-left z-10">
            <a
              href={`tel:${SITE_CONFIG.phoneRaw}`}
              className="flex items-center gap-4 group p-3 rounded-2xl hover:bg-white/50 transition-all"
            >
              <div className="relative w-14 h-14 sm:w-16 sm:h-16 shrink-0 transform group-hover:scale-105 transition-transform">
                <Image
                  src="/images/phone.webp"
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
                  src="/images/location.webp"
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
      </section>

      {/* 5. Reviews & Why Choose Us Section */}
      <ReviewsSection />

      {/* 6. Schedule Banner (Solid Purple) */}
      <ScheduleBanner />

      {/* 7. Gallery: НАШИТЕ ДЕЦА С УМЕНИЯ */}
      <section className="py-16 sm:py-24 bg-brand-bg">
        <Container size="xl">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="font-heading font-bold text-3xl sm:text-4xl text-brand-purple tracking-wide uppercase">
              НАШИТЕ ДЕЦА С УМЕНИЯ
            </h2>
            <p className="text-brand-muted text-sm sm:text-base mt-2">
              Моменти от ежедневието, творчеството и постиженията в клуба.
            </p>
          </div>

          <KidsGallery />
        </Container>
      </section>
    </div>
  );
}
