import React from "react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { SERVICES_DATA, getServiceBySlug } from "@/lib/services-data";
import { ServiceSlider } from "@/components/services/ServiceSlider";
import { QuickContactBanner } from "@/components/common/QuickContactBanner";
import { BulletBulbIcon } from "@/components/common/BulletBulbIcon";
import { getSiteSettings } from "@/lib/site-settings";
import { getServerDictionary } from "@/lib/i18n/server";
import { ArrowRight, Video } from "lucide-react";


interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const baseService = getServiceBySlug(slug);
  if (!baseService) return { title: "Услугата не е намерена" };

  const [{ locale, dict }, settings] = await Promise.all([
    getServerDictionary(),
    getSiteSettings(),
  ]);

  const override = settings.servicesOverrides?.[baseService.slug] || settings.servicesOverrides?.[slug] || {};
  const enItem = locale === "en" ? (dict.services.items as Record<string, any>)[baseService.slug] : null;

  const title =
    locale === "en"
      ? (override.titleEn?.trim() || enItem?.title || baseService.title)
      : (override.title?.trim() || baseService.title);

  const shortDescription =
    locale === "en"
      ? (override.introNarrativeEn?.trim() || override.introEn?.trim() || enItem?.shortDescription || baseService.shortDescription)
      : (override.intro?.trim() || baseService.shortDescription);

  const service = { ...baseService, ...override, title, shortDescription };
  const fullTitle = `${title} | ${locale === "en" ? "Club Umenie Burgas" : "Клуб УМеНИе Бургас"}`;
  const canonicalUrl = `https://www.umenie.net/uslugi/${baseService.slug}`;

  return {
    title: fullTitle,
    description: `${service.seoDescription} Образователен клуб „УМеНИе“, гр. Бургас, к-с Славейков.`,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: fullTitle,
      description: service.shortDescription,
      url: canonicalUrl,
      images: [
        {
          url: service.cardImage,
          width: 800,
          height: 600,
          alt: `${service.title} в клуб УМеНИе`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: service.shortDescription,
      images: [service.cardImage],
    },
  };
}

