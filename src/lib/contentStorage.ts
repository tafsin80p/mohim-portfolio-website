// Content storage utility for managing all website content
// Data is synced with Supabase database and falls back to localStorage

import { supabase } from "@/integrations/supabase/client";

export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  liveUrl?: string;
  githubUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image_url?: string;
  category: string;
  read_time: string;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface Service {
  id: string;
  icon: string;
  title: string;
  description: string;
  order: number;
}

export interface Theme {
  id: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  liveUrl?: string;
  githubUrl?: string;
  price?: string;
  fileUrl?: string;
}

export interface Plugin {
  id: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  liveUrl?: string;
  githubUrl?: string;
  price?: string;
  fileUrl?: string;
}

export interface AboutContent {
  bio: string[];
  skills: string[];
  stats: {
    experience: string;
    projects: string;
    clients: string;
    coffee: string;
  };
  imageUrl?: string;
}

export interface HeroContent {
  tagline: string;
  headlineLine1: string;
  headlineHighlight: string;
  headlineLine2: string;
  subheadline: string;
  name: string;
  role: string;
  floatingTitle: string;
  floatingSubtitle: string;
  availableBadgeText: string;
  primaryButtonText: string;
  secondaryButtonText: string;
  statsLabel1: string;
  statsLabel2: string;
  statsLabel3: string;
  statsValue1: string;
  statsValue2: string;
  statsValue3: string;
  cvUrl?: string;
}

export interface ContactInfo {
  email: string;
  phone: string;
  location: string;
  responseTime: string;
  smtpHost?: string;
  smtpPort?: string;
  smtpUser?: string;
  smtpPassword?: string;
  smtpFromEmail?: string;
}

export interface SocialLink {
  icon: string; // 'Github' | 'Linkedin' | 'Twitter' | 'Mail' | etc.
  href: string;
  label: string;
}

export interface FooterLink {
  name: string;
  path: string;
}

export interface FooterLinkGroup {
  title: string;
  links: FooterLink[];
}

export interface FooterContent {
  brandName: string;
  description: string;
  socialLinks: SocialLink[];
  linkGroups: FooterLinkGroup[];
  copyrightText: string;
}

// Helper to check if Supabase is available
const isSupabaseAvailable = () => {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
  return !!(url && key && url !== 'https://placeholder.supabase.co' && key !== 'placeholder-key');
};

// Projects
export const getProjects = async (): Promise<Project[]> => {
  if (isSupabaseAvailable()) {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (data || []).map((p: Record<string, unknown>) => ({
        id: p.id as string,
        title: p.title as string,
        description: p.description as string,
        image: p.image as string,
        tags: (p.tags as string[]) || [],
        liveUrl: p.live_url as string | undefined,
        githubUrl: p.github_url as string | undefined,
        createdAt: p.created_at as string,
        updatedAt: p.updated_at as string,
      }));
    } catch (error) {
      console.error('Error fetching projects from database:', error);
      return getProjectsLocal();
    }
  }
  return getProjectsLocal();
};

const getProjectsLocal = (): Project[] => {
  const data = localStorage.getItem('website-projects');
  return data ? JSON.parse(data) : [];
};

export const saveProjects = async (projects: Project[]): Promise<void> => {
  if (isSupabaseAvailable()) {
    try {
      // Delete all existing projects
      await supabase.from('projects').delete().neq('id', '00000000-0000-0000-0000-000000000000');

      if (projects.length > 0) {
        const projectsToInsert = projects.map(project => ({
          id: project.id,
          title: project.title,
          description: project.description,
          image: project.image,
          tags: project.tags,
          live_url: project.liveUrl,
          github_url: project.githubUrl,
          created_at: project.createdAt,
          updated_at: project.updatedAt,
        }));

        const { error } = await supabase.from('projects').insert(projectsToInsert);
        if (error) throw error;
      }
      return;
    } catch (error) {
      console.error('Error saving projects to database:', error);
    }
  }
  localStorage.setItem('website-projects', JSON.stringify(projects));
};

