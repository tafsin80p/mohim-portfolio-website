import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { format } from "date-fns";
import { getBlogPostBySlug, type BlogPost } from "@/lib/contentStorage";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      const loadPost = async () => {
        const loadedPost = await getBlogPostBySlug(slug);
        setPost(loadedPost);
        setIsLoading(false);
      };
      loadPost();
    }
  }, [slug]);

  if (isLoading) {
    return (
      <Layout>
        <section className="section-padding">
          <div className="container-custom max-w-4xl">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-muted rounded w-1/4" />
              <div className="h-12 bg-muted rounded w-3/4" />
              <div className="h-64 bg-muted rounded" />
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  if (!post && !isLoading) {
    return (
      <Layout>
        <section className="section-padding">
          <div className="container-custom max-w-4xl text-center">
            <h1 className="font-mono text-3xl font-bold mb-4">Post Not Found</h1>
            <p className="text-muted-foreground mb-8">
              The blog post you're looking for doesn't exist.
            </p>
            <Link to="/blog">
              <Button>
                <ArrowLeft className="mr-2 w-4 h-4" />
                Back to Blog
              </Button>
            </Link>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <article className="section-padding">
        <div className="container-custom max-w-4xl">
          {/* Back Link */}
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>

          {/* Header */}
          <header className="mb-8 animate-fade-up">
            <Badge variant="secondary" className="mb-4">
              {post.category}
            </Badge>
            <h1 className="font-mono text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              {post.title}
            </h1>
            <div className="flex items-center gap-4 text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {format(new Date(post.created_at), "MMM d, yyyy")}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {post.read_time}
              </span>
            </div>
          </header>

          {/* Featured Image */}
          {post.image_url && (
            <div className="aspect-video rounded-xl overflow-hidden mb-8 animate-fade-up animation-delay-100">
              <img
                src={post.image_url}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Content */}
          <div className="prose prose-invert prose-lg max-w-none mb-16 animate-fade-up animation-delay-200">
            <p className="text-lg text-muted-foreground mb-4">{post.excerpt}</p>
            <p className="text-foreground whitespace-pre-line">{post.content}</p>
          </div>
        </div>
      </article>
    </Layout>
  );
};

export default BlogPost;
