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
  let reviewScreenshotUrl: string | null = settings.reviewScreenshotUrl || "/images/review-screenshot.webp";

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

  // Resolve Kids Gallery photos with priority to custom kidsGalleryOrder
  let resolvedKidsGallery: { src: string; alt: string }[] | undefined = undefined;
  if (settings.kidsGalleryOrder && settings.kidsGalleryOrder.length > 0) {
    resolvedKidsGallery = settings.kidsGalleryOrder.map((path, idx) => {
      let src = path;
      if (!path.startsWith("http") && !path.startsWith("/")) {
        const { data } = supabaseAdmin.storage.from("site-media").getPublicUrl(path);
        src = data.publicUrl;
      }
      return {
        src,
        alt: `Деца с умения в образователен клуб УМеНИе - кадър ${idx + 1}`,
      };
    });
  } else {
    resolvedKidsGallery = dynamicGalleryImages;
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
            priority={true}
            fetchPriority="high"
            className="object-cover object-center"
            sizes="(max-width: 768px) 100vw, 1200px"
          />
        )}

        {/* Soft gradient overlay for crisp white text contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/50 to-black/25" />

        <Container size="xl" className="relative z-10">
          <div className="max-w-xl text-white space-y-4 sm:space-y-6">
            <h1 className="font-heading font-bold text-2xl xs:text-3xl sm:text-4xl lg:text-5xl leading-tight tracking-wide drop-shadow-md text-white">
              УРОЦИ, КУРСОВЕ И ЗАНИМАНИЯ ЗА УСПЕШНИ ДЕЦА
            </h1>
            <div className="pt-2">
              <Link
                href="/uslugi"
                className="font-heading font-bold text-base sm:text-lg uppercase tracking-wide text-white bg-[#887ed8] hover:bg-[#776dc7] rounded-full px-7 py-3 inline-flex items-center justify-center shadow-lg transition-transform active:scale-95 w-auto self-center"
              >
                НАУЧЕТЕ ПОВЕЧЕ
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* 2. MISSION / INTRO SECTION (matching mockups 1:1) */}
      <section className="py-12 sm:py-20 md:py-24 relative overflow-hidden bg-brand-bg">
        {/* Ambient subtle doodle lightbulbs in the section margins */}
        <div
          className="absolute pointer-events-none select-none -top-6 -left-6 sm:left-4 sm:top-4 w-28 h-28 sm:w-36 sm:h-36 opacity-20 sm:opacity-25"
          style={{ transform: "rotate(-25deg)" }}
        >
          <Image src="/images/bulb.webp" alt="" fill className="object-contain" />
        </div>

        <div
          className="absolute pointer-events-none select-none hidden sm:block -bottom-8 right-6 w-28 h-28 sm:w-36 sm:h-36 opacity-20 sm:opacity-25"
          style={{ transform: "rotate(25deg)" }}
        >
          <Image src="/images/bulb.webp" alt="" fill className="object-contain" />
        </div>

        <Container size="lg" className="relative z-10">
          <div className="relative max-w-3xl mx-auto">
            {/* Decorative Bulb 1: Top-Left (горе вляво, леко наклонена) */}
            <div
              className="absolute pointer-events-none select-none z-0 -top-8 sm:-top-14 -left-4 sm:-left-12 w-20 h-20 sm:w-32 sm:h-32 opacity-35 sm:opacity-45"
              style={{ transform: "rotate(-18deg)" }}
            >
              <Image src="/images/bulb.webp" alt="" fill className="object-contain" priority />
            </div>

            {/* Decorative Bulb 2: Top-Right (горе вдясно) */}
            <div
              className="absolute pointer-events-none select-none z-0 -top-6 sm:-top-12 -right-3 sm:-right-10 w-18 h-18 sm:w-28 sm:h-28 opacity-30 sm:opacity-40"
              style={{ transform: "rotate(20deg)" }}
            >
              <Image src="/images/bulb.webp" alt="" fill className="object-contain" />
            </div>

            {/* Decorative Bulb 3: Bottom-Left (долу вляво) */}
            <div
              className="absolute pointer-events-none select-none z-0 -bottom-6 sm:-bottom-10 -left-3 sm:-left-9 w-16 h-16 sm:w-26 sm:h-26 opacity-25 sm:opacity-35"
              style={{ transform: "rotate(14deg)" }}
            >
              <Image src="/images/bulb.webp" alt="" fill className="object-contain" />
            </div>

            {/* Decorative Bulb 4: Bottom-Right (долу вдясно) */}
            <div
              className="absolute pointer-events-none select-none z-0 -bottom-8 sm:-bottom-12 -right-4 sm:-right-12 w-20 h-20 sm:w-32 sm:h-32 opacity-35 sm:opacity-45"
              style={{ transform: "rotate(-22deg)" }}
            >
              <Image src="/images/bulb.webp" alt="" fill className="object-contain" />
            </div>

            {/* Decorative Bulb 5: Behind / Top-Center (отзад зад горния ръб) */}
            <div
              className="hidden md:block absolute pointer-events-none select-none z-0 -top-12 left-1/3 w-24 h-24 opacity-25"
              style={{ transform: "rotate(-6deg)" }}
            >
              <Image src="/images/bulb.webp" alt="" fill className="object-contain" />
            </div>

            {/* Mission Card */}
            <div className="relative z-10 bg-white/85 backdrop-blur-sm p-6 sm:p-10 md:p-14 rounded-3xl sm:rounded-4xl shadow-card border border-brand-purple/15 text-center space-y-6 sm:space-y-8 overflow-hidden">
              {/* Decorative Bulb Watermark strictly behind the text */}
              <div
                className="absolute pointer-events-none select-none -z-0 opacity-15 sm:opacity-20 top-4 sm:top-8 left-1/2 -translate-x-1/2 w-48 h-48 sm:w-64 sm:h-64"
                style={{ transform: "rotate(10deg)" }}
              >
                <Image src="/images/bulb.webp" alt="" fill className="object-contain" />
              </div>

              <div className="relative z-10 space-y-6 sm:space-y-8">
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
            </div>
          </div>
        </Container>
      </section>

      {/* 3. 6 SERVICES GRID (3 columns desktop, 2 columns mobile) */}
      <section id="activities" className="pb-12 pt-2 sm:py-16 bg-brand-bg scroll-mt-24">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 items-stretch">
            {SERVICES_DATA.map((service) => (
              <ServiceCard
                key={service.slug}
                service={service}
                variant="home"
              />
            ))}
          </div>
        </div>
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
            images={resolvedKidsGallery}
          />
        </Container>
      </section>
    </div>
  );
}
