import { Layout } from "@/components/layout/Layout";
import { HeroSection } from "@/components/sections/HeroSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { FeaturedProjects } from "@/components/sections/FeaturedProjects";
import { BlogSection } from "@/components/sections/BlogSection";
import { ThemesSection } from "@/components/sections/ThemesSection";
import { PluginsSection } from "@/components/sections/PluginsSection";
import { CTASection } from "@/components/sections/CTASection";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <ServicesSection />
      <FeaturedProjects />
      <BlogSection />
      <ThemesSection />
      <PluginsSection />
      <CTASection />
    </Layout>
  );
};

export default Index;
