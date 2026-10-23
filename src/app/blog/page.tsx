import React from "react";
import { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { QuickContactBanner } from "@/components/common/QuickContactBanner";
import { BlogListClient } from "@/components/blog/BlogListClient";
import { getBlogPosts } from "@/lib/blog-service";
import { SITE_CONFIG } from "@/lib/constants";
import { getServerDictionary } from "@/lib/i18n/server";

export const metadata: Metadata = {
  title: "Блог и полезни статии | Образователен клуб „УМеНИе“ Бургас",
  description:
    "Полезни съвети за родители, ранно детско развитие, учебна занималня, шах и творчество. Открийте статии и вдъхновение от екипа на клуб УМеНИе Бургас.",
  openGraph: {
    title: "Блог и полезни статии | Образователен клуб „УМеНИе“",
    description:
      "Практически съвети за родители, уроци, вдъхновение и детско развитие от образователен клуб „УМеНИе“ Бургас.",
    url: "https://ymenie.bg/blog",
    siteName: SITE_CONFIG.name,
    locale: "bg_BG",
    type: "website",
  },
};

export const revalidate = 60; // ISR cache revalidation

export default async function BlogPage() {
  const [{ locale, dict }, posts] = await Promise.all([
    getServerDictionary(),
    getBlogPosts(),
  ]);

  return (
    <div className="w-full bg-[#f1f2f6] text-brand-dark min-h-screen">
      {/* Header Section */}
      <section className="pt-28 sm:pt-36 pb-12 sm:pb-16 relative overflow-hidden">
        {/* Decorative background lightbulbs */}
        <div
          className="absolute pointer-events-none select-none top-8 left-4 sm:left-12 w-20 h-20 sm:w-28 sm:h-28 opacity-25"
          style={{ transform: "rotate(-15deg)" }}
        >
          <Image src="/images/bulb.webp" alt="" fill className="object-contain" priority />
        </div>

        <div
          className="absolute pointer-events-none select-none hidden sm:block top-12 right-12 w-24 h-24 opacity-25"
          style={{ transform: "rotate(20deg)" }}
        >
          <Image src="/images/bulb.webp" alt="" fill className="object-contain" />
        </div>

        <Container size="xl" className="relative z-10">
          <div className="text-left max-w-3xl space-y-4">
            <h1 className="font-heading font-extrabold text-3xl sm:text-5xl lg:text-6xl text-brand-purple uppercase tracking-wide leading-tight text-left">
              {dict.blog.pageTitle}
            </h1>

            <p className="text-brand-dark/85 text-base sm:text-lg md:text-xl font-sans max-w-2xl font-normal leading-relaxed text-left">
              {dict.blog.pageSubtitle}
            </p>
          </div>
        </Container>
      </section>

      {/* Main Blog Content */}
      <section className="pb-16 sm:pb-24">
        <Container size="xl">
          <BlogListClient initialPosts={posts} />
        </Container>
      </section>

      {/* Quick Contact Banner */}
      <QuickContactBanner className="mt-8" />
    </div>
  );
}
