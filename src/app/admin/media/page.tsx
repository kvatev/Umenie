import React from "react";
import { Metadata } from "next";
import { MediaManager } from "@/components/admin/MediaManager";
import { listMediaFolderAction } from "@/actions/admin-media";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { getSiteSettings } from "@/lib/site-settings";

export const metadata: Metadata = {
  title: "Банери и Снимки | Административен панел",
};

export const dynamic = "force-dynamic";

export default async function AdminMediaPage() {
  const settings = await getSiteSettings();
  let heroUrl: string | null = null;

  try {
    const { data: files } = await supabaseAdmin.storage
      .from("site-assets")
      .list("", { search: "hero-banner" });

    if (files && files.some((f) => f.name === "hero-banner.webp")) {
      const { data: heroData } = supabaseAdmin.storage
        .from("site-assets")
        .getPublicUrl("hero-banner.webp");

      if (heroData?.publicUrl) {
        heroUrl = `${heroData.publicUrl}?t=${Date.now()}`;
      }
    }
  } catch (err) {
    console.error("Error getting hero banner url:", err);
  }

  // Fetch gallery photos
  const kidsRes = await listMediaFolderAction("kids-gallery");
  const servicesRes = await listMediaFolderAction("services");

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
          Качвайте заглавен банер/видео, отзиви, подреждайте снимките на децата и слайдерите на дейностите.
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
        initialKidsGalleryOrder={settings.kidsGalleryOrder || []}
      />
    </div>
  );
}
