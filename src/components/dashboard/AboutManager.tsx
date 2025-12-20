import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
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
    availableBadgeText: "",
    primaryButtonText: "",
    secondaryButtonText: "",
    statsLabel1: "",
    statsLabel2: "",
    statsLabel3: "",
    statsValue1: "",
    statsValue2: "",
    statsValue3: "",
    cvUrl: "",
  });
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

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
      availableBadgeText: loadedHero.availableBadgeText,
      primaryButtonText: loadedHero.primaryButtonText,
      secondaryButtonText: loadedHero.secondaryButtonText,
      statsLabel1: loadedHero.statsLabel1,
      statsLabel2: loadedHero.statsLabel2,
      statsLabel3: loadedHero.statsLabel3,
      statsValue1: loadedHero.statsValue1,
      statsValue2: loadedHero.statsValue2,
      statsValue3: loadedHero.statsValue3,
      cvUrl: loadedHero.cvUrl || "",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content || !hero) return;
    
    setIsLoading(true);
    
    try {
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
      availableBadgeText: heroForm.availableBadgeText,
      primaryButtonText: heroForm.primaryButtonText,
      secondaryButtonText: heroForm.secondaryButtonText,
      statsLabel1: heroForm.statsLabel1,
      statsLabel2: heroForm.statsLabel2,
      statsLabel3: heroForm.statsLabel3,
      statsValue1: heroForm.statsValue1,
      statsValue2: heroForm.statsValue2,
      statsValue3: heroForm.statsValue3,
      cvUrl: heroForm.cvUrl || undefined,
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
    } catch (error) {
      console.error('Error saving content:', error);
      toast({
        title: "Error",
        description: "Failed to save content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
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
            <div className="space-y-2">
              <Label htmlFor="hero-available-badge">Available Badge Text</Label>
              <Input
                id="hero-available-badge"
                value={heroForm.availableBadgeText}
                onChange={(e) => setHeroForm({ ...heroForm, availableBadgeText: e.target.value })}
                placeholder="Available"
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="hero-primary-button">Primary Button Text</Label>
                <Input
                  id="hero-primary-button"
                  value={heroForm.primaryButtonText}
                  onChange={(e) => setHeroForm({ ...heroForm, primaryButtonText: e.target.value })}
                  placeholder="View My Work"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hero-secondary-button">Secondary Button Text</Label>
                <Input
                  id="hero-secondary-button"
                  value={heroForm.secondaryButtonText}
                  onChange={(e) => setHeroForm({ ...heroForm, secondaryButtonText: e.target.value })}
                  placeholder="Download CV"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="hero-cv-url">CV Download URL</Label>
              <Input
                id="hero-cv-url"
                type="url"
                value={heroForm.cvUrl}
                onChange={(e) => setHeroForm({ ...heroForm, cvUrl: e.target.value })}
                placeholder="https://example.com/cv.pdf"
              />
              <p className="text-xs text-muted-foreground">
                Enter the direct download URL for your CV. If left empty, the button will link to the contact page.
              </p>
            </div>
            <div className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="hero-stats-label1">Stats Label 1</Label>
                  <Input
                    id="hero-stats-label1"
                    value={heroForm.statsLabel1}
                    onChange={(e) => setHeroForm({ ...heroForm, statsLabel1: e.target.value })}
                    placeholder="Projects"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hero-stats-label2">Stats Label 2</Label>
                  <Input
                    id="hero-stats-label2"
                    value={heroForm.statsLabel2}
                    onChange={(e) => setHeroForm({ ...heroForm, statsLabel2: e.target.value })}
                    placeholder="Themes"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hero-stats-label3">Stats Label 3</Label>
                  <Input
                    id="hero-stats-label3"
                    value={heroForm.statsLabel3}
                    onChange={(e) => setHeroForm({ ...heroForm, statsLabel3: e.target.value })}
                    placeholder="Plugins"
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="hero-stats-value1">Stats Value 1</Label>
                  <Input
                    id="hero-stats-value1"
                    value={heroForm.statsValue1}
                    onChange={(e) => setHeroForm({ ...heroForm, statsValue1: e.target.value })}
                    placeholder="50+"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hero-stats-value2">Stats Value 2</Label>
                  <Input
                    id="hero-stats-value2"
                    value={heroForm.statsValue2}
                    onChange={(e) => setHeroForm({ ...heroForm, statsValue2: e.target.value })}
                    placeholder="8+"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hero-stats-value3">Stats Value 3</Label>
                  <Input
                    id="hero-stats-value3"
                    value={heroForm.statsValue3}
                    onChange={(e) => setHeroForm({ ...heroForm, statsValue3: e.target.value })}
                    placeholder="15+"
                  />
                </div>
              </div>
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
            <p className="text-sm text-muted-foreground">
              These stats appear in the hero section. The first three stats (Projects, Themes, Plugins) are displayed on the home page.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="stat-projects">
                  Projects Count <span className="text-xs text-muted-foreground">(Hero: {hero?.statsLabel1 || "Projects"})</span>
                </Label>
                <Input
                  id="stat-projects"
                  value={formData.projects}
                  onChange={(e) => setFormData({ ...formData, projects: e.target.value })}
                  placeholder="50+"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stat-themes">
                  Themes Count <span className="text-xs text-muted-foreground">(Hero: {hero?.statsLabel2 || "Themes"})</span>
                </Label>
                <Input
                  id="stat-themes"
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  placeholder="8+"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stat-plugins">
                  Plugins Count <span className="text-xs text-muted-foreground">(Hero: {hero?.statsLabel3 || "Plugins"})</span>
                </Label>
                <Input
                  id="stat-plugins"
                  value={formData.clients}
                  onChange={(e) => setFormData({ ...formData, clients: e.target.value })}
                  placeholder="15+"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stat-coffee">Cups of Coffee (Not shown in hero)</Label>
                <Input
                  id="stat-coffee"
                  value={formData.coffee}
                  onChange={(e) => setFormData({ ...formData, coffee: e.target.value })}
                  placeholder="∞"
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
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};





