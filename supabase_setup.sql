-- Script SQL Setup Supabase untuk Menfess Studio

-- 1. Tabel Profiles (Untuk Role Admin)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255),
    role VARCHAR(50) NOT NULL DEFAULT 'user',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS untuk profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow users read own profile" ON public.profiles;
CREATE POLICY "Allow users read own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = id);

-- Trigger Otomatis Pembuatan Profile saat User Mendaftar di Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (new.id, new.email, 'admin')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 2. Tabel Database 'menfess'
CREATE TABLE IF NOT EXISTS public.menfess (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    template_id VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    sender_name VARCHAR(255),
    recipient_name VARCHAR(255),
    hashtag VARCHAR(255),
    song VARCHAR(255),
    image_url TEXT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.menfess ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if needed to avoid conflicts
DROP POLICY IF EXISTS "Allow public insert to menfess" ON public.menfess;
DROP POLICY IF EXISTS "Allow service role full access" ON public.menfess;
DROP POLICY IF EXISTS "Allow read approved menfess" ON public.menfess;

-- RLS Policies
CREATE POLICY "Allow public insert to menfess" 
ON public.menfess FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow read approved menfess" 
ON public.menfess FOR SELECT 
USING (status = 'approved');

CREATE POLICY "Allow service role full access" 
ON public.menfess FOR ALL 
USING (true);

-- 3. Storage Bucket 'menfess' (Public Bucket)
INSERT INTO storage.buckets (id, name, public)
VALUES ('menfess', 'menfess', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage Policies
DROP POLICY IF EXISTS "Public Read Menfess Storage" ON storage.objects;
DROP POLICY IF EXISTS "Public Upload Menfess Storage" ON storage.objects;

CREATE POLICY "Public Read Menfess Storage" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'menfess');

CREATE POLICY "Public Upload Menfess Storage" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'menfess');

