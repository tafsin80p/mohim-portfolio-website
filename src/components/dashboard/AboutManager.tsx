import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  getAboutContent,
  saveAboutContent,
  getHeroContent,
  saveHeroContent,
  type AboutContent,
  type HeroContent,
} from "@/lib/contentStorage";
import { UploadcareUploader } from "@/components/ui/UploadcareUploader";

export const AboutManager = () => {
  const [content, setContent] = useState<AboutContent | null>(null);
  const [hero, setHero] = useState<HeroContent | null>(null);
  const [formData, setFormData] = useState({
    bio: [""],
    skills: "",
    experience: "",
    projects: "",
    clients: "",
    coffee: "",
    imageUrl: "",
  });
  const [heroForm, setHeroForm] = useState({
    tagline: "",
    headlineLine1: "",
    headlineHighlight: "",
    headlineLine2: "",
    subheadline: "",
    name: "",
    role: "",
    floatingTitle: "",
    floatingSubtitle: "",
  });
  const { toast } = useToast();

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    const [loadedAbout, loadedHero] = await Promise.all([
      getAboutContent(),
      getHeroContent(),
    ]);
    setContent(loadedAbout);
    setHero(loadedHero);
    setFormData({
      bio: loadedAbout.bio,
      skills: loadedAbout.skills.join(", "),
      experience: loadedAbout.stats.experience,
      projects: loadedAbout.stats.projects,
      clients: loadedAbout.stats.clients,
      coffee: loadedAbout.stats.coffee,
      imageUrl: loadedAbout.imageUrl || "",
    });
    setHeroForm({
      tagline: loadedHero.tagline,
      headlineLine1: loadedHero.headlineLine1,
      headlineHighlight: loadedHero.headlineHighlight,
      headlineLine2: loadedHero.headlineLine2,
      subheadline: loadedHero.subheadline,
      name: loadedHero.name,
      role: loadedHero.role,
      floatingTitle: loadedHero.floatingTitle,
      floatingSubtitle: loadedHero.floatingSubtitle,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content || !hero) return;
    
    const updatedAbout: AboutContent = {
      bio: formData.bio.filter(b => b.trim()),
      skills: formData.skills.split(",").map(s => s.trim()).filter(Boolean),
      stats: {
        experience: formData.experience,
        projects: formData.projects,
        clients: formData.clients,
        coffee: formData.coffee,
      },
      imageUrl: formData.imageUrl || undefined,
    };
    const updatedHero: HeroContent = {
      tagline: heroForm.tagline,
      headlineLine1: heroForm.headlineLine1,
      headlineHighlight: heroForm.headlineHighlight,
      headlineLine2: heroForm.headlineLine2,
      subheadline: heroForm.subheadline,
      name: heroForm.name,
      role: heroForm.role,
      floatingTitle: heroForm.floatingTitle,
      floatingSubtitle: heroForm.floatingSubtitle,
    };

    await Promise.all([
      saveAboutContent(updatedAbout),
      saveHeroContent(updatedHero),
    ]);
    toast({
      title: "Success",
      description: "About content updated successfully",
    });
    await loadContent();
  };

  const addBioParagraph = () => {
    setFormData({ ...formData, bio: [...formData.bio, ""] });
  };

  const removeBioParagraph = (index: number) => {
    setFormData({ ...formData, bio: formData.bio.filter((_, i) => i !== index) });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-mono text-2xl font-bold">About Page</h2>
        <p className="text-muted-foreground text-sm">Manage your about page content</p>
      </div>

      {content && hero && (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-card border border-border rounded-xl p-6 space-y-4">
            <h3 className="font-mono font-semibold text-lg">Hero Section Text</h3>
            <p className="text-sm text-muted-foreground">
              Control the main text shown in the hero section on the home page.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="hero-name">Name (overlay on profile image)</Label>
                <Input
                  id="hero-name"
                  value={heroForm.name}
                  onChange={(e) => setHeroForm({ ...heroForm, name: e.target.value })}
                  placeholder="Tafsin Ahmed"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hero-role">Role / Title (overlay on profile image)</Label>
                <Input
                  id="hero-role"
                  value={heroForm.role}
                  onChange={(e) => setHeroForm({ ...heroForm, role: e.target.value })}
                  placeholder="WordPress Developer"
                />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="hero-floating-title">Floating Card Title</Label>
                <Input
                  id="hero-floating-title"
                  value={heroForm.floatingTitle}
                  onChange={(e) => setHeroForm({ ...heroForm, floatingTitle: e.target.value })}
                  placeholder="WordPress Expert"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hero-floating-subtitle">Floating Card Subtitle</Label>
                <Input
                  id="hero-floating-subtitle"
                  value={heroForm.floatingSubtitle}
                  onChange={(e) => setHeroForm({ ...heroForm, floatingSubtitle: e.target.value })}
                  placeholder="Since 2016"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="hero-tagline">Top Tagline</Label>
              <Input
                id="hero-tagline"
                value={heroForm.tagline}
                onChange={(e) => setHeroForm({ ...heroForm, tagline: e.target.value })}
                placeholder="Available for freelance work"
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="hero-line1">Headline - Line 1</Label>
                <Input
                  id="hero-line1"
                  value={heroForm.headlineLine1}
                  onChange={(e) => setHeroForm({ ...heroForm, headlineLine1: e.target.value })}
                  placeholder="I craft beautiful"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hero-highlight">Headline Highlight (colored word)</Label>
                <Input
                  id="hero-highlight"
                  value={heroForm.headlineHighlight}
                  onChange={(e) => setHeroForm({ ...heroForm, headlineHighlight: e.target.value })}
                  placeholder="WordPress"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="hero-line2">Headline - Line 2</Label>
              <Input
                id="hero-line2"
                value={heroForm.headlineLine2}
                onChange={(e) => setHeroForm({ ...heroForm, headlineLine2: e.target.value })}
                placeholder="experiences"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hero-subheadline">Subheadline</Label>
              <Textarea
                id="hero-subheadline"
                rows={3}
                value={heroForm.subheadline}
                onChange={(e) => setHeroForm({ ...heroForm, subheadline: e.target.value })}
                placeholder="Short description under the main headline."
              />
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6 space-y-4">
            <h3 className="font-mono font-semibold text-lg">Bio</h3>
            {formData.bio.map((paragraph, index) => (
              <div key={index} className="space-y-2">
                <div className="flex gap-2">
                  <Textarea
                    value={paragraph}
                    onChange={(e) => {
                      const newBio = [...formData.bio];
                      newBio[index] = e.target.value;
                      setFormData({ ...formData, bio: newBio });
                    }}
                    rows={3}
                    placeholder={`Bio paragraph ${index + 1}`}
                  />
                  {formData.bio.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeBioParagraph(index)}
                    >
                      Remove
                    </Button>
                  )}
                </div>
              </div>
            ))}
            <Button type="button" variant="outline" onClick={addBioParagraph}>
              Add Paragraph
            </Button>
          </div>

          <div className="bg-card border border-border rounded-xl p-6 space-y-4">
            <h3 className="font-mono font-semibold text-lg">Skills</h3>
            <Textarea
              value={formData.skills}
              onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
              placeholder="WordPress, PHP, JavaScript (comma-separated)"
              rows={3}
            />
          </div>

          <div className="bg-card border border-border rounded-xl p-6 space-y-4">
            <h3 className="font-mono font-semibold text-lg">Stats</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Years Experience</Label>
                <Input
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Projects Completed</Label>
                <Input
                  value={formData.projects}
                  onChange={(e) => setFormData({ ...formData, projects: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Happy Clients</Label>
                <Input
                  value={formData.clients}
                  onChange={(e) => setFormData({ ...formData, clients: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Cups of Coffee</Label>
                <Input
                  value={formData.coffee}
                  onChange={(e) => setFormData({ ...formData, coffee: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6 space-y-4">
            <h3 className="font-mono font-semibold text-lg">Profile Image</h3>
            <p className="text-sm text-muted-foreground">
              This image appears in the hero section and about page. Use a square image (recommended: 600x600px or larger).
            </p>
            <div className="space-y-4">
                <UploadcareUploader
                  value={formData.imageUrl}
                  onChange={(url) => setFormData({ ...formData, imageUrl: url })}
                  imagesOnly={true}
                  crop="1:1"
                  label="Upload Profile Image"
                  showPreview={true}
                />
              <div className="mt-2">
                <Label className="text-xs text-muted-foreground">Or enter URL manually:</Label>
                <Input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://example.com/profile-image.jpg"
                  className="mt-1"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      )}
    </div>
  );
};





