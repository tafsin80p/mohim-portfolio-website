import { useEffect, useState } from "react";
import { FolderKanban, BookOpen, Settings, Database, CheckCircle2, XCircle } from "lucide-react";
import { getProjects, getPublishedBlogPosts, getServices } from "@/lib/contentStorage";
import { supabase } from "@/integrations/supabase/client";

export const OverviewStats = () => {
  const [stats, setStats] = useState({
    projects: 0,
    blogPosts: 0,
    services: 0,
  });
  const [dbStatus, setDbStatus] = useState<{ connected: boolean; stats: any; error?: string } | null>(null);

  useEffect(() => {
    const loadStats = async () => {
      const [projects, blogPosts, services] = await Promise.all([
        getProjects(),
        getPublishedBlogPosts(),
        getServices(),
      ]);
      setStats({
        projects: projects.length,
        blogPosts: blogPosts.length,
        services: services.length,
      });

      // Check Supabase connection and stats
      const url = import.meta.env.VITE_SUPABASE_URL;
      const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
      const isAvailable = !!(url && key && url !== 'https://placeholder.supabase.co' && key !== 'placeholder-key');
      
      console.log('Checking Supabase connection...', { 
        url: url ? 'Set' : 'Not set', 
        key: key ? 'Set' : 'Not set',
        isAvailable 
      });
      
      if (isAvailable) {
        try {
          // Test connection by fetching from projects table
          // If table doesn't exist, try a simpler test first
          const { data: testData, error: testError } = await supabase
            .from('projects')
            .select('id')
            .limit(1);
          
          console.log('Supabase connection test result:', { testError, testData });
          
          // Check if error is due to table not existing or connection issue
          if (testError) {
            // If it's a relation/table not found error, connection works but tables don't exist
            if (testError.code === 'PGRST116' || testError.message?.includes('relation') || testError.message?.includes('does not exist')) {
              console.warn('Tables not found - connection works but schema not created');
              setDbStatus({ 
                connected: true, 
                stats: { projects: 0, blogPosts: 0, services: 0, users: 0 },
                error: 'Tables not created. Please run the SQL schema in Supabase.' 
              });
            } else {
              console.error('Supabase connection error:', testError);
              setDbStatus({ connected: false, stats: null, error: testError.message });
            }
          } else {
            // Connection successful, get stats
            try {
              const [projectsRes, blogPostsRes, servicesRes] = await Promise.all([
                supabase.from('projects').select('id', { count: 'exact', head: true }),
                supabase.from('blog_posts').select('id', { count: 'exact', head: true }),
                supabase.from('services').select('id', { count: 'exact', head: true }),
              ]);
              
              setDbStatus({
                connected: true,
                stats: {
                  projects: projectsRes.count || 0,
                  blogPosts: blogPostsRes.count || 0,
                  services: servicesRes.count || 0,
                  users: 0, // Users are managed by Supabase Auth
                },
              });
            } catch (statsError) {
              console.error('Error getting stats:', statsError);
              setDbStatus({ connected: true, stats: null, error: 'Connection OK but failed to get stats' });
            }
          }
        } catch (error) {
          console.error('Supabase connection exception:', error);
          setDbStatus({ 
            connected: false, 
            stats: null, 
            error: error instanceof Error ? error.message : 'Unknown error' 
          });
        }
      } else {
        console.warn('Supabase not available - environment variables not set');
        setDbStatus({ 
          connected: false, 
          stats: null,
          error: 'Environment variables not configured' 
        });
      }
    };
    loadStats();
  }, []);

  return (
    <div className="space-y-6">
      {/* Database Status */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Database className="w-5 h-5 text-primary" />
            <h3 className="font-mono font-semibold">Database Status</h3>
          </div>
          {dbStatus ? (
            dbStatus.connected ? (
              <div className="flex items-center gap-2 text-green-500">
                <CheckCircle2 className="w-5 h-5" />
                <span className="text-sm font-medium">Connected</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-red-500">
                <XCircle className="w-5 h-5" />
                <span className="text-sm font-medium">Not Connected</span>
              </div>
            )
          ) : (
            <span className="text-sm text-muted-foreground">Checking...</span>
          )}
        </div>
        {dbStatus?.connected && dbStatus.stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <div>
              <p className="text-2xl font-bold">{dbStatus.stats.projects}</p>
              <p className="text-xs text-muted-foreground">Projects in DB</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{dbStatus.stats.blogPosts}</p>
              <p className="text-xs text-muted-foreground">Blog Posts in DB</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{dbStatus.stats.services}</p>
              <p className="text-xs text-muted-foreground">Services in DB</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{dbStatus.stats.users}</p>
              <p className="text-xs text-muted-foreground">Users in DB</p>
            </div>
          </div>
        )}
        {!dbStatus?.connected && (
          <div className="text-sm text-muted-foreground mt-2 space-y-2">
            <p className="font-semibold text-destructive">Database not connected</p>
            {dbStatus?.error && (
              <p className="text-destructive text-xs mt-1">Error: {dbStatus.error}</p>
            )}
            <div className="mt-2">
              <p>To enable database storage:</p>
              <ul className="list-disc list-inside space-y-1 ml-2 mt-1">
                <li>Set <code className="bg-muted px-1 rounded">VITE_SUPABASE_URL</code> in your .env file</li>
                <li>Set <code className="bg-muted px-1 rounded">VITE_SUPABASE_ANON_KEY</code> in your .env file</li>
                <li>Run the SQL schema in Supabase SQL Editor</li>
                <li>Restart your development server after adding variables</li>
              </ul>
            </div>
            <div className="mt-3 p-2 bg-muted/50 rounded text-xs">
              <p className="font-semibold mb-1">Current Status:</p>
              <p>URL: {import.meta.env.VITE_SUPABASE_URL ? '✅ Set' : '❌ Not set'}</p>
              <p>Key: {import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Not set'}</p>
            </div>
          </div>
        )}
      </div>

      {/* Content Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-mono font-semibold">Projects</h3>
          <FolderKanban className="w-5 h-5 text-primary" />
        </div>
        <p className="text-3xl font-bold mb-2">{stats.projects}</p>
        <p className="text-sm text-muted-foreground">Total projects</p>
      </div>
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-mono font-semibold">Blog Posts</h3>
          <BookOpen className="w-5 h-5 text-primary" />
        </div>
        <p className="text-3xl font-bold mb-2">{stats.blogPosts}</p>
        <p className="text-sm text-muted-foreground">Published posts</p>
      </div>
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-mono font-semibold">Services</h3>
          <Settings className="w-5 h-5 text-primary" />
        </div>
        <p className="text-3xl font-bold mb-2">{stats.services}</p>
        <p className="text-sm text-muted-foreground">Active services</p>
      </div>
      </div>
    </div>
  );
};





