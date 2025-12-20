import { useEffect, useState } from "react";
import { isAutoColorRotationEnabled } from "@/lib/autoColorRotation";

export type ColorTheme = "cyan" | "blue" | "purple" | "green" | "orange" | "pink" | "red" | "indigo";

export interface ColorThemeConfig {
  name: string;
  primary: string;
  primaryHsl: string;
  glow: string;
}

export const colorThemes: Record<ColorTheme, ColorThemeConfig> = {
  cyan: {
    name: "Cyan",
    primary: "#22d3ee",
    primaryHsl: "174 72% 56%",
    glow: "0 0 40px hsl(174 72% 56% / 0.3)",
  },
  blue: {
    name: "Blue",
    primary: "#3b82f6",
    primaryHsl: "217 91% 60%",
    glow: "0 0 40px hsl(217 91% 60% / 0.3)",
  },
  purple: {
    name: "Purple",
    primary: "#a855f7",
    primaryHsl: "270 91% 65%",
    glow: "0 0 40px hsl(270 91% 65% / 0.3)",
  },
  green: {
    name: "Green",
    primary: "#22c55e",
    primaryHsl: "142 76% 36%",
    glow: "0 0 40px hsl(142 76% 36% / 0.3)",
  },
  orange: {
    name: "Orange",
    primary: "#f97316",
    primaryHsl: "24 95% 53%",
    glow: "0 0 40px hsl(24 95% 53% / 0.3)",
  },
  pink: {
    name: "Pink",
    primary: "#ec4899",
    primaryHsl: "330 81% 60%",
    glow: "0 0 40px hsl(330 81% 60% / 0.3)",
  },
  red: {
    name: "Red",
    primary: "#ef4444",
    primaryHsl: "0 84% 60%",
    glow: "0 0 40px hsl(0 84% 60% / 0.3)",
  },
  indigo: {
    name: "Indigo",
    primary: "#6366f1",
    primaryHsl: "239 84% 67%",
    glow: "0 0 40px hsl(239 84% 67% / 0.3)",
  },
};

export const useColorTheme = () => {
  const [colorTheme, setColorTheme] = useState<ColorTheme>(() => {
    if (typeof window !== "undefined") {
      // Check if auto rotation is enabled
      const autoRotationEnabled = localStorage.getItem("autoColorRotationEnabled") === "true";
      
      if (autoRotationEnabled) {
        // Use auto rotation (will be handled by initialization)
        // For now, return the last theme or default
        const lastTheme = localStorage.getItem("autoColorLastTheme") as ColorTheme | null;
        if (lastTheme && lastTheme in colorThemes) {
          return lastTheme;
        }
      } else {
        // Manual theme selection
        const stored = localStorage.getItem("colorTheme") as ColorTheme | null;
        if (stored && stored in colorThemes) {
          return stored;
        }
      }
    }
    return "cyan"; // Default theme
  });

  useEffect(() => {
    const root = document.documentElement;
    const theme = colorThemes[colorTheme];

    // Update CSS custom properties
    root.style.setProperty("--primary", theme.primaryHsl);
    root.style.setProperty("--accent", theme.primaryHsl);
    root.style.setProperty("--ring", theme.primaryHsl);
    root.style.setProperty("--glow-primary", theme.glow);
    root.style.setProperty("--sidebar-primary", theme.primaryHsl);
    root.style.setProperty("--sidebar-ring", theme.primaryHsl);

    // Update gradient
    const hue = theme.primaryHsl.split(" ")[0];
    root.style.setProperty("--gradient-primary", `linear-gradient(135deg, hsl(${hue} 72% 56%), hsl(${parseInt(hue) + 16} 80% 45%))`);

    // Save to localStorage (only if auto rotation is disabled)
    if (typeof window !== "undefined" && !isAutoColorRotationEnabled()) {
      localStorage.setItem("colorTheme", colorTheme);
    }
  }, [colorTheme]);

  return { colorTheme, setColorTheme, colorThemes };
};

