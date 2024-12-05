"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Upload, Loader2 } from "lucide-react";

interface FileUploadProps {
  label: string;
  fileType: string;
  accept?: string;
  onFileChange: (fileData: { file: File | null; uploadData?: any }) => void;
  isUploading?: boolean;
  error?: string;
}

export function FileUpload({
  label,
  fileType,
  accept = "image/*",
  onFileChange,
  isUploading = false,
  error,
}: FileUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      onFileChange({ file: null });
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      return;
    }

    // Create preview if it's an image
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }

    // Pass file data to parent
    onFileChange({ 
      file,
      uploadData: {
        fileType,
        originalName: file.name
      }
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">{label}</label>
      </div>

      <div className="grid gap-4">
        <div className="flex items-center justify-center w-full">
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              {isUploading ? (
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              ) : (
                <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
              )}
              <p className="text-sm text-muted-foreground">
                {isUploading ? "Uploading..." : "Click to upload or drag and drop"}
              </p>
            </div>
            <Input
              type="file"
              className="hidden"
              accept={accept}
              onChange={handleChange}
              disabled={isUploading}
            />
          </label>
        </div>

        {/* Preview */}
        {preview && (
          <div className="relative group">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-24 object-cover rounded-lg"
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => {
                setPreview(null);
                onFileChange({ file: null });
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {error && (
        <p className="text-sm text-destructive mt-2">{error}</p>
      )}
    </div>
  );
} 