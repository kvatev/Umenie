"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Clock, MessageSquare, ArrowRight, Calendar } from "lucide-react";
import { BlogPost } from "@/lib/types/blog";
import { useLanguage } from "@/lib/i18n";

interface BlogCardProps {
  post: BlogPost;
  featured?: boolean;
}

export function BlogCard({ post, featured = false }: BlogCardProps) {
  const { dict, locale } = useLanguage();

  const formattedDate = new Date(post.publishedAt).toLocaleDateString(
    locale === "en" ? "en-US" : "bg-BG",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  );

  if (featured) {
    return (
      <article className="relative bg-white rounded-3xl sm:rounded-4xl overflow-hidden shadow-card hover:shadow-card-hover border border-brand-purple/15 transition-all duration-300 group">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
          {/* Featured Image */}
          <div className="lg:col-span-7 relative min-h-[260px] sm:min-h-[340px] lg:min-h-[420px] overflow-hidden">
            <Image
              src={post.coverImage || "/images/banner/1.webp"}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 1024px) 100vw, 65vw"
              priority
            />
            <div className="absolute top-4 left-4 z-10">
              <span className="bg-[#887ed8] text-white font-heading font-bold text-xs uppercase px-3.5 py-1.5 rounded-full shadow-md tracking-wider">
                {post.category}
              </span>
            </div>
          </div>

          {/* Featured Content */}
          <div className="lg:col-span-5 p-6 sm:p-8 md:p-10 flex flex-col justify-between space-y-4">
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center gap-3 sm:gap-4 text-xs font-semibold text-brand-muted flex-wrap">
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-brand-purple" />
                  <span>{formattedDate}</span>
                </span>
                <span>•</span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-brand-purple" />
                  <span>{post.readTime}</span>
                </span>
                {typeof post.commentsCount === "number" && post.commentsCount > 0 && (
                  <>
                    <span>•</span>
                    <span className="inline-flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-brand-purple" />
                      <span>{post.commentsCount} {dict.home.blog.commentsText}</span>
                    </span>
                  </>
                )}
              </div>

              <h3 className="font-heading font-bold text-xl sm:text-2xl lg:text-3xl text-brand-dark group-hover:text-brand-purple transition-colors leading-snug">
                <Link href={`/blog/${post.slug}`} className="focus:outline-none">
                  {post.title}
                </Link>
              </h3>

              <p className="text-brand-dark/80 text-sm sm:text-base leading-relaxed line-clamp-3 sm:line-clamp-4">
                {post.excerpt}
              </p>
            </div>

            <div className="pt-2 mt-auto">
              <Link
                href={`/blog/${post.slug}`}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-brand-purple text-white font-heading font-bold text-xs sm:text-sm hover:bg-brand-purple-hover transition-all transform hover:scale-[1.02] active:scale-95 shadow-button"
              >
                <span>{dict.home.blog.readArticle}</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="bg-white rounded-3xl overflow-hidden shadow-card hover:shadow-card-hover border border-brand-purple/15 transition-all duration-300 transform hover:-translate-y-1 flex flex-col group h-full">
      {/* Card Image */}
      <div className="relative aspect-[16/10] w-full overflow-hidden">
        <Image
          src={post.coverImage || "/images/banner/1.webp"}
          alt={post.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute top-3.5 left-3.5 z-10">
          <span className="bg-white/95 text-brand-purple font-heading font-bold text-[11px] uppercase px-3 py-1 rounded-full shadow-sm tracking-wide backdrop-blur-sm">
            {post.category}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-2">
          {/* Meta */}
          <div className="flex items-center gap-2.5 text-xs text-brand-muted font-medium">
            <span className="inline-flex items-center gap-1">
              <Calendar className="w-3 h-3 text-brand-purple" />
              <span>{formattedDate}</span>
            </span>
            <span>•</span>
            <span className="inline-flex items-center gap-1">
              <Clock className="w-3 h-3 text-brand-purple" />
              <span>{post.readTime}</span>
            </span>
            {typeof post.commentsCount === "number" && post.commentsCount > 0 && (
              <>
                <span>•</span>
                <span className="inline-flex items-center gap-1">
                  <MessageSquare className="w-3 h-3 text-brand-purple" />
                  <span>{post.commentsCount}</span>
                </span>
              </>
            )}
          </div>

          {/* Title */}
          <h3 className="font-heading font-bold text-lg sm:text-xl text-brand-dark group-hover:text-brand-purple transition-colors leading-snug line-clamp-2">
            <Link href={`/blog/${post.slug}`} className="focus:outline-none">
              {post.title}
            </Link>
          </h3>

          {/* Excerpt */}
          <p className="text-brand-dark/75 text-xs sm:text-sm leading-relaxed line-clamp-3">
            {post.excerpt}
          </p>
        </div>

        {/* Read More Link */}
        <div className="pt-3 border-t border-brand-purple/10 flex items-center justify-between mt-auto">
          <span className="text-xs font-semibold text-brand-muted truncate max-w-[120px]">
            {post.author}
          </span>
          <Link
            href={`/blog/${post.slug}`}
            className="inline-flex items-center gap-1.5 text-xs font-heading font-bold text-brand-purple hover:text-brand-purple-dark transition-colors group/link"
          >
            <span>{dict.home.blog.readMore}</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-1" />
          </Link>
        </div>
      </div>
    </article>
  );
}
