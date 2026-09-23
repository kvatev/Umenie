"use client";

import React, { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ShieldCheck,
  KeyRound,
  Eye,
  EyeOff,
  CheckCircle2,
  Lock,
  Mail,
  Loader2,
  AlertCircle,
  ExternalLink,
  Sparkles,
  UserCheck,
} from "lucide-react";
import { changeAdminPasswordAction } from "@/actions/admin-auth";
import { supabase } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

interface AdminSecuritySettingsProps {
  currentEmail: string;
}

export function AdminSecuritySettings({ currentEmail }: AdminSecuritySettingsProps) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (newPassword.length < 8) {
      setMessage({ type: "error", text: "Паролата трябва да съдържа най-малко 8 символа." });
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "Двете пароли не съвпадат. Моля, проверете отново." });
      return;
    }

    startTransition(async () => {
      // 1. Direct authenticated client update
      try {
        const { error: clientError } = await supabase.auth.updateUser({
          password: newPassword,
        });

        if (!clientError) {
          setMessage({
            type: "success",
            text: "Паролата е променена успешно! Можете да я използвате веднага при следващ вход.",
          });
          setNewPassword("");
          setConfirmPassword("");
          return;
        }
      } catch {
        // Fall back to server action
      }

      // 2. Server action fallback
      const formData = new FormData();
      formData.append("newPassword", newPassword);
      formData.append("confirmPassword", confirmPassword);
      formData.append("email", currentEmail);

      const res = await changeAdminPasswordAction(formData);
      if (res.success) {
        setMessage({ type: "success", text: res.message });
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setMessage({ type: "error", text: res.message || "Възникна грешка при смяната на паролата." });
      }
    });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Profile Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-brand-purple/15 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-brand-purple/10 text-brand-purple flex items-center justify-center shrink-0 border border-brand-purple/20">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-brand-purple uppercase tracking-wider">
                Главен администраторски профил
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Активен
              </span>
            </div>
            <h2 className="font-heading font-black text-xl sm:text-2xl text-brand-dark mt-1">
              {currentEmail}
            </h2>
            <p className="text-xs text-brand-muted font-sans mt-0.5">
              Пълен достъп до графика, заявките от родители, мултимедията и настройките на клуб „УМеНИе“.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-brand-muted bg-brand-bg px-4 py-2.5 rounded-2xl border border-brand-purple/15 shrink-0">
          <Lock className="w-4 h-4 text-brand-purple" />
          <span>Supabase Auth • Защитена сесия</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form: Change Password */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-brand-purple/15 space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-brand-purple/10">
            <div className="w-10 h-10 rounded-2xl bg-brand-purple-light text-brand-purple flex items-center justify-center">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-lg text-brand-dark">
                Смяна на администраторската парола
              </h3>
              <p className="text-xs text-brand-muted">
                Въведете нова парола за акаунта <strong>{currentEmail}</strong>
              </p>
            </div>
          </div>

          {message && (
            <div
              className={cn(
                "p-4 rounded-2xl text-xs sm:text-sm font-medium border flex items-center gap-2.5 animate-fade-in",
                message.type === "success"
                  ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                  : "bg-red-50 text-red-800 border-red-200"
              )}
            >
              {message.type === "success" ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
              )}
              <span>{message.text}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Target Email display */}
            <div>
              <label className="block text-xs font-bold text-brand-dark uppercase tracking-wider mb-1.5">
                Имейл адрес на акаунта
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-brand-muted">
                  <Mail className="w-4 h-4 text-brand-purple/70" />
                </div>
                <input
                  type="email"
                  disabled
                  value={currentEmail}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-gray-100 text-brand-dark/70 text-sm font-semibold border border-brand-purple/10 cursor-not-allowed"
                />
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="block text-xs font-bold text-brand-dark uppercase tracking-wider mb-1.5">
                Нова парола
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-brand-muted">
                  <Lock className="w-4 h-4 text-brand-purple/70" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Минимум 8 символа"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full pl-10 pr-11 py-3 rounded-2xl bg-brand-bg text-sm text-brand-dark border border-brand-purple/20 focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-brand-purple transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-brand-muted hover:text-brand-purple transition-colors focus:outline-none"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm New Password */}
            <div>
              <label className="block text-xs font-bold text-brand-dark uppercase tracking-wider mb-1.5">
                Потвърдете новата парола
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-brand-muted">
                  <Lock className="w-4 h-4 text-brand-purple/70" />
                </div>
                <input
                  type={showConfirm ? "text" : "password"}
                  required
                  placeholder="Повторете новата парола"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-11 py-3 rounded-2xl bg-brand-bg text-sm text-brand-dark border border-brand-purple/20 focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-brand-purple transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-brand-muted hover:text-brand-purple transition-colors focus:outline-none"
                  tabIndex={-1}
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Password Requirement Notes */}
            <div className="p-4 rounded-2xl bg-brand-bg/80 border border-brand-purple/15 text-xs text-brand-muted space-y-1">
              <p className="font-bold text-brand-dark">Изисквания за сигурност:</p>
              <ul className="list-disc pl-4 space-y-0.5">
                <li className={newPassword.length >= 8 ? "text-emerald-700 font-semibold" : ""}>
                  Минимум 8 символа
                </li>
                <li>Препоръчително е да съдържа букви, цифри и специален знак</li>
                <li className={newPassword && newPassword === confirmPassword ? "text-emerald-700 font-semibold" : ""}>
                  Двете полета трябва точно да съвпадат
                </li>
              </ul>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isPending || !newPassword || !confirmPassword}
              className="w-full py-3.5 px-6 rounded-full bg-brand-purple text-white font-heading font-bold text-sm sm:text-base shadow-button hover:bg-brand-purple-hover hover:shadow-button-hover transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] disabled:opacity-60"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Запазване на новата парола...</span>
                </>
              ) : (
                <>
                  <KeyRound className="w-4 h-4" />
                  <span>Запази новата парола</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right: Live Preview Snippet of Login Screen */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-3xl p-6 shadow-card border border-brand-purple/15 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-brand-purple/10">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <h4 className="font-heading font-bold text-sm text-brand-dark">
                  Отрязък на живо: Форма за вход (/admin/login)
                </h4>
              </div>
              <Link
                href="/admin/login"
                target="_blank"
                className="text-xs font-bold text-brand-purple hover:underline inline-flex items-center gap-1"
              >
                <span>Виж входа</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>

            {/* Mockup card of login */}
            <div className="rounded-2xl border border-brand-purple/20 bg-brand-bg p-5 shadow-inner space-y-4 text-center">
              <div className="relative w-28 h-9 mx-auto">
                <Image src="/images/logo.webp" alt="УМеНИе" fill className="object-contain" />
              </div>

              <div>
                <p className="font-heading font-bold text-sm text-brand-dark">
                  ВХОД В <span className="text-brand-purple">АДМИН ПАНЕЛ</span>
                </p>
                <p className="text-[11px] text-brand-muted mt-0.5">
                  Служебен достъп с новия имейл
                </p>
              </div>

              <div className="space-y-2 text-left text-xs">
                <div>
                  <span className="block text-[10px] font-bold uppercase text-brand-dark mb-1">
                    Имейл адрес
                  </span>
                  <div className="p-2.5 rounded-xl bg-white border border-brand-purple/20 text-brand-purple font-semibold flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5" />
                    <span>admin@umenie.net</span>
                  </div>
                </div>

                <div>
                  <span className="block text-[10px] font-bold uppercase text-brand-dark mb-1">
                    Парола
                  </span>
                  <div className="p-2.5 rounded-xl bg-white border border-brand-purple/20 text-brand-muted flex items-center gap-2">
                    <Lock className="w-3.5 h-3.5" />
                    <span>••••••••••••</span>
                  </div>
                </div>
              </div>

              <div className="py-2.5 rounded-full bg-brand-purple text-white text-xs font-heading font-bold shadow-button">
                Влез в панела →
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-brand-purple-light/70 border border-brand-purple/15 text-xs text-brand-dark/80 space-y-1">
              <p className="font-bold text-brand-purple flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Забележка за достъпа:</span>
              </p>
              <p className="leading-relaxed">
                След като промените паролата, новият код влиза в сила веднага за потребител <strong>{currentEmail}</strong>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
