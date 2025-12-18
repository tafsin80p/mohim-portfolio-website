// Content storage utility for managing all website content with Supabase
// NOTE: Custom tables (projects, services, themes, plugins, about_content, contact_info)
// need to be created in Supabase by running the migration SQL first.
// See: supabase/migrations/20250101000000_create_content_tables.sql

/* eslint-disable @typescript-eslint/no-explicit-any */
// Using 'any' types for custom Supabase tables until migration is run and types are regenerated

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
  // Optional URL to a downloadable theme file (e.g. .zip), managed only from the dashboard.
  // This is intentionally NOT exposed on the public frontend.
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
  // Optional URL to a downloadable plugin file (e.g. .zip), managed only from the dashboard.
  // This is intentionally NOT exposed on the public frontend.
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
}

export interface ContactInfo {
  email: string;
  phone: string;
  location: string;
  responseTime: string;
  // Optional SMTP settings for contact form (used only in dashboard / backend config, never shown publicly)
  smtpHost?: string;
  smtpPort?: string;
  smtpUser?: string;
  smtpPassword?: string;
  smtpFromEmail?: string;
}

// Helper to check if Supabase is available
const isSupabaseAvailable = () => {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  return !!(url && key && url !== 'https://placeholder.supabase.co' && key !== 'placeholder-key');
};

// Helper to migrate from localStorage to Supabase
const migrateFromLocalStorage = async () => {
  if (!isSupabaseAvailable()) return;

  try {
    // Migrate projects
    const localProjects = localStorage.getItem('website-projects');
    if (localProjects) {
      const projects = JSON.parse(localProjects);
      for (const project of projects) {
        await (supabase as any).from('projects').upsert({
          id: project.id,
          title: project.title,
          description: project.description,
          image: project.image,
          tags: project.tags,
          live_url: project.liveUrl,
          github_url: project.githubUrl,
          created_at: project.createdAt,
          updated_at: project.updatedAt,
        });
      }
    }

    // Migrate services
    const localServices = localStorage.getItem('website-services');
    if (localServices) {
      const services = JSON.parse(localServices);
      for (const service of services) {
        await (supabase as any).from('services').upsert({
          id: service.id,
          icon: service.icon,
          title: service.title,
          description: service.description,
          order: service.order,
        });
      }
    }

    // Migrate about content
    const localAbout = localStorage.getItem('website-about');
    if (localAbout) {
      const about = JSON.parse(localAbout);
      await (supabase as any).from('about_content').upsert({
        id: 'default',
        bio: about.bio,
        skills: about.skills,
        stats: about.stats,
        image_url: about.imageUrl,
      });
    }

    // Migrate contact info
    const localContact = localStorage.getItem('website-contact');
    if (localContact) {
      const contact = JSON.parse(localContact);
      await (supabase as any).from('contact_info').upsert({
        id: 'default',
        email: contact.email,
        phone: contact.phone,
        location: contact.location,
        response_time: contact.responseTime,
      });
    }

    console.log('Migration from localStorage to Supabase completed');
  } catch (error) {
    console.error('Migration error:', error);
  }
};

// Run migration once
let migrationRun = false;
if (isSupabaseAvailable() && !migrationRun) {
  migrationRun = true;
  migrateFromLocalStorage();
}

