import React from "react";
import { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { ParentReviewsCarousel } from "@/components/about/ParentReviewsCarousel";
import { QuickContactBanner } from "@/components/common/QuickContactBanner";
import { getSiteSettings } from "@/lib/site-settings";
import { listReviewsImagesAction } from "@/actions/admin-media";

export const revalidate = 60; // revalidate on demand or every 60s

export const metadata: Metadata = {
  title: "За нас – Образователен клуб „УМеНИе“ | Бургас",
  description:
    "Запознайте се с мисията, средата и ценностите в образователен клуб „УМеНИе“ Бургас – учене без екрани, индивидуално внимание, развитие на житейски умения и доверие с родителите.",
  alternates: {
    canonical: "https://www.umenie.net/za-nas",
  },
  openGraph: {
    title: "За нас – Образователен клуб „УМеНИе“ | Бургас",
    description:
      "Учене чрез преживяване, малки групи и подкрепяща среда за всяко дете в ж.к. Славейков, Бургас.",
    url: "https://www.umenie.net/za-nas",
    siteName: "Образователен клуб „УМеНИе“",
    locale: "bg_BG",
    type: "website",
    images: [
      {
        url: "https://www.umenie.net/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "За образователен клуб „УМеНИе“ Бургас",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "За нас – Образователен клуб „УМеНИе“ | Бургас",
    description:
      "Учене чрез преживяване, малки групи и подкрепяща среда за всяко дете в ж.к. Славейков, Бургас.",
    images: ["https://www.umenie.net/og-image.jpg"],
  },
};

export default async function AboutPage() {
  const settings = await getSiteSettings();
  const reviewsRes = await listReviewsImagesAction();

  return (
    <div className="w-full bg-[#f1f2f6] text-brand-dark overflow-x-hidden">
      {/* 1. SECTION: ЗАЩО ДА ИЗБЕРЕТЕ УМЕНИЕ? (matching mockups 1:1) */}
      <section className="pt-10 sm:pt-16 pb-12 sm:pb-20 relative overflow-hidden">
        {/* Large Decorative Lightbulb on Desktop Top-Left */}
        <div
          className="absolute pointer-events-none hidden md:block"
          style={{
            left: "2%",
            top: "2%",
            width: "150px",
            height: "150px",
            opacity: 0.85,
            transform: "rotate(-18deg)",
            filter: "brightness(1.1)",
          }}
        >
          <Image src="/images/bulb.webp" alt="" fill className="object-contain" />
        </div>

        {/* Floating Bulb for Mobile Top */}
        <div
          className="absolute pointer-events-none md:hidden"
          style={{
            left: "-4%",
            top: "1%",
            width: "85px",
            height: "85px",
            opacity: 0.85,
            transform: "rotate(-15deg)",
          }}
        >
          <Image src="/images/bulb.webp" alt="" fill className="object-contain" />
        </div>

        <Container size="xl" className="relative z-10">
          {/* Header Title */}
          <div className="text-center max-w-4xl mx-auto mb-10 sm:mb-16 px-4">
            <h1 className="font-heading font-bold text-3xl sm:text-5xl lg:text-6xl text-brand-purple tracking-wide uppercase leading-tight">
              <span className="block md:inline">ЗАЩО ДА </span>
              <span className="block md:inline">ИЗБЕРЕТЕ УМЕНИЕ?</span>
            </h1>
          </div>

          {/* 3 Core Value Items (Desktop: 3 columns side-by-side, Mobile: stacked with decorative bulbs) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 relative max-w-6xl mx-auto px-4">
            {/* Item 1 */}
            <div className="relative group space-y-3">
              <h2 className="font-heading font-bold text-xl sm:text-2xl text-brand-purple uppercase tracking-wide leading-snug">
                УМЕНИЯ ОТВЪД УРОЦИТЕ
              </h2>
              <p className="text-brand-dark/90 text-sm sm:text-base leading-relaxed font-sans font-normal">
                Децата развиват умения отвъд уроците, които ще носят цял живот – увереност,
                отговорност, работа в екип и критично мислене.
              </p>

              {/* Mobile Decorative Bulb next to Item 1 */}
              <div
                className="absolute pointer-events-none md:hidden"
                style={{
                  right: "-2%",
                  top: "10%",
                  width: "75px",
                  height: "75px",
                  opacity: 0.8,
                  transform: "rotate(20deg)",
                }}
              >
                <Image src="/images/bulb.webp" alt="" fill className="object-contain" />
              </div>
            </div>

            {/* Item 2 */}
            <div className="relative group space-y-3">
              <h2 className="font-heading font-bold text-xl sm:text-2xl text-brand-purple uppercase tracking-wide leading-snug">
                СРЕДА, БЛИЗКА ДО ДОМА
              </h2>
              <p className="text-brand-dark/90 text-sm sm:text-base leading-relaxed font-sans font-normal">
                Място, където всяко дете се чувства прието и спокойно да бъде себе си, а
                уважението, добротата и отношението към другите са част от всеки ден.
              </p>
            </div>

            {/* Item 3 (with decorative bulb floating above/beside) */}
            <div className="relative group space-y-3">
              {/* Desktop Decorative Bulb above Column 3 */}
              <div
                className="absolute pointer-events-none hidden md:block"
                style={{
                  left: "-18%",
                  top: "-42px",
                  width: "80px",
                  height: "80px",
                  opacity: 0.85,
                  transform: "rotate(16deg)",
                }}
              >
                <Image src="/images/bulb.webp" alt="" fill className="object-contain" />
              </div>

              {/* Mobile Decorative Bulb next to Item 3 */}
              <div
                className="absolute pointer-events-none md:hidden"
                style={{
                  right: "-2%",
                  top: "12%",
                  width: "75px",
                  height: "75px",
                  opacity: 0.8,
                  transform: "rotate(22deg)",
                }}
              >
                <Image src="/images/bulb.webp" alt="" fill className="object-contain" />
              </div>

              <h2 className="font-heading font-bold text-xl sm:text-2xl text-brand-purple uppercase tracking-wide leading-snug">
                ИНДИВИДУАЛЕН ПОДХОД
              </h2>
              <p className="text-brand-dark/90 text-sm sm:text-base leading-relaxed font-sans font-normal">
                В малки групи всяко дете получава лично внимание и подкрепа, защото започваме от
                неговото ниво и го издигаме нагоре.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* 2. SECTION: ЕТО КАКВО КАЗВАТ РОДИТЕЛИТЕ (Solid Purple Section matching mockup 1:1) */}
      <section className="w-full bg-[#887ed8] py-14 sm:py-20 text-white relative overflow-hidden">
        {/* Soft decorative cloud accents in background */}
        <div className="absolute top-3 left-8 w-28 h-16 opacity-15 pointer-events-none">
          <Image src="/images/cloud.webp" alt="" fill className="object-contain" />
        </div>
        <div className="absolute bottom-4 right-10 w-36 h-20 opacity-15 pointer-events-none">
          <Image src="/images/cloud.webp" alt="" fill className="object-contain" />
        </div>

        <Container size="xl" className="relative z-10 space-y-6 sm:space-y-10">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="font-heading font-bold text-2xl sm:text-4xl lg:text-5xl text-white tracking-wide uppercase">
              ЕТО КАКВО КАЗВАТ РОДИТЕЛИТЕ
            </h2>
          </div>

          {/* Social Reviews & Screenshot Carousel */}
          <ParentReviewsCarousel
            screenshotUrl={settings.reviewScreenshotUrl || "/images/review-screenshot.webp"}
            reviewImages={reviewsRes.items || []}
          />
        </Container>
      </section>

      {/* 3. SECTION: И ОЩЕ НЕЩО ВАЖНО (matching mockup 1:1) */}
      <section className="py-14 sm:py-24 relative overflow-hidden">
        <Container size="xl" className="relative z-10">
          {/* Header Title with decorative bulbs */}
          <div className="relative text-center max-w-3xl mx-auto mb-10 sm:mb-16 px-4">
            {/* Left Decorative Bulb */}
            <div
              className="absolute pointer-events-none hidden sm:block"
              style={{
                left: "-5%",
                top: "-15px",
                width: "90px",
                height: "90px",
                opacity: 0.85,
                transform: "rotate(-18deg)",
              }}
            >
              <Image src="/images/bulb.webp" alt="" fill className="object-contain" />
            </div>

            <h2 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl text-[#2b3a67] tracking-tight uppercase leading-snug">
              И ОЩЕ НЕЩО ВАЖНО
            </h2>

            {/* Right Decorative Bulb */}
            <div
              className="absolute pointer-events-none hidden sm:block"
              style={{
                right: "-6%",
                top: "-25px",
                width: "115px",
                height: "115px",
                opacity: 0.88,
                transform: "rotate(24deg)",
              }}
            >
              <Image src="/images/bulb.webp" alt="" fill className="object-contain" />
            </div>
          </div>

          {/* 3 Secondary Features (Desktop: 3 columns side-by-side, Mobile: stacked vertically) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 relative max-w-6xl mx-auto px-4">
            {/* Feature 1 */}
            <div className="space-y-3">
              <h3 className="font-heading font-bold text-xl sm:text-2xl text-[#2b3a67] uppercase tracking-wide leading-snug">
                БЕЗ ЕКРАНИ
              </h3>
              <p className="text-brand-dark/90 text-sm sm:text-base leading-relaxed font-sans font-normal">
                Екраните остават настрана, за да има място за знание, мечти и истински
                приятелства.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="space-y-3">
              <h3 className="font-heading font-bold text-xl sm:text-2xl text-[#2b3a67] uppercase tracking-wide leading-snug">
                УЧЕНЕ ЧРЕЗ ПРАКТИКА
              </h3>
              <p className="text-brand-dark/90 text-sm sm:text-base leading-relaxed font-sans font-normal">
                Знанията влизат в действие чрез задачи, игри и практика, вместо да остават само
                на хартия.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="space-y-3 relative">
              <h3 className="font-heading font-bold text-xl sm:text-2xl text-[#2b3a67] uppercase tracking-wide leading-snug">
                РОДИТЕЛЯТ Е ЧАСТ ОТ ПРОЦЕСА
              </h3>
              <p className="text-brand-dark/90 text-sm sm:text-base leading-relaxed font-sans font-normal">
                Регулярната обратна връзка ви държи близо до напредъка, интересите и нуждите на
                детето.
              </p>

              {/* Mobile Decorative Bulb bottom-left of item 3 */}
              <div
                className="absolute pointer-events-none md:hidden"
                style={{
                  left: "-4%",
                  bottom: "-65px",
                  width: "80px",
                  height: "80px",
                  opacity: 0.8,
                  transform: "rotate(-12deg)",
                }}
              >
                <Image src="/images/bulb.webp" alt="" fill className="object-contain" />
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 4. QUICK INFO CONTACT PILL / BANNER (matching mockups 1:1) */}
      <QuickContactBanner className="mt-4" />
    </div>
  );
}
