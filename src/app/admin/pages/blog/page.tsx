import React from "react";
import { Metadata } from "next";
import { BlogPageEditor } from "@/components/admin/pages/BlogPageEditor";
import { getBlogPosts, getBlogComments } from "@/lib/blog-service";

export const metadata: Metadata = {
  title: "Управление на Блог и Статии | Административен панел",
};

export const dynamic = "force-dynamic";

export default async function AdminBlogPage() {
  const [posts, comments] = await Promise.all([
    getBlogPosts({ includeDrafts: true }),
    getBlogComments({ includeAll: true }),
  ]);

  return <BlogPageEditor initialPosts={posts} initialComments={comments} />;
}
