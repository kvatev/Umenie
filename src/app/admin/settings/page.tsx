import React from "react";
import { Metadata } from "next";
import { MediaManager } from "@/components/admin/MediaManager";
import { listMediaFolderAction, listReviewsImagesAction } from "@/actions/admin-media";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { getSiteSettings } from "@/lib/site-settings";

const MEDIA_BUCKET = "site-media";

export const metadata: Metadata = {
  title: "Настройки на сайта | Административен панел",
};

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const targetEmail = "admin@umenie.net";

  // Self-healing: ensure admin@umenie.net exists in Supabase Auth
  try {
    const { data: usersData } = await supabaseAdmin.auth.admin.listUsers();
    if (usersData?.users) {
      const netUser = usersData.users.find(
        (u) => u.email?.toLowerCase() === targetEmail
      );

      if (!netUser) {
        // If admin@umenie.bg exists, migrate its email to admin@umenie.net
        const bgUser = usersData.users.find(
          (u) => u.email?.toLowerCase() === "admin@umenie.bg"
        );

        if (bgUser) {
          await supabaseAdmin.auth.admin.updateUserById(bgUser.id, {
            email: targetEmail,
            email_confirm: true,
          });
        } else {
          await supabaseAdmin.auth.admin.createUser({
            email: targetEmail,
            password: "UmenieAdmin2026!",
            email_confirm: true,
          });
        }
      }
    }
  } catch (err) {
    console.error("Error checking or migrating admin user:", err);
  }

  const settings = await getSiteSettings();
  let heroUrl: string | null = settings.heroBannerUrl || null;

  try {
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

  const kidsRes = await listMediaFolderAction("kids-gallery");
  const servicesRes = await listMediaFolderAction("services");
  const reviewsImagesRes = await listReviewsImagesAction();

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <span className="text-xs font-bold text-brand-purple uppercase tracking-wider">
          Конфигурация & Контроли
        </span>
        <h1 className="font-heading font-bold text-2xl sm:text-3xl text-brand-dark mt-1">
          Настройки на сайта
        </h1>
        <p className="text-brand-muted text-xs sm:text-sm font-sans mt-0.5">
          Управлявайте заглавен банер/видео, скрийншот на отзив, галерията „Деца с умения“, дейностите и администраторската парола.
        </p>
      </div>

      <MediaManager
        initialHeroUrl={heroUrl}
        initialKidsGallery={kidsRes.items || []}
        initialServiceMedia={servicesRes.items || []}
        initialHeroVideoUrl={settings.heroVideoUrl || ""}
        initialHeroMediaType={settings.heroMediaType || "image"}
        initialReviewScreenshotUrl={settings.reviewScreenshotUrl || ""}
        initialReviewsImages={reviewsImagesRes.items || []}
        initialKidsGalleryOrder={settings.kidsGalleryOrder || []}
        showSecurityTab={true}
        initialTab="hero"
        currentEmail={targetEmail}
      />
    </div>
  );
}
