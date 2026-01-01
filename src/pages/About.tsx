import { useEffect, useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Badge } from "@/components/ui/badge";
import { Code2, Award, Users, Coffee } from "lucide-react";
import { getAboutContent, type AboutContent } from "@/lib/contentStorage";

// Skill icon mapping using Simple Icons CDN
const getSkillIcon = (skillName: string): string | null => {
  const skillIcons: Record<string, string> = {
    "WordPress": "https://cdn.simpleicons.org/wordpress/21759B",
    "PHP": "https://cdn.simpleicons.org/php/777BB4",
    "JavaScript": "https://cdn.simpleicons.org/javascript/F7DF1E",
    "TypeScript": "https://cdn.simpleicons.org/typescript/3178C6",
    "React": "https://cdn.simpleicons.org/react/61DAFB",
    "WooCommerce": "https://cdn.simpleicons.org/woocommerce/96588A",
    "Gutenberg": "https://cdn.simpleicons.org/wordpress/21759B",
    "REST API": "https://cdn.simpleicons.org/restapi/FF5733",
    "MySQL": "https://cdn.simpleicons.org/mysql/4479A1",
    "Git": "https://cdn.simpleicons.org/git/F05032",
    "SCSS": "https://cdn.simpleicons.org/sass/CC6699",
    "Tailwind CSS": "https://cdn.simpleicons.org/tailwindcss/06B6D4",
    "ACF": "https://cdn.simpleicons.org/wordpress/21759B",
    "Elementor": "https://cdn.simpleicons.org/elementor/92003B",
    "Custom Plugins": "https://cdn.simpleicons.org/wordpress/21759B",
    "Theme Development": "https://cdn.simpleicons.org/wordpress/21759B",
    "Node.js": "https://cdn.simpleicons.org/nodedotjs/339933",
    "HTML": "https://cdn.simpleicons.org/html5/E34F26",
    "CSS": "https://cdn.simpleicons.org/css3/1572B6",
    "Next.js": "https://cdn.simpleicons.org/nextdotjs/000000",
    "Vue.js": "https://cdn.simpleicons.org/vuedotjs/4FC08D",
    "Angular": "https://cdn.simpleicons.org/angular/DD0031",
    "Python": "https://cdn.simpleicons.org/python/3776AB",
    "Docker": "https://cdn.simpleicons.org/docker/2496ED",
    "AWS": "https://cdn.simpleicons.org/amazonaws/232F3E",
  };

  // Try exact match first
  if (skillIcons[skillName]) {
    return skillIcons[skillName];
  }

  // Try case-insensitive match
  const lowerSkill = skillName.toLowerCase();
  for (const [key, value] of Object.entries(skillIcons)) {
    if (key.toLowerCase() === lowerSkill) {
      return value;
    }
  }

  return null;
};

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
          <div className={`grid ${content.imageUrl ? 'lg:grid-cols-2' : ''} gap-12 items-center`}>
            {/* Image */}
            {content.imageUrl && (
            <div className="relative animate-fade-up">
              <div className="aspect-square rounded-2xl overflow-hidden bg-card border border-border">
                <img
                  src={content.imageUrl}
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
            )}

            {/* Content */}
            <div className={content.imageUrl ? '' : 'max-w-3xl mx-auto'}>
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
            <div className="relative overflow-hidden py-4 animate-fade-up animation-delay-200">
              <div className="skills-carousel flex gap-3">
                {/* Duplicate skills array for seamless loop */}
                {[...content.skills, ...content.skills].map((skill, index) => {
                  const skillIcon = getSkillIcon(skill);
                  return (
                    <Badge
                      key={`${skill}-${index}`}
                      variant="outline"
                      className="px-5 py-3 text-base font-medium border-border text-foreground hover:bg-primary/10 hover:border-primary hover:text-primary transition-all duration-200 cursor-default flex items-center gap-3 group whitespace-nowrap shrink-0"
                    >
                      {skillIcon && (
                        <img
                          src={skillIcon}
                          alt={`${skill} icon`}
                          className="w-5 h-5 object-contain group-hover:scale-110 transition-transform duration-200"
                          onError={(e) => {
                            // Hide image if it fails to load
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      )}
                      <span>{skill}</span>
                    </Badge>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
