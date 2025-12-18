import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Download, Code2, Palette, Plug } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAboutContent, getHeroContent, type HeroContent, type AboutContent } from "@/lib/contentStorage";

export const HeroSection = () => {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [heroText, setHeroText] = useState<HeroContent | null>(null);
  const [stats, setStats] = useState<AboutContent["stats"] | null>(null);

  useEffect(() => {
    const loadContent = async () => {
      const [aboutContent, heroContent] = await Promise.all([
        getAboutContent(),
        getHeroContent(),
      ]);
      setProfileImage(aboutContent.imageUrl || null);
      setStats(aboutContent.stats);
      setHeroText(heroContent);
    };
    void loadContent();
  }, []);
  
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden pt-8 md:pt-0">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-float animation-delay-200" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
      </div>
      
      <div className="container-custom relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Profile Image - Mobile First, then Right on Desktop */}
          <div className="order-2 lg:order-2 relative animate-fade-up animation-delay-200">
            <div className="relative mx-auto lg:mx-0 max-w-sm lg:max-w-none">
              <div className="aspect-square rounded-2xl overflow-hidden bg-card border border-border shadow-2xl relative">
                <img
                  src={
                    profileImage ||
                    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=600&fit=crop&crop=face"
                  }
                  alt="Tafsin Ahmed"
                  className="w-full h-full object-cover"
                />
                {/* Text overlay on profile image */}
                <div className="absolute inset-x-3 bottom-3 md:inset-x-4 md:bottom-4 bg-background/70 backdrop-blur-md border border-border/60 rounded-xl px-3 py-2 md:px-4 md:py-3 shadow-lg flex items-center justify-between gap-3">
                  <div>
                    <p className="font-mono text-xs md:text-sm font-semibold text-foreground">
                      {heroText?.name || "Tafsin Ahmed"}
                    </p>
                    <p className="text-[10px] md:text-xs text-muted-foreground">
                      {heroText?.role || "WordPress Developer"}
                    </p>
                  </div>
                  <span className="hidden sm:inline-flex px-2.5 py-1 rounded-full bg-primary/10 border border-primary/30 text-[10px] md:text-xs font-mono text-primary">
                    Available
                  </span>
                </div>
              </div>
              {/* Floating Card */}
              <div className="absolute top-4 left-4 lg:top-6 lg:left-6 bg-card border border-border rounded-xl p-3 lg:p-4 glow-soft animate-float">
                <p className="font-mono text-xs lg:text-sm text-primary">
                  {heroText?.floatingTitle || "WordPress Expert"}
                </p>
                <p className="text-muted-foreground text-[10px] lg:text-xs">
                  {heroText?.floatingSubtitle || "Since 2016"}
                </p>
              </div>
            </div>
          </div>

          {/* Left Column - Content */}
          <div className="order-1 lg:order-1">
            {/* Tag */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6 animate-fade-up">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-sm font-medium text-primary">
                {heroText?.tagline || "Available for freelance work"}
              </span>
            </div>

            {/* Headline */}
            <h1 className="font-mono text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 animate-fade-up animation-delay-100">
              {heroText?.headlineLine1 || "I craft beautiful"}{" "}
              <span className="text-gradient">
                {heroText?.headlineHighlight || "WordPress"}
              </span>
              <br />
              {heroText?.headlineLine2 || "experiences"}
            </h1>

            {/* Subheadline */}
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-8 animate-fade-up animation-delay-200">
              {heroText?.subheadline ||
                "WordPress developer specializing in custom themes, plugins, and full-stack solutions. Turning complex ideas into elegant, performant websites."}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 mb-12 lg:mb-16 animate-fade-up animation-delay-300">
              <Link to="/projects">
                <Button size="lg" className="glow-box group">
                  View My Work
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button size="lg" variant="outline">
                  <Download className="mr-2 w-4 h-4" />
                  Download CV
                </Button>
              </Link>
          </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 lg:gap-8 animate-fade-up animation-delay-400">
              <div className="flex items-center gap-2 lg:gap-3">
                <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Code2 className="w-5 h-5 lg:w-6 lg:h-6 text-primary" />
                </div>
                <div>
                  <p className="font-mono text-xl lg:text-2xl font-bold">
                    {stats?.projects || "50+"}
                  </p>
                  <p className="text-muted-foreground text-xs lg:text-sm">Projects</p>
                </div>
              </div>
              <div className="flex items-center gap-2 lg:gap-3">
                <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Palette className="w-5 h-5 lg:w-6 lg:h-6 text-primary" />
                </div>
                <div>
                  <p className="font-mono text-xl lg:text-2xl font-bold">
                    {stats?.experience || "8+"}
                  </p>
                  <p className="text-muted-foreground text-xs lg:text-sm">Themes</p>
                </div>
              </div>
              <div className="flex items-center gap-2 lg:gap-3">
                <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Plug className="w-5 h-5 lg:w-6 lg:h-6 text-primary" />
                </div>
                <div>
                  <p className="font-mono text-xl lg:text-2xl font-bold">
                    {stats?.clients || "15+"}
                  </p>
                  <p className="text-muted-foreground text-xs lg:text-sm">Plugins</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
