"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { FileText } from "lucide-react";

interface FileUpload {
  public_id: string;
  secure_url: string;
}

const CreateIPRPage = () => {
  const router = useRouter();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "",
    transactionHash: "",
  });

  const [documents, setDocuments] = useState<FileUpload[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTypeChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      type: value,
    }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;

    setIsUploading(true);
    const files = Array.from(e.target.files);

    try {
      // Upload files one by one
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`Failed to upload ${file.name}`);
        }

        const uploadedFile: FileUpload = await response.json();
        setDocuments((prev) => [...prev, uploadedFile]);
      }

      toast({
        title: "Success",
        description: "All documents uploaded successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to upload documents",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      if (e.target) {
        e.target.value = "";
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/startup/ipr", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          relatedDocuments: documents,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create IPR");
      }

      toast({
        title: "Success",
        description: "IPR filed successfully",
      });

      router.push("/startup/ipr");
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to file IPR",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormDisabled = isSubmitting || isUploading;

  return (
    <div className="container py-4 px-2 md:px-6 space-y-8">
      {/* Header Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-teal-500/10 via-cyan-500/5 to-transparent p-6 md:p-8">
        <div className="relative">
          <h1 className="text-2xl md:text-3xl font-bold">File New IPR</h1>
          <p className="text-sm md:text-base text-muted-foreground mt-2">
            Submit your intellectual property rights application
          </p>
        </div>
      </div>

      {/* Form Section */}
      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-gradient-to-br from-background to-background/80 rounded-xl border border-teal-100/50 p-6 md:p-8 space-y-8">
            {/* Title Input */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium flex items-center gap-2">
                <span className="text-teal-500">01.</span> Title
              </Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                placeholder="Enter IPR title"
                className="border border-teal-100/50 focus:border-teal-500/50 transition-colors bg-white/50"
              />
            </div>

            {/* Description Input */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium flex items-center gap-2">
                <span className="text-teal-500">02.</span> Description
              </Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                placeholder="Describe your intellectual property"
                rows={4}
                className="border border-teal-100/50 focus:border-teal-500/50 transition-colors bg-white/50 resize-none"
              />
            </div>

            {/* Type Selection */}
            <div className="space-y-2">
              <Label htmlFor="type" className="text-sm font-medium flex items-center gap-2">
                <span className="text-teal-500">03.</span> Type
              </Label>
              <Select
                value={formData.type}
                onValueChange={handleTypeChange}
                required
              >
                <SelectTrigger className="border border-teal-100/50 focus:border-teal-500/50 transition-colors bg-white/50">
                  <SelectValue placeholder="Select IPR type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Patent">Patent</SelectItem>
                  <SelectItem value="Trademark">Trademark</SelectItem>
                  <SelectItem value="Copyright">Copyright</SelectItem>
                  <SelectItem value="Trade Secret">Trade Secret</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Document Upload */}
            <div className="space-y-2">
              <Label htmlFor="documents" className="text-sm font-medium flex items-center gap-2">
                <span className="text-teal-500">04.</span> Related Documents
              </Label>
              <div className="border border-teal-100/50 rounded-xl p-6 bg-white/50">
                <div className="flex items-center justify-center w-full">
                  <label
                    htmlFor="documents"
                    className="flex flex-col items-center justify-center w-full h-32 
                      border-2 border-dashed border-teal-200 rounded-lg cursor-pointer 
                      hover:bg-teal-50/50 transition-colors"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <div className="p-3 rounded-xl bg-teal-500/10 mb-3">
                        <FileText className="h-6 w-6 text-teal-500" />
                      </div>
                      <p className="text-sm font-medium mb-1">Click to upload files</p>
                      <p className="text-xs text-muted-foreground">
                        or drag and drop your documents here
                      </p>
                    </div>
                    <Input
                      id="documents"
                      type="file"
                      onChange={handleFileUpload}
                      multiple
                      disabled={isFormDisabled}
                      className="hidden"
                    />
                  </label>
                </div>
                {isUploading && (
                  <p className="text-sm text-yellow-600 mt-4 text-center">
                    Uploading documents...
                  </p>
                )}
              </div>

              {/* Uploaded Documents List */}
              {documents.length > 0 && (
                <div className="mt-4 space-y-3 bg-white/50 rounded-xl border border-teal-100/50 p-4">
                  <h3 className="text-sm font-medium text-muted-foreground">Uploaded Documents</h3>
                  <div className="grid gap-2">
                    {documents.map((doc, index) => (
                      <Link
                        key={doc.public_id}
                        href={doc.secure_url}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-teal-50/50 
                          border border-teal-100/50 transition-colors group"
                        target="_blank"
                      >
                        <div className="h-8 w-8 rounded-lg bg-teal-500/10 flex items-center justify-center 
                          group-hover:bg-teal-500/20 transition-colors">
                          <FileText className="h-4 w-4 text-teal-500" />
                        </div>
                        <span className="text-sm font-medium">Document {index + 1}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={isFormDisabled}
              className="flex-1 bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-500 
                hover:to-teal-600 text-white transition-all duration-300"
            >
              {isSubmitting ? "Filing..." : isUploading ? "Uploading..." : "File IPR"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              className="flex-1 border border-teal-100/50 hover:bg-teal-50/50 transition-colors"
              disabled={isFormDisabled}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateIPRPage;
