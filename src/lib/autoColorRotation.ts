import { ColorTheme, colorThemes } from "@/hooks/useColorTheme";

/**
 * Automatically rotates color theme on each visit
 * Returns the color theme to use for this visit
 */
export const getAutoRotatedColorTheme = (): ColorTheme => {
  if (typeof window === "undefined") {
    return "cyan"; // Default for SSR
  }

  // Get all available color theme keys
  const themeKeys = Object.keys(colorThemes) as ColorTheme[];
  const totalThemes = themeKeys.length;

  // Get or initialize visit count
  const visitCountKey = "autoColorVisitCount";
  const lastThemeKey = "autoColorLastTheme";

  let visitCount = parseInt(localStorage.getItem(visitCountKey) || "0", 10);
  const lastTheme = localStorage.getItem(lastThemeKey) as ColorTheme | null;

  // Increment visit count
  visitCount += 1;

  // If no last theme or invalid, start with first theme
  if (!lastTheme || !themeKeys.includes(lastTheme)) {
    const firstTheme = themeKeys[0];
    localStorage.setItem(visitCountKey, visitCount.toString());
    localStorage.setItem(lastThemeKey, firstTheme);
    return firstTheme;
  }

  // Find current theme index
  const currentIndex = themeKeys.indexOf(lastTheme);
  
  // Cycle to next theme (wrap around if at end)
  const nextIndex = (currentIndex + 1) % totalThemes;
  const nextTheme = themeKeys[nextIndex];

  // Save new visit count and theme
  localStorage.setItem(visitCountKey, visitCount.toString());
  localStorage.setItem(lastThemeKey, nextTheme);

  return nextTheme;
};

/**
 * Check if auto color rotation is enabled
 */
export const isAutoColorRotationEnabled = (): boolean => {
  if (typeof window === "undefined") return false;
  return localStorage.getItem("autoColorRotationEnabled") === "true";
};

/**
 * Enable or disable auto color rotation
 */
export const setAutoColorRotationEnabled = (enabled: boolean): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem("autoColorRotationEnabled", enabled.toString());
};

/**
 * Get the visit count
 */
export const getVisitCount = (): number => {
  if (typeof window === "undefined") return 0;
  return parseInt(localStorage.getItem("autoColorVisitCount") || "0", 10);
};

/**
 * Reset auto color rotation (reset visit count)
 */
export const resetAutoColorRotation = (): void => {
  if (typeof window === "undefined") return;
  localStorage.removeItem("autoColorVisitCount");
  localStorage.removeItem("autoColorLastTheme");
};


