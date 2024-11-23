"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface FileUpload {
  public_id: string;
  secure_url: string;
}

interface FormData {
  name: string;
  email: string;
  certifications: FileUpload[];
}

const IPRProfessionalForm = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    certifications: [],
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;

    setIsUploading(true);
    const files = Array.from(e.target.files);
    
    try {
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
        setFormData(prev => ({
          ...prev,
          certifications: [...prev.certifications, uploadedFile]
        }));
      }

      toast({
        title: "Success",
        description: "All certifications uploaded successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to upload certifications",
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
    
    if (formData.certifications.length === 0) {
      toast({
        title: "Error",
        description: "Please upload at least one certification",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/forms/iprprofessional", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to submit application");
      }

      toast({
        title: "Success",
        description: "Your IPR professional application has been submitted successfully",
      });

      router.push("/");
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit application",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormDisabled = isSubmitting || isUploading;

  return (
    <div className="container max-w-2xl py-8">
      <Card>
        <CardHeader>
          <CardTitle>IPR Professional Application</CardTitle>
          <CardDescription>
            Apply to become an IPR professional and help manage intellectual property rights
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="Enter your full name"
                disabled={isFormDisabled}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                placeholder="Enter your email address"
                disabled={isFormDisabled}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="certifications">Professional Certifications</Label>
              <Input
                id="certifications"
                name="certifications"
                type="file"
                onChange={handleFileUpload}
                multiple
                accept=".pdf,.jpg,.jpeg,.png"
                disabled={isFormDisabled}
              />
              {isUploading && (
                <p className="text-sm text-yellow-600">Uploading certifications...</p>
              )}
              {formData.certifications.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm font-medium">Uploaded Certifications:</p>
                  <ul className="list-disc list-inside">
                    {formData.certifications.map((cert, index) => (
                      <li key={cert.public_id} className="text-sm text-gray-600">
                        <a
                          href={cert.secure_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline"
                        >
                          Certification {index + 1}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="flex gap-4">
              <Button
                type="submit"
                className="w-full"
                disabled={isFormDisabled || formData.certifications.length === 0}
              >
                {isSubmitting ? "Submitting..." : "Submit Application"}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => router.back()}
                disabled={isFormDisabled}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default IPRProfessionalForm;
