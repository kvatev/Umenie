"use client";

import React, { useState, useMemo } from "react";
import { Search, X, BookOpen, Sparkles } from "lucide-react";
import { BlogPost, BlogCategory } from "@/lib/types/blog";
import { BlogCard } from "./BlogCard";
import { cn } from "@/lib/utils";

interface BlogListClientProps {
  initialPosts: BlogPost[];
}

const CATEGORIES: BlogCategory[] = [
  "Всички",
  "Съвети за родители",
  "Ранно развитие",
  "Учебна занималня",
  "Творчество",
];

export function BlogListClient({ initialPosts }: BlogListClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<BlogCategory>("Всички");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPosts = useMemo(() => {
    return initialPosts.filter((post) => {
      const matchesCategory =
        selectedCategory === "Всички" || post.category === selectedCategory;

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        post.title.toLowerCase().includes(q) ||
        post.excerpt.toLowerCase().includes(q) ||
        post.content.toLowerCase().includes(q) ||
        post.category.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [initialPosts, selectedCategory, searchQuery]);

  const featuredPost = useMemo(() => {
    if (selectedCategory !== "Всички" || searchQuery.trim()) return null;
    return filteredPosts.length > 0 ? filteredPosts[0] : null;
  }, [filteredPosts, selectedCategory, searchQuery]);

  const remainingPosts = useMemo(() => {
    if (featuredPost) {
      return filteredPosts.slice(1);
    }
    return filteredPosts;
  }, [filteredPosts, featuredPost]);

  const clearFilters = () => {
    setSelectedCategory("Всички");
    setSearchQuery("");
  };

  return (
    <div className="space-y-10 sm:space-y-12">
      {/* Search & Category Filter Controls */}
      <div className="bg-white/80 backdrop-blur-sm p-4 sm:p-6 rounded-3xl shadow-card border border-brand-purple/15 space-y-4">
        {/* Top: Search bar */}
        <div className="relative max-w-xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-purple" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Търсене на статия по ключова дума..."
            className="w-full pl-12 pr-10 py-3 rounded-full bg-[#f1f2f6] border border-brand-purple/20 text-brand-dark text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-brand-purple focus:bg-white transition-all placeholder:text-brand-muted"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-muted hover:text-brand-purple p-1"
              aria-label="Изчисти търсенето"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Bottom: Category Pills */}
        <div className="flex items-center justify-center gap-2 sm:gap-2.5 flex-wrap pt-2">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  "px-4 py-2 rounded-full text-xs sm:text-sm font-heading font-bold transition-all cursor-pointer whitespace-nowrap",
                  isSelected
                    ? "bg-brand-purple text-white shadow-button scale-[1.03]"
                    : "bg-[#f1f2f6] text-brand-dark/80 hover:bg-brand-purple/15 hover:text-brand-purple"
                )}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Featured Article (when viewing all without search) */}
      {featuredPost && (
        <section aria-label="Препоръчана статия">
          <div className="flex items-center gap-2 mb-4 text-xs font-heading font-bold text-brand-purple uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>Препоръчана статия</span>
          </div>
          <BlogCard post={featuredPost} featured={true} />
        </section>
      )}

      {/* Articles Grid */}
      {remainingPosts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch">
          {remainingPosts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-3xl p-10 sm:p-14 text-center space-y-4 max-w-lg mx-auto border border-brand-purple/15 shadow-card">
          <div className="w-16 h-16 rounded-full bg-brand-purple/10 text-brand-purple mx-auto flex items-center justify-center">
            <BookOpen className="w-8 h-8" />
          </div>
          <h3 className="font-heading font-bold text-xl sm:text-2xl text-brand-dark">
            Няма намерени статии
          </h3>
          <p className="text-brand-muted text-sm leading-relaxed">
            Не открихме статии, отговарящи на вашето търсене{" "}
            {searchQuery && <span className="font-semibold text-brand-purple">„{searchQuery}“</span>} в категория{" "}
            <span className="font-semibold text-brand-purple">„{selectedCategory}“</span>.
          </p>
          <div className="pt-2">
            <button
              onClick={clearFilters}
              className="px-6 py-2.5 rounded-full bg-brand-purple text-white font-heading font-bold text-xs uppercase tracking-wide hover:bg-brand-purple-hover transition-all"
            >
              Покажи всички статии
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
