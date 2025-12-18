import { useEffect, useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Badge } from "@/components/ui/badge";
import { Code2, Award, Users, Coffee } from "lucide-react";
import { getAboutContent, type AboutContent } from "@/lib/contentStorage";

const About = () => {
  const [content, setContent] = useState<AboutContent | null>(null);

  useEffect(() => {
    const loadContent = async () => {
      const data = await getAboutContent();
      setContent(data);
    };
    loadContent();
  }, []);

  if (!content) return null;

  const stats = [
    { icon: Code2, value: content.stats.experience, label: "Years Experience" },
    { icon: Award, value: content.stats.projects, label: "Projects Completed" },
    { icon: Users, value: content.stats.clients, label: "Happy Clients" },
    { icon: Coffee, value: content.stats.coffee, label: "Cups of Coffee" },
  ];

  return (
    <Layout>
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Image */}
            <div className="relative animate-fade-up">
              <div className="aspect-square rounded-2xl overflow-hidden bg-card border border-border">
                <img
                  src={content.imageUrl || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=600&fit=crop&crop=face"}
                  alt="Developer portrait"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Floating Card */}
              <div className="absolute -bottom-6 -right-6 bg-card border border-border rounded-xl p-4 glow-soft animate-float">
                <p className="font-mono text-sm text-primary">WordPress Expert</p>
                <p className="text-muted-foreground text-xs">Since 2016</p>
              </div>
            </div>

            {/* Content */}
            <div>
              <SectionHeader
                tag="// About Me"
                title="Passionate WordPress Developer"
              />
              <div className="space-y-4 text-muted-foreground animate-fade-up animation-delay-200">
                {content.bio.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className="text-center p-6 rounded-xl bg-card border border-border animate-fade-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-6 h-6 text-primary" />
                </div>
                <p className="font-mono text-3xl font-bold text-primary">{stat.value}</p>
                <p className="text-muted-foreground text-sm">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Skills */}
          <div className="mt-20">
            <SectionHeader
              tag="// Skills"
              title="Technologies I Work With"
              centered
            />
            <div className="flex flex-wrap justify-center gap-3 animate-fade-up animation-delay-200">
              {content.skills.map((skill) => (
                <Badge
                  key={skill}
                  variant="outline"
                  className="px-4 py-2 text-sm hover:bg-primary/10 hover:border-primary transition-colors cursor-default"
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
