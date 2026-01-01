import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getPublishedBlogPosts, type BlogPost } from "@/lib/contentStorage";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { format } from "date-fns";

export const BlogSection = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPosts = async () => {
      const publishedPosts = await getPublishedBlogPosts();
      // Get latest 3 posts
      const latestPosts = publishedPosts
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 3);
      setPosts(latestPosts);
      setIsLoading(false);
    };
    loadPosts();
  }, []);

  return (
    <section className="section-padding">
      <div className="container-custom">
        <SectionHeader
          tag="// Blog"
          title="Latest Articles"
          description="Tips, tutorials, and insights on WordPress development and best practices."
          centered
        />

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-card rounded-xl border border-border overflow-hidden animate-pulse">
                <div className="aspect-video bg-muted" />
                <div className="p-6 space-y-3">
                  <div className="h-4 bg-muted rounded w-1/4" />
                  <div className="h-6 bg-muted rounded w-3/4" />
                  <div className="h-4 bg-muted rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : posts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              {posts.map((post, index) => (
                <article
                  key={post.id}
                  className="group bg-card rounded-xl border border-border overflow-hidden hover-lift animate-fade-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Image */}
                  <Link to={`/blog/${post.slug}`} className="block aspect-video overflow-hidden">
                    <img
                      src={post.image_url || "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=450&fit=crop"}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </Link>

                  {/* Content */}
                  <div className="p-6">
                    <Badge variant="secondary" className="mb-3">
                      {post.category}
                    </Badge>
                    <Link to={`/blog/${post.slug}`}>
                      <h3 className="font-mono font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                        {post.title}
                      </h3>
                    </Link>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                      {post.excerpt}
                    </p>

                    {/* Meta */}
                    <div className="flex items-center gap-4 text-muted-foreground text-sm">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {format(new Date(post.created_at), "MMM d, yyyy")}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {post.read_time}
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div className="text-center">
              <Link to="/blog">
                <Button variant="outline" size="lg" className="gap-2">
                  View All Articles
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </>
        ) : null}
      </div>
    </section>
  );
};






