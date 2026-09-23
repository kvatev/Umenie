"use server";

import { revalidatePath } from "next/cache";
import { createClient, supabaseAdmin } from "@/lib/supabase/server";

export async function changeAdminPasswordAction(formData: FormData) {
  const newPassword = (formData.get("newPassword") as string) || "";
  const confirmPassword = (formData.get("confirmPassword") as string) || "";
  const email = (formData.get("email") as string) || "admin@umenie.net";

  if (!newPassword || newPassword.length < 8) {
    return {
      success: false,
      message: "Новата парола трябва да бъде поне 8 символа.",
    };
  }

  if (newPassword !== confirmPassword) {
    return {
      success: false,
      message: "Паролите не съвпадат. Моля, проверете отново.",
    };
  }

  // 1. First attempt: update via active authenticated session cookie
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const { error: sessionUpdateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (!sessionUpdateError) {
        revalidatePath("/admin/settings");
        return {
          success: true,
          message: "Паролата е променена успешно! Можете да я използвате веднага.",
        };
      }
    }
  } catch {
    // If session update is unavailable, proceed to service role admin client
  }

  // 2. Second attempt: service_role admin client
  try {
    const { data: usersData, error: listError } = await supabaseAdmin.auth.admin.listUsers();
    if (listError) {
      return { success: false, message: `Грешка при проверка на потребителите: ${listError.message}` };
    }

    // Find the target admin user (check admin@umenie.net or admin@umenie.bg)
    let targetUser = usersData.users.find(
      (u) => u.email?.toLowerCase() === email.trim().toLowerCase()
    );

    if (!targetUser) {
      targetUser = usersData.users.find(
        (u) => u.email?.toLowerCase() === "admin@umenie.net"
      );
    }

    if (!targetUser) {
      // Create admin@umenie.net if not found
      const { error: createError } = await supabaseAdmin.auth.admin.createUser({
        email: "admin@umenie.net",
        password: newPassword,
        email_confirm: true,
      });

      if (createError) {
        return { success: false, message: `Грешка при създаване: ${createError.message}` };
      }

      revalidatePath("/admin/settings");
      return {
        success: true,
        message: "Паролата за admin@umenie.net е зададена успешно!",
      };
    }

    // Update user password and ensure email confirmed
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(targetUser.id, {
      password: newPassword,
      email_confirm: true,
    });

    if (updateError) {
      return { success: false, message: `Грешка при обновяване: ${updateError.message}` };
    }

    revalidatePath("/admin/settings");
    return {
      success: true,
      message: "Паролата е променена успешно! Можете да я използвате веднага при следващ вход.",
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return { success: false, message: `Сървърна грешка: ${msg}` };
  }
}
