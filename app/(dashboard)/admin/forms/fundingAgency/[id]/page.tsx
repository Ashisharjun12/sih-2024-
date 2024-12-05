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
  Building,
  Phone,
  Mail,
  Globe,
  Users,
  DollarSign,
  Target,
  Briefcase,
  Clock,
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
      minimumInvestment: string;
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
      yearsOfOperation: string;
      totalInvestments: string;
      averageTicketSize: string;
    };
    activeInvestments: Array<any>;
  };
}

// Helper component for sections
const FormSection = ({ title, icon: Icon, children }: any) => (
  <Card className="shadow-sm">
    <CardHeader className="border-b bg-muted">
      <CardTitle className="text-lg flex items-center gap-2">
        <Icon className="h-5 w-5" />
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent className="pt-6">{children}</CardContent>
  </Card>
);

// Helper component for info items
const InfoItem = ({ label, value }: { label: string; value: string | number | undefined }) => (
  <div>
    <p className="text-sm font-medium text-muted-foreground">{label}</p>
    <p className="mt-1">{value || 'Not provided'}</p>
  </div>
);

// Helper component for representatives
const RepresentativeCard = ({ rep }: { rep: any }) => (
  <Card>
    <CardContent className="pt-6">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          <h3 className="font-medium">{rep.name}</h3>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-muted-foreground" />
            <span>{rep.designation}</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span>{rep.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span>{rep.phone}</span>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

export default function FundingAgencyFormDetails() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [submission, setSubmission] = useState<FormSubmission | null>(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const fetchFormDetails = async () => {
      try {
        const response = await fetch(`/api/admin/forms/${params.id}`);
        const data = await response.json();
        setSubmission(data.submission);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch form details",
          variant: "destructive",
        });
      }
    };

    if (params.id) {
      fetchFormDetails();
    }
  }, [params.id, toast]);

  const handleAction = async (action: "approve" | "reject") => {
    try {
      setProcessing(true);
      
      const response = await fetch(`/api/admin/forms/fundingAgency/${params.id}/${action}`, {
        method: "POST",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to process application");
      }

      toast({
        title: "Success",
        description: data.message,
      });

      router.push("/admin/forms");
    } catch (error) {
      console.error("Action error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to process application",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  if (!submission) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container max-w-4xl py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Funding Agency Application</h1>
            <p className="text-muted-foreground">
              Submitted by {submission.userName} ({submission.userEmail})
            </p>
          </div>
          <Badge
            variant={
              submission.status === "approved"
                ? "default"
                : submission.status === "rejected"
                ? "destructive"
                : "secondary"
            }
          >
            {submission.status.toUpperCase()}
          </Badge>
        </div>

        {/* Agency Details */}
        <FormSection title="Agency Details" icon={Building}>
          <div className="grid gap-6 md:grid-cols-2">
            <InfoItem label="Agency Name" value={submission.formData.agencyDetails.name} />
            <InfoItem label="Registration Number" value={submission.formData.agencyDetails.registrationNumber} />
            <InfoItem label="Type" value={submission.formData.agencyDetails.type.replace(/_/g, ' ')} />
            <InfoItem label="Establishment Date" value={new Date(submission.formData.agencyDetails.establishmentDate).toLocaleDateString()} />
            <div className="md:col-span-2">
              <InfoItem label="Description" value={submission.formData.agencyDetails.description} />
            </div>
          </div>
        </FormSection>

        {/* Contact Information */}
        <FormSection title="Contact Information" icon={Phone}>
          <div className="grid gap-6 md:grid-cols-2">
            <InfoItem label="Official Address" value={submission.formData.contactInformation.officialAddress} />
            <InfoItem label="Official Email" value={submission.formData.contactInformation.officialEmail} />
            <InfoItem label="Phone Number" value={submission.formData.contactInformation.phoneNumber} />
            <InfoItem label="Website" value={submission.formData.contactInformation.websiteURL} />
          </div>
        </FormSection>

        {/* Representatives */}
        <FormSection title="Representatives" icon={Users}>
          <div className="space-y-6">
            {submission.formData.representatives.map((rep, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <InfoItem label="Name" value={rep.name} />
                    <InfoItem label="Designation" value={rep.designation} />
                    <InfoItem label="Email" value={rep.email} />
                    <InfoItem label="Phone" value={rep.phone} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </FormSection>

        {/* Funding Preferences */}
        <FormSection title="Funding Preferences" icon={DollarSign}>
          <div className="space-y-6">
            <InfoItem 
              label="Minimum Investment" 
              value={`₹${parseInt(submission.formData.fundingPreferences.minimumInvestment).toLocaleString()}`} 
            />
            
            <div>
              <p className="text-sm font-medium text-muted-foreground">Preferred Stages</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {submission.formData.fundingPreferences.preferredStages.map((stage, index) => (
                  <Badge key={index} variant="secondary">
                    {stage.replace(/_/g, ' ')}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground">Funding Types</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {submission.formData.fundingPreferences.fundingTypes.map((type, index) => (
                  <Badge key={index} variant="secondary">
                    {type.replace(/_/g, ' ')}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground">Preferred Sectors</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {submission.formData.fundingPreferences.preferredSectors.map((sector, index) => (
                  <Badge key={index} variant="secondary">
                    {sector.replace(/_/g, ' ')}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground">Preferred Industries</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {submission.formData.fundingPreferences.preferredIndustries.map((industry, index) => (
                  <Badge key={index} variant="secondary">
                    {industry}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </FormSection>

        {/* Experience */}
        <FormSection title="Experience" icon={Briefcase}>
          <div className="grid gap-6 md:grid-cols-3">
            <InfoItem 
              label="Years of Operation" 
              value={`${submission.formData.experience.yearsOfOperation} years`} 
            />
            <InfoItem 
              label="Total Investments" 
              value={`₹${parseInt(submission.formData.experience.totalInvestments).toLocaleString()}`} 
            />
            <InfoItem 
              label="Average Ticket Size" 
              value={`₹${parseInt(submission.formData.experience.averageTicketSize).toLocaleString()}`} 
            />
          </div>
        </FormSection>

        {/* Documents */}
        <FormSection title="Documents" icon={FileText}>
          <div className="grid gap-4 md:grid-cols-3">
            {Object.entries(submission.formData.documentation).map(([key, doc]) => (
              <Card key={key}>
                <CardContent className="pt-6">
                  <h3 className="font-medium mb-2 capitalize">{key.replace(/([A-Z])/g, ' $1')}</h3>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => window.open(doc.secure_url, '_blank')}
                  >
                    View Document
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </FormSection>

        {/* Action Buttons */}
        {submission.status === "pending" && (
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