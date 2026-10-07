import React from "react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { SERVICES_DATA, getServiceBySlug } from "@/lib/services-data";
import { ServiceSlider } from "@/components/services/ServiceSlider";
import { QuickContactBanner } from "@/components/common/QuickContactBanner";
import { ArrowRight } from "lucide-react";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const params = SERVICES_DATA.map((service) => ({
    slug: service.slug,
  }));
  // Alias for backward compatibility
  params.push({ slug: "chitatelski-klub" });
  return params;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) return { title: "Услугата не е намерена" };

  const fullTitle = `${service.title} | Клуб УМеНИе Бургас`;
  const canonicalUrl = `https://www.umenie.net/uslugi/${service.slug}`;

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
  const service = getServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  const titleLine1 = service.titleLines ? service.titleLines[0] : service.title;
  const titleLine2 = service.titleLines && service.titleLines.length > 1 ? service.titleLines[1] : null;

  return (
    <div className="w-full bg-[#f1f2f6] min-h-screen overflow-x-hidden pt-28 sm:pt-32 pb-16">
      {/* Service Header: Breadcrumbs & Title */}
      <div className="pt-2 sm:pt-4 mb-6 sm:mb-8">
        <Container size="xl">
          <nav aria-label="Хлебни трохи" className="inline-flex items-center gap-2 text-xs font-bold text-brand-purple uppercase tracking-wider mb-4 sm:mb-6">
            <Link href="/" className="hover:underline">
              Начало
            </Link>
            <span>/</span>
            <Link href="/uslugi" className="hover:underline">
              Услуги
            </Link>
            <span>/</span>
            <span className="text-brand-purple/70">{service.shortTitle}</span>
          </nav>

          {/* Title Header with Hand-drawn Lightbulb */}
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
              quality={85}
              priority
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
              quality={85}
            />
          </div>

          {/* BLOCK 4 (Bottom Right): Purple Features & Booking Card */}
          <div className="order-3 lg:order-4 bg-[#887ed8] text-white p-6 sm:p-8 rounded-3xl shadow-md flex flex-col justify-between gap-6">
            <ul className="space-y-3 sm:space-y-4 text-sm sm:text-base leading-relaxed text-white/95">
              {service.bulletPoints.map((bullet, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="w-5 h-5 sm:w-6 sm:h-6 shrink-0 relative mt-0.5">
                    <Image
                      src="/images/bulb.webp"
                      alt=""
                      fill
                      sizes="24px"
                      className="object-contain"
                    />
                  </span>
                  <span className="text-white/95 leading-snug">
                    {renderHighlightedText(bullet)}
                  </span>
                </li>
              ))}
            </ul>

            <div>
              <Link
                href="/grafik"
                className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-3.5 rounded-full bg-white text-[#887ed8] font-heading font-bold text-sm sm:text-base shadow-xl hover:bg-[#ede9fe] transition-all transform hover:scale-[1.02] active:scale-[0.98] uppercase"
              >
                <span>ВИЖТЕ ГРАФИКА</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Image Slideshow / Gallery */}
      {service.sliderImages && service.sliderImages.length > 0 && (
        <ServiceSlider
          images={service.sliderImages}
          title={service.galleryTitle}
        />
      )}

      {/* Quick Contact Banner (Call Us + Location) */}
      <QuickContactBanner />
    </div>
  );
}

