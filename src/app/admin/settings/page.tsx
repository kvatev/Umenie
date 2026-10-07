import React from "react";
import { Metadata } from "next";
import { AdminContactsManager } from "@/components/admin/AdminContactsManager";
import { AdminSecuritySettings } from "@/components/admin/AdminSecuritySettings";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { getSiteSettings } from "@/lib/site-settings";

export const metadata: Metadata = {
  title: "Основни настройки | Административен панел",
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

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <span className="text-xs font-bold text-brand-purple uppercase tracking-wider">
          Конфигурация
        </span>
        <h1 className="font-heading font-bold text-2xl sm:text-3xl text-brand-dark mt-1">
          Основни настройки
        </h1>
        <p className="text-brand-muted text-xs sm:text-sm font-sans mt-0.5">
          Управлявайте глобалната контактна информация, социалните мрежи и сигурността на администраторския профил.
        </p>
      </div>

      {/* 1. Global Contact Info & Socials */}
      <AdminContactsManager initialSettings={settings} />

      {/* 2. Admin Security & Password Reset */}
      <AdminSecuritySettings currentEmail={targetEmail} />
    </div>
  );
}
