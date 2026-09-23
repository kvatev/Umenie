import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const key = url.searchParams.get("key");
  const action = url.searchParams.get("action"); // 'list' | 'set'
  const email = url.searchParams.get("email");
  const password = url.searchParams.get("password");

  if (key !== "umenie-fix-admin-2026") {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    if (action === "list") {
      const { data, error } = await supabaseAdmin.auth.admin.listUsers();
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      return NextResponse.json({
        users: data.users.map((u) => ({
          id: u.id,
          email: u.email,
          email_confirmed_at: u.email_confirmed_at,
          last_sign_in_at: u.last_sign_in_at,
          created_at: u.created_at,
        })),
      });
    }

    if (action === "set") {
      if (!email || !password) {
        return NextResponse.json(
          { error: "Please provide both 'email' and 'password' query parameters." },
          { status: 400 }
        );
      }

      // Check if user already exists
      const { data: listData, error: listError } = await supabaseAdmin.auth.admin.listUsers();
      if (listError) {
        return NextResponse.json({ error: listError.message }, { status: 500 });
      }

      const existingUser = listData.users.find(
        (u) => u.email?.toLowerCase() === email.trim().toLowerCase()
      );

      if (existingUser) {
        const { data, error } = await supabaseAdmin.auth.admin.updateUserById(
          existingUser.id,
          {
            password: password,
            email_confirm: true,
          }
        );
        if (error) {
          return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json({
          success: true,
          action: "updated",
          message: `Паролата за ${email} е обновена успешно и акаунтът е потвърден!`,
          user: { id: data.user.id, email: data.user.email },
        });
      } else {
        const { data, error } = await supabaseAdmin.auth.admin.createUser({
          email: email.trim(),
          password: password,
          email_confirm: true,
        });
        if (error) {
          return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json({
          success: true,
          action: "created",
          message: `Админ акаунтът ${email} е създаден успешно и потвърден!`,
          user: { id: data.user.id, email: data.user.email },
        });
      }
    }

    return NextResponse.json({
      status: "ready",
      instructions: "Pass action=list to inspect users, or action=set&email=...&password=... to set credentials.",
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