export const addProject = async (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<Project> => {
  const newProject: Project = {
    ...project,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  if (isSupabaseAvailable()) {
    try {
      const { error } = await supabase.from('projects').insert({
        id: newProject.id,
        title: newProject.title,
        description: newProject.description,
        image: newProject.image,
        tags: newProject.tags,
        live_url: newProject.liveUrl,
        github_url: newProject.githubUrl,
        created_at: newProject.createdAt,
        updated_at: newProject.updatedAt,
      });
      if (error) throw error;
      return newProject;
    } catch (error) {
      console.error('Error adding project to database:', error);
    }
  }

  const projects = getProjectsLocal();
  projects.push(newProject);
  localStorage.setItem('website-projects', JSON.stringify(projects));
  return newProject;
};

export const updateProject = async (id: string, updates: Partial<Project>): Promise<Project | null> => {
  if (isSupabaseAvailable()) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const updateData: any = {
        updated_at: new Date().toISOString(),
      };
      if (updates.title !== undefined) updateData.title = updates.title;
      if (updates.description !== undefined) updateData.description = updates.description;
      if (updates.image !== undefined) updateData.image = updates.image;
      if (updates.tags !== undefined) updateData.tags = updates.tags;
      if (updates.liveUrl !== undefined) updateData.live_url = updates.liveUrl;
      if (updates.githubUrl !== undefined) updateData.github_url = updates.githubUrl;

      const { data, error } = await supabase
        .from('projects')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      if (!data) return null;

      return {
        id: data.id,
        title: data.title,
        description: data.description,
        image: data.image,
        tags: data.tags || [],
        liveUrl: data.live_url,
        githubUrl: data.github_url,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };
    } catch (error) {
      console.error('Error updating project in database:', error);
    }
  }

  const projects = getProjectsLocal();
  const index = projects.findIndex(p => p.id === id);
  if (index === -1) return null;

  projects[index] = {
    ...projects[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  localStorage.setItem('website-projects', JSON.stringify(projects));
  return projects[index];
};

export const deleteProject = async (id: string): Promise<boolean> => {
  if (isSupabaseAvailable()) {
    try {
      const { error } = await supabase.from('projects').delete().eq('id', id);
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting project from database:', error);
      return false;
    }
  }

  const projects = getProjectsLocal();
  const filtered = projects.filter(p => p.id !== id);
  if (filtered.length === projects.length) return false;
  localStorage.setItem('website-projects', JSON.stringify(filtered));
  return true;
};

// Blog Posts
export const getBlogPosts = async (): Promise<BlogPost[]> => {
  if (isSupabaseAvailable()) {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (data || []).map((p: Record<string, unknown>) => ({
        id: p.id as string,
        title: p.title as string,
        slug: p.slug as string,
        excerpt: p.excerpt as string,
        content: p.content as string,
        image_url: p.image_url as string | undefined,
        category: p.category as string,
        read_time: (p.read_time as string) || '5 min read',
        published: (p.published as boolean) || false,
        created_at: p.created_at as string,
        updated_at: p.updated_at as string,
      }));
    } catch (error) {
      console.error('Error fetching blog posts from database:', error);
      return getBlogPostsLocal();
    }
  }
  return getBlogPostsLocal();
};

const getBlogPostsLocal = (): BlogPost[] => {
  const data = localStorage.getItem('website-blog-posts');
  return data ? JSON.parse(data) : [];
};

export const getPublishedBlogPosts = async (): Promise<BlogPost[]> => {
  if (isSupabaseAvailable()) {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (data || []).map((p: Record<string, unknown>) => ({
        id: p.id as string,
        title: p.title as string,
        slug: p.slug as string,
        excerpt: p.excerpt as string,
        content: p.content as string,
        image_url: p.image_url as string | undefined,
        category: p.category as string,
        read_time: (p.read_time as string) || '5 min read',
        published: (p.published as boolean) || false,
        created_at: p.created_at as string,
        updated_at: p.updated_at as string,
      }));
    } catch (error) {
      console.error('Error fetching published blog posts from database:', error);
      const posts = await getBlogPosts();
      return posts.filter(post => post.published);
    }
  }
  const posts = await getBlogPosts();
  return posts.filter(post => post.published);
};

