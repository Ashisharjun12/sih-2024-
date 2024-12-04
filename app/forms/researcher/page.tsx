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

const steps = [
  {
    id: 1,
    title: "Personal Information",
    description: "Basic personal details",
  },
  {
    id: 2,
    title: "Academic & Research",
    description: "Academic and research details",
  }
];

const positionOptions = [
  { value: 'PROFESSOR', label: 'Professor' },
  { value: 'ASSOCIATE_PROFESSOR', label: 'Associate Professor' },
  { value: 'ASSISTANT_PROFESSOR', label: 'Assistant Professor' },
  { value: 'RESEARCH_FELLOW', label: 'Research Fellow' },
  { value: 'POSTDOC', label: 'Postdoc' },
  { value: 'OTHER', label: 'Other' }
];

const fieldOfResearchOptions = [
  { value: "ARTIFICIAL_INTELLIGENCE", label: "Artificial Intelligence" },
  { value: "BIOTECHNOLOGY", label: "Biotechnology" },
  { value: "COMPUTER_SCIENCE", label: "Computer Science" },
  { value: "NANOTECHNOLOGY", label: "Nanotechnology" },
  { value: "RENEWABLE_ENERGY", label: "Renewable Energy" },
  { value: "OTHER", label: "Other" }
];

const qualificationOptions = [
  { value: "PHD", label: "Ph.D" },
  { value: "MASTERS", label: "Masters" },
  { value: "BACHELORS", label: "Bachelors" },
  { value: "OTHER", label: "Other" }
];

const departmentOptions = [
  { value: "COMPUTER_SCIENCE", label: "Computer Science" },
  { value: "ELECTRICAL_ENGINEERING", label: "Electrical Engineering" },
  { value: "MECHANICAL_ENGINEERING", label: "Mechanical Engineering" },
  { value: "BIOTECHNOLOGY", label: "Biotechnology" },
  { value: "PHYSICS", label: "Physics" },
  { value: "CHEMISTRY", label: "Chemistry" },
  { value: "MATHEMATICS", label: "Mathematics" },
  { value: "OTHER", label: "Other" }
];

