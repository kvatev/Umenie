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
import { QuickContactBanner } from "@/components/common/QuickContactBanner";
import { Metadata } from "next";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { getSiteSettings } from "@/lib/site-settings";

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
  const settings = await getSiteSettings();
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
      <section className="relative w-full h-[360px] xs:h-[400px] sm:h-[500px] lg:h-[580px] overflow-hidden flex items-center justify-center">
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
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/45 to-black/20" />

        <Container size="xl" className="relative z-10">
          <div className="max-w-xl text-white space-y-4 sm:space-y-6">
            <h1 className="font-heading font-bold text-2xl xs:text-3xl sm:text-4xl lg:text-5xl leading-tight tracking-wide drop-shadow-md">
              УРОЦИ, КУРСОВЕ И ЗАНИМАНИЯ ЗА УСПЕШНИ ДЕЦА
            </h1>
            <div className="pt-2">
              <Link href="#activities">
                <Button
                  size="lg"
                  isPill={false}
                  className="shadow-2xl text-lg sm:text-2xl font-bold tracking-widest px-10 sm:px-14 py-4 sm:py-5 rounded-2xl"
                >
                  НАУЧЕТЕ ПОВЕЧЕ
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* 2. Intro Section with Decorative Bulbs */}
      <section className="py-10 sm:py-16 md:py-24 relative overflow-hidden bg-brand-bg">
        {/* Chaotic scattered bulbs with bleach/glow effect */}

        {/* Big - top-left, tilted hard, partially off-screen */}
        <div className="absolute pointer-events-none" style={{left:"-2%",top:"3%",width:"155px",height:"155px",opacity:0.55,transform:"rotate(-28deg)",filter:"brightness(1.5) saturate(0.65) blur(0.3px)"}}>
          <Image src="/images/bulb.webp" alt="" fill className="object-contain" />
        </div>

        {/* Small - upper-right, off-angle */}
        <div className="absolute pointer-events-none" style={{right:"5%",top:"7%",width:"72px",height:"72px",opacity:0.38,transform:"rotate(20deg)",filter:"brightness(1.7) saturate(0.55) blur(0.2px)"}}>
          <Image src="/images/bulb.webp" alt="" fill className="object-contain" />
        </div>

        {/* Medium - far right upper-middle, desktop only */}
        <div className="absolute pointer-events-none hidden sm:block" style={{right:"-3%",top:"26%",width:"118px",height:"118px",opacity:0.32,transform:"rotate(40deg)",filter:"brightness(1.55) saturate(0.6)"}}>
          <Image src="/images/bulb.webp" alt="" fill className="object-contain" />
        </div>

        {/* Tiny - left side, mid-low */}
        <div className="absolute pointer-events-none" style={{left:"8%",top:"58%",width:"52px",height:"52px",opacity:0.28,transform:"rotate(-10deg)",filter:"brightness(1.8) saturate(0.5) blur(0.5px)"}}>
          <Image src="/images/bulb.webp" alt="" fill className="object-contain" />
        </div>

        {/* Large - bottom-right, strongly bleached, partially off */}
        <div className="absolute pointer-events-none" style={{right:"-5%",bottom:"-2%",width:"175px",height:"175px",opacity:0.42,transform:"rotate(25deg)",filter:"brightness(1.6) saturate(0.58)"}}>
          <Image src="/images/bulb.webp" alt="" fill className="object-contain" />
        </div>

        {/* Extra small - top-center-right, desktop only */}
        <div className="absolute pointer-events-none hidden sm:block" style={{left:"61%",top:"6%",width:"44px",height:"44px",opacity:0.22,transform:"rotate(-18deg)",filter:"brightness(1.9) saturate(0.45) blur(0.4px)"}}>
          <Image src="/images/bulb.webp" alt="" fill className="object-contain" />
        </div>

        {/* Medium-small - bottom-left area, tilted */}
        <div className="absolute pointer-events-none" style={{left:"16%",bottom:"4%",width:"88px",height:"88px",opacity:0.26,transform:"rotate(14deg)",filter:"brightness(1.65) saturate(0.52) blur(0.3px)"}}>
          <Image src="/images/bulb.webp" alt="" fill className="object-contain" />
        </div>

        {/* Small - far left middle, desktop only */}
        <div className="absolute pointer-events-none hidden md:block" style={{left:"1%",top:"44%",width:"65px",height:"65px",opacity:0.2,transform:"rotate(-35deg)",filter:"brightness(1.7) saturate(0.5)"}}>
          <Image src="/images/bulb.webp" alt="" fill className="object-contain" />
        </div>

        <Container size="lg" className="relative z-10 text-center space-y-5 sm:space-y-8">
          <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl text-brand-dark leading-snug font-bold">
            В образователен клуб „УМеНИе“ децата{" "}
            <span className="text-brand-purple">растат с едно умение</span> повече
            всеки ден.
          </h2>

          <div className="space-y-4 sm:space-y-5 text-base sm:text-xl text-brand-dark/90 leading-relaxed font-normal max-w-2xl mx-auto">
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

      {/* 3. 6 Main Activities Section (2 columns on mobile matching mockup Image 1) */}
      <section id="activities" className="pb-10 pt-2 sm:py-16 bg-brand-bg scroll-mt-24">
        <Container size="xl">
          <div className="hidden sm:block text-center max-w-2xl mx-auto mb-10 sm:mb-14">
            <h2 className="font-heading font-bold text-3xl sm:text-4xl text-brand-purple tracking-wide uppercase">
              ОСНОВНИ ЗАНИМАНИЯ
            </h2>
            <p className="text-brand-muted text-sm sm:text-base mt-2">
              Изберете направление, за да научите повече за програмата и записването.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 xs:gap-4 sm:gap-8 lg:gap-10">
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

      {/* 4. Quick Contact Banner with Organic Waves (2 columns on mobile matching mockup Image 1) */}
      <QuickContactBanner />

      {/* 5. Reviews & Why Choose Us Section (matching mockup Image 2) */}
      <ReviewsSection />

      {/* 6. Schedule Banner (Solid Purple with Arrow & Visualized Schedule matching mockup Image 2) */}
      <ScheduleBanner />

      {/* 7. Gallery: НАШИТЕ ДЕЦА С УМЕНИЯ (matching mockup Image 2) */}
      <section className="py-12 sm:py-20 bg-brand-bg">
        <Container size="xl">
          <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-10">
            <h2 className="font-heading font-bold text-2xl sm:text-4xl text-brand-purple tracking-wide uppercase">
              НАШИТЕ ДЕЦА С УМЕНИЯ
            </h2>
            <p className="text-brand-muted text-xs sm:text-base mt-1.5 sm:mt-2">
              Моменти от ежедневието, творчеството и постиженията в клуба.
            </p>
          </div>

          <KidsGallery />
        </Container>
      </section>
    </div>
  );
}
