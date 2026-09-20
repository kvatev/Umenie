-- Таблица с графика на заниманията в Образователен клуб „УМеНИе“
CREATE TABLE IF NOT EXISTS public.schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    category TEXT NOT NULL, -- 'english', 'math', 'knitting', 'art', 'reading', 'chess', 'stem', 'study_hall'
    day_of_week INT NOT NULL, -- 1 = Понеделник, 2 = Вторник, 3 = Сряда, 4 = Четвъртък, 5 = Петък, 6 = Събота, 7 = Неделя
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    age_group TEXT NOT NULL, -- напр. '6-10 години', '3 клас', 'Възрастни'
    location TEXT NOT NULL DEFAULT 'Славейков, блок 48, партер',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Таблица с получените заявки за записване
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    schedule_id UUID REFERENCES public.schedules(id) ON DELETE SET NULL,
    activity_name TEXT NOT NULL,
    child_name TEXT NOT NULL,
    child_age TEXT NOT NULL,
    parent_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    consent_marketing BOOLEAN DEFAULT false,
    status TEXT DEFAULT 'pending', -- 'pending', 'confirmed', 'declined'
    created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS (Row Level Security)
ALTER TABLE public.schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Всеки може да чете графика
DROP POLICY IF EXISTS "Public read schedules" ON public.schedules;
CREATE POLICY "Public read schedules" ON public.schedules FOR SELECT USING (true);

-- Всеки може да изпрати заявка за записване
DROP POLICY IF EXISTS "Public insert bookings" ON public.bookings;
CREATE POLICY "Public insert bookings" ON public.bookings FOR INSERT WITH CHECK (true);

-- Администраторът (service_role) има пълен достъп
DROP POLICY IF EXISTS "Admin full access schedules" ON public.schedules;
CREATE POLICY "Admin full access schedules" ON public.schedules FOR ALL USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Admin full access bookings" ON public.bookings;
CREATE POLICY "Admin full access bookings" ON public.bookings FOR ALL USING (auth.role() = 'service_role');

-- Първоначални примерни данни за седмичния график (Seed Data)
INSERT INTO public.schedules (title, category, day_of_week, start_time, end_time, age_group, location)
VALUES
    -- Понеделник (1)
    ('Математика', 'math', 1, '16:00', '17:00', '4 клас', 'Славейков, блок 48, партер'),
    ('Четене с разбиране', 'reading', 1, '17:00', '18:00', '2-4 клас', 'Славейков, блок 48, партер'),
    ('Арт занимания', 'art', 1, '18:00', '19:30', '6-11 години', 'Славейков, блок 48, партер'),

    -- Вторник (2)
    ('Английски език', 'english', 2, '16:00', '17:00', '3 клас', 'Славейков, блок 48, партер'),
    ('Шахмат', 'chess', 2, '17:00', '18:00', '6-12 години', 'Славейков, блок 48, партер'),
    ('Плетиво и творчество', 'knitting', 2, '18:00', '19:30', '7-14 години', 'Славейков, блок 48, партер'),

    -- Сряда (3)
    ('Английски език', 'english', 3, '16:00', '17:00', '1 клас', 'Славейков, блок 48, партер'),
    ('Математика', 'math', 3, '17:00', '18:00', '3 клас', 'Славейков, блок 48, партер'),
    ('Арт занимания', 'art', 3, '18:00', '19:30', '5-10 години', 'Славейков, блок 48, партер'),

    -- Четвъртък (4)
    ('Четене с разбиране', 'reading', 4, '16:00', '17:00', '1-3 клас', 'Славейков, блок 48, партер'),
    ('Творческа работилница', 'art', 4, '17:00', '18:30', '7-12 години', 'Славейков, блок 48, партер'),
    ('Шахмат', 'chess', 4, '18:30', '19:30', '7-14 години', 'Славейков, блок 48, партер'),

    -- Петък (5)
    ('STEM клуб', 'stem', 5, '16:00', '17:30', '8-12 години', 'Славейков, блок 48, партер'),
    ('Математика', 'math', 5, '17:30', '18:30', '2 клас', 'Славейков, блок 48, партер'),
    ('Плетиво', 'knitting', 5, '18:30', '20:00', 'Всички възрасти', 'Славейков, блок 48, партер'),

    -- Събота (6)
    ('Арт занимания', 'art', 6, '10:00', '11:30', '5-9 години', 'Славейков, блок 48, партер'),
    ('Плетиво и сръчни ръце', 'knitting', 6, '11:30', '13:00', '7-14 години', 'Славейков, блок 48, партер'),
    ('Шахматни турнири', 'chess', 6, '13:00', '14:30', 'Всички нива', 'Славейков, блок 48, партер'),
    ('Английски език', 'english', 6, '14:30', '15:30', '2 клас', 'Славейков, блок 48, партер'),

    -- Неделя (7)
    ('Читателски клуб „Лигериа“', 'reading', 7, '17:00', '19:30', 'Възрастни', 'Славейков, блок 48, партер')
ON CONFLICT DO NOTHING;
