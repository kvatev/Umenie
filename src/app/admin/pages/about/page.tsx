import React from "react";
import { Metadata } from "next";
import { AboutPageEditor } from "@/components/admin/pages/AboutPageEditor";
import { getSiteSettings } from "@/lib/site-settings";
import { listReviewsImagesAction } from "@/actions/admin-media";

export const metadata: Metadata = {
  title: "Редактор на Страница За Нас | Административен панел",
};

export const dynamic = "force-dynamic";

export default async function AdminAboutEditorPage() {
  const settings = await getSiteSettings();
  const reviewsRes = await listReviewsImagesAction();

  return (
    <AboutPageEditor
      initialSettings={settings}
      initialReviewsImages={reviewsRes.items || []}
    />
  );
}
