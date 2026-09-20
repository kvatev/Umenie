import React from "react";
import { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { ParentReviewsCarousel } from "@/components/about/ParentReviewsCarousel";
import { QuickContactBanner } from "@/components/common/QuickContactBanner";

export const metadata: Metadata = {
  title: "За нас – ценности и подход | Образователен клуб УМеНИе",
  description:
    "Запознайте се с мисията, средата и ценностите в образователен клуб „УМеНИе“ Бургас – учене без екрани, индивидуално внимание, развитие на житейски умения и доверие с родителите.",
  alternates: {
    canonical: "https://www.umenie.net/za-nas",
  },
  openGraph: {
    title: "За нас – ценности и подход | Образователен клуб УМеНИе",
    description:
      "Учене чрез преживяване, малки групи и подкрепяща среда за всяко дете в ж.к. Славейков, Бургас.",
    url: "https://www.umenie.net/za-nas",
  },
};

export default function AboutPage() {
  return (
    <div className="py-8 sm:py-14 space-y-16 sm:space-y-24">
      {/* 1. SECTION: ЗАЩО ДА ИЗБЕРЕТЕ УМЕНИЕ? */}
      <section className="relative">
        <Container size="xl">
          {/* Section Header with Bulb */}
          <div className="relative mb-12 sm:mb-16 text-center max-w-4xl mx-auto">
            {/* Decorative Bulb on Left */}
            <div className="absolute -top-10 -left-4 sm:left-4 w-14 h-14 sm:w-20 sm:h-20 opacity-90 transform -rotate-12 pointer-events-none hidden xs:block">
              <Image
                src="/images/bulb.png"
                alt="Идея"
                fill
                sizes="80px"
                className="object-contain"
              />
            </div>

            <h1 className="font-heading font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-brand-purple tracking-tight">
              ЗАЩО ДА ИЗБЕРЕТЕ УМЕНИЕ?
            </h1>
          </div>

          {/* 3 Core Columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 relative">
            {/* Column 1 */}
            <div className="bg-white/80 backdrop-blur-sm p-6 sm:p-8 rounded-3xl shadow-card hover:shadow-card-hover border border-brand-purple/15 transition-all duration-300 flex flex-col justify-start space-y-4 group">
              <h2 className="font-heading font-bold text-lg sm:text-xl text-brand-purple tracking-wide group-hover:text-brand-purple-hover transition-colors">
                УМЕНИЯ ОТВЪД УРОЦИТЕ
              </h2>
              <p className="text-brand-dark/85 text-sm sm:text-base leading-relaxed font-sans">
                Децата развиват умения отвъд уроците, които ще носят цял живот – увереност,
                отговорност, работа в екип и критично мислене.
              </p>
            </div>

            {/* Column 2 */}
            <div className="bg-white/80 backdrop-blur-sm p-6 sm:p-8 rounded-3xl shadow-card hover:shadow-card-hover border border-brand-purple/15 transition-all duration-300 flex flex-col justify-start space-y-4 group">
              <h2 className="font-heading font-bold text-lg sm:text-xl text-brand-purple tracking-wide group-hover:text-brand-purple-hover transition-colors">
                СРЕДА, БЛИЗКА ДО ДОМА
              </h2>
              <p className="text-brand-dark/85 text-sm sm:text-base leading-relaxed font-sans">
                Място, където всяко дете се чувства прието и спокойно да бъде себе си, а
                уважението, добротата и отношението към другите са част от всеки ден.
              </p>
            </div>

            {/* Column 3 (with small bulb accent) */}
            <div className="relative bg-white/80 backdrop-blur-sm p-6 sm:p-8 rounded-3xl shadow-card hover:shadow-card-hover border border-brand-purple/15 transition-all duration-300 flex flex-col justify-start space-y-4 group">
              {/* Decorative bulb top-right */}
              <div className="absolute -top-6 -right-3 w-10 h-10 sm:w-12 sm:h-12 pointer-events-none transform rotate-12">
                <Image
                  src="/images/bulb.png"
                  alt="Идея"
                  fill
                  sizes="48px"
                  className="object-contain"
                />
              </div>

              <h2 className="font-heading font-bold text-lg sm:text-xl text-brand-purple tracking-wide group-hover:text-brand-purple-hover transition-colors">
                ИНДИВИДУАЛЕН ПОДХОД
              </h2>
              <p className="text-brand-dark/85 text-sm sm:text-base leading-relaxed font-sans">
                В малки групи всяко дете получава лично внимание и подкрепа, защото започваме от
                неговото ниво и го издигаме нагоре.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* 2. SECTION: ЕТО КАКВО КАЗВАТ РОДИТЕЛИТЕ (Solid purple section) */}
      <section className="w-full bg-[#887ed8] py-14 sm:py-20 text-white relative overflow-hidden">
        {/* Decorative cloud accents in background */}
        <div className="absolute top-2 left-6 w-32 h-20 opacity-20 pointer-events-none">
          <Image src="/images/cloud.png" alt="Облаче" fill className="object-contain" />
        </div>
        <div className="absolute bottom-2 right-6 w-40 h-24 opacity-20 pointer-events-none">
          <Image src="/images/cloud.png" alt="Облаче" fill className="object-contain" />
        </div>

        <Container size="xl" className="relative z-10 space-y-8 sm:space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <h2 className="font-heading font-bold text-3xl sm:text-4xl md:text-5xl text-white tracking-wide">
              ЕТО КАКВО КАЗВАТ РОДИТЕЛИТЕ
            </h2>
            <p className="text-white/80 text-sm sm:text-base font-sans">
              Истински отзиви и впечатления от семействата, които ни се доверяват всеки ден.
            </p>
          </div>

          {/* Interactive Social Reviews Carousel */}
          <ParentReviewsCarousel />
        </Container>
      </section>

      {/* 3. SECTION: И ОЩЕ НЕЩО ВАЖНО */}
      <section className="relative">
        <Container size="xl">
          {/* Section Header with Bulbs */}
          <div className="relative mb-12 sm:mb-16 text-center max-w-4xl mx-auto">
            {/* Decorative Bulb Left */}
            <div className="absolute -top-8 left-0 sm:left-12 w-12 h-12 sm:w-16 sm:h-16 opacity-85 transform -rotate-12 pointer-events-none hidden sm:block">
              <Image
                src="/images/bulb.png"
                alt="Идея"
                fill
                sizes="64px"
                className="object-contain"
              />
            </div>

            <h2 className="font-heading font-bold text-3xl sm:text-4xl md:text-5xl text-brand-purple tracking-tight">
              И ОЩЕ НЕЩО ВАЖНО
            </h2>

            {/* Decorative Bulb Right */}
            <div className="absolute -top-10 right-0 sm:right-12 w-14 h-14 sm:w-20 sm:h-20 opacity-90 transform rotate-12 pointer-events-none hidden sm:block">
              <Image
                src="/images/bulb.png"
                alt="Идея"
                fill
                sizes="80px"
                className="object-contain"
              />
            </div>
          </div>

          {/* 3 Value Columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10">
            {/* Value 1 */}
            <div className="bg-white/80 backdrop-blur-sm p-6 sm:p-8 rounded-3xl shadow-card hover:shadow-card-hover border border-brand-purple/15 transition-all duration-300 flex flex-col justify-start space-y-4 group">
              <h3 className="font-heading font-bold text-lg sm:text-xl text-brand-purple tracking-wide group-hover:text-brand-purple-hover transition-colors">
                БЕЗ ЕКРАНИ
              </h3>
              <p className="text-brand-dark/85 text-sm sm:text-base leading-relaxed font-sans">
                Екраните остават настрана, за да има място за знание, мечти и истински
                приятелства.
              </p>
            </div>

            {/* Value 2 */}
            <div className="bg-white/80 backdrop-blur-sm p-6 sm:p-8 rounded-3xl shadow-card hover:shadow-card-hover border border-brand-purple/15 transition-all duration-300 flex flex-col justify-start space-y-4 group">
              <h3 className="font-heading font-bold text-lg sm:text-xl text-brand-purple tracking-wide group-hover:text-brand-purple-hover transition-colors">
                УЧЕНЕ ЧРЕЗ ПРАКТИКА
              </h3>
              <p className="text-brand-dark/85 text-sm sm:text-base leading-relaxed font-sans">
                Знанията влизат в действие чрез задачи, игри и практика, вместо да остават само
                на хартия.
              </p>
            </div>

            {/* Value 3 */}
            <div className="bg-white/80 backdrop-blur-sm p-6 sm:p-8 rounded-3xl shadow-card hover:shadow-card-hover border border-brand-purple/15 transition-all duration-300 flex flex-col justify-start space-y-4 group">
              <h3 className="font-heading font-bold text-lg sm:text-xl text-brand-purple tracking-wide group-hover:text-brand-purple-hover transition-colors">
                РОДИТЕЛЯТ Е ЧАСТ ОТ ПРОЦЕСА
              </h3>
              <p className="text-brand-dark/85 text-sm sm:text-base leading-relaxed font-sans">
                Регулярната обратна връзка ви държи близо до напредъка, интересите и нуждите на
                детето.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* 4. Quick Contact Banner */}
      <QuickContactBanner className="mt-16" />
    </div>
  );
}
