-- ====================================================================
-- Migration: Add Advanced Calendar & Recurrence to Umenie Club
-- Run this in your Supabase Project Dashboard -> SQL Editor (Optional)
-- The application automatically works with zero-downtime storage fallback,
-- but running this creates native PostgreSQL table and indexes.
-- ====================================================================

CREATE TABLE IF NOT EXISTS public.schedule_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'art',
    day_of_week INT NOT NULL CHECK (day_of_week BETWEEN 1 AND 7),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    age_group TEXT DEFAULT '',
    location TEXT DEFAULT 'Славейков, блок 48, партер',
    capacity INT DEFAULT 10,
    is_active BOOLEAN DEFAULT true,
    event_date DATE,
    recurrence_type TEXT DEFAULT 'none',
    recurrence_count INT,
    recurrence_until DATE,
    series_id UUID,
    excluded_dates TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.schedule_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access on schedule_events" ON public.schedule_events;
CREATE POLICY "Allow public read access on schedule_events"
    ON public.schedule_events FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow service role full access on schedule_events" ON public.schedule_events;
CREATE POLICY "Allow service role full access on schedule_events"
    ON public.schedule_events FOR ALL USING (true);

CREATE INDEX IF NOT EXISTS idx_schedule_events_date ON public.schedule_events(event_date);
CREATE INDEX IF NOT EXISTS idx_schedule_events_series ON public.schedule_events(series_id);
CREATE INDEX IF NOT EXISTS idx_schedule_events_day ON public.schedule_events(day_of_week);
-- Add column if table already existed without it
ALTER TABLE public.schedule_events ADD COLUMN IF NOT EXISTS excluded_dates TEXT[] DEFAULT '{}';
