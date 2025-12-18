-- Create projects table
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  live_url TEXT,
  github_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create services table
CREATE TABLE IF NOT EXISTS public.services (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  icon TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  "order" INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create themes table
CREATE TABLE IF NOT EXISTS public.themes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  live_url TEXT,
  github_url TEXT,
  price TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create plugins table
CREATE TABLE IF NOT EXISTS public.plugins (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  live_url TEXT,
  github_url TEXT,
  price TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create about_content table (single row)
CREATE TABLE IF NOT EXISTS public.about_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  bio TEXT[] DEFAULT '{}',
  skills TEXT[] DEFAULT '{}',
  stats JSONB NOT NULL DEFAULT '{}',
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create contact_info table (single row)
CREATE TABLE IF NOT EXISTS public.contact_info (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  location TEXT NOT NULL,
  response_time TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.themes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plugins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.about_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_info ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Allow public read, authenticated write
-- Projects
CREATE POLICY "Anyone can view projects"
ON public.projects FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can manage projects"
ON public.projects FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Services
CREATE POLICY "Anyone can view services"
ON public.services FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can manage services"
ON public.services FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Themes
CREATE POLICY "Anyone can view themes"
ON public.themes FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can manage themes"
ON public.themes FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Plugins
CREATE POLICY "Anyone can view plugins"
ON public.plugins FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can manage plugins"
ON public.plugins FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- About Content
CREATE POLICY "Anyone can view about content"
ON public.about_content FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can manage about content"
ON public.about_content FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Contact Info
CREATE POLICY "Anyone can view contact info"
ON public.contact_info FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can manage contact info"
ON public.contact_info FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Update blog_posts policies to allow authenticated users to manage
DROP POLICY IF EXISTS "Authenticated users can manage blog posts" ON public.blog_posts;
CREATE POLICY "Authenticated users can manage blog posts"
ON public.blog_posts FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);


