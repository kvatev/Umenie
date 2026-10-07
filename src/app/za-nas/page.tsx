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

  const values = settings.aboutValues && settings.aboutValues.length >= 3 ? settings.aboutValues : [
    {
      title: "УМЕНИЯ ОТВЪД УРОЦИТЕ",
      text: "Децата развиват умения отвъд уроците, които ще носят цял живот – увереност, отговорност, работа в екип и критично мислене.",
    },
    {
      title: "СРЕДА, БЛИЗКА ДО ДОМА",
      text: "Място, където всяко дете се чувства прието и спокойно да бъде себе си, а уважението, добротата и отношението към другите са част от всеки ден.",
    },
    {
      title: "ИНДИВИДУАЛЕН ПОДХОД",
      text: "В малки групи всяко дете получава лично внимание и подкрепа, защото започваме от неговото ниво и го издигаме нагоре.",
    },
  ];

  const features = settings.aboutFeatures && settings.aboutFeatures.length >= 3 ? settings.aboutFeatures : [
    {
      title: "БЕЗ ЕКРАНИ",
      text: "Екраните остават настрана, за да има място за знание, мечти и истински приятелства.",
    },
    {
      title: "УЧЕНЕ ЧРЕЗ ПРАКТИКА",
      text: "Знанията влизат в действие чрез задачи, игри и практика, вместо да остават само на хартия.",
    },
    {
      title: "РОДИТЕЛЯТ Е ЧАСТ ОТ ПРОЦЕСА",
      text: "Регулярната обратна връзка ви държи близо до напредъка, интересите и нуждите на детето.",
    },
  ];

  return (
    <div className="w-full bg-[#f1f2f6] text-brand-dark overflow-x-hidden">
      {/* 1. SECTION: ЗАЩО ДА ИЗБЕРЕТЕ УМЕНИЕ? */}
      <section className="pt-28 sm:pt-36 pb-14 sm:pb-20 relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
          {/* Header Title with Desktop Bulb 1 */}
          <div className="relative text-center mb-12 sm:mb-16">
            {/* Desktop Bulb 1 (Large, tilted up-left): Positioned absolute to the top-left of the main title */}
            <div className="hidden md:block absolute -top-8 lg:-top-10 left-2 lg:left-6 w-24 h-24 lg:w-32 lg:h-32 -rotate-12 pointer-events-none select-none z-0">
              <Image src="/images/bulb.webp" alt="" fill className="object-contain" priority />
            </div>

            <h1 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl text-[#887ed8] uppercase leading-tight tracking-wide">
              ЗАЩО ДА ИЗБЕРЕТЕ УМЕНИЕ?
            </h1>
          </div>

          {/* Features Container: 3-column horizontal grid on desktop, vertical stack on mobile */}
          <div className="relative">
            {/* Desktop Bulb 2 (Medium, tilted up-right): Floating gently between Col 2 and Col 3 above the text */}
            <div className="hidden md:block absolute -top-14 lg:-top-16 right-[31%] lg:right-[32%] w-20 h-20 lg:w-24 lg:h-24 rotate-12 pointer-events-none select-none z-0">
              <Image src="/images/bulb.webp" alt="" fill className="object-contain" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
              {/* Feature 1 */}
              <div className="relative space-y-2">
                <div className="pr-20 sm:pr-24 md:pr-0 space-y-2">
                  <h2 className="font-heading font-bold text-xl sm:text-2xl text-brand-purple uppercase tracking-wide leading-snug">
                    {values[0].title}
                  </h2>
                  <p className="text-slate-800 text-sm sm:text-base leading-relaxed font-sans font-normal">
                    {values[0].text}
                  </p>
                </div>
                {/* Mobile Bulb 1: Floating on the right side next to the text */}
                <div className="md:hidden absolute right-0 top-1/2 -translate-y-1/2 w-20 h-20 sm:w-24 sm:h-24 pointer-events-none select-none z-0 rotate-12">
                  <Image src="/images/bulb.webp" alt="" fill className="object-contain" />
                </div>
              </div>

              {/* Feature 2 */}
              <div className="space-y-2">
                <h2 className="font-heading font-bold text-xl sm:text-2xl text-brand-purple uppercase tracking-wide leading-snug">
                  {values[1].title}
                </h2>
                <p className="text-slate-800 text-sm sm:text-base leading-relaxed font-sans font-normal">
                  {values[1].text}
                </p>
              </div>

              {/* Feature 3 */}
              <div className="relative space-y-2">
                <div className="pr-20 sm:pr-24 md:pr-0 space-y-2">
                  <h2 className="font-heading font-bold text-xl sm:text-2xl text-brand-purple uppercase tracking-wide leading-snug">
                    {values[2].title}
                  </h2>
                  <p className="text-slate-800 text-sm sm:text-base leading-relaxed font-sans font-normal">
                    {values[2].text}
                  </p>
                </div>
                {/* Mobile Bulb 2: Floating on the right side next to the text */}
                <div className="md:hidden absolute right-0 top-1/2 -translate-y-1/2 w-20 h-20 sm:w-24 sm:h-24 pointer-events-none select-none z-0 rotate-12">
                  <Image src="/images/bulb.webp" alt="" fill className="object-contain" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SECTION: ЕТО КАКВО КАЗВАТ РОДИТЕЛИТЕ (Solid Purple Section matching mockup 1:1) */}
      <section className="w-full bg-[#887ed8] py-10 sm:py-14 text-white text-center relative overflow-hidden">
        <Container size="xl" className="relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-8">
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
          {/* Header Title Centered */}
          <div className="relative text-center max-w-3xl mx-auto mb-12 sm:mb-16 px-4">
            <h2 className="font-heading font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-[#2b3a67] tracking-tight uppercase leading-snug">
              И ОЩЕ НЕЩО ВАЖНО
            </h2>
          </div>

          {/* 3 Secondary Features: 3-column horizontal grid on desktop, vertical stack on mobile */}
          <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
            {/* Desktop Bulb 1: Floating on the left near Col 1 ("БЕЗ ЕКРАНИ") */}
            <div className="hidden md:block absolute -top-12 lg:-top-14 left-0 lg:-left-6 w-20 h-20 lg:w-24 lg:h-24 -rotate-12 pointer-events-none select-none z-0">
              <Image src="/images/bulb.webp" alt="" fill className="object-contain" />
            </div>

            {/* Desktop Bulb 2 (Large, tilted up-right): Floating on the right above/next to Col 3 ("РОДИТЕЛЯТ Е ЧАСТ ОТ ПРОЦЕСА") */}
            <div className="hidden md:block absolute -top-14 lg:-top-16 right-0 lg:-right-4 w-24 h-24 lg:w-32 lg:h-32 rotate-12 pointer-events-none select-none z-0">
              <Image src="/images/bulb.webp" alt="" fill className="object-contain" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
              {/* Feature 1 */}
              <div className="space-y-2">
                <h3 className="font-heading font-bold text-xl sm:text-2xl text-[#2b3a67] uppercase tracking-wide leading-snug">
                  {features[0].title}
                </h3>
                <p className="text-slate-800 text-sm sm:text-base leading-relaxed font-sans font-normal">
                  {features[0].text}
                </p>
              </div>

              {/* Feature 2 */}
              <div className="space-y-2">
                <h3 className="font-heading font-bold text-xl sm:text-2xl text-[#2b3a67] uppercase tracking-wide leading-snug">
                  {features[1].title}
                </h3>
                <p className="text-slate-800 text-sm sm:text-base leading-relaxed font-sans font-normal">
                  {features[1].text}
                </p>
              </div>

              {/* Feature 3 */}
              <div className="relative space-y-2">
                <div className="space-y-2">
                  <h3 className="font-heading font-bold text-xl sm:text-2xl text-[#2b3a67] uppercase tracking-wide leading-snug">
                    {features[2].title}
                  </h3>
                  <p className="text-slate-800 text-sm sm:text-base leading-relaxed font-sans font-normal">
                    {features[2].text}
                  </p>
                </div>
                {/* Mobile Bulb 3: Floating on the bottom-left below the text */}
                <div className="md:hidden mt-4 -ml-2 w-20 h-20 sm:w-24 sm:h-24 -rotate-12 pointer-events-none select-none z-0">
                  <Image src="/images/bulb.webp" alt="" fill className="object-contain" />
                </div>
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
