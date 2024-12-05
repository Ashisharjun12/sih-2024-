"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { 
  CheckCircle, 
  XCircle, 
  FileText,
  Download,
  User,
  GraduationCap,
  Award,
  Brain,
  FileCheck,
  Microscope,
} from "lucide-react";

interface FormSubmission {
  _id: string;
  userId: string;
  userName: string;
  userEmail: string;
  formType: string;
  status: "pending" | "approved" | "rejected";
  submittedAt: string;
  formData: {
    personalInfo: {
      name: string;
      email: { address: string; verified: boolean };
      phone: { number: string; verified: boolean };
      uniqueId: { type: string; number: string };
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
      orcid: string;
      googleScholar: string;
      researchGate: string;
    };
    researchPapers: Array<{
      title: string;
      description: string;
      images: Array<{
        public_id: string;
        secure_url: string;
      }>;
      publicationDate: Date;
      doi?: string;
      stage: string;
    }>;
    onGoingResearches: Array<{
      title: string;
      description: string;
      images: Array<{
        public_id: string;
        secure_url: string;
      }>;
      publicationDate: Date;
      doi?: string;
      stage: string;
    }>;
    files: {
      profilePicture: {
        public_id: string;
        secure_url: string;
        originalName: string;
      };
      cv: {
        public_id: string;
        secure_url: string;
        originalName: string;
      };
    };
  };
}

const FormSection = ({ 
  title, 
  icon: Icon, 
  children 
}: { 
  title: string; 
  icon: any; 
  children: React.ReactNode;
}) => (
  <Card>
    <CardHeader className="border-b">
      <div className="flex items-center gap-2">
        <Icon className="h-5 w-5 text-primary" />
        <CardTitle>{title}</CardTitle>
      </div>
    </CardHeader>
    <CardContent className="pt-6">{children}</CardContent>
  </Card>
);

const InfoItem = ({ label, value }: { label: string; value: any }) => (
  <div>
    <p className="text-sm text-muted-foreground">{label}</p>
    <p className="text-base font-medium">{value || 'Not provided'}</p>
  </div>
);

