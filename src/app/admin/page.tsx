import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ClipboardList,
  CalendarDays,
  Image as ImageIcon,
  CheckCircle2,
  Clock,
  ArrowRight,
  Phone,
  User,
  Sparkles,
  ExternalLink,
  Layers,
  MapPin,
  PhoneCall,
} from "lucide-react";
import { supabaseAdmin } from "@/lib/supabase/server";
import { SERVICES_DATA } from "@/lib/services-data";
import { getSiteSettings } from "@/lib/site-settings";

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

const DEFAULT_BANNER_PREVIEW = [
  "/images/banner/1.webp",
  "/images/banner/2.webp",
  "/images/banner/3.webp",
  "/images/banner/4.webp",
];

function getActivityThumbnail(activityName: string): string {
  const norm = (activityName || "").toLowerCase();
  if (norm.includes("плет")) return "/images/services/pletivo.webp";
  if (norm.includes("шах")) return "/images/services/shah.webp";
  if (norm.includes("арт") || norm.includes("рисув") || norm.includes("творч"))
    return "/images/services/art.webp";
  if (norm.includes("занимал")) return "/images/services/uchebna-zanimalnya.webp";
  if (norm.includes("чит") || norm.includes("лигериа") || norm.includes("книг"))
    return "/images/services/chitatelski-klub.webp";
  return "/images/services/urotsi.webp";
}

