import { useEffect, useState } from "react";
import { Code2 } from "lucide-react";
import { cn } from "@/lib/utils";

export const Preloader = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const startTime = Date.now();
    const minDisplayTime = 1500; // Minimum 1.5 seconds display time

    const hidePreloader = () => {
      const elapsed = Date.now() - startTime;
      const remainingTime = Math.max(0, minDisplayTime - elapsed);

      setTimeout(() => {
        setFadeOut(true);
        setTimeout(() => {
          setIsLoading(false);
        }, 300); // Fade out duration
      }, remainingTime);
    };

    // Check if page is already loaded
    if (document.readyState === "complete") {
      hidePreloader();
    } else {
      // Wait for window load event
      window.addEventListener("load", hidePreloader, { once: true });
    }

    // Fallback: Hide preloader after maximum 5 seconds regardless
    const maxTimeout = setTimeout(() => {
      console.warn('Preloader timeout - forcing hide');
      setFadeOut(true);
      setTimeout(() => {
        setIsLoading(false);
      }, 300);
    }, 5000);

    return () => {
      window.removeEventListener("load", hidePreloader);
      clearTimeout(maxTimeout);
    };
  }, []);

  if (!isLoading) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-[99999] flex items-center justify-center bg-background transition-opacity duration-300 pointer-events-auto",
        fadeOut && "opacity-0 pointer-events-none"
      )}
      style={{ zIndex: 99999 }}
    >
      <div className="flex flex-col items-center gap-6">
        {/* Logo */}
        <div className="relative">
          <div className="w-20 h-20 rounded-xl bg-primary/10 border-2 border-primary/20 flex items-center justify-center animate-pulse glow-box">
            <Code2 className="w-10 h-10 text-primary" />
          </div>
          <div className="absolute -inset-2 w-20 h-20 rounded-xl bg-primary/5 animate-ping"></div>
        </div>
        
        {/* Brand Name */}
        <div className="flex flex-col items-center gap-2">
          <span className="font-mono font-bold text-2xl text-foreground">Tafsin Ahmed</span>
          <div className="flex gap-1.5">
            <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
            <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
            <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

