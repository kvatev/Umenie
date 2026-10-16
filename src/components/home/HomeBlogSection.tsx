import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BookOpen } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { BlogCard } from "@/components/blog/BlogCard";
import { BlogPost } from "@/lib/types/blog";

interface HomeBlogSectionProps {
  posts: BlogPost[];
}

export function HomeBlogSection({ posts }: HomeBlogSectionProps) {
  if (!posts || posts.length === 0) {
    return null;
  }

  // Display top 3 latest published posts
  const displayPosts = posts.slice(0, 3);

  return (
    <section className="py-14 sm:py-20 md:py-24 relative overflow-hidden bg-brand-bg">
      {/* Decorative ambient lightbulbs */}
      <div
        className="absolute pointer-events-none select-none -top-4 -left-6 sm:left-6 w-24 h-24 opacity-25"
        style={{ transform: "rotate(-18deg)" }}
      >
        <Image src="/images/bulb.webp" alt="" fill className="object-contain" />
      </div>

      <div
        className="absolute pointer-events-none select-none hidden sm:block bottom-6 -right-6 sm:right-6 w-28 h-28 opacity-25"
        style={{ transform: "rotate(22deg)" }}
      >
        <Image src="/images/bulb.webp" alt="" fill className="object-contain" />
      </div>

      <Container size="xl" className="relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 gap-4">
          <div className="space-y-2 text-center md:text-left">
            <span className="inline-block px-3.5 py-1 rounded-full bg-brand-purple/10 text-brand-purple font-heading font-bold text-xs uppercase tracking-wider">
              ПОЛЕЗНО ЗА РОДИТЕЛИ И ДЕЦА
            </span>
            <h2 className="font-heading font-extrabold text-2xl sm:text-4xl lg:text-5xl text-brand-purple tracking-wide uppercase">
              ОТ НАШИЯ БЛОГ
            </h2>
            <p className="text-brand-dark/80 text-sm sm:text-base md:text-lg max-w-xl">
              Практични съвети, идеи за развитие и вдъхновение от екипа на клуб „УМеНИе“.
            </p>
          </div>

          <div className="text-center md:text-right shrink-0">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-brand-purple border border-brand-purple/20 hover:bg-brand-purple hover:text-white transition-all transform hover:scale-[1.02] active:scale-95 shadow-sm font-heading font-bold text-xs sm:text-sm uppercase tracking-wide group"
            >
              <span>ВСИЧКИ СТАТИИ</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        {/* 3 Articles Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch">
          {displayPosts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      </Container>
    </section>
  );
}
