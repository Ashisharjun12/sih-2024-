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
import { researcherFormSchema } from "@/lib/validations/researcher";
import { Switch } from "@/components/ui/switch";

export default function ResearcherRegistrationForm() {
  const { data: session } = useSession();
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [files, setFiles] = useState<{
    identityProof?: File | null;
    cv?: File | null;
    researchPaper?: File | null;
    certificates?: File[];
  }>({});

  const form = useForm<z.infer<typeof researcherFormSchema>>({
    resolver: zodResolver(researcherFormSchema),
    defaultValues: {
      personalInfo: {
        fullName: session?.user?.name || "",
        email: session?.user?.email || "",
        phone: "",
        institution: "",
        department: "",
        designation: "",
        orcid: "",
        identityProof: {
          type: "Aadhar",
          number: "",
        },
      },
      academicInfo: {
        highestQualification: "",
        specialization: "",
        yearsOfExperience: 0,
        researchInterests: [],
      },
      researchProposal: {
        title: "",
        abstract: "",
        objectives: "",
        methodology: "",
        expectedOutcome: "",
        timeline: "",
        fundingRequired: false,
        fundingAmount: 0,
      },
    },
  });

  async function onSubmit(values: z.infer<typeof researcherFormSchema>) {
    if (!session?.user) {
      toast({
        title: "Error",
        description: "You must be logged in to submit this form",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Upload files to Cloudinary
      const uploadedFiles = await uploadFiles(files);

      // Combine form data with uploaded file URLs
      const formData = {
        ...values,
        documents: uploadedFiles,
        userId: session.user.id,
      };

      const response = await fetch("/api/forms/researcher", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to submit form");

      toast({
        title: "Success",
        description: "Your researcher registration form has been submitted for review",
      });

      router.push("/dashboard");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit form. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  // Function to handle file uploads to Cloudinary
  async function uploadFiles(files: Record<string, File | null | File[]>) {
    const uploadedFiles: Record<string, { public_id: string; secure_url: string }[]> = {};

    for (const [key, value] of Object.entries(files)) {
      if (!value) continue;

      const filesToUpload = Array.isArray(value) ? value : [value];
      uploadedFiles[key] = [];

      for (const file of filesToUpload) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "researcher_docs");

        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`,
          {
            method: "POST",
            body: formData,
          }
        );

        if (!response.ok) throw new Error(`Failed to upload ${key}`);

        const data = await response.json();
        uploadedFiles[key].push({
          public_id: data.public_id,
          secure_url: data.secure_url,
        });
      }
    }

    return uploadedFiles;
  }

  return (
    <div className="container max-w-3xl py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Researcher Registration</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Personal Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="personalInfo.fullName"
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
                      name="personalInfo.email"
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
                      name="personalInfo.phone"
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
                      name="personalInfo.orcid"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>ORCID ID</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="personalInfo.institution"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Institution</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="personalInfo.department"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Department</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="personalInfo.designation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Designation</FormLabel>
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
                      name="personalInfo.identityProof.type"
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
                      name="personalInfo.identityProof.number"
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
                        accept="image/*,application/pdf"
                        onFileChange={(file) => setFiles({ ...files, identityProof: file })}
                      />
                    </FormItem>
                  </div>
                </div>

                {/* Academic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Academic Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="academicInfo.highestQualification"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Highest Qualification</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="academicInfo.specialization"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Specialization</FormLabel>
                          <FormControl>
                            <Input {...field} />
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
                            <Input {...field} type="number" min="0" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Research Proposal */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Research Proposal</h3>
                  <FormField
                    control={form.control}
                    name="researchProposal.title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Research Title</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="researchProposal.abstract"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Abstract</FormLabel>
                        <FormControl>
                          <Textarea 
                            {...field} 
                            className="min-h-[100px]"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="researchProposal.objectives"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Objectives</FormLabel>
                        <FormControl>
                          <Textarea 
                            {...field} 
                            className="min-h-[100px]"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="researchProposal.methodology"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Methodology</FormLabel>
                        <FormControl>
                          <Textarea 
                            {...field} 
                            className="min-h-[100px]"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="researchProposal.fundingRequired"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Funding Required
                          </FormLabel>
                          <FormDescription>
                            Do you require funding for this research?
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                {/* Document Uploads */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Required Documents</h3>
                  
                  <div className="grid gap-6">
                    <FormItem>
                      <FormLabel>CV/Resume</FormLabel>
                      <FileUpload
                        label="CV"
                        accept=".pdf,.doc,.docx"
                        onFileChange={(file) => setFiles({ ...files, cv: file })}
                      />
                    </FormItem>

                    <FormItem>
                      <FormLabel>Research Papers (if any)</FormLabel>
                      <FileUpload
                        label="Research Papers"
                        accept=".pdf"
                        onFileChange={(file) => setFiles({ ...files, researchPaper: file })}
                      />
                    </FormItem>

                    <FormItem>
                      <FormLabel>Certificates</FormLabel>
                      <FileUpload
                        label="Certificates"
                        accept=".pdf,image/*"
                        onFileChange={(file) => {
                          if (file) {
                            setFiles(prev => ({
                              ...prev,
                              certificates: [...(prev.certificates || []), file]
                            }));
                          }
                        }}
                      />
                    </FormItem>
                  </div>
                </div>

                <Button type="submit" disabled={isSubmitting} className="w-full">
                  {isSubmitting ? "Submitting..." : "Submit Registration"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
} 