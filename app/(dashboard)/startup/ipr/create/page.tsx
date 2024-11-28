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
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">File New IPR</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
            placeholder="Enter IPR title"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
            placeholder="Describe your intellectual property"
            rows={4}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">Type</Label>
          <Select
            value={formData.type}
            onValueChange={handleTypeChange}
            required
          >
            <SelectTrigger>
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

        <div className="space-y-2">
          <Label htmlFor="documents">Related Documents</Label>
          <Input
            id="documents"
            type="file"
            onChange={handleFileUpload}
            multiple
            disabled={isFormDisabled}
          />
          {isUploading && (
            <p className="text-sm text-yellow-600">Uploading documents...</p>
          )}
          {documents.length > 0 && (
            <div className="mt-2">
              <p className="text-sm font-medium">Uploaded Documents:</p>
              <ul className="list-disc list-inside">
                {documents.map((doc, index) => (
                  <li key={doc.public_id}>
                    <Link
                      href={doc.secure_url}
                      className="text-sm text-gray-600"
                    >
                      Document {index + 1}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="flex gap-4">
          <Button type="submit" disabled={isFormDisabled} className="w-full">
            {isSubmitting
              ? "Filing..."
              : isUploading
              ? "Uploading..."
              : "File IPR"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            className="w-full"
            disabled={isFormDisabled}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateIPRPage;
