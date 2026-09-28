import React from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Clock, Calendar, ArrowRight } from "lucide-react";

export function ScheduleBanner() {
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

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                href="/grafik"
                className="inline-flex items-center justify-center px-10 py-4 rounded-full bg-white text-brand-purple font-heading font-bold text-sm sm:text-base tracking-wider uppercase shadow-xl hover:bg-white/90 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
              >
                НАУЧЕТЕ ПОВЕЧЕ
              </Link>

              {/* Hand-drawn style curved arrow pointing to the white schedule box */}
              <div className="hidden lg:block shrink-0 -mt-2 -ml-2">
                <svg
                  className="w-24 h-16 text-white drop-shadow-md transform rotate-12"
                  viewBox="0 0 120 70"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10,20 C45,10 80,15 105,45"
                    stroke="currentColor"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M92,42 L106,47 L105,32"
                    stroke="currentColor"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>

            {/* Mobile curved arrow pointing downwards */}
            <div className="flex lg:hidden justify-center pt-1">
              <svg
                className="w-16 h-12 text-white/90"
                viewBox="0 0 80 60"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15,10 C45,10 55,25 50,48"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <path
                  d="M40,40 L50,50 L60,42"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
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
              <div className="pt-3 border-t border-brand-purple/10 flex items-center justify-between">
                <p className="text-xs text-brand-muted">
                  Индивидуални часове според смяната на детето
                </p>
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
