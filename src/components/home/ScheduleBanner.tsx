"use client";

import React from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Clock, Calendar, ArrowRight, FileText } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

interface ScheduleBannerProps {
  scheduleFileUrl?: string | null;
  scheduleFileName?: string | null;
}

export function ScheduleBanner({ scheduleFileUrl, scheduleFileName }: ScheduleBannerProps = {}) {
  const { dict } = useLanguage();
  const schedulePreview = dict.home.schedule.items;

  return (
    <section className="relative py-12 sm:py-18 lg:py-20 bg-gradient-to-b from-[#8376d4] via-brand-purple to-[#7c6ecf] text-white overflow-hidden shadow-xs">
      {/* Soft ambient glows for depth and visual richness */}
      <div className="pointer-events-none absolute -top-24 -left-20 w-80 h-80 rounded-full bg-white/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 -right-20 w-96 h-96 rounded-full bg-brand-yellow/15 blur-3xl" />
      <Container size="xl" className="relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Heading, Button and Curved Arrow */}
          <div className="lg:col-span-5 text-left space-y-6">
            <h2 className="font-heading font-bold text-2xl sm:text-4xl lg:text-5xl leading-tight tracking-wide uppercase text-left">
              {dict.home.schedule.titleLine1}<br className="hidden xs:block" /> {dict.home.schedule.titleLine2}
            </h2>

            <div className="pt-2 flex justify-start">
              <div className="relative inline-block">
                <Link
                  href="/grafik"
                  className="inline-flex items-center justify-center px-8 sm:px-10 py-3.5 sm:py-4 rounded-full bg-white text-brand-purple font-heading font-bold text-xs sm:text-base tracking-wider uppercase shadow-xl hover:bg-white/95 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                >
                  {dict.home.schedule.learnMore}
                </Link>

                <svg
                  className="hidden lg:block absolute -right-20 xl:-right-24 top-1/2 -translate-y-2 w-20 h-14 xl:w-24 xl:h-16 pointer-events-none select-none"
                  viewBox="0 0 100 60"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M 12 14 C 28 52, 68 56, 92 22"
                    stroke="white"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 75 22 L 92 22 L 87 38"
                    stroke="white"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Right Column: Visualized Schedule White Card */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl p-4 sm:p-7 shadow-2xl text-brand-dark space-y-4 border-2 border-white/60">
              <div className="flex items-center justify-between border-b border-brand-purple/15 pb-3 gap-2">
                <div className="flex items-center gap-2 text-brand-purple font-heading font-bold text-sm sm:text-base lg:text-lg min-w-0">
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                  <span className="truncate">{dict.home.schedule.cardTitle}</span>
                </div>
                <span className="text-[10px] sm:text-[11px] font-bold text-emerald-700 bg-emerald-100/80 px-2 sm:px-2.5 py-1 rounded-full shrink-0 whitespace-nowrap">
                  {dict.home.schedule.openEnrollment}
                </span>
              </div>

              <div className="divide-y divide-gray-100">
                {schedulePreview.map((item, idx) => (
                  <div
                    key={idx}
                    className="py-2.5 sm:py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4 text-xs sm:text-sm hover:bg-brand-purple/5 px-2 rounded-xl transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-brand-purple shrink-0" />
                      <span className="font-bold text-brand-dark min-w-[70px]">
                        {item.day}:
                      </span>
                      <span className="text-brand-dark/95 font-medium">
                        {item.activity}
                      </span>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pl-5 sm:pl-0">
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-brand-purple/10 text-brand-purple">
                        {item.badge}
                      </span>
                      <div className="flex items-center gap-1 text-brand-dark/80 font-semibold">
                        <Clock className="w-3.5 h-3.5 text-brand-purple shrink-0" />
                        <span>{item.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom Quick Link inside the Card */}
              <div className="pt-3 border-t border-brand-purple/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
                {scheduleFileUrl ? (
                  <a
                    href={scheduleFileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-purple hover:underline"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>{dict.home.schedule.downloadSchedule} ({scheduleFileName || "PDF / Файл"})</span>
                  </a>
                ) : (
                  <p className="text-xs text-brand-muted">
                    {dict.home.schedule.individualHours}
                  </p>
                )}
                <Link
                  href="/grafik"
                  className="inline-flex items-center gap-1.5 text-brand-purple font-heading font-bold text-xs sm:text-sm hover:underline"
                >
                  <span>{dict.home.schedule.viewFullSchedule}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