export default async function AdminDashboardPage() {
  const siteSettings = await getSiteSettings();

  // Fetch metrics, recent bookings, and active hero
  let totalBookings = 0;
  let pendingBookings = 0;
  let confirmedBookings = 0;
  let activeSchedules = 0;
  let recentBookings: BookingItem[] = [];
  let heroBannerSrc = "/images/opening-photo.webp";

  try {
    // 1. Hero banner check
    const { data: files } = await supabaseAdmin.storage
      .from("site-assets")
      .list("", { search: "hero-banner" });

    if (files && files.some((f) => f.name === "hero-banner.webp")) {
      const { data: urlData } = supabaseAdmin.storage
        .from("site-assets")
        .getPublicUrl("hero-banner.webp");
      if (urlData?.publicUrl) {
        heroBannerSrc = urlData.publicUrl;
      }
    }

    // 2. Bookings stats
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

    // 3. Schedules stats
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
            href="/admin/media"
            className="px-5 py-2.5 rounded-full bg-brand-purple/10 text-brand-purple font-heading font-bold text-xs sm:text-sm hover:bg-brand-purple/20 transition-all text-center"
          >
            Банери и снимки
          </Link>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Pending */}
        <Link
          href="/admin/bookings"
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
          href="/admin/bookings"
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

      {/* ======================================================== */}
      {/* LIVE SNIPPETS: Как изглежда уебсайтът на живо в момента */}
      {/* ======================================================== */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h2 className="font-heading font-bold text-lg sm:text-xl text-brand-dark">
              Отрязъци на живо: Как изглежда уебсайтът в момента
            </h2>
          </div>
          <a
            href="/"
            target="_blank"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-purple hover:underline"
          >
            <span>Отвори уебсайта на живо</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
          {/* Snippet 1: Hero Banner */}
          <div className="bg-white rounded-3xl overflow-hidden shadow-card border border-brand-purple/15 flex flex-col justify-between group">
            <div className="p-4 border-b border-brand-purple/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brand-purple" />
                <span className="font-heading font-bold text-xs text-brand-dark">
                  Главен начален банер
                </span>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                Активен
              </span>
            </div>

            <div className="relative h-44 w-full bg-brand-bg overflow-hidden">
              <Image
                src={heroBannerSrc}
                alt="Начален банер"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-3 text-white">
                <p className="font-heading font-bold text-xs drop-shadow truncate">
                  УРОЦИ, КУРСОВЕ И ЗАНИМАНИЯ
                </p>
              </div>
            </div>

            <div className="p-3 bg-brand-bg/50 flex items-center justify-between">
              <span className="text-[11px] text-brand-muted">Начална страница</span>
              <Link
                href="/admin/media"
                className="text-xs font-bold text-brand-purple hover:underline flex items-center gap-1"
              >
                <span>Смени банера</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* Snippet 2: Kids Gallery */}
          <div className="bg-white rounded-3xl overflow-hidden shadow-card border border-brand-purple/15 flex flex-col justify-between group">
            <div className="p-4 border-b border-brand-purple/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-brand-purple" />
                <span className="font-heading font-bold text-xs text-brand-dark">
                  Слайдер „Деца с умения“
                </span>
              </div>
              <span className="text-[10px] font-bold text-brand-purple bg-brand-purple-light px-2 py-0.5 rounded-full">
                6+ кадъра
              </span>
            </div>

            <div className="grid grid-cols-2 gap-1 p-2 bg-brand-bg h-44">
              {DEFAULT_BANNER_PREVIEW.map((img, i) => (
                <div key={i} className="relative rounded-xl overflow-hidden shadow-xs">
                  <Image src={img} alt="Деца" fill className="object-cover" />
                </div>
              ))}
            </div>

            <div className="p-3 bg-brand-bg/50 flex items-center justify-between">
              <span className="text-[11px] text-brand-muted">Фотогалерия</span>
              <Link
                href="/admin/media"
                className="text-xs font-bold text-brand-purple hover:underline flex items-center gap-1"
              >
                <span>Управлявай</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* Snippet 3: Services */}
          <div className="bg-white rounded-3xl overflow-hidden shadow-card border border-brand-purple/15 flex flex-col justify-between group">
            <div className="p-4 border-b border-brand-purple/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-brand-purple" />
                <span className="font-heading font-bold text-xs text-brand-dark">
                  6-те дейности и услуги
                </span>
              </div>
              <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                6 услуги
              </span>
            </div>

            <div className="grid grid-cols-3 gap-1.5 p-2 bg-brand-bg h-44 items-center">
              {SERVICES_DATA.slice(0, 6).map((srv) => (
                <div
                  key={srv.slug}
                  className="relative h-18 rounded-xl overflow-hidden group/item border border-brand-purple/10 shadow-xs"
                >
                  <Image src={srv.cardImage} alt={srv.title} fill className="object-cover" />
                  <div className="absolute inset-0 bg-black/40 flex items-end p-1 text-[9px] font-bold text-white truncate">
                    {srv.shortTitle}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 bg-brand-bg/50 flex items-center justify-between">
              <span className="text-[11px] text-brand-muted">Страници & Слайдери</span>
              <Link
                href="/admin/media"
                className="text-xs font-bold text-brand-purple hover:underline flex items-center gap-1"
              >
                <span>Слайдери</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* Snippet 4: Weekly Schedule */}
          <div className="bg-white rounded-3xl overflow-hidden shadow-card border border-brand-purple/15 flex flex-col justify-between group">
            <div className="p-4 border-b border-brand-purple/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-brand-purple" />
                <span className="font-heading font-bold text-xs text-brand-dark">
                  Седмичен график
                </span>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                {activeSchedules} активни
              </span>
            </div>

            <div className="p-3 bg-brand-bg h-44 flex flex-col justify-between space-y-2">
              <div className="p-2.5 rounded-2xl bg-white border border-brand-purple/15 shadow-xs space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-brand-purple">Пн - Пт</span>
                  <span className="text-brand-muted">16:00 - 19:30</span>
                </div>
                <p className="font-heading font-bold text-xs text-brand-dark">
                  Математика, Шах, Плетиво, Занималня
                </p>
              </div>

              <div className="p-2.5 rounded-2xl bg-white border border-brand-purple/15 shadow-xs space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-brand-purple">Събота</span>
                  <span className="text-brand-muted">10:00 - 15:30</span>
                </div>
                <p className="font-heading font-bold text-xs text-brand-dark">
                  Арт, Плетиво, Шахматни турнири
                </p>
              </div>
            </div>

            <div className="p-3 bg-brand-bg/50 flex items-center justify-between">
              <span className="text-[11px] text-brand-muted">Календар за родители</span>
              <Link
                href="/admin/schedule"
                className="text-xs font-bold text-brand-purple hover:underline flex items-center gap-1"
              >
                <span>Редактирай</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* Snippet 5: Contacts & Socials */}
          <div className="bg-white rounded-3xl overflow-hidden shadow-card border border-brand-purple/15 flex flex-col justify-between group">
            <div className="p-4 border-b border-brand-purple/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-brand-purple" />
                <span className="font-heading font-bold text-xs text-brand-dark">
                  Контакти & Мрежи
                </span>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                На живо
              </span>
            </div>

            <div className="p-3 bg-brand-bg h-44 flex flex-col justify-between space-y-2">
              <div className="p-2.5 rounded-2xl bg-white border border-brand-purple/15 shadow-xs space-y-1">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-brand-dark truncate">
                  <Phone className="w-3 h-3 text-brand-purple shrink-0" />
                  <span>{siteSettings.phoneDisplay}</span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-brand-muted truncate">
                  <MapPin className="w-3 h-3 text-brand-purple shrink-0" />
                  <span>{siteSettings.locationShort}</span>
                </div>
              </div>

              <div className="p-2 rounded-2xl bg-white border border-brand-purple/15 shadow-xs flex items-center justify-between text-[10px]">
                <span className="text-brand-muted truncate pr-1">{siteSettings.email}</span>
                <div className="flex items-center gap-1 shrink-0">
                  <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[9px] font-bold">f</span>
                  <span className="w-4 h-4 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center text-[9px] font-bold">ig</span>
                </div>
              </div>
            </div>

            <div className="p-3 bg-brand-bg/50 flex items-center justify-between">
              <span className="text-[11px] text-brand-muted">Телефон, адрес, линкове</span>
              <Link
                href="/admin/contacts"
                className="text-xs font-bold text-brand-purple hover:underline flex items-center gap-1"
              >
                <span>Редактирай</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Access Grid: Recent Bookings + Shortcuts */}
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
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-brand-bg border border-brand-purple/20 shrink-0 shadow-xs">
                      <Image
                        src={getActivityThumbnail(b.activity_name)}
                        alt={b.activity_name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="space-y-0.5">
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
