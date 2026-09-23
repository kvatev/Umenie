import React from "react";
import { Metadata } from "next";
import { MediaManager } from "@/components/admin/MediaManager";
import { listMediaFolderAction } from "@/actions/admin-media";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const metadata: Metadata = {
  title: "Банери и Снимки | Административен панел",
};

export const dynamic = "force-dynamic";

export default async function AdminMediaPage() {
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
          Банери и Снимки
        </h1>
        <p className="text-brand-muted text-xs sm:text-sm font-sans mt-0.5">
          Качвайте, преглеждайте и подменяйте заглавния банер и ротационните фото слайдери на уебсайта.
        </p>
      </div>

      {/* Media Manager Component */}
      <MediaManager
        initialHeroUrl={heroUrl}
        initialKidsGallery={kidsRes.items || []}
        initialServiceMedia={servicesRes.items || []}
      />
    </div>
  );
}
