import { useEffect } from "react";
import { useLayout } from "@/hooks/useLayout";

/**
 * Component to initialize layout settings on app mount
 */
export const LayoutInitializer = () => {
  const { layout } = useLayout();
  
  // The useLayout hook already handles applying the layout
  // This component just ensures it's initialized
  useEffect(() => {
    // Layout is applied via the hook's useEffect
  }, [layout]);

  return null;
};



