import { useLayout, layoutPresets, type LayoutPreset } from "@/hooks/useLayout";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Sparkles, Layers, Minimize2, Square, LayoutGrid, Crown } from "lucide-react";

const layoutIcons = {
  default: Layers,
  modern: Sparkles,
  minimal: Minimize2,
  card: Square,
  grid: LayoutGrid,
  elegant: Crown,
};

export const LayoutManager = () => {
  const { layout, setLayout } = useLayout();
  const { toast } = useToast();

  const handleLayoutChange = (preset: LayoutPreset) => {
    setLayout(preset);
    toast({
      title: "Layout updated",
      description: `Changed to ${layoutPresets[preset].name} layout`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="mb-6">
          <h3 className="font-mono font-semibold text-lg mb-2">Website Layout</h3>
          <p className="text-sm text-muted-foreground">
            Choose a layout style for your website. This will affect card styles, spacing, shadows, and animations across all pages.
          </p>
        </div>

        <div className="space-y-4">
          <Label>Select Layout Preset</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(Object.keys(layoutPresets) as LayoutPreset[]).map((presetKey) => {
              const preset = layoutPresets[presetKey];
              const isSelected = layout === presetKey;
              const Icon = layoutIcons[presetKey];

              return (
                <button
                  key={presetKey}
                  onClick={() => handleLayoutChange(presetKey)}
                  className={`
                    relative p-5 rounded-xl border-2 transition-all duration-200 text-left
                    ${isSelected 
                      ? "border-primary bg-primary/10 scale-105 shadow-lg" 
                      : "border-border hover:border-primary/50 hover:bg-secondary/50"
                    }
                  `}
                >
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`
                          w-10 h-10 rounded-lg flex items-center justify-center
                          ${isSelected ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}
                        `}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-base">{preset.name}</h4>
                        <p className="text-xs text-muted-foreground">{preset.description}</p>
                      </div>
                    </div>

                    {/* Preview badges */}
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="text-xs px-2 py-1 rounded-full bg-secondary/50 text-muted-foreground">
                        {preset.cardStyle}
                      </span>
                      <span className="text-xs px-2 py-1 rounded-full bg-secondary/50 text-muted-foreground">
                        {preset.spacing}
                      </span>
                      {preset.shadows && (
                        <span className="text-xs px-2 py-1 rounded-full bg-secondary/50 text-muted-foreground">
                          shadows
                        </span>
                      )}
                      {preset.borders && (
                        <span className="text-xs px-2 py-1 rounded-full bg-secondary/50 text-muted-foreground">
                          borders
                        </span>
                      )}
                    </div>

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
              <strong>Current layout:</strong> {layoutPresets[layout].name}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              The layout change is applied immediately across all pages.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};


