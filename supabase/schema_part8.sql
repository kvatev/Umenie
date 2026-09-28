-- ========================================================
-- ЧАСТ 8: СУПАБЕЙЗ СХЕМА И АДМИНИСТРАТИВЕН ПАНЕЛ
-- За Образователен клуб „УМеНИе“ (Бургас)
-- ========================================================

-- 1. Таблица site_settings (конфигурация за заглавен банер, видео и отзиви)
CREATE TABLE IF NOT EXISTS public.site_settings (
    id INT PRIMARY KEY DEFAULT 1,
    hero_media_type TEXT DEFAULT 'image', -- 'image' | 'video'
    hero_media_url TEXT,
    testimonial_image_url TEXT, -- homepage review screenshot
    settings_json JSONB DEFAULT '{}'::jsonb,
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Начален запис за site_settings
INSERT INTO public.site_settings (id, hero_media_type, hero_media_url, testimonial_image_url)
VALUES (1, 'image', '/images/opening-photo.webp', '/images/review-screenshot.webp')
ON CONFLICT (id) DO NOTHING;

-- 2. Таблица gallery_images („Нашите деца с умения“)
CREATE TABLE IF NOT EXISTS public.gallery_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bucket_path TEXT NOT NULL,
    public_url TEXT NOT NULL,
    display_order INT DEFAULT 0,
    caption TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Таблица reviews_images (за /za-nas „Ето какво казват родителите“)
CREATE TABLE IF NOT EXISTS public.reviews_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    public_url TEXT NOT NULL,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Таблица schedule_events (седмичен график)
CREATE TABLE IF NOT EXISTS public.schedule_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    day_of_week INT NOT NULL, -- 1 = Понеделник ... 7 = Неделя
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    age_group TEXT,
    location TEXT DEFAULT 'Славейков, блок 48, партер',
    capacity INT DEFAULT 10,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Таблица bookings (заявки за записване)
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES public.schedule_events(id) ON DELETE SET NULL,
    schedule_id UUID,
    activity_name TEXT NOT NULL,
    child_name TEXT NOT NULL,
    child_age TEXT NOT NULL,
    parent_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    consent_marketing BOOLEAN DEFAULT false,
    status TEXT DEFAULT 'pending', -- 'pending' | 'confirmed' | 'cancelled' | 'declined'
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Добавяне на event_id ако таблицата bookings вече съществува
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'bookings' 
        AND column_name = 'event_id'
    ) THEN
        ALTER TABLE public.bookings ADD COLUMN event_id UUID REFERENCES public.schedule_events(id) ON DELETE SET NULL;
    END IF;
END $$;

-- 6. Storage Bucket: 'site-media'
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'site-media',
    'site-media',
    true,
    20971520, -- 20MB
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'video/mp4', 'video/webm', 'application/pdf']
)
ON CONFLICT (id) DO UPDATE SET
    public = true,
    file_size_limit = 20971520,
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'video/mp4', 'video/webm', 'application/pdf'];

-- 7. RLS (Row Level Security) политики
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schedule_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Публичен достъп за четене
DROP POLICY IF EXISTS "Public read site_settings" ON public.site_settings;
CREATE POLICY "Public read site_settings" ON public.site_settings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read gallery_images" ON public.gallery_images;
CREATE POLICY "Public read gallery_images" ON public.gallery_images FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read reviews_images" ON public.reviews_images;
CREATE POLICY "Public read reviews_images" ON public.reviews_images FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read schedule_events" ON public.schedule_events;
CREATE POLICY "Public read schedule_events" ON public.schedule_events FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public insert bookings" ON public.bookings;
CREATE POLICY "Public insert bookings" ON public.bookings FOR INSERT WITH CHECK (true);

-- Администраторски пълен достъп (service_role и authenticated)
DROP POLICY IF EXISTS "Admin full access site_settings" ON public.site_settings;
CREATE POLICY "Admin full access site_settings" ON public.site_settings FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admin full access gallery_images" ON public.gallery_images;
CREATE POLICY "Admin full access gallery_images" ON public.gallery_images FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admin full access reviews_images" ON public.reviews_images;
CREATE POLICY "Admin full access reviews_images" ON public.reviews_images FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admin full access schedule_events" ON public.schedule_events;
CREATE POLICY "Admin full access schedule_events" ON public.schedule_events FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admin full access bookings" ON public.bookings;
CREATE POLICY "Admin full access bookings" ON public.bookings FOR ALL USING (true) WITH CHECK (true);

-- Storage политики за 'site-media'
DROP POLICY IF EXISTS "Public read site-media" ON storage.objects;
CREATE POLICY "Public read site-media" ON storage.objects FOR SELECT USING (bucket_id = 'site-media' OR bucket_id = 'site-assets');

DROP POLICY IF EXISTS "Admin insert site-media" ON storage.objects;
CREATE POLICY "Admin insert site-media" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'site-media' OR bucket_id = 'site-assets');

DROP POLICY IF EXISTS "Admin update site-media" ON storage.objects;
CREATE POLICY "Admin update site-media" ON storage.objects FOR UPDATE USING (bucket_id = 'site-media' OR bucket_id = 'site-assets');

DROP POLICY IF EXISTS "Admin delete site-media" ON storage.objects;
CREATE POLICY "Admin delete site-media" ON storage.objects FOR DELETE USING (bucket_id = 'site-media' OR bucket_id = 'site-assets');
