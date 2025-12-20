import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Download } from "lucide-react";
import { getThemes, type Theme } from "@/lib/contentStorage";

const Themes = () => {
  const [themes, setThemes] = useState<Theme[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadThemes = async () => {
      const data = await getThemes();
      setThemes(data);
      setIsLoading(false);
    };
    loadThemes();
  }, []);

  return (
    <Layout>
      <section className="section-padding">
        <div className="container-custom">
          <SectionHeader
            tag="// WordPress Themes"
            title="Premium Themes"
            description="Beautifully crafted WordPress themes built with performance and user experience in mind."
            centered
          />

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-card rounded-xl border border-border overflow-hidden animate-pulse">
                  <div className="aspect-[16/10] bg-muted" />
                  <div className="p-6 space-y-3">
                    <div className="h-6 bg-muted rounded w-2/3" />
                    <div className="h-4 bg-muted rounded w-full" />
                    <div className="h-4 bg-muted rounded w-3/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : themes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {themes.map((theme, index) => (
                <div
                  key={theme.id}
                  className="group bg-card rounded-xl border border-border overflow-hidden hover-lift animate-fade-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Image */}
                  <div className="aspect-[16/10] overflow-hidden relative">
                    <img
                      src={theme.image || "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800&h=500&fit=crop"}
                      alt={theme.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.src = "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800&h=500&fit=crop";
                      }}
                    />
                    {theme.price && (
                      <div className="absolute top-4 right-4 bg-background/90 backdrop-blur-sm px-3 py-1 rounded-full">
                        <span className="font-mono font-bold text-primary">{theme.price}</span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="font-mono font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                      {theme.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                      {theme.description}
                    </p>

                    {/* Tags */}
                    {theme.tags && theme.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {theme.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      {theme.fileUrl ? (
                        <a
                          href={theme.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground text-sm flex items-center gap-1 hover:text-primary transition-colors"
                        >
                          <Download className="w-4 h-4" />
                          Download
                        </a>
                      ) : (
                        <span className="text-muted-foreground text-sm">Theme Preview</span>
                      )}
                      {theme.liveUrl ? (
                        <a
                          href={theme.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button size="sm" className="group/btn">
                            View Demo
                            <ExternalLink className="ml-2 w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform" />
                          </Button>
                        </a>
                      ) : (
                        <Button size="sm" disabled variant="outline">
                          Preview
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No themes available yet. Check back soon!</p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Themes;
