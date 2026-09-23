import React from "react";
import { Metadata } from "next";
import { getSiteSettings } from "@/lib/site-settings";
import { AdminContactsManager } from "@/components/admin/AdminContactsManager";

export const metadata: Metadata = {
  title: "Контакти и социални мрежи | Административен панел",
};

export const dynamic = "force-dynamic";

export default async function AdminContactsPage() {
  const settings = await getSiteSettings();

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs font-bold text-brand-purple uppercase tracking-wider">
          Управление на сайта
        </span>
        <h1 className="font-heading font-bold text-2xl sm:text-3xl text-brand-dark mt-1">
          Контактна информация и социални мрежи
        </h1>
        <p className="text-brand-muted text-xs sm:text-sm font-sans mt-0.5">
          Управлявайте официалния телефон, адрес, имейл и връзките към Facebook и Instagram от едно място.
        </p>
      </div>

      <AdminContactsManager initialSettings={settings} />
    </div>
  );
}
