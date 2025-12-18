import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { getPlugins, savePlugins, type Plugin } from "@/lib/contentStorage";
import { Plus, Edit, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { UploadcareUploader } from "@/components/ui/UploadcareUploader";

export const PluginsManager = () => {
  const [plugins, setPlugins] = useState<Plugin[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPlugin, setEditingPlugin] = useState<Plugin | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
    tags: "",
    price: "",
    fileUrl: "",
  });
  const { toast } = useToast();

  useEffect(() => {
    void loadPlugins();
  }, []);

  const loadPlugins = async () => {
    const loaded = await getPlugins();
    setPlugins(loaded);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const tagsArray = formData.tags.split(",").map(tag => tag.trim()).filter(Boolean);

    if (editingPlugin) {
      const updatedList = plugins.map(plugin =>
        plugin.id === editingPlugin.id
          ? {
              ...plugin,
              title: formData.title,
              description: formData.description,
              image: formData.image,
              tags: tagsArray,
              price: formData.price || undefined,
              fileUrl: formData.fileUrl || undefined,
            }
          : plugin
      );
      await savePlugins(updatedList);
      toast({
        title: "Success",
        description: "Plugin updated successfully",
      });
    } else {
      const newPlugin: Plugin = {
        id: crypto.randomUUID(),
        title: formData.title,
        description: formData.description,
        image: formData.image,
        tags: tagsArray,
        price: formData.price || undefined,
        fileUrl: formData.fileUrl || undefined,
        liveUrl: undefined,
        githubUrl: undefined,
      } as any;

      await savePlugins([...plugins, newPlugin]);
      toast({
        title: "Success",
        description: "Plugin added successfully",
      });
    }

    await loadPlugins();
    resetForm();
  };

  const handleEdit = (plugin: Plugin) => {
    setEditingPlugin(plugin);
    setFormData({
      title: plugin.title,
      description: plugin.description,
      image: plugin.image,
      tags: plugin.tags.join(", "),
      price: plugin.price || "",
      fileUrl: plugin.fileUrl || "",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this plugin?")) {
      const filtered = plugins.filter(p => p.id !== id);
      await savePlugins(filtered);
      toast({
        title: "Success",
        description: "Plugin deleted successfully",
      });
      await loadPlugins();
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
    setEditingPlugin(null);
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-mono text-2xl font-bold">Plugins</h2>
          <p className="text-muted-foreground text-sm">
            Upload and manage your WordPress plugin files. Downloads remain locked to this dashboard.
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="gap-2">
              <Plus className="w-4 h-4" />
              Add Plugin
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingPlugin ? "Edit Plugin" : "Add New Plugin"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="plugin-title">Title</Label>
                <Input
                  id="plugin-title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="plugin-description">Description</Label>
                <Textarea
                  id="plugin-description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Plugin Image / Icon</Label>
                <UploadcareUploader
                  value={formData.image}
                  onChange={(url) => setFormData({ ...formData, image: url })}
                  imagesOnly={true}
                  label="Upload Plugin Image"
                  showPreview={true}
                />
                <div className="mt-2">
                  <Label className="text-xs text-muted-foreground">Or enter URL manually:</Label>
                  <Input
                    type="url"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="https://example.com/plugin-image.jpg"
                    className="mt-1"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="plugin-tags">Tags (comma-separated)</Label>
                <Input
                  id="plugin-tags"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="SEO, Performance, Security"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="plugin-price">Price (optional)</Label>
                <Input
                  id="plugin-price"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="$29 or Free"
                />
              </div>

              <div className="space-y-2">
                <Label>Plugin File (.zip)</Label>
                <UploadcareUploader
                  value={formData.fileUrl}
                  onChange={(url) => setFormData({ ...formData, fileUrl: url })}
                  imagesOnly={false}
                  multiple={false}
                  label="Upload Plugin ZIP File"
                  showPreview={false}
                />
                <div className="mt-2">
                  <Label className="text-xs text-muted-foreground">Or enter file URL manually:</Label>
                  <Input
                    type="url"
                    value={formData.fileUrl}
                    onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value })}
                    placeholder="https://example.com/plugin-file.zip"
                    className="mt-1"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Note: Plugin files are only accessible from this dashboard and are not directly downloadable on the public site.
                </p>
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button type="submit">{editingPlugin ? "Update" : "Add"} Plugin</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plugins.map((plugin) => (
          <div key={plugin.id} className="bg-card border border-border rounded-xl overflow-hidden p-4 space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-lg bg-primary/10 overflow-hidden flex items-center justify-center shrink-0">
                {plugin.image ? (
                  <img src={plugin.image} alt={plugin.title} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-primary text-lg font-mono">WP</span>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-mono font-semibold text-lg">{plugin.title}</h3>
                  {plugin.price && (
                    <span className="text-sm font-mono text-primary">{plugin.price}</span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {plugin.description}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {plugin.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>

            {plugin.fileUrl && (
              <p className="text-[11px] text-muted-foreground italic">
                File uploaded (dashboard-only access).
              </p>
            )}

            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleEdit(plugin)}
                className="flex-1 gap-2"
              >
                <Edit className="w-4 h-4" />
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDelete(plugin.id)}
                className="gap-2 text-destructive hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {plugins.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <p>No plugins yet. Add your first plugin to get started.</p>
        </div>
      )}
    </div>
  );
};