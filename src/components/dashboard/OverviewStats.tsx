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
        isAvailable,
        urlValue: url?.substring(0, 30) + '...',
        keyValue: key ? key.substring(0, 20) + '...' : 'Not set'
      });
      
      if (isAvailable) {
        try {
          // First, test with a simple query that doesn't require tables
          // Try to get the current user (this tests auth, not database)
          const { data: { session } } = await supabase.auth.getSession();
          
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
            } 
            // Check for JWT/authentication errors
            else if (testError.code === 'PGRST301' || testError.code === '42501' || testError.message?.toLowerCase().includes('jwt') || testError.message?.toLowerCase().includes('expired') || testError.message?.toLowerCase().includes('token') || testError.message?.toLowerCase().includes('invalid api key')) {
              console.error('JWT/Authentication error:', testError);
              
              // Provide more specific guidance
              let errorMessage = 'JWT/API Key error detected. ';
              
              if (testError.message?.toLowerCase().includes('invalid api key') || testError.code === 'PGRST301') {
                errorMessage += 'Your VITE_SUPABASE_ANON_KEY appears to be invalid. ';
                errorMessage += 'Please check: 1) You copied the "anon" "public" key (not service_role), 2) The key is correct in your .env file, 3) No extra spaces or quotes around the key.';
              } else {
                errorMessage += 'Please verify your VITE_SUPABASE_ANON_KEY is correct in your .env file. ';
                errorMessage += 'Make sure you\'re using the "anon" "public" key from Supabase Settings > API.';
              }
              
              setDbStatus({ 
                connected: false, 
                stats: null, 
                error: errorMessage
              });
            }
            // Check for invalid API key or URL errors
            else if (testError.code === 'PGRST301' || testError.message?.toLowerCase().includes('invalid') || testError.message?.toLowerCase().includes('api key')) {
              console.error('Invalid configuration error:', testError);
              setDbStatus({ 
                connected: false, 
                stats: null, 
                error: 'Invalid Supabase configuration. Please check your VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env file.' 
              });
            }
            else {
              console.error('Supabase connection error:', testError);
              setDbStatus({ 
                connected: false, 
                stats: null, 
                error: testError.message || 'Unknown database error occurred' 
              });
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
          <div className="text-sm mt-4 space-y-3 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <div className="flex items-start gap-2">
              <XCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold text-destructive mb-1">Database Not Connected</p>
                {dbStatus?.error && (
                  <p className="text-destructive/80 text-xs mb-2">Error: {dbStatus.error}</p>
                )}
              </div>
            </div>
            
            <div className="mt-3 space-y-2">
              <p className="font-medium text-foreground">To enable database storage:</p>
              <ul className="list-disc list-inside space-y-1.5 ml-2 text-muted-foreground">
                <li>Create a <code className="bg-background px-1.5 py-0.5 rounded text-xs font-mono border border-border">.env</code> file in the project root</li>
                <li>Add <code className="bg-background px-1.5 py-0.5 rounded text-xs font-mono border border-border">VITE_SUPABASE_URL</code> with your Supabase project URL</li>
                <li>Add <code className="bg-background px-1.5 py-0.5 rounded text-xs font-mono border border-border">VITE_SUPABASE_ANON_KEY</code> with your Supabase anon key</li>
                <li>Run the SQL migrations in Supabase SQL Editor</li>
                <li>Restart your development server after adding variables</li>
              </ul>
            </div>
            
            <div className="mt-3 p-3 bg-background/50 rounded border border-border">
              <p className="font-semibold mb-2 text-foreground">Configuration Status:</p>
              <div className="space-y-1 text-xs">
                <div className="flex items-center gap-2">
                  <span className={import.meta.env.VITE_SUPABASE_URL ? 'text-green-500' : 'text-red-500'}>
                    {import.meta.env.VITE_SUPABASE_URL ? '✅' : '❌'}
                  </span>
                  <span className="font-mono">VITE_SUPABASE_URL</span>
                  <span className="text-muted-foreground">
                    {import.meta.env.VITE_SUPABASE_URL ? '(Configured)' : '(Not configured)'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={import.meta.env.VITE_SUPABASE_ANON_KEY ? 'text-green-500' : 'text-red-500'}>
                    {import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅' : '❌'}
                  </span>
                  <span className="font-mono">VITE_SUPABASE_ANON_KEY</span>
                  <span className="text-muted-foreground">
                    {import.meta.env.VITE_SUPABASE_ANON_KEY ? '(Configured)' : '(Not configured)'}
                  </span>
                </div>
              </div>
            </div>
            
            {dbStatus?.connected && dbStatus.error && (
              <div className="mt-2 p-2 bg-yellow-500/10 border border-yellow-500/20 rounded text-xs">
                <p className="font-semibold text-yellow-600 dark:text-yellow-400 mb-1">⚠️ Warning</p>
                <p className="text-yellow-600/80 dark:text-yellow-400/80">{dbStatus.error}</p>
              </div>
            )}
          </div>
        )}
        
        {dbStatus?.connected && dbStatus.error && (
          <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
            <p className="font-semibold text-yellow-600 dark:text-yellow-400 mb-1 text-sm">⚠️ Warning</p>
            <p className="text-yellow-600/80 dark:text-yellow-400/80 text-xs">{dbStatus.error}</p>
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





