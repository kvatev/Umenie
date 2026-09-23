import React from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Calendar, Clock, ArrowRight } from "lucide-react";

export function ScheduleBanner() {
  const schedulePreview = [
    { day: "Пон - Пет", activity: "Учебна занималня", time: "12:30 - 17:30" },
    { day: "Вторник", activity: "БЕЛ и Математика (курсове)", time: "14:00 - 18:30" },
    { day: "Четвъртък", activity: "Английски език (малки групи)", time: "14:30 - 17:00" },
    { day: "Събота", activity: "Арт занимания & Шах", time: "10:30 - 14:00" },
    { day: "Периодично", activity: "Читателски клуб", time: "18:00 - 20:30" },
  ];

  return (
    <section className="py-16 sm:py-20 bg-brand-purple text-white relative overflow-hidden">
      <Container size="xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Callout */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 text-white text-xs font-semibold uppercase tracking-wider backdrop-blur-sm">
              <Calendar className="w-3.5 h-3.5" />
              Седмична програма
            </div>

            <h2 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl leading-tight">
              ВИЖТЕ ГРАФИКА ЗА СЕДМИЦАТА
            </h2>

            <p className="text-white/90 text-base sm:text-lg leading-relaxed max-w-lg">
              Разгледайте пълния часови график за всяко занимание и планирайте
              удобното време за Вашето дете.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link
                href="/grafik"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-white text-brand-purple font-heading font-bold text-base shadow-xl hover:bg-brand-purple-light transition-all active:scale-[0.98]"
              >
                <span>НАУЧЕТЕ ПОВЕЧЕ</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Right Preview Card */}
          <div className="lg:col-span-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl text-brand-dark space-y-4 border-2 border-white/40">
              <div className="flex items-center justify-between border-b border-brand-purple/15 pb-4">
                <h3 className="font-heading font-bold text-lg sm:text-xl text-brand-purple">
                  АКТУАЛЕН ГРАФИК
                </h3>
                <span className="text-xs font-bold text-brand-muted uppercase">
                  Клуб УМеНИе
                </span>
              </div>

              <div className="divide-y divide-gray-100">
                {schedulePreview.map((item, idx) => (
                  <div
                    key={idx}
                    className="py-3 flex items-center justify-between gap-4 text-xs sm:text-sm"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-2 h-2 rounded-full bg-brand-purple shrink-0" />
                      <span className="font-bold text-brand-dark min-w-[70px]">
                        {item.day}:
                      </span>
                      <span className="text-brand-dark/90 font-medium">
                        {item.activity}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-brand-muted shrink-0">
                      <Clock className="w-3.5 h-3.5 text-brand-purple" />
                      <span>{item.time}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-3 text-center">
                <Link
                  href="/grafik"
                  className="text-xs font-bold text-brand-purple hover:underline inline-flex items-center gap-1"
                >
                  Вижте пълния седмичен график и записване →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
