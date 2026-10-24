"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import {
  saveBlogPost,
  deleteBlogPost,
  addBlogComment,
  moderateBlogComment,
  deleteBlogComment,
  getBlogPostBySlug,
} from "@/lib/blog-service";
import { BlogPost } from "@/lib/types/blog";

export async function saveBlogArticleAction(data: {
  id?: string;
  title: string;
  slug?: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  category?: string;
  author?: string;
  readTime?: string;
  published?: boolean;
}) {
  try {
    if (!data.title || !data.title.trim()) {
      return { success: false, error: "Заглавието е задължително." };
    }

    const saved = await saveBlogPost(data);

    try { revalidateTag("blog-posts"); } catch {}
    revalidatePath("/blog");
    revalidatePath(`/blog/${saved.slug}`);
    revalidatePath("/");
    revalidatePath("/admin/pages/blog");

    return { success: true, article: saved };
  } catch (err: any) {
    console.error("saveBlogArticleAction error:", err);
    return { success: false, error: err.message || "Грешка при запис на статията." };
  }
}

export async function deleteBlogArticleAction(id: string) {
  try {
    const success = await deleteBlogPost(id);
    try { revalidateTag("blog-posts"); } catch {}
    revalidatePath("/blog");
    revalidatePath("/");
    revalidatePath("/admin/pages/blog");
    return { success };
  } catch (err: any) {
    console.error("deleteBlogArticleAction error:", err);
    return { success: false, error: err.message || "Грешка при изтриване на статията." };
  }
}

export async function togglePublishBlogArticleAction(id: string, published: boolean) {
  try {
    await saveBlogPost({ id, published } as any);
    try { revalidateTag("blog-posts"); } catch {}
    revalidatePath("/blog");
    revalidatePath("/");
    revalidatePath("/admin/pages/blog");
    return { success: true };
  } catch (err: any) {
    console.error("togglePublishBlogArticleAction error:", err);
    return { success: false, error: err.message };
  }
}

export async function submitPublicCommentAction(formData: {
  postSlug: string;
  authorName: string;
  authorEmail?: string;
  content: string;
}) {
  try {
    if (!formData.authorName?.trim() || !formData.content?.trim()) {
      return { success: false, error: "Моля, попълнете вашето име и коментар." };
    }

    const comment = await addBlogComment({
      postSlug: formData.postSlug,
      authorName: formData.authorName,
      authorEmail: formData.authorEmail,
      content: formData.content,
    });

    revalidatePath(`/blog/${formData.postSlug}`);
    revalidatePath("/admin/pages/blog");

    return { success: true, comment };
  } catch (err: any) {
    console.error("submitPublicCommentAction error:", err);
    return { success: false, error: "Възникна грешка при публикуване на коментара." };
  }
}

export async function moderateCommentAction(
  commentId: string,
  status: "approved" | "pending" | "rejected",
  postSlug?: string
) {
  try {
    const success = await moderateBlogComment(commentId, status);
    if (postSlug) {
      revalidatePath(`/blog/${postSlug}`);
    }
    revalidatePath("/admin/pages/blog");
    return { success };
  } catch (err: any) {
    console.error("moderateCommentAction error:", err);
    return { success: false, error: err.message };
  }
}

export async function deleteCommentAction(commentId: string, postSlug?: string) {
  try {
    const success = await deleteBlogComment(commentId);
    if (postSlug) {
      revalidatePath(`/blog/${postSlug}`);
    }
    revalidatePath("/admin/pages/blog");
    return { success };
  } catch (err: any) {
    console.error("deleteCommentAction error:", err);
    return { success: false, error: err.message };
  }
}