// Projects
export const getProjects = async (): Promise<Project[]> => {
  if (isSupabaseAvailable()) {
    try {
      const { data, error } = await (supabase as any)
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (data || []).map((p: Record<string, any>) => ({
        id: p.id,
        title: p.title,
        description: p.description,
        image: p.image,
        tags: p.tags || [],
        liveUrl: p.live_url,
        githubUrl: p.github_url,
        createdAt: p.created_at,
        updatedAt: p.updated_at,
      }));
    } catch (error) {
      console.error('Error fetching projects:', error);
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
      for (const project of projects) {
        const { error } = await (supabase as any).from('projects').upsert({
          id: project.id,
          title: project.title,
          description: project.description,
          image: project.image,
          tags: project.tags,
          live_url: project.liveUrl,
          github_url: project.githubUrl,
          created_at: project.createdAt,
          updated_at: project.updatedAt,
        });
        if (error) throw error;
      }
      return;
    } catch (error) {
      console.error('Error saving projects:', error);
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
      const { error } = await (supabase as any).from('projects').insert({
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
      console.error('Error adding project:', error);
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
      const updateData: Record<string, any> = {
        updated_at: new Date().toISOString(),
      };
      if (updates.title) updateData.title = updates.title;
      if (updates.description) updateData.description = updates.description;
      if (updates.image) updateData.image = updates.image;
      if (updates.tags) updateData.tags = updates.tags;
      if (updates.liveUrl !== undefined) updateData.live_url = updates.liveUrl;
      if (updates.githubUrl !== undefined) updateData.github_url = updates.githubUrl;

      const { data, error } = await (supabase as any)
        .from('projects')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      if (!data) return null;

      const projectData: Record<string, any> = data;
      return {
        id: projectData.id,
        title: projectData.title,
        description: projectData.description,
        image: projectData.image,
        tags: projectData.tags || [],
        liveUrl: projectData.live_url,
        githubUrl: projectData.github_url,
        createdAt: projectData.created_at,
        updatedAt: projectData.updated_at,
      };
    } catch (error) {
      console.error('Error updating project:', error);
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
      const { error } = await (supabase as any).from('projects').delete().eq('id', id);
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting project:', error);
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

      return (data || []).map((p: Record<string, any>) => ({
        id: p.id,
        title: p.title,
        slug: p.slug,
        excerpt: p.excerpt,
        content: p.content,
        image_url: p.image_url,
        category: p.category,
        read_time: p.read_time || '5 min read',
        published: p.published || false,
        created_at: p.created_at,
        updated_at: p.updated_at,
      }));
    } catch (error) {
      console.error('Error fetching blog posts:', error);
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
  const posts = await getBlogPosts();
  return posts.filter(post => post.published);
};

export const getBlogPostBySlug = async (slug: string): Promise<BlogPost | null> => {
  const posts = await getBlogPosts();
  return posts.find(post => post.slug === slug && post.published) || null;
};

export const saveBlogPosts = async (posts: BlogPost[]): Promise<void> => {
  if (isSupabaseAvailable()) {
    try {
      for (const post of posts) {
        const { error } = await supabase.from('blog_posts').upsert({
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
        });
        if (error) throw error;
      }
      return;
    } catch (error) {
      console.error('Error saving blog posts:', error);
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
      console.error('Error adding blog post:', error);
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
      const updateData: any = {
        updated_at: new Date().toISOString(),
      };
      if (updates.title) updateData.title = updates.title;
      if (updates.slug) updateData.slug = updates.slug;
      if (updates.excerpt) updateData.excerpt = updates.excerpt;
      if (updates.content) updateData.content = updates.content;
      if (updates.image_url !== undefined) updateData.image_url = updates.image_url;
      if (updates.category) updateData.category = updates.category;
      if (updates.read_time) updateData.read_time = updates.read_time;
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
      console.error('Error updating blog post:', error);
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
      console.error('Error deleting blog post:', error);
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
      const { data, error } = await (supabase as any)
        .from('services')
        .select('*')
        .order('order', { ascending: true });

      if (error) throw error;

      return (data || []).map((s: Record<string, any>) => ({
        id: s.id,
        icon: s.icon,
        title: s.title,
        description: s.description,
        order: s.order || 0,
      }));
    } catch (error) {
      console.error('Error fetching services:', error);
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
  if (isSupabaseAvailable()) {
    try {
      for (const service of services) {
        const { error } = await (supabase as any).from('services').upsert({
          id: service.id,
          icon: service.icon,
          title: service.title,
          description: service.description,
          order: service.order,
        });
        if (error) throw error;
      }
      return;
    } catch (error) {
      console.error('Error saving services:', error);
    }
  }
  localStorage.setItem('website-services', JSON.stringify(services));
};

// Themes
export const getThemes = async (): Promise<Theme[]> => {
  if (isSupabaseAvailable()) {
    try {
      const { data, error } = await (supabase as any)
        .from('themes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (data || []).map((t: Record<string, any>) => ({
        id: t.id,
        title: t.title,
        description: t.description,
        image: t.image,
        tags: t.tags || [],
        liveUrl: t.live_url,
        githubUrl: t.github_url,
        price: t.price,
      }));
    } catch (error) {
      console.error('Error fetching themes:', error);
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
      for (const theme of themes) {
        const { error } = await (supabase as any).from('themes').upsert({
          id: theme.id,
          title: theme.title,
          description: theme.description,
          image: theme.image,
          tags: theme.tags,
          live_url: theme.liveUrl,
          github_url: theme.githubUrl,
          price: theme.price,
        });
        if (error) throw error;
      }
      return;
    } catch (error) {
      console.error('Error saving themes:', error);
    }
  }
  localStorage.setItem('website-themes', JSON.stringify(themes));
};

// Plugins
export const getPlugins = async (): Promise<Plugin[]> => {
  if (isSupabaseAvailable()) {
    try {
      const { data, error } = await (supabase as any)
        .from('plugins')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (data || []).map((p: Record<string, any>) => ({
        id: p.id,
        title: p.title,
        description: p.description,
        image: p.image,
        tags: p.tags || [],
        liveUrl: p.live_url,
        githubUrl: p.github_url,
        price: p.price,
      }));
    } catch (error) {
      console.error('Error fetching plugins:', error);
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
      for (const plugin of plugins) {
        const { error } = await (supabase as any).from('plugins').upsert({
          id: plugin.id,
          title: plugin.title,
          description: plugin.description,
          image: plugin.image,
          tags: plugin.tags,
          live_url: plugin.liveUrl,
          github_url: plugin.githubUrl,
          price: plugin.price,
        });
        if (error) throw error;
      }
      return;
    } catch (error) {
      console.error('Error saving plugins:', error);
    }
  }
  localStorage.setItem('website-plugins', JSON.stringify(plugins));
};

// About Content
// NOTE: For reliability, about content (including profile image) currently uses localStorage only.
// This ensures the dashboard and frontend always stay in sync even if Supabase isn't fully configured.
export const getAboutContent = async (): Promise<AboutContent> => {
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
  localStorage.setItem('website-about', JSON.stringify(content));
};

// Hero Content (localStorage only)
export const getHeroContent = async (): Promise<HeroContent> => {
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
  };

  localStorage.setItem("website-hero", JSON.stringify(defaultContent));
  return defaultContent;
};

export const saveHeroContent = async (content: HeroContent): Promise<void> => {
  localStorage.setItem("website-hero", JSON.stringify(content));
};

// Contact Info
export const getContactInfo = async (): Promise<ContactInfo> => {
  if (isSupabaseAvailable()) {
    try {
      const { data, error } = await (supabase as any)
        .from('contact_info')
        .select('*')
        .eq('id', 'default')
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        const contactData: Record<string, any> = data;
        return {
          email: contactData.email,
          phone: contactData.phone,
          location: contactData.location,
          responseTime: contactData.response_time,
          smtpHost: contactData.smtp_host,
          smtpPort: contactData.smtp_port,
          smtpUser: contactData.smtp_user,
          smtpPassword: contactData.smtp_password,
          smtpFromEmail: contactData.smtp_from_email,
        };
      }
    } catch (error) {
      console.error('Error fetching contact info:', error);
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
      const { error } = await (supabase as any).from('contact_info').upsert({
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
      console.error('Error saving contact info:', error);
    }
  }
  localStorage.setItem('website-contact', JSON.stringify(info));
};
