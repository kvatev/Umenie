import React from "react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Calendar,
  Clock,
  ArrowLeft,
  CalendarDays,
  Sparkles,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { QuickContactBanner } from "@/components/common/QuickContactBanner";
import { BulletBulbIcon } from "@/components/common/BulletBulbIcon";
import { CommentSection } from "@/components/blog/CommentSection";
import { BlogCard } from "@/components/blog/BlogCard";
import { getBlogPostBySlug, getBlogPosts, getBlogComments } from "@/lib/blog-service";
import { SITE_CONFIG } from "@/lib/constants";
import { getServerDictionary } from "@/lib/i18n/server";
import { fullBlogArticlesEn } from "@/lib/i18n";


interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    return {
      title: "Статията не е намерена | Образователен клуб „УМеНИе“",
    };
  }

  return {
    title: `${post.title} | Блог на клуб „УМеНИе“ Бургас`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `https://ymenie.bg/blog/${post.slug}`,
      siteName: SITE_CONFIG.name,
      locale: "bg_BG",
      type: "article",
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      images: [
        {
          url: post.coverImage || "/images/banner/1.webp",
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [post.coverImage || "/images/banner/1.webp"],
    },
  };
}



export default async function BlogPostDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const [{ locale, dict }, post, allPosts, comments] = await Promise.all([
    getServerDictionary(),
    getBlogPostBySlug(slug),
    getBlogPosts({ limit: 4 }),
    getBlogComments({ postSlug: slug }),
  ]);

  if (!post) {
    notFound();
  }

  const enArticle = locale === "en" ? fullBlogArticlesEn[post.slug] : null;
  const enPost = locale === "en" ? (dict.blogPosts as Record<string, any>)?.[post.slug] : null;

  const displayPost = {
    ...post,
    title: enArticle?.title || enPost?.title || post.title,
    excerpt: enArticle?.excerpt || enPost?.excerpt || post.excerpt,
    category:
      enArticle?.category ||
      enPost?.category ||
      (dict.blog?.categories as Record<string, string>)?.[post.category] ||
      post.category,
    readTime: enArticle?.readTime || enPost?.readTime || post.readTime,
    content: enArticle?.content || post.content,
  };

  // Related posts (excluding current)
  const relatedPosts = allPosts.filter((p) => p.slug !== post.slug).slice(0, 3);

  const formattedDate = new Date(post.publishedAt).toLocaleDateString(
    locale === "en" ? "en-US" : "bg-BG",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  );

  return (
    <div className="w-full bg-[#f1f2f6] text-brand-dark min-h-screen">
      {/* Breadcrumbs */}
      <div className="pt-24 sm:pt-28 pb-4">
        <Container size="xl">
          <nav
            aria-label={dict.services.breadcrumbs.ariaLabel}
            className="inline-flex items-center gap-2 text-xs font-bold text-brand-purple uppercase tracking-wider flex-wrap"
          >
            <Link href="/" className="hover:underline">
              {dict.common.nav.home}
            </Link>
            <span>/</span>
            <Link href="/blog" className="hover:underline">
              {dict.common.nav.blog}
            </Link>
            <span>/</span>
            <span className="text-brand-purple/70 truncate max-w-xs sm:max-w-md">
              {displayPost.title}
            </span>
          </nav>
        </Container>
      </div>

      {/* Main Article Container */}
      <article className="pb-16 sm:pb-20">
        <Container size="lg">
          <div className="space-y-6 sm:space-y-8">
            {/* Header info */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="bg-[#887ed8] text-white font-heading font-bold text-xs uppercase px-3.5 py-1.5 rounded-full shadow-sm tracking-wider">
                  {displayPost.category}
                </span>

                <div className="flex items-center gap-2 text-xs font-semibold text-brand-muted">
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-brand-purple" />
                    <span>{formattedDate}</span>
                  </span>
                  <span>•</span>
                  <span className="inline-flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-brand-purple" />
                    <span>{displayPost.readTime}</span>
                  </span>
                </div>
              </div>

              <h1 className="font-heading font-extrabold text-2xl sm:text-4xl lg:text-5xl text-brand-purple leading-tight">
                {displayPost.title}
              </h1>

              <p className="text-base sm:text-xl text-brand-dark/85 font-medium leading-relaxed max-w-3xl">
                {displayPost.excerpt}
              </p>
            </div>

            {/* Featured Image */}
            <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] rounded-3xl sm:rounded-4xl overflow-hidden shadow-2xl border-4 border-white bg-white">
              <Image
                src={post.coverImage || "/images/banner/1.webp"}
                alt={displayPost.title}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 1100px"
              />
            </div>

            {/* Content Body */}
            <div className="bg-white rounded-3xl sm:rounded-4xl p-6 sm:p-10 md:p-14 shadow-card border border-brand-purple/15">
              <div className="prose prose-lg max-w-none space-y-6 text-brand-dark/90 leading-relaxed font-normal text-base sm:text-lg">
                {displayPost.content.split("\n\n").map((paragraph, idx) => {
                  const trimmed = paragraph.trim();

                  // Heading 3
                  if (trimmed.startsWith("### ")) {
                    return (
                      <h3
                        key={idx}
                        className="font-heading font-bold text-xl sm:text-2xl text-brand-purple mt-8 mb-3"
                      >
                        {trimmed.replace(/^###\s+/, "")}
                      </h3>
                    );
                  }

                  // Blockquote
                  if (trimmed.startsWith("> ")) {
                    return (
                      <blockquote
                        key={idx}
                        className="my-6 p-6 rounded-3xl bg-[#ddd9f5]/40 border-l-4 border-brand-purple text-brand-dark italic font-heading text-lg sm:text-xl leading-relaxed"
                      >
                        {trimmed.replace(/^>\s+/, "")}
                      </blockquote>
                    );
                  }

                  // Bullet list item
                  if (trimmed.startsWith("- ")) {
                    const items = trimmed.split("\n").filter((l) => l.trim().startsWith("- "));
                    return (
                      <ul key={idx} className="space-y-2.5 my-4">
                        {items.map((item, itemIdx) => (
                          <li key={itemIdx} className="flex items-start gap-3">
                            <BulletBulbIcon className="w-5 h-5 shrink-0 mt-1" />
                            <span>{item.replace(/^-\s+/, "")}</span>
                          </li>
                        ))}
                      </ul>
                    );
                  }

                  return (
                    <p key={idx} className="leading-relaxed">
                      {trimmed}
                    </p>
                  );
                })}
              </div>

              {/* Author & Footer of article */}
              <div className="mt-10 pt-6 border-t border-brand-purple/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-brand-purple text-white flex items-center justify-center font-heading font-bold text-lg shadow-sm">
                    УМ
                  </div>
                  <div>
                    <p className="font-heading font-bold text-sm text-brand-dark">
                      {post.author}
                    </p>
                    <p className="text-xs text-brand-muted">
                      {dict.blog.authorOrg}
                    </p>
                  </div>
                </div>

                <Link
                  href="/blog"
                  className="inline-flex items-center gap-2 text-xs sm:text-sm font-heading font-bold text-brand-purple hover:text-brand-purple-dark transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>{dict.blog.backToAll}</span>
                </Link>
              </div>
            </div>

            {/* CTA Box: Schedule / Booking */}
            <div className="bg-[#887ed8] text-white p-6 sm:p-10 rounded-3xl sm:rounded-4xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2 text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-xs font-bold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{dict.blog.cta.badge}</span>
                </div>
                <h3 className="font-heading font-bold text-2xl sm:text-3xl">
                  {dict.blog.cta.title}
                </h3>
                <p className="text-white/90 text-sm sm:text-base max-w-xl">
                  {dict.blog.cta.desc}
                </p>
              </div>

              <div className="shrink-0">
                <Link
                  href="/grafik"
                  className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-white text-[#887ed8] font-heading font-bold text-sm sm:text-base shadow-xl hover:bg-[#ede9fe] transition-all transform hover:scale-[1.03] active:scale-95 uppercase tracking-wide"
                >
                  <CalendarDays className="w-5 h-5" />
                  <span>{dict.blog.cta.btn}</span>
                </Link>
              </div>
            </div>

            {/* Comment Section */}
            <CommentSection
              postSlug={post.slug}
              initialComments={comments}
            />
          </div>
        </Container>
      </article>

      {/* Related Posts Section */}
      {relatedPosts.length > 0 && (
        <section className="py-12 sm:py-16 bg-[#e4e2f7]/50 border-t border-brand-purple/15">
          <Container size="xl">
            <div className="mb-8 text-center sm:text-left">
              <h2 className="font-heading font-bold text-2xl sm:text-3xl text-brand-dark">
                {dict.blog.relatedTitle}
              </h2>
              <p className="text-brand-muted text-sm mt-1">
                {dict.blog.relatedSubtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
              {relatedPosts.map((rPost) => (
                <BlogCard key={rPost.id} post={rPost} />
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Quick Contact Banner */}
      <QuickContactBanner />
    </div>
  );
}
