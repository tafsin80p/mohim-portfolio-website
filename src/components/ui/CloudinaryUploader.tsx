import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Upload, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface CloudinaryUploaderProps {
  value?: string;
  onChange: (url: string) => void;
  cloudName?: string;
  apiKey?: string;
  apiSecret?: string;
  uploadPreset?: string;
  imagesOnly?: boolean;
  multiple?: boolean;
  className?: string;
  label?: string;
  showPreview?: boolean;
  crop?: string; // For future use with Cloudinary transformations
}

declare global {
  interface Window {
    cloudinary: any;
  }
}

// Helper function to generate SHA-1 hash (required for Cloudinary signature)
async function sha1Hash(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-1", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
  return hashHex;
}

// Generate Cloudinary signature for signed uploads
// Cloudinary signature format: SHA1(timestamp=<timestamp>&<api_secret>)
async function generateSignature(params: Record<string, string>, apiSecret: string): Promise<string> {
  // Convert all values to strings and sort parameters by key (alphabetically)
  const sortedKeys = Object.keys(params).sort();
  const sortedParams = sortedKeys
    .map(key => `${key}=${params[key]}`)
    .join("&");
  
  // Append API secret directly (no & separator before secret)
  const stringToSign = sortedParams + apiSecret;
  
  // Generate SHA-1 hash and return as hex string
  const signature = await sha1Hash(stringToSign);
  return signature;
}

