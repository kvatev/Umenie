-- ========================================================
-- ФАЗА 4: АДМИНИСТРАТИВЕН ПАНЕЛ – RLS И STORAGE НАСТРОЙКИ
-- За Образователен клуб „УМеНИе“ (Бургас)
-- ========================================================

-- 1. Разрешения за автентикирани администратори (authenticated users)
-- Дава пълен достъп до таблиците на администраторите след успешен вход с имейл и парола:

-- Таблица с графика (schedules)
DROP POLICY IF EXISTS "Admins full access schedules" ON public.schedules;
CREATE POLICY "Admins full access schedules" ON public.schedules
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Таблица с получените заявки за записване (bookings)
DROP POLICY IF EXISTS "Admins full access bookings" ON public.bookings;
CREATE POLICY "Admins full access bookings" ON public.bookings
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 2. Създаване на публичен Storage Bucket с име 'site-assets'
-- Използва се за динамично качване на:
--   - hero-banner.webp (главен банер за начална страница)
--   - kids-gallery/ (снимки за слайдера „Нашите деца с умения“)
--   - services/ (снимки за индивидуалните дейности)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'site-assets',
    'site-assets',
    true,
    15728640, -- 15MB лимит на файл
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']
)
ON CONFLICT (id) DO UPDATE SET
    public = true,
    file_size_limit = 15728640,
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];

-- 3. RLS политики за Supabase Storage обектите в 'site-assets'

-- Публичен достъп за преглед на снимките (всеки посетител на сайта може да зарежда изображенията)
DROP POLICY IF EXISTS "Public Read Assets" ON storage.objects;
CREATE POLICY "Public Read Assets" ON storage.objects
    FOR SELECT USING (bucket_id = 'site-assets');

-- Качване на нови снимки – само от оторизирани администратори
DROP POLICY IF EXISTS "Admin Insert Assets" ON storage.objects;
CREATE POLICY "Admin Insert Assets" ON storage.objects
    FOR INSERT TO authenticated WITH CHECK (bucket_id = 'site-assets');

-- Редактиране/замяна на снимки – само от оторизирани администратори
DROP POLICY IF EXISTS "Admin Update Assets" ON storage.objects;
CREATE POLICY "Admin Update Assets" ON storage.objects
    FOR UPDATE TO authenticated USING (bucket_id = 'site-assets');

-- Изтриване на снимки – само от оторизирани администратори
DROP POLICY IF EXISTS "Admin Delete Assets" ON storage.objects;
CREATE POLICY "Admin Delete Assets" ON storage.objects
    FOR DELETE TO authenticated USING (bucket_id = 'site-assets');