export const getBlogPostBySlug = async (slug: string): Promise<BlogPost | null> => {
  if (isSupabaseAvailable()) {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .eq('published', true)
        .single();

      if (error) throw error;
      if (!data) return null;

      return {
        id: data.id,
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt,
        content: data.content,
        image_url: data.image_url,
        category: data.category,
        read_time: data.read_time || '5 min read',
        published: data.published || false,
        created_at: data.created_at,
        updated_at: data.updated_at,
      };
    } catch (error) {
      console.error('Error fetching blog post from database:', error);
      const posts = await getBlogPosts();
      return posts.find(post => post.slug === slug && post.published) || null;
    }
  }
  const posts = await getBlogPosts();
  return posts.find(post => post.slug === slug && post.published) || null;
};

export const saveBlogPosts = async (posts: BlogPost[]): Promise<void> => {
  if (isSupabaseAvailable()) {
    try {
      await supabase.from('blog_posts').delete().neq('id', '00000000-0000-0000-0000-000000000000');

      if (posts.length > 0) {
        const postsToInsert = posts.map(post => ({
          id: post.id,
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          content: post.content,
          image_url: post.image_url,
          category: post.category,
          read_time: post.read_time,
          published: post.published,
          created_at: post.created_at,
          updated_at: post.updated_at,
        }));

        const { error } = await supabase.from('blog_posts').insert(postsToInsert);
        if (error) throw error;
      }
      return;
    } catch (error) {
      console.error('Error saving blog posts to database:', error);
    }
  }
  localStorage.setItem('website-blog-posts', JSON.stringify(posts));
};

export const addBlogPost = async (post: Omit<BlogPost, 'id' | 'created_at' | 'updated_at'>): Promise<BlogPost> => {
  const newPost: BlogPost = {
    ...post,
    id: crypto.randomUUID(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  if (isSupabaseAvailable()) {
    try {
      const { error } = await supabase.from('blog_posts').insert({
        id: newPost.id,
        title: newPost.title,
        slug: newPost.slug,
        excerpt: newPost.excerpt,
        content: newPost.content,
        image_url: newPost.image_url,
        category: newPost.category,
        read_time: newPost.read_time,
        published: newPost.published,
        created_at: newPost.created_at,
        updated_at: newPost.updated_at,
      });
      if (error) throw error;
      return newPost;
    } catch (error) {
      console.error('Error adding blog post to database:', error);
    }
  }

  const posts = getBlogPostsLocal();
  posts.push(newPost);
  localStorage.setItem('website-blog-posts', JSON.stringify(posts));
  return newPost;
};

export const updateBlogPost = async (id: string, updates: Partial<BlogPost>): Promise<BlogPost | null> => {
  if (isSupabaseAvailable()) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const updateData: any = {
        updated_at: new Date().toISOString(),
      };
      if (updates.title !== undefined) updateData.title = updates.title;
      if (updates.slug !== undefined) updateData.slug = updates.slug;
      if (updates.excerpt !== undefined) updateData.excerpt = updates.excerpt;
      if (updates.content !== undefined) updateData.content = updates.content;
      if (updates.image_url !== undefined) updateData.image_url = updates.image_url;
      if (updates.category !== undefined) updateData.category = updates.category;
      if (updates.read_time !== undefined) updateData.read_time = updates.read_time;
      if (updates.published !== undefined) updateData.published = updates.published;

      const { data, error } = await supabase
        .from('blog_posts')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      if (!data) return null;

      return {
        id: data.id,
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt,
        content: data.content,
        image_url: data.image_url,
        category: data.category,
        read_time: data.read_time || '5 min read',
        published: data.published || false,
        created_at: data.created_at,
        updated_at: data.updated_at,
      };
    } catch (error) {
      console.error('Error updating blog post in database:', error);
    }
  }

  const posts = getBlogPostsLocal();
  const index = posts.findIndex(p => p.id === id);
  if (index === -1) return null;

  posts[index] = {
    ...posts[index],
    ...updates,
    updated_at: new Date().toISOString(),
  };
  localStorage.setItem('website-blog-posts', JSON.stringify(posts));
  return posts[index];
};

