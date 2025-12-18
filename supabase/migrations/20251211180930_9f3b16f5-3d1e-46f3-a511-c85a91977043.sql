-- Create blog_posts table
CREATE TABLE public.blog_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  category TEXT NOT NULL DEFAULT 'General',
  read_time TEXT DEFAULT '5 min read',
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create comments table
CREATE TABLE public.comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES public.blog_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  author_name TEXT NOT NULL,
  author_email TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create profiles table for user info
CREATE TABLE public.profiles (
  id UUID NOT NULL PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Blog posts policies (public read for published posts)
CREATE POLICY "Anyone can view published posts"
ON public.blog_posts FOR SELECT
USING (published = true);

-- Comments policies
CREATE POLICY "Anyone can view comments"
ON public.comments FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can create comments"
ON public.comments FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments"
ON public.comments FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Profiles policies
CREATE POLICY "Users can view all profiles"
ON public.profiles FOR SELECT
USING (true);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (new.id, new.email, new.raw_user_meta_data ->> 'full_name');
  RETURN new;
END;
$$;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample blog posts
INSERT INTO public.blog_posts (title, slug, excerpt, content, image_url, category, read_time, published) VALUES
('10 WordPress Performance Tips Every Developer Should Know', 'wordpress-performance-tips', 'Learn how to optimize your WordPress site for blazing-fast load times and better user experience.', 'Full article content about WordPress performance optimization including caching, image optimization, database cleanup, and more...', 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=450&fit=crop', 'Performance', '8 min read', true),
('Building Custom Gutenberg Blocks: A Complete Guide', 'custom-gutenberg-blocks', 'Master the art of creating custom Gutenberg blocks with React and modern JavaScript.', 'Complete guide to building Gutenberg blocks with React, including setup, development workflow, and best practices...', 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=450&fit=crop', 'Development', '12 min read', true),
('WordPress Security Best Practices in 2024', 'wordpress-security-2024', 'Protect your WordPress site from hackers with these essential security measures and plugins.', 'Comprehensive security guide covering firewalls, malware scanning, two-factor authentication, and security hardening...', 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&h=450&fit=crop', 'Security', '10 min read', true),
('WooCommerce Customization: Beyond the Basics', 'woocommerce-customization', 'Take your WooCommerce store to the next level with advanced customization techniques.', 'Advanced WooCommerce customization covering hooks, filters, custom checkout flows, and payment gateway integration...', 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=450&fit=crop', 'WooCommerce', '15 min read', true),
('REST API Mastery: Building WordPress Headless Applications', 'wordpress-rest-api', 'Explore the power of WordPress REST API for building modern headless applications.', 'Deep dive into WordPress REST API including authentication, custom endpoints, and building React frontends...', 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=450&fit=crop', 'API', '14 min read', true),
('Advanced Custom Fields: Pro Tips and Tricks', 'acf-pro-tips', 'Unlock the full potential of ACF with these advanced techniques for power users.', 'Advanced ACF techniques including flexible content, repeater optimization, and custom field types...', 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=450&fit=crop', 'Plugins', '9 min read', true);