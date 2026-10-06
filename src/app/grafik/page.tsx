import React from "react";
import { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { ScheduleCalendar } from "@/components/schedule/ScheduleCalendar";
import { QuickContactBanner } from "@/components/common/QuickContactBanner";
import { supabase } from "@/lib/supabase/client";
import { DEFAULT_SCHEDULES, ScheduleItem, mapRowToScheduleItem } from "@/lib/schedule-data";
import { getSiteSettings } from "@/lib/site-settings";
import { FileText, Download } from "lucide-react";

export const metadata: Metadata = {
  title: "Седмичен график и записване | Образователен клуб УМеНИе",
  description:
    "Разгледайте актуалния седмичен график на уроците, арт работилниците, шаха, плетивото и занималнята в образователен клуб „УМеНИе“ Бургас. Запишете се онлайн.",
  alternates: {
    canonical: "https://www.umenie.net/grafik",
  },
  openGraph: {
    title: "Седмичен график и записване | Образователен клуб УМеНИе",
    description:
      "Актуална програма и онлайн записване за занимания и уроци в образователен клуб „УМеНИе“ Бургас.",
    url: "https://www.umenie.net/grafik",
    siteName: "Образователен клуб „УМеНИе“",
    locale: "bg_BG",
    type: "website",
    images: [
      {
        url: "https://www.umenie.net/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "График на занятията в образователен клуб „УМеНИе“ Бургас",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Седмичен график и записване | Образователен клуб УМеНИе",
    description:
      "Актуална програма и онлайн записване за занимания и уроци в образователен клуб „УМеНИе“ Бургас.",
    images: ["https://www.umenie.net/og-image.jpg"],
  },
};

// Revalidate every 60 seconds or on demand
export const revalidate = 60;

async function getSchedules(): Promise<ScheduleItem[]> {
  try {
    // 1. Try schedule_events table first
    const { data: eventData, error: eventErr } = await supabase
      .from("schedule_events")
      .select("*")
      .order("day_of_week", { ascending: true })
      .order("start_time", { ascending: true });

    if (!eventErr && eventData && eventData.length > 0) {
      const activeEvents = eventData.filter((row) => row.is_active !== false);
      if (activeEvents.length > 0) {
        return activeEvents.map((row) => mapRowToScheduleItem(row));
      }
    }

    // 2. Try schedules table
    const { data, error } = await supabase
      .from("schedules")
      .select("*")
      .eq("is_active", true)
      .order("day_of_week", { ascending: true })
      .order("start_time", { ascending: true });

    if (error || !data || data.length === 0) {
      return DEFAULT_SCHEDULES;
    }

    return data.map((row) => mapRowToScheduleItem(row));
  } catch (err) {
    console.error("Error fetching schedules from Supabase:", err);
    return DEFAULT_SCHEDULES;
  }
}

export default async function SchedulePage() {
  const [schedules, settings] = await Promise.all([
    getSchedules(),
    getSiteSettings(),
  ]);

  return (
    <div className="w-full bg-[#f1f2f6] text-brand-dark overflow-x-hidden pt-8 sm:pt-14 pb-4 space-y-10 sm:space-y-14">
      {/* 1. Page Header (matching "График Десктоп.png" & "График 1 - мобилна.png" 1:1) */}
      <Container size="xl" className="relative">
        {/* Decorative bulb top-right matching mobile mockup */}
        <div
          className="absolute pointer-events-none -top-6 right-2 sm:right-10 w-16 h-16 sm:w-24 sm:h-24 opacity-85 transform rotate-12"
          style={{ filter: "brightness(1.05)" }}
        >
          <Image src="/images/bulb.webp" alt="" fill className="object-contain" />
        </div>

        <div className="text-center max-w-3xl mx-auto space-y-3 sm:space-y-4 px-4 relative z-10">
          <h1 className="font-heading font-bold text-3xl sm:text-5xl lg:text-6xl text-brand-purple tracking-wide uppercase leading-tight">
            НАШИЯТ ГРАФИК
          </h1>
          <p className="text-brand-dark/85 text-sm sm:text-lg md:text-xl font-sans max-w-2xl mx-auto font-normal">
            Разгледайте предстоящите занимания и изберете какви умения ще развие вашето дете.
          </p>

          {/* Download Official Schedule File Banner if uploaded in Admin */}
          {settings.scheduleFileUrl && (
            <div className="pt-2 max-w-xl mx-auto">
              <a
                href={settings.scheduleFileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-brand-purple text-white font-heading font-bold text-xs sm:text-sm uppercase tracking-wider shadow-button hover:bg-brand-purple-hover hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
              >
                <FileText className="w-4 h-4 shrink-0" />
                <span>Свали актуалния график (PDF / Снимка)</span>
                <Download className="w-4 h-4 shrink-0 ml-1" />
              </a>
            </div>
          )}
        </div>
      </Container>

      {/* 2. Interactive Calendar Component */}
      <Container size="xl">
        <ScheduleCalendar initialSchedules={schedules} />
      </Container>

      {/* 3. Bottom Contact Banner */}
      <QuickContactBanner className="mt-12 sm:mt-16" />
    </div>
  );
}
