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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { industries, sectors, stages } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import Link from "next/link";

interface FileUpload {
  public_id: string;
  secure_url: string;
}

interface FormData {
  name: string;
  email: string;
  about: string;
  focusedIndustries: string[];
  focusedSectors: string[];
  stage: string[];
  certificates: FileUpload[];
}

const MentorForm = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    about: "",
    focusedIndustries: [],
    focusedSectors: [],
    stage: [],
    certificates: [],
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleIndustryChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      focusedIndustries: prev.focusedIndustries.includes(value)
        ? prev.focusedIndustries.filter((industry) => industry !== value)
        : [...prev.focusedIndustries, value],
    }));
  };

  const handleSectorChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      focusedSectors: prev.focusedSectors.includes(value)
        ? prev.focusedSectors.filter((sector) => sector !== value)
        : [...prev.focusedSectors, value],
    }));
  };

  const handleStageChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      stage: prev.stage.includes(value)
        ? prev.stage.filter((s) => s !== value)
        : [...prev.stage, value],
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
        setFormData((prev) => ({
          ...prev,
          certificates: [...prev.certificates, uploadedFile],
        }));
      }

      toast({
        title: "Success",
        description: "All certificates uploaded successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to upload certificates",
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

    if (formData.focusedIndustries.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one industry",
        variant: "destructive",
      });
      return;
    }

    if (formData.focusedSectors.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one sector",
        variant: "destructive",
      });
      return;
    }

    if (formData.stage.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one stage",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/forms/mentor", {
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
        description: "Your mentor application has been submitted successfully",
      });

      router.push("/");
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to submit application",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container max-w-2xl py-8">
      <Card>
        <CardHeader>
          <CardTitle>Mentor Application</CardTitle>
          <CardDescription>
            Apply to become a mentor and help guide startups to success
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
                disabled={isSubmitting}
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
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="about">About</Label>
              <Textarea
                id="about"
                name="about"
                value={formData.about}
                onChange={handleInputChange}
                required
                placeholder="Tell us about yourself and your experience"
                rows={4}
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label>Focused Industries</Label>
              <Select
                onValueChange={handleIndustryChange}
                value={formData.focusedIndustries[0]}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select industries" />
                </SelectTrigger>
                <SelectContent>
                  {industries.map((industry) => (
                    <SelectItem key={industry} value={industry}>
                      {industry}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formData.focusedIndustries.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.focusedIndustries.map((industry) => (
                    <Badge
                      key={industry}
                      variant="secondary"
                      className="cursor-pointer"
                      onClick={() => handleIndustryChange(industry)}
                    >
                      {industry}
                      <X className="w-3 h-3 ml-2" />
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label>Focused Sectors</Label>
              <Select
                onValueChange={handleSectorChange}
                value={formData.focusedSectors[0]}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select sectors" />
                </SelectTrigger>
                <SelectContent>
                  {sectors.map((sector) => (
                    <SelectItem key={sector} value={sector}>
                      {sector}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formData.focusedSectors.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.focusedSectors.map((sector) => (
                    <Badge
                      key={sector}
                      variant="secondary"
                      className="cursor-pointer"
                      onClick={() => handleSectorChange(sector)}
                    >
                      {sector}
                      <X className="w-3 h-3 ml-2" />
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label>Startup Stages</Label>
              <Select
                onValueChange={handleStageChange}
                value={formData.stage[0]}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select stages" />
                </SelectTrigger>
                <SelectContent>
                  {stages.map((stage) => (
                    <SelectItem key={stage} value={stage}>
                      {stage}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formData.stage.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.stage.map((stage) => (
                    <Badge
                      key={stage}
                      variant="secondary"
                      className="cursor-pointer"
                      onClick={() => handleStageChange(stage)}
                    >
                      {stage}
                      <X className="w-3 h-3 ml-2" />
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label>Certificates</Label>
              <Input
                type="file"
                onChange={handleFileUpload}
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                multiple
                disabled={isSubmitting || isUploading}
              />
              {isUploading && (
                <p className="text-sm text-yellow-600">
                  Uploading certificates...
                </p>
              )}
              {formData.certificates.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm font-medium">Uploaded Certificates:</p>
                  <ul className="list-disc list-inside">
                    {formData.certificates.map((cert, index) => (
                      <li key={cert.public_id} className="text-sm text-gray-600">
                        <Link
                          href={cert.secure_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline"
                        >
                          Certificate {index + 1}
                        </Link>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="ml-2 h-4 hover:bg-red-100"
                          onClick={() => {
                            setFormData(prev => ({
                              ...prev,
                              certificates: prev.certificates.filter(c => c.public_id !== cert.public_id)
                            }));
                          }}
                        >
                          <X className="h-3 w-3 text-red-500" />
                        </Button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="flex gap-4">
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Application"}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => router.back()}
                disabled={isSubmitting}
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

export default MentorForm;
