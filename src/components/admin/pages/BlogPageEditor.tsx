"use client";

import React, { useState, useTransition, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Search,
  Calendar,
  Clock,
  X,
  Save,
  Loader2,
  Newspaper,
  Check,
  Ban,
  User,
} from "lucide-react";
import { BlogPost, BlogComment, BlogCategory } from "@/lib/types/blog";
import {
  saveBlogArticleAction,
  deleteBlogArticleAction,
  togglePublishBlogArticleAction,
  moderateCommentAction,
  deleteCommentAction,
} from "@/actions/admin-blog";
import { slugifyCyrillic } from "@/lib/blog-data";
import { cn } from "@/lib/utils";

interface BlogPageEditorProps {
  initialPosts: BlogPost[];
  initialComments: BlogComment[];
}

const CATEGORIES: BlogCategory[] = [
  "Всички",
  "Съвети за родители",
  "Ранно развитие",
  "Учебна занималня",
  "Творчество",
  "Новини",
];

const SUGGESTED_COVERS = [
  { label: "Учебна занималня", src: "/images/banner/1.webp" },
  { label: "Уроци и курсове", src: "/images/banner/2.webp" },
  { label: "Плетиво и моторика", src: "/images/banner/3.webp" },
  { label: "Арт и картини", src: "/images/banner/4.webp" },
  { label: "Книги и четене", src: "/images/banner/5.webp" },
  { label: "Шахмат и логика", src: "/images/banner/6.webp" },
  { label: "Детски арт ръце", src: "/images/gallery-painted-hands.webp" },
  { label: "Деца в клуба", src: "/images/opening-photo.webp" },
];

