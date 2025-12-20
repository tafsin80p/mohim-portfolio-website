import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { upload } from "@imagekit/react";

interface ImageKitUploaderProps {
  value?: string;
  onChange: (url: string) => void;
  imagesOnly?: boolean;
  className?: string;
  label?: string;
  showPreview?: boolean;
  folder?: string;
}

export const ImageKitUploader = ({
  value,
  onChange,
  imagesOnly = true,
  className,
  label = "Upload Image",
  showPreview = true,
  folder = "/",
}: ImageKitUploaderProps) => {
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const urlEndpoint = import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT || "";
  const publicKey = import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY || "";
  const privateKey = import.meta.env.VITE_IMAGEKIT_PRIVATE_KEY || "";
  const authenticationEndpoint = import.meta.env.VITE_IMAGEKIT_AUTHENTICATION_ENDPOINT || "";

  // Generate authentication parameters client-side using HMAC-SHA1
  const generateAuthParams = async (): Promise<{ token: string; signature: string; expire: number }> => {
    const token = crypto.randomUUID();
    // Expire should be less than 1 hour (3600 seconds) into the future
    // Using 1800 seconds (30 minutes) to be well within the limit
    const currentTime = Math.floor(Date.now() / 1000);
    const expire = currentTime + 1800; // 30 minutes from now
    
    // Generate HMAC-SHA1 signature
    const message = token + expire;
    const encoder = new TextEncoder();
    const keyData = encoder.encode(privateKey);
    const messageData = encoder.encode(message);
    
    try {
      const cryptoKey = await crypto.subtle.importKey(
        "raw",
        keyData,
        { name: "HMAC", hash: "SHA-1" },
        false,
        ["sign"]
      );
      
      const signature = await crypto.subtle.sign("HMAC", cryptoKey, messageData);
      // Convert ArrayBuffer to base64
      const signatureArray = new Uint8Array(signature);
      const signatureBase64 = btoa(
        String.fromCharCode.apply(null, Array.from(signatureArray))
      );
      
      console.log("Generated auth params:", {
        token: token.substring(0, 10) + "...",
        expire,
        expireDate: new Date(expire * 1000).toISOString(),
        currentTime: Math.floor(Date.now() / 1000),
        timeUntilExpire: expire - Math.floor(Date.now() / 1000),
        signatureLength: signatureBase64.length,
      });
      
      return { token, signature: signatureBase64, expire };
    } catch (err) {
      console.error("Error generating signature:", err);
      throw new Error("Failed to generate authentication signature");
    }
  };

  const handleRemove = () => {
    onChange("");
    setError(null);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (imagesOnly) {
      const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
      if (!validTypes.includes(file.type)) {
        setError("Please upload a valid image file (JPEG, PNG, GIF, or WebP)");
        return;
      }
    }

    if (!urlEndpoint || !publicKey) {
      setError("ImageKit not configured. Please set VITE_IMAGEKIT_URL_ENDPOINT and VITE_IMAGEKIT_PUBLIC_KEY in your .env file.");
      return;
    }

    setUploading(true);
    setError(null);

    try {
      // Get authentication parameters
      let authParams: any = {};
      
      if (authenticationEndpoint) {
        // Use server-side authentication endpoint if provided
        try {
          const authResponse = await fetch(authenticationEndpoint);
          if (!authResponse.ok) {
            throw new Error(`Auth endpoint returned ${authResponse.status}`);
          }
          authParams = await authResponse.json();
        } catch (err) {
          console.warn("Failed to fetch auth params from endpoint, generating client-side:", err);
          // Fallback to client-side generation if endpoint fails
          if (privateKey) {
            authParams = await generateAuthParams();
          } else {
            setError("Authentication failed. Please set up an authentication endpoint or provide VITE_IMAGEKIT_PRIVATE_KEY.");
            setUploading(false);
            return;
          }
        }
      } else if (privateKey) {
        // Generate authentication parameters client-side
        // Note: This exposes your private key in the client - use an authentication endpoint for production
        authParams = await generateAuthParams();
      } else {
        // Try without authentication (may work if unsigned uploads are enabled in ImageKit dashboard)
        console.warn("No authentication endpoint or private key provided. Attempting unsigned upload...");
      }

      console.log("Uploading with params:", {
        fileName: file.name,
        folder: folder,
        publicKey: publicKey.substring(0, 10) + "...",
        urlEndpoint: urlEndpoint,
        hasAuth: !!authenticationEndpoint,
        authParams: authParams ? { token: authParams.token?.substring(0, 10) + "...", expire: authParams.expire, hasSignature: !!authParams.signature } : null,
      });

      // Build upload options
      const uploadOptions: any = {
        file,
        fileName: file.name,
        folder: folder,
        useUniqueFileName: true,
        publicKey: publicKey,
        urlEndpoint: urlEndpoint,
      };

      // Add authentication parameters if available
      if (authParams && authParams.token && authParams.signature && authParams.expire) {
        uploadOptions.token = String(authParams.token);
        uploadOptions.signature = String(authParams.signature);
        // Ensure expire is a number (Unix timestamp)
        uploadOptions.expire = Number(authParams.expire);
        
        // Verify expire is valid
        const now = Math.floor(Date.now() / 1000);
        const timeUntilExpire = uploadOptions.expire - now;
        if (timeUntilExpire >= 3600) {
          console.warn(`Expire time is ${timeUntilExpire} seconds in the future, which is >= 1 hour. This may cause an error.`);
        }
        console.log("Setting expire:", {
          expire: uploadOptions.expire,
          type: typeof uploadOptions.expire,
          timeUntilExpire: timeUntilExpire,
          isValid: timeUntilExpire > 0 && timeUntilExpire < 3600,
        });
      }

      console.log("Upload options (sanitized):", {
        ...uploadOptions,
        file: "[File object]",
        publicKey: publicKey.substring(0, 10) + "...",
        token: uploadOptions.token?.substring(0, 10) + "...",
        signature: uploadOptions.signature?.substring(0, 10) + "...",
      });

      let result;
      try {
        result = await upload(uploadOptions);
        console.log("Upload result:", result);
      } catch (uploadErr: any) {
        // Try to get more details from the error
        console.error("Upload function error:", uploadErr);
        if (uploadErr.response) {
          console.error("Error response:", await uploadErr.response.text());
        }
        throw uploadErr;
      }

      if (result && result.url) {
        onChange(result.url);
        setError(null);
      } else if (result && result.filePath) {
        // Sometimes ImageKit returns filePath instead of url
        const imageUrl = `${urlEndpoint}${result.filePath}`;
        onChange(imageUrl);
        setError(null);
      } else {
        console.error("Unexpected upload result:", result);
        setError("Upload successful but no URL returned. Result: " + JSON.stringify(result));
      }
    } catch (err: any) {
      console.error("ImageKit upload error:", err);
      console.error("Error details:", {
        message: err?.message,
        name: err?.name,
        stack: err?.stack,
        response: err?.response,
      });
      
      let errorMessage = "Failed to upload image. ";
      if (err?.message) {
        errorMessage += err.message;
      } else if (err?.response) {
        errorMessage += `Server returned: ${JSON.stringify(err.response)}`;
      } else {
        errorMessage += "Please check the browser console for details.";
      }
      
      setError(errorMessage);
    } finally {
      setUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  if (!urlEndpoint || !publicKey) {
    return (
      <div className={cn("space-y-2", className)}>
        {label && <label className="text-sm font-medium">{label}</label>}
        <div className="p-4 border border-destructive/50 rounded-lg bg-destructive/10">
          <p className="text-sm text-destructive">
            ImageKit not configured. Please set VITE_IMAGEKIT_URL_ENDPOINT and VITE_IMAGEKIT_PUBLIC_KEY in your .env file.
          </p>
        </div>
        {value && (
          <div className="mt-2">
            <Label className="text-xs text-muted-foreground">Or enter URL manually:</Label>
            <Input
              type="url"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="mt-1"
            />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={cn("space-y-2", className)}>
      {label && <label className="text-sm font-medium">{label}</label>}
      
      <div className="space-y-2">
        <div className="flex gap-2 items-center">
          <div className="flex-1">
            <input
              ref={fileInputRef}
              type="file"
              accept={imagesOnly ? "image/jpeg,image/jpg,image/png,image/gif,image/webp" : "*/*"}
              onChange={handleFileChange}
              className="hidden"
              disabled={uploading}
            />
            <Button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full gap-2"
              disabled={uploading}
            >
              <Upload className="w-4 h-4" />
              {uploading ? "Uploading..." : label || "Upload Image"}
            </Button>
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

        {uploading && (
          <p className="text-sm text-muted-foreground">Uploading...</p>
        )}

        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}

        {value && showPreview && (
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

        <div className="mt-2">
          <Label className="text-xs text-muted-foreground">Or enter URL manually:</Label>
          <Input
            type="url"
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="mt-1"
          />
        </div>
      </div>
    </div>
  );
};

