import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  FolderKanban, 
  BookOpen, 
  Settings, 
  Palette, 
  Plug, 
  User, 
  Mail,
  LogOut
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { ProjectsManager } from "@/components/dashboard/ProjectsManager";
import { BlogManager } from "@/components/dashboard/BlogManager";
import { ServicesManager } from "@/components/dashboard/ServicesManager";
import { ThemesManager } from "@/components/dashboard/ThemesManager";
import { PluginsManager } from "@/components/dashboard/PluginsManager";
import { AboutManager } from "@/components/dashboard/AboutManager";
import { ContactManager } from "@/components/dashboard/ContactManager";
import { OverviewStats } from "@/components/dashboard/OverviewStats";

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        <div className="border-b border-border">
          <div className="container-custom py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-mono text-3xl font-bold mb-2">Dashboard</h1>
                <p className="text-muted-foreground">Manage your website content</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm font-medium">{user?.full_name || user?.email}</p>
                  <p className="text-xs text-muted-foreground">Administrator</p>
                </div>
                <Button variant="outline" size="sm" onClick={handleSignOut} className="gap-2">
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="container-custom py-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 mb-8">
              <TabsTrigger value="overview" className="gap-2">
                <LayoutDashboard className="w-4 h-4" />
                <span className="hidden sm:inline">Overview</span>
              </TabsTrigger>
              <TabsTrigger value="projects" className="gap-2">
                <FolderKanban className="w-4 h-4" />
                <span className="hidden sm:inline">Projects</span>
              </TabsTrigger>
              <TabsTrigger value="blog" className="gap-2">
                <BookOpen className="w-4 h-4" />
                <span className="hidden sm:inline">Blog</span>
              </TabsTrigger>
              <TabsTrigger value="services" className="gap-2">
                <Settings className="w-4 h-4" />
                <span className="hidden sm:inline">Services</span>
              </TabsTrigger>
              <TabsTrigger value="themes" className="gap-2">
                <Palette className="w-4 h-4" />
                <span className="hidden sm:inline">Themes</span>
              </TabsTrigger>
              <TabsTrigger value="plugins" className="gap-2">
                <Plug className="w-4 h-4" />
                <span className="hidden sm:inline">Plugins</span>
              </TabsTrigger>
              <TabsTrigger value="about" className="gap-2">
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">About</span>
              </TabsTrigger>
              <TabsTrigger value="contact" className="gap-2">
                <Mail className="w-4 h-4" />
                <span className="hidden sm:inline">Contact</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <OverviewStats />
              <div className="bg-card border border-border rounded-xl p-6">
                <h2 className="font-mono text-xl font-bold mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Button 
                    variant="outline" 
                    className="h-auto flex-col py-4 gap-2"
                    onClick={() => setActiveTab("projects")}
                  >
                    <FolderKanban className="w-6 h-6" />
                    <span>Add Project</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-auto flex-col py-4 gap-2"
                    onClick={() => setActiveTab("blog")}
                  >
                    <BookOpen className="w-6 h-6" />
                    <span>New Blog Post</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-auto flex-col py-4 gap-2"
                    onClick={() => setActiveTab("services")}
                  >
                    <Settings className="w-6 h-6" />
                    <span>Manage Services</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-auto flex-col py-4 gap-2"
                    onClick={() => setActiveTab("about")}
                  >
                    <User className="w-6 h-6" />
                    <span>Edit About</span>
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="projects">
              <ProjectsManager />
            </TabsContent>

            <TabsContent value="blog">
              <BlogManager />
            </TabsContent>

            <TabsContent value="services">
              <ServicesManager />
            </TabsContent>

            <TabsContent value="themes">
              <ThemesManager />
            </TabsContent>

            <TabsContent value="plugins">
              <PluginsManager />
            </TabsContent>

            <TabsContent value="about">
              <AboutManager />
            </TabsContent>

            <TabsContent value="contact">
              <ContactManager />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;

