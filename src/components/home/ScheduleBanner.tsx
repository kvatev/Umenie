import React from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Clock, Calendar, ArrowRight, FileText, Download } from "lucide-react";

interface ScheduleBannerProps {
  scheduleFileUrl?: string | null;
  scheduleFileName?: string | null;
}

export function ScheduleBanner({ scheduleFileUrl, scheduleFileName }: ScheduleBannerProps = {}) {
  const schedulePreview = [
    { day: "Пон - Пет", activity: "Учебна занималня", time: "12:30 - 17:30", badge: "Всеки ден" },
    { day: "Вторник", activity: "БЕЛ и Математика (курсове)", time: "14:00 - 18:30", badge: "Интензивно" },
    { day: "Четвъртък", activity: "Английски език (малки групи)", time: "14:30 - 17:00", badge: "Разговорен" },
    { day: "Събота", activity: "Арт занимания & Шах", time: "10:30 - 14:00", badge: "Творчество" },
    { day: "Периодично", activity: "Читателски клуб „Лигериа“", time: "18:00 - 20:30", badge: "За възрастни" },
  ];

  return (
    <section className="py-12 sm:py-20 bg-brand-purple text-white relative overflow-hidden">
      <Container size="xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Heading, Button and Curved Arrow (matching mockups 1:1) */}
          <div className="lg:col-span-5 text-center lg:text-left space-y-6">
            <h2 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl leading-tight tracking-wide uppercase">
              ГРАФИКА ЗА<br className="hidden xs:block" /> СЕДМИЦАТА
            </h2>

            <div className="pt-2 flex justify-center lg:justify-start">
              <div className="relative inline-block">
                <Link
                  href="/grafik"
                  className="inline-flex items-center justify-center px-10 py-4 rounded-full bg-white text-brand-purple font-heading font-bold text-sm sm:text-base tracking-wider uppercase shadow-xl hover:bg-white/90 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                >
                  НАУЧЕТЕ ПОВЕЧЕ
                </Link>

                <svg
                  className="hidden sm:block absolute -right-16 md:-right-20 lg:-right-24 top-1/2 -translate-y-2 w-16 h-12 md:w-20 md:h-14 lg:w-24 lg:h-16 pointer-events-none select-none"
                  viewBox="0 0 100 60"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Smooth swooping arc dipping down and curving up-right */}
                  <path
                    d="M 12 14 C 28 52, 68 56, 92 22"
                    stroke="white"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                  {/* Arrow head pointing up and right toward the card */}
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

          {/* Right Column: Visualized Schedule White Card (matching mockups 1:1) */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl p-5 sm:p-7 shadow-2xl text-brand-dark space-y-4 border-2 border-white/60">
              <div className="flex items-center justify-between border-b border-brand-purple/15 pb-3">
                <div className="flex items-center gap-2 text-brand-purple font-heading font-bold text-base sm:text-lg">
                  <Calendar className="w-5 h-5" />
                  <span>АКТУАЛНА СЕДМИЧНА ПРОГРАМА</span>
                </div>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100/80 px-2.5 py-1 rounded-full">
                  Отворено записване
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
              <div className="pt-3 border-t border-brand-purple/10 flex flex-col sm:flex-row items-center justify-between gap-2">
                {scheduleFileUrl ? (
                  <a
                    href={scheduleFileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-purple hover:underline"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Свали графика ({scheduleFileName || "PDF / Файл"})</span>
                  </a>
                ) : (
                  <p className="text-xs text-brand-muted">
                    Индивидуални часове според смяната на детето
                  </p>
                )}
                <Link
                  href="/grafik"
                  className="inline-flex items-center gap-1.5 text-brand-purple font-heading font-bold text-xs sm:text-sm hover:underline"
                >
                  <span>Виж пълния график</span>
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
