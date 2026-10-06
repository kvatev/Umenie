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
    <div className="w-full bg-[#f1f2f6] min-h-screen overflow-x-hidden pt-28 sm:pt-32 pb-12 sm:pb-16">
      {/* Breadcrumbs */}
      <div className="pt-2 sm:pt-4">
        <Container size="xl">
          <nav aria-label="Хлебни трохи" className="inline-flex items-center gap-2 text-xs font-bold text-brand-purple uppercase tracking-wider">
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
        </Container>
      </div>

      {/* Main 4-Quadrant Visual Layout */}
      <section className="pt-6 pb-12 sm:pt-8 sm:pb-16">
        <Container size="xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            {/* Left Column: Title, Box 1 (Slogan + Intro), Photo 1 */}
            <div className="flex flex-col space-y-8">
              {/* Playful Service Title with Hand-drawn Lightbulb */}
              <div className="relative">
                <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
                  <h1 className="font-heading font-extrabold text-4xl sm:text-5xl lg:text-6xl text-brand-purple tracking-wide uppercase leading-[1.05]">
                    {titleLine1}
                  </h1>
                  <div className="relative w-12 h-12 sm:w-16 sm:h-16 shrink-0 -rotate-12 transform hover:rotate-6 transition-transform">
                    <Image
                      src="/images/bulb.webp"
                      alt=""
                      fill
                      className="object-contain drop-shadow-md"
                      priority
                    />
                  </div>
                </div>
                {titleLine2 && (
                  <span className="block font-heading font-extrabold text-4xl sm:text-5xl lg:text-6xl text-brand-purple tracking-wide uppercase leading-[1.05] mt-1">
                    {titleLine2}
                  </span>
                )}
              </div>

              {/* Purple Box 1: Slogan & Intro */}
              <div className="bg-[#887ed8] text-white p-7 sm:p-9 rounded-[32px] shadow-lg space-y-5">
                <div className="space-y-1">
                  <p className="font-heading text-lg sm:text-xl font-bold opacity-90 leading-tight">
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

              {/* Photo 1 (Portrait / Primary Featured Photo) */}
              {service.pageImages && service.pageImages.length > 0 && (
                <div className="relative w-full aspect-[4/5] sm:aspect-[3/4] rounded-[32px] overflow-hidden shadow-2xl border-4 border-white bg-white">
                  <Image
                    src={service.pageImages[0]}
                    alt={service.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 600px"
                    priority
                  />
                </div>
              )}
            </div>

            {/* Right Column: Photo 2, Box 2 (Bullets + CTA button) */}
            <div className="flex flex-col space-y-8 lg:pt-[130px]">
              {/* Photo 2 (Landscape Secondary Photo) */}
              {service.pageImages && service.pageImages.length > 1 && (
                <div className="relative w-full aspect-[4/3] sm:aspect-[16/11] rounded-[32px] overflow-hidden shadow-2xl border-4 border-white bg-white">
                  <Image
                    src={service.pageImages[1]}
                    alt={`${service.title} атмосфера`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 600px"
                  />
                </div>
              )}

              {/* Purple Box 2: Feature Bullets & "ВИЖТЕ ГРАФИКА" CTA Button */}
              <div className="bg-[#887ed8] text-white p-7 sm:p-9 rounded-[32px] shadow-lg space-y-6">
                <ul className="space-y-4 text-sm sm:text-base leading-relaxed text-white/95">
                  {service.bulletPoints.map((bullet, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="w-5 h-5 sm:w-6 sm:h-6 shrink-0 relative mt-0.5">
                        <Image
                          src="/images/bulb.webp"
                          alt="💡"
                          fill
                          className="object-contain"
                        />
                      </span>
                      <span className="text-white/95 leading-normal">
                        {renderHighlightedText(bullet)}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* White Pill CTA Button */}
                <div className="pt-2">
                  <Link
                    href="/grafik"
                    className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-3.5 rounded-full bg-white text-[#887ed8] font-heading font-bold text-sm sm:text-base shadow-xl hover:bg-[#ede9fe] transition-all transform hover:scale-[1.02] active:scale-[0.98] uppercase"
                  >
                    <span>ВИЖТЕ ГРАФИКА</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Optional 3rd Photo (if provided, e.g. for Knitting) */}
              {service.pageImages && service.pageImages.length > 2 && (
                <div className="relative w-full aspect-[4/3] rounded-[32px] overflow-hidden shadow-2xl border-4 border-white bg-white">
                  <Image
                    src={service.pageImages[2]}
                    alt={`${service.title} детайл`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 600px"
                  />
                </div>
              )}
            </div>
          </div>
        </Container>
      </section>

      {/* Quick Contact Banner (Call Us + Location) */}
      <QuickContactBanner />

      {/* Image Slideshow / Gallery ("ВИЖТЕ ВЪОБРАЖЕНИЕТО С ПОВЕЧЕ УМЕНИЕ") */}
      {service.sliderImages && service.sliderImages.length > 0 && (
        <ServiceSlider
          images={service.sliderImages}
          title={service.galleryTitle}
        />
      )}
    </div>
  );
}

