"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface FundingAgencyFormData {
  userId: string;
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
    minimumInvestment: number;
    preferredStages: string[];
    fundingTypes: string[];
    preferredSectors: string[];
    preferredIndustries: string[];
  };
  documentation: {
    registrationCertificate: {
      public_id: string;
      secure_url: string;
    };
    governmentApprovals: {
      public_id: string;
      secure_url: string;
    };
    taxDocuments: {
      public_id: string;
      secure_url: string;
    };
  };
  experience: {
    yearsOfOperation: number;
    totalInvestments: number;
    averageTicketSize: number;
  };
  activeInvestments: Array<{
    startup: string;
    amount: number;
    date: string;
    status: string;
    documents: Array<{
      title: string;
      public_id: string;
      secure_url: string;
    }>;
  }>;
}

interface FileData {
  file: File | null;
  uploadData?: any;
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

const AGENCY_TYPES = [
  'Venture_Capital',
  'Angel_Network',
  'Crowdfunding_Platform',
  'Government_Body',
  'Financial_Institution',
  'Corporate_Investor',
  'NGO_Foundation'
] as const;

const FUNDING_STAGES = [
  'Ideation',
  'Validation', 
  'Early_Traction',
  'Scaling',
  'Growth'
] as const;

const FUNDING_TYPES = [
  'Private_Equity',
  'Equity_Funding',
  'Debt_Funding',
  'Grants',
  'Convertible_Notes',
  'Revenue_Based_Financing',
  'Scholarship'
] as const;

const INVESTMENT_STATUS = [
  'Proposed',
  'In_Progress',
  'Completed',
  'Cancelled'
] as const;

const PREFERRED_SECTORS = ['3d printing',
      'Accounting',
      'AdTech',
      'Advisory',
      'Agri-Tech',
      'Agricultural Chemicals',
      'Animal Husbandry',
      'Apparel',
      'Apparel & Accessories',
      'Application Development',
      'Art',
      'Assistance Technology',
      'Auto & Truck Manufacturers',
      'Auto Vehicles, Parts & Service Retailers',
      'Auto, Truck & Motorcycle Parts',
      'Aviation & Others',
      'Baby Care',
      'Big Data',
      'Billing and Invoicing',
      'Biotechnology',
      'Bitcoin and Blockchain',
      'BPO',
      'Branding',
      'Business Finance',
      'Business Intelligence',
      'Business Support Services',
      'Business Support Supplies',
      'Clean Tech',
      'Cloud',
      'Coaching',
      'Collaboration',
      'Commercial Printing Services',
      'Commodity Chemicals',
      'Comparison Shopping',
      'Computer & Electronics Retailers',
      'Construction & Engineering',
      'Construction Materials',
      'Construction Supplies & Fixtures',
      'Corporate Social Responsibility',
      'Coworking Spaces',
      'Crowdfunding',
      'Customer Support',
      'CXM',
      'Cyber Security',
      'Dairy Farming',
      'Data Science',
      'Defence Equipment',
      'Digital Marketing (SEO Automation)',
      'Digital Media',
      'Digital Media Blogging',
      'Digital Media News',
      'Digital Media Publishing',
      'Digital Media Video',
      'Discovery',
      'Diversified Chemicals',
      'Drones',
      'E-Commerce',
      'E-learning',
      'Technology',
      'Healthcare',
      'Education',
      'Education Technology',
      'Electric Vehicles',
      'Electronics',
      'Embedded',
      'Employment Services',
      'Enterprise Mobility',
      'Entertainment',
      'Environmental Services & Equipment',
      'ERP',
      'Events Management',
      'Experiential Travel',
      'Facility Management',
      'Fan Merchandise',
      'Fantasy Sports',
      'Fashion Technology',
      'Fisheries',
      'Food Processing',
      'Food Technology/Food Delivery',
      'Foreign Exchange',
      'Freight & Logistics Services',
      'Handicraft',
      'Health & Wellness',
      'Healthcare IT',
      'Healthcare Services',
      'Healthcare Technology',
      'Holiday Rentals',
      'Home Care',
      'Home Furnishings Retailers',
      'Home Improvement Products & Services Retailers',
      'Home Security solutions',
      'Homebuilding',
      'Horticulture',
      'Hospitality',
      'Hotel',
      'Housing',
      'Industrial Design',
      'Insurance',
      'Integrated communication services',
      'Internships',
      'IT Consulting',
      'IT Management',
      'Jewellery',
      'KPO',
      'Laundry',
      'Leather Footwear',
      'Leather Textiles Goods',
      'Lifestyle',
      'Location Based',
      'Loyalty',
      'Machine Learning',
      'Manufacture of Electrical Equipment',
      'Manufacture of Machinery and Equipment',
      'Manufacturing',
      'Manufacturing & Warehouse',
      'Market Research',
      'Media and Entertainment',
      'Medical Devices Biomedical',
      'Microbrewery',
      'Microfinance',
      'Mobile wallets Payments',
      'Movies',
      'Natural Language Processing',
      'Network Technology Solutions',
      'New-age Construction Technologies',
      'NGO',
      'NLP',
      'Non- Leather Footwear',
      'Non- Leather Textiles Goods',
      'Oil & Gas Drilling',
      'Oil & Gas Exploration and Production',
      'Oil & Gas Transportation Services',
      'Oil Related Services and Equipment',
      'Online Classified',
      'OOH Media',
      'Organic Agriculture',
      'Others',
      'P2P Lending',
      'Passenger Transportation Services',
      'Payment Platforms',
      'Personal Care',
      'Personal Finance',
      'Personal Security',
      'Pharmaceutical',
      'Photography',
      'Physical Toys and Games',
      'Point of Sales',
      'Product Development',
      'Professional Information Services',
      'Project Management',
      'Public Citizen Security Solutions',
      'Recruitment Jobs',
      'Renewable Energy Solutions',
      'Renewable Nuclear Energy',
      'Renewable Solar Energy',
      'Renewable Wind Energy',
      'Restaurants',
      'Retail Technology',
      'Robotics Application',
      'Robotics Technology',
      'Sales',
      'SCM',
      'Semiconductor',
      'Skill Development',
      'Skills Assessment',
      'Smart Home',
      'Social Commerce',
      'Social Media',
      'Social Media',
      'Space Technology',
      'Specialty Chemicals',
      'Sports Promotion and Networking',
      'Talent Management',
      'Testing',
      'Ticketing',
      'Tires & Rubber Products',
      'Trading',
      'Traffic Management',
      'Training',
      'Transport Infrastructure',
      'Utility Services',
      'Virtual Games',
      'Waste Management',
      'Wayside Amenities',
      'Wearables',
      'Web Design',
      'Web Development',
      'Weddings',
      'Wireless'] as const;

const PREFERRED_INDUSTRIES = [
  'Advertising',
  'Aeronautics Aerospace & Defence',
  'Agriculture',
  'AI',
  'Airport Operations',
  'Analytics',
  'Animation',
  'AR VR (Augmented + Virtual Reality)',
  'Architecture Interior Design',
  'Art & Photography',
  'Automotive',
  'Biotechnology',
  'Chemicals',
  'Computer Vision',
  'Construction',
  'Dating Matrimonial',
  'Design',
  'Education',
  'Enterprise Software',
  'Events',
  'Fashion',
  'Finance Technology',
  'Food & Beverages',
  'Green Technology',
  'Healthcare & Lifesciences',
  'House-Hold Services',
  'Human Resources',
  'Indic Language Startups',
  'Internet of Things',
  'IT Services',
  'Logistics',
  'Marketing',
  'Media & Entertainment',
  'Nanotechnology',
  'Non- Renewable Energy',
  'Other Specialty Retailers',
  'Others',
  'Passenger Experience',
  'Pets & Animals',
  'Professional & Commercial Services',
  'Real Estate',
  'Renewable Energy',
  'Retail',
  'Robotics',
  'Safety',
  'Security Solutions',
  'Social Impact',
  'Social Network',
  'Sports',
  'Technology Hardware',
  'Telecommunication & Networking',
  'Textiles & Apparel',
  'Toys and Games',
  'Transportation & Storage',
  'Travel & Tourism',
  'Waste Management'
] as const;

export default function FundingAgencyRegistrationForm() {
  const { data: session } = useSession();
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [files, setFiles] = useState<Record<string, FileData>>({});

  const form = useForm<FundingAgencyFormData>({
    defaultValues: {
      agencyDetails: {
        name: "",
        registrationNumber: "",
        type: "",
        establishmentDate: "",
        description: ""
      },
      contactInformation: {
        officialAddress: "",
        officialEmail: "",
        phoneNumber: "",
        websiteURL: ""
      },
      representatives: [],
      fundingPreferences: {
        minimumInvestment: 0,
        preferredStages: [],
        fundingTypes: [],
        preferredSectors: [],
        preferredIndustries: []
      },
      experience: {
        yearsOfOperation: 0,
        totalInvestments: 0,
        averageTicketSize: 0
      },
      activeInvestments: []
    }
  });

  const handleFileChange = (fileType: string, fileData: FileData) => {
    setFiles(prev => ({
      ...prev,
      [fileType]: fileData
    }));
  };

  const onSubmit = async (data: FundingAgencyFormData) => {
    try {
      setIsSubmitting(true);
      
      // First upload all files
      const uploadedFiles: Record<string, { public_id: string; secure_url: string }> = {};
      
      for (const [fileType, fileData] of Object.entries(files)) {
        if (fileData.file) {
          const formData = new FormData();
          formData.append('file', fileData.file);
          
          const uploadResponse = await fetch('/api/upload', {
            method: 'POST',
            body: formData
          });
          
          if (!uploadResponse.ok) {
            throw new Error(`Failed to upload ${fileType}`);
          }
          
          uploadedFiles[fileType] = await uploadResponse.json();
        }
      }

      // Log the form data being sent
      console.log("Submitting form data:", {
        formData: {
          ...data,
          documentation: {
            registrationCertificate: uploadedFiles.registrationCertificate,
            governmentApprovals: uploadedFiles.governmentApprovals,
            taxDocuments: uploadedFiles.taxDocuments
          }
        }
      });

      // Submit form data
      const response = await fetch('/api/forms/fundingAgency', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formData: {
            ...data,
            documentation: {
              registrationCertificate: uploadedFiles.registrationCertificate,
              governmentApprovals: uploadedFiles.governmentApprovals,
              taxDocuments: uploadedFiles.taxDocuments
            }
          }
        })
      });