export const CloudinaryUploader = ({
  value,
  onChange,
  cloudName,
  apiKey,
  apiSecret,
  uploadPreset,
  imagesOnly = true,
  multiple = false,
  className,
  label = "Upload Image",
  showPreview = true,
}: CloudinaryUploaderProps) => {
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const widgetRef = useRef<any>(null);

  // Get configuration from props or env
  const cloudNameValue = cloudName || import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "";
  const apiKeyValue = apiKey || import.meta.env.VITE_CLOUDINARY_API_KEY || "";
  const apiSecretValue = apiSecret || import.meta.env.VITE_CLOUDINARY_API_SECRET || "";
  const uploadPresetValue = uploadPreset || import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "";

  useEffect(() => {
    // Load Cloudinary Upload Widget script
    if (typeof window !== "undefined" && !window.cloudinary) {
      const script = document.createElement("script");
      script.src = "https://upload-widget.cloudinary.com/global/all.js";
      script.async = true;
      script.onload = () => {
        console.log("Cloudinary Upload Widget loaded");
      };
      document.body.appendChild(script);
    }
  }, []);

  const handleRemove = () => {
    onChange("");
    setError(null);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (imagesOnly) {
      const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp", "image/svg+xml"];
      if (!validTypes.includes(file.type)) {
        setError("Please upload a valid image file (JPEG, PNG, GIF, WebP, or SVG)");
        return;
      }
    }

    if (!cloudNameValue) {
      setError("Cloudinary not configured. Please set VITE_CLOUDINARY_CLOUD_NAME in your .env file.");
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("cloud_name", cloudNameValue);

      // Use signed upload if API key and secret are provided
      if (apiKeyValue && apiSecretValue) {
        // Generate timestamp immediately before upload (must be within 1 hour)
        const timestamp = Math.round(new Date().getTime() / 1000);
        
        // Build parameters for signature (only timestamp for basic upload)
        const params: Record<string, string | number> = {
          timestamp: timestamp,
        };

        // Generate signature synchronously right before upload
        const signature = await generateSignature(params, apiSecretValue);
        
        // Append authentication parameters
        formData.append("api_key", apiKeyValue);
        formData.append("timestamp", timestamp.toString());
        formData.append("signature", signature);
      } else if (uploadPresetValue) {
        // Use unsigned upload preset if available
        formData.append("upload_preset", uploadPresetValue);
      } else {
        throw new Error("Either API key/secret or upload preset must be configured");
      }

      // Upload immediately after generating signature to prevent stale timestamp
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudNameValue}/${imagesOnly ? "image" : "video"}/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || "Upload failed");
      }

      const data = await response.json();
      onChange(data.secure_url);
      setError(null);
    } catch (err) {
      console.error("Cloudinary upload error:", err);
      setError(err instanceof Error ? err.message : "Failed to upload file. Please try again.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const openCloudinaryWidget = () => {
    if (!window.cloudinary) {
      setError("Cloudinary Upload Widget not loaded. Please refresh the page.");
      return;
    }

    if (!cloudNameValue) {
      setError("Cloudinary not configured. Please set VITE_CLOUDINARY_CLOUD_NAME in your .env file.");
      return;
    }

    setError(null);

    const options: any = {
      cloudName: cloudNameValue,
      sources: ["local", "url", "camera"],
      multiple: multiple,
      maxFiles: multiple ? 10 : 1,
      ...(imagesOnly && {
        resourceType: "image" as const,
        clientAllowedFormats: ["jpg", "jpeg", "png", "gif", "webp", "svg"],
      }),
      ...(!imagesOnly && {
        resourceType: "auto" as const,
      }),
      showAdvancedOptions: false,
      cropping: false,
      folder: "portfolio", // Optional: organize uploads in a folder
    };

    // Use upload preset if available, otherwise use API key/secret
    if (uploadPresetValue) {
      options.uploadPreset = uploadPresetValue;
    } else if (apiKeyValue && apiSecretValue) {
      // For widget with API key/secret, we still need to use preset or server-side signing
      // Widget doesn't support client-side API secret (security reason)
      // So we'll use unsigned preset or fallback to direct upload
      setError("Upload widget requires an upload preset. Use file input for API key/secret authentication.");
      return;
    } else {
      setError("Cloudinary not configured. Please set VITE_CLOUDINARY_API_KEY and VITE_CLOUDINARY_API_SECRET, or VITE_CLOUDINARY_UPLOAD_PRESET in your .env file.");
      return;
    }

    widgetRef.current = window.cloudinary.createUploadWidget(
      options,
      (error: any, result: any) => {
        if (error) {
          console.error("Cloudinary widget error:", error);
          setError("Upload failed. Please try again.");
          setUploading(false);
          return;
        }

        if (result && result.event === "success") {
          onChange(result.info.secure_url);
          setError(null);
          setUploading(false);
        } else if (result && result.event === "queues-start") {
          setUploading(true);
        } else if (result && result.event === "close") {
          setUploading(false);
        }
      }
    );

    widgetRef.current.open();
  };

  const isConfigured = cloudNameValue && (uploadPresetValue || (apiKeyValue && apiSecretValue));

  if (!isConfigured) {
    return (
      <div className={cn("space-y-2", className)}>
        {label && <label className="text-sm font-medium">{label}</label>}
        <div className="p-4 border border-destructive/50 rounded-lg bg-destructive/10">
          <p className="text-sm text-destructive">
            Cloudinary not configured. Please set VITE_CLOUDINARY_CLOUD_NAME and either (VITE_CLOUDINARY_API_KEY + VITE_CLOUDINARY_API_SECRET) or VITE_CLOUDINARY_UPLOAD_PRESET in your .env file.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-2", className)}>
      {label && <label className="text-sm font-medium">{label}</label>}
      
      <div className="space-y-2">
        <div className="flex gap-2 items-center">
          <div className="flex-1 flex gap-2">
            {uploadPresetValue && (
              <Button
                type="button"
                variant="outline"
                onClick={openCloudinaryWidget}
                disabled={uploading}
                className="gap-2"
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    {multiple ? "Upload Files" : "Upload File"}
                  </>
                )}
              </Button>
            )}
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              Choose File
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept={imagesOnly ? "image/*" : "*/*"}
              multiple={multiple}
              onChange={handleFileSelect}
            />
          </div>
          
          {value && (
            <Button
              type="button"
              variant="outline"
              onClick={handleRemove}
              className="gap-2"
            >
              <X className="w-4 h-4" />
              Remove
            </Button>
          )}
        </div>

        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}

        {value && showPreview && imagesOnly && (
          <div className="mt-4">
            <p className="text-sm font-medium mb-2">Preview:</p>
            <div className="w-48 h-48 rounded-xl overflow-hidden border border-border bg-muted">
              <img
                src={value}
                alt="Preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = "https://via.placeholder.com/400?text=Image+Error";
                }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2 break-all">{value}</p>
          </div>
        )}

        {value && !showPreview && (
          <div className="mt-2">
            <p className="text-xs text-muted-foreground break-all">{value}</p>
          </div>
        )}
      </div>
    </div>
  );
};
