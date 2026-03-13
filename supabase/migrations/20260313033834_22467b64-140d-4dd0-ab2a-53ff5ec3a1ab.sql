
-- Create profiles table
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  name text,
  email text,
  business_name text,
  logo_url text,
  currency text NOT NULL DEFAULT 'USD',
  default_hourly_rate numeric NOT NULL DEFAULT 25,
  mode text NOT NULL DEFAULT 'standard',
  events_per_month integer NOT NULL DEFAULT 4,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create user_materials table
CREATE TABLE public.user_materials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  purchase_unit text,
  presentation_price numeric,
  quantity_per_presentation numeric,
  cost_per_unit numeric GENERATED ALWAYS AS (
    CASE WHEN quantity_per_presentation IS NOT NULL AND quantity_per_presentation > 0 
    THEN presentation_price / quantity_per_presentation 
    ELSE NULL END
  ) STORED,
  category text NOT NULL DEFAULT 'general',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.user_materials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own materials" ON public.user_materials
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own materials" ON public.user_materials
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own materials" ON public.user_materials
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own materials" ON public.user_materials
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Create reusable_materials table
CREATE TABLE public.reusable_materials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  material_cost numeric NOT NULL DEFAULT 0,
  cost_per_use numeric NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.reusable_materials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own reusable materials" ON public.reusable_materials
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own reusable materials" ON public.reusable_materials
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reusable materials" ON public.reusable_materials
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own reusable materials" ON public.reusable_materials
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Create user_roles table
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own roles" ON public.user_roles
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- Create user_approval_status table
CREATE TABLE public.user_approval_status (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'approved',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.user_approval_status ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own approval status" ON public.user_approval_status
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- Auto-create approval status on user signup (approved by default)
CREATE OR REPLACE FUNCTION public.handle_new_user_approval()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_approval_status (user_id, status)
  VALUES (NEW.id, 'approved');
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created_approval
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_approval();

-- Create profiles for existing users
INSERT INTO public.profiles (user_id, email)
SELECT id, email FROM auth.users
ON CONFLICT (user_id) DO NOTHING;

-- Create approval status for existing users
INSERT INTO public.user_approval_status (user_id, status)
SELECT id, 'approved' FROM auth.users
ON CONFLICT (user_id) DO NOTHING;