      const result = await response.json();
      console.log("API Response:", result);

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit form');
      }

      toast({
        title: "Success",
        description: "Your funding agency application has been submitted for review",
      });

      // router.push("/dashboard");
    } catch (error) {
      console.error("Form submission error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit form",
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
                                  <Input {...field} placeholder="Enter agency name" />
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
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select agency type" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {AGENCY_TYPES.map((type) => (
                                      <SelectItem key={type} value={type}>
                                        {type.replace(/_/g, ' ')}
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
                                  <Input 
                                    type="date" 
                                    {...field}
                                    onChange={(e) => field.onChange(e.target.value)}
                                  />
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
                            name="fundingPreferences.minimumInvestment"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Minimum Investment</FormLabel>
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
                                  {FUNDING_STAGES.map((stage) => (
                                    <SelectItem key={stage} value={stage}>
                                      {stage.replace(/_/g, ' ')}
                                    </SelectItem>
                                  ))}
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
                                  {FUNDING_TYPES.map((type) => (
                                    <SelectItem key={type} value={type}>
                                      {type.replace(/_/g, ' ')}
                                    </SelectItem>
                                  ))}
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
                                onValueChange={(value) => {
                                  const current = field.value || [];
                                  if (!current.includes(value)) {
                                    field.onChange([...current, value]);
                                  }
                                }}
                                value=""
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select sectors" />
                                </SelectTrigger>
                                <SelectContent>
                                  {PREFERRED_SECTORS.map((sector) => (
                                    <SelectItem key={sector} value={sector}>
                                      {sector}
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
                                    {sector}
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
                          name="fundingPreferences.preferredIndustries"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Preferred Industries</FormLabel>
                              <Select
                                onValueChange={(value) => {
                                  const current = field.value || [];
                                  if (!current.includes(value)) {
                                    field.onChange([...current, value]);
                                  }
                                }}
                                value=""
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select industries" />
                                </SelectTrigger>
                                <SelectContent>
                                  {PREFERRED_INDUSTRIES.map((industry) => (
                                    <SelectItem key={industry} value={industry}>
                                      {industry}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <div className="flex flex-wrap gap-2 mt-2">
                                {field.value?.map((industry: string, index: number) => (
                                  <Badge 
                                    key={index}
                                    variant="secondary"
                                    className="flex items-center gap-1"
                                  >
                                    {industry}
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
                        </div>
                      </div>

                      {/* Required Documents */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Required Documents</h3>
                        <div className="grid gap-6">
                          <FormItem>
                            <FormLabel>Registration Certificate</FormLabel>
                            <FileUpload
                              label="Upload Registration Certificate"
                              fileType="registrationCertificate"
                              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                              onFileChange={(fileData) => handleFileChange('registrationCertificate', fileData)}
                            />
                          </FormItem>

                          <FormItem>
                            <FormLabel>Government Approvals</FormLabel>
                            <FileUpload
                              label="Upload Government Approvals"
                              fileType="governmentApprovals"
                              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                              onFileChange={(fileData) => handleFileChange('governmentApprovals', fileData)}
                            />
                          </FormItem>

                          <FormItem>
                            <FormLabel>Tax Documents</FormLabel>
                            <FileUpload
                              label="Upload Tax Documents"
                              fileType="taxDocuments"
                              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                              onFileChange={(fileData) => handleFileChange('taxDocuments', fileData)}
                            />
                          </FormItem>
                        </div>
                      </div>

                      {/* Active Investments */}
                      <FormField
                        control={form.control}
                        name="activeInvestments"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Active Investments</FormLabel>
                            <div className="space-y-4">
                              {field.value.map((investment, index) => (
                                <div key={index} className="flex gap-4">
                                  <Input
                                    placeholder="Startup Name"
                                    value={investment.startup}
                                    onChange={(e) => {
                                      const newValue = [...field.value];
                                      newValue[index].startup = e.target.value;
                                      field.onChange(newValue);
                                    }}
                                  />
                                  <Input
                                    type="number"
                                    placeholder="Amount"
                                    value={investment.amount}
                                    onChange={(e) => {
                                      const newValue = [...field.value];
                                      newValue[index].amount = Number(e.target.value);
                                      field.onChange(newValue);
                                    }}
                                  />
                                  <Input
                                    type="date"
                                    value={investment.date}
                                    onChange={(e) => {
                                      const newValue = [...field.value];
                                      newValue[index].date = e.target.value;
                                      field.onChange(newValue);
                                    }}
                                  />
                                  <Select
                                    value={investment.status}
                                    onValueChange={(value) => {
                                      const newValue = [...field.value];
                                      newValue[index].status = value;
                                      field.onChange(newValue);
                                    }}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {INVESTMENT_STATUS.map((status) => (
                                        <SelectItem key={status} value={status}>
                                          {status.replace(/_/g, ' ')}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <Button
                                    type="button"
                                    variant="destructive"
                                    size="icon"
                                    onClick={() => {
                                      const newValue = field.value.filter((_, i) => i !== index);
                                      field.onChange(newValue);
                                    }}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              ))}
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                  field.onChange([
                                    ...field.value,
                                    { startup: '', amount: 0, date: '', status: '', documents: [] }
                                  ]);
                                }}
                              >
                                <Plus className="h-4 w-4 mr-2" />
                                Add Investment
                              </Button>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
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