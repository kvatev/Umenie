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
      {/* 1. SECTION: ЗАЩО ДА ИЗБЕРЕТЕ УМЕНИЕ? */}
      <section className="pt-28 sm:pt-36 pb-12 sm:pb-20 relative overflow-hidden">
        {/* Soft, faint background watermarks on mobile (behind text, -z-10, never overlapping) */}
        <div
          className="absolute right-2 top-32 w-24 h-24 sm:w-32 sm:h-32 opacity-20 rotate-12 pointer-events-none select-none -z-10 lg:hidden"
        >
          <Image src="/images/bulb.webp" alt="" fill className="object-contain" />
        </div>
        <div
          className="absolute right-4 bottom-16 w-24 h-24 sm:w-32 sm:h-32 opacity-20 -rotate-12 pointer-events-none select-none -z-10 lg:hidden"
        >
          <Image src="/images/bulb.webp" alt="" fill className="object-contain" />
        </div>

        <div className="max-w-5xl mx-auto px-4 relative z-10">
          {/* Header Title */}
          <div className="mb-8 sm:mb-12">
            <h1 className="font-heading font-bold text-2xl sm:text-3xl md:text-4xl text-[#887ed8] uppercase leading-tight text-center lg:text-left">
              ЗАЩО ДА ИЗБЕРЕТЕ УМЕНИЕ?
            </h1>
          </div>

          {/* Two-column responsive layout on desktop */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative">
            {/* Left side (8 cols): The 3 text blocks with clean typography */}
            <div className="lg:col-span-8 space-y-6 sm:space-y-8">
              {/* Item 1 */}
              <div className="space-y-2">
                <h2 className="font-heading font-bold text-xl sm:text-2xl text-brand-purple uppercase tracking-wide leading-snug">
                  УМЕНИЯ ОТВЪД УРОЦИТЕ
                </h2>
                <p className="text-slate-800 text-sm sm:text-base leading-relaxed font-sans font-normal">
                  Децата развиват умения отвъд уроците, които ще носят цял живот – увереност,
                  отговорност, работа в екип и критично мислене.
                </p>
              </div>

              {/* Item 2 */}
              <div className="space-y-2">
                <h2 className="font-heading font-bold text-xl sm:text-2xl text-brand-purple uppercase tracking-wide leading-snug">
                  СРЕДА, БЛИЗКА ДО ДОМА
                </h2>
                <p className="text-slate-800 text-sm sm:text-base leading-relaxed font-sans font-normal">
                  Място, където всяко дете се чувства прието и спокойно да бъде себе си, а
                  уважението, добротата и отношението към другите са част от всеки ден.
                </p>
              </div>

              {/* Item 3 */}
              <div className="space-y-2">
                <h2 className="font-heading font-bold text-xl sm:text-2xl text-brand-purple uppercase tracking-wide leading-snug">
                  ИНДИВИДУАЛЕН ПОДХОД
                </h2>
                <p className="text-slate-800 text-sm sm:text-base leading-relaxed font-sans font-normal">
                  В малки групи всяко дете получава лично внимание и подкрепа, защото започваме от
                  неговото ниво и го издигаме нагоре.
                </p>
              </div>
            </div>

            {/* Right side (4 cols on desktop): Dedicated decorative visual space */}
            <div className="hidden lg:flex lg:col-span-4 relative flex-col items-center justify-center min-h-[380px] pointer-events-none select-none">
              {/* Bulb 1 (Near "УМЕНИЯ ОТВЪД УРОЦИТЕ"): Positioned to upper-right, tilted clockwise */}
              <div
                className="absolute top-2 right-4 w-36 h-36 lg:w-48 lg:h-48 opacity-20 sm:opacity-30 rotate-12 translate-x-2 -translate-y-4 pointer-events-none select-none -z-10"
              >
                <Image src="/images/bulb.webp" alt="" fill className="object-contain" />
              </div>

              {/* Bulb 2 (Near "ИНДИВИДУАЛЕН ПОДХОД"): Positioned to lower-right, tilted counter-clockwise */}
              <div
                className="absolute bottom-4 right-2 w-36 h-36 lg:w-48 lg:h-48 opacity-20 sm:opacity-30 -rotate-12 translate-x-4 translate-y-2 pointer-events-none select-none -z-10"
              >
                <Image src="/images/bulb.webp" alt="" fill className="object-contain" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SECTION: ЕТО КАКВО КАЗВАТ РОДИТЕЛИТЕ (Solid Purple Section matching mockup 1:1) */}
      <section className="w-full bg-[#887ed8] py-8 sm:py-12 md:py-14 text-white relative overflow-hidden">
        <Container size="xl" className="relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-4 sm:mb-6">
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

      {/* 3. SECTION: И ОЩЕ НЕЩО ВАЖНО */}
      <section className="py-14 sm:py-24 relative overflow-hidden">
        <Container size="xl" className="relative z-10">
          {/* Header Title */}
          <div className="relative text-center max-w-3xl mx-auto mb-10 sm:mb-16 px-4">
            <h2 className="font-heading font-bold text-2xl sm:text-3xl md:text-4xl text-[#2b3a67] tracking-tight uppercase leading-snug">
              И ОЩЕ НЕЩО ВАЖНО
            </h2>
          </div>

          {/* 3 Secondary Features (Desktop: 3 columns side-by-side, Mobile: stacked vertically) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 relative max-w-5xl mx-auto px-4">
            {/* Feature 1 */}
            <div className="space-y-3">
              <h3 className="font-heading font-bold text-xl sm:text-2xl text-[#2b3a67] uppercase tracking-wide leading-snug">
                БЕЗ ЕКРАНИ
              </h3>
              <p className="text-slate-800 text-sm sm:text-base leading-relaxed font-sans font-normal">
                Екраните остават настрана, за да има място за знание, мечти и истински
                приятелства.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="space-y-3">
              <h3 className="font-heading font-bold text-xl sm:text-2xl text-[#2b3a67] uppercase tracking-wide leading-snug">
                УЧЕНЕ ЧРЕЗ ПРАКТИКА
              </h3>
              <p className="text-slate-800 text-sm sm:text-base leading-relaxed font-sans font-normal">
                Знанията влизат в действие чрез задачи, игри и практика, вместо да остават само
                на хартия.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="space-y-3">
              <h3 className="font-heading font-bold text-xl sm:text-2xl text-[#2b3a67] uppercase tracking-wide leading-snug">
                РОДИТЕЛЯТ Е ЧАСТ ОТ ПРОЦЕСА
              </h3>
              <p className="text-slate-800 text-sm sm:text-base leading-relaxed font-sans font-normal">
                Регулярната обратна връзка ви държи близо до напредъка, интересите и нуждите на
                детето.
              </p>
            </div>
          </div>
        </Container>

        {/* Decorative bulb positioned subtly at the bottom corner with opacity-25 -z-10 rotate-6, completely clear of text */}
        <div
          className="absolute right-4 bottom-4 w-28 h-28 sm:w-36 sm:h-36 lg:w-44 lg:h-44 opacity-20 sm:opacity-25 -z-10 rotate-6 pointer-events-none select-none"
        >
          <Image src="/images/bulb.webp" alt="" fill className="object-contain" />
        </div>
      </section>

      {/* 4. QUICK INFO CONTACT PILL / BANNER (matching mockups 1:1) */}
      <QuickContactBanner className="mt-4" />
    </div>
  );
}
