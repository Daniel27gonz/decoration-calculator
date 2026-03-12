
CREATE TABLE IF NOT EXISTS public.quotes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  client_name TEXT NOT NULL DEFAULT '',
  client_phone TEXT,
  event_date TEXT,
  event_type TEXT,
  balloons JSONB NOT NULL DEFAULT '[]'::jsonb,
  materials JSONB NOT NULL DEFAULT '[]'::jsonb,
  workers JSONB NOT NULL DEFAULT '[]'::jsonb,
  time_phases JSONB NOT NULL DEFAULT '[]'::jsonb,
  extras JSONB NOT NULL DEFAULT '[]'::jsonb,
  furniture_items JSONB NOT NULL DEFAULT '[]'::jsonb,
  transport_items JSONB NOT NULL DEFAULT '[]'::jsonb,
  reusable_materials_used JSONB NOT NULL DEFAULT '[]'::jsonb,
  margin_percentage NUMERIC NOT NULL DEFAULT 30,
  tool_wear_percentage NUMERIC NOT NULL DEFAULT 7,
  wastage_percentage NUMERIC NOT NULL DEFAULT 5,
  notes TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'quotes' AND policyname = 'Users can view their own quotes') THEN
    CREATE POLICY "Users can view their own quotes" ON public.quotes FOR SELECT TO authenticated USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'quotes' AND policyname = 'Users can insert their own quotes') THEN
    CREATE POLICY "Users can insert their own quotes" ON public.quotes FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'quotes' AND policyname = 'Users can update their own quotes') THEN
    CREATE POLICY "Users can update their own quotes" ON public.quotes FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'quotes' AND policyname = 'Users can delete their own quotes') THEN
    CREATE POLICY "Users can delete their own quotes" ON public.quotes FOR DELETE TO authenticated USING (auth.uid() = user_id);
  END IF;
END $$;
