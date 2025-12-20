import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Code2, Github, Linkedin, Twitter, Mail, Facebook, Instagram, Youtube, Dribbble } from "lucide-react";
import { getFooterContent, type FooterContent } from "@/lib/contentStorage";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Github,
  Linkedin,
  Twitter,
  Mail,
  Facebook,
  Instagram,
  Youtube,
  Dribbble,
};

export const Footer = () => {
  const [content, setContent] = useState<FooterContent | null>(null);

  useEffect(() => {
    const loadContent = async () => {
      try {
        const data = await getFooterContent();
        setContent(data);
      } catch (err) {
        console.error('Error loading footer content:', err);
        // Use default content on error
        setContent({
          brandName: "Tafsin Ahmed",
          description: "WordPress developer crafting exceptional themes, plugins, and custom solutions for businesses worldwide.",
          socialLinks: [
            { icon: "Github", href: "#", label: "GitHub" },
            { icon: "Linkedin", href: "#", label: "LinkedIn" },
            { icon: "Twitter", href: "#", label: "Twitter" },
            { icon: "Mail", href: "mailto:hello@example.com", label: "Email" },
          ],
          linkGroups: [
            {
              title: "Pages",
              links: [
                { name: "Home", path: "/" },
                { name: "About", path: "/about" },
                { name: "Projects", path: "/projects" },
              ],
            },
            {
              title: "Services",
              links: [
                { name: "Themes", path: "/themes" },
                { name: "Plugins", path: "/plugins" },
                { name: "Blog", path: "/blog" },
              ],
            },
            {
              title: "Connect",
              links: [
                { name: "Contact", path: "/contact" },
              ],
            },
          ],
          copyrightText: "Tafsin Ahmed. All rights reserved.",
        });
      }
    };
    void loadContent();
  }, []);

  // Show loading state only briefly, then show default if content not loaded
  if (!content) {
    return (
      <footer className="bg-card border-t border-border">
        <div className="container-custom section-padding pl-6 pr-4 md:px-6 lg:px-8">
          <div className="text-center py-8">
            <p className="text-muted-foreground text-sm">Loading...</p>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="bg-card border-t border-border">
      <div className="container-custom section-padding pl-6 pr-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Code2 className="w-5 h-5 text-primary" />
              </div>
              <span className="font-mono font-bold text-lg">{content.brandName}</span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-xs mb-6">
              {content.description}
            </p>
            <div className="flex gap-3">
              {content.socialLinks && content.socialLinks.length > 0 ? content.socialLinks.map((social, index) => {
                const IconComponent = iconMap[social.icon] || Mail;
                return (
                  <a
                    key={index}
                    href={social.href || "#"}
                    aria-label={social.label || social.icon}
                    className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-200"
                  >
                    <IconComponent className="w-5 h-5" />
                  </a>
                );
              }) : null}
            </div>
          </div>

          {/* Links */}
          {content.linkGroups && content.linkGroups.length > 0 ? content.linkGroups.map((group, groupIndex) => (
            <div key={groupIndex}>
              <h4 className="font-mono font-semibold text-sm mb-4">{group.title || ""}</h4>
              <ul className="space-y-3">
                {group.links && group.links.length > 0 ? group.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    {link.path.startsWith('http') || link.path.startsWith('mailto') || link.path.startsWith('#') ? (
                      <a
                        href={link.path}
                        className="text-muted-foreground text-sm hover:text-primary transition-colors"
                      >
                        {link.name}
                      </a>
                    ) : (
                      <Link
                        to={link.path}
                        className="text-muted-foreground text-sm hover:text-primary transition-colors"
                      >
                        {link.name}
                      </Link>
                    )}
                  </li>
                )) : null}
              </ul>
            </div>
          )) : null}
        </div>

        <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} {content.copyrightText}
          </p>
        </div>
      </div>
    </footer>
  );
};
