import React from "react";
import { Metadata } from "next";
import { ServicesPageEditor } from "@/components/admin/pages/ServicesPageEditor";
import { getSiteSettings } from "@/lib/site-settings";

export const metadata: Metadata = {
  title: "Редактор на Страница Услуги | Административен панел",
};

export const dynamic = "force-dynamic";

export default async function AdminServicesEditorPage() {
  const settings = await getSiteSettings();

  return <ServicesPageEditor initialSettings={settings} />;
}
