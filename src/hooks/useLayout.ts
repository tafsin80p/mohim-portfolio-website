import { useEffect, useState } from "react";

export type LayoutPreset = "default" | "modern" | "minimal" | "card" | "grid" | "elegant";

export interface LayoutConfig {
  name: string;
  description: string;
  cardStyle: "rounded" | "sharp" | "elevated" | "flat" | "glass";
  spacing: "compact" | "comfortable" | "spacious";
  shadows: boolean;
  borders: boolean;
  animations: "subtle" | "moderate" | "bold";
}

export const layoutPresets: Record<LayoutPreset, LayoutConfig> = {
  default: {
    name: "Default",
    description: "Classic layout with balanced spacing",
    cardStyle: "rounded",
    spacing: "comfortable",
    shadows: true,
    borders: true,
    animations: "moderate",
  },
  modern: {
    name: "Modern",
    description: "Clean lines with glass morphism effects",
    cardStyle: "glass",
    spacing: "spacious",
    shadows: true,
    borders: false,
    animations: "subtle",
  },
  minimal: {
    name: "Minimal",
    description: "Ultra-clean with maximum whitespace",
    cardStyle: "flat",
    spacing: "spacious",
    shadows: false,
    borders: true,
    animations: "subtle",
  },
  card: {
    name: "Card",
    description: "Elevated cards with soft shadows",
    cardStyle: "elevated",
    spacing: "comfortable",
    shadows: true,
    borders: false,
    animations: "moderate",
  },
  grid: {
    name: "Grid",
    description: "Tight grid layout for content density",
    cardStyle: "sharp",
    spacing: "compact",
    shadows: false,
    borders: true,
    animations: "bold",
  },
  elegant: {
    name: "Elegant",
    description: "Sophisticated design with refined details",
    cardStyle: "rounded",
    spacing: "spacious",
    shadows: true,
    borders: true,
    animations: "subtle",
  },
};

export const useLayout = () => {
  const [layout, setLayout] = useState<LayoutPreset>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("layoutPreset") as LayoutPreset | null;
      if (stored && stored in layoutPresets) {
        return stored;
      }
    }
    return "default";
  });

  useEffect(() => {
    const root = document.documentElement;
    const config = layoutPresets[layout];

    // Apply layout CSS variables
    root.setAttribute("data-layout", layout);
    root.setAttribute("data-card-style", config.cardStyle);
    root.setAttribute("data-spacing", config.spacing);
    root.setAttribute("data-shadows", config.shadows.toString());
    root.setAttribute("data-borders", config.borders.toString());
    root.setAttribute("data-animations", config.animations);

    // Save to localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("layoutPreset", layout);
    }
  }, [layout]);

  return { layout, setLayout, layoutPresets };
};



