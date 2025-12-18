import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { getServices, saveServices, type Service } from "@/lib/contentStorage";
import { Plus, Edit, Trash2, GripVertical } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import * as Icons from "lucide-react";

const iconNames = [
  "Palette", "Plug", "Code", "Rocket", "Shield", "Headphones",
  "Settings", "Wrench", "Zap", "Database", "Server", "Globe"
];

export const ServicesManager = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [formData, setFormData] = useState({
    icon: "Settings",
    title: "",
    description: "",
    order: 1,
  });
  const { toast } = useToast();

  useEffect(() => {
    void loadServices();
  }, []);

  const loadServices = async () => {
    const loaded = await getServices();
    setServices(loaded.sort((a, b) => a.order - b.order));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingService) {
      const updated = services.map(s => 
        s.id === editingService.id 
          ? { ...s, ...formData }
          : s
      );
      await saveServices(updated);
      toast({
        title: "Success",
        description: "Service updated successfully",
      });
    } else {
      const newService: Service = {
        id: Date.now().toString(),
        ...formData,
        order: services.length + 1,
      };
      await saveServices([...services, newService]);
      toast({
        title: "Success",
        description: "Service added successfully",
      });
    }
    
    await loadServices();
    resetForm();
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setFormData({
      icon: service.icon,
      title: service.title,
      description: service.description,
      order: service.order,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this service?")) {
      const filtered = services.filter(s => s.id !== id);
      await saveServices(filtered);
      toast({
        title: "Success",
        description: "Service deleted successfully",
      });
      await loadServices();
    }
  };

  const resetForm = () => {
    setFormData({
      icon: "Settings",
      title: "",
      description: "",
      order: 1,
    });
    setEditingService(null);
    setIsDialogOpen(false);
  };

  const IconComponent = Icons[formData.icon as keyof typeof Icons] || Icons.Settings;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-mono text-2xl font-bold">Services</h2>
          <p className="text-muted-foreground text-sm">Manage your service offerings</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="gap-2">
              <Plus className="w-4 h-4" />
              Add Service
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingService ? "Edit Service" : "Add New Service"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="icon">Icon</Label>
                <select
                  id="icon"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  className="w-full px-3 py-2 bg-background border border-input rounded-md"
                >
                  {iconNames.map(name => (
                    <option key={name} value={name}>{name}</option>
                  ))}
                </select>
                <div className="flex items-center gap-2 mt-2 p-3 bg-secondary rounded-md">
                  <IconComponent className="w-5 h-5 text-primary" />
                  <span className="text-sm">Preview</span>
                </div>
              </div>
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
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button type="submit">{editingService ? "Update" : "Add"} Service</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {services.map((service) => {
          const ServiceIcon = Icons[service.icon as keyof typeof Icons] || Icons.Settings;
          return (
            <div key={service.id} className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <ServiceIcon className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-mono font-semibold text-lg mb-2">{service.title}</h3>
                  <p className="text-sm text-muted-foreground">{service.description}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(service)}
                    className="gap-2"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(service.id)}
                    className="gap-2 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {services.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <p>No services yet. Add your first service to get started.</p>
        </div>
      )}
    </div>
  );
};






