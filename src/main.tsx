import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Initialize themes on app load
const initializeThemes = () => {
  if (typeof window !== "undefined") {
    // Initialize dark/light theme
    const stored = localStorage.getItem("theme");
    const root = document.documentElement;
    
    if (stored === "light" || stored === "dark") {
      root.classList.remove("light", "dark");
      root.classList.add(stored);
    } else {
      // Check system preference or default to dark
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      root.classList.remove("light", "dark");
      root.classList.add(prefersDark ? "dark" : "light");
      localStorage.setItem("theme", prefersDark ? "dark" : "light");
    }

    // Initialize color theme (synchronously using inline data)
    let storedColorTheme = localStorage.getItem("colorTheme") || "cyan";
    
    // Check if auto rotation is enabled
    const autoRotationEnabled = localStorage.getItem("autoColorRotationEnabled") === "true";
    if (autoRotationEnabled) {
      // Use synchronous approach with inline logic
      const themeKeys = ["cyan", "blue", "purple", "green", "orange", "pink", "red", "indigo"];
      let visitCount = parseInt(localStorage.getItem("autoColorVisitCount") || "0", 10);
      const lastTheme = localStorage.getItem("autoColorLastTheme");
      
      visitCount += 1;
      
      let nextTheme = "cyan";
      if (lastTheme && themeKeys.includes(lastTheme)) {
        const currentIndex = themeKeys.indexOf(lastTheme);
        const nextIndex = (currentIndex + 1) % themeKeys.length;
        nextTheme = themeKeys[nextIndex];
      }
      
      localStorage.setItem("autoColorVisitCount", visitCount.toString());
      localStorage.setItem("autoColorLastTheme", nextTheme);
      localStorage.setItem("colorTheme", nextTheme);
      storedColorTheme = nextTheme;
    }
    
    const colorThemesMap: Record<string, { primaryHsl: string; glow: string }> = {
      cyan: { primaryHsl: "174 72% 56%", glow: "0 0 40px hsl(174 72% 56% / 0.3)" },
      blue: { primaryHsl: "217 91% 60%", glow: "0 0 40px hsl(217 91% 60% / 0.3)" },
      purple: { primaryHsl: "270 91% 65%", glow: "0 0 40px hsl(270 91% 65% / 0.3)" },
      green: { primaryHsl: "142 76% 36%", glow: "0 0 40px hsl(142 76% 36% / 0.3)" },
      orange: { primaryHsl: "24 95% 53%", glow: "0 0 40px hsl(24 95% 53% / 0.3)" },
      pink: { primaryHsl: "330 81% 60%", glow: "0 0 40px hsl(330 81% 60% / 0.3)" },
      red: { primaryHsl: "0 84% 60%", glow: "0 0 40px hsl(0 84% 60% / 0.3)" },
      indigo: { primaryHsl: "239 84% 67%", glow: "0 0 40px hsl(239 84% 67% / 0.3)" },
    };

    const theme = colorThemesMap[storedColorTheme] || colorThemesMap.cyan;
    root.style.setProperty("--primary", theme.primaryHsl);
    root.style.setProperty("--accent", theme.primaryHsl);
    root.style.setProperty("--ring", theme.primaryHsl);
    root.style.setProperty("--glow-primary", theme.glow);
    root.style.setProperty("--sidebar-primary", theme.primaryHsl);
    root.style.setProperty("--sidebar-ring", theme.primaryHsl);
    
    // Update gradient with proper hue calculation (using theme's saturation/lightness for first color)
    const hslParts = theme.primaryHsl.split(" ");
    const hue = parseInt(hslParts[0]);
    const saturation = hslParts[1] || "72%";
    const lightness = hslParts[2] || "56%";
    const nextHue = hue + 16 > 360 ? hue + 16 - 360 : hue + 16;
    root.style.setProperty("--gradient-primary", `linear-gradient(135deg, hsl(${hue} ${saturation} ${lightness}), hsl(${nextHue} 80% 45%))`);
    
    // Update glow-soft to match the theme
    root.style.setProperty("--glow-soft", theme.glow.replace("0.3", "0.15"));
  }
};

// Initialize themes immediately to prevent flash
initializeThemes();

// Cloudinary configuration is handled in the CloudinaryUploader component

// Error handling for root render
try {
  const rootElement = document.getElementById("root");
  if (!rootElement) {
    throw new Error("Root element not found");
  }
  createRoot(rootElement).render(<App />);
} catch (error) {
  console.error("Failed to render app:", error);
  document.body.innerHTML = `
    <div style="display: flex; align-items: center; justify-content: center; min-height: 100vh; padding: 20px; font-family: system-ui, sans-serif;">
      <div style="max-width: 500px; text-align: center;">
        <h1 style="color: #ef4444; margin-bottom: 16px;">Failed to Load Application</h1>
        <p style="color: #6b7280; margin-bottom: 24px;">${error instanceof Error ? error.message : 'An unexpected error occurred'}</p>
        <button onclick="window.location.reload()" style="padding: 10px 20px; background: #3b82f6; color: white; border: none; border-radius: 6px; cursor: pointer;">
          Reload Page
        </button>
      </div>
    </div>
  `;
}
