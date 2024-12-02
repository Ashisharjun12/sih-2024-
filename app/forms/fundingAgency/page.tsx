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
import { cn } from "@/lib/utils";
import { X, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface FundingAgencyFormData {
  agencyDetails: {
    name: string;
    registrationNumber: string;
    type: string;
    establishmentDate: string;
    description: string;
  };
  contactInformation: {
    officialAddress: string;
    officialEmail: string;
    phoneNumber: string;
    websiteURL: string;
  };
  representatives: Array<{
    name: string;
    designation: string;
    email: string;
    phone: string;
  }>;
  fundingPreferences: {
    investmentRange: {
      minimum: number;
      maximum: number;
    };
    preferredStages: string[];
    fundingTypes: string[];
    preferredSectors: string[];
    disbursementMode: string;
  };
  experience: {
    yearsOfOperation: number;
    totalInvestments: number;
    averageTicketSize: number;
    successfulExits: number;
  };
}

const steps = [
  {
    id: 1,
    title: "Basic Information",
    description: "Agency and contact details",
  },
  {
    id: 2,
    title: "Investment Preferences & Documents",
    description: "Funding criteria and documentation",
  },
];

const agencyTypes = [
  { value: "Venture_Capital", label: "Venture Capital (VC) Firm" },
  { value: "Angel_Network", label: "Angel Investor Network" },
  { value: "Crowdfunding_Platform", label: "Crowdfunding Platform" },
  { value: "Government_Body", label: "Government Grant Body" },
  { value: "Financial_Institution", label: "Bank or Financial Institution" },
  { value: "Corporate_Investor", label: "Corporate/Private Investor" },
  { value: "NGO_Foundation", label: "NGO/Foundation" },
];

const sectorOptions = [
  { value: "Technology", label: "Technology" },
  { value: "Healthcare", label: "Healthcare" },
  { value: "Education", label: "Education" },
  { value: "Finance", label: "Finance" },
  { value: "Agriculture", label: "Agriculture" },
  { value: "Clean_Energy", label: "Clean Energy" },
  { value: "Manufacturing", label: "Manufacturing" },
  { value: "Other", label: "Other" },
];

export default function FundingAgencyRegistrationForm() {
  const { data: session } = useSession();
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [files, setFiles] = useState<Record<string, any>>({});

  const form = useForm<FundingAgencyFormData>({
    defaultValues: {
      agencyDetails: {
        name: "",
        registrationNumber: "",
        type: "",
        establishmentDate: "",
        description: "",
      },
      contactInformation: {
        officialAddress: "",
        officialEmail: session?.user?.email || "",
        phoneNumber: "",
        websiteURL: "",
      },
      representatives: [{
        name: session?.user?.name || "",
        designation: "",
        email: session?.user?.email || "",
        phone: "",
      }],
      fundingPreferences: {
        investmentRange: {
          minimum: 0,
          maximum: 0,
        },
        preferredStages: [] as string[],
        fundingTypes: [] as string[],
        preferredSectors: [] as string[],
        disbursementMode: "",
      },
      experience: {
        yearsOfOperation: 0,
        totalInvestments: 0,
        averageTicketSize: 0,
        successfulExits: 0,
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

  const onSubmit = async (data: FundingAgencyFormData) => {
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

      const submissionData = {
        userId: session.user.id,
        formType: "fundingAgency",
        formData: {
          owner: {
            fullName: data.representatives[0].name,
            email: data.representatives[0].email,
            phone: data.representatives[0].phone,
            businessAddress: {
              physicalAddress: data.contactInformation.officialAddress,
            },
          },
          agencyDetails: data.agencyDetails,
          contactInformation: data.contactInformation,
          representatives: data.representatives,
          fundingPreferences: data.fundingPreferences,
          experience: data.experience,
        },
        files: files,
        userEmail: session.user.email,
        userName: session.user.name,
      };

      console.log("Form Submission Data:", {
        ...submissionData,
        formData: {
          ...submissionData.formData,
          owner: {
            ...submissionData.formData.owner,
            note: "This is the primary representative (index 0)",
          },
          representatives: submissionData.formData.representatives.map((rep, index) => ({
            ...rep,
            note: index === 0 ? "This is also the owner" : "Additional representative"
          }))
        }
      });

      const response = await fetch("/api/forms/fundingAgency", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submissionData),
      });

      if (!response.ok) {
        throw new Error("Failed to submit form");
      }

      toast({
        title: "Success!",
        description: "Your funding agency registration has been submitted.",
      });

    } catch (error: any) {
      console.error("Form submission error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to submit form",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => setCurrentStep(2);
  const prevStep = () => setCurrentStep(1);

  return (
    <div className="container max-w-3xl py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Funding Agency Registration</CardTitle>
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
                      {/* Agency Details */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Agency Details</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="agencyDetails.name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Agency Name</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="agencyDetails.registrationNumber"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Registration Number</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="agencyDetails.type"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Agency Type</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select agency type" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {agencyTypes.map((type) => (
                                      <SelectItem key={type.value} value={type.value}>
                                        {type.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="agencyDetails.establishmentDate"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Establishment Date</FormLabel>
                                <FormControl>
                                  <Input {...field} type="date" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <FormField
                          control={form.control}
                          name="agencyDetails.description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Agency Description</FormLabel>
                              <FormControl>
                                <Textarea {...field} rows={4} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Contact Information */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Contact Information</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="contactInformation.officialEmail"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Official Email</FormLabel>
                                <FormControl>
                                  <Input {...field} type="email" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="contactInformation.phoneNumber"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Phone Number</FormLabel>
                                <FormControl>
                                  <Input {...field} type="tel" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="contactInformation.websiteURL"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Website URL</FormLabel>
                                <FormControl>
                                  <Input {...field} type="url" placeholder="https://" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <FormField
                          control={form.control}
                          name="contactInformation.officialAddress"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Official Address</FormLabel>
                              <FormControl>
                                <Textarea {...field} rows={3} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Representatives */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Representatives</h3>
                        {form.watch('representatives')?.map((_, index) => (
                          <div key={index} className="grid grid-cols-2 gap-4 p-4 border rounded-lg relative">
                            <FormField
                              control={form.control}
                              name={`representatives.${index}.name`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Name</FormLabel>
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name={`representatives.${index}.designation`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Designation</FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select designation" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="CEO">CEO</SelectItem>
                                      <SelectItem value="Manager">Manager</SelectItem>
                                      <SelectItem value="Relationship_Officer">Relationship Officer</SelectItem>
                                      <SelectItem value="Other">Other</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name={`representatives.${index}.email`}
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
                              name={`representatives.${index}.phone`}
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
                        </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            const currentReps = form.getValues('representatives') || [];
                            form.setValue('representatives', [
                              ...currentReps,
                              { name: "", designation: "", email: "", phone: "" }
                            ]);
                          }}
                          className="w-full"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Representative
                        </Button>
                      </div>
                    </div>
                  ) : (
                    // Step 2: Investment Preferences & Documents
                    <div className="space-y-4">
                      {/* Investment Preferences */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Investment Preferences</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="fundingPreferences.investmentRange.minimum"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Minimum Investment (INR)</FormLabel>
                                <FormControl>
                                  <Input {...field} type="number" min="0" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="fundingPreferences.investmentRange.maximum"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Maximum Investment (INR)</FormLabel>
                                <FormControl>
                                  <Input {...field} type="number" min="0" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={form.control}
                          name="fundingPreferences.preferredStages"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Preferred Investment Stages</FormLabel>
                              <Select
                                onValueChange={(value: string) => {
                                  const current = field.value || [];
                                  if (!current.includes(value)) {
                                    field.onChange([...current, value]);
                                  }
                                }}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select stages" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="Ideation">Ideation</SelectItem>
                                  <SelectItem value="Validation">Validation</SelectItem>
                                  <SelectItem value="Early_Traction">Early Traction</SelectItem>
                                  <SelectItem value="Scaling">Scaling</SelectItem>
                                  <SelectItem value="Growth">Growth</SelectItem>
                                </SelectContent>
                              </Select>
                              <div className="flex flex-wrap gap-2 mt-2">
                                {field.value?.map((stage: string, index: number) => (
                                  <Badge 
                                    key={index}
                                    variant="secondary"
                                    className="flex items-center gap-1"
                                  >
                                    {stage}
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
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="fundingPreferences.fundingTypes"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Funding Types Offered</FormLabel>
                              <Select
                                onValueChange={(value: string) => {
                                  const current = field.value || [];
                                  if (!current.includes(value)) {
                                    field.onChange([...current, value]);
                                  }
                                }}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select funding types" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="Equity_Funding">Equity Funding</SelectItem>
                                  <SelectItem value="Debt_Funding">Debt Funding</SelectItem>
                                  <SelectItem value="Grants">Grants</SelectItem>
                                  <SelectItem value="Convertible_Notes">Convertible Notes</SelectItem>
                                  <SelectItem value="Revenue_Based_Financing">Revenue Based Financing</SelectItem>
                                  <SelectItem value="Scholarship">Scholarship</SelectItem>
                                </SelectContent>
                              </Select>
                              <div className="flex flex-wrap gap-2 mt-2">
                                {field.value?.map((type: string, index: number) => (
                                  <Badge 
                                    key={index}
                                    variant="secondary"
                                    className="flex items-center gap-1"
                                  >
                                    {type.replace(/_/g, ' ')}
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
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="fundingPreferences.preferredSectors"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Preferred Sectors</FormLabel>
                              <Select
                                onValueChange={(value: string) => {
                                  const current = field.value || [];
                                  if (!current.includes(value)) {
                                    field.onChange([...current, value]);
                                  }
                                }}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select sectors" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {sectorOptions.map((sector) => (
                                    <SelectItem key={sector.value} value={sector.value}>
                                      {sector.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <div className="flex flex-wrap gap-2 mt-2">
                                {field.value?.map((sector: string, index: number) => (
                                  <Badge 
                                    key={index}
                                    variant="secondary"
                                    className="flex items-center gap-1"
                                  >
                                    {sector.replace(/_/g, ' ')}
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
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="fundingPreferences.disbursementMode"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Disbursement Mode</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select disbursement mode" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="Direct_Transfer">Direct Bank Transfer</SelectItem>
                                  <SelectItem value="Installments">Installments</SelectItem>
                                  <SelectItem value="Milestone_Based">Milestone Based</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Experience & Track Record */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Experience & Track Record</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="experience.yearsOfOperation"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Years of Operation</FormLabel>
                                <FormControl>
                                  <Input {...field} type="number" min="0" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="experience.totalInvestments"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Total Investments Made</FormLabel>
                                <FormControl>
                                  <Input {...field} type="number" min="0" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="experience.averageTicketSize"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Average Ticket Size (INR)</FormLabel>
                                <FormControl>
                                  <Input {...field} type="number" min="0" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="experience.successfulExits"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Successful Exits</FormLabel>
                                <FormControl>
                                  <Input {...field} type="number" min="0" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      {/* Required Documents */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Required Documents</h3>
                        <div className="grid gap-6">
                          <FormItem>
                            <FormLabel>Registration Certificate</FormLabel>
                            <FileUpload
                              label="Registration Certificate"
                              fileType="registrationCertificate"
                              accept="image/*,.pdf"
                              onFileChange={(fileData) => handleFileChange('registrationCertificate', fileData)}
                            />
                          </FormItem>

                          <FormItem>
                            <FormLabel>Government Approvals</FormLabel>
                            <FileUpload
                              label="Government Approvals"
                              fileType="governmentApprovals"
                              accept="image/*,.pdf"
                              onFileChange={(fileData) => handleFileChange('governmentApprovals', fileData)}
                            />
                          </FormItem>

                          <FormItem>
                            <FormLabel>Address Proof</FormLabel>
                            <FileUpload
                              label="Address Proof"
                              fileType="addressProof"
                              accept="image/*,.pdf"
                              onFileChange={(fileData) => handleFileChange('addressProof', fileData)}
                            />
                          </FormItem>

                          <FormItem>
                            <FormLabel>Tax Documents</FormLabel>
                            <FileUpload
                              label="Tax Documents"
                              fileType="taxDocuments"
                              accept="image/*,.pdf"
                              onFileChange={(fileData) => handleFileChange('taxDocuments', fileData)}
                            />
                          </FormItem>

                          <FormItem>
                            <FormLabel>Portfolio Document</FormLabel>
                            <FileUpload
                              label="Portfolio Document"
                              fileType="portfolioDocument"
                              accept="image/*,.pdf"
                              onFileChange={(fileData) => handleFileChange('portfolioDocument', fileData)}
                            />
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