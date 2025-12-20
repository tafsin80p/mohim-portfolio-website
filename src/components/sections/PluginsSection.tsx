import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getPlugins, type Plugin } from "@/lib/contentStorage";
import { ExternalLink, Download, Star, ArrowRight } from "lucide-react";

export const PluginsSection = () => {
  const [plugins, setPlugins] = useState<Plugin[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPlugins = async () => {
      const allPlugins = await getPlugins();
      // Get latest 3 plugins
      const latestPlugins = allPlugins.slice(0, 3);
      setPlugins(latestPlugins);
      setIsLoading(false);
    };
    loadPlugins();
  }, []);

  return (
    <section className="section-padding">
      <div className="container-custom">
        <SectionHeader
          tag="// WordPress Plugins"
          title="Custom Plugins"
          description="Powerful WordPress plugins to extend your site's functionality and improve user experience."
          centered
        />

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-card rounded-xl border border-border p-6 animate-pulse">
                <div className="space-y-3">
                  <div className="h-6 bg-muted rounded w-2/3" />
                  <div className="h-4 bg-muted rounded w-full" />
                  <div className="h-4 bg-muted rounded w-3/4" />
                </div>
              </div>
            ))}
          </div>
        ) : plugins.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              {plugins.map((plugin, index) => (
                <div
                  key={plugin.id}
                  className="group bg-card rounded-xl border border-border overflow-hidden hover-lift animate-fade-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Image */}
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={plugin.image || "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800&h=500&fit=crop"}
                      alt={plugin.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.src = "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800&h=500&fit=crop";
                      }}
                    />
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-mono font-semibold text-lg group-hover:text-primary transition-colors">
                        {plugin.title}
                      </h3>
                      {plugin.price && (
                        <span className="font-mono font-bold text-primary ml-2 text-sm">{plugin.price}</span>
                      )}
                    </div>

                    {/* Description */}
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                      {plugin.description}
                    </p>

                    {/* Tags */}
                    {plugin.tags && plugin.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {plugin.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3">
                      {plugin.fileUrl && (
                        <a
                          href={plugin.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                          <Download className="w-4 h-4" />
                          Download
                        </a>
                      )}
                      {plugin.liveUrl && (
                        <a
                          href={plugin.liveUrl}
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
              <Link to="/plugins">
                <Button variant="outline" size="lg" className="gap-2">
                  View All Plugins
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