export const deleteBlogPost = async (id: string): Promise<boolean> => {
  if (isSupabaseAvailable()) {
    try {
      const { error } = await supabase.from('blog_posts').delete().eq('id', id);
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting blog post from database:', error);
      return false;
    }
  }

  const posts = getBlogPostsLocal();
  const filtered = posts.filter(p => p.id !== id);
  if (filtered.length === posts.length) return false;
  localStorage.setItem('website-blog-posts', JSON.stringify(filtered));
  return true;
};

// Services
export const getServices = async (): Promise<Service[]> => {
  if (isSupabaseAvailable()) {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('order', { ascending: true });

      if (error) throw error;

      // If Supabase returns data, use it
      if (data && data.length > 0) {
        return data.map((s: Record<string, unknown>) => ({
          id: s.id as string,
          icon: s.icon as string,
          title: s.title as string,
          description: s.description as string,
          order: (s.order as number) || 0,
        }));
      }
      
      // If Supabase returns empty but localStorage has data, use localStorage
      const localData = getServicesLocal();
      if (localData.length > 0) {
        console.warn('Supabase returned empty services, using localStorage data');
        return localData;
      }
      
      return [];
    } catch (error) {
      console.error('Error fetching services from database:', error);
      return getServicesLocal();
    }
  }
  return getServicesLocal();
};

const getServicesLocal = (): Service[] => {
  const data = localStorage.getItem('website-services');
  return data ? JSON.parse(data) : [];
};

export const saveServices = async (services: Service[]): Promise<void> => {
  // Always save to localStorage first as backup
  localStorage.setItem('website-services', JSON.stringify(services));
  
  if (isSupabaseAvailable()) {
    try {
      // Use upsert instead of delete+insert to avoid data loss
      if (services.length > 0) {
        const servicesToInsert = services.map(service => ({
          id: service.id,
          icon: service.icon,
          title: service.title,
          description: service.description,
          order: service.order,
        }));

        // Delete all existing services first
        const { error: deleteError } = await supabase.from('services').delete().neq('id', '00000000-0000-0000-0000-000000000000');
        if (deleteError) {
          console.warn('Error deleting old services:', deleteError);
          // Continue with insert anyway
        }

        const { error: insertError } = await supabase.from('services').insert(servicesToInsert);
        if (insertError) {
          console.error('Error inserting services to database:', insertError);
          // Data is already in localStorage, so continue
        }
      } else {
        // If services array is empty, delete all services
        const { error: deleteError } = await supabase.from('services').delete().neq('id', '00000000-0000-0000-0000-000000000000');
        if (deleteError) {
          console.error('Error deleting services:', deleteError);
          // Continue anyway, localStorage is already updated
        }
      }
    } catch (error) {
      console.error('Error saving services to database:', error);
      // Data is already saved to localStorage above, so it's safe
    }
  }
};

// Themes
export const getThemes = async (): Promise<Theme[]> => {
  if (isSupabaseAvailable()) {
    try {
      const { data, error } = await supabase
        .from('themes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (data || []).map((t: Record<string, unknown>) => ({
        id: t.id as string,
        title: t.title as string,
        description: t.description as string,
        image: (t.image as string) || "",
        tags: (t.tags as string[]) || [],
        liveUrl: (t.live_url as string) || undefined,
        githubUrl: (t.github_url as string) || undefined,
        price: (t.price as string) || undefined,
        fileUrl: (t.file_url as string) || undefined,
      }));
    } catch (error) {
      console.error('Error fetching themes from database:', error);
      return getThemesLocal();
    }
  }
  return getThemesLocal();
};

const getThemesLocal = (): Theme[] => {
  const data = localStorage.getItem('website-themes');
  return data ? JSON.parse(data) : [];
};

export const saveThemes = async (themes: Theme[]): Promise<void> => {
  if (isSupabaseAvailable()) {
    try {
      await supabase.from('themes').delete().neq('id', '00000000-0000-0000-0000-000000000000');

      if (themes.length > 0) {
        const themesToInsert = themes.map(theme => ({
          id: theme.id,
          title: theme.title,
          description: theme.description,
          image: theme.image,
          tags: theme.tags,
          live_url: theme.liveUrl,
          github_url: theme.githubUrl,
          price: theme.price,
          file_url: theme.fileUrl,
        }));

        const { error } = await supabase.from('themes').insert(themesToInsert);
        if (error) throw error;
      }
      return;
    } catch (error) {
      console.error('Error saving themes to database:', error);
    }
  }
  localStorage.setItem('website-themes', JSON.stringify(themes));
};

