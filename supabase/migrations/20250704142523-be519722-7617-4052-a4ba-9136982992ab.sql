
-- First, drop all existing tables to start fresh
DROP TABLE IF EXISTS public.tbl_partners CASCADE;
DROP TABLE IF EXISTS public.tbl_players CASCADE;
DROP TABLE IF EXISTS public.tbl_eventname CASCADE;

-- Create events table
CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create players table
CREATE TABLE public.players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  whatsapp_number TEXT NOT NULL UNIQUE,
  date_of_birth DATE NOT NULL,
  city TEXT NOT NULL,
  shirt_size TEXT NOT NULL,
  short_size TEXT NOT NULL,
  food_preference TEXT NOT NULL,
  accommodation_needed BOOLEAN DEFAULT false,
  fee_paid BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create registrations table (replaces tbl_partners)
CREATE TABLE public.registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID NOT NULL REFERENCES public.players(id) ON DELETE CASCADE,
  event_name TEXT NOT NULL,
  partner_id UUID REFERENCES public.players(id) ON DELETE SET NULL,
  ranking INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(player_id, event_name)
);

-- Insert default events
INSERT INTO public.events (name) VALUES 
('Junior Doubles'),
('Men''s Open Doubles'),
('Mixed Doubles'),
('Veterans Doubles'),
('Women''s Open Doubles');

-- Enable RLS on all tables
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.players ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (similar to current setup)
CREATE POLICY "Allow public read access to events" ON public.events FOR SELECT USING (true);
CREATE POLICY "Allow public read access to players" ON public.players FOR SELECT USING (true);
CREATE POLICY "Allow public insert access to players" ON public.players FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access to players" ON public.players FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access to players" ON public.players FOR DELETE USING (true);

CREATE POLICY "Allow public read access to registrations" ON public.registrations FOR SELECT USING (true);
CREATE POLICY "Allow public insert access to registrations" ON public.registrations FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access to registrations" ON public.registrations FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access to registrations" ON public.registrations FOR DELETE USING (true);

-- Create indexes for better performance
CREATE INDEX idx_players_whatsapp ON public.players(whatsapp_number);
CREATE INDEX idx_registrations_player ON public.registrations(player_id);
CREATE INDEX idx_registrations_partner ON public.registrations(partner_id);
CREATE INDEX idx_registrations_event ON public.registrations(event_name);
