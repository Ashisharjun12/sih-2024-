"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FileUpload } from "@/components/ui/file-upload";
import { X, Plus } from "lucide-react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// Define steps
const steps = [
  {
    id: 1,
    title: "Project Details",
    description: "Basic project information"
  },
  {
    id: 2,
    title: "Additional Details",
    description: "More project information"
  }
];

interface StepProps {
  form: any;
  handleFileChange: (fileData: { file: File | null; uploadData?: any }) => void;
  handleFileUpload: (file: File | null, fileType: string) => void;
  isUploading: boolean;
}

export default function CreateNewProject() {
  const { data: session } = useSession();
  const { toast } = useToast();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [files, setFiles] = useState<Record<string, { file: File | null; uploadData?: any }>>({});

  const form = useForm({
    defaultValues: {
      owner: {
        fullName: "",
        email: "",
        phone: "",
        businessAddress: {
          physicalAddress: "",
          city: "",
          state: "",
          pincode: ""
        }
      },
      startupDetails: {
        startupName: "",
        about: "",
        registrationNumber: "",
        incorporationDate: "",
        industries: [],
        sectors: [],
        stage: "",
        businessModel: "",
        revenueModel: "",
        founders: []
      },
      additionalInfo: {
        website: "",
        socialMedia: {
          linkedIn: "",
          facebook: "",
          twitter: ""
        }
      }
    }
  });

  const handleFileChange = (fileData: { file: File | null; uploadData?: any }) => {
    if (!fileData.uploadData?.fileType) return;
    
    setFiles(prev => ({
      ...prev,
      [fileData.uploadData.fileType]: {
        file: fileData.file,
        uploadData: fileData.uploadData
      }
    }));
  };

  const handleFileUpload = async (file: File | null, fileType: string) => {
    if (!file) return;

    console.log("Starting file upload:", { fileType, fileName: file.name, fileSize: file.size });
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      console.log("Sending upload request to /api/upload...");
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      console.log("Upload response status:", response.status);

      if (!response.ok) {
        const errorData = await response.text();
        console.error("Upload failed:", errorData);
        throw new Error(`Failed to upload ${file.name}`);
      }

      const uploadedFile = await response.json();
      console.log("Upload successful, received data:", uploadedFile);

      handleFileChange({
        file,
        uploadData: {
          ...uploadedFile,
          fileType,
          originalName: file.name
        }
      });
      console.log("Current files state after upload:", files);

      toast({
        title: "Success",
        description: "File uploaded successfully",
      });
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to upload file",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = async (data: any) => {
    try {
      setIsSubmitting(true);
      console.log("Form submission started with data:", data);
      console.log("Current files state:", files);

      const formData = {
        ...data,
        files: Object.entries(files).reduce((acc, [key, value]) => {
          if (value?.uploadData) {
            acc[key] = {
              public_id: value.uploadData.public_id,
              secure_url: value.uploadData.secure_url
            };
          }
          return acc;
        }, {} as Record<string, any>)
      };

      console.log("Prepared form data for submission:", formData);

      const response = await fetch("/api/startup/projects/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formData })
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error("Form submission failed:", errorData);
        throw new Error("Failed to create project");
      }

      const result = await response.json();
      console.log("Form submission successful:", result);

      toast({
        title: "Success",
        description: "Project created successfully"
      });

      router.push("/startup/projects");

    } catch (error) {
      console.error("Form submission error:", error);
      toast({
        title: "Error",
        description: "Failed to create project",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentStep(2);
  };
  const prevStep = () => setCurrentStep(1);

  return (
    <div className="container max-w-3xl py-8">
      <Card>
        <CardHeader>
          <CardTitle>Create New Project</CardTitle>
          {/* Step Indicator */}
          <div className="mt-4">
            <div className="flex justify-between items-center">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 
                    ${currentStep >= step.id ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground"}`}>
                    {step.id}
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`h-1 w-24 mx-2 ${currentStep > step.id ? "bg-primary" : "bg-muted"}`} />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2">
              {steps.map((step) => (
                <div key={step.id} className="text-sm">
                  <p className="font-medium">{step.title}</p>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Form content here */}
              
              {currentStep === 1 ? (
                // Step 1: Basic Details
                <div className="space-y-6">
                  {/* Basic Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Basic Information</h3>
                    
                    <FormField
                      control={form.control}
                      name="owner.fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Enter your full name" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="owner.email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input {...field} type="email" placeholder="Enter your email" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="owner.phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Enter your phone number" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Business Address */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Business Address</h3>
                    
                    <FormField
                      control={form.control}
                      name="owner.businessAddress.physicalAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Street Address</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Enter street address" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="owner.businessAddress.city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Enter city" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="owner.businessAddress.state"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>State</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Enter state" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="owner.businessAddress.pincode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Pincode</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Enter pincode" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Identity Documents */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Identity Documents</h3>
                    <FormItem>
                      <FileUpload
                        label="Upload Identity Proof"
                        fileType="identityProof"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onFileChange={(fileData) => handleFileUpload(fileData.file, 'identityProof')}
                        isUploading={isUploading}
                      />
                    </FormItem>
                  </div>
                </div>
              ) : (
                // Step 2: Startup Details
                <div className="space-y-6">
                  {/* Startup Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Startup Information</h3>

                    <FormField
                      control={form.control}
                      name="startupDetails.startupName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Startup Name</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Enter startup name" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="startupDetails.about"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>About</FormLabel>
                          <FormControl>
                            <Textarea {...field} placeholder="Tell us about your startup" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="startupDetails.registrationNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Registration Number</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Enter registration number" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="startupDetails.incorporationDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Incorporation Date</FormLabel>
                            <FormControl>
                              <Input {...field} type="date" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Documents */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Documents</h3>
                    
                    <div className="space-y-4">
                      <FileUpload
                        label="Upload Startup Logo"
                        fileType="startupLogo"
                        accept="image/*"
                        onFileChange={(fileData) => handleFileUpload(fileData.file, 'startupLogo')}
                        isUploading={isUploading}
                      />

                      <FileUpload
                        label="Upload Pitch Deck"
                        fileType="pitchDeck"
                        accept=".pdf,.ppt,.pptx"
                        onFileChange={(fileData) => handleFileUpload(fileData.file, 'pitchDeck')}
                        isUploading={isUploading}
                      />

                      <FileUpload
                        label="Upload Incorporation Certificate"
                        fileType="incorporationCertificate"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onFileChange={(fileData) => handleFileUpload(fileData.file, 'incorporationCertificate')}
                        isUploading={isUploading}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between">
                {currentStep === 2 && (
                  <Button 
                    type="button"
                    variant="outline" 
                    onClick={prevStep}
                  >
                    Previous
                  </Button>
                )}
                {currentStep === 1 ? (
                  <Button 
                    type="button"
                    onClick={nextStep}
                    className="ml-auto"
                  >
                    Next
                  </Button>
                ) : (
                  <Button 
                    type="submit"
                    disabled={isSubmitting}
                    className="ml-auto"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Creating...</span>
                      </div>
                    ) : (
                      "Create Project"
                    )}
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
} 