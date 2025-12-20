-- Complete Database Schema for Portfolio Application
-- Run this SQL in your Supabase SQL Editor to set up the entire database
-- This combines all migrations into one file for easy setup

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABLES
-- ============================================

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

-- Hero content table (single row with all fields)
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
  available_badge_text VARCHAR(255) DEFAULT 'Available',
  primary_button_text VARCHAR(255) DEFAULT 'View My Work',
  secondary_button_text VARCHAR(255) DEFAULT 'Download CV',
  stats_label1 VARCHAR(255) DEFAULT 'Projects',
  stats_label2 VARCHAR(255) DEFAULT 'Themes',
  stats_label3 VARCHAR(255) DEFAULT 'Plugins',
  stats_value1 VARCHAR(255) DEFAULT '50+',
  stats_value2 VARCHAR(255) DEFAULT '8+',
  stats_value3 VARCHAR(255) DEFAULT '15+',
  cv_url TEXT,
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

-- Footer content table (single row)
CREATE TABLE IF NOT EXISTS footer_content (
  id VARCHAR(50) PRIMARY KEY DEFAULT 'default',
  brand_name VARCHAR(255),
  description TEXT,
  social_links JSONB DEFAULT '[]',
  link_groups JSONB DEFAULT '[]',
  copyright_text VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(published);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at);
CREATE INDEX IF NOT EXISTS idx_services_order ON services("order");

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE themes ENABLE ROW LEVEL SECURITY;
ALTER TABLE plugins ENABLE ROW LEVEL SECURITY;
ALTER TABLE about_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE footer_content ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS POLICIES
-- ============================================

-- Drop existing policies if they exist, then create new ones
-- Projects policies
DROP POLICY IF EXISTS "Public can read projects" ON projects;
CREATE POLICY "Public can read projects" ON projects FOR SELECT USING (true);
DROP POLICY IF EXISTS "Authenticated users can manage projects" ON projects;
CREATE POLICY "Authenticated users can manage projects" ON projects FOR ALL USING (auth.role() = 'authenticated');

-- Blog posts policies
DROP POLICY IF EXISTS "Public can read published blog posts" ON blog_posts;
CREATE POLICY "Public can read published blog posts" ON blog_posts FOR SELECT USING (published = true OR auth.role() = 'authenticated');
DROP POLICY IF EXISTS "Authenticated users can manage blog posts" ON blog_posts;
CREATE POLICY "Authenticated users can manage blog posts" ON blog_posts FOR ALL USING (auth.role() = 'authenticated');

-- Services policies
DROP POLICY IF EXISTS "Public can read services" ON services;
CREATE POLICY "Public can read services" ON services FOR SELECT USING (true);
DROP POLICY IF EXISTS "Authenticated users can manage services" ON services;
CREATE POLICY "Authenticated users can manage services" ON services FOR ALL USING (auth.role() = 'authenticated');

-- Themes policies
DROP POLICY IF EXISTS "Public can read themes" ON themes;
CREATE POLICY "Public can read themes" ON themes FOR SELECT USING (true);
DROP POLICY IF EXISTS "Authenticated users can manage themes" ON themes;
CREATE POLICY "Authenticated users can manage themes" ON themes FOR ALL USING (auth.role() = 'authenticated');

-- Plugins policies
DROP POLICY IF EXISTS "Public can read plugins" ON plugins;
CREATE POLICY "Public can read plugins" ON plugins FOR SELECT USING (true);
DROP POLICY IF EXISTS "Authenticated users can manage plugins" ON plugins;
CREATE POLICY "Authenticated users can manage plugins" ON plugins FOR ALL USING (auth.role() = 'authenticated');

-- About content policies
DROP POLICY IF EXISTS "Public can read about content" ON about_content;
CREATE POLICY "Public can read about content" ON about_content FOR SELECT USING (true);
DROP POLICY IF EXISTS "Authenticated users can manage about content" ON about_content;
CREATE POLICY "Authenticated users can manage about content" ON about_content FOR ALL USING (auth.role() = 'authenticated');

-- Hero content policies
DROP POLICY IF EXISTS "Public can read hero content" ON hero_content;
CREATE POLICY "Public can read hero content" ON hero_content FOR SELECT USING (true);
DROP POLICY IF EXISTS "Authenticated users can manage hero content" ON hero_content;
CREATE POLICY "Authenticated users can manage hero content" ON hero_content FOR ALL USING (auth.role() = 'authenticated');

-- Contact info policies
DROP POLICY IF EXISTS "Public can read contact info" ON contact_info;
CREATE POLICY "Public can read contact info" ON contact_info FOR SELECT USING (true);
DROP POLICY IF EXISTS "Authenticated users can manage contact info" ON contact_info;
CREATE POLICY "Authenticated users can manage contact info" ON contact_info FOR ALL USING (auth.role() = 'authenticated');

-- Footer content policies
DROP POLICY IF EXISTS "Public can read footer content" ON footer_content;
CREATE POLICY "Public can read footer content" ON footer_content FOR SELECT USING (true);
DROP POLICY IF EXISTS "Authenticated users can manage footer content" ON footer_content;
CREATE POLICY "Authenticated users can manage footer content" ON footer_content FOR ALL USING (auth.role() = 'authenticated');

-- ============================================
-- COMPLETE!
-- ============================================
-- All tables, indexes, and policies have been created.
-- Your database is now ready to use with the portfolio application.