export default function ResearcherRegistrationForm() {
  const { data: session } = useSession();
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [files, setFiles] = useState<Record<string, FileData>>({});
  const [isOtherFieldOfResearch, setIsOtherFieldOfResearch] = useState(false);
  const [isOtherQualification, setIsOtherQualification] = useState(false);
  const [isOtherDepartment, setIsOtherDepartment] = useState(false);

  const form = useForm({
    defaultValues: {
      personalInfo: {
        name: session?.user?.name || "",
        email: {
          address: session?.user?.email || "",
          verified: false
        },
        phone: {
          number: "",
          verified: false
        },
        uniqueId: {
          type: "AADHAR",
          number: ""
        },
        fieldOfResearch: ""
      },
      academicInfo: {
        institution: "",
        position: "",
        department: "",
        highestQualification: "",
        yearsOfExperience: 0
      },
      researchDetails: {
        researchTopic: "",
        expertiseAreas: [],
        ongoingProjects: []
      },
      professionalCredentials: {
        publicationNumber: 0,
        researchIds: {
          orcid: "",
          googleScholar: "",
          researchGate: ""
        },
        publications: [],
        fundingAgency: "",
        achievements: []
      },
      interests: {
        preferredCollaboration: "BOTH",
        willingToMentor: false
      }
    }
  });

  const nextStep = () => setCurrentStep(2);
  const prevStep = () => setCurrentStep(1);

  const handleFileChange = (type: string, fileData: { file: File | null; uploadData?: any }) => {
    if (fileData) {
      setFiles(prev => ({
        ...prev,
        [type]: {
          file: fileData.file,
          url: fileData.uploadData?.secure_url || '',
          public_id: fileData.uploadData?.public_id || '',
          originalName: fileData.uploadData?.originalName || '',
          fileType: fileData.uploadData?.fileType || ''
        }
      }));
    } else {
      const newFiles = { ...files };
      delete newFiles[type];
      setFiles(newFiles);
    }
  };

  const onSubmit = async (data: any) => {
    try {
      console.log( "form data on submit ",data);
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
          if (value) {
            acc[key] = {
              public_id: value.public_id,
              secure_url: value.url,
              originalName: value.originalName,
              fileType: value.fileType,
            };
          }
          return acc;
        }, {} as Record<string, any>),
        userId: session.user.id,
        userEmail: session.user.email,
        userName: session.user.name,
      };


      console.log("formData",formData);
      // Submit form
      const response = await fetch("/api/forms/researcher", {
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
        description: "Your researcher profile has been submitted successfully.",
      });

      // Wait for 2 seconds before redirecting
      // setTimeout(() => {
      //   router.push("/");
      // }, 2000);

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

  return (
    <div className="container max-w-3xl py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Researcher Registration</CardTitle>
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
                    // Step 1: Personal Information
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="personalInfo.name"
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
                          name="personalInfo.email.address"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <div className="flex gap-2">
                                <FormControl>
                                  <Input {...field} type="email" />
                                </FormControl>
                                <Button 
                                  type="button" 
                                  variant="outline" 
                                  size="sm"
                                  disabled={field.value === ""}
                                >
                                  Verify
                                </Button>
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="personalInfo.phone.number"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone Number</FormLabel>
                              <div className="flex gap-2">
                                <FormControl>
                                  <Input {...field} type="tel" />
                                </FormControl>
                                <Button 
                                  type="button" 
                                  variant="outline" 
                                  size="sm"
                                  disabled={field.value === ""}
                                >
                                  Verify
                                </Button>
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="personalInfo.uniqueId.type"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>ID Type</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select ID type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="AADHAR">Aadhar</SelectItem>
                                  <SelectItem value="PAN">PAN</SelectItem>
                                  <SelectItem value="PASSPORT">Passport</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="personalInfo.uniqueId.number"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>ID Number</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="personalInfo.fieldOfResearch"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Field of Research</FormLabel>
                              <FormControl>
                                {!isOtherFieldOfResearch ? (
                                  <Select
                                    onValueChange={(value) => {
                                      if (value === "OTHER") {
                                        setIsOtherFieldOfResearch(true);
                                        field.onChange("");
                                      } else {
                                        field.onChange(value);
                                      }
                                    }}
                                    defaultValue={field.value}
                                  >
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select field of research" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {fieldOfResearchOptions.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                          {option.label}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                ) : (
                                  <div className="flex gap-2">
                                    <Input
                                      {...field}
                                      placeholder="Enter your field of research"
                                      className="flex-1"
                                    />
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="sm"
                                      onClick={() => {
                                        setIsOtherFieldOfResearch(false);
                                        field.onChange("");
                                      }}
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </div>
                                )}
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Document Upload Section */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Documents</h3>
                        <div className="grid gap-4">
                          <FormItem>
                            <FormLabel>Profile Picture</FormLabel>
                            <FileUpload
                              label="Upload Profile Picture"
                              fileType="profilePicture"
                              accept="image/*"
                              onFileChange={(fileData) => handleFileChange('profilePicture', fileData)}
                            />
                            <FormDescription>
                              Upload a clear profile picture
                            </FormDescription>
                          </FormItem>

                          <FormItem>
                            <FormLabel>CV/Resume</FormLabel>
                            <FileUpload
                              label="Upload CV"
                              fileType="cv"
                              accept="image/*"
                              onFileChange={(fileData) => handleFileChange('cv', fileData)}
                            />
                            <FormDescription>
                              Upload a clear image of your CV
                            </FormDescription>
                          </FormItem>

                          <FormItem>
                            <FormLabel>Identity Proof</FormLabel>
                            <FileUpload
                              label="Upload ID Proof"
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
                    </div>
                  ) : (
                    // Step 2: Academic & Research Information
                    <div className="space-y-6">
                      {/* Academic Information */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Academic Information</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="academicInfo.institution"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Affiliation/Institution</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="academicInfo.position"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Position</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select position" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {positionOptions.map((option) => (
                                      <SelectItem key={option.value} value={option.value}>
                                        {option.label}
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
                            name="academicInfo.department"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Department/Field</FormLabel>
                                <FormControl>
                                  {!isOtherDepartment ? (
                                    <Select
                                      onValueChange={(value) => {
                                        if (value === "OTHER") {
                                          setIsOtherDepartment(true);
                                          field.onChange("");
                                        } else {
                                          field.onChange(value);
                                        }
                                      }}
                                      defaultValue={field.value}
                                    >
                                      <FormControl>
                                        <SelectTrigger>
                                          <SelectValue placeholder="Select department" />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        {departmentOptions.map((option) => (
                                          <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  ) : (
                                    <div className="flex gap-2">
                                      <Input
                                        {...field}
                                        placeholder="Enter your department"
                                        className="flex-1"
                                      />
                                      <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                          setIsOtherDepartment(false);
                                          field.onChange("");
                                        }}
                                      >
                                        <X className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  )}
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="academicInfo.yearsOfExperience"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Years of Experience</FormLabel>
                                <FormControl>
                                  <Input type="number" {...field} min="0" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="academicInfo.highestQualification"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Highest Qualification</FormLabel>
                                <FormControl>
                                  {!isOtherQualification ? (
                                    <Select
                                      onValueChange={(value) => {
                                        if (value === "OTHER") {
                                          setIsOtherQualification(true);
                                          field.onChange("");
                                        } else {
                                          field.onChange(value);
                                        }
                                      }}
                                      defaultValue={field.value}
                                    >
                                      <FormControl>
                                        <SelectTrigger>
                                          <SelectValue placeholder="Select qualification" />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        {qualificationOptions.map((option) => (
                                          <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  ) : (
                                    <div className="flex gap-2">
                                      <Input
                                        {...field}
                                        placeholder="Enter your qualification"
                                        className="flex-1"
                                      />
                                      <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                          setIsOtherQualification(false);
                                          field.onChange("");
                                        }}
                                      >
                                        <X className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  )}
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      {/* Research Details */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Research Details</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="researchDetails.researchTopic"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Research Topic</FormLabel>
                                <FormControl>
                                  <Textarea {...field} placeholder="Describe your research topic" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="researchDetails.expertiseAreas"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Expertise Areas</FormLabel>
                                <div className="flex flex-wrap gap-2 mb-2">
                                  {field.value?.map((area, index) => (
                                    <Badge key={index} variant="secondary">
                                      {area}
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="ml-1 h-4 w-4 p-0"
                                        onClick={() => {
                                          const newAreas = field.value.filter((_, i) => i !== index);
                                          field.onChange(newAreas);
                                        }}
                                      >
                                        <X className="h-3 w-3" />
                                      </Button>
                                    </Badge>
                                  ))}
                                </div>
                                <FormControl>
                                  <Input
                                    placeholder="Add expertise and press Enter"
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter') {
                                        e.preventDefault();
                                        const value = e.currentTarget.value.trim();
                                        if (value) {
                                          field.onChange([...field.value || [], value]);
                                          e.currentTarget.value = '';
                                        }
                                      }
                                    }}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      {/* Professional Credentials */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Professional Credentials</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="professionalCredentials.researchIds.orcid"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>ORCID ID</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="Enter ORCID ID" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="professionalCredentials.researchIds.googleScholar"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Google Scholar ID</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="Enter Google Scholar ID" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="professionalCredentials.researchIds.researchGate"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>ResearchGate Profile</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="Enter ResearchGate profile URL" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      {/* Interests */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Interests</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="interests.preferredCollaboration"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Preferred Collaboration</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="ACADEMIC">Academic</SelectItem>
                                    <SelectItem value="INDUSTRY">Industry</SelectItem>
                                    <SelectItem value="BOTH">Both</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="interests.willingToMentor"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Willing to Mentor?</FormLabel>
                                <Select 
                                  onValueChange={(value) => field.onChange(value === 'true')} 
                                  defaultValue={field.value.toString()}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select option" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="true">Yes</SelectItem>
                                    <SelectItem value="false">No</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
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