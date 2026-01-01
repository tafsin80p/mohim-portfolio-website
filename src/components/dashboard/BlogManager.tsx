import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { 
  getBlogPosts, 
  addBlogPost, 
  updateBlogPost, 
  deleteBlogPost, 
  type BlogPost 
} from "@/lib/contentStorage";
import { Plus, Edit, Trash2, Eye, EyeOff, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CloudinaryUploader } from "@/components/ui/CloudinaryUploader";

export const BlogManager = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    image_url: "",
    category: "",
    read_time: "5 min read",
    published: true,
  });
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    const data = await getBlogPosts();
    setPosts(data);
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const slug = formData.slug || generateSlug(formData.title);
      
      if (editingPost) {
        const updated = await updateBlogPost(editingPost.id, {
          title: formData.title,
          slug: slug,
          excerpt: formData.excerpt,
          content: formData.content,
          image_url: formData.image_url || undefined,
          category: formData.category,
          read_time: formData.read_time,
          published: formData.published,
        });
        
        if (updated) {
          toast({
            title: "Success",
            description: "Blog post updated successfully",
          });
          await loadPosts();
          resetForm();
        }
      } else {
        await addBlogPost({
          title: formData.title,
          slug: slug,
          excerpt: formData.excerpt,
          content: formData.content,
          image_url: formData.image_url || undefined,
          category: formData.category,
          read_time: formData.read_time,
          published: formData.published,
        });
        
        toast({
          title: "Success",
          description: "Blog post added successfully",
        });
        loadPosts();
        resetForm();
      }
    } catch (error) {
      console.error('Error saving blog post:', error);
      toast({
        title: "Error",
        description: "Failed to save blog post. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      image_url: post.image_url || "",
      category: post.category,
      read_time: post.read_time,
      published: post.published,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this blog post?")) {
      const success = await deleteBlogPost(id);
      if (success) {
        toast({
          title: "Success",
          description: "Blog post deleted successfully",
        });
        await loadPosts();
      }
    }
  };

  const togglePublish = async (post: BlogPost) => {
    await updateBlogPost(post.id, { published: !post.published });
    await loadPosts();
    toast({
      title: "Success",
      description: post.published ? "Post unpublished" : "Post published",
    });
  };

  const resetForm = () => {
    setFormData({
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      image_url: "",
      category: "",
      read_time: "5 min read",
      published: true,
    });
    setEditingPost(null);
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-mono text-2xl font-bold">Blog Posts</h2>
          <p className="text-muted-foreground text-sm">Manage your blog content</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="gap-2">
              <Plus className="w-4 h-4" />
              New Post
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingPost ? "Edit Blog Post" : "Create New Blog Post"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => {
                    setFormData({ ...formData, title: e.target.value });
                    if (!editingPost && !formData.slug) {
                      setFormData(prev => ({ ...prev, slug: generateSlug(e.target.value) }));
                    }
                  }}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug (URL-friendly)</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  rows={3}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={10}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="image_url">Featured Image</Label>
                <CloudinaryUploader
                  value={formData.image_url}
                  onChange={(url) => setFormData({ ...formData, image_url: url })}
                  imagesOnly={true}
                  label="Upload Featured Image"
                  showPreview={true}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="read_time">Read Time</Label>
                  <Input
                    id="read_time"
                    value={formData.read_time}
                    onChange={(e) => setFormData({ ...formData, read_time: e.target.value })}
                  />
                </div>
                <div className="flex items-center space-x-2 pt-8">
                  <Switch
                    id="published"
                    checked={formData.published}
                    onCheckedChange={(checked) => setFormData({ ...formData, published: checked })}
                  />
                  <Label htmlFor="published">Published</Label>
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
                    `${editingPost ? "Update" : "Create"} Post`
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post.id} className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-mono font-semibold text-lg">{post.title}</h3>
                  {post.published ? (
                    <Badge variant="default" className="gap-1">
                      <Eye className="w-3 h-3" />
                      Published
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="gap-1">
                      <EyeOff className="w-3 h-3" />
                      Draft
                    </Badge>
                  )}
                  <Badge variant="outline">{post.category}</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{post.excerpt}</p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>Slug: /blog/{post.slug}</span>
                  <span>•</span>
                  <span>{post.read_time}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => togglePublish(post)}
                  className="gap-2"
                >
                  {post.published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(post)}
                  className="gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(post.id)}
                  className="gap-2 text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {posts.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <p>No blog posts yet. Create your first post to get started.</p>
        </div>
      )}
    </div>
  );
};





