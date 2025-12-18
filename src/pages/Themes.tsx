import { Layout } from "@/components/layout/Layout";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Download, Star } from "lucide-react";

const themes = [
  {
    title: "StorePro",
    description: "Premium WooCommerce theme with advanced product filtering, quick view, and seamless checkout experience.",
    image: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800&h=500&fit=crop",
    price: "$59",
    rating: 4.9,
    downloads: "2.5k+",
    tags: ["WooCommerce", "E-Commerce", "Responsive"],
  },
  {
    title: "NewsFlow",
    description: "Modern news and magazine theme with AMP support, breaking news ticker, and social sharing features.",
    image: "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800&h=500&fit=crop",
    price: "$49",
    rating: 4.8,
    downloads: "1.8k+",
    tags: ["Magazine", "AMP", "SEO"],
  },
  {
    title: "CreativePortfolio",
    description: "Minimal portfolio theme for designers and creatives with stunning animations and gallery features.",
    image: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800&h=500&fit=crop",
    price: "$39",
    rating: 5.0,
    downloads: "3.2k+",
    tags: ["Portfolio", "Creative", "Minimal"],
  },
  {
    title: "BusinessPro",
    description: "Corporate business theme with service showcases, team sections, and lead generation features.",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=500&fit=crop",
    price: "$49",
    rating: 4.7,
    downloads: "1.5k+",
    tags: ["Business", "Corporate", "Professional"],
  },
  {
    title: "BlogMaster",
    description: "Clean and fast blogging theme with multiple layouts, reading time estimates, and newsletter integration.",
    image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&h=500&fit=crop",
    price: "Free",
    rating: 4.6,
    downloads: "5k+",
    tags: ["Blog", "Minimal", "Fast"],
  },
  {
    title: "RealtyHub",
    description: "Real estate theme with property listings, agent profiles, mortgage calculator, and map integration.",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=500&fit=crop",
    price: "$69",
    rating: 4.9,
    downloads: "900+",
    tags: ["Real Estate", "Directory", "Maps"],
  },
];

const Themes = () => {
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {themes.map((theme, index) => (
              <div
                key={theme.title}
                className="group bg-card rounded-xl border border-border overflow-hidden hover-lift animate-fade-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Image */}
                <div className="aspect-[16/10] overflow-hidden relative">
                  <img
                    src={theme.image}
                    alt={theme.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-4 right-4 bg-background/90 backdrop-blur-sm px-3 py-1 rounded-full">
                    <span className="font-mono font-bold text-primary">{theme.price}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-mono font-semibold text-lg group-hover:text-primary transition-colors">
                      {theme.title}
                    </h3>
                    <div className="flex items-center gap-1 text-yellow-500">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-sm font-medium">{theme.rating}</span>
                    </div>
                  </div>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {theme.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {theme.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <span className="text-muted-foreground text-sm flex items-center gap-1">
                      <Download className="w-4 h-4" />
                      {theme.downloads}
                    </span>
                    <Button size="sm" className="group/btn">
                      Preview
                      <ExternalLink className="ml-2 w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Themes;
