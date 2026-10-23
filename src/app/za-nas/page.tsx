import React from "react";
import { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { QuickContactBanner } from "@/components/common/QuickContactBanner";
import { ParentReviewsCarousel } from "@/components/about/ParentReviewsCarousel";
import { getSiteSettings } from "@/lib/site-settings";
import { listReviewsImagesAction } from "@/actions/admin-media";
import { getServerDictionary } from "@/lib/i18n/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "За нас – Мисия, Ценности и Екип | Образователен клуб УМеНИе",
  description:
    "Защо образователен клуб УМеНИе е най-доброто място за вашето дете в Бургас: малки групи, индивидуално внимание, подкрепа при уроците, шах, плетиво и творчество в уютна среда.",
  alternates: {
    canonical: "https://www.umenie.net/za-nas",
  },
  openGraph: {
    title: "За нас – Образователен клуб „УМеНИе“ Бургас",
    description:
      "Научете повече за нашата мисия, ценности, безопасна и стимулираща среда за вашето дете в к-с Славейков, Бургас.",
    url: "https://www.umenie.net/za-nas",
    siteName: "Образователен клуб „УМеНИе“",
    locale: "bg_BG",
    type: "website",
    images: [
      {
        url: "https://www.umenie.net/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "За нас – Образователен клуб УМеНИе",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "За нас – Образователен клуб „УМеНИе“ Бургас",
    description:
      "Научете повече за нашата мисия, ценности и уютна среда в Бургас.",
    images: ["https://www.umenie.net/og-image.jpg"],
  },
};

const DEFAULT_ABOUT_VALUES = [
  {
    title: "УМЕНИЯ ОТВЪД УРОЦИТЕ",
    text: "Не просто пишем домашни – учим децата как да учат сами. Изграждаме навици за концентрация, организираност и увереност, които остават за цял живот.",
  },
  {
    title: "СРЕДА, БЛИЗКА ДО ДОМА",
    text: "Топла, спокойна и подкрепяща атмосфера без стрес и излишен натиск. Място, където всяко дете се чувства прието, спокойно и уверено в себе си.",
  },
  {
    title: "ИНДИВИДУАЛЕН ПОДХОД",
    text: "Работим в малки групи, за да обърнем внимание на силните страни и трудностите на всяко дете. Насърчаваме любопитството и творческото мислене.",
  },
];

const DEFAULT_ABOUT_FEATURES = [
  {
    title: "БЕЗ ЕКРАНИ",
    text: "Залагаме на живото общуване, книгите, настолните игри и творческите занимания. Помагаме на децата да преоткрият радостта от реалния свят.",
  },
  {
    title: "УЧЕНЕ ЧРЕЗ ПРАКТИКА",
    text: "Знанията се усвояват най-добре чрез правене. Плетенето развива фината моторика и търпението, шахът – логиката, а арт заниманията – въображението.",
  },
  {
    title: "РОДИТЕЛЯТ Е ЧАСТ ОТ ПРОЦЕСА",
    text: "Поддържаме постоянна и открита обратна връзка с вас. Заедно следим напредъка на детето и се радваме на неговите ежедневни малки и големи победи.",
  },
];

export default async function AboutUsPage() {
  const [{ locale, dict }, settings, reviewsRes] = await Promise.all([
    getServerDictionary(),
    getSiteSettings(),
    listReviewsImagesAction(),
  ]);

  const values = locale === "en"
    ? (settings.aboutValues && settings.aboutValues.length >= 3 && settings.aboutValues.some((v) => v.titleEn || v.textEn)
        ? settings.aboutValues.map((v, i) => ({
            title: v.titleEn?.trim() || dict.about.values[i]?.title || v.title,
            text: v.textEn?.trim() || dict.about.values[i]?.text || v.text,
          }))
        : dict.about.values)
    : (settings.aboutValues && settings.aboutValues.length >= 3
        ? settings.aboutValues
        : DEFAULT_ABOUT_VALUES);

  const features = locale === "en"
    ? (settings.aboutFeatures && settings.aboutFeatures.length >= 3 && settings.aboutFeatures.some((f) => f.titleEn || f.textEn)
        ? settings.aboutFeatures.map((f, i) => ({
            title: f.titleEn?.trim() || dict.about.features[i]?.title || f.title,
            text: f.textEn?.trim() || dict.about.features[i]?.text || f.text,
          }))
        : dict.about.features)
    : (settings.aboutFeatures && settings.aboutFeatures.length >= 3
        ? settings.aboutFeatures
        : DEFAULT_ABOUT_FEATURES);

  return (
    <div className="w-full bg-[#f1f2f6] text-slate-800 overflow-x-hidden pt-28 sm:pt-36">
      {/* 1. HERO SECTION: ЗАЩО ДА ИЗБЕРЕТЕ УМЕНИЕ? */}
      <section className="relative pb-16 sm:pb-24">
        <Container size="xl" className="relative">
          {/* Main Title Centered with Authentic Hand-drawn Bulb */}
          <div className="flex items-center justify-center gap-3 sm:gap-4 mb-12 sm:mb-16">
            <div className="relative w-10 h-10 sm:w-14 sm:h-14 lg:w-16 lg:h-16 shrink-0 rotate-12">
              <Image src="/images/bulb.webp" alt="" fill className="object-contain" priority />
            </div>

            <h1 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl text-[#887ed8] uppercase leading-tight tracking-wide">
              {dict.about.hero.title}
            </h1>
          </div>

          {/* Features Container: 3-column horizontal grid on desktop, vertical stack on mobile */}
          <div className="relative">
            {/* Desktop Bulb 2: Floating gently between Col 2 and Col 3 */}
            <div className="hidden md:block absolute -z-10 pointer-events-none select-none opacity-20 sm:opacity-30 -top-14 lg:-top-16 right-[31%] lg:right-[32%] w-20 h-20 lg:w-24 lg:h-24 rotate-12">
              <Image src="/images/bulb.webp" alt="" fill className="object-contain" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
              {/* Feature 1 */}
              <div className="relative z-10 space-y-2">
                <div className="pr-20 sm:pr-24 md:pr-0 space-y-2">
                  <h2 className="font-heading font-bold text-xl sm:text-2xl text-brand-purple uppercase tracking-wide leading-snug">
                    {values[0].title}
                  </h2>
                  <p className="text-slate-800 text-sm sm:text-base leading-relaxed font-sans font-normal">
                    {values[0].text}
                  </p>
                </div>
                {/* Mobile Bulb 1: Floating behind text on mobile */}
                <div className="md:hidden absolute -z-10 pointer-events-none select-none opacity-20 sm:opacity-30 right-0 top-1/2 -translate-y-1/2 w-20 h-20 sm:w-24 sm:h-24 rotate-12">
                  <Image src="/images/bulb.webp" alt="" fill className="object-contain" />
                </div>
              </div>

              {/* Feature 2 */}
              <div className="relative z-10 space-y-2">
                <h2 className="font-heading font-bold text-xl sm:text-2xl text-brand-purple uppercase tracking-wide leading-snug">
                  {values[1].title}
                </h2>
                <p className="text-slate-800 text-sm sm:text-base leading-relaxed font-sans font-normal">
                  {values[1].text}
                </p>
              </div>

              {/* Feature 3 */}
              <div className="relative z-10 space-y-2">
                <div className="pr-20 sm:pr-24 md:pr-0 space-y-2">
                  <h2 className="font-heading font-bold text-xl sm:text-2xl text-brand-purple uppercase tracking-wide leading-snug">
                    {values[2].title}
                  </h2>
                  <p className="text-slate-800 text-sm sm:text-base leading-relaxed font-sans font-normal">
                    {values[2].text}
                  </p>
                </div>
                {/* Mobile Bulb 2: Floating behind text on mobile */}
                <div className="md:hidden absolute -z-10 pointer-events-none select-none opacity-20 sm:opacity-30 right-0 top-1/2 -translate-y-1/2 w-20 h-20 sm:w-24 sm:h-24 rotate-12">
                  <Image src="/images/bulb.webp" alt="" fill className="object-contain" />
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 2. SECTION: ЕТО КАКВО КАЗВАТ РОДИТЕЛИТЕ */}
      <section className="w-full bg-[#887ed8] py-10 sm:py-14 text-white text-center relative overflow-hidden">
        <Container size="xl" className="relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-8">
            <h2 className="font-heading font-bold text-2xl sm:text-4xl lg:text-5xl text-white tracking-wide uppercase">
              {dict.about.reviewsHeading}
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
              {dict.about.featuresHeading}
            </h2>
          </div>

          {/* 3 Secondary Features: 3-column horizontal grid on desktop, vertical stack on mobile */}
          <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
            {/* Desktop Bulb 2: Floating on the right behind/above Col 3 */}
            <div className="hidden md:block absolute -z-10 pointer-events-none select-none opacity-20 sm:opacity-30 -top-14 lg:-top-16 right-0 lg:-right-4 w-24 h-24 lg:w-32 lg:h-32 rotate-12">
              <Image src="/images/bulb.webp" alt="" fill className="object-contain" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
              {/* Feature 1: "БЕЗ ЕКРАНИ" */}
              <div className="relative z-10 space-y-2">
                <div className="absolute -z-10 pointer-events-none select-none opacity-20 sm:opacity-30 top-1/2 -translate-y-1/2 -left-8 sm:-left-12 w-24 h-24 sm:w-28 sm:h-28 -rotate-12">
                  <Image src="/images/bulb.webp" alt="" fill className="object-contain" />
                </div>
                <h3 className="font-heading font-bold text-xl sm:text-2xl text-[#2b3a67] uppercase tracking-wide leading-snug">
                  {features[0].title}
                </h3>
                <p className="text-slate-800 text-sm sm:text-base leading-relaxed font-sans font-normal">
                  {features[0].text}
                </p>
              </div>

              {/* Feature 2: "УЧЕНЕ ЧРЕЗ ПРАКТИКА" */}
              <div className="relative z-10 space-y-2">
                <h3 className="font-heading font-bold text-xl sm:text-2xl text-[#2b3a67] uppercase tracking-wide leading-snug">
                  {features[1].title}
                </h3>
                <p className="text-slate-800 text-sm sm:text-base leading-relaxed font-sans font-normal">
                  {features[1].text}
                </p>
              </div>

              {/* Feature 3: "РОДИТЕЛЯТ Е ЧАСТ ОТ ПРОЦЕСА" */}
              <div className="relative z-10 space-y-2">
                <div className="space-y-2">
                  <h3 className="font-heading font-bold text-xl sm:text-2xl text-[#2b3a67] uppercase tracking-wide leading-snug">
                    {features[2].title}
                  </h3>
                  <p className="text-slate-800 text-sm sm:text-base leading-relaxed font-sans font-normal">
                    {features[2].text}
                  </p>
                </div>
                {/* Mobile Bulb 3: Floating behind text on mobile */}
                <div className="md:hidden absolute -z-10 pointer-events-none select-none opacity-20 sm:opacity-30 -bottom-6 -right-4 w-20 h-20 sm:w-24 sm:h-24 -rotate-12">
                  <Image src="/images/bulb.webp" alt="" fill className="object-contain" />
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 4. QUICK INFO CONTACT PILL / BANNER */}
      <QuickContactBanner className="mt-4" />
    </div>
  );
}
