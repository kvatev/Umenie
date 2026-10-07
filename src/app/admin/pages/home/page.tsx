import React from "react";
import { Metadata } from "next";
import { HomePageEditor } from "@/components/admin/pages/HomePageEditor";
import { getSiteSettings } from "@/lib/site-settings";
import { listMediaFolderAction } from "@/actions/admin-media";

export const metadata: Metadata = {
  title: "Редактор на Начална страница | Административен панел",
};

export const dynamic = "force-dynamic";

export default async function AdminHomePageEditorPage() {
  const settings = await getSiteSettings();
  const kidsRes = await listMediaFolderAction("kids-gallery");

  return (
    <HomePageEditor
      initialHeroUrl={settings.heroBannerUrl || null}
      initialHeroVideoUrl={settings.heroVideoUrl || ""}
      initialHeroMediaType={settings.heroMediaType || "image"}
      initialReviewScreenshotUrl={settings.reviewScreenshotUrl || ""}
      initialKidsGallery={kidsRes.items || []}
      initialKidsGalleryOrder={settings.kidsGalleryOrder || []}
    />
  );
}
