import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  getProjects, 
  addProject, 
  updateProject, 
  deleteProject, 
  type Project 
} from "@/lib/contentStorage";
import { Plus, Edit, Trash2, X, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CloudinaryUploader } from "@/components/ui/CloudinaryUploader";

export const ProjectsManager = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
    tags: "",
    liveUrl: "",
    githubUrl: "",
  });
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    const data = await getProjects();
    setProjects(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const tagsArray = formData.tags.split(",").map(tag => tag.trim()).filter(Boolean);
      
      if (editingProject) {
        const updated = await updateProject(editingProject.id, {
          title: formData.title,
          description: formData.description,
          image: formData.image,
          tags: tagsArray,
          liveUrl: formData.liveUrl || undefined,
          githubUrl: formData.githubUrl || undefined,
        });
        
        if (updated) {
          toast({
            title: "Success",
            description: "Project updated successfully",
          });
          await loadProjects();
          resetForm();
        }
      } else {
        await addProject({
          title: formData.title,
          description: formData.description,
          image: formData.image,
          tags: tagsArray,
          liveUrl: formData.liveUrl || undefined,
          githubUrl: formData.githubUrl || undefined,
        });
        
        toast({
          title: "Success",
          description: "Project added successfully",
        });
        await loadProjects();
        resetForm();
      }
    } catch (error) {
      console.error('Error saving project:', error);
      toast({
        title: "Error",
        description: "Failed to save project. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      description: project.description,
      image: project.image,
      tags: project.tags.join(", "),
      liveUrl: project.liveUrl || "",
      githubUrl: project.githubUrl || "",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this project?")) {
      const success = await deleteProject(id);
      if (success) {
        toast({
          title: "Success",
          description: "Project deleted successfully",
        });
        await loadProjects();
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      image: "",
      tags: "",
      liveUrl: "",
      githubUrl: "",
    });
    setEditingProject(null);
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-mono text-2xl font-bold">Projects</h2>
          <p className="text-muted-foreground text-sm">Manage your portfolio projects</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="gap-2">
              <Plus className="w-4 h-4" />
              Add Project
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingProject ? "Edit Project" : "Add New Project"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="image">Project Image</Label>
                <CloudinaryUploader
                  value={formData.image}
                  onChange={(url) => setFormData({ ...formData, image: url })}
                  imagesOnly={true}
                  label="Upload Project Image"
                  showPreview={true}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="WordPress, PHP, React"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="liveUrl">Live URL (optional)</Label>
                  <Input
                    id="liveUrl"
                    type="url"
                    value={formData.liveUrl}
                    onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="githubUrl">GitHub URL (optional)</Label>
                  <Input
                    id="githubUrl"
                    type="url"
                    value={formData.githubUrl}
                    onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                  />
                </div>
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
                    `${editingProject ? "Update" : "Add"} Project`
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div key={project.id} className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="aspect-video overflow-hidden">
              <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
            </div>
            <div className="p-4">
              <h3 className="font-mono font-semibold text-lg mb-2">{project.title}</h3>
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{project.description}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {project.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(project)}
                  className="flex-1 gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(project.id)}
                  className="gap-2 text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {projects.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <p>No projects yet. Add your first project to get started.</p>
        </div>
      )}
    </div>
  );
};





