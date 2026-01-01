import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ClerkProvider, SignedIn, SignedOut, SignIn, SignUp } from "@clerk/clerk-react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Preloader } from "@/components/Preloader";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { LayoutInitializer } from "@/components/LayoutInitializer";
import { Layout } from "@/components/layout/Layout";
import Index from "./pages/Index";
import About from "./pages/About";
import Projects from "./pages/Projects";
import Themes from "./pages/Themes";
import Plugins from "./pages/Plugins";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Contact from "./pages/Contact";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Clerk Publishable Key. Please add VITE_CLERK_PUBLISHABLE_KEY to your .env file");
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <ErrorBoundary>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <LayoutInitializer />
          <Preloader />
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/themes" element={<Themes />} />
              <Route path="/plugins" element={<Plugins />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/contact" element={<Contact />} />
              <Route 
                path="/sign-in/*" 
                element={
                  <div className="min-h-screen flex items-center justify-center bg-background section-padding">
                    <div className="w-full max-w-md">
                      <SignIn 
                        routing="path" 
                        path="/sign-in"
                        signUpUrl="/sign-up"
                      />
                    </div>
                  </div>
                } 
              />
              <Route 
                path="/login" 
                element={<Navigate to="/sign-in" replace />} 
              />
              <Route 
                path="/sign-up/*" 
                element={
                  <div className="min-h-screen flex items-center justify-center bg-background section-padding">
                    <div className="w-full max-w-md">
                      <SignUp 
                        routing="path" 
                        path="/sign-up"
                        signInUrl="/sign-in"
                      />
                    </div>
                  </div>
                } 
              />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ClerkProvider>
  </ErrorBoundary>
);

export default App;