function renderHighlightedText(text: string) {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={index} className="font-bold text-white">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <span key={index}>{part}</span>;
  });
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const baseService = getServiceBySlug(slug);

  if (!baseService) {
    notFound();
  }

  const [{ locale, dict }, settings] = await Promise.all([
    getServerDictionary(),
    getSiteSettings(),
  ]);

  const override = settings.servicesOverrides?.[baseService.slug] || settings.servicesOverrides?.[slug] || {};
  const enItem = locale === "en" ? (dict.services.items as Record<string, any>)[baseService.slug] : null;

  const service = {
    ...baseService,
    title:
      locale === "en"
        ? (override.titleEn?.trim() || enItem?.title || baseService.title)
        : (override.title?.trim() || baseService.title),
    shortTitle:
      locale === "en"
        ? (override.badgeEn?.trim() || override.shortTitleEn?.trim() || enItem?.shortTitle || baseService.shortTitle)
        : (override.shortTitle?.trim() || baseService.shortTitle),
    sloganPart1:
      locale === "en"
        ? (override.sloganPart1En?.trim() || enItem?.sloganPart1 || baseService.sloganPart1)
        : (override.sloganPart1?.trim() || baseService.sloganPart1),
    sloganPart2:
      locale === "en"
        ? (override.sloganPart2En?.trim() || enItem?.sloganPart2 || baseService.sloganPart2)
        : (override.sloganPart2?.trim() || baseService.sloganPart2),
    intro:
      locale === "en"
        ? (override.introNarrativeEn?.trim() || override.introEn?.trim() || enItem?.intro || baseService.intro)
        : (override.intro?.trim() || baseService.intro),
    bulletPoints:
      locale === "en"
        ? ((override.bulletsEn && override.bulletsEn.length > 0)
            ? override.bulletsEn
            : (override.bulletPointsEn && override.bulletPointsEn.length > 0)
              ? override.bulletPointsEn
              : enItem?.bulletPoints || baseService.bulletPoints)
        : (override.bulletPoints && override.bulletPoints.length > 0 ? override.bulletPoints : baseService.bulletPoints),
    galleryTitle:
      locale === "en"
        ? (override.galleryTitleEn?.trim() || enItem?.galleryTitle || baseService.galleryTitle)
        : (override.galleryTitle?.trim() || baseService.galleryTitle),
    pageImages: [
      override.pageImages?.[0] || baseService.pageImages[0],
      override.pageImages?.[1] || baseService.pageImages[1] || baseService.pageImages[0],
    ],
    sliderImages: override.sliderImages && override.sliderImages.length > 0 ? override.sliderImages : baseService.sliderImages,
    hasSlider: override.hasSlider !== undefined ? override.hasSlider : baseService.hasSlider,
    sliderImageSettings: override.sliderImageSettings || {},
    videos: override.videos && override.videos.length > 0 ? override.videos : baseService.videos,
    videoPosters: override.videoPosters && override.videoPosters.length > 0 ? override.videoPosters : baseService.videoPosters,
  };

  return (
    <div className="w-full bg-[#f1f2f6] min-h-screen overflow-x-hidden pt-28 sm:pt-32 pb-16">
      {/* Service Header: Breadcrumbs & Title */}
      <div className="pt-2 sm:pt-4 mb-6 sm:mb-8">
        <Container size="xl">
          <nav
            aria-label={dict.services.breadcrumbs.ariaLabel}
            className="inline-flex items-center gap-2 text-xs font-bold text-brand-purple uppercase tracking-wider mb-4 sm:mb-6"
          >
            <Link href="/" className="hover:underline">
              {dict.common.nav.home}
            </Link>
            <span>/</span>
            <Link href="/uslugi" className="hover:underline">
              {dict.common.nav.services}
            </Link>
            <span>/</span>
            <span className="text-brand-purple/70">{service.shortTitle}</span>
          </nav>

          {/* Title Header with Exact Hand-drawn Logo Lightbulb */}
          <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
            <h1 className="font-heading font-extrabold text-3xl sm:text-5xl lg:text-6xl text-brand-purple tracking-wide uppercase leading-[1.05]">
              {service.title}
            </h1>
            <div className="relative w-10 h-10 sm:w-16 sm:h-16 shrink-0 -rotate-12 transform hover:rotate-6 transition-transform">
              <Image
                src="/images/bulb.webp"
                alt=""
                fill
                className="object-contain drop-shadow-md"
                priority
              />
            </div>
          </div>
        </Container>
      </div>

      {/* 4-Block Hero Grid (2x2 on desktop, narrative stack on mobile) */}
      <section className="pb-12 sm:pb-16">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-stretch">
          {/* BLOCK 1 (Top Left): Purple Intro Card */}
          <div className="order-1 bg-[#887ed8] text-white p-6 sm:p-8 rounded-3xl shadow-md flex flex-col justify-center space-y-4">
            <span className="inline-flex self-start items-center px-3 py-1 rounded-full bg-white/20 text-[11px] sm:text-xs font-bold uppercase tracking-wider">
              {service.shortTitle}
            </span>
            <div className="space-y-1">
              <p className="font-heading text-base sm:text-lg font-bold opacity-90 leading-tight">
                {service.sloganPart1}
              </p>
              <p className="font-heading text-xl sm:text-2xl lg:text-[26px] font-bold text-white leading-snug">
                {service.sloganPart2}
              </p>
            </div>
            <p className="text-white/95 text-sm sm:text-base leading-relaxed pt-3 border-t border-white/20 font-normal">
              {service.intro}
            </p>
          </div>

          {/* BLOCK 2 (Top Right): Secondary landscape image (page-2) */}
          <div className="order-2 relative w-full aspect-[16/10] sm:aspect-[16/9] lg:aspect-auto lg:min-h-[280px] rounded-3xl overflow-hidden shadow-md bg-slate-100">
            <Image
              src={service.pageImages[1] || service.pageImages[0]}
              alt={service.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 800px"
              className="object-cover object-center"
              quality={87}
              priority
              fetchPriority="high"
            />
          </div>

          {/* BLOCK 3 (Bottom Left): Primary portrait image (page-1) */}
          <div className="order-4 lg:order-3 relative w-full aspect-[4/5] sm:aspect-[3/4] lg:aspect-auto lg:min-h-[420px] rounded-3xl overflow-hidden shadow-md bg-slate-100">
            <Image
              src={service.pageImages[0]}
              alt={service.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 800px"
              className="object-cover object-center"
              quality={87}
              priority
            />
          </div>

          {/* BLOCK 4 (Bottom Right): Purple Features & Booking Card */}
          <div className="order-3 lg:order-4 bg-[#887ed8] text-white p-6 sm:p-8 rounded-3xl shadow-md flex flex-col justify-between gap-6">
            <ul className="space-y-3 sm:space-y-4 text-sm sm:text-base leading-relaxed text-white/95">
              {service.bulletPoints.map((bullet: string, idx: number) => (
                <li key={idx} className="flex items-start gap-3">
                  <BulletBulbIcon className="w-5 h-5 sm:w-6 sm:h-6 shrink-0 mt-0.5" />
                  <span className="text-white/95 leading-snug">
                    {renderHighlightedText(bullet)}
                  </span>
                </li>
              ))}
            </ul>

            <div>
              <Link
                href="/grafik"
                className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-3.5 rounded-full bg-white text-[#887ed8] font-heading font-bold text-sm sm:text-base shadow-xl hover:bg-[#ede9fe] transition-all transform hover:scale-[1.02] active:scale-[0.98] uppercase cursor-pointer"
              >
                <span>{dict.services.viewSchedule}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Dedicated Video Showcase for Services with Videos (e.g. Плетиво) */}
      {service.videos && service.videos.length > 0 && (
        <section className="py-12 sm:py-16 bg-white/60 border-y border-brand-purple/15 my-6 sm:my-10">
          <Container size="xl">
            <div className="max-w-2xl mx-auto text-center mb-8 sm:mb-12 space-y-2">
              <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-brand-purple/10 text-brand-purple font-heading font-bold text-xs uppercase tracking-wider">
                <Video className="w-3.5 h-3.5" />
                {dict.services.videoShowcase.badge}
              </span>
              <h2 className="font-heading font-extrabold text-2xl sm:text-4xl text-brand-purple tracking-wide uppercase">
                {dict.services.videoShowcase.title}
              </h2>
              <p className="text-brand-muted text-xs sm:text-base max-w-xl mx-auto">
                {locale === "en"
                  ? `${dict.services.videoShowcase.descPrefix} ${service.shortTitle.toLowerCase()} ${dict.services.videoShowcase.descClub}`
                  : `Реални кадри от творческия процес и занятията по ${service.shortTitle.toLowerCase()} в образователен клуб „УМеНИе“`}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-3xl mx-auto items-stretch">
              {service.videos.map((vidSrc, vidIdx) => {
                const posterSrc = service.videoPosters?.[vidIdx];
                const card = dict.services.videoShowcase.cards[vidIdx] || dict.services.videoShowcase.cards[0];
                return (
                  <div
                    key={vidIdx}
                    className="bg-white rounded-3xl overflow-hidden shadow-card border border-brand-purple/15 flex flex-col group hover:border-brand-purple hover:shadow-card-hover transition-all"
                  >
                    <div className="relative aspect-[9/16] max-h-[480px] w-full bg-slate-950 overflow-hidden flex items-center justify-center">
                      <video
                        src={vidSrc}
                        poster={posterSrc}
                        controls
                        playsInline
                        preload="metadata"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-5 text-left space-y-1.5 mt-auto bg-white border-t border-brand-purple/10">
                      <h4 className="font-heading font-bold text-base sm:text-lg text-brand-dark">
                        {card.title}
                      </h4>
                      <p className="text-xs sm:text-sm text-brand-muted leading-relaxed">
                        {card.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Container>
        </section>
      )}

      {/* Image Slideshow / Gallery (Rendered only on services with dedicated galleries) */}
      {service.hasSlider && service.sliderImages && service.sliderImages.length > 0 && (
        <ServiceSlider
          images={service.sliderImages}
          title={service.galleryTitle}
          imageSettings={service.sliderImageSettings}
        />
      )}

      {/* Quick Contact Banner (Call Us + Location) */}
      <QuickContactBanner />
    </div>
  );
}
