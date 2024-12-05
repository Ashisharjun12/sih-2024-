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
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface FileData {
  file: File | null;
  uploadData?: {
    public_id: string;
    secure_url: string;
    originalName?: string;
    fileType?: string;
  };
}

const steps = [
  {
    id: 1,
    title: "Personal Information",
    description: "Basic personal details"
  },
  {
    id: 2,
    title: "Academic & Research",
    description: "Academic and research details"
  }
];

const positionOptions = [
  { value: "PROFESSOR", label: "Professor" },
  { value: "ASSOCIATE_PROFESSOR", label: "Associate Professor" },
  { value: "ASSISTANT_PROFESSOR", label: "Assistant Professor" },
  { value: "RESEARCH_FELLOW", label: "Research Fellow" },
  { value: "POSTDOC", label: "Postdoc" },
  { value: "OTHER", label: "Other" }
];

const qualificationOptions = [
  { value: "PHD", label: "PhD" },
  { value: "MASTERS", label: "Masters" },
  { value: "BACHELORS", label: "Bachelors" },
  { value: "OTHER", label: "Other" }
];

const idTypeOptions = [
  { value: "AADHAR", label: "Aadhar" },
  { value: "PAN", label: "PAN" },
  { value: "PASSPORT", label: "Passport" }
];

// Research fields from model
const researchFieldOptions = [
  "Artificial Intelligence (AI) and Machine Learning",
  "Climate Change and Environmental Science",
  "Biotechnology and Genetic Engineering",
  "Neuroscience",
  "Quantum Computing",
  "Nanotechnology",
  "Astrophysics and Space Research",
  "Public Health and Epidemiology",
  "Robotics",
  "Economics and Behavioral Science",
  "Materials Science",
  "Cognitive Science",
  "Pharmacology",
  "Philosophy and Ethics",
  "Sociology",
  "Political Science",
  "Educational Research",
  "Psychology",
  "Linguistics",
  "Anthropology",
  "Archaeology",
  "Biomedical Engineering",
  "Data Science",
  "Genomics",
  "Chemistry",
  "Physics",
  "Mathematics",
  "Electrical Engineering",
  "Mechanical Engineering",
  "Civil Engineering",
  "Renewable Energy",
  "Hydrology",
  "Oceanography",
  "Geology",
  "Agricultural Science",
  "Veterinary Science",
  "Public Administration",
  "Urban Studies and Planning",
  "Behavioral Economics",
  "Human-Computer Interaction",
  "Artificial Life",
  "Genetic Counseling",
  "Forensic Science",
  "Law and Legal Studies",
  "International Relations",
  "Sustainability Studies",
  "Game Theory",
  "Computer Vision",
  "Blockchain Technology",
  "Fashion Design and Technology"
]
.map(field => ({
  value: field,
  label: field
}));

// First, add the interface for the step components above the main component
interface StepProps {
  form: any;
  handleFileChange: (fileData: { file: File | null | File[]; uploadData?: any }) => void;
  selectedFields?: string[];
  setSelectedFields?: React.Dispatch<React.SetStateAction<string[]>>;
  handleRemoveResearch?: (index: number, isOngoing: boolean) => void;
  handleAddResearch?: (research: ResearchPaper, isOngoing: boolean) => void;
}

