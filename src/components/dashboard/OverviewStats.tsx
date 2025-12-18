import { useEffect, useState } from "react";
import { FolderKanban, BookOpen, Settings } from "lucide-react";
import { getProjects, getPublishedBlogPosts, getServices } from "@/lib/contentStorage";

export const OverviewStats = () => {
  const [stats, setStats] = useState({
    projects: 0,
    blogPosts: 0,
    services: 0,
  });

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
    };
    loadStats();
  }, []);

  return (
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
  );
};





