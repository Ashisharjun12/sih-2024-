"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { 
  CheckCircle, 
  XCircle, 
  FileText,
  Download,
  Loader2,
  User,
  Building2,
  Mail,
  Phone,
  MapPin,
  Eye,
  Banknote,
  FileCheck,
  Users,
  PieChart,
  DollarSign,
  Activity,
  Info,
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
    owner: {
      fullName: string;
      email: string;
      phone: string;
      businessAddress: {
        physicalAddress: string;
        city: string;
        state: string;
        pincode: string;
      };
      gender: string;
      identityProof: {
        type: string;
        number: string;
      };
    };
    startupDetails: {
      startupName: string;
      industry: string;
      stage: string;
      businessModel: string;
      revenueModel: string;
      gstNumber?: string;
      panNumber?: string;
      cinNumber?: string;
      msmeRegistration?: string;
      founders: any[];
      equitySplits: any[];
    };
    businessActivities: {
      missionAndVision: string;
    };
    additionalInfo: {
      website: string;
      socialMedia: {
        linkedIn: string;
        facebook: string;
        twitter: string;
      };
    };
  };
  files: Record<string, {
    secure_url: string;
    viewable_url: string;
    originalName: string;
    fileType: string;
  }>;
}

const documentTypes = {
  identityProof: {
    title: "Identity Proof",
    icon: User,
    description: "Personal identification document",
  },
  businessPlan: {
    title: "Business Plan",
    icon: FileText,
    description: "Detailed business strategy document",
  },
  pitchDeck: {
    title: "Pitch Deck",
    icon: Building2,
    description: "Startup presentation slides",
  },
  financialProjections: {
    title: "Financial Projections",
    icon: Banknote,
    description: "Financial forecasts and projections",
  },
  incorporationCertificate: {
    title: "Incorporation Certificate",
    icon: FileCheck,
    description: "Company registration document",
  },
};

const DocumentCard = ({ 
  title, 
  description, 
  icon: Icon, 
  file, 
}: { 
  title: string; 
  description: string; 
  icon: any; 
  file?: { 
    secure_url: string;
    viewable_url: string;
    originalName: string;
    fileType: string;
  }; 
}) => (
  <Card>
    <CardHeader className="border-b bg-muted">
      <div className="flex items-center gap-2">
        <Icon className="h-5 w-5 text-primary" />
        <div>
          <CardTitle className="text-base">{title}</CardTitle>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
    </CardHeader>
    <CardContent className="p-4">
      {file ? (
        <div className="flex flex-col gap-4">
          <p className="text-sm text-muted-foreground truncate">
            {file.originalName}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => window.open(file.fileType.includes('pdf') ? file.viewable_url : file.secure_url, '_blank')}
            >
              <Eye className="h-4 w-4 mr-2" />
              View
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => {
                const a = document.createElement('a');
                a.href = file.secure_url;
                a.download = file.originalName;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
              }}
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground text-center py-2">
          No document uploaded
        </p>
      )}
    </CardContent>
  </Card>
);

const FormSection = ({ title, icon: Icon, children }: { title: string; icon: any; children: React.ReactNode }) => (
  <Card className="mb-6">
    <CardHeader>
      <div className="flex items-center gap-2">
        <Icon className="h-5 w-5 text-primary" />
        <CardTitle>{title}</CardTitle>
      </div>
    </CardHeader>
    <CardContent>{children}</CardContent>
  </Card>
);

const InfoItem = ({ label, value }: { label: string; value: string | number | undefined }) => (
  <div className="space-y-1">
    <label className="text-sm font-medium text-muted-foreground">{label}</label>
    <p className="text-base">{value || 'Not provided'}</p>
  </div>
);

