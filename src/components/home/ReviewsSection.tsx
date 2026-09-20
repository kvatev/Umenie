"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Heart, ThumbsUp, ChevronLeft, ChevronRight, MessageSquareQuote } from "lucide-react";

interface Review {
  name: string;
  date: string;
  avatarColor: string;
  text: string;
  likes: number;
}

const REVIEWS: Review[] = [
  {
    name: "Нели Иванова",
    date: "12 март",
    avatarColor: "bg-purple-500",
    text: "Благодарим на целия екип на УМеНие! Дъщеря ми ходи с огромно желание на заниманията и винаги се прибира усмихната и пълна с нови идеи! 💜",
    likes: 42,
  },
  {
    name: "Даниела Петрова",
    date: "27 ноември",
    avatarColor: "bg-pink-500",
    text: "Прекрасна атмосфера и отдаден екип! Дъщеря ми посещава занятията с удоволствие, а учителите работят с внимание и търпение. Радвам се, че ви открихме! ❤️",
    likes: 14,
  },
  {
    name: "Иван Димитров",
    date: "3 март",
    avatarColor: "bg-indigo-500",
    text: "Страхотен екип и прекрасна атмосфера! Синът ми посещава курса по шах и вече има първи успехи. Благодаря за търпението и мотивацията! 💪",
    likes: 32,
  },
];

export function ReviewsSection() {
  const [currentIdx, setCurrentIdx] = useState(0);

  const nextReview = () => {
    setCurrentIdx((prev) => (prev + 1) % REVIEWS.length);
  };

  const prevReview = () => {
    setCurrentIdx((prev) => (prev - 1 + REVIEWS.length) % REVIEWS.length);
  };

  const activeReview = REVIEWS[currentIdx];

  return (
    <section className="py-16 sm:py-24 bg-brand-bg relative overflow-hidden">
      <Container size="xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Review Card (Social proof card) */}
          <div className="lg:col-span-6 relative">
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-brand-purple/15 relative">
              {/* Decorative top quote */}
              <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-5">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-11 h-11 rounded-full ${activeReview.avatarColor} text-white flex items-center justify-center font-bold text-lg font-heading shadow-sm`}
                  >
                    {activeReview.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-base text-brand-dark">
                      {activeReview.name}
                    </h4>
                    <p className="text-xs text-brand-muted">{activeReview.date}</p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-brand-purple-light text-brand-purple">
                  <MessageSquareQuote className="w-3.5 h-3.5" />
                  Отзив
                </span>
              </div>

              {/* Review Text */}
              <p className="text-brand-dark text-base sm:text-lg leading-relaxed font-medium min-h-[90px]">
                „{activeReview.text}“
              </p>

              {/* Bottom interactions */}
              <div className="flex items-center justify-between pt-5 mt-4 border-t border-gray-100">
                <div className="flex items-center gap-2 text-xs font-semibold text-brand-purple">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-brand-purple/15 text-brand-purple">
                    <ThumbsUp className="w-3.5 h-3.5" />
                  </span>
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-red-100 text-red-500 -ml-3">
                    <Heart className="w-3.5 h-3.5 fill-red-500" />
                  </span>
                  <span>{activeReview.likes} харесвания</span>
                </div>

                {/* Review switch buttons */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={prevReview}
                    aria-label="Предишен отзив"
                    className="p-2 rounded-full text-brand-dark hover:text-brand-purple hover:bg-brand-purple-light transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-xs font-bold text-brand-muted">
                    {currentIdx + 1} / {REVIEWS.length}
                  </span>
                  <button
                    onClick={nextReview}
                    aria-label="Следващ отзив"
                    className="p-2 rounded-full text-brand-dark hover:text-brand-purple hover:bg-brand-purple-light transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Callout: ЗАЩО ДА ИЗБЕРЕТЕ КЛУБ 'УМЕНИЕ'? */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            <h2 className="font-heading font-bold text-3xl sm:text-4xl text-brand-purple leading-tight">
              ЗАЩО ДА ИЗБЕРЕТЕ КЛУБ „УМЕНИЕ“?
            </h2>
            <p className="text-brand-dark/90 text-base sm:text-lg leading-relaxed max-w-xl">
              В малки групи всяко дете получава лично внимание и подкрепа. Ние учим
              децата чрез практика, без екрани и в среда, близка до домашния уют.
            </p>
            <div>
              <Link href="/za-nas">
                <Button size="lg" className="shadow-lg">
                  НАУЧЕТЕ ПОВЕЧЕ
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
