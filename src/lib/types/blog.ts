export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: string;
  author: string;
  readTime: string;
  published: boolean;
  publishedAt: string;
  updatedAt: string;
  views?: number;
  commentsCount?: number;
}

export interface BlogComment {
  id: string;
  postId: string; // matches BlogPost id or slug
  postSlug: string;
  authorName: string;
  authorEmail?: string;
  content: string;
  createdAt: string;
  status: "approved" | "pending" | "rejected";
}

export type BlogCategory =
  | "Всички"
  | "Съвети за родители"
  | "Ранно развитие"
  | "Учебна занималня"
  | "Творчество"
  | "Новини";
