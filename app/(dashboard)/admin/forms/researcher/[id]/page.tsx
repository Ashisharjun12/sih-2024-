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
  BookOpen,
  Award,
  Brain,
  FileCheck,
  School,
  Microscope,
  Trophy,
  Link
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
      fieldOfResearch: string;
    };
    academicInfo: {
      institution: string;
      position: string;
      department: string;
      highestQualification: string;
      yearsOfExperience: string;
    };
    researchDetails: {
      researchTopic: string;
      expertiseAreas: string[];
      ongoingProjects: string[];
    };
    professionalCredentials: {
      publicationNumber: number;
      researchIds: {
        orcid: string;
        googleScholar: string;
        researchGate: string;
      };
      publications: string[];
      fundingAgency: string;
      achievements: string[];
    };
    interests: {
      preferredCollaboration: string;
      willingToMentor: boolean;
    };
  };
  files?: Record<string, {
    secure_url: string;
    originalName: string;
    fileType: string;
  }>;
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
      const response = await fetch(`/api/admin/forms/${params.id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: action }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Failed to ${action} application`);
      }

      toast({
        title: "Success",
        description: `Application ${action}ed successfully`,
      });

      router.push("/admin/forms");
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
        const response = await fetch(`/api/admin/forms/researcherDetails/${params.id}`);
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
  console.log("Files:", submission?.files);

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
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Research Topic</h4>
              <p className="text-base bg-muted p-4 rounded-lg">
                {submission?.formData.researchDetails.researchTopic}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Expertise Areas</h4>
              {submission?.formData.researchDetails.expertiseAreas.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {submission.formData.researchDetails.expertiseAreas.map((area, index) => (
                    <Badge key={index} variant="secondary">{area}</Badge>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No expertise areas listed</p>
              )}
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Ongoing Projects</h4>
              {submission?.formData.researchDetails.ongoingProjects.length > 0 ? (
                <div className="space-y-2">
                  {submission.formData.researchDetails.ongoingProjects.map((project, index) => (
                    <p key={index} className="bg-muted p-2 rounded">{project}</p>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No ongoing projects listed</p>
              )}
            </div>
          </div>
        </FormSection>

        {/* Professional Credentials */}
        <FormSection title="Professional Credentials" icon={Award}>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <InfoItem 
                label="Publication Number" 
                value={submission?.formData.professionalCredentials.publicationNumber} 
              />
              <InfoItem 
                label="Funding Agency" 
                value={submission?.formData.professionalCredentials.fundingAgency || 'Not provided'} 
              />
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Research IDs</h4>
              <div className="grid grid-cols-2 gap-4 pl-4">
                <InfoItem 
                  label="ORCID" 
                  value={submission?.formData.professionalCredentials.researchIds.orcid} 
                />
                <InfoItem 
                  label="Google Scholar" 
                  value={submission?.formData.professionalCredentials.researchIds.googleScholar} 
                />
                <InfoItem 
                  label="Research Gate" 
                  value={submission?.formData.professionalCredentials.researchIds.researchGate} 
                />
              </div>
            </div>
          </div>
        </FormSection>

        {/* Research Interests */}
        <FormSection title="Research Interests" icon={Brain}>
          <div className="grid grid-cols-2 gap-6">
            <InfoItem 
              label="Preferred Collaboration" 
              value={submission?.formData.interests.preferredCollaboration} 
            />
            <InfoItem 
              label="Willing to Mentor" 
              value={submission?.formData.interests.willingToMentor ? "Yes" : "No"} 
            />
          </div>
        </FormSection>

        {/* Documents */}
        <FormSection title="Uploaded Documents" icon={FileText}>
          <div className="grid md:grid-cols-2 gap-4">
            {Object.entries(submission?.files || {}).map(([key, file]) => (
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