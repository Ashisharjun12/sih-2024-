"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Upload, FileText, Link, Copy } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function PDFTestPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFileId, setUploadedFileId] = useState<string>("");
  const [fileUrl, setFileUrl] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    console.log("File selected:", file?.name);
    
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
      toast({
        title: "File selected",
        description: `Selected: ${file.name}`,
      });
    } else {
      toast({
        title: "Invalid file type",
        description: "Please select a PDF file",
        variant: "destructive",
      });
      setSelectedFile(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please select a PDF file first",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsUploading(true);
      console.log("Starting upload process...");

      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await fetch('/api/pdf/upload', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      console.log("Upload response:", data);

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      setUploadedFileId(data.fileId);
      
      // Get the view URL immediately after upload
      const viewResponse = await fetch(`/api/pdf/${data.fileId}`);
      const viewData = await viewResponse.json();
      console.log("View URL generated:", viewData);

      setFileUrl(viewData.url);
      
      toast({
        title: "Success",
        description: "PDF uploaded successfully. Click 'Show URL' to view the link.",
      });

    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to upload PDF",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(fileUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: "URL Copied",
        description: "PDF URL copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Failed to copy URL to clipboard",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container max-w-2xl py-10">
      <Card>
        <CardHeader>
          <CardTitle>PDF Upload Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* File Selection */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">1. Select PDF File</h3>
            <div className="flex items-center gap-4">
              <Input
                type="file"
                accept=".pdf"
                onChange={handleFileSelect}
                className="flex-1"
              />
            </div>
          </div>

          {/* Upload Button */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">2. Upload PDF</h3>
            <Button
              onClick={handleUpload}
              disabled={!selectedFile || isUploading}
              className="w-full"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload PDF
                </>
              )}
            </Button>
          </div>

          {/* URL Dialog */}
          {uploadedFileId && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">3. PDF URL</h3>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="w-full" variant="outline">
                    <Link className="w-4 h-4 mr-2" />
                    Show URL
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>PDF URL</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="p-4 bg-muted rounded-lg break-all">
                      {fileUrl}
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        onClick={handleCopyUrl}
                      >
                        {copied ? (
                          "Copied!"
                        ) : (
                          <>
                            <Copy className="w-4 h-4 mr-2" />
                            Copy URL
                          </>
                        )}
                      </Button>
                      <Button
                        onClick={() => window.open(fileUrl, '_blank')}
                      >
                        View PDF
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          )}

          {/* Debug Information */}
          <div className="mt-8 p-4 bg-muted rounded-lg">
            <h4 className="font-medium mb-2">Debug Info:</h4>
            <pre className="text-sm whitespace-pre-wrap">
              {JSON.stringify({
                selectedFile: selectedFile ? {
                  name: selectedFile.name,
                  type: selectedFile.type,
                  size: selectedFile.size
                } : null,
                uploadedFileId,
                fileUrl
              }, null, 2)}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 