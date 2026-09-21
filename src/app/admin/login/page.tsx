"use client";

import React, { useState, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, Mail, Eye, EyeOff, Loader2, ArrowLeft } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!email.trim() || !password) {
      setErrorMsg("Моля, попълнете имейл и парола.");
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          setErrorMsg("Невалиден имейл адрес или парола.");
        } else {
          setErrorMsg(error.message || "Грешка при вход в системата.");
        }
        setIsLoading(false);
        return;
      }

      if (data?.session) {
        // Successful login -> Redirect
        router.push(redirectUrl);
        router.refresh();
      }
    } catch {
      setErrorMsg("Възникна неочаквана грешка при връзка със сървъра.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f1f2f6] flex flex-col justify-center items-center p-4 sm:p-6">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 sm:p-10 border border-brand-purple/15 relative overflow-hidden animate-fade-in">
        {/* Top Decorative bar */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-brand-purple to-[#a29bfe]" />

        {/* Logo and header */}
        <div className="text-center space-y-3 mb-8">
          <Link href="/" className="inline-block relative w-36 h-12 mb-2 hover:opacity-90 transition-opacity">
            <Image
              src="/images/logo.webp"
              alt="УМеНИе"
              fill
              priority
              className="object-contain"
            />
          </Link>
          <h1 className="font-heading font-bold text-2xl sm:text-3xl text-brand-dark">
            ВХОД В <span className="text-brand-purple">АДМИН ПАНЕЛ</span>
          </h1>
          <p className="text-brand-muted text-xs sm:text-sm font-sans">
            Въведете вашите служебни данни за достъп до заявките и графика.
          </p>
        </div>

        {/* Error notification */}
        {errorMsg && (
          <div className="mb-6 p-3.5 rounded-2xl bg-red-50 text-red-600 text-xs sm:text-sm font-medium border border-red-200 flex items-center gap-2 animate-shake">
            <span>⚠️</span>
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-xs font-bold text-brand-dark uppercase tracking-wider mb-1.5">
              Имейл адрес
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-brand-muted">
                <Mail className="w-4 h-4 text-brand-purple/70" />
              </div>
              <input
                type="email"
                required
                autoComplete="email"
                placeholder="admin@umenie.bg"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-brand-bg text-sm text-brand-dark border border-brand-purple/20 focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-brand-purple transition-all"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-bold text-brand-dark uppercase tracking-wider mb-1.5">
              Парола
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-brand-muted">
                <Lock className="w-4 h-4 text-brand-purple/70" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                required
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-11 py-3 rounded-2xl bg-brand-bg text-sm text-brand-dark border border-brand-purple/20 focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-brand-purple transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-brand-muted hover:text-brand-purple transition-colors focus:outline-none"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-6 rounded-full bg-brand-purple text-white font-heading font-bold text-sm sm:text-base shadow-button hover:bg-brand-purple-hover hover:shadow-button-hover transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] disabled:opacity-70 mt-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Влизане в системата...</span>
              </>
            ) : (
              <span>Влез в панела →</span>
            )}
          </button>
        </form>

        {/* Back to site */}
        <div className="mt-8 pt-6 border-t border-brand-purple/10 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-brand-muted hover:text-brand-purple transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Обратно към уебсайта</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#f1f2f6] flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-brand-purple animate-spin" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
