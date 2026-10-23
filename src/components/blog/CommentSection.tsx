"use client";

import React, { useState, useTransition } from "react";
import { MessageSquare, Send, CheckCircle2, Loader2 } from "lucide-react";
import { BlogComment } from "@/lib/types/blog";
import { submitPublicCommentAction } from "@/actions/admin-blog";
import { useLanguage } from "@/lib/i18n";

interface CommentSectionProps {
  postSlug: string;
  initialComments: BlogComment[];
}

export function CommentSection({ postSlug, initialComments }: CommentSectionProps) {
  const { dict, locale } = useLanguage();
  const c = dict.blog.commentsSection;

  const [comments, setComments] = useState<BlogComment[]>(initialComments);
  const [authorName, setAuthorName] = useState("");
  const [authorEmail, setAuthorEmail] = useState("");
  const [content, setContent] = useState("");
  const [successMessage, setSuccessMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !content.trim()) {
      setErrorMessage(c.errorValidation);
      return;
    }

    setErrorMessage("");
    startTransition(async () => {
      const res = await submitPublicCommentAction({
        postSlug,
        authorName,
        authorEmail,
        content,
      });

      if (res.success && res.comment) {
        setComments((prev) => [res.comment!, ...prev]);
        setAuthorName("");
        setAuthorEmail("");
        setContent("");
        setSuccessMessage(true);
        setTimeout(() => setSuccessMessage(false), 6000);
      } else {
        setErrorMessage(res.error || (locale === "en" ? "Error submitting comment." : "Грешка при изпращането."));
      }
    });
  };

  return (
    <section id="comments" className="mt-12 sm:mt-16 pt-8 sm:pt-12 border-t border-brand-purple/20">
      <div className="flex items-center gap-2.5 mb-8">
        <MessageSquare className="w-6 h-6 text-brand-purple" />
        <h2 className="font-heading font-bold text-2xl sm:text-3xl text-brand-dark">
          {c.title} ({comments.length})
        </h2>
      </div>

      {/* Comment Submission Form */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 md:p-10 shadow-card border border-brand-purple/15 mb-10">
        <h3 className="font-heading font-bold text-lg sm:text-xl text-brand-purple mb-4">
          {c.formHeading}
        </h3>

        {successMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-3 text-sm font-medium">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{c.successMsg}</span>
          </div>
        )}

        {errorMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="comment-author" className="block text-xs font-bold text-brand-dark mb-1.5 uppercase tracking-wide">
                {c.authorLabel}
              </label>
              <input
                id="comment-author"
                type="text"
                required
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder={c.authorPlaceholder}
                className="w-full px-4 py-2.5 rounded-2xl bg-[#f1f2f6] border border-brand-purple/20 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple focus:bg-white transition-all"
              />
            </div>

            <div>
              <label htmlFor="comment-email" className="block text-xs font-bold text-brand-dark mb-1.5 uppercase tracking-wide">
                {c.emailLabel}
              </label>
              <input
                id="comment-email"
                type="email"
                value={authorEmail}
                onChange={(e) => setAuthorEmail(e.target.value)}
                placeholder={c.emailPlaceholder}
                className="w-full px-4 py-2.5 rounded-2xl bg-[#f1f2f6] border border-brand-purple/20 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple focus:bg-white transition-all"
              />
            </div>
          </div>

          <div>
            <label htmlFor="comment-content" className="block text-xs font-bold text-brand-dark mb-1.5 uppercase tracking-wide">
              {c.contentLabel}
            </label>
            <textarea
              id="comment-content"
              required
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={c.contentPlaceholder}
              className="w-full px-4 py-3 rounded-2xl bg-[#f1f2f6] border border-brand-purple/20 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple focus:bg-white transition-all resize-y"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-full bg-brand-purple text-white font-heading font-bold text-sm uppercase tracking-wide hover:bg-brand-purple-hover transition-all transform hover:scale-[1.02] active:scale-95 shadow-button disabled:opacity-60 cursor-pointer"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{c.submittingBtn}</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>{c.submitBtn}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* List of Comments */}
      {comments.length > 0 ? (
        <div className="space-y-4">
          {comments.map((comment) => {
            const commentDate = new Date(comment.createdAt).toLocaleDateString(
              locale === "en" ? "en-US" : "bg-BG",
              {
                day: "numeric",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              }
            );

            return (
              <div
                key={comment.id}
                className="bg-white/80 backdrop-blur-sm p-5 sm:p-6 rounded-3xl border border-brand-purple/15 shadow-sm space-y-2.5"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-brand-purple/15 text-brand-purple flex items-center justify-center font-heading font-bold text-sm">
                      {comment.authorName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-heading font-bold text-sm sm:text-base text-brand-dark">
                        {comment.authorName}
                      </h4>
                      <time className="text-[11px] text-brand-muted">
                        {commentDate}
                      </time>
                    </div>
                  </div>
                </div>

                <p className="text-brand-dark/90 text-sm sm:text-base leading-relaxed pl-13">
                  {comment.content}
                </p>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-10 bg-white/50 rounded-3xl border border-brand-purple/10">
          <p className="text-brand-muted text-sm font-medium">
            {c.emptyMsg}
          </p>
        </div>
      )}
    </section>
  );
}