const ResearchSection = ({ 
  title, 
  researches 
}: { 
  title: string; 
  researches: FormSubmission['formData']['researchPapers'] | FormSubmission['formData']['onGoingResearches'] | undefined;
}) => (
  <div>
    <h4 className="text-sm font-medium text-muted-foreground mb-2">{title}</h4>
    {researches && researches.length > 0 ? (
      <div className="space-y-4">
        {researches.map((research, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="space-y-2">
                <h5 className="font-medium">{research.title}</h5>
                <p className="text-sm text-muted-foreground">{research.description}</p>
                {research.doi && (
                  <Badge variant="outline">DOI: {research.doi}</Badge>
                )}
                <Badge>{research.stage}</Badge>
                {research.images.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {research.images.map((image, idx) => (
                      <img
                        key={idx}
                        src={image.secure_url}
                        alt={`Research image ${idx + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    ) : (
      <p className="text-muted-foreground">No {title.toLowerCase()} listed</p>
    )}
  </div>
);

export default function ResearcherDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [submission, setSubmission] = useState<FormSubmission | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  const handleAction = async (action: "approve" | "reject") => {
    try {
      setProcessing(true);
      const response = await fetch(`/api/admin/forms/researcherDetails/${params.id}/${action}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reason: action === "reject" ? "Application rejected by admin" : undefined
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to ${action} application`);
      }

      const data = await response.json();

      toast({
        title: "Success",
        description: data.message || `Application ${action}ed successfully`,
      });

      router.push("/admin/forms");
      router.refresh();
    } catch (error) {
      console.error("Action error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : `Failed to ${action} application`,
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  useEffect(() => {
    const fetchFormDetails = async () => {
      try {
        console.log("Fetching researcher details for ID:", params.id);
        const response = await fetch(`/api/admin/forms/${params.id}`);
        console.log("Response status:", response.status);
        
        const data = await response.json();
        console.log("Received data:", data);

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch researcher details");
        }

        setSubmission(data.submission);
      } catch (error) {
        console.error("Error fetching researcher details:", error);
        toast({
          title: "Error",
          description: "Failed to fetch researcher details",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchFormDetails();
  }, [params.id, toast]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Debug logs for the fetched data
  console.log("Current submission state:", submission);
  console.log("Personal Info:", submission?.formData?.personalInfo);
  console.log("Academic Info:", submission?.formData?.academicInfo);
  console.log("Files:", submission?.formData?.files);

  return (
    <div className="container py-8 max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Researcher Application</h1>
            <p className="text-muted-foreground">
              Submitted on {new Date(submission?.submittedAt || '').toLocaleString()}
            </p>
          </div>
          <Badge
            variant={
              submission?.status === "approved"
                ? "outline"
                : submission?.status === "rejected"
                ? "destructive"
                : "default"
            }
            className="text-base py-1 px-4"
          >
            {submission?.status.toUpperCase()}
          </Badge>
        </div>

        {/* Personal Information */}
        <FormSection title="Personal Information" icon={User}>
          <div className="grid grid-cols-2 gap-6">
            <InfoItem 
              label="Full Name" 
              value={submission?.formData.personalInfo.name} 
            />
            <InfoItem 
              label="Email" 
              value={submission?.formData.personalInfo.email.address} 
            />
            <InfoItem 
              label="Phone" 
              value={submission?.formData.personalInfo.phone.number} 
            />
            <InfoItem 
              label="Field of Research" 
              value={submission?.formData.personalInfo.fieldOfResearch} 
            />
            <InfoItem 
              label="ID Type" 
              value={submission?.formData.personalInfo.uniqueId.type} 
            />
            <InfoItem 
              label="ID Number" 
              value={submission?.formData.personalInfo.uniqueId.number} 
            />
          </div>
        </FormSection>

        {/* Academic Information */}
        <FormSection title="Academic Information" icon={GraduationCap}>
          <div className="grid grid-cols-2 gap-6">
            <InfoItem 
              label="Institution" 
              value={submission?.formData.academicInfo.institution} 
            />
            <InfoItem 
              label="Position" 
              value={submission?.formData.academicInfo.position} 
            />
            <InfoItem 
              label="Department" 
              value={submission?.formData.academicInfo.department} 
            />
            <InfoItem 
              label="Highest Qualification" 
              value={submission?.formData.academicInfo.highestQualification} 
            />
            <InfoItem 
              label="Years of Experience" 
              value={submission?.formData.academicInfo.yearsOfExperience} 
            />
          </div>
        </FormSection>

        {/* Research Details */}
        <FormSection title="Research Details" icon={Microscope}>
          <div className="space-y-6">
            {/* Research Papers */}
            <ResearchSection 
              title="Research Papers" 
              researches={submission?.formData.researchPapers} 
            />

            {/* Ongoing Research */}
            <ResearchSection 
              title="Ongoing Research" 
              researches={submission?.formData.onGoingResearches} 
            />
          </div>
        </FormSection>

        {/* Professional Credentials */}
        <FormSection title="Professional Credentials" icon={Award}>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <InfoItem 
                label="ORCID" 
                value={submission?.formData.professionalCredentials.orcid} 
              />
              <InfoItem 
                label="Google Scholar" 
                value={submission?.formData.professionalCredentials.googleScholar} 
              />
              <InfoItem 
                label="Research Gate" 
                value={submission?.formData.professionalCredentials.researchGate} 
              />
            </div>
          </div>
        </FormSection>

        {/* Documents */}
        <FormSection title="Uploaded Documents" icon={FileText}>
          <div className="grid md:grid-cols-2 gap-4">
            {Object.entries(submission?.formData.files || {}).map(([key, file]) => (
              <Card key={key}>
                <CardHeader className="border-b bg-muted">
                  <div className="flex items-center gap-2">
                    <FileCheck className="h-5 w-5 text-primary" />
                    <div>
                      <CardTitle className="text-base capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">{file.originalName}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => window.open(file.secure_url, '_blank')}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    View Document
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </FormSection>

        {/* Action Buttons */}
        {submission?.status === "pending" && (
          <motion.div 
            className="flex justify-end gap-4 sticky bottom-6 p-4 rounded-xl border backdrop-blur-sm bg-background/95 shadow-lg"
          >
            <Button
              variant="outline"
              size="lg"
              onClick={() => handleAction("reject")}
              disabled={processing}
              className="hover:bg-destructive hover:text-destructive-foreground"
            >
              {processing ? (
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              ) : (
                <XCircle className="h-5 w-5 mr-2" />
              )}
              Reject Application
            </Button>
            <Button
              size="lg"
              onClick={() => handleAction("approve")}
              disabled={processing}
              className="bg-primary hover:bg-primary/90"
            >
              {processing ? (
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              ) : (
                <CheckCircle className="h-5 w-5 mr-2" />
              )}
              Approve Application
            </Button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}