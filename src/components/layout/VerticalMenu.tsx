import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, CheckSquare, Layers, FileText, Tags, MessageSquare, Mail, Edit, User, LogOut, Menu, X, Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@clerk/clerk-react";
import { useTheme } from "@/hooks/useTheme";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const menuItems = [
  { icon: Home, path: "/", label: "Home" },
  { icon: CheckSquare, path: "/projects", label: "Projects" },
  { icon: Layers, path: "/themes", label: "Themes" },
  { icon: FileText, path: "/blog", label: "Blog" },
  { icon: Tags, path: "/plugins", label: "Plugins" },
  { icon: MessageSquare, path: "/contact", label: "Contact" },
  { icon: Mail, path: "/about", label: "About" },
  { icon: Edit, path: "/dashboard", label: "Dashboard", requireAuth: true },
];

// Bottom menu items (5 items for mobile)
const bottomMenuItems = [
  { icon: Home, path: "/", label: "Home" },
  { icon: CheckSquare, path: "/projects", label: "Projects" },
  { icon: FileText, path: "/blog", label: "Blog" },
  { icon: MessageSquare, path: "/contact", label: "Contact" },
  { icon: Layers, path: "/themes", label: "Themes" },
];

export const VerticalMenu = () => {
  const location = useLocation();
  const { isSignedIn, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
  };

  const visibleItems = menuItems.filter(item => !item.requireAuth || isSignedIn);
  const visibleBottomItems = bottomMenuItems;

  return (
    <>
      {/* Desktop: Right Side Vertical Menu */}
      <nav className="hidden md:block fixed right-6 top-1/2 -translate-y-1/2 z-50">
        <div className="bg-background/80 backdrop-blur-xl rounded-[24px] px-2.5 py-3 flex flex-col items-center gap-2 shadow-2xl border border-border">
          {visibleItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200 relative group",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-secondary"
                )}
                title={item.label}
              >
                <Icon className="w-5 h-5 stroke-[1.5]" />
              </Link>
            );
          })}
          
          {/* Theme Toggle */}
          <div className="w-8 h-px bg-border my-1" />
          <button
            onClick={toggleTheme}
            className="w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200 text-foreground hover:bg-secondary"
            title={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
            aria-label="Toggle theme"
          >
            {theme === "light" ? (
              <Moon className="w-5 h-5 stroke-[1.5]" />
            ) : (
              <Sun className="w-5 h-5 stroke-[1.5]" />
            )}
          </button>
          
          {/* Account Menu */}
          {isSignedIn && (
            <>
              <div className="w-8 h-px bg-border my-1" />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className="w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200 text-foreground hover:bg-secondary"
                    title="Account"
                  >
                    <User className="w-5 h-5 stroke-[1.5]" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" side="left" className="mr-2">
                  <DropdownMenuItem onClick={handleSignOut} className="gap-2 cursor-pointer">
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
        </div>
      </nav>

      {/* Mobile: Top Right Menu Button */}
      <div className="md:hidden fixed top-6 right-6 z-50">
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <button
              className="w-12 h-12 rounded-full bg-background/80 backdrop-blur-xl border border-border flex items-center justify-center text-foreground shadow-2xl hover:bg-background/90 transition-colors"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5 stroke-[1.5]" />
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="bg-background/95 backdrop-blur-xl border-border w-80">
            <SheetHeader>
              <SheetTitle className="text-foreground text-left">Menu</SheetTitle>
            </SheetHeader>
            <div className="mt-8 flex flex-col gap-2">
              {visibleItems.map((item, index) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsSheetOpen(false)}
                    className={cn(
                      "flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-foreground hover:bg-secondary"
                    )}
                  >
                    <Icon className="w-5 h-5 stroke-[1.5]" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
              
              {/* Theme Toggle in Mobile Menu */}
              <div className="h-px bg-border my-2" />
              <button
                onClick={toggleTheme}
                className="flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200 text-foreground hover:bg-secondary"
              >
                {theme === "light" ? (
                  <Moon className="w-5 h-5 stroke-[1.5]" />
                ) : (
                  <Sun className="w-5 h-5 stroke-[1.5]" />
                )}
                <span className="font-medium">{theme === "light" ? "Dark Mode" : "Light Mode"}</span>
              </button>
              
              {isSignedIn && (
                <>
                  <div className="h-px bg-border my-2" />
                  <button
                    onClick={() => {
                      handleSignOut();
                      setIsSheetOpen(false);
                    }}
                    className="flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200 text-foreground hover:bg-secondary"
                  >
                    <LogOut className="w-5 h-5 stroke-[1.5]" />
                    <span className="font-medium">Sign Out</span>
                  </button>
                </>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Mobile: Bottom Rounded Menu (5 items) */}
      <nav className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
        <div className="bg-background/80 backdrop-blur-xl rounded-[24px] px-4 py-3 flex items-center gap-3 shadow-2xl border border-border">
          {visibleBottomItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-secondary"
                )}
                title={item.label}
              >
                <Icon className="w-5 h-5 stroke-[1.5]" />
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
};

