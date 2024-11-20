"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FileUpload } from "@/components/ui/file-upload";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { startupFormSchema, licenseTypeEnum, certificationTypeEnum, revenueModelEnum } from "@/lib/validations/startup";
import { cn } from "@/lib/utils";
import { X, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface FileData {
  file: File | null;
  uploadData?: {
    public_id: string;
    secure_url: string;
    originalName: string;
    fileType: string;
  };
}

const industryOptions = [
  { value: "technology", label: "Technology & Software" },
  { value: "healthcare", label: "Healthcare & Biotech" },
  { value: "fintech", label: "Financial Technology" },
  { value: "ecommerce", label: "E-commerce & Retail" },
  { value: "edtech", label: "Education Technology" },
  { value: "cleantech", label: "Clean Technology & Sustainability" },
  { value: "agritech", label: "Agriculture Technology" },
  { value: "manufacturing", label: "Manufacturing & Industrial" },
  { value: "ai_ml", label: "AI & Machine Learning" },
  { value: "iot", label: "Internet of Things (IoT)" },
  { value: "blockchain", label: "Blockchain & Crypto" },
  { value: "saas", label: "SaaS & Cloud Services" },
  { value: "media", label: "Media & Entertainment" },
  { value: "foodtech", label: "Food Technology" },
  { value: "logistics", label: "Logistics & Supply Chain" },
  { value: "other", label: "Other" },
];

const steps = [
  {
    id: 1,
    title: "Basic Information",
    description: "Personal and startup details",
  },
  {
    id: 2,
    title: "Legal & Documents",
    description: "Legal compliance and documents",
  },
];

export default function StartupRegistrationForm() {
  const { data: session } = useSession();
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [files, setFiles] = useState<Record<string, FileData>>({});
  const [showCustomIndustry, setShowCustomIndustry] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const form = useForm<z.infer<typeof startupFormSchema>>({
    resolver: zodResolver(startupFormSchema),
    defaultValues: {
      owner: {
        fullName: session?.user?.name || "",
        email: session?.user?.email || "",
        phone: "",
        businessAddress: {
          physicalAddress: "",
          city: "",
          state: "",
          pincode: "",
        },
        dateOfBirth: "",
        gender: "Male",
        identityProof: {
          type: "Aadhar",
          number: "",
        },
      },
      startupDetails: {
        startupName: "",
        industry: "",
        stage: "Ideation",
        businessModel: "B2B",
        revenueModel: "Subscription",
        founders: [{ name: "", role: "", contactDetails: "" }],
        directors: [{ name: "", role: "", contactDetails: "" }],
        equitySplits: [{ ownerName: "", equityPercentage: 0 }],
        gstNumber: "",
        panNumber: "",
        cinNumber: "",
        msmeRegistration: "",
      },
      businessActivities: {
        missionAndVision: "",
      },
    },
  });

  const handleFileChange = (fileType: string, fileData: { file: File | null; uploadData?: any }) => {
    setFiles(prev => ({
      ...prev,
      [fileType]: {
        file: fileData.file,
        uploadData: fileData.uploadData
      }
    }));
  };

  const addFounder = () => {
    const currentFounders = form.getValues("startupDetails.founders") || [];
    form.setValue("startupDetails.founders", [
      ...currentFounders,
      { name: "", role: "", contactDetails: "" }
    ]);
  };

  const removeFounder = (index: number) => {
    const currentFounders = form.getValues("startupDetails.founders") || [];
    if (currentFounders.length > 1) {
      form.setValue("startupDetails.founders", 
        currentFounders.filter((_, i) => i !== index)
      );
    }
  };

  const addDirector = () => {
    const currentDirectors = form.getValues("startupDetails.directors") || [];
    form.setValue("startupDetails.directors", [
      ...currentDirectors,
      { name: "", role: "", contactDetails: "" }
    ]);
  };

  const removeDirector = (index: number) => {
    const currentDirectors = form.getValues("startupDetails.directors") || [];
    if (currentDirectors.length > 1) {
      form.setValue("startupDetails.directors", 
        currentDirectors.filter((_, i) => i !== index)
      );
    }
  };

  const addEquitySplit = () => {
    const currentSplits = form.getValues("startupDetails.equitySplits") || [];
    form.setValue("startupDetails.equitySplits", [
      ...currentSplits,
      { ownerName: "", equityPercentage: 0 }
    ]);
  };

  const removeEquitySplit = (index: number) => {
    const currentSplits = form.getValues("startupDetails.equitySplits") || [];
    if (currentSplits.length > 1) {
      form.setValue("startupDetails.equitySplits", 
        currentSplits.filter((_, i) => i !== index)
      );
    }
  };

  const onSubmit = async (data: z.infer<typeof startupFormSchema>) => {
    try {
      setIsSubmitting(true);

      if (!session?.user) {
        toast({
          title: "Error",
          description: "You must be logged in to submit this form",
          variant: "destructive",
        });
        return;
      }

      // Prepare form data with uploaded files
      const formData = {
        ...data,
        files: Object.entries(files).reduce((acc, [key, value]) => {
          if (value?.uploadData) {
            acc[key] = {
              public_id: value.uploadData.public_id,
              secure_url: value.uploadData.secure_url,
              originalName: value.uploadData.originalName,
              fileType: value.uploadData.fileType,
            };
          }
          return acc;
        }, {} as Record<string, any>),
        userId: session.user.id,
        userEmail: session.user.email,
        userName: session.user.name,
      };

      // Submit form
      const response = await fetch("/api/forms/startup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to submit form");
      }

      toast({
        title: "Success!",
        description: "Your startup registration form has been submitted successfully.",
      });

      // Wait for 2 seconds before redirecting
      setTimeout(() => {
        router.push("/");
      }, 2000);

    } catch (error: any) {
      console.error("Form submission error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to submit form. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    setCurrentStep(2);
  };

  const prevStep = () => {
    setCurrentStep(1);
  };

  return (
    <div className="container max-w-3xl py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Startup Registration</CardTitle>
            {/* Step Indicator */}
            <div className="mt-4">
              <div className="flex justify-between items-center">
                {steps.map((step, index) => (
                  <div key={step.id} className="flex items-center">
                    <div 
                      className={cn(
                        "flex items-center justify-center w-8 h-8 rounded-full border-2",
                        currentStep >= step.id 
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-muted-foreground"
                      )}
                    >
                      {step.id}
                    </div>
                    {index < steps.length - 1 && (
                      <div 
                        className={cn(
                          "h-1 w-24 mx-2",
                          currentStep > step.id 
                            ? "bg-primary" 
                            : "bg-muted"
                        )}
                      />
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
                <motion.div
                  key={currentStep}
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -20, opacity: 0 }}
                >
                  {currentStep === 1 ? (
                    // Step 1: Basic Information
                    <div className="space-y-4">
                      {/* Owner Information */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Owner Information</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="owner.fullName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Full Name</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="owner.email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                  <Input {...field} type="email" />
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
                                <FormLabel>Phone</FormLabel>
                                <FormControl>
                                  <Input {...field} type="tel" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="owner.gender"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Gender</FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select gender" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="Male">Male</SelectItem>
                                    <SelectItem value="Female">Female</SelectItem>
                                    <SelectItem value="Other">Other</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="owner.dateOfBirth"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Date of Birth</FormLabel>
                                <FormControl>
                                  <Input 
                                    {...field}
                                    type="date"
                                    
                                    onChange={(e) => field.onChange(e.target.value)}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        {/* Business Address */}
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="owner.businessAddress.physicalAddress"
                            render={({ field }) => (
                              <FormItem className="col-span-2">
                                <FormLabel>Address</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="owner.businessAddress.city"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>City</FormLabel>
                                <FormControl>
                                  <Input {...field} />
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
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="owner.businessAddress.pincode"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Pincode</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        {/* Identity Proof */}
                        <div className="space-y-4">
                          <FormField
                            control={form.control}
                            name="owner.identityProof.type"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Identity Proof Type</FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select ID type" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="Aadhar">Aadhar Card</SelectItem>
                                    <SelectItem value="PAN">PAN Card</SelectItem>
                                    <SelectItem value="Passport">Passport</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="owner.identityProof.number"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Identity Proof Number</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormItem>
                            <FormLabel>Upload Identity Proof</FormLabel>
                            <FileUpload
                              label="Identity Proof"
                              fileType="identityProof"
                              accept="image/*"
                              onFileChange={(fileData) => handleFileChange('identityProof', fileData)}
                            />
                            <FormDescription>
                              Upload a clear image of your identity proof (Aadhar/PAN/Passport)
                            </FormDescription>
                          </FormItem>
                        </div>
                      </div>

                      {/* Startup Details */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Startup Details</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="startupDetails.startupName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Startup Name</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="startupDetails.industry"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Industry</FormLabel>
                                <div className="space-y-4">
                                  <Select
                                    onValueChange={(value) => {
                                      setShowCustomIndustry(value === "other");
                                      field.onChange(value);
                                    }}
                                    defaultValue={field.value}
                                  >
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select industry" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {industryOptions.map((industry) => (
                                        <SelectItem 
                                          key={industry.value} 
                                          value={industry.value}
                                        >
                                          {industry.label}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>

                                  {showCustomIndustry && (
                                    <FormField
                                      control={form.control}
                                      name="startupDetails.customIndustry"
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormControl>
                                            <Input 
                                              {...field}
                                              placeholder="Please specify your industry"
                                              onChange={(e) => {
                                                field.onChange(e.target.value);
                                                form.setValue('startupDetails.industry', e.target.value);
                                              }}
                                            />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                  )}
                                </div>
                                <FormDescription>
                                  Choose the primary industry your startup operates in
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="startupDetails.stage"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Stage</FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select stage" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="Ideation">Ideation</SelectItem>
                                    <SelectItem value="Validation">Validation</SelectItem>
                                    <SelectItem value="Scaling">Scaling</SelectItem>
                                    <SelectItem value="Expansion">Expansion</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="startupDetails.businessModel"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Business Model</FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select business model" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="B2B">B2B</SelectItem>
                                    <SelectItem value="B2C">B2C</SelectItem>
                                    <SelectItem value="B2B2C">B2B2C</SelectItem>
                                    <SelectItem value="Other">Other</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        {/* Additional Registration Details */}
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="startupDetails.gstNumber"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>GST Number (if applicable)</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="startupDetails.panNumber"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>PAN Number</FormLabel>

                                <FormControl>
                                  <Input  {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="startupDetails.cinNumber"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>CIN Number (if applicable)</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="startupDetails.msmeRegistration"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>MSME Registration (if applicable)</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      {/* Founders & Directors */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Founders & Directors</h3>
                        
                        {/* Founders */}
                        <div className="space-y-4">
                          <FormField
                            control={form.control}
                            name="startupDetails.founders"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Founders</FormLabel>
                                <div className="space-y-4">
                                  {field.value?.map((founder, index) => (
                                    <div key={index} className="relative grid grid-cols-3 gap-4 p-4 border rounded-lg">
                                      <Input
                                        placeholder="Name"
                                        value={founder.name}
                                        onChange={(e) => {
                                          const newFounders = [...field.value];
                                          newFounders[index].name = e.target.value;
                                          field.onChange(newFounders);
                                        }}
                                      />
                                      <Input
                                        placeholder="Role"
                                        value={founder.role}
                                        onChange={(e) => {
                                          const newFounders = [...field.value];
                                          newFounders[index].role = e.target.value;
                                          field.onChange(newFounders);
                                        }}
                                      />
                                      <Input
                                        placeholder="Contact"
                                        value={founder.contactDetails}
                                        onChange={(e) => {
                                          const newFounders = [...field.value];
                                          newFounders[index].contactDetails = e.target.value;
                                          field.onChange(newFounders);
                                        }}
                                      />
                                      {/* Show remove button only if there's more than one founder */}
                                      {field.value.length > 1 && (
                                        <Button
                                          type="button"
                                          variant="ghost"
                                          size="icon"
                                          className="absolute -right-2 -top-2 h-6 w-6 rounded-full bg-background shadow-sm hover:bg-destructive hover:text-destructive-foreground"
                                          onClick={() => {
                                            const newFounders = field.value.filter((_, i) => i !== index);
                                            field.onChange(newFounders);
                                          }}
                                        >
                                          <X className="h-4 w-4" />
                                        </Button>
                                      )}
                                    </div>
                                  ))}
                                  <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                      field.onChange([
                                        ...(field.value || []),
                                        { name: "", role: "", contactDetails: "" }
                                      ]);
                                    }}
                                    className="w-full"
                                  >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Another Founder
                                  </Button>
                                </div>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        {/* Equity Splits */}
                        <div className="space-y-4">
                          <FormField
                            control={form.control}
                            name="startupDetails.equitySplits"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Equity Distribution</FormLabel>
                                <div className="space-y-4">
                                  {field.value?.map((split, index) => (
                                    <div key={index} className="relative grid grid-cols-2 gap-4 p-4 border rounded-lg">
                                      <Input
                                        placeholder="Owner Name"
                                        value={split.ownerName}
                                        onChange={(e) => {
                                          const newSplits = [...field.value];
                                          newSplits[index].ownerName = e.target.value;
                                          field.onChange(newSplits);
                                        }}
                                      />
                                      <Input
                                        type="number"
                                        min="0"
                                        max="100"
                                        placeholder="Equity %"
                                        value={split.equityPercentage}
                                        onChange={(e) => {
                                          const newSplits = [...field.value];
                                          newSplits[index].equityPercentage = parseFloat(e.target.value);
                                          field.onChange(newSplits);
                                        }}
                                      />
                                      {/* Only show remove button if there's more than one equity split */}
                                      {field.value.length > 1 && (
                                        <Button
                                          type="button"
                                          variant="ghost"
                                          size="icon"
                                          className="absolute -right-2 -top-2 h-6 w-6 rounded-full bg-background shadow-sm hover:bg-destructive hover:text-destructive-foreground"
                                          onClick={() => {
                                            const newSplits = field.value.filter((_, i) => i !== index);
                                            field.onChange(newSplits);
                                          }}
                                        >
                                          <X className="h-4 w-4" />
                                        </Button>
                                      )}
                                    </div>
                                  ))}
                                  <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                      field.onChange([
                                        ...(field.value || []),
                                        { ownerName: "", equityPercentage: 0 }
                                      ]);
                                    }}
                                    className="w-full"
                                  >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Another Equity Split
                                  </Button>
                                </div>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      {/* Financial Details */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Financial Details</h3>
                        
                        {/* Bank Details */}
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="financialDetails.bankDetails.bankName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Bank Name</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="financialDetails.bankDetails.branch"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Branch</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="financialDetails.bankDetails.accountNumber"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Account Number</FormLabel>
                                <FormControl>
                                  <Input {...field} type="password" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        {/* Financial Status */}
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="financialDetails.annualTurnover"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Annual Turnover (₹)</FormLabel>
                                <FormControl>
                                  <Input 
                                    {...field} 
                                    type="number" 
                                    onChange={(e) => field.onChange(Number(e.target.value))}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="financialDetails.fundingStatus"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Funding Status</FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select funding status" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="bootstrapped">Bootstrapped</SelectItem>
                                    <SelectItem value="seed">Seed Funded</SelectItem>
                                    <SelectItem value="seriesA">Series A</SelectItem>
                                    <SelectItem value="seriesB">Series B</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="financialDetails.amountRaised"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Amount Raised (₹)</FormLabel>
                                <FormControl>
                                  <Input 
                                    {...field} 
                                    type="number" 
                                    onChange={(e) => field.onChange(Number(e.target.value))}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      {/* Business Activities */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Business Activities</h3>
                        <FormField
                          control={form.control}
                          name="businessActivities.missionAndVision"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Mission and Vision</FormLabel>
                              <FormControl>
                                <Textarea 
                                  {...field} 
                                  placeholder="Describe your startup's mission and vision"
                                  className="min-h-[100px]"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Additional Information */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Additional Information</h3>
                        
                        <FormField
                          control={form.control}
                          name="additionalInfo.website"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Website</FormLabel>
                              <FormControl>
                                <Input {...field} type="url" placeholder="https://" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Social Media */}
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="additionalInfo.socialMedia.linkedIn"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>LinkedIn</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="LinkedIn URL" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="additionalInfo.socialMedia.twitter"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Twitter</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="Twitter URL" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="additionalInfo.socialMedia.facebook"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Facebook</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="Facebook URL" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    // Step 2: Legal & Documents
                    <div className="space-y-4">
                      {/* Legal & Compliance */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Legal & Compliance</h3>
                        
                        {/* GSTIN */}
                        <FormField
                          control={form.control}
                          name="legalAndCompliance.gstin"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>GSTIN (if applicable)</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Enter GSTIN" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Licenses */}
                        <FormField
                          control={form.control}
                          name="legalAndCompliance.licenses"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Licenses</FormLabel>
                              <div className="space-y-4">
                                {field.value?.map((license, index) => (
                                  <div key={index} className="grid grid-cols-3 gap-4 p-4 border rounded-lg relative">
                                    <Select
                                      value={license.type}
                                      onValueChange={(value) => {
                                        const newLicenses = [...field.value];
                                        newLicenses[index].type = value as typeof licenseTypeEnum[number];
                                        field.onChange(newLicenses);
                                      }}
                                    >
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select license type" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {licenseTypeEnum.map((type) => (
                                          <SelectItem key={type} value={type}>
                                            {type.replace(/_/g, ' ')}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                    <Input
                                      placeholder="License Number"
                                      value={license.number}
                                      onChange={(e) => {
                                        const newLicenses = [...field.value];
                                        newLicenses[index].number = e.target.value;
                                        field.onChange(newLicenses);
                                      }}
                                    />
                                    <Input
                                      type="date"
                                      value={license.validUntil}
                                      onChange={(e) => {
                                        const newLicenses = [...field.value];
                                        newLicenses[index].validUntil = e.target.value;
                                        field.onChange(newLicenses);
                                      }}
                                    />
                                    {field.value.length > 1 && (
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="absolute -right-2 -top-2"
                                        onClick={() => {
                                          const newLicenses = field.value.filter((_, i) => i !== index);
                                          field.onChange(newLicenses);
                                        }}
                                      >
                                        <X className="h-4 w-4" />
                                      </Button>
                                    )}
                                  </div>
                                ))}
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={() => {
                                    field.onChange([
                                      ...(field.value || []),
                                      { type: "Other", number: "", validUntil: "" }
                                    ]);
                                  }}
                                >
                                  Add License
                                </Button>
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Similar structure for Certifications */}
                        {/* ... */}

                        {/* Auditor Details */}
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="legalAndCompliance.auditorDetails.name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Auditor Name</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          {/* ... other auditor fields ... */}
                        </div>
                      </div>

                      {/* Support & Networking */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Support & Networking</h3>
                        
                        <FormField
                          control={form.control}
                          name="supportAndNetworking.supportRequested"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Support Required</FormLabel>
                              <Select
                                onValueChange={(value) => field.onChange([...field.value || [], value])}
                                value={field.value?.[0] || ""}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select support type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="Mentorship">Mentorship</SelectItem>
                                  <SelectItem value="Funding">Funding</SelectItem>
                                  <SelectItem value="Technical">Technical Support</SelectItem>
                                  <SelectItem value="Marketing">Marketing Support</SelectItem>
                                  <SelectItem value="Legal">Legal Support</SelectItem>
                                  <SelectItem value="Infrastructure">Infrastructure</SelectItem>
                                  <SelectItem value="Networking">Networking</SelectItem>
                                  <SelectItem value="Other">Other</SelectItem>
                                </SelectContent>
                              </Select>
                              <div className="flex flex-wrap gap-2 mt-2">
                                {field.value?.map((support, index) => (
                                  <Badge 
                                    key={index}
                                    variant="secondary"
                                    className="flex items-center gap-1"
                                  >
                                    {support}
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      className="h-4 w-4 p-0 hover:bg-transparent"
                                      onClick={() => {
                                        const newValue = field.value?.filter((_, i) => i !== index);
                                        field.onChange(newValue);
                                      }}
                                    >
                                      <X className="h-3 w-3" />
                                    </Button>
                                  </Badge>
                                ))}
                              </div>
                              <FormDescription>
                                Select the types of support you are looking for
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="supportAndNetworking.mentorshipPrograms"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Mentorship Programs Interest</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select mentorship type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="Technical">Technical Mentorship</SelectItem>
                                  <SelectItem value="Business">Business Development</SelectItem>
                                  <SelectItem value="Marketing">Marketing Strategy</SelectItem>
                                  <SelectItem value="Financial">Financial Planning</SelectItem>
                                  <SelectItem value="Leadership">Leadership Development</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormDescription>
                                Choose the type of mentorship you're interested in
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="supportAndNetworking.potentialInvestors"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Investor Type Preference</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select investor type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="Angel">Angel Investors</SelectItem>
                                  <SelectItem value="VC">Venture Capital</SelectItem>
                                  <SelectItem value="PE">Private Equity</SelectItem>
                                  <SelectItem value="Corporate">Corporate Investors</SelectItem>
                                  <SelectItem value="Government">Government Funding</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormDescription>
                                Select the type of investors you're looking to connect with
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Document Upload */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Required Documents</h3>
                        
                        <div className="grid gap-6">
                          <FormItem>
                            <FormLabel>Identity Proof</FormLabel>
                            <FileUpload
                              label="Identity Proof"
                              fileType="identityProof"
                              accept="image/*"
                              onFileChange={(fileData) => handleFileChange('identityProof', fileData)}
                            />
                            <FormDescription>
                              Upload a clear image of your identity proof (Aadhar/PAN/Passport)
                            </FormDescription>
                          </FormItem>

                          <FormItem>
                            <FormLabel>Business Plan</FormLabel>
                            <FileUpload
                              label="Business Plan"
                              fileType="businessPlan"
                              accept="image/*"
                              onFileChange={(fileData) => handleFileChange('businessPlan', fileData)}
                            />
                            <FormDescription>
                              Upload an image of your business plan document
                            </FormDescription>
                          </FormItem>

                          <FormItem>
                            <FormLabel>Pitch Deck</FormLabel>
                            <FileUpload
                              label="Pitch Deck"
                              fileType="pitchDeck"
                              accept="image/*"
                              onFileChange={(fileData) => handleFileChange('pitchDeck', fileData)}
                            />
                            <FormDescription>
                              Upload images of your pitch deck slides
                            </FormDescription>
                          </FormItem>

                          <FormItem>
                            <FormLabel>Financial Projections</FormLabel>
                            <FileUpload
                              label="Financial Projections"
                              fileType="financialProjections"
                              accept="image/*"
                              onFileChange={(fileData) => handleFileChange('financialProjections', fileData)}
                            />
                            <FormDescription>
                              Upload images of your financial projection documents
                            </FormDescription>
                          </FormItem>

                          <FormItem>
                            <FormLabel>Incorporation Certificate (if applicable)</FormLabel>
                            <FileUpload
                              label="Incorporation Certificate"
                              fileType="incorporationCertificate"
                              accept="image/*"
                              onFileChange={(fileData) => handleFileChange('incorporationCertificate', fileData)}
                            />
                            <FormDescription>
                              Upload an image of your incorporation certificate
                            </FormDescription>
                          </FormItem>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Navigation Buttons */}
                  <div className="flex justify-between mt-8">
                    {currentStep === 2 && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={prevStep}
                      >
                        <ChevronLeft className="w-4 h-4 mr-2" />
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
                        <ChevronRight className="w-4 h-4 ml-2" />
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
                            <span>Submitting...</span>
                          </div>
                        ) : (
                          "Submit Registration"
                        )}
                      </Button>
                    )}
                  </div>
                </motion.div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
} 