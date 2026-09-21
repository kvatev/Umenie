"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  ClipboardList,
  CalendarDays,
  Image as ImageIcon,
  LogOut,
  Menu,
  X,
  ExternalLink,
} from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  {
    label: "Табло",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    label: "Заявки за записване",
    href: "/admin/bookings",
    icon: ClipboardList,
  },
  {
    label: "Управление на график",
    href: "/admin/schedule",
    icon: CalendarDays,
  },
  {
    label: "Банери и Снимки",
    href: "/admin/media",
    icon: ImageIcon,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // If on login page, don't show the admin sidebar
  if (pathname === "/admin/login") {
    return null;
  }

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  const navLinks = (
    <nav className="space-y-1.5 px-3">
      {NAV_ITEMS.map((item) => {
        const isActive =
          item.href === "/admin"
            ? pathname === "/admin"
            : pathname.startsWith(item.href);
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setMobileMenuOpen(false)}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-2xl font-heading text-sm font-bold transition-all",
              isActive
                ? "bg-brand-purple text-white shadow-button"
                : "text-brand-dark/80 hover:bg-brand-purple/10 hover:text-brand-purple"
            )}
          >
            <Icon className={cn("w-5 h-5 shrink-0", isActive ? "text-white" : "text-brand-purple")} />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* MOBILE TOP BAR */}
      <div className="lg:hidden sticky top-0 z-40 bg-white border-b border-brand-purple/15 px-4 py-3 flex items-center justify-between shadow-sm">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="relative w-28 h-8">
            <Image src="/images/logo.webp" alt="УМеНИе" fill className="object-contain" />
          </div>
          <span className="text-[11px] font-bold uppercase tracking-wider bg-brand-purple/10 text-brand-purple px-2 py-0.5 rounded-md">
            Админ
          </span>
        </Link>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-xl text-brand-dark hover:bg-brand-purple/10 focus:outline-none"
          aria-label="Меню"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* MOBILE DRAWER */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-brand-dark/50 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />

          <div className="relative w-72 max-w-[80vw] bg-white h-full flex flex-col justify-between p-4 z-10 shadow-2xl animate-fade-in">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-brand-purple/10">
                <div className="relative w-28 h-8">
                  <Image src="/images/logo.webp" alt="УМеНИе" fill className="object-contain" />
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 rounded-lg text-brand-muted hover:text-brand-dark"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {navLinks}
            </div>

            <div className="pt-4 border-t border-brand-purple/10 space-y-2">
              <Link
                href="/"
                target="_blank"
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-semibold text-brand-muted hover:text-brand-purple transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Преглед на уебсайта</span>
              </Link>

              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="w-full flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>{isLoggingOut ? "Излизане..." : "Изход от панела"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DESKTOP FIXED SIDEBAR */}
      <aside className="hidden lg:flex w-64 xl:w-72 bg-white border-r border-brand-purple/15 flex-col justify-between fixed inset-y-0 left-0 z-30 shadow-card">
        {/* Top brand */}
        <div>
          <div className="p-6 pb-8 border-b border-brand-purple/10">
            <Link href="/admin" className="flex items-center gap-3">
              <div className="relative w-32 h-10">
                <Image src="/images/logo.webp" alt="УМеНИе" fill className="object-contain" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-brand-purple/10 text-brand-purple px-2 py-0.5 rounded-md">
                Admin
              </span>
            </Link>
          </div>

          {/* Nav items */}
          <div className="py-6">{navLinks}</div>
        </div>

        {/* Bottom controls */}
        <div className="p-4 border-t border-brand-purple/10 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl text-xs font-semibold text-brand-muted hover:text-brand-purple hover:bg-brand-purple/5 transition-colors"
          >
            <ExternalLink className="w-4 h-4 text-brand-purple/70" />
            <span>Преглед на уебсайта</span>
          </Link>

          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-2xl text-xs font-bold text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>{isLoggingOut ? "Излизане..." : "Изход"}</span>
          </button>
        </div>
      </aside>
    </>
  );
}
