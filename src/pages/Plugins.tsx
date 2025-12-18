import { Layout } from "@/components/layout/Layout";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Download, Star, Check } from "lucide-react";

const plugins = [
  {
    title: "WP Speed Booster",
    description: "Optimize your WordPress site with advanced caching, image optimization, and lazy loading features.",
    icon: "🚀",
    price: "$29",
    rating: 4.9,
    installs: "10k+",
    features: ["Page Caching", "Image Optimization", "Database Cleanup", "CDN Support"],
  },
  {
    title: "Smart SEO Pro",
    description: "Complete SEO solution with schema markup, XML sitemaps, and advanced meta tag management.",
    icon: "📈",
    price: "$39",
    rating: 4.8,
    installs: "8k+",
    features: ["Schema Markup", "XML Sitemaps", "Meta Tags", "Analytics"],
  },
  {
    title: "Form Builder Plus",
    description: "Drag-and-drop form builder with conditional logic, payment integration, and email notifications.",
    icon: "📝",
    price: "Free",
    rating: 4.7,
    installs: "15k+",
    features: ["Drag & Drop", "Conditional Logic", "Payments", "Email Notifications"],
  },
  {
    title: "Social Sharing Suite",
    description: "Beautiful social sharing buttons with floating bars, click-to-tweet, and share count display.",
    icon: "🔗",
    price: "$19",
    rating: 4.6,
    installs: "5k+",
    features: ["Share Buttons", "Floating Bar", "Click to Tweet", "Analytics"],
  },
  {
    title: "Security Shield",
    description: "Comprehensive security plugin with firewall, malware scanning, and login protection.",
    icon: "🛡️",
    price: "$49",
    rating: 5.0,
    installs: "6k+",
    features: ["Firewall", "Malware Scan", "2FA Login", "Activity Log"],
  },
  {
    title: "Backup Master",
    description: "Automated backup solution with cloud storage support and one-click restore functionality.",
    icon: "💾",
    price: "$35",
    rating: 4.8,
    installs: "4k+",
    features: ["Auto Backup", "Cloud Storage", "One-Click Restore", "Scheduling"],
  },
];

const Plugins = () => {
  return (
    <Layout>
      <section className="section-padding">
        <div className="container-custom">
          <SectionHeader
            tag="// WordPress Plugins"
            title="Custom Plugins"
            description="Powerful WordPress plugins to extend your site's functionality and improve user experience."
            centered
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {plugins.map((plugin, index) => (
              <div
                key={plugin.title}
                className="group bg-card rounded-xl border border-border p-6 hover-lift animate-fade-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-2xl">
                    {plugin.icon}
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-primary">{plugin.price}</span>
                    <div className="flex items-center gap-1 text-yellow-500 mt-1">
                      <Star className="w-3 h-3 fill-current" />
                      <span className="text-xs font-medium">{plugin.rating}</span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <h3 className="font-mono font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                  {plugin.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  {plugin.description}
                </p>

                {/* Features */}
                <ul className="space-y-2 mb-6">
                  {plugin.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="w-4 h-4 text-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <span className="text-muted-foreground text-sm flex items-center gap-1">
                    <Download className="w-4 h-4" />
                    {plugin.installs}
                  </span>
                  <Button size="sm" className="group/btn">
                    Get Plugin
                    <ExternalLink className="ml-2 w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Plugins;
