import React from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Calendar, Clock, ArrowRight, CheckCircle2 } from "lucide-react";

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
        <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
          {/* Header Row: Title on Left, Curved Arrow on Right */}
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold uppercase tracking-wider backdrop-blur-sm">
                <Calendar className="w-3.5 h-3.5" />
                Седмична програма
              </div>
              <h2 className="font-heading font-bold text-2xl sm:text-4xl lg:text-5xl leading-tight tracking-wide">
                ВИЖТЕ ГРАФИКА<br className="hidden xs:block" /> ЗА СЕДМИЦАТА
              </h2>
            </div>

            {/* Hand-drawn style curved arrow pointing to the white card below */}
            <div className="shrink-0 -mt-1 sm:mt-0 mr-2 sm:mr-6 animate-pulse">
              <svg
                className="w-16 h-16 sm:w-24 sm:h-24 text-white drop-shadow-md transform -rotate-6"
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Curved arc path */}
                <path
                  d="M15,20 C55,10 85,30 78,70"
                  stroke="currentColor"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
                {/* Arrowhead */}
                <path
                  d="M66,58 L78,72 L90,60"
                  stroke="currentColor"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          {/* White Schedule Card (Visualized schedule as requested) */}
          <div className="bg-white rounded-3xl p-5 sm:p-8 shadow-2xl text-brand-dark space-y-4 border-2 border-white/60">
            <div className="flex items-center justify-between border-b border-brand-purple/15 pb-4">
              <div>
                <h3 className="font-heading font-bold text-lg sm:text-xl text-brand-purple">
                  АКТУАЛЕН СЕДМИЧЕН ГРАФИК
                </h3>
                <p className="text-xs text-brand-muted mt-0.5">
                  Занимания и свободни места за записване
                </p>
              </div>
              <span className="hidden sm:inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Отворено записване
              </span>
            </div>

            <div className="divide-y divide-gray-100">
              {schedulePreview.map((item, idx) => (
                <div
                  key={idx}
                  className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-4 text-xs sm:text-sm hover:bg-brand-purple/5 px-2 rounded-xl transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-brand-purple shrink-0" />
                    <span className="font-bold text-brand-dark min-w-[75px]">
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

            {/* Bottom Call to Action inside the Card */}
            <div className="pt-4 border-t border-brand-purple/10 flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-xs text-brand-muted text-center sm:text-left">
                Графикът може да бъде съобразен с училищната смяна на Вашето дете.
              </p>
              <Link
                href="/grafik"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-brand-purple text-white font-heading font-bold text-xs sm:text-sm uppercase tracking-wider shadow-button hover:bg-brand-purple-hover hover:shadow-button-hover transition-all active:scale-95"
              >
                <span>ПЪЛЕН ГРАФИК И ЗАПИСВАНЕ</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
