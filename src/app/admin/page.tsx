import React from "react";
import Link from "next/link";
import {
  ClipboardList,
  CalendarDays,
  Image as ImageIcon,
  CheckCircle2,
  Clock,
  ArrowRight,
  Phone,
  User,
} from "lucide-react";
import { supabaseAdmin } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

interface BookingItem {
  id: string;
  activity_name: string;
  child_name: string;
  child_age: string;
  parent_name: string;
  phone: string;
  email: string | null;
  status: "pending" | "confirmed" | "declined";
  created_at: string;
}

export default async function AdminDashboardPage() {
  // Fetch metrics and recent bookings
  let totalBookings = 0;
  let pendingBookings = 0;
  let confirmedBookings = 0;
  let activeSchedules = 0;
  let recentBookings: BookingItem[] = [];

  try {
    // 1. Bookings stats
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

    // 2. Schedules stats
    const { count } = await supabaseAdmin
      .from("schedules")
      .select("*", { count: "exact", head: true })
      .eq("is_active", true);

    activeSchedules = count || 0;
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
            Контролен панел
          </span>
          <h1 className="font-heading font-bold text-2xl sm:text-3xl lg:text-4xl text-brand-dark mt-1">
            Добре дошли в <span className="text-brand-purple">УМеНИе</span>
          </h1>
          <p className="text-brand-muted text-xs sm:text-sm capitalize mt-1">
            {currentDateFormatted}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/schedule"
            className="px-5 py-2.5 rounded-full bg-brand-purple text-white font-heading font-bold text-xs sm:text-sm shadow-button hover:bg-brand-purple-hover transition-all text-center"
          >
            + Ново занятие
          </Link>
          <Link
            href="/admin/bookings"
            className="px-5 py-2.5 rounded-full bg-brand-purple/10 text-brand-purple font-heading font-bold text-xs sm:text-sm hover:bg-brand-purple/20 transition-all text-center"
          >
            Всички заявки
          </Link>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Pending */}
        <Link
          href="/admin/bookings?status=pending"
          className="bg-white p-6 rounded-3xl shadow-card border border-brand-purple/15 hover:border-brand-purple transition-all duration-300 group"
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
              Заявки за потвърждение
            </p>
          </div>
        </Link>

        {/* Card 2: Confirmed */}
        <Link
          href="/admin/bookings?status=confirmed"
          className="bg-white p-6 rounded-3xl shadow-card border border-brand-purple/15 hover:border-brand-purple transition-all duration-300 group"
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

        {/* Card 3: Schedules */}
        <Link
          href="/admin/schedule"
          className="bg-white p-6 rounded-3xl shadow-card border border-brand-purple/15 hover:border-brand-purple transition-all duration-300 group"
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
              {activeSchedules}
            </p>
            <p className="text-xs font-semibold text-brand-muted">
              Активни седмични часове
            </p>
          </div>
        </Link>

        {/* Card 4: Total Bookings */}
        <Link
          href="/admin/bookings"
          className="bg-white p-6 rounded-3xl shadow-card border border-brand-purple/15 hover:border-brand-purple transition-all duration-300 group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 text-brand-purple flex items-center justify-center">
              <ClipboardList className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-brand-purple bg-brand-purple-light px-2.5 py-1 rounded-full border border-brand-purple/20">
              Общо
            </span>
          </div>
          <div className="space-y-1">
            <p className="font-heading font-bold text-3xl text-brand-dark group-hover:text-brand-purple transition-colors">
              {totalBookings}
            </p>
            <p className="text-xs font-semibold text-brand-muted">
              Всички постъпили заявки
            </p>
          </div>
        </Link>
      </div>

      {/* Quick Access Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Recent Bookings Table */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-7 shadow-card border border-brand-purple/15 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-brand-purple/10">
            <h2 className="font-heading font-bold text-lg text-brand-dark">
              Последни постъпили заявки
            </h2>
            <Link
              href="/admin/bookings"
              className="text-xs font-bold text-brand-purple hover:underline flex items-center gap-1"
            >
              <span>Към всички</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentBookings.length > 0 ? (
            <div className="divide-y divide-brand-purple/10">
              {recentBookings.map((b) => (
                <div
                  key={b.id}
                  className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-brand-bg/60 px-2 rounded-xl transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-heading font-bold text-sm text-brand-dark">
                        {b.child_name} ({b.child_age})
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          b.status === "confirmed"
                            ? "bg-emerald-100 text-emerald-800"
                            : b.status === "declined"
                            ? "bg-red-100 text-red-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {b.status === "confirmed"
                          ? "Потвърдена"
                          : b.status === "declined"
                          ? "Отказана"
                          : "Чакаща"}
                      </span>
                    </div>

                    <p className="text-xs text-brand-purple font-semibold">
                      {b.activity_name}
                    </p>

                    <div className="flex items-center gap-3 text-[11px] text-brand-muted">
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3 text-brand-purple/60" />
                        {b.parent_name}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={`tel:${b.phone}`}
                      className="px-3 py-1.5 rounded-xl bg-brand-purple/10 text-brand-purple hover:bg-brand-purple hover:text-white transition-colors text-xs font-bold flex items-center gap-1"
                    >
                      <Phone className="w-3 h-3" />
                      <span>{b.phone}</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-brand-muted text-sm font-sans">
              Все още няма получени заявки в базата данни.
            </div>
          )}
        </div>

        {/* Right Col: Quick Media and Shortcuts */}
        <div className="space-y-6">
          {/* Media box */}
          <div className="bg-white rounded-3xl p-6 shadow-card border border-brand-purple/15 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-brand-purple-light text-brand-purple flex items-center justify-center">
                <ImageIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-base text-brand-dark">
                  Медия мениджър
                </h3>
                <p className="text-xs text-brand-muted">
                  Управление на банери и слайдери
                </p>
              </div>
            </div>

            <p className="text-xs text-brand-dark/80 leading-relaxed font-sans">
              Качвайте и подменяйте заглавната снимка на началната страница или
              галериите от занятията през Supabase Storage bucket `site-assets`.
            </p>

            <Link
              href="/admin/media"
              className="w-full py-2.5 px-4 rounded-2xl bg-brand-purple/10 text-brand-purple hover:bg-brand-purple hover:text-white font-heading font-bold text-xs flex items-center justify-center gap-2 transition-all block text-center"
            >
              <span>Към медиите</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Quick info box */}
          <div className="bg-brand-purple-light/70 rounded-3xl p-6 border border-brand-purple/20 space-y-3">
            <h4 className="font-heading font-bold text-sm text-brand-purple">
              💡 Бърза помощ
            </h4>
            <ul className="text-xs text-brand-dark/80 space-y-1.5 list-disc pl-4 font-sans">
              <li>Кликнете върху телефонен номер за директно избиране.</li>
              <li>Променяйте статуса на чакащите заявки с един клик.</li>
              <li>Скривайте часове от календара през ключа за видимост.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
