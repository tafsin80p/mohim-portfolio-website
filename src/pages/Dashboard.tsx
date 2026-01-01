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
  FileText,
  LogOut,
  ExternalLink,
  Menu
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth as useClerkAuth, useUser } from "@clerk/clerk-react";
import { useNavigate, Link } from "react-router-dom";
import { ProjectsManager } from "@/components/dashboard/ProjectsManager";
import { BlogManager } from "@/components/dashboard/BlogManager";
import { ServicesManager } from "@/components/dashboard/ServicesManager";
import { ThemesManager } from "@/components/dashboard/ThemesManager";
import { PluginsManager } from "@/components/dashboard/PluginsManager";
import { AboutManager } from "@/components/dashboard/AboutManager";
import { ContactManager } from "@/components/dashboard/ContactManager";
import { FooterManager } from "@/components/dashboard/FooterManager";
import { OverviewStats } from "@/components/dashboard/OverviewStats";
import { ProfileSettings } from "@/components/dashboard/ProfileSettings";
import { ColorThemeManager } from "@/components/dashboard/ColorThemeManager";
import { LayoutManager } from "@/components/dashboard/LayoutManager";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

const Dashboard = () => {
  const { signOut } = useClerkAuth();
  const { user: clerkUser } = useUser();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [showProfileSettings, setShowProfileSettings] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Convert Clerk user to compatible format
  const user = clerkUser ? {
    id: clerkUser.id,
    email: clerkUser.primaryEmailAddress?.emailAddress || '',
    full_name: clerkUser.firstName && clerkUser.lastName 
      ? `${clerkUser.firstName} ${clerkUser.lastName}` 
      : clerkUser.firstName || clerkUser.lastName || undefined,
    avatar_url: clerkUser.imageUrl || undefined,
    created_at: clerkUser.createdAt?.toISOString() || new Date().toISOString(),
  } : null;

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        <div className="border-b border-border">
          <div className="container-custom py-4 md:py-6 px-4 md:px-6">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                {/* Mobile Menu Button */}
                <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
                  <SheetTrigger asChild className="lg:hidden">
                    <Button variant="outline" size="sm" className="lg:hidden">
                      <Menu className="w-4 h-4" />
                    </Button>
                  </SheetTrigger>
                </Sheet>
                <div>
                  <h1 className="font-mono text-xl md:text-2xl lg:text-3xl font-bold mb-1 md:mb-2">Dashboard</h1>
                  <p className="text-sm md:text-base text-muted-foreground hidden sm:block">Manage your website content</p>
                </div>
              </div>
              <div className="flex items-center gap-2 md:gap-4">
                <ThemeToggle variant="outline" size="sm" className="hidden sm:flex" />
                <Link to="/">
                  <Button variant="outline" size="sm" className="gap-2 text-xs md:text-sm">
                    <ExternalLink className="w-3 h-3 md:w-4 md:h-4" />
                    <span className="hidden md:inline">View Frontend</span>
                    <span className="md:hidden">View</span>
                  </Button>
                </Link>
                
                {/* Profile Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer focus:outline-none">
                      <Avatar className="w-10 h-10 border-2 border-border">
                        <AvatarImage src={user?.avatar_url} alt={user?.full_name || user?.email || "User"} />
                        <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                          {(user?.full_name || user?.email || "U").charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="text-left hidden md:block">
                        <p className="text-sm font-medium">{user?.full_name || user?.email}</p>
                        <p className="text-xs text-muted-foreground">Administrator</p>
                      </div>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user?.full_name || "User"}</p>
                        <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="gap-2 cursor-pointer"
                      onClick={() => setShowProfileSettings(true)}
                    >
                      <Settings className="w-4 h-4" />
                      Profile Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut} className="gap-2 cursor-pointer text-destructive focus:text-destructive">
                      <LogOut className="w-4 h-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </div>

        <div className="py-4 md:py-8 px-4 md:px-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex gap-4 lg:gap-8">
              {/* Vertical Sidebar - Left (Desktop) */}
              <div className="hidden lg:block w-64 flex-shrink-0 lg:pl-8">
                <div className="sticky top-8">
                  <div className="bg-card border border-border rounded-xl p-4">
                    <h3 className="font-mono font-semibold text-sm mb-4 text-muted-foreground uppercase tracking-wide">Navigation</h3>
                    <TabsList className="flex flex-col h-auto w-full gap-1 bg-transparent">
                      <TabsTrigger 
                        value="overview" 
                        className="w-full justify-start gap-3 data-[state=active]:bg-primary/10"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        <span>Overview</span>
                      </TabsTrigger>
                      <TabsTrigger 
                        value="projects" 
                        className="w-full justify-start gap-3 data-[state=active]:bg-primary/10"
                      >
                        <FolderKanban className="w-4 h-4" />
                        <span>Projects</span>
                      </TabsTrigger>
                      <TabsTrigger 
                        value="blog" 
                        className="w-full justify-start gap-3 data-[state=active]:bg-primary/10"
                      >
                        <BookOpen className="w-4 h-4" />
                        <span>Blog</span>
                      </TabsTrigger>
                      <TabsTrigger 
                        value="services" 
                        className="w-full justify-start gap-3 data-[state=active]:bg-primary/10"
                      >
                        <Settings className="w-4 h-4" />
                        <span>Services</span>
                      </TabsTrigger>
                      <TabsTrigger 
                        value="themes" 
                        className="w-full justify-start gap-3 data-[state=active]:bg-primary/10"
                      >
                        <Palette className="w-4 h-4" />
                        <span>Themes</span>
                      </TabsTrigger>
                      <TabsTrigger 
                        value="plugins" 
                        className="w-full justify-start gap-3 data-[state=active]:bg-primary/10"
                      >
                        <Plug className="w-4 h-4" />
                        <span>Plugins</span>
                      </TabsTrigger>
                      <TabsTrigger 
                        value="about" 
                        className="w-full justify-start gap-3 data-[state=active]:bg-primary/10"
                      >
                        <User className="w-4 h-4" />
                        <span>About</span>
                      </TabsTrigger>
                      <TabsTrigger 
                        value="contact" 
                        className="w-full justify-start gap-3 data-[state=active]:bg-primary/10"
                      >
                        <Mail className="w-4 h-4" />
                        <span>Contact</span>
                      </TabsTrigger>
                      <TabsTrigger 
                        value="footer" 
                        className="w-full justify-start gap-3 data-[state=active]:bg-primary/10"
                      >
                        <FileText className="w-4 h-4" />
                        <span>Footer</span>
                      </TabsTrigger>
                      <TabsTrigger 
                        value="color-theme" 
                        className="w-full justify-start gap-3 data-[state=active]:bg-primary/10"
                      >
                        <Palette className="w-4 h-4" />
                        <span>Color Theme</span>
                      </TabsTrigger>
                      <TabsTrigger 
                        value="layout" 
                        className="w-full justify-start gap-3 data-[state=active]:bg-primary/10"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        <span>Layout</span>
                      </TabsTrigger>
                    </TabsList>
                  </div>
                </div>
              </div>

              {/* Mobile Sidebar - Sheet */}
              <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
                <SheetContent side="left" className="w-80 bg-background/95 backdrop-blur-xl border-border p-0">
                  <div className="p-6 border-b border-border">
                    <h3 className="font-mono font-semibold text-lg mb-2">Navigation</h3>
                    <p className="text-sm text-muted-foreground">Select a section to manage</p>
                  </div>
                  <div className="p-4">
                    <TabsList className="flex flex-col h-auto w-full gap-1 bg-transparent">
                      <TabsTrigger 
                        value="overview" 
                        className="w-full justify-start gap-3 data-[state=active]:bg-primary/10"
                        onClick={() => setSidebarOpen(false)}
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        <span>Overview</span>
                      </TabsTrigger>
                      <TabsTrigger 
                        value="projects" 
                        className="w-full justify-start gap-3 data-[state=active]:bg-primary/10"
                        onClick={() => setSidebarOpen(false)}
                      >
                        <FolderKanban className="w-4 h-4" />
                        <span>Projects</span>
                      </TabsTrigger>
                      <TabsTrigger 
                        value="blog" 
                        className="w-full justify-start gap-3 data-[state=active]:bg-primary/10"
                        onClick={() => setSidebarOpen(false)}
                      >
                        <BookOpen className="w-4 h-4" />
                        <span>Blog</span>
                      </TabsTrigger>
                      <TabsTrigger 
                        value="services" 
                        className="w-full justify-start gap-3 data-[state=active]:bg-primary/10"
                        onClick={() => setSidebarOpen(false)}
                      >
                        <Settings className="w-4 h-4" />
                        <span>Services</span>
                      </TabsTrigger>
                      <TabsTrigger 
                        value="themes" 
                        className="w-full justify-start gap-3 data-[state=active]:bg-primary/10"
                        onClick={() => setSidebarOpen(false)}
                      >
                        <Palette className="w-4 h-4" />
                        <span>Themes</span>
                      </TabsTrigger>
                      <TabsTrigger 
                        value="plugins" 
                        className="w-full justify-start gap-3 data-[state=active]:bg-primary/10"
                        onClick={() => setSidebarOpen(false)}
                      >
                        <Plug className="w-4 h-4" />
                        <span>Plugins</span>
                      </TabsTrigger>
                      <TabsTrigger 
                        value="about" 
                        className="w-full justify-start gap-3 data-[state=active]:bg-primary/10"
                        onClick={() => setSidebarOpen(false)}
                      >
                        <User className="w-4 h-4" />
                        <span>About</span>
                      </TabsTrigger>
                      <TabsTrigger 
                        value="contact" 
                        className="w-full justify-start gap-3 data-[state=active]:bg-primary/10"
                        onClick={() => setSidebarOpen(false)}
                      >
                        <Mail className="w-4 h-4" />
                        <span>Contact</span>
                      </TabsTrigger>
                      <TabsTrigger 
                        value="footer" 
                        className="w-full justify-start gap-3 data-[state=active]:bg-primary/10"
                        onClick={() => setSidebarOpen(false)}
                      >
                        <FileText className="w-4 h-4" />
                        <span>Footer</span>
                      </TabsTrigger>
                      <TabsTrigger 
                        value="color-theme" 
                        className="w-full justify-start gap-3 data-[state=active]:bg-primary/10"
                        onClick={() => setSidebarOpen(false)}
                      >
                        <Palette className="w-4 h-4" />
                        <span>Color Theme</span>
                      </TabsTrigger>
                      <TabsTrigger 
                        value="layout" 
                        className="w-full justify-start gap-3 data-[state=active]:bg-primary/10"
                        onClick={() => setSidebarOpen(false)}
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        <span>Layout</span>
                      </TabsTrigger>
                    </TabsList>
                  </div>
                </SheetContent>
              </Sheet>

              {/* Main Content Area - Full Width */}
              <div className="flex-1 lg:pr-8 w-full">

            <TabsContent value="overview" className="space-y-4 md:space-y-6">
              <OverviewStats />
              <div className="bg-card border border-border rounded-xl p-4 md:p-6">
                <h2 className="font-mono text-lg md:text-xl font-bold mb-4">Quick Actions</h2>
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
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

            <TabsContent value="footer">
              <FooterManager />
            </TabsContent>

            <TabsContent value="color-theme">
              <ColorThemeManager />
            </TabsContent>

            <TabsContent value="layout">
              <LayoutManager />
            </TabsContent>
              </div>
            </div>
          </Tabs>
        </div>

        {/* Profile Settings Dialog */}
        <Dialog open={showProfileSettings} onOpenChange={setShowProfileSettings}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Profile Settings</DialogTitle>
            </DialogHeader>
            <ProfileSettings onClose={() => setShowProfileSettings(false)} />
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default Dashboard;

