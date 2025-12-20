import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getThemes, type Theme } from "@/lib/contentStorage";
import { ExternalLink, Download, Star, ArrowRight } from "lucide-react";

export const ThemesSection = () => {
  const [themes, setThemes] = useState<Theme[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadThemes = async () => {
      const allThemes = await getThemes();
      // Get latest 3 themes
      const latestThemes = allThemes.slice(0, 3);
      setThemes(latestThemes);
      setIsLoading(false);
    };
    loadThemes();
  }, []);

  return (
    <section className="section-padding bg-muted/30">
      <div className="container-custom">
        <SectionHeader
          tag="// WordPress Themes"
          title="Premium Themes"
          description="Beautifully crafted WordPress themes built with performance and user experience in mind."
          centered
        />

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-card rounded-xl border border-border overflow-hidden animate-pulse">
                <div className="aspect-video bg-muted" />
                <div className="p-6 space-y-3">
                  <div className="h-6 bg-muted rounded w-2/3" />
                  <div className="h-4 bg-muted rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : themes.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              {themes.map((theme, index) => (
                <div
                  key={theme.id}
                  className="group bg-card rounded-xl border border-border overflow-hidden hover-lift animate-fade-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Image */}
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={theme.image || "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800&h=500&fit=crop"}
                      alt={theme.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-mono font-semibold text-lg group-hover:text-primary transition-colors">
                        {theme.title}
                      </h3>
                      {theme.price && (
                        <span className="font-mono font-bold text-primary ml-2">{theme.price}</span>
                      )}
                    </div>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                      {theme.description}
                    </p>

                    {/* Tags */}
                    {theme.tags && theme.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {theme.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3">
                      {theme.fileUrl && (
                        <a
                          href={theme.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                          <Download className="w-4 h-4" />
                          Download
                        </a>
                      )}
                      {theme.liveUrl && (
                        <a
                          href={theme.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Demo
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center">
              <Link to="/themes">
                <Button variant="outline" size="lg" className="gap-2">
                  View All Themes
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