// Plugins
export const getPlugins = async (): Promise<Plugin[]> => {
  if (isSupabaseAvailable()) {
    try {
      const { data, error } = await supabase
        .from('plugins')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (data || []).map((p: Record<string, unknown>) => ({
        id: p.id as string,
        title: p.title as string,
        description: p.description as string,
        image: (p.image as string) || "",
        tags: (p.tags as string[]) || [],
        liveUrl: (p.live_url as string) || undefined,
        githubUrl: (p.github_url as string) || undefined,
        price: (p.price as string) || undefined,
        fileUrl: (p.file_url as string) || undefined,
      }));
    } catch (error) {
      console.error('Error fetching plugins from database:', error);
      return getPluginsLocal();
    }
  }
  return getPluginsLocal();
};

const getPluginsLocal = (): Plugin[] => {
  const data = localStorage.getItem('website-plugins');
  return data ? JSON.parse(data) : [];
};

export const savePlugins = async (plugins: Plugin[]): Promise<void> => {
  if (isSupabaseAvailable()) {
    try {
      await supabase.from('plugins').delete().neq('id', '00000000-0000-0000-0000-000000000000');

      if (plugins.length > 0) {
        const pluginsToInsert = plugins.map(plugin => ({
          id: plugin.id,
          title: plugin.title,
          description: plugin.description,
          image: plugin.image,
          tags: plugin.tags,
          live_url: plugin.liveUrl,
          github_url: plugin.githubUrl,
          price: plugin.price,
          file_url: plugin.fileUrl,
        }));

        const { error } = await supabase.from('plugins').insert(pluginsToInsert);
        if (error) throw error;
      }
      return;
    } catch (error) {
      console.error('Error saving plugins to database:', error);
    }
  }
  localStorage.setItem('website-plugins', JSON.stringify(plugins));
};

// About Content
export const getAboutContent = async (): Promise<AboutContent> => {
  if (isSupabaseAvailable()) {
    try {
      const { data, error } = await supabase
        .from('about_content')
        .select('*')
        .eq('id', 'default')
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        return {
          bio: data.bio || [],
          skills: data.skills || [],
          stats: data.stats || {},
          imageUrl: data.image_url,
        };
      }
    } catch (error) {
      console.error('Error fetching about content from database:', error);
    }
  }
  return getAboutContentLocal();
};

const getAboutContentLocal = (): AboutContent => {
  const data = localStorage.getItem('website-about');
  if (data) return JSON.parse(data);

  const defaultContent: AboutContent = {
    bio: [
      "Hi! I'm a WordPress developer with over 8 years of experience crafting beautiful, functional websites. I specialize in creating custom themes, plugins, and full-stack WordPress solutions.",
      "My journey started as a freelancer, and since then I've worked with startups, agencies, and enterprise clients worldwide. I believe in writing clean, maintainable code that scales.",
      "When I'm not coding, you'll find me exploring new technologies, contributing to open-source projects, or sharing knowledge through my blog.",
    ],
    skills: [
      "WordPress", "PHP", "JavaScript", "TypeScript", "React", "WooCommerce",
      "Gutenberg", "REST API", "MySQL", "Git", "SCSS", "Tailwind CSS",
      "ACF", "Elementor", "Custom Plugins", "Theme Development"
    ],
    stats: {
      experience: "8+",
      projects: "50+",
      clients: "100+",
      coffee: "∞",
    },
  };

  localStorage.setItem('website-about', JSON.stringify(defaultContent));
  return defaultContent;
};

export const saveAboutContent = async (content: AboutContent): Promise<void> => {
  if (isSupabaseAvailable()) {
    try {
      const { error } = await supabase.from('about_content').upsert({
        id: 'default',
        bio: content.bio,
        skills: content.skills,
        stats: content.stats,
        image_url: content.imageUrl,
        updated_at: new Date().toISOString(),
      });
      if (error) throw error;
      return;
    } catch (error) {
      console.error('Error saving about content to database:', error);
    }
  }
  localStorage.setItem('website-about', JSON.stringify(content));
};

