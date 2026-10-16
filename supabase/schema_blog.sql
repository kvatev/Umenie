-- ========================================================
-- ТАБЛИЦИ ЗА БЛОГ И КОМЕНТАРИ (Образователен клуб „УМеНИе“)
-- ========================================================

-- 1. Таблица blog_posts
CREATE TABLE IF NOT EXISTS public.blog_posts (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    excerpt TEXT NOT NULL,
    content TEXT NOT NULL,
    cover_image TEXT DEFAULT '/images/banner/1.webp',
    category TEXT DEFAULT 'Съвети за родители',
    author TEXT DEFAULT 'Екипът на УМеНИе',
    read_time TEXT DEFAULT '3 мин четене',
    published BOOLEAN DEFAULT true,
    published_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    views INT DEFAULT 0
);

-- 2. Таблица blog_comments
CREATE TABLE IF NOT EXISTS public.blog_comments (
    id TEXT PRIMARY KEY,
    post_id TEXT REFERENCES public.blog_posts(id) ON DELETE CASCADE,
    post_slug TEXT NOT NULL,
    author_name TEXT NOT NULL,
    author_email TEXT,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    status TEXT DEFAULT 'approved' -- 'approved' | 'pending' | 'rejected'
);

-- Индекси за бързо търсене
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON public.blog_posts(published);
CREATE INDEX IF NOT EXISTS idx_blog_comments_post_slug ON public.blog_comments(post_slug);

-- RLS
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read published posts"
ON public.blog_posts FOR SELECT
USING (published = true);

CREATE POLICY "Allow public read approved comments"
ON public.blog_comments FOR SELECT
USING (status = 'approved');

CREATE POLICY "Allow public insert comments"
ON public.blog_comments FOR INSERT
WITH CHECK (true);
