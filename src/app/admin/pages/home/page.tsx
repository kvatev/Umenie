import React from "react";
import { Metadata } from "next";
import { HomePageEditor } from "@/components/admin/pages/HomePageEditor";
import { getSiteSettings } from "@/lib/site-settings";
import { listMediaFolderAction, listReviewsImagesAction } from "@/actions/admin-media";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Редактор на Начална страница | Административен панел",
};

export default async function AdminHomePageEditorPage() {
  const [settings, kidsRes, reviewsRes] = await Promise.all([
    getSiteSettings(),
    listMediaFolderAction("kids-gallery"),
    listReviewsImagesAction(),
  ]);

  return (
    <HomePageEditor
      initialHeroUrl={settings.heroBannerUrl || null}
      initialHeroVideoUrl={settings.heroVideoUrl || ""}
      initialHeroMediaType={settings.heroMediaType || "image"}
      initialHeroTitle={settings.heroTitle || ""}
      initialHeroTitleEn={settings.heroTitleEn || ""}
      initialHeroSubtitle={settings.heroSubtitle || ""}
      initialHeroSubtitleEn={settings.heroSubtitleEn || ""}
      initialReviewScreenshotUrl={settings.reviewScreenshotUrl || ""}
      initialReviewsImages={reviewsRes.items || []}
      initialKidsGallery={kidsRes.items || []}
      initialKidsGalleryOrder={settings.kidsGalleryOrder || []}
      initialHeroTitleEn={settings.heroTitleEn || ""}
    />
  );
}