// Hero Content
export const getHeroContent = async (): Promise<HeroContent> => {
  if (isSupabaseAvailable()) {
    try {
      const { data, error } = await supabase
        .from('hero_content')
        .select('*')
        .eq('id', 'default')
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        return {
          tagline: data.tagline || '',
          headlineLine1: data.headline_line1 || '',
          headlineHighlight: data.headline_highlight || '',
          headlineLine2: data.headline_line2 || '',
          subheadline: data.subheadline || '',
          name: data.name || '',
          role: data.role || '',
          floatingTitle: data.floating_title || '',
          floatingSubtitle: data.floating_subtitle || '',
          availableBadgeText: data.available_badge_text || 'Available',
          primaryButtonText: data.primary_button_text || 'View My Work',
          secondaryButtonText: data.secondary_button_text || 'Download CV',
          statsLabel1: data.stats_label1 || 'Projects',
          statsLabel2: data.stats_label2 || 'Themes',
          statsLabel3: data.stats_label3 || 'Plugins',
          statsValue1: data.stats_value1 || '50+',
          statsValue2: data.stats_value2 || '8+',
          statsValue3: data.stats_value3 || '15+',
          cvUrl: data.cv_url || undefined,
        };
      }
    } catch (error) {
      console.error('Error fetching hero content from database:', error);
    }
  }
  return getHeroContentLocal();
};

const getHeroContentLocal = (): HeroContent => {
  const data = localStorage.getItem("website-hero");
  if (data) return JSON.parse(data);

  const defaultContent: HeroContent = {
    tagline: "Available for freelance work",
    headlineLine1: "I craft beautiful",
    headlineHighlight: "WordPress",
    headlineLine2: "experiences",
    subheadline:
      "WordPress developer specializing in custom themes, plugins, and full-stack solutions. Turning complex ideas into elegant, performant websites.",
    name: "Tafsin Ahmed",
    role: "WordPress Developer",
    floatingTitle: "WordPress Expert",
    floatingSubtitle: "Since 2016",
    availableBadgeText: "Available",
    primaryButtonText: "View My Work",
    secondaryButtonText: "Download CV",
    statsLabel1: "Projects",
    statsLabel2: "Themes",
    statsLabel3: "Plugins",
    statsValue1: "50+",
    statsValue2: "8+",
    statsValue3: "15+",
  };

  localStorage.setItem("website-hero", JSON.stringify(defaultContent));
  return defaultContent;
};

export const saveHeroContent = async (content: HeroContent): Promise<void> => {
  if (isSupabaseAvailable()) {
    try {
      const { error } = await supabase.from('hero_content').upsert({
        id: 'default',
        tagline: content.tagline,
        headline_line1: content.headlineLine1,
        headline_highlight: content.headlineHighlight,
        headline_line2: content.headlineLine2,
        subheadline: content.subheadline,
        name: content.name,
        role: content.role,
        floating_title: content.floatingTitle,
        floating_subtitle: content.floatingSubtitle,
        available_badge_text: content.availableBadgeText,
        primary_button_text: content.primaryButtonText,
        secondary_button_text: content.secondaryButtonText,
        stats_label1: content.statsLabel1,
        stats_label2: content.statsLabel2,
        stats_label3: content.statsLabel3,
        stats_value1: content.statsValue1,
        stats_value2: content.statsValue2,
        stats_value3: content.statsValue3,
        cv_url: content.cvUrl || null,
        updated_at: new Date().toISOString(),
      });
      if (error) throw error;
      return;
    } catch (error) {
      console.error('Error saving hero content to database:', error);
    }
  }
  localStorage.setItem("website-hero", JSON.stringify(content));
};