export default function FormDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [submission, setSubmission] = useState<FormSubmission | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchFormDetails();
  }, [params.id]);

  const fetchFormDetails = async () => {
    try {
      const response = await fetch(`/api/admin/forms/${params.id}`);
      if (!response.ok) throw new Error("Failed to fetch form details");
      const data = await response.json();
      setSubmission(data.submission);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch form details",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAction = async (action: "approve" | "reject") => {
    try {
      setProcessing(true);
      const response = await fetch(`/api/admin/forms/${params.id}/${action}`, {
        method: 'POST',
      });
      
      if (!response.ok) throw new Error();

      toast({
        title: "Success",
        description: `Application ${action}ed successfully`,
      });

      router.push("/admin/forms");
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${action} application`,
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  const renderFinancialDetails = (data: any) => (
    <div className="grid grid-cols-2 gap-6">
      <div className="col-span-2">
        <h4 className="text-sm font-medium text-muted-foreground mb-2">Bank Details</h4>
        <div className="grid grid-cols-2 gap-4 pl-4">
          <InfoItem label="Bank Name" value={data.financialDetails?.bankDetails?.bankName} />
          <InfoItem label="Branch" value={data.financialDetails?.bankDetails?.branch} />
          <InfoItem label="Account Number" value={data.financialDetails?.bankDetails?.accountNumber} />
        </div>
      </div>
      <InfoItem 
        label="Annual Turnover" 
        value={data.financialDetails?.annualTurnover ? 
          `₹${data.financialDetails.annualTurnover.toLocaleString()}` : 
          'Not provided'
        } 
      />
      <InfoItem label="Funding Status" value={data.financialDetails?.fundingStatus} />
      <InfoItem 
        label="Amount Raised" 
        value={data.financialDetails?.amountRaised ? 
          `₹${data.financialDetails.amountRaised.toLocaleString()}` : 
          'Not provided'
        } 
      />
    </div>
  );

  const renderFounders = (founders: any[]) => (
    <div className="space-y-4">
      {founders?.map((founder, index) => (
        <div key={index} className="border p-4 rounded-lg">
          <div className="grid grid-cols-2 gap-4">
            <InfoItem label="Name" value={founder.name} />
            <InfoItem label="Role" value={founder.role} />
            <InfoItem label="Contact Details" value={founder.contactDetails} />
          </div>
        </div>
      ))}
    </div>
  );

  const renderEquitySplits = (splits: any[]) => (
    <div className="space-y-4">
      {splits?.map((split, index) => (
        <div key={index} className="border p-4 rounded-lg">
          <div className="grid grid-cols-2 gap-4">
            <InfoItem label="Owner Name" value={split.ownerName} />
            <InfoItem label="Equity Percentage" value={`${split.equityPercentage}%`} />
          </div>
        </div>
      ))}
    </div>
  );

  const renderSocialMedia = (socialMedia: any) => (
    <div className="grid grid-cols-2 gap-4">
      <InfoItem label="LinkedIn" value={socialMedia?.linkedIn} />
      <InfoItem label="Facebook" value={socialMedia?.facebook} />
      <InfoItem label="Twitter" value={socialMedia?.twitter} />
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!submission) return null;

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
            <h1 className="text-3xl font-bold mb-2">Startup Application</h1>
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

        {/* Owner Information */}
        <FormSection title="Owner Information" icon={User}>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-muted-foreground">Full Name</p>
              <p className="text-base font-medium">{submission?.formData.owner.fullName}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="text-base font-medium">{submission?.formData.owner.email}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Phone</p>
              <p className="text-base font-medium">{submission?.formData.owner.phone}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Gender</p>
              <p className="text-base font-medium">{submission?.formData.owner.gender}</p>
            </div>
          </div>

          <div className="mt-6">
            <p className="text-sm text-muted-foreground mb-2">Business Address</p>
            <div className="grid grid-cols-2 gap-4 pl-4">
              <div>
                <p className="text-sm text-muted-foreground">Address</p>
                <p className="text-base font-medium">
                  {submission?.formData.owner.businessAddress.physicalAddress}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">City</p>
                <p className="text-base font-medium">
                  {submission?.formData.owner.businessAddress.city}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">State</p>
                <p className="text-base font-medium">
                  {submission?.formData.owner.businessAddress.state}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pincode</p>
                <p className="text-base font-medium">
                  {submission?.formData.owner.businessAddress.pincode}
                </p>
              </div>
            </div>
          </div>
        </FormSection>

        {/* Startup Details */}
        <FormSection title="Startup Details" icon={Building2}>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-muted-foreground">Startup Name</p>
              <p className="text-base font-medium">{submission?.formData.startupDetails.startupName}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Industry</p>
              <p className="text-base font-medium">{submission?.formData.startupDetails.industry}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Stage</p>
              <p className="text-base font-medium">{submission?.formData.startupDetails.stage}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Business Model</p>
              <p className="text-base font-medium">{submission?.formData.startupDetails.businessModel}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Revenue Model</p>
              <p className="text-base font-medium">{submission?.formData.startupDetails.revenueModel}</p>
            </div>
          </div>
        </FormSection>

        {/* Founders */}
        <FormSection title="Founders" icon={Users}>
          {renderFounders(submission?.formData.startupDetails.founders)}
        </FormSection>

        {/* Equity Splits */}
        <FormSection title="Equity Distribution" icon={PieChart}>
          {renderEquitySplits(submission?.formData.startupDetails.equitySplits)}
        </FormSection>

        {/* Financial Details */}
        <FormSection title="Financial Information" icon={DollarSign}>
          {renderFinancialDetails(submission?.formData)}
        </FormSection>

        {/* Business Activities */}
        <FormSection title="Business Activities" icon={Activity}>
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Mission and Vision</h4>
              <p className="text-base bg-muted p-4 rounded-lg">
                {submission?.formData.businessActivities.missionAndVision || 'Not provided'}
              </p>
            </div>
          </div>
        </FormSection>

        {/* Additional Information */}
        <FormSection title="Additional Information" icon={Info}>
          <div className="space-y-6">
            <InfoItem label="Website" value={submission?.formData.additionalInfo?.website} />
            {submission?.formData.additionalInfo?.socialMedia && (
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Social Media</h4>
                {renderSocialMedia(submission.formData.additionalInfo.socialMedia)}
              </div>
            )}
          </div>
        </FormSection>

        {/* Documents */}
        <FormSection title="Uploaded Documents" icon={FileText}>
          <div className="grid md:grid-cols-2 gap-4">
            {Object.entries(documentTypes).map(([key, docType]) => (
              <DocumentCard
                key={key}
                title={docType.title}
                description={docType.description}
                icon={docType.icon}
                file={submission?.files?.[key]}
              />
            ))}
          </div>
        </FormSection>

        {/* Action Buttons */}
        {submission?.status === "pending" && (
          <div className="flex justify-end gap-4">
            <Button
              variant="outline"
              size="lg"
              onClick={() => handleAction("reject")}
              disabled={processing}
            >
              {processing ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <XCircle className="h-4 w-4 mr-2" />
              )}
              Reject Application
            </Button>
            <Button
              size="lg"
              onClick={() => handleAction("approve")}
              disabled={processing}
            >
              {processing ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <CheckCircle className="h-4 w-4 mr-2" />
              )}
              Approve Application
            </Button>
          </div>
        )}
      </motion.div>
    </div>
  );
} 