export function BlogPageEditor({ initialPosts, initialComments }: BlogPageEditorProps) {
  const [activeTab, setActiveTab] = useState<"articles" | "comments">("articles");
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts);
  const [comments, setComments] = useState<BlogComment[]>(initialComments);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("Всички");

  // Article Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Partial<BlogPost> | null>(null);

  // Feedback Notification
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  const showFeedback = (type: "success" | "error", message: string) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 5000);
  };

  // Filtered posts
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesCategory =
        selectedCategory === "Всички" || post.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        post.title.toLowerCase().includes(q) ||
        post.excerpt.toLowerCase().includes(q) ||
        post.category.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [posts, selectedCategory, searchQuery]);

  // Quick stats
  const stats = useMemo(() => {
    const total = posts.length;
    const published = posts.filter((p) => p.published).length;
    const drafts = total - published;
    const totalComments = comments.length;
    return { total, published, drafts, totalComments };
  }, [posts, comments]);

  // Open modal for new article
  const handleNewArticle = () => {
    setEditingPost({
      id: "",
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      coverImage: "/images/banner/1.webp",
      category: "Съвети за родители",
      author: "Екипът на УМеНИе",
      readTime: "3 мин четене",
      published: true,
    });
    setIsModalOpen(true);
  };

  // Open modal for editing existing article
  const handleEditArticle = (post: BlogPost) => {
    setEditingPost({ ...post });
    setIsModalOpen(true);
  };

  // Title change with auto-slug generation
  const handleTitleChange = (val: string) => {
    if (!editingPost) return;
    const updates: Partial<BlogPost> = { title: val };
    // Auto-update slug if it was empty or matches previous auto-slug
    if (!editingPost.id || editingPost.slug === slugifyCyrillic(editingPost.title || "")) {
      updates.slug = slugifyCyrillic(val);
    }
    setEditingPost((prev) => ({ ...prev, ...updates }));
  };

  // Save Article (create or update)
  const handleSaveArticle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPost || !editingPost.title?.trim()) {
      showFeedback("error", "Заглавието на статията е задължително.");
      return;
    }

    const title = editingPost.title.trim();
    const slug = editingPost.slug?.trim() || slugifyCyrillic(title);
    const postToSave = { ...editingPost, title, slug };

    startTransition(async () => {
      const res = await saveBlogArticleAction({
        id: postToSave.id || undefined,
        title: postToSave.title,
        slug: postToSave.slug,
        excerpt: postToSave.excerpt?.trim() || "",
        content: postToSave.content?.trim() || "",
        coverImage: postToSave.coverImage?.trim() || "/images/banner/1.webp",
        category: postToSave.category || "Съвети за родители",
        author: postToSave.author || "Екипът на УМеНИе",
        readTime: postToSave.readTime || "3 мин четене",
        published: postToSave.published ?? true,
      });

      if (res.success && res.article) {
        setPosts((prev) => {
          const idx = prev.findIndex((p) => p.id === res.article!.id);
          if (idx >= 0) {
            const next = [...prev];
            next[idx] = res.article!;
            return next;
          }
          return [res.article!, ...prev];
        });
        setIsModalOpen(false);
        showFeedback("success", "Статията беше записана успешно!");
      } else {
        showFeedback("error", res.error || "Грешка при запис на статията.");
      }
    });
  };

  // Delete Article
  const handleDeleteArticle = (post: BlogPost) => {
    if (!window.confirm(`Сигурни ли сте, че искате да изтриете статията „${post.title}“?`)) {
      return;
    }

    startTransition(async () => {
      const res = await deleteBlogArticleAction(post.id);
      if (res.success) {
        setPosts((prev) => prev.filter((p) => p.id !== post.id));
        setComments((prev) => prev.filter((c) => c.postSlug !== post.slug));
        showFeedback("success", "Статията беше изтрита успешно.");
      } else {
        showFeedback("error", res.error || "Грешка при изтриване.");
      }
    });
  };

  // Toggle published
  const handleTogglePublished = (post: BlogPost) => {
    const nextState = !post.published;
    startTransition(async () => {
      const res = await togglePublishBlogArticleAction(post.id, nextState);
      if (res.success) {
        setPosts((prev) =>
          prev.map((p) => (p.id === post.id ? { ...p, published: nextState } : p))
        );
        showFeedback(
          "success",
          nextState ? "Статията беше публикувана!" : "Статията беше преместена в чернови."
        );
      }
    });
  };

  // Moderate comment
  const handleModerateComment = (commentId: string, status: "approved" | "rejected", postSlug: string) => {
    startTransition(async () => {
      const res = await moderateCommentAction(commentId, status, postSlug);
      if (res.success) {
        setComments((prev) =>
          prev.map((c) => (c.id === commentId ? { ...c, status } : c))
        );
        showFeedback("success", status === "approved" ? "Коментарът е одобрен." : "Коментарът е отхвърлен.");
      }
    });
  };

  // Delete comment
  const handleDeleteComment = (commentId: string, postSlug: string) => {
    if (!window.confirm("Сигурни ли сте, че искате да изтриете този коментар?")) return;

    startTransition(async () => {
      const res = await deleteCommentAction(commentId, postSlug);
      if (res.success) {
        setComments((prev) => prev.filter((c) => c.id !== commentId));
        showFeedback("success", "Коментарът беше изтрит.");
      }
    });
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-brand-dark flex items-center gap-3">
            <Newspaper className="w-7 h-7 text-brand-purple" />
            <span>Управление на Блог и Статии</span>
          </h1>
          <p className="text-brand-muted text-sm mt-1">
            Добавяйте, редактирайте и публикувайте статии и управлявайте коментарите на сайта.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/blog"
            target="_blank"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white border border-brand-purple/20 text-brand-purple font-heading font-bold text-xs uppercase hover:bg-brand-purple/10 transition-all shadow-sm"
          >
            <span>Виж блога</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={handleNewArticle}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-brand-purple text-white font-heading font-bold text-xs uppercase hover:bg-brand-purple-hover transition-all shadow-button active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Нова статия</span>
          </button>
        </div>
      </div>

      {/* Global Feedback Banner */}
      {feedback && (
        <div
          className={cn(
            "p-4 rounded-2xl flex items-center gap-3 text-sm font-semibold transition-all",
            feedback.type === "success"
              ? "bg-emerald-50 border border-emerald-200 text-emerald-800"
              : "bg-red-50 border border-red-200 text-red-800"
          )}
        >
          {feedback.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-brand-purple/15 shadow-sm">
          <p className="text-xs font-bold text-brand-muted uppercase tracking-wider">Общо статии</p>
          <p className="font-heading font-extrabold text-2xl sm:text-3xl text-brand-purple mt-1">{stats.total}</p>
        </div>
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-brand-purple/15 shadow-sm">
          <p className="text-xs font-bold text-brand-muted uppercase tracking-wider">Публикувани</p>
          <p className="font-heading font-extrabold text-2xl sm:text-3xl text-emerald-600 mt-1">{stats.published}</p>
        </div>
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-brand-purple/15 shadow-sm">
          <p className="text-xs font-bold text-brand-muted uppercase tracking-wider">Чернови</p>
          <p className="font-heading font-extrabold text-2xl sm:text-3xl text-amber-500 mt-1">{stats.drafts}</p>
        </div>
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-brand-purple/15 shadow-sm">
          <p className="text-xs font-bold text-brand-muted uppercase tracking-wider">Коментари</p>
          <p className="font-heading font-extrabold text-2xl sm:text-3xl text-brand-dark mt-1">{stats.totalComments}</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-brand-purple/20 pb-3">
        <button
          onClick={() => setActiveTab("articles")}
          className={cn(
            "px-5 py-2.5 rounded-2xl font-heading font-bold text-sm transition-all cursor-pointer",
            activeTab === "articles"
              ? "bg-brand-purple text-white shadow-button"
              : "bg-white text-brand-dark/80 hover:bg-brand-purple/10"
          )}
        >
          Всички статии ({posts.length})
        </button>

        <button
          onClick={() => setActiveTab("comments")}
          className={cn(
            "px-5 py-2.5 rounded-2xl font-heading font-bold text-sm transition-all cursor-pointer flex items-center gap-2",
            activeTab === "comments"
              ? "bg-brand-purple text-white shadow-button"
              : "bg-white text-brand-dark/80 hover:bg-brand-purple/10"
          )}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Коментари ({comments.length})</span>
        </button>
      </div>

      {/* TAB 1: ARTICLES */}
      {activeTab === "articles" && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="bg-white p-4 rounded-2xl border border-brand-purple/15 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Търси по заглавие..."
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#f1f2f6] border border-brand-purple/20 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple focus:bg-white"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={cn(
                    "px-3 py-1.5 rounded-xl text-xs font-heading font-bold whitespace-nowrap transition-all cursor-pointer",
                    selectedCategory === cat
                      ? "bg-brand-purple text-white shadow-sm"
                      : "bg-[#f1f2f6] text-brand-dark/80 hover:bg-brand-purple/15"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Articles Table */}
          {filteredPosts.length > 0 ? (
            <div className="bg-white rounded-3xl border border-brand-purple/15 shadow-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-[#f1f2f6] text-brand-dark/80 font-heading font-bold text-xs uppercase border-b border-brand-purple/15">
                    <tr>
                      <th className="py-3.5 px-4">Статия</th>
                      <th className="py-3.5 px-4 hidden sm:table-cell">Категория</th>
                      <th className="py-3.5 px-4 hidden md:table-cell">Дата / Време</th>
                      <th className="py-3.5 px-4 text-center">Коментари</th>
                      <th className="py-3.5 px-4 text-center">Статус</th>
                      <th className="py-3.5 px-4 text-right">Действия</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-purple/10">
                    {filteredPosts.map((post) => (
                      <tr key={post.id} className="hover:bg-brand-purple/[0.02] transition-colors">
                        {/* Article Info */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="relative w-14 h-11 sm:w-16 sm:h-12 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-brand-purple/10">
                              <Image
                                src={post.coverImage || "/images/banner/1.webp"}
                                alt=""
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="min-w-0 max-w-xs sm:max-w-md">
                              <p className="font-heading font-bold text-sm text-brand-dark truncate">
                                {post.title}
                              </p>
                              <p className="text-xs text-brand-muted truncate">
                                /blog/{post.slug}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="py-3.5 px-4 hidden sm:table-cell">
                          <span className="inline-block px-2.5 py-1 rounded-full bg-brand-purple/10 text-brand-purple text-xs font-bold">
                            {post.category}
                          </span>
                        </td>

                        {/* Date */}
                        <td className="py-3.5 px-4 hidden md:table-cell text-xs text-brand-muted whitespace-nowrap">
                          <div>{new Date(post.publishedAt).toLocaleDateString("bg-BG")}</div>
                          <div className="text-[11px] text-brand-muted/70">{post.readTime}</div>
                        </td>

                        {/* Comments count */}
                        <td className="py-3.5 px-4 text-center">
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-brand-dark/80 bg-[#f1f2f6] px-2.5 py-1 rounded-full">
                            <MessageSquare className="w-3.5 h-3.5 text-brand-purple" />
                            <span>{post.commentsCount || 0}</span>
                          </span>
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-4 text-center">
                          <button
                            onClick={() => handleTogglePublished(post)}
                            title={post.published ? "Кликни за скриване (Чернова)" : "Кликни за публикуване"}
                            className={cn(
                              "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold cursor-pointer transition-all",
                              post.published
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                                : "bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100"
                            )}
                          >
                            {post.published ? (
                              <>
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Публикувана</span>
                              </>
                            ) : (
                              <>
                                <EyeOff className="w-3.5 h-3.5" />
                                <span>Чернова</span>
                              </>
                            )}
                          </button>
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {post.published && (
                              <Link
                                href={`/blog/${post.slug}`}
                                target="_blank"
                                className="p-2 rounded-xl text-brand-purple hover:bg-brand-purple/10 transition-colors"
                                title="Преглед на сайта"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </Link>
                            )}

                            <button
                              onClick={() => handleEditArticle(post)}
                              className="p-2 rounded-xl text-brand-purple hover:bg-brand-purple/10 transition-colors cursor-pointer"
                              title="Редактирай"
                            >
                              <Edit className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => handleDeleteArticle(post)}
                              className="p-2 rounded-xl text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                              title="Изтрий"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="bg-white p-10 rounded-3xl text-center space-y-3 border border-brand-purple/15">
              <p className="text-brand-muted text-sm font-medium">
                Няма намерени статии за зададените филтри.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("Всички");
                }}
                className="text-xs font-bold text-brand-purple hover:underline"
              >
                Изчисти филтрите
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: COMMENTS */}
      {activeTab === "comments" && (
        <div className="bg-white rounded-3xl border border-brand-purple/15 shadow-card overflow-hidden p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-brand-purple/10">
            <div>
              <h2 className="font-heading font-bold text-lg text-brand-dark">
                Всички отзиви и коментари ({comments.length})
              </h2>
              <p className="text-xs text-brand-muted">
                Управлявайте коментарите от посетителите към статиите в блога.
              </p>
            </div>
          </div>

          {comments.length > 0 ? (
            <div className="space-y-4">
              {comments.map((c) => (
                <div
                  key={c.id}
                  className="p-4 sm:p-5 rounded-2xl bg-[#f1f2f6]/70 border border-brand-purple/15 space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-brand-purple/15 text-brand-purple flex items-center justify-center font-bold text-xs">
                        {c.authorName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-heading font-bold text-sm text-brand-dark">
                            {c.authorName}
                          </span>
                          {c.authorEmail && (
                            <span className="text-xs text-brand-muted">({c.authorEmail})</span>
                          )}
                        </div>
                        <p className="text-[11px] text-brand-muted">
                          Към статия:{" "}
                          <Link
                            href={`/blog/${c.postSlug}`}
                            target="_blank"
                            className="text-brand-purple hover:underline font-semibold"
                          >
                            /blog/{c.postSlug}
                          </Link>{" "}
                          • {new Date(c.createdAt).toLocaleDateString("bg-BG")}
                        </p>
                      </div>
                    </div>

                    {/* Status & Actions */}
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          "px-2.5 py-1 rounded-full text-xs font-bold",
                          c.status === "approved"
                            ? "bg-emerald-100 text-emerald-800"
                            : c.status === "pending"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-red-100 text-red-800"
                        )}
                      >
                        {c.status === "approved"
                          ? "Одобрен"
                          : c.status === "pending"
                          ? "Чакащ"
                          : "Отхвърлен"}
                      </span>

                      {c.status !== "approved" && (
                        <button
                          onClick={() => handleModerateComment(c.id, "approved", c.postSlug)}
                          className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-bold inline-flex items-center gap-1 cursor-pointer"
                          title="Одобри"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {c.status !== "rejected" && (
                        <button
                          onClick={() => handleModerateComment(c.id, "rejected", c.postSlug)}
                          className="p-1.5 rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-100 text-xs font-bold inline-flex items-center gap-1 cursor-pointer"
                          title="Отхвърли"
                        >
                          <Ban className="w-3.5 h-3.5" />
                        </button>
                      )}

                      <button
                        onClick={() => handleDeleteComment(c.id, c.postSlug)}
                        className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 cursor-pointer"
                        title="Изтрий"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <p className="text-sm text-brand-dark/90 leading-relaxed bg-white p-3 rounded-xl border border-brand-purple/10">
                    {c.content}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-brand-muted text-sm">
              Няма добавени коментари към момента.
            </div>
          )}
        </div>
      )}

      {/* MODAL: ADD / EDIT ARTICLE */}
      {isModalOpen && editingPost && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl border border-brand-purple/20 max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-brand-purple/15">
              <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-brand-purple">
                {editingPost.id ? "Редактиране на статия" : "Нова статия в блога"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-full text-brand-muted hover:text-brand-dark hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveArticle} className="space-y-5">
              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-brand-dark mb-1.5 uppercase tracking-wide">
                  Заглавие на статията *
                </label>
                <input
                  type="text"
                  required
                  value={editingPost.title || ""}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="напр. Как да помогнем на детето да учи с желание?"
                  className="w-full px-4 py-2.5 rounded-xl border border-brand-purple/20 text-sm focus:ring-2 focus:ring-brand-purple focus:outline-none"
                />
              </div>

              {/* Slug & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-brand-dark mb-1.5 uppercase tracking-wide">
                    URL Slug (идентификатор) *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingPost.slug || ""}
                    onChange={(e) => setEditingPost((p) => ({ ...p, slug: e.target.value }))}
                    placeholder="kak-da-pomognem-na-deteto"
                    className="w-full px-4 py-2.5 rounded-xl border border-brand-purple/20 text-xs text-brand-dark font-mono focus:ring-2 focus:ring-brand-purple focus:outline-none"
                  />
                  <span className="text-[11px] text-brand-muted">
                    Видим като: /blog/{editingPost.slug || "primeren-slug"}
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-brand-dark mb-1.5 uppercase tracking-wide">
                    Категория *
                  </label>
                  <select
                    value={editingPost.category || "Съвети за родители"}
                    onChange={(e) => setEditingPost((p) => ({ ...p, category: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border border-brand-purple/20 text-sm focus:ring-2 focus:ring-brand-purple focus:outline-none bg-white"
                  >
                    <option value="Съвети за родители">Съвети за родители</option>
                    <option value="Ранно развитие">Ранно развитие</option>
                    <option value="Учебна занималня">Учебна занималня</option>
                    <option value="Творчество">Творчество</option>
                    <option value="Новини">Новини</option>
                  </select>
                </div>
              </div>

              {/* Cover Image & Read time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-brand-dark mb-1.5 uppercase tracking-wide">
                    Корица (Изображение)
                  </label>
                  <input
                    type="text"
                    value={editingPost.coverImage || ""}
                    onChange={(e) => setEditingPost((p) => ({ ...p, coverImage: e.target.value }))}
                    placeholder="/images/banner/1.webp"
                    className="w-full px-4 py-2.5 rounded-xl border border-brand-purple/20 text-xs font-mono focus:ring-2 focus:ring-brand-purple focus:outline-none"
                  />
                  {/* Preset quick cover picker */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pt-2 pb-1">
                    {SUGGESTED_COVERS.map((sc) => (
                      <button
                        key={sc.src}
                        type="button"
                        onClick={() => setEditingPost((p) => ({ ...p, coverImage: sc.src }))}
                        className={cn(
                          "px-2 py-1 rounded-lg text-[10px] whitespace-nowrap transition-all border cursor-pointer",
                          editingPost.coverImage === sc.src
                            ? "bg-brand-purple text-white border-brand-purple font-bold"
                            : "bg-[#f1f2f6] text-brand-dark border-transparent hover:border-brand-purple/40"
                        )}
                      >
                        {sc.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-brand-dark mb-1.5 uppercase tracking-wide">
                    Време за четене & Автор
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={editingPost.readTime || ""}
                      onChange={(e) => setEditingPost((p) => ({ ...p, readTime: e.target.value }))}
                      placeholder="3 мин четене"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-brand-purple/20 text-xs focus:ring-2 focus:ring-brand-purple focus:outline-none"
                    />
                    <input
                      type="text"
                      value={editingPost.author || ""}
                      onChange={(e) => setEditingPost((p) => ({ ...p, author: e.target.value }))}
                      placeholder="Екипът на УМеНИе"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-brand-purple/20 text-xs focus:ring-2 focus:ring-brand-purple focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-xs font-bold text-brand-dark mb-1.5 uppercase tracking-wide">
                  Кратко резюме (Excerpt) *
                </label>
                <textarea
                  rows={2}
                  required
                  value={editingPost.excerpt || ""}
                  onChange={(e) => setEditingPost((p) => ({ ...p, excerpt: e.target.value }))}
                  placeholder="1-2 изречения, описващи същността на статията (показват се в картите и за SEO)..."
                  className="w-full px-4 py-2.5 rounded-xl border border-brand-purple/20 text-xs sm:text-sm focus:ring-2 focus:ring-brand-purple focus:outline-none resize-y"
                />
              </div>

              {/* Content */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-brand-dark uppercase tracking-wide">
                    Пълно съдържание на статията *
                  </label>
                  <span className="text-[11px] text-brand-muted">
                    Поддържа: ### Заглавие, - Точка, &gt; Цитат
                  </span>
                </div>
                <textarea
                  rows={10}
                  required
                  value={editingPost.content || ""}
                  onChange={(e) => setEditingPost((p) => ({ ...p, content: e.target.value }))}
                  placeholder="Въведете съдържанието на статията тук. Използвайте ### за подзаглавия, тирета (-) за изброяване с лампички и > за цитати..."
                  className="w-full px-4 py-3 rounded-xl border border-brand-purple/20 text-sm font-sans focus:ring-2 focus:ring-brand-purple focus:outline-none resize-y"
                />
              </div>

              {/* Published toggle */}
              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="modal-published-toggle"
                  checked={editingPost.published ?? true}
                  onChange={(e) => setEditingPost((p) => ({ ...p, published: e.target.checked }))}
                  className="w-4 h-4 text-brand-purple rounded focus:ring-brand-purple cursor-pointer"
                />
                <label htmlFor="modal-published-toggle" className="text-xs font-bold text-brand-dark cursor-pointer">
                  Публикувана веднага на сайта (ако е изключено, се запазва като чернова)
                </label>
              </div>

              {/* Form Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-brand-purple/15">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl text-xs font-heading font-bold text-brand-dark hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Отказ
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-purple text-white font-heading font-bold text-xs uppercase hover:bg-brand-purple-hover transition-all shadow-button active:scale-95 disabled:opacity-60 cursor-pointer"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Запазване...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Запази статията</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