// Add this component before the main ResearcherRegistrationForm
function PersonalInfoStep({ 
  form, 
  handleFileChange, 
  selectedFields = [], 
  setSelectedFields 
}: StepProps) {
  return (
    <div className="space-y-6">
      {/* Personal Details */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Personal Details</h3>
        
        <FormField
          control={form.control}
          name="personalInfo.name"
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="personalInfo.email.address"
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
            name="personalInfo.phone.number"
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

      {/* Identity Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Identity Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    {idTypeOptions.map(option => (
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
            name="personalInfo.uniqueId.number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ID Number</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter your ID number" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      {/* Research Fields */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Research Fields</h3>
        
        <FormField
          control={form.control}
          name="personalInfo.fieldOfResearch"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fields of Research</FormLabel>
              <Select 
                onValueChange={(value) => {
                  if (setSelectedFields && !selectedFields.includes(value)) {
                    setSelectedFields([...selectedFields, value]);
                    field.onChange([...selectedFields, value]);
                  }
                }}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select research fields" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {researchFieldOptions.map(option => (
                    <SelectItem 
                      key={option.value} 
                      value={option.value}
                      disabled={selectedFields.includes(option.value)}
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedFields.map(field => (
                  <Badge 
                    key={field}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {field}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => {
                        if (setSelectedFields) {
                          const newFields = selectedFields.filter(f => f !== field);
                          setSelectedFields(newFields);
                          form.setValue('personalInfo.fieldOfResearch', newFields);
                        }
                      }}
                    />
                  </Badge>
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Profile Picture Upload */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Profile Picture</h3>
        <FileUpload
          label="Profile Picture"
          fileType="profilePicture"
          accept="image/*"
          onFileChange={handleFileChange}
        />
      </div>
    </div>
  );
}

// Add this component after PersonalInfoStep and before ResearcherRegistrationForm
function AcademicInfoStep({ 
  form, 
  handleFileChange,
  handleRemoveResearch,
  handleAddResearch 
}: StepProps) {
  const [showResearchModal, setShowResearchModal] = useState(false);
  const [isOngoing, setIsOngoing] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [doi, setDoi] = useState("");
  const [stage, setStage] = useState(isOngoing ? "Identifying a Research Problem or Question" : "Completed");
  const [images, setImages] = useState<Array<{ public_id: string; secure_url: string }>>([]);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});

  const handleResearchImageUpload = async (fileData: { file: File | null | File[]; uploadData?: any }) => {
    if (!fileData.file || !fileData.uploadData?.fileType) return;

    try {
      if (Array.isArray(fileData.file)) {
        // Track progress for each file
        const newProgress: Record<string, number> = {};
        fileData.file.forEach((file) => {
          newProgress[file.name] = 0;
        });
        setUploadProgress(newProgress);

        const uploadPromises = fileData.file.map(async (file) => {
          const formData = new FormData();
          formData.append('file', file);

          const response = await uploadFile(file, {
            onUploadProgress: (progressEvent: UploadProgressEvent) => {
              if (progressEvent.total) {
                const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                setUploadProgress(prev => ({
                  ...prev,
                  [file.name]: progress
                }));
              }
            }
          });

          if (!response.ok) {
            throw new Error('Upload failed');
          }

          // Clear progress after successful upload
          setUploadProgress(prev => {
            const newProgress = { ...prev };
            delete newProgress[file.name];
            return newProgress;
          });

          return await response.json();
        });

        const uploadResults = await Promise.allSettled(uploadPromises);
        
        const successfulUploads = uploadResults
          .filter((result): result is PromiseFulfilledResult<any> => result.status === 'fulfilled')
          .map(result => ({
            public_id: result.value.public_id,
            secure_url: result.value.secure_url
          }));

        if (successfulUploads.length > 0) {
          setImages(prev => [...prev, ...successfulUploads]);
        }
      }
    } catch (error) {
      console.error('Upload error:', error);
    }
  };

  const handleSubmission = (e: React.FormEvent) => {
    e.preventDefault();
    const research = {
      title,
      description,
      images,
      publicationDate: new Date(),
      doi,
      stage
    };
    handleAddResearch?.(research, isOngoing);
    setShowResearchModal(false);
    // Reset form
    setTitle("");
    setDescription("");
    setDoi("");
    setStage(isOngoing ? "Identifying a Research Problem or Question" : "Completed");
    setImages([]);
  };

  const renderProgressBars = () => {
    return Object.entries(uploadProgress).map(([fileName, progress]) => (
      <div key={fileName} className="space-y-1">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">{fileName}</span>
          <span className="text-muted-foreground">{progress}%</span>
        </div>
        <div className="h-1 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    ));
  };

  return (
    <div className="space-y-6">
      {/* Academic Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Academic Information</h3>
        
        <FormField
          control={form.control}
          name="academicInfo.institution"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Institution</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter your institution name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    {positionOptions.map(option => (
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
                <FormLabel>Department</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter your department" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="academicInfo.highestQualification"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Highest Qualification</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select qualification" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {qualificationOptions.map(option => (
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
            name="academicInfo.yearsOfExperience"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Years of Experience</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    type="number" 
                    min="0"
                    onChange={e => field.onChange(parseInt(e.target.value))}
                    placeholder="Enter years of experience" 
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
        
        <FormField
          control={form.control}
          name="professionalCredentials.orcid"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ORCID ID</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter your ORCID ID" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="professionalCredentials.googleScholar"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Google Scholar Profile</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter Google Scholar URL" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="professionalCredentials.researchGate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ResearchGate Profile</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter ResearchGate URL" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      {/* CV Upload */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Curriculum Vitae</h3>
        <FileUpload
          label="CV"
          fileType="cv"
          accept=".pdf,.jpg,.jpeg,.png"
          onFileChange={handleFileChange}
        />
      </div>

      {/* Research Papers Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Research Papers</h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              setIsOngoing(false);
              setShowResearchModal(true);
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Research Paper
          </Button>
        </div>

        <div className="grid gap-4">
          {form.watch("researchPapers")?.map((paper: ResearchPaper, index: number) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{paper.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {paper.description}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge>Completed</Badge>
                      {paper.doi && (
                        <Badge variant="outline">DOI: {paper.doi}</Badge>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveResearch?.(index, false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Ongoing Research Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Ongoing Research</h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              setIsOngoing(true);
              setShowResearchModal(true);
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Ongoing Research
          </Button>
        </div>

        <div className="grid gap-4">
          {form.watch("onGoingResearches")?.map((research: ResearchPaper, index: number) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{research.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {research.description}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="secondary">{research.stage}</Badge>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveResearch?.(index, true)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Research Modal */}
      <Dialog open={showResearchModal} onOpenChange={setShowResearchModal}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isOngoing ? "Add Ongoing Research" : "Add Research Paper"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmission} className="space-y-4">
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Research title"
                  required
                />
              </FormControl>
            </FormItem>

            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Research description"
                  required
                />
              </FormControl>
            </FormItem>

            <FormItem>
              <FormLabel>DOI (optional)</FormLabel>
              <FormControl>
                <Input 
                  value={doi}
                  onChange={(e) => setDoi(e.target.value)}
                  placeholder="Digital Object Identifier"
                />
              </FormControl>
            </FormItem>

            {isOngoing && (
              <FormItem>
                <FormLabel>Stage</FormLabel>
                <Select value={stage} onValueChange={setStage}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select research stage" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {researchStages.map((stage) => (
                      <SelectItem key={stage} value={stage}>
                        {stage}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}

            <FormItem>
              <FormLabel>Research Images</FormLabel>
              <div className="space-y-4">
                <FileUpload
                  label="Upload Images"
                  fileType="researchImages"
                  accept="image/*"
                  multiple={true}
                  onFileChange={handleResearchImageUpload}
                />
                
                {/* Upload Progress */}
                {renderProgressBars()}

              </div>
              {images.length === 0 && (
                <p className="text-sm text-muted-foreground mt-2">
                  Upload one or more images related to your research
                </p>
              )}
            </FormItem>

            <div className="flex justify-end gap-2 mt-4">
              <Button type="button" variant="outline" onClick={() => setShowResearchModal(false)}>
                Cancel
              </Button>
              <Button type="submit">
                Add Research
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Add this interface near the top with other interfaces
interface ResearchPaper {
  title: string;
  description: string;
  images: Array<{
    public_id: string;
    secure_url: string;
  }>;
  publicationDate: Date;
  doi?: string;
  stage: string;
}

const researchStages = [
  "Identifying a Research Problem or Question",
  "Conducting a Literature Review",
  "Formulating a Hypothesis or Research Objective",
  "Designing the Research Methodology",
  "Data Collection",
  "Data Analysis",
  "Interpreting Results",
  "Drawing Conclusions",
  "Reporting and Presenting Findings",
  "Publishing or Disseminating Results",
  "Reflection and Future Research"
] as const;

interface ResearchImage {
  public_id: string;
  secure_url: string;
}

// Add proper type for progress event
interface UploadProgressEvent {
  loaded: number;
  total?: number;
}

// Add proper type for fetch options with upload progress
interface ExtendedRequestInit extends RequestInit {
  onUploadProgress?: (progressEvent: UploadProgressEvent) => void;
}

const uploadFile = async (file: File, options: ExtendedRequestInit): Promise<Response> => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/upload', true);

    xhr.upload.onprogress = (e) => {
      if (options.onUploadProgress) {
        options.onUploadProgress({
          loaded: e.loaded,
          total: e.total
        });
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(new Response(xhr.response, {
          status: xhr.status,
          statusText: xhr.statusText
        }));
      } else {
        reject(new Error('Upload failed'));
      }
    };

    xhr.onerror = () => reject(new Error('Upload failed'));

    const formData = new FormData();
    formData.append('file', file);
    xhr.send(formData);
  });
};

// Add this interface near the top with other interfaces
interface ResearcherFormValues {
  personalInfo: {
    name: string;
    email: {
      address: string;
      verified: boolean;
    };
    phone: {
      number: string;
      verified: boolean;
    };
    uniqueId: {
      type: string;
      number: string;
    };
    fieldOfResearch: string[];
  };
  academicInfo: {
    institution: string;
    position: string;
    department: string;
    highestQualification: string;
    yearsOfExperience: number;
  };
  professionalCredentials: {
    orcid?: string;
    googleScholar?: string;
    researchGate?: string;
  };
  researchPapers: ResearchPaper[];
  onGoingResearches: ResearchPaper[];
}

export default function ResearcherRegistrationForm() {
  const { data: session } = useSession();
  const { toast } = useToast();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [files, setFiles] = useState<Record<string, FileData>>({});
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [images, setImages] = useState<ResearchImage[]>([]);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});

  const form = useForm<ResearcherFormValues>({
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
        fieldOfResearch: []
      },
      academicInfo: {
        institution: "",
        position: "RESEARCH_FELLOW",
        department: "",
        highestQualification: "PHD",
        yearsOfExperience: 0
      },
      professionalCredentials: {
        orcid: "",
        googleScholar: "",
        researchGate: ""
      },
      researchPapers: [],
      onGoingResearches: []
    }
  });

  const handleFileChange = async (fileData: { file: File | null | File[]; uploadData?: any }) => {
    if (!fileData.file || !fileData.uploadData?.fileType) return;

    try {
      if (fileData.uploadData.fileType === "researchImages" && Array.isArray(fileData.file)) {
        // Track progress for each file
        const newProgress: Record<string, number> = {};
        fileData.file.forEach((file) => {
          newProgress[file.name] = 0;
        });
        setUploadProgress(newProgress);

        const uploadPromises = fileData.file.map(async (file) => {
          const formData = new FormData();
          formData.append('file', file);

          const response = await uploadFile(file, {
            onUploadProgress: (progressEvent: UploadProgressEvent) => {
              if (progressEvent.total) {
                const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                setUploadProgress(prev => ({
                  ...prev,
                  [file.name]: progress
                }));
              }
            }
          });

          if (!response.ok) {
            throw new Error('Upload failed');
          }

          // Clear progress after successful upload
          setUploadProgress(prev => {
            const newProgress = { ...prev };
            delete newProgress[file.name];
            return newProgress;
          });

          return await response.json();
        });

        // Wait for all uploads to complete
        const uploadResults = await Promise.allSettled(uploadPromises);
        
        // Filter successful uploads and add to images
        const successfulUploads = uploadResults
          .filter((result): result is PromiseFulfilledResult<any> => result.status === 'fulfilled')
          .map(result => ({
            public_id: result.value.public_id,
            secure_url: result.value.secure_url
          }));

        if (successfulUploads.length > 0) {
          setImages(prev => [...prev, ...successfulUploads]);
        }

        // Check if any uploads failed
        const failedUploads = uploadResults.filter(result => result.status === 'rejected');
        if (failedUploads.length > 0) {
          toast({
            title: "Warning",
            description: `${failedUploads.length} image(s) failed to upload`,
            variant: "destructive"
          });
        }

      } else {
        // Handle single file uploads (profile picture, CV, etc.)
        const file = fileData.file as File;
        const formData = new FormData();
        formData.append('file', file);

        const response = await uploadFile(file, {
          onUploadProgress: (progressEvent: UploadProgressEvent) => {
            if (progressEvent.total) {
              const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              setUploadProgress(prev => ({
                ...prev,
                [file.name]: progress
              }));
            }
          }
        });

        if (!response.ok) {
          throw new Error('Upload failed');
        }

        const uploadData = await response.json();
        
        setFiles(prev => ({
          ...prev,
          [fileData.uploadData.fileType]: {
            file,
            uploadData: {
              ...uploadData,
              originalName: file.name,
              fileType: fileData.uploadData.fileType
            }
          }
        }));
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Error",
        description: "Failed to upload file(s)",
        variant: "destructive"
      });
    }
  };

  const onSubmission = async (data: ResearcherFormValues) => {
    try {
      console.log("Form submission started", data);
      setIsSubmitting(true);

      // Validate required files
      if (!files.profilePicture?.uploadData) {
        toast({
          title: "Error",
          description: "Profile picture is required",
          variant: "destructive"
        });
        return;
      }

      if (!files.cv?.uploadData) {
        toast({
          title: "Error",
          description: "CV is required",
          variant: "destructive"
        });
        return;
      }

      const formData = {
        ...data,
        files: {
          profilePicture: {
            public_id: files.profilePicture.uploadData.public_id,
            secure_url: files.profilePicture.uploadData.secure_url,
            originalName: files.profilePicture.uploadData.originalName
          },
          cv: {
            public_id: files.cv.uploadData.public_id,
            secure_url: files.cv.uploadData.secure_url,
            originalName: files.cv.uploadData.originalName
          }
        }
      };

      const response = await fetch("/api/forms/researcher", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formData })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to submit form");
      }

      toast({
        title: "Success",
        description: "Your researcher registration has been submitted for review"
      });

      router.push("/dashboard");

    } catch (error) {
      console.error("Form submission error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit form",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = (e: React.MouseEvent) => {e.preventDefault();setCurrentStep(2)};
  const prevStep = () => setCurrentStep(1);

  const handleAddResearch = (research: ResearchPaper, isOngoing: boolean) => {
    const currentResearches = form.getValues(isOngoing ? "onGoingResearches" : "researchPapers");
    form.setValue(
      isOngoing ? "onGoingResearches" : "researchPapers",
      [...currentResearches, research] as ResearchPaper[]
    );
  };

  const handleRemoveResearch = (index: number, isOngoing: boolean) => {
    const currentResearches = form.getValues(isOngoing ? "onGoingResearches" : "researchPapers");
    form.setValue(
      isOngoing ? "onGoingResearches" : "researchPapers",
      currentResearches.filter((_, i) => i !== index)
    );
  };

  return (
    <div className="container max-w-3xl py-8">
      <Card>
        <CardHeader>
          <CardTitle>Researcher Registration</CardTitle>
          <div className="mt-4">
            <div className="flex justify-between">
              {steps.map((step) => (
                <div
                  key={step.id}
                  className={cn(
                    "flex flex-col items-center space-y-2",
                    currentStep === step.id
                      ? "text-primary"
                      : "text-muted-foreground"
                  )}
                >
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full border-2 flex items-center justify-center",
                      currentStep === step.id
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-muted"
                    )}
                  >
                    {step.id}
                  </div>
                  <div className="text-sm font-medium">{step.title}</div>
                  <div className="text-xs">{step.description}</div>
                </div>
              ))}
            </div>
            <div className="relative mt-4">
              <div className="absolute top-1/2 w-full h-0.5 bg-muted" />
              <div
                className="absolute top-1/2 h-0.5 bg-primary transition-all"
                style={{
                  width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
                }}
              />
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form 
              className="space-y-8"
              onSubmit={(e) => {
                e.preventDefault();
                if (currentStep === 2) {
                  console.log("Form submission started");
                  form.handleSubmit(onSubmission)(e);
                }
              }}
            >
              {currentStep === 1 ? (
                <PersonalInfoStep 
                  form={form} 
                  handleFileChange={handleFileChange}
                  selectedFields={selectedFields}
                  setSelectedFields={setSelectedFields}
                />
              ) : (
                <AcademicInfoStep 
                  form={form} 
                  handleFileChange={handleFileChange}
                  handleRemoveResearch={handleRemoveResearch}
                  handleAddResearch={handleAddResearch}
                />
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between">
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
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
