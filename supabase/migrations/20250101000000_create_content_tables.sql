-- Database schema for portfolio application using Supabase
-- Run this SQL in your Supabase SQL Editor to create all required tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  image TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  live_url TEXT,
  github_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Blog posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  category VARCHAR(100),
  read_time VARCHAR(50) DEFAULT '5 min read',
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Services table
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  icon VARCHAR(100) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Themes table
CREATE TABLE IF NOT EXISTS themes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  image TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  live_url TEXT,
  github_url TEXT,
  price VARCHAR(50),
  file_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Plugins table
CREATE TABLE IF NOT EXISTS plugins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  image TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  live_url TEXT,
  github_url TEXT,
  price VARCHAR(50),
  file_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- About content table (single row)
CREATE TABLE IF NOT EXISTS about_content (
  id VARCHAR(50) PRIMARY KEY DEFAULT 'default',
  bio JSONB NOT NULL DEFAULT '[]',
  skills TEXT[] DEFAULT '{}',
  stats JSONB NOT NULL DEFAULT '{}',
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Hero content table (single row)
CREATE TABLE IF NOT EXISTS hero_content (
  id VARCHAR(50) PRIMARY KEY DEFAULT 'default',
  tagline VARCHAR(255),
  headline_line1 VARCHAR(255),
  headline_highlight VARCHAR(255),
  headline_line2 VARCHAR(255),
  subheadline TEXT,
  name VARCHAR(255),
  role VARCHAR(255),
  floating_title VARCHAR(255),
  floating_subtitle VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Contact info table (single row)
CREATE TABLE IF NOT EXISTS contact_info (
  id VARCHAR(50) PRIMARY KEY DEFAULT 'default',
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  location VARCHAR(255),
  response_time VARCHAR(100),
  smtp_host VARCHAR(255),
  smtp_port VARCHAR(10),
  smtp_user VARCHAR(255),
  smtp_password VARCHAR(255),
  smtp_from_email VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(published);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at);
CREATE INDEX IF NOT EXISTS idx_services_order ON services("order");

-- Enable Row Level Security (RLS)
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE themes ENABLE ROW LEVEL SECURITY;
ALTER TABLE plugins ENABLE ROW LEVEL SECURITY;
ALTER TABLE about_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_info ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Allow public read, authenticated write
CREATE POLICY "Public can read projects" ON projects FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage projects" ON projects FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Public can read published blog posts" ON blog_posts FOR SELECT USING (published = true OR auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can manage blog posts" ON blog_posts FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Public can read services" ON services FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage services" ON services FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Public can read themes" ON themes FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage themes" ON themes FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Public can read plugins" ON plugins FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage plugins" ON plugins FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Public can read about content" ON about_content FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage about content" ON about_content FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Public can read hero content" ON hero_content FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage hero content" ON hero_content FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Public can read contact info" ON contact_info FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage contact info" ON contact_info FOR ALL USING (auth.role() = 'authenticated');

