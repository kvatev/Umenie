import React from "react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { SERVICES_DATA, getServiceBySlug } from "@/lib/services-data";
import { ServiceSlider } from "@/components/services/ServiceSlider";
import { SITE_CONFIG } from "@/lib/constants";
import { ArrowRight, Lightbulb } from "lucide-react";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return SERVICES_DATA.map((service) => ({
    slug: service.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) return { title: "Услугата не е намерена" };

  const fullTitle = `${service.title} за деца в Бургас | Клуб УМеНИе`;
  const canonicalUrl = `https://www.umenie.net/uslugi/${slug}`;

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

export default async function ServiceDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  return (
    <div className="w-full bg-brand-bg pb-16">
      {/* Top Header */}
      <section className="pt-12 pb-8 sm:pt-16 sm:pb-12 relative overflow-hidden">
        {/* Decorative bulb */}
        <div className="absolute right-6 top-8 w-24 h-24 sm:w-36 sm:h-36 opacity-30 pointer-events-none rotate-12">
          <Image
            src="/images/bulb.webp"
            alt=""
            fill
            className="object-contain"
          />
        </div>

        <Container size="xl">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-brand-purple uppercase tracking-wider">
              <Link href="/uslugi" className="hover:underline">
                Услуги
              </Link>
              <span>/</span>
              <span>{service.shortTitle}</span>
            </div>

            <h1 className="font-heading font-bold text-3xl sm:text-5xl lg:text-6xl text-brand-purple tracking-wide uppercase">
              {service.title}
            </h1>
          </div>
        </Container>
      </section>

      {/* Main Content Split Section */}
      <section className="pb-16">
        <Container size="xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left Column: Slogan, Intro, and Featured Photo */}
            <div className="lg:col-span-6 space-y-8">
              {/* Slogan card */}
              <div className="bg-brand-purple text-white p-6 sm:p-8 rounded-3xl shadow-card space-y-4">
                <div className="space-y-1">
                  <p className="font-heading text-lg sm:text-xl font-bold opacity-90">
                    {service.sloganPart1}
                  </p>
                  <p className="font-heading text-xl sm:text-2xl font-bold text-white leading-snug">
                    {service.sloganPart2}
                  </p>
                </div>
                <p className="text-white/90 text-sm sm:text-base leading-relaxed pt-2 border-t border-white/20">
                  {service.intro}
                </p>
              </div>

              {/* Featured photo */}
              {service.pageImages && service.pageImages.length > 0 && (
                <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
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

            {/* Right Column: Top Photo (if available) + Purple Highlights Container */}
            <div className="lg:col-span-6 space-y-8">
              {/* Secondary photo if available */}
              {service.pageImages && service.pageImages.length > 1 && (
                <div className="relative w-full aspect-[16/10] rounded-3xl overflow-hidden shadow-card border-4 border-white hidden sm:block">
                  <Image
                    src={service.pageImages[1]}
                    alt={`${service.title} атмосфера`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 600px"
                  />
                </div>
              )}

              {/* Purple Highlights Box */}
              <div className="bg-brand-purple text-white p-6 sm:p-10 rounded-3xl shadow-card space-y-6">
                <div className="flex items-center gap-3 border-b border-white/20 pb-4">
                  <span className="p-2 rounded-full bg-white/15 text-white">
                    <Lightbulb className="w-5 h-5 text-brand-yellow" />
                  </span>
                  <h2 className="font-heading font-bold text-xl sm:text-2xl uppercase tracking-wide">
                    Какво получава детето?
                  </h2>
                </div>

                <ul className="space-y-4 text-sm sm:text-base leading-relaxed text-white/95">
                  {service.bulletPoints.map((bullet, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="w-2 h-2 rounded-full bg-brand-yellow shrink-0 mt-2" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>

                {/* Schedule CTA Button inside purple card */}
                <div className="pt-4 border-t border-white/20">
                  <Link
                    href="/grafik"
                    className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-3.5 rounded-full bg-white text-brand-purple font-heading font-bold text-sm sm:text-base shadow-xl hover:bg-brand-purple-light transition-all active:scale-[0.98]"
                  >
                    <span>ВИЖТЕ ГРАФИКА</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Photo Slider with authentic photos */}
      {service.sliderImages && service.sliderImages.length > 0 && (
        <ServiceSlider
          images={service.sliderImages}
          title={`НАДНИКНЕТЕ В ЗАНИМАНИЯТА ПО ${service.title}`}
        />
      )}

      {/* Quick Contact Banner */}
      <section className="w-full bg-[#e9e7f8] py-8 sm:py-12 border-y border-brand-purple/20 mt-12">
        <Container size="xl">
          <div className="flex flex-col md:flex-row items-center justify-around gap-8 text-center md:text-left">
            <a
              href={`tel:${SITE_CONFIG.phoneRaw}`}
              className="flex items-center gap-4 group p-4 rounded-3xl hover:bg-white/50 transition-all"
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
              className="flex items-center gap-4 group p-4 rounded-3xl hover:bg-white/50 transition-all"
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
        </Container>
      </section>
    </div>
  );
}
