"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { BulletBulbIcon } from "@/components/common/BulletBulbIcon";
import { useLanguage } from "@/lib/i18n";

export function WhyChooseUs() {
  const { dict } = useLanguage();
  const points = dict.home.whyChooseUs.points;

  return (
    <section className="py-12 sm:py-20 bg-brand-bg relative overflow-hidden">
      {/* Subtle ambient doodle bulb */}
      <div
        className="absolute pointer-events-none select-none -top-4 -right-4 sm:right-10 w-28 h-28 opacity-25"
        style={{ transform: "rotate(20deg)" }}
      >
        <Image src="/images/bulb.webp" alt="" fill className="object-contain" />
      </div>

      <Container size="xl" className="relative z-10">
        <div className="max-w-4xl text-left space-y-5 sm:space-y-6">
          <h2 className="font-heading font-bold text-2xl sm:text-4xl lg:text-5xl text-brand-purple leading-tight tracking-wide uppercase text-left">
            {dict.home.whyChooseUs.titleLine1}<br className="hidden sm:block" /> {dict.home.whyChooseUs.titleLine2}
          </h2>

          <p className="text-brand-dark/90 text-base sm:text-xl leading-relaxed max-w-2xl text-left font-normal">
            {dict.home.whyChooseUs.description}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-left">
            {points.map((p, i) => (
              <div
                key={i}
                className="bg-white/85 backdrop-blur-sm rounded-2xl p-5 border border-brand-purple/15 shadow-sm hover:shadow-card transition-all"
              >
                <div className="flex items-center gap-2 font-heading font-bold text-brand-purple text-base mb-1.5">
                  <BulletBulbIcon className="w-5 h-5 shrink-0" />
                  <h4>{p.title}</h4>
                </div>
                <p className="text-brand-dark/80 text-xs sm:text-sm leading-relaxed">
                  {p.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="pt-4 flex justify-start">
            <Link
              href="/za-nas"
              className="inline-flex items-center justify-center px-10 py-4 rounded-full bg-brand-purple text-white font-heading font-bold text-sm sm:text-base tracking-wider uppercase shadow-button hover:bg-brand-purple-hover hover:shadow-button-hover transition-all active:scale-95 cursor-pointer"
            >
              {dict.home.whyChooseUs.button}
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
