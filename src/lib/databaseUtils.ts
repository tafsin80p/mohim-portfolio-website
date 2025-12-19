// Utility functions to verify Supabase database connection and data
import { supabase } from "@/integrations/supabase/client";

const isSupabaseAvailable = () => {
    const url = import.meta.env.VITE_SUPABASE_URL;
    const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
    return !!(url && key && url !== 'https://placeholder.supabase.co' && key !== 'placeholder-key');
};

export const testDatabaseConnection = async () => {
    if (!isSupabaseAvailable()) {
        return { success: false, error: 'Supabase URL or key not configured' };
    }

    try {
        // Test connection by fetching from a table
        const { error } = await supabase.from('projects').select('id').limit(1);
        if (error) throw error;
        return { success: true, message: 'Supabase connection successful' };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Database connection failed';
        return { success: false, error: errorMessage };
    }
};

export const getDatabaseStats = async () => {
    if (!isSupabaseAvailable()) {
        return null;
    }

    try {
        const [projectsRes, blogPostsRes, servicesRes, themesRes, pluginsRes, usersRes] = await Promise.all([
            supabase.from('projects').select('id', { count: 'exact', head: true }),
            supabase.from('blog_posts').select('id', { count: 'exact', head: true }),
            supabase.from('services').select('id', { count: 'exact', head: true }),
            supabase.from('themes').select('id', { count: 'exact', head: true }),
            supabase.from('plugins').select('id', { count: 'exact', head: true }),
            supabase.auth.admin.listUsers().catch(() => ({ data: { users: [] } })),
        ]);

        // Note: Getting user count requires admin access, so we'll skip it if it fails
        const usersCount = usersRes && 'users' in usersRes.data ? usersRes.data.users.length : 0;

        return {
            projects: projectsRes.count || 0,
            blogPosts: blogPostsRes.count || 0,
            services: servicesRes.count || 0,
            themes: themesRes.count || 0,
            plugins: pluginsRes.count || 0,
            users: usersCount,
            sessions: 0, // Sessions are managed by Supabase Auth, not easily accessible
        };
    } catch (error) {
        console.error('Error getting database stats:', error);
        return null;
    }
};