// Contact Info
export const getContactInfo = async (): Promise<ContactInfo> => {
  if (isSupabaseAvailable()) {
    try {
      const { data, error } = await supabase
        .from('contact_info')
        .select('*')
        .eq('id', 'default')
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        return {
          email: data.email,
          phone: data.phone,
          location: data.location,
          responseTime: data.response_time,
          smtpHost: data.smtp_host,
          smtpPort: data.smtp_port,
          smtpUser: data.smtp_user,
          smtpPassword: data.smtp_password,
          smtpFromEmail: data.smtp_from_email,
        };
      }
    } catch (error) {
      console.error('Error fetching contact info from database:', error);
    }
  }
  return getContactInfoLocal();
};

const getContactInfoLocal = (): ContactInfo => {
  const data = localStorage.getItem('website-contact');
  if (data) return JSON.parse(data);

  const defaultInfo: ContactInfo = {
    email: "hello@devname.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    responseTime: "Within 24 hours",
  };

  localStorage.setItem('website-contact', JSON.stringify(defaultInfo));
  return defaultInfo;
};

export const saveContactInfo = async (info: ContactInfo): Promise<void> => {
  if (isSupabaseAvailable()) {
    try {
      const { error } = await supabase.from('contact_info').upsert({
        id: 'default',
        email: info.email,
        phone: info.phone,
        location: info.location,
        response_time: info.responseTime,
        smtp_host: info.smtpHost,
        smtp_port: info.smtpPort,
        smtp_user: info.smtpUser,
        smtp_password: info.smtpPassword,
        smtp_from_email: info.smtpFromEmail,
        updated_at: new Date().toISOString(),
      });
      if (error) throw error;
      return;
    } catch (error) {
      console.error('Error saving contact info to database:', error);
    }
  }
  localStorage.setItem('website-contact', JSON.stringify(info));
};

// Footer Content
export const getFooterContent = async (): Promise<FooterContent> => {
  if (isSupabaseAvailable()) {
    try {
      const { data, error } = await supabase
        .from('footer_content')
        .select('*')
        .eq('id', 'default')
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        return {
          brandName: data.brand_name || '',
          description: data.description || '',
          socialLinks: data.social_links || [],
          linkGroups: data.link_groups || [],
          copyrightText: data.copyright_text || '',
        };
      }
    } catch (error) {
      console.error('Error fetching footer content from database:', error);
    }
  }
  return getFooterContentLocal();
};

const getFooterContentLocal = (): FooterContent => {
  const data = localStorage.getItem('website-footer');
  if (data) return JSON.parse(data);

  const defaultContent: FooterContent = {
    brandName: "Tafsin Ahmed",
    description: "WordPress developer crafting exceptional themes, plugins, and custom solutions for businesses worldwide.",
    socialLinks: [
      { icon: "Github", href: "#", label: "GitHub" },
      { icon: "Linkedin", href: "#", label: "LinkedIn" },
      { icon: "Twitter", href: "#", label: "Twitter" },
      { icon: "Mail", href: "mailto:hello@example.com", label: "Email" },
    ],
    linkGroups: [
      {
        title: "Pages",
        links: [
          { name: "Home", path: "/" },
          { name: "About", path: "/about" },
          { name: "Projects", path: "/projects" },
        ],
      },
      {
        title: "Services",
        links: [
          { name: "Themes", path: "/themes" },
          { name: "Plugins", path: "/plugins" },
          { name: "Blog", path: "/blog" },
        ],
      },
      {
        title: "Connect",
        links: [
          { name: "Contact", path: "/contact" },
          { name: "GitHub", path: "#" },
          { name: "LinkedIn", path: "#" },
        ],
      },
    ],
    copyrightText: "Tafsin Ahmed. All rights reserved.",
  };

  localStorage.setItem('website-footer', JSON.stringify(defaultContent));
  return defaultContent;
};

export const saveFooterContent = async (content: FooterContent): Promise<void> => {
  if (isSupabaseAvailable()) {
    try {
      const { error } = await supabase.from('footer_content').upsert({
        id: 'default',
        brand_name: content.brandName,
        description: content.description,
        social_links: content.socialLinks,
        link_groups: content.linkGroups,
        copyright_text: content.copyrightText,
        updated_at: new Date().toISOString(),
      });
      if (error) throw error;
      return;
    } catch (error) {
      console.error('Error saving footer content to database:', error);
    }
  }
  localStorage.setItem('website-footer', JSON.stringify(content));
};
