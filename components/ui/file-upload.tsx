"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Upload, FileCheck, Loader2, Image as ImageIcon } from "lucide-react";
import { ProgressBar } from "@/components/ui/progress-bar";
import Image from "next/image";

interface FileUploadProps {
  label: string;
  fileType: string;
  accept?: string;
  maxSize?: number;
  onFileChange: (fileData: { file: File | null; uploadData?: any }) => void;
  error?: string;
}

export function FileUpload({
  label,
  fileType,
  accept = "image/*",
  maxSize = 5,
  onFileChange,
  error,
}: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [fileError, setFileError] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    setFileError("");
    setUploadProgress(0);

    if (selectedFile) {
      // Validate file type
      if (!selectedFile.type.startsWith('image/')) {
        setFileError("Please upload an image file");
        return;
      }

      if (selectedFile.size > maxSize * 1024 * 1024) {
        setFileError(`File size must be less than ${maxSize}MB`);
        return;
      }

      setFile(selectedFile);
      // Create preview URL
      const previewUrl = URL.createObjectURL(selectedFile);
      setPreview(previewUrl);
      setIsUploading(true);

      try {
        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('fileType', fileType);

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Upload failed');
        }

        const uploadData = await response.json();
        console.log("Upload successful:", uploadData);
        onFileChange({ file: selectedFile, uploadData });
        setIsUploading(false);
        setUploadProgress(100);
      } catch (error) {
        console.error('Upload error:', error);
        setFileError("Upload failed. Please try again.");
        setFile(null);
        setPreview("");
        setIsUploading(false);
        setUploadProgress(0);
      }
    }
  };

  const removeFile = () => {
    setFile(null);
    setPreview("");
    onFileChange({ file: null });
    setUploadProgress(0);
    if (preview) {
      URL.revokeObjectURL(preview);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        {!file ? (
          <div className="w-full">
            <label
              htmlFor={`file-${label}`}
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <ImageIcon className="h-6 w-6 mb-2 text-muted-foreground" />
                <p className="mb-2 text-sm text-muted-foreground">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-muted-foreground">
                  Image files only (Max {maxSize}MB)
                </p>
              </div>
              <Input
                id={`file-${label}`}
                type="file"
                className="hidden"
                accept={accept}
                onChange={handleFileChange}
              />
            </label>
          </div>
        ) : (
          <div className="flex flex-col w-full">
            <div className="flex items-center gap-2 p-2 border rounded-lg w-full">
              {preview && (
                <div className="relative w-16 h-16 rounded-md overflow-hidden">
                  <Image
                    src={preview}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <span className="text-sm truncate flex-1">{file.name}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={removeFile}
                disabled={isUploading}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            {(isUploading || uploadProgress > 0) && (
              <ProgressBar progress={uploadProgress} />
            )}
          </div>
        )}
      </div>
      {(error || fileError) && (
        <p className="text-sm text-destructive">{error || fileError}</p>
      )}
    </div>
  );
} 