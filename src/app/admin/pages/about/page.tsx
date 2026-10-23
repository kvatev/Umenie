import React from "react";
import { Metadata } from "next";
import { AboutPageEditor } from "@/components/admin/pages/AboutPageEditor";
import { getSiteSettings } from "@/lib/site-settings";
import { listReviewsImagesAction } from "@/actions/admin-media";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Редактор на Страница За Нас | Административен панел",
};

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
