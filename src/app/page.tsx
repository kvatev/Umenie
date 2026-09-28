import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
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

  let heroMediaSrc = "/images/opening-photo.webp";
  let isHeroVideo = false;

  // 1. Resolve Hero media: Video or Image from settings or storage
  if (settings.heroMediaType === "video" && settings.heroVideoUrl) {
    heroMediaSrc = settings.heroVideoUrl;
    isHeroVideo = true;
  } else if (settings.heroBannerUrl) {
    heroMediaSrc = settings.heroBannerUrl;
  }

  // 2. Resolve Review Screenshot
  let reviewScreenshotUrl: string | null = settings.reviewScreenshotUrl || null;

  // 3. Resolve Gallery from gallery_images table or storage
  let dynamicGalleryImages: { src: string; alt: string }[] | undefined = undefined;

  try {
    const { data: dbGallery } = await supabaseAdmin
      .from("gallery_images")
      .select("public_url, caption")
      .order("display_order", { ascending: true });

    if (dbGallery && dbGallery.length > 0) {
      dynamicGalleryImages = dbGallery.map((g) => ({
        src: g.public_url,
        alt: g.caption || "Деца с умения в образователен клуб УМеНИе",
      }));
    }
  } catch {}

  try {
    const { data: files } = await supabaseAdmin.storage
      .from("site-assets")
      .list("", { limit: 100 });

    if (files && files.length > 0) {
      // If hero not set in settings, fallback to storage files
      if (!settings.heroVideoUrl && !settings.heroBannerUrl) {
        const videoFile = files.find(
          (f) =>
            f.name.startsWith("hero-video") ||
            f.name.endsWith(".mp4") ||
            f.name.endsWith(".webm")
        );

        if (videoFile) {
          const { data: vData } = supabaseAdmin.storage
            .from("site-assets")
            .getPublicUrl(videoFile.name);
          if (vData?.publicUrl) {
            heroMediaSrc = vData.publicUrl;
            isHeroVideo = true;
          }
        } else {
          const bannerFile = files.find((f) => f.name.startsWith("hero-banner"));
          if (bannerFile) {
            const { data: urlData } = supabaseAdmin.storage
              .from("site-assets")
              .getPublicUrl(bannerFile.name);
            if (urlData?.publicUrl) {
              heroMediaSrc = urlData.publicUrl;
            }
          }
        }
      }

      // If review screenshot not set in settings, fallback to storage files
      if (!reviewScreenshotUrl) {
        const reviewFile = files.find(
          (f) =>
            f.name.startsWith("review-") ||
            f.name.startsWith("otziv-") ||
            f.name.includes("screenshot")
        );
        if (reviewFile) {
          const { data: rData } = supabaseAdmin.storage
            .from("site-assets")
            .getPublicUrl(reviewFile.name);
          if (rData?.publicUrl) {
            reviewScreenshotUrl = rData.publicUrl;
          }
        }
      }

      // Fallback: Check for Kids Gallery dynamic photos in storage if table was empty
      if (!dynamicGalleryImages || dynamicGalleryImages.length === 0) {
        const galleryFiles = files.filter(
          (f) => f.name.startsWith("kids-") || f.name.startsWith("gallery-")
        );
        if (galleryFiles.length > 0) {
          dynamicGalleryImages = galleryFiles.map((f) => {
            const { data } = supabaseAdmin.storage
              .from("site-assets")
              .getPublicUrl(f.name);
            return {
              src: data.publicUrl,
              alt: "Деца с умения в образователен клуб УМеНИе",
            };
          });
        }
      }
    }
  } catch (err) {
    console.warn("Storage assets check warning:", err);
  }

  return (
    <div className="w-full">
      {/* 1. HERO SECTION (matching mockups 1:1) */}
      <section className="relative w-full h-[380px] xs:h-[440px] sm:h-[520px] lg:h-[600px] overflow-hidden flex items-center justify-center bg-brand-dark">
        {/* Dynamic Media Zone: Video or Image */}
        {isHeroVideo ? (
          <video
            src={heroMediaSrc}
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
        ) : (
          <Image
            src={heroMediaSrc}
            alt="Деца в образователен клуб УМеНИе"
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
        )}

        {/* Soft gradient overlay for crisp white text contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/50 to-black/25" />

        <Container size="xl" className="relative z-10">
          <div className="max-w-xl text-white space-y-4 sm:space-y-6">
            <h1 className="font-heading font-bold text-2xl xs:text-3xl sm:text-4xl lg:text-5xl leading-tight tracking-wide drop-shadow-md">
              УРОЦИ, КУРСОВЕ И ЗАНИМАНИЯ ЗА УСПЕШНИ ДЕЦА
            </h1>
            <div className="pt-2">
              <Link
                href="/uslugi"
                className="inline-flex items-center justify-center px-8 sm:px-12 py-3.5 sm:py-4 rounded-full bg-brand-purple text-white font-heading font-bold text-sm sm:text-lg tracking-wider uppercase shadow-2xl hover:bg-brand-purple-hover hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
              >
                НАУЧЕТЕ ПОВЕЧЕ
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* 2. MISSION / INTRO SECTION (matching mockups 1:1) */}
      <section className="py-12 sm:py-20 md:py-24 relative overflow-hidden bg-brand-bg">
        {/* Scattered chaotic bulb line-art decorations with gentle bleach/glow effect */}
        <div
          className="absolute pointer-events-none"
          style={{
            left: "-2%",
            top: "4%",
            width: "140px",
            height: "140px",
            opacity: 0.5,
            transform: "rotate(-25deg)",
            filter: "brightness(1.5) saturate(0.65)",
          }}
        >
          <Image src="/images/bulb.webp" alt="" fill className="object-contain" />
        </div>

        <div
          className="absolute pointer-events-none"
          style={{
            right: "4%",
            top: "6%",
            width: "80px",
            height: "80px",
            opacity: 0.4,
            transform: "rotate(18deg)",
            filter: "brightness(1.7) saturate(0.55)",
          }}
        >
          <Image src="/images/bulb.webp" alt="" fill className="object-contain" />
        </div>

        <div
          className="absolute pointer-events-none hidden sm:block"
          style={{
            right: "-2%",
            top: "40%",
            width: "120px",
            height: "120px",
            opacity: 0.35,
            transform: "rotate(38deg)",
            filter: "brightness(1.55) saturate(0.6)",
          }}
        >
          <Image src="/images/bulb.webp" alt="" fill className="object-contain" />
        </div>

        <div
          className="absolute pointer-events-none"
          style={{
            left: "6%",
            bottom: "8%",
            width: "70px",
            height: "70px",
            opacity: 0.32,
            transform: "rotate(-12deg)",
            filter: "brightness(1.75) saturate(0.5)",
          }}
        >
          <Image src="/images/bulb.webp" alt="" fill className="object-contain" />
        </div>

        <div
          className="absolute pointer-events-none hidden md:block"
          style={{
            left: "1%",
            top: "48%",
            width: "60px",
            height: "60px",
            opacity: 0.22,
            transform: "rotate(-32deg)",
            filter: "brightness(1.7) saturate(0.5)",
          }}
        >
          <Image src="/images/bulb.webp" alt="" fill className="object-contain" />
        </div>

        <Container size="lg" className="relative z-10">
          <div className="bg-white/80 backdrop-blur-sm p-6 sm:p-10 md:p-14 rounded-3xl sm:rounded-4xl shadow-card border border-brand-purple/15 text-center space-y-6 sm:space-y-8 max-w-3xl mx-auto">
            <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl text-brand-dark leading-snug font-bold">
              В образователен клуб „УМеНИе“ децата{" "}
              <span className="text-brand-purple">растат с едно умение</span> повече
              всеки ден.
            </h2>

            <div className="space-y-4 sm:space-y-5 text-base sm:text-lg md:text-xl text-brand-dark/90 leading-relaxed font-normal">
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
          </div>
        </Container>
      </section>

      {/* 3. 6 SERVICES GRID (3 columns desktop, 2 columns mobile) */}
      <section id="activities" className="pb-12 pt-2 sm:py-16 bg-brand-bg scroll-mt-24">
        <Container size="xl">
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 max-w-6xl mx-auto">
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

      {/* 4. QUICK CONTACT BANNER (matching mockups 1:1) */}
      <QuickContactBanner />

      {/* 5. REVIEWS & WHY CHOOSE US (matching mockups 1:1) */}
      <ReviewsSection screenshotUrl={reviewScreenshotUrl} />

      {/* 6. WEEKLY SCHEDULE BANNER (matching mockups 1:1) */}
      <ScheduleBanner
        scheduleFileUrl={settings.scheduleFileUrl}
        scheduleFileName={settings.scheduleFileName}
      />

      {/* 7. GALLERY / AUTOPLAY SLIDER: НАШИТЕ ДЕЦА С УМЕНИЯ */}
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

          <KidsGallery
            images={dynamicGalleryImages}
            order={settings.kidsGalleryOrder}
          />
        </Container>
      </section>
    </div>
  );
}
