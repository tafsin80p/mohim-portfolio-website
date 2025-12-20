import { useColorTheme, colorThemes, type ColorTheme } from "@/hooks/useColorTheme";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { 
  isAutoColorRotationEnabled, 
  setAutoColorRotationEnabled, 
  getVisitCount,
  resetAutoColorRotation,
  getAutoRotatedColorTheme
} from "@/lib/autoColorRotation";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export const ColorThemeManager = () => {
  const { colorTheme, setColorTheme } = useColorTheme();
  const { toast } = useToast();
  const [autoRotationEnabled, setAutoRotationEnabled] = useState(isAutoColorRotationEnabled());
  const [visitCount, setVisitCount] = useState(getVisitCount());

  useEffect(() => {
    // Update visit count display
    setVisitCount(getVisitCount());
  }, [colorTheme]);

  const handleColorChange = (theme: ColorTheme) => {
    // Disable auto rotation when manually selecting a theme
    if (autoRotationEnabled) {
      setAutoColorRotationEnabled(false);
      setAutoRotationEnabled(false);
    }
    setColorTheme(theme);
    toast({
      title: "Color theme updated",
      description: `Changed to ${colorThemes[theme].name} theme`,
    });
  };

  const handleAutoRotationToggle = (enabled: boolean) => {
    setAutoRotationEnabled(enabled);
    setAutoColorRotationEnabled(enabled);
    
    if (enabled) {
      // Apply rotated theme immediately
      const rotatedTheme = getAutoRotatedColorTheme();
      setColorTheme(rotatedTheme);
      toast({
        title: "Auto rotation enabled",
        description: `Theme will change on each visit. Current visit: ${visitCount + 1}`,
      });
    } else {
      toast({
        title: "Auto rotation disabled",
        description: "Current theme will remain fixed",
      });
    }
  };

  const handleResetRotation = () => {
    resetAutoColorRotation();
    setVisitCount(0);
    toast({
      title: "Rotation reset",
      description: "Visit count has been reset. Next visit will start from the first theme.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Auto Rotation Settings */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-mono font-semibold text-lg mb-2">Dynamic Color Rotation</h3>
            <p className="text-sm text-muted-foreground">
              Enable to automatically change the color theme each time someone visits your website. 
              Visitors will see a different color on each visit.
            </p>
          </div>
          <Switch
            checked={autoRotationEnabled}
            onCheckedChange={handleAutoRotationToggle}
          />
        </div>
        {autoRotationEnabled && (
          <div className="mt-4 p-4 bg-muted/50 rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Current Visit Count</p>
                <p className="text-xs text-muted-foreground">
                  Next visit will show theme #{((visitCount) % Object.keys(colorThemes).length) + 1}
                </p>
              </div>
              <span className="text-2xl font-bold text-primary">{visitCount}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleResetRotation}
              className="w-full"
            >
              Reset Visit Count
            </Button>
          </div>
        )}
      </div>

      {/* Manual Theme Selection */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="mb-6">
          <h3 className="font-mono font-semibold text-lg mb-2">Color Theme</h3>
          <p className="text-sm text-muted-foreground">
            {autoRotationEnabled 
              ? "Auto rotation is enabled. You can still preview themes below, but the site will use rotated themes for visitors."
              : "Choose a color theme for your website. This will change the primary color, accents, and highlights across all pages."
            }
          </p>
        </div>

        <div className="space-y-4">
          <Label>Select Color Theme</Label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {(Object.keys(colorThemes) as ColorTheme[]).map((themeKey) => {
              const theme = colorThemes[themeKey];
              const isSelected = colorTheme === themeKey;

              return (
                <button
                  key={themeKey}
                  onClick={() => handleColorChange(themeKey)}
                  className={`
                    relative p-4 rounded-xl border-2 transition-all duration-200
                    ${isSelected 
                      ? "border-primary bg-primary/10 scale-105" 
                      : "border-border hover:border-primary/50 hover:bg-secondary/50"
                    }
                  `}
                  style={{
                    borderColor: isSelected ? theme.primary : undefined,
                  }}
                >
                  <div className="flex flex-col items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-full shadow-lg"
                      style={{
                        backgroundColor: theme.primary,
                        boxShadow: isSelected ? `0 0 20px ${theme.primary}80` : undefined,
                      }}
                    />
                    <span className="text-sm font-medium">{theme.name}</span>
                    {isSelected && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                        <svg
                          className="w-4 h-4 text-primary-foreground"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-6 p-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">
              <strong>Current theme:</strong> {colorThemes[colorTheme].name}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              The color change is applied immediately and saved to your browser.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

