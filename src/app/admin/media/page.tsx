import React from "react";
import { Metadata } from "next";
import { MediaManager } from "@/components/admin/MediaManager";
import { listMediaFolderAction, listReviewsImagesAction } from "@/actions/admin-media";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { getSiteSettings } from "@/lib/site-settings";

const MEDIA_BUCKET = "site-media";

export const metadata: Metadata = {
  title: "Банери и Снимки | Административен панел",
};

export const dynamic = "force-dynamic";

export default async function AdminMediaPage() {
  const settings = await getSiteSettings();
  let heroUrl: string | null = settings.heroBannerUrl || null;

  try {
    // 1. Try checking site-media bucket
    const { data: mediaFiles } = await supabaseAdmin.storage
      .from(MEDIA_BUCKET)
      .list("", { search: "hero-banner" });

    if (mediaFiles && mediaFiles.some((f) => f.name === "hero-banner.webp")) {
      const { data: heroData } = supabaseAdmin.storage
        .from(MEDIA_BUCKET)
        .getPublicUrl("hero-banner.webp");

      if (heroData?.publicUrl) {
        heroUrl = `${heroData.publicUrl}?t=${Date.now()}`;
      }
    } else {
      // Fallback to site-assets
      const { data: assetFiles } = await supabaseAdmin.storage
        .from("site-assets")
        .list("", { search: "hero-banner" });

      if (assetFiles && assetFiles.some((f) => f.name === "hero-banner.webp")) {
        const { data: heroData } = supabaseAdmin.storage
          .from("site-assets")
          .getPublicUrl("hero-banner.webp");

        if (heroData?.publicUrl) {
          heroUrl = `${heroData.publicUrl}?t=${Date.now()}`;
        }
      }
    }
  } catch (err) {
    console.error("Error getting hero banner url:", err);
  }

  // Fetch gallery photos, service media, and /za-nas review screenshots
  const kidsRes = await listMediaFolderAction("kids-gallery");
  const servicesRes = await listMediaFolderAction("services");
  const reviewsImagesRes = await listReviewsImagesAction();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <span className="text-xs font-bold text-brand-purple uppercase tracking-wider">
          Мултимедия
        </span>
        <h1 className="font-heading font-bold text-2xl sm:text-3xl text-brand-dark mt-1">
          Банери, Снимки и Видеа
        </h1>
        <p className="text-brand-muted text-xs sm:text-sm font-sans mt-0.5">
          Качвайте заглавен банер/видео, отзиви за началната страница и „За нас“, подреждайте галерията и слайдерите на дейностите.
        </p>
      </div>

      {/* Media Manager Component */}
      <MediaManager
        initialHeroUrl={heroUrl}
        initialKidsGallery={kidsRes.items || []}
        initialServiceMedia={servicesRes.items || []}
        initialHeroVideoUrl={settings.heroVideoUrl || ""}
        initialHeroMediaType={settings.heroMediaType || "image"}
        initialReviewScreenshotUrl={settings.reviewScreenshotUrl || ""}
        initialReviewsImages={reviewsImagesRes.items || []}
        initialKidsGalleryOrder={settings.kidsGalleryOrder || []}
      />
    </div>
  );
}

