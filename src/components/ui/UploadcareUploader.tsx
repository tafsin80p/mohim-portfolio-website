/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { FileUploaderRegular } from "@uploadcare/react-uploader";
import "@uploadcare/react-uploader/core.css";

interface UploadcareUploaderProps {
  value?: string;
  onChange: (url: string) => void;
  publicKey?: string;
  imagesOnly?: boolean;
  multiple?: boolean;
  crop?: string;
  className?: string;
  label?: string;
  showPreview?: boolean;
}

export const UploadcareUploader = ({
  value,
  onChange,
  publicKey,
  imagesOnly = true,
  multiple = false,
  crop,
  className,
  label = "Upload Image",
  showPreview = true,
}: UploadcareUploaderProps) => {
  const [error, setError] = useState<string | null>(null);

  // Get API key from props, global variable, or env
  const apiKey = publicKey || 
    (typeof window !== "undefined" && (window as any).UPLOADCARE_PUBLIC_KEY) || 
    import.meta.env.VITE_UPLOADCARE_PUBLIC_KEY || 
    "";

  const handleRemove = () => {
    onChange("");
    setError(null);
  };

  // Using 'any' here because Uploadcare's FileInfo / FileGroup types are complex and
  // we only need to safely extract a CDN URL from various possible shapes.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const extractCdnUrlFromFile = (file: any): string | null => {
    if (!file) return null;

    // If it's already a string (CDN URL or UUID)
    if (typeof file === "string") {
      // Bare UUID -> construct CDN URL
      if (/^[0-9a-f-]{36}$/i.test(file)) {
        return `https://ucarecdn.com/${file}/`;
      }
      // Assume it's already a URL
      return file;
    }

    if (typeof file === "object") {
      // Sometimes Uploadcare wraps file info inside "file" or "fileInfo"
      const candidate =
        file.cdnUrl ||
        file.cdn_url ||
        file.url ||
        file.cdn ||
        (file.uuid && `https://ucarecdn.com/${file.uuid}/`) ||
        (file.fileInfo &&
          (file.fileInfo.cdnUrl ||
            file.fileInfo.cdn_url ||
            file.fileInfo.url)) ||
        (file.file &&
          (file.file.cdnUrl ||
            file.file.cdn_url ||
            file.file.url ||
            (file.file.uuid && `https://ucarecdn.com/${file.file.uuid}/`)));

      if (candidate) return candidate as string;
    }

    return null;
  };

  // Using 'any' here for the same reason: Uploadcare passes different payload shapes
  // depending on single vs multiple uploads and internal implementation.
  const handleFileUpload = async (payload: any) => {
    console.log("Uploadcare onChange payload:", payload);
    try {
      let firstFile: any = null;

      // Newer Uploadcare React Uploader passes a file group-like object
      if (payload && typeof payload === "object") {
        // Case 1: payload has "files" as a function returning a Promise
        if (typeof payload.files === "function") {
          const fileList = await payload.files();
          if (Array.isArray(fileList) && fileList.length > 0) {
            firstFile = fileList[0];
          }
        }
        // Case 2: payload has "files" array directly
        else if (Array.isArray(payload.files) && payload.files.length > 0) {
          firstFile = payload.files[0];
        }
        // Case 3: payload itself is a single file object
        else {
          firstFile = payload;
        }
      } else {
        // Fallback: old behaviour where we expected an array
        if (Array.isArray(payload) && payload.length > 0) {
          firstFile = payload[0];
        }
      }

      console.log("Uploadcare first file candidate:", firstFile);

      const cdnUrl = extractCdnUrlFromFile(firstFile || payload);

      if (cdnUrl) {
        onChange(cdnUrl);
        setError(null);
      } else {
        setError("Failed to get uploaded image URL. Please try again.");
        console.error("Uploadcare unknown payload/file shape:", payload);
      }
    } catch (err) {
      console.error("Uploadcare file processing error:", err);
      setError("Failed to process uploaded file. Please try again.");
    }
  };

  if (!apiKey || apiKey === 'your_public_key') {
    return (
      <div className={cn("space-y-2", className)}>
        {label && <label className="text-sm font-medium">{label}</label>}
        <div className="p-4 border border-destructive/50 rounded-lg bg-destructive/10">
          <p className="text-sm text-destructive">
            Uploadcare public key not configured. Please set UPLOADCARE_PUBLIC_KEY in index.html or add VITE_UPLOADCARE_PUBLIC_KEY to your .env file.
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
            <FileUploaderRegular
              pubkey={apiKey}
              sourceList="local, url, camera, dropbox, gdrive, instagram, facebook, vk, evernote, box, onedrive, gphotos"
              maxLocalFileSizeBytes={10000000}
              multiple={multiple}
              imgOnly={imagesOnly}
              onChange={handleFileUpload}
              className="uploadcare-button"
              /* @ts-expect-error crop is supported by Uploadcare but not in the current type defs */
              crop={crop}
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
