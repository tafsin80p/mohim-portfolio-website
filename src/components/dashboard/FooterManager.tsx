import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { getFooterContent, saveFooterContent, type FooterContent, type SocialLink, type FooterLinkGroup } from "@/lib/contentStorage";
import { Plus, Trash2, GripVertical, Loader2 } from "lucide-react";

export const FooterManager = () => {
  const [content, setContent] = useState<FooterContent | null>(null);
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    const data = await getFooterContent();
    setContent(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content) return;
    
    setIsLoading(true);
    try {
      await saveFooterContent(content);
      toast({
        title: "Success",
        description: "Footer content updated successfully",
      });
    } catch (error) {
      console.error('Error saving footer content:', error);
      toast({
        title: "Error",
        description: "Failed to save footer content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addSocialLink = () => {
    if (!content) return;
    setContent({
      ...content,
      socialLinks: [...content.socialLinks, { icon: "Github", href: "#", label: "" }],
    });
  };

  const removeSocialLink = (index: number) => {
    if (!content) return;
    setContent({
      ...content,
      socialLinks: content.socialLinks.filter((_, i) => i !== index),
    });
  };

  const updateSocialLink = (index: number, field: keyof SocialLink, value: string) => {
    if (!content) return;
    const newLinks = [...content.socialLinks];
    newLinks[index] = { ...newLinks[index], [field]: value };
    setContent({ ...content, socialLinks: newLinks });
  };

  const addLinkGroup = () => {
    if (!content) return;
    setContent({
      ...content,
      linkGroups: [...content.linkGroups, { title: "", links: [] }],
    });
  };

  const removeLinkGroup = (index: number) => {
    if (!content) return;
    setContent({
      ...content,
      linkGroups: content.linkGroups.filter((_, i) => i !== index),
    });
  };

  const updateLinkGroup = (index: number, field: 'title', value: string) => {
    if (!content) return;
    const newGroups = [...content.linkGroups];
    newGroups[index] = { ...newGroups[index], [field]: value };
    setContent({ ...content, linkGroups: newGroups });
  };

  const addLinkToGroup = (groupIndex: number) => {
    if (!content) return;
    const newGroups = [...content.linkGroups];
    newGroups[groupIndex].links = [...newGroups[groupIndex].links, { name: "", path: "" }];
    setContent({ ...content, linkGroups: newGroups });
  };

  const removeLinkFromGroup = (groupIndex: number, linkIndex: number) => {
    if (!content) return;
    const newGroups = [...content.linkGroups];
    newGroups[groupIndex].links = newGroups[groupIndex].links.filter((_, i) => i !== linkIndex);
    setContent({ ...content, linkGroups: newGroups });
  };

  const updateLinkInGroup = (groupIndex: number, linkIndex: number, field: 'name' | 'path', value: string) => {
    if (!content) return;
    const newGroups = [...content.linkGroups];
    newGroups[groupIndex].links[linkIndex] = { ...newGroups[groupIndex].links[linkIndex], [field]: value };
    setContent({ ...content, linkGroups: newGroups });
  };

  const socialIcons = ["Github", "Linkedin", "Twitter", "Mail", "Facebook", "Instagram", "Youtube", "Dribbble"];

  if (!content) {
    return <div className="text-center py-12">Loading footer content...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-mono text-2xl font-bold">Footer Settings</h2>
        <p className="text-muted-foreground text-sm">Manage your website footer content and links</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Brand Section */}
        <div className="bg-card border border-border rounded-xl p-6 space-y-4">
          <h3 className="font-mono font-semibold text-lg">Brand Information</h3>
          <div className="space-y-2">
            <Label htmlFor="brand-name">Brand Name</Label>
            <Input
              id="brand-name"
              value={content.brandName}
              onChange={(e) => setContent({ ...content, brandName: e.target.value })}
              placeholder="Tafsin Ahmed"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={content.description}
              onChange={(e) => setContent({ ...content, description: e.target.value })}
              placeholder="Footer description text"
              rows={3}
            />
          </div>
        </div>

        {/* Social Links */}
        <div className="bg-card border border-border rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-mono font-semibold text-lg">Social Links</h3>
            <Button type="button" variant="outline" size="sm" onClick={addSocialLink}>
              <Plus className="w-4 h-4 mr-2" />
              Add Social Link
            </Button>
          </div>
          {content.socialLinks.map((social, index) => (
            <div key={index} className="border border-border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <GripVertical className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Social Link {index + 1}</span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeSocialLink(index)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Icon</Label>
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={social.icon}
                    onChange={(e) => updateSocialLink(index, 'icon', e.target.value)}
                  >
                    {socialIcons.map(icon => (
                      <option key={icon} value={icon}>{icon}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Label</Label>
                  <Input
                    value={social.label}
                    onChange={(e) => updateSocialLink(index, 'label', e.target.value)}
                    placeholder="GitHub"
                  />
                </div>
                <div className="space-y-2">
                  <Label>URL</Label>
                  <Input
                    value={social.href}
                    onChange={(e) => updateSocialLink(index, 'href', e.target.value)}
                    placeholder="https://github.com/username"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Link Groups */}
        <div className="bg-card border border-border rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-mono font-semibold text-lg">Link Groups</h3>
            <Button type="button" variant="outline" size="sm" onClick={addLinkGroup}>
              <Plus className="w-4 h-4 mr-2" />
              Add Link Group
            </Button>
          </div>
          {content.linkGroups.map((group, groupIndex) => (
            <div key={groupIndex} className="border border-border rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <GripVertical className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Link Group {groupIndex + 1}</span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeLinkGroup(groupIndex)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <div className="space-y-2">
                <Label>Group Title</Label>
                <Input
                  value={group.title}
                  onChange={(e) => updateLinkGroup(groupIndex, 'title', e.target.value)}
                  placeholder="Pages"
                />
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Links</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addLinkToGroup(groupIndex)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Link
                  </Button>
                </div>
                {group.links.map((link, linkIndex) => (
                  <div key={linkIndex} className="flex gap-2 items-start">
                    <div className="flex-1 grid grid-cols-2 gap-2">
                      <Input
                        value={link.name}
                        onChange={(e) => updateLinkInGroup(groupIndex, linkIndex, 'name', e.target.value)}
                        placeholder="Link Name"
                      />
                      <Input
                        value={link.path}
                        onChange={(e) => updateLinkInGroup(groupIndex, linkIndex, 'path', e.target.value)}
                        placeholder="/path"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeLinkFromGroup(groupIndex, linkIndex)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Copyright */}
        <div className="bg-card border border-border rounded-xl p-6 space-y-4">
          <h3 className="font-mono font-semibold text-lg">Copyright Text</h3>
          <div className="space-y-2">
            <Label htmlFor="copyright">Copyright Text</Label>
            <Input
              id="copyright"
              value={content.copyrightText}
              onChange={(e) => setContent({ ...content, copyrightText: e.target.value })}
              placeholder="Tafsin Ahmed. All rights reserved."
            />
            <p className="text-xs text-muted-foreground">
              The year ({new Date().getFullYear()}) will be automatically added before this text.
            </p>
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
    </div>
  );
};

