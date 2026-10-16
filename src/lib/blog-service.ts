import { supabaseAdmin } from "@/lib/supabase/admin";
import { BlogPost, BlogComment } from "@/lib/types/blog";
import { INITIAL_BLOG_POSTS, INITIAL_BLOG_COMMENTS, slugifyCyrillic } from "@/lib/blog-data";

const BUCKET_NAME = "site-assets";
const POSTS_FILE = "blog_posts.json";
const COMMENTS_FILE = "blog_comments.json";

// In-memory runtime cache for rapid responses
let memoryPosts: BlogPost[] | null = null;
let memoryComments: BlogComment[] | null = null;

/**
 * Load raw posts from Supabase storage or table, falling back to initial data.
 */
async function loadRawPosts(): Promise<BlogPost[]> {
  try {
    const { data, error } = await supabaseAdmin.storage
      .from(BUCKET_NAME)
      .download(POSTS_FILE);

    if (data && !error) {
      const text = await data.text();
      const parsed = JSON.parse(text);
      if (Array.isArray(parsed) && parsed.length > 0) {
        memoryPosts = parsed;
        return parsed;
      }
    }
  } catch (err) {
    console.warn("Storage blog posts check:", err);
  }

  // If storage file doesn't exist yet, seed with initial posts
  if (!memoryPosts) {
    memoryPosts = [...INITIAL_BLOG_POSTS];
    // Asynchronously try to persist initial seed to storage for future edits
    persistPostsToStorage(memoryPosts).catch(() => {});
  }

  return memoryPosts;
}

/**
 * Persist posts array to Supabase storage.
 */
async function persistPostsToStorage(posts: BlogPost[]): Promise<boolean> {
  memoryPosts = posts;
  try {
    const jsonStr = JSON.stringify(posts, null, 2);
    const { error } = await supabaseAdmin.storage
      .from(BUCKET_NAME)
      .upload(POSTS_FILE, Buffer.from(jsonStr, "utf-8"), {
        contentType: "application/json",
        upsert: true,
      });

    if (error) {
      // Also try fallback bucket 'site-media'
      await supabaseAdmin.storage
        .from("site-media")
        .upload(POSTS_FILE, Buffer.from(jsonStr, "utf-8"), {
          contentType: "application/json",
          upsert: true,
        });
    }
    return true;
  } catch (err) {
    console.error("Failed to persist blog posts to storage:", err);
    return false;
  }
}

/**
 * Load comments from Supabase storage.
 */
async function loadRawComments(): Promise<BlogComment[]> {
  try {
    const { data, error } = await supabaseAdmin.storage
      .from(BUCKET_NAME)
      .download(COMMENTS_FILE);

    if (data && !error) {
      const text = await data.text();
      const parsed = JSON.parse(text);
      if (Array.isArray(parsed) && parsed.length > 0) {
        memoryComments = parsed;
        return parsed;
      }
    }
  } catch (err) {
    console.warn("Storage blog comments check:", err);
  }

  if (!memoryComments) {
    memoryComments = [...INITIAL_BLOG_COMMENTS];
    persistCommentsToStorage(memoryComments).catch(() => {});
  }

  return memoryComments;
}

/**
 * Persist comments array to Supabase storage.
 */
async function persistCommentsToStorage(comments: BlogComment[]): Promise<boolean> {
  memoryComments = comments;
  try {
    const jsonStr = JSON.stringify(comments, null, 2);
    const { error } = await supabaseAdmin.storage
      .from(BUCKET_NAME)
      .upload(COMMENTS_FILE, Buffer.from(jsonStr, "utf-8"), {
        contentType: "application/json",
        upsert: true,
      });

    if (error) {
      await supabaseAdmin.storage
        .from("site-media")
        .upload(COMMENTS_FILE, Buffer.from(jsonStr, "utf-8"), {
          contentType: "application/json",
          upsert: true,
        });
    }
    return true;
  } catch (err) {
    console.error("Failed to persist blog comments to storage:", err);
    return false;
  }
}

/**
 * Fetch all published blog posts (or all including drafts for admin).
 */
export async function getBlogPosts(options?: {
  includeDrafts?: boolean;
  category?: string;
  search?: string;
  limit?: number;
}): Promise<BlogPost[]> {
  const [allPosts, allComments] = await Promise.all([loadRawPosts(), loadRawComments()]);

  // Map comment counts
  const countMap = new Map<string, number>();
  allComments
    .filter((c) => c.status === "approved")
    .forEach((c) => {
      countMap.set(c.postSlug, (countMap.get(c.postSlug) || 0) + 1);
    });

  let posts = allPosts.map((p) => ({
    ...p,
    commentsCount: countMap.get(p.slug) ?? p.commentsCount ?? 0,
  }));

  if (!options?.includeDrafts) {
    posts = posts.filter((p) => p.published);
  }

  if (options?.category && options.category !== "Всички") {
    posts = posts.filter((p) => p.category === options.category);
  }

  if (options?.search && options.search.trim()) {
    const q = options.search.toLowerCase().trim();
    posts = posts.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        p.content.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    );
  }

  // Sort by publishedAt descending
  posts.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  if (options?.limit && options.limit > 0) {
    posts = posts.slice(0, options.limit);
  }

  return posts;
}

