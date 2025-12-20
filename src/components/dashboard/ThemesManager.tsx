import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { getThemes, saveThemes, type Theme } from "@/lib/contentStorage";
import { Plus, Edit, Trash2, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { UploadcareUploader } from "@/components/ui/UploadcareUploader";

export const ThemesManager = () => {
  const [themes, setThemes] = useState<Theme[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTheme, setEditingTheme] = useState<Theme | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
    tags: "",
    price: "",
    fileUrl: "",
  });
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    void loadThemes();
  }, []);

  const loadThemes = async () => {
    const loaded = await getThemes();
    setThemes(loaded);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const tagsArray = formData.tags.split(",").map(tag => tag.trim()).filter(Boolean);

      if (editingTheme) {
        const updatedList = themes.map(theme =>
          theme.id === editingTheme.id
            ? {
                ...theme,
                title: formData.title,
                description: formData.description,
                image: formData.image,
                tags: tagsArray,
                price: formData.price || undefined,
                fileUrl: formData.fileUrl || undefined,
              }
            : theme
        );
        await saveThemes(updatedList);
        toast({
          title: "Success",
          description: "Theme updated successfully",
        });
      } else {
        const newTheme: Theme = {
          id: crypto.randomUUID(),
          title: formData.title,
          description: formData.description,
          image: formData.image,
          tags: tagsArray,
          price: formData.price || undefined,
          fileUrl: formData.fileUrl || undefined,
        };

        await saveThemes([...themes, newTheme]);
        toast({
          title: "Success",
          description: "Theme added successfully",
        });
      }

      await loadThemes();
      resetForm();
    } catch (error) {
      console.error('Error saving theme:', error);
      toast({
        title: "Error",
        description: "Failed to save theme. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (theme: Theme) => {
    setEditingTheme(theme);
    setFormData({
      title: theme.title,
      description: theme.description,
      image: theme.image,
      tags: theme.tags.join(", "),
      price: theme.price || "",
      fileUrl: theme.fileUrl || "",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this theme?")) {
      const filtered = themes.filter(t => t.id !== id);
      await saveThemes(filtered);
      toast({
        title: "Success",
        description: "Theme deleted successfully",
      });
      await loadThemes();
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      image: "",
      tags: "",
      price: "",
      fileUrl: "",
    });
    setEditingTheme(null);
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-mono text-2xl font-bold">Themes</h2>
          <p className="text-muted-foreground text-sm">
            Upload and manage your WordPress theme files. Downloads remain locked to this dashboard.
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="gap-2">
              <Plus className="w-4 h-4" />
              Add Theme
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingTheme ? "Edit Theme" : "Add New Theme"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="theme-title">Title</Label>
                <Input
                  id="theme-title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="theme-description">Description</Label>
                <Textarea
                  id="theme-description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Preview Image</Label>
                <UploadcareUploader
                  value={formData.image}
                  onChange={(url) => setFormData({ ...formData, image: url })}
                  imagesOnly={true}
                  label="Upload Theme Preview Image"
                  showPreview={true}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="theme-tags">Tags (comma-separated)</Label>
                <Input
                  id="theme-tags"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="E-Commerce, WooCommerce, Responsive"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="theme-price">Price (optional)</Label>
                <Input
                  id="theme-price"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="$59 or Free"
                />
              </div>

              <div className="space-y-2">
                <Label>Theme File (.zip)</Label>
                <UploadcareUploader
                  value={formData.fileUrl}
                  onChange={(url) => setFormData({ ...formData, fileUrl: url })}
                  imagesOnly={false}
                  multiple={false}
                  label="Upload Theme ZIP File"
                  showPreview={false}
                />
                <p className="text-xs text-muted-foreground">
                  Note: Theme files are only accessible from this dashboard and are not directly downloadable on the public site.
                </p>
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    `${editingTheme ? "Update" : "Add"} Theme`
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {themes.map((theme) => (
          <div key={theme.id} className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="aspect-video overflow-hidden">
              <img src={theme.image} alt={theme.title} className="w-full h-full object-cover" />
            </div>
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-mono font-semibold text-lg">{theme.title}</h3>
                {theme.price && (
                  <span className="text-sm font-mono text-primary">{theme.price}</span>
                )}
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">{theme.description}</p>
              <div className="flex flex-wrap gap-2">
                {theme.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
              {theme.fileUrl && (
                <p className="text-[11px] text-muted-foreground italic">
                  File uploaded (dashboard-only access).
                </p>
              )}
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(theme)}
                  className="flex-1 gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(theme.id)}
                  className="gap-2 text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {themes.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <p>No themes yet. Add your first theme to get started.</p>
        </div>
      )}
    </div>
  );
};