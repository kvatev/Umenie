import React from "react";
import { Metadata } from "next";
import { AdminSecuritySettings } from "@/components/admin/AdminSecuritySettings";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const metadata: Metadata = {
  title: "Сигурност и парола | Административен панел",
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

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs font-bold text-brand-purple uppercase tracking-wider">
          Сигурност и настройки
        </span>
        <h1 className="font-heading font-bold text-2xl sm:text-3xl text-brand-dark mt-1">
          Управление на паролата и профила
        </h1>
        <p className="text-brand-muted text-xs sm:text-sm font-sans mt-0.5">
          Променяйте паролата за вход и управлявайте настройките за сигурност на администратора.
        </p>
      </div>

      <AdminSecuritySettings currentEmail={targetEmail} />
    </div>
  );
}