/**
 * Fetch a single post by its slug.
 */
export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const posts = await loadRawPosts();
  const post = posts.find((p) => p.slug === slug);
  if (!post) return null;

  const comments = await loadRawComments();
  const approvedCount = comments.filter((c) => c.postSlug === slug && c.status === "approved").length;

  return {
    ...post,
    commentsCount: approvedCount,
  };
}

/**
 * Create or update a blog post.
 */
export async function saveBlogPost(data: Partial<BlogPost> & { title: string }): Promise<BlogPost> {
  const posts = await loadRawPosts();
  const now = new Date().toISOString();

  let targetId = data.id;
  let isNew = false;

  if (!targetId) {
    targetId = `post-${Date.now()}`;
    isNew = true;
  }

  const existingIdx = posts.findIndex((p) => p.id === targetId);

  // Auto-generate slug if not provided or empty
  let slug = data.slug?.trim();
  if (!slug) {
    slug = slugifyCyrillic(data.title);
  }

  // Ensure unique slug
  let uniqueSlug = slug;
  let counter = 1;
  while (posts.some((p) => p.id !== targetId && p.slug === uniqueSlug)) {
    uniqueSlug = `${slug}-${counter}`;
    counter++;
  }

  const post: BlogPost = {
    id: targetId,
    slug: uniqueSlug,
    title: data.title.trim(),
    excerpt: data.excerpt?.trim() || "",
    content: data.content?.trim() || "",
    coverImage: data.coverImage?.trim() || "/images/banner/1.webp",
    category: data.category?.trim() || "Съвети за родители",
    author: data.author?.trim() || "Екипът на УМеНИе",
    readTime: data.readTime?.trim() || "3 мин четене",
    published: data.published ?? true,
    publishedAt: isNew ? now : data.publishedAt || now,
    updatedAt: now,
    views: data.views ?? 0,
    commentsCount: data.commentsCount ?? 0,
  };

  let updatedPosts: BlogPost[];
  if (existingIdx >= 0) {
    updatedPosts = [...posts];
    updatedPosts[existingIdx] = {
      ...updatedPosts[existingIdx],
      ...post,
    };
  } else {
    updatedPosts = [post, ...posts];
  }

  await persistPostsToStorage(updatedPosts);
  return post;
}

/**
 * Delete a blog post by its ID.
 */
export async function deleteBlogPost(id: string): Promise<boolean> {
  const posts = await loadRawPosts();
  const targetPost = posts.find((p) => p.id === id);
  if (!targetPost) return false;

  const filteredPosts = posts.filter((p) => p.id !== id);
  await persistPostsToStorage(filteredPosts);

  // Also clean up comments for this post
  const comments = await loadRawComments();
  const filteredComments = comments.filter((c) => c.postId !== id && c.postSlug !== targetPost.slug);
  await persistCommentsToStorage(filteredComments);

  return true;
}

/**
 * Get comments for a post or all comments for admin.
 */
export async function getBlogComments(options?: {
  postSlug?: string;
  includeAll?: boolean;
}): Promise<BlogComment[]> {
  const comments = await loadRawComments();

  let filtered = [...comments];

  if (options?.postSlug) {
    filtered = filtered.filter((c) => c.postSlug === options.postSlug);
  }

  if (!options?.includeAll) {
    filtered = filtered.filter((c) => c.status === "approved");
  }

  // Sort newest first
  filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return filtered;
}

/**
 * Add a new comment.
 */
export async function addBlogComment(data: {
  postSlug: string;
  authorName: string;
  authorEmail?: string;
  content: string;
}): Promise<BlogComment> {
  const comments = await loadRawComments();
  const posts = await loadRawPosts();
  const post = posts.find((p) => p.slug === data.postSlug);

  const newComment: BlogComment = {
    id: `comment-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    postId: post ? post.id : data.postSlug,
    postSlug: data.postSlug,
    authorName: data.authorName.trim(),
    authorEmail: data.authorEmail?.trim() || undefined,
    content: data.content.trim(),
    createdAt: new Date().toISOString(),
    status: "approved", // auto-approved with admin moderation capability
  };

  const updatedComments = [newComment, ...comments];
  await persistCommentsToStorage(updatedComments);

  return newComment;
}

/**
 * Moderate comment status (approve, reject).
 */
export async function moderateBlogComment(
  commentId: string,
  status: "approved" | "pending" | "rejected"
): Promise<boolean> {
  const comments = await loadRawComments();
  const idx = comments.findIndex((c) => c.id === commentId);
  if (idx < 0) return false;

  comments[idx].status = status;
  await persistCommentsToStorage([...comments]);
  return true;
}

/**
 * Delete a comment.
 */
export async function deleteBlogComment(commentId: string): Promise<boolean> {
  const comments = await loadRawComments();
  const filtered = comments.filter((c) => c.id !== commentId);
  if (filtered.length === comments.length) return false;

  await persistCommentsToStorage(filtered);
  return true;
}
