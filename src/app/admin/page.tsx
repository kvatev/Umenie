import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ClipboardList,
  CalendarDays,
  CheckCircle2,
  Clock,
  ArrowRight,
  Phone,
  User,
  Home,
  Palette,
  BookOpen,
  Settings,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { getActivityIcon } from "@/lib/schedule-icons";

export const dynamic = "force-dynamic";

interface BookingItem {
  id: string;
  activity_name: string;
  child_name: string;
  child_age: string;
  parent_name: string;
  phone: string;
  email: string | null;
  status: "pending" | "confirmed" | "declined" | "cancelled";
  created_at: string;
}

export default async function AdminDashboardPage() {
  let totalBookings = 0;
  let pendingBookings = 0;
  let confirmedBookings = 0;
  let activeEvents = 0;
  let recentBookings: BookingItem[] = [];

  try {
    // 1. Bookings statistics
    const { data: bookingsData } = await supabaseAdmin
      .from("bookings")
      .select("id, status, activity_name, child_name, child_age, parent_name, phone, email, created_at")
      .order("created_at", { ascending: false });

    if (bookingsData) {
      totalBookings = bookingsData.length;
      pendingBookings = bookingsData.filter((b) => b.status === "pending").length;
      confirmedBookings = bookingsData.filter((b) => b.status === "confirmed").length;
      recentBookings = bookingsData.slice(0, 5) as BookingItem[];
    }

    // 2. Schedule events statistics
    const { count: eventsCount } = await supabaseAdmin
      .from("schedule_events")
      .select("*", { count: "exact", head: true })
      .neq("is_active", false);

    if (eventsCount !== null && eventsCount > 0) {
      activeEvents = eventsCount;
    } else {
      const { count: schedulesCount } = await supabaseAdmin
        .from("schedules")
        .select("*", { count: "exact", head: true })
        .eq("is_active", true);
      activeEvents = schedulesCount || 0;
    }
  } catch (err) {
    console.error("Dashboard data fetch error:", err);
  }

  const currentDateFormatted = new Intl.DateTimeFormat("bg-BG", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date());

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl shadow-card border border-brand-purple/15">
        <div>
          <span className="text-xs font-bold text-brand-purple uppercase tracking-wider">
            Контролно табло
          </span>
          <h1 className="font-heading font-bold text-2xl sm:text-3xl lg:text-4xl text-brand-dark mt-1">
            Добре дошли в <span className="text-brand-purple">УМеНИе</span>
          </h1>
          <p className="text-brand-muted text-xs sm:text-sm capitalize mt-1">
            {currentDateFormatted}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-brand-bg text-brand-purple font-heading font-bold text-xs sm:text-sm hover:bg-brand-purple/10 transition-all text-center border border-brand-purple/20"
          >
            <span>Преглед на сайта</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <Link
            href="/admin/bookings"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-brand-purple text-white font-heading font-bold text-xs sm:text-sm shadow-button hover:bg-brand-purple-hover transition-all text-center"
          >
            <span>Всички заявки ({pendingBookings})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* 1. Key Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Pending */}
        <Link
          href="/admin/bookings"
          className="bg-white p-6 rounded-3xl shadow-card border border-brand-purple/15 hover:border-brand-purple hover:shadow-lg transition-all duration-300 group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
              Чакащи
            </span>
          </div>
          <div className="space-y-1">
            <p className="font-heading font-bold text-3xl text-brand-dark group-hover:text-brand-purple transition-colors">
              {pendingBookings}
            </p>
            <p className="text-xs font-semibold text-brand-muted">
              Нови заявки за потвърждение
            </p>
          </div>
        </Link>

        {/* Card 2: Confirmed */}
        <Link
          href="/admin/bookings"
          className="bg-white p-6 rounded-3xl shadow-card border border-brand-purple/15 hover:border-brand-purple hover:shadow-lg transition-all duration-300 group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              Потвърдени
            </span>
          </div>
          <div className="space-y-1">
            <p className="font-heading font-bold text-3xl text-brand-dark group-hover:text-brand-purple transition-colors">
              {confirmedBookings}
            </p>
            <p className="text-xs font-semibold text-brand-muted">
              Успешно записани деца
            </p>
          </div>
        </Link>

        {/* Card 3: Events in Schedule */}
        <Link
          href="/admin/pages/schedule"
          className="bg-white p-6 rounded-3xl shadow-card border border-brand-purple/15 hover:border-brand-purple hover:shadow-lg transition-all duration-300 group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <CalendarDays className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
              График
            </span>
          </div>
          <div className="space-y-1">
            <p className="font-heading font-bold text-3xl text-brand-dark group-hover:text-brand-purple transition-colors">
              {activeEvents}
            </p>
            <p className="text-xs font-semibold text-brand-muted">
              Активни събития в програмата
            </p>
          </div>
        </Link>

        {/* Card 4: Total Bookings */}
        <Link
          href="/admin/bookings"
          className="bg-white p-6 rounded-3xl shadow-card border border-brand-purple/15 hover:border-brand-purple hover:shadow-lg transition-all duration-300 group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 text-brand-purple flex items-center justify-center">
              <ClipboardList className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-brand-purple bg-brand-purple/10 px-2.5 py-1 rounded-full border border-brand-purple/20">
              Всички
            </span>
          </div>
          <div className="space-y-1">
            <p className="font-heading font-bold text-3xl text-brand-dark group-hover:text-brand-purple transition-colors">
              {totalBookings}
            </p>
            <p className="text-xs font-semibold text-brand-muted">
              Общо постъпили резервации
            </p>
          </div>
        </Link>
      </div>

      {/* 2. Quick Action Shortcuts to Edit Pages */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl shadow-card border border-brand-purple/15 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-brand-purple/10">
          <div>
            <h2 className="font-heading font-bold text-lg text-brand-dark">
              Бързи действия: Управление по страници
            </h2>
            <p className="text-xs text-brand-muted">
              Изберете секция или страница, която искате да редактирате
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
          {/* Action 1: Home */}
          <Link
            href="/admin/pages/home"
            className="p-4 rounded-2xl bg-brand-bg/60 border border-brand-purple/15 hover:border-brand-purple hover:bg-brand-purple/5 transition-all group flex flex-col justify-between space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-brand-purple flex items-center justify-center group-hover:scale-110 transition-transform">
                <Home className="w-5 h-5" />
              </div>
              <ArrowRight className="w-4 h-4 text-brand-muted group-hover:text-brand-purple group-hover:translate-x-1 transition-all" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-sm text-brand-dark group-hover:text-brand-purple transition-colors">
                Страница: Начало
              </h3>
              <p className="text-xs text-brand-muted mt-0.5 line-clamp-2">
                Главен банер/видео, въртележка „Деца с умения“, снимка на отзива
              </p>
            </div>
          </Link>

          {/* Action 2: Services */}
          <Link
            href="/admin/pages/services"
            className="p-4 rounded-2xl bg-brand-bg/60 border border-brand-purple/15 hover:border-brand-purple hover:bg-brand-purple/5 transition-all group flex flex-col justify-between space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Palette className="w-5 h-5" />
              </div>
              <ArrowRight className="w-4 h-4 text-brand-muted group-hover:text-brand-purple group-hover:translate-x-1 transition-all" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-sm text-brand-dark group-hover:text-brand-purple transition-colors">
                Страница: Услуги
              </h3>
              <p className="text-xs text-brand-muted mt-0.5 line-clamp-2">
                Текстове, слогани, булети, снимки page-1/2 и слайдери за 6-те дейности
              </p>
            </div>
          </Link>

          {/* Action 3: About */}
          <Link
            href="/admin/pages/about"
            className="p-4 rounded-2xl bg-brand-bg/60 border border-brand-purple/15 hover:border-brand-purple hover:bg-brand-purple/5 transition-all group flex flex-col justify-between space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <BookOpen className="w-5 h-5" />
              </div>
              <ArrowRight className="w-4 h-4 text-brand-muted group-hover:text-brand-purple group-hover:translate-x-1 transition-all" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-sm text-brand-dark group-hover:text-brand-purple transition-colors">
                Страница: За нас
              </h3>
              <p className="text-xs text-brand-muted mt-0.5 line-clamp-2">
                Основни ценности, принципи и мениджър на отзиви от родители
              </p>
            </div>
          </Link>

          {/* Action 4: Schedule */}
          <Link
            href="/admin/pages/schedule"
            className="p-4 rounded-2xl bg-brand-bg/60 border border-brand-purple/15 hover:border-brand-purple hover:bg-brand-purple/5 transition-all group flex flex-col justify-between space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                <CalendarDays className="w-5 h-5" />
              </div>
              <ArrowRight className="w-4 h-4 text-brand-muted group-hover:text-brand-purple group-hover:translate-x-1 transition-all" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-sm text-brand-dark group-hover:text-brand-purple transition-colors">
                Календар и График
              </h3>
              <p className="text-xs text-brand-muted mt-0.5 line-clamp-2">
                Добавяне и редактиране на събития, качване на седмичен PDF файл
              </p>
            </div>
          </Link>
        </div>
      </div>

      {/* 3. Recent Bookings Table (Latest 5 bookings) */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-card border border-brand-purple/15 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-brand-purple/10">
          <div>
            <h2 className="font-heading font-bold text-lg text-brand-dark">
              Последни постъпили заявки за записване
            </h2>
            <p className="text-xs text-brand-muted">
              Преглед на най-новите 5 получени резервации от онлайн графика
            </p>
          </div>
          <Link
            href="/admin/bookings"
            className="text-xs font-bold text-brand-purple hover:underline flex items-center gap-1 shrink-0"
          >
            <span>Към всички заявки</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentBookings.length > 0 ? (
          <div className="divide-y divide-brand-purple/10">
            {recentBookings.map((b) => {
              const iconUrl = getActivityIcon(b.activity_name);

              return (
                <div
                  key={b.id}
                  className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-brand-bg/50 px-2 rounded-2xl transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative w-11 h-11 rounded-full overflow-hidden bg-white border border-brand-purple/20 shrink-0 shadow-xs flex items-center justify-center">
                      <Image
                        src={iconUrl}
                        alt={b.activity_name}
                        width={44}
                        height={44}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="space-y-0.5 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-heading font-bold text-sm text-brand-dark">
                          {b.child_name} ({b.child_age})
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            b.status === "confirmed"
                              ? "bg-emerald-100 text-emerald-800"
                              : b.status === "declined" || b.status === "cancelled"
                              ? "bg-red-100 text-red-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {b.status === "confirmed"
                            ? "Потвърдена"
                            : b.status === "declined" || b.status === "cancelled"
                            ? "Отказана"
                            : "Чакаща"}
                        </span>
                      </div>

                      <p className="text-xs text-brand-purple font-semibold truncate">
                        {b.activity_name}
                      </p>

                      <div className="flex items-center gap-3 text-[11px] text-brand-muted">
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3 text-brand-purple/60" />
                          {b.parent_name}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
                    <a
                      href={`tel:${b.phone}`}
                      className="px-3.5 py-1.5 rounded-xl bg-brand-purple/10 text-brand-purple hover:bg-brand-purple hover:text-white transition-colors text-xs font-bold flex items-center gap-1.5 shadow-xs"
                      title="Обади се"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>{b.phone}</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-10 text-brand-muted text-sm font-sans">
            Все още няма получени заявки в базата данни.
          </div>
        )}
      </div>
    </div>
  );
}
