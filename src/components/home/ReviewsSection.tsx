"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { ThumbsUp, Heart, Star, CheckCircle, Maximize2, X } from "lucide-react";

interface ReviewsSectionProps {
  screenshotUrl?: string | null;
}

export function ReviewsSection({ screenshotUrl }: ReviewsSectionProps) {
  const [isZoomed, setIsZoomed] = useState(false);

  return (
    <section className="py-12 sm:py-20 bg-brand-bg relative overflow-hidden">
      <Container size="xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          {/* Left Column: Review Screenshot Container (matching mockup 1:1) */}
          <div className="lg:col-span-6 w-full flex justify-center">
            <div className="w-full max-w-lg bg-white rounded-3xl p-5 sm:p-7 shadow-card border border-brand-purple/20 transition-all duration-300 hover:shadow-card-hover group relative">
              {screenshotUrl ? (
                /* Dynamic Uploaded Screenshot */
                <div
                  className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden cursor-pointer"
                  onClick={() => setIsZoomed(true)}
                >
                  <Image
                    src={screenshotUrl}
                    alt="Отзив за образователен клуб УМеНИе"
                    fill
                    className="object-cover object-top transition-transform duration-300 group-hover:scale-[1.02]"
                    sizes="(max-width: 640px) 100vw, 550px"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 text-brand-dark text-xs font-semibold px-3 py-1.5 rounded-full shadow-md flex items-center gap-1.5">
                      <Maximize2 className="w-3.5 h-3.5 text-brand-purple" />
                      Увеличи отзива
                    </span>
                  </div>
                </div>
              ) : (
                /* Elegant, realistic Facebook review screenshot layout (default) */
                <div className="space-y-4">
                  {/* Top user profile & Facebook recommendation header */}
                  <div className="flex items-center gap-3.5 pb-3 border-b border-gray-100">
                    <div className="w-12 h-12 rounded-full bg-brand-purple text-white flex items-center justify-center font-heading font-bold text-xl shrink-0 shadow-sm">
                      Н
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-heading font-bold text-base text-brand-dark truncate">
                          Нели Иванова
                        </h4>
                        <span className="text-blue-500 shrink-0" title="Потвърден родител">
                          <CheckCircle className="w-4 h-4 fill-blue-500 text-white" />
                        </span>
                      </div>
                      <p className="text-xs text-brand-muted truncate">
                        12 март · Препоръчва <strong className="text-brand-purple">Образователен клуб „УМеНИе“</strong> · 🌐
                      </p>
                    </div>
                  </div>

                  {/* 5 Rating Stars */}
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className="w-5 h-5 fill-brand-yellow text-brand-yellow drop-shadow-sm"
                      />
                    ))}
                    <span className="text-xs font-bold text-brand-dark/70 ml-2">
                      5.0 от 5
                    </span>
                  </div>

                  {/* Authentic Parent Review Quote */}
                  <p className="text-brand-dark text-sm sm:text-base leading-relaxed font-medium">
                    „Искам да благодаря от сърце на прекрасния екип на клуб УМеНИе! Дъщеря ми посещава учебната занималня и уроците по английски език. Прибира се усмихната, уверена и с отлично подготвени уроци. Индивидуалният подход и грижата на преподавателите правят истински чудеса за мотивацията ѝ. Препоръчвам с две ръце на всички родители в Бургас!“
                  </p>

                  {/* Facebook Reaction Bar */}
                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-brand-muted font-medium">
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-1 items-center">
                        <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-sm">
                          <ThumbsUp className="w-3.5 h-3.5 fill-white" />
                        </span>
                        <span className="w-6 h-6 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-sm">
                          <Heart className="w-3.5 h-3.5 fill-white" />
                        </span>
                      </div>
                      <span className="font-semibold text-brand-dark/80">48 харесвания</span>
                    </div>
                    <span>12 коментара</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: ЗАЩО ДА ИЗБЕРЕТЕ КЛУБ "УМЕНИЕ"? (matching mockup 1:1) */}
          <div className="lg:col-span-6 space-y-4 sm:space-y-6 text-center lg:text-left">
            <h2 className="font-heading font-bold text-2xl sm:text-4xl text-brand-purple leading-tight tracking-wide uppercase">
              ЗАЩО ДА ИЗБЕРЕТЕ<br className="hidden sm:block" /> КЛУБ „УМЕНИЕ“?
            </h2>
            <p className="text-brand-dark/90 text-base sm:text-lg leading-relaxed max-w-xl mx-auto lg:mx-0">
              В малки групи всяко дете получава лично внимание и подкрепа. Ние учим децата чрез практика, без екрани и в среда, близка до домашния уют.
            </p>
            <div className="pt-2 flex justify-center lg:justify-start">
              <Link
                href="/za-nas"
                className="inline-flex items-center justify-center px-10 py-4 rounded-full bg-brand-purple text-white font-heading font-bold text-sm sm:text-base tracking-wider uppercase shadow-button hover:bg-brand-purple-hover hover:shadow-button-hover transition-all active:scale-95 cursor-pointer"
              >
                НАУЧЕТЕ ПОВЕЧЕ
              </Link>
            </div>
          </div>
        </div>
      </Container>

      {/* Lightbox Modal for Zoomed Screenshot */}
      {isZoomed && screenshotUrl && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setIsZoomed(false)}
        >
          <div className="relative max-w-3xl w-full max-h-[90vh] bg-white rounded-3xl p-4 shadow-2xl">
            <button
              onClick={() => setIsZoomed(false)}
              className="absolute -top-3 -right-3 p-2 bg-white text-brand-dark rounded-full shadow-lg hover:bg-brand-purple hover:text-white transition-colors"
              aria-label="Затвори"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="relative w-full h-[60vh]">
              <Image
                src={screenshotUrl}
                alt="Пълен размер на отзива"
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
