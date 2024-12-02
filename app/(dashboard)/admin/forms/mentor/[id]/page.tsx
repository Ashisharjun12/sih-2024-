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
  Eye,
  Target,
} from "lucide-react";

interface FormSubmission {
  _id: string;
  userId: string;
  userName: string;
  userEmail: string;
  formType: "mentor";
  status: "pending" | "approved" | "rejected";
  submittedAt: string;
  createdAt: string;
  updatedAt: string;
  formData: {
    name: string;
    email: string;
    about: string;
    focusedIndustries: string[];
    focusedSectors: string[];
    stage: string[];
    certificates: Array<{
      public_id: string;
      secure_url: string;
    }>;
  };
}

const CertificateCard = ({ url, index }: { url: string; index: number }) => (
  <Card>
    <CardHeader className="border-b bg-muted">
      <div className="flex items-center gap-2">
        <FileText className="h-5 w-5 text-primary" />
        <CardTitle className="text-base">Certificate {index + 1}</CardTitle>
      </div>
    </CardHeader>
    <CardContent className="p-4">
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => window.open(url, "_blank")}
        >
          <Eye className="h-4 w-4 mr-2" />
          View
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => {
            fetch(url)
              .then(response => response.blob())
              .then(blob => {
                const blobUrl = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = blobUrl;
                a.download = `certificate-${index + 1}.png`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(blobUrl);
                document.body.removeChild(a);
              });
          }}
        >
          <Download className="h-4 w-4 mr-2" />
          Download
        </Button>
      </div>
    </CardContent>
  </Card>
);

const FormSection = ({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) => (
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

const InfoItem = ({
  label,
  value,
}: {
  label: string;
  value: string | string[] | undefined;
}) => (
  <div className="space-y-1">
    <label className="text-sm font-medium text-muted-foreground">{label}</label>
    {Array.isArray(value) ? (
      <div className="flex flex-wrap gap-2">
        {value.map((item, index) => (
          <Badge key={index} variant="secondary">
            {item}
          </Badge>
        ))}
      </div>
    ) : (
      <p className="text-base">{value || "Not provided"}</p>
    )}
  </div>
);

export default function MentorDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [submission, setSubmission] = useState<FormSubmission | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchFormDetails();
  }, []);

  const fetchFormDetails = async () => {
    try {
      const response = await fetch(`/api/admin/forms/${params.id}`);
      if (!response.ok) throw new Error("Failed to fetch form details");
      console.log(response.ok);
      const data = await response.json();
      console.log(data);
      setSubmission(data.submission);
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to fetch form details",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAction = async (action: "approve" | "reject") => {
    try {
      setProcessing(true);

      const response = await fetch(
        `/api/admin/forms/mentor/${params.id}/${action}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            reason:
              action === "reject"
                ? "Your application does not meet our requirements."
                : undefined,
          }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || `Failed to ${action} application`);
      }

      toast({
        title: "Success",
        description: `Application ${action}ed successfully`,
      });

      router.push("/admin/forms");
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : `Failed to ${action} application`,
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

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
            <h1 className="text-3xl font-bold mb-2">Mentor Application</h1>
            <div className="space-y-1">
              <p className="text-muted-foreground">
                Submitted by {submission.userName} ({submission.userEmail})
              </p>
              <p className="text-muted-foreground">
                on {new Date(submission.submittedAt).toLocaleString()}
              </p>
            </div>
          </div>
          <Badge
            variant={
              submission.status === "approved"
                ? "outline"
                : submission.status === "rejected"
                ? "destructive"
                : "default"
            }
            className="text-base py-1 px-4"
          >
            {submission.status.toUpperCase()}
          </Badge>
        </div>

        {/* Personal Information */}
        <FormSection title="Personal Information" icon={User}>
          <div className="grid grid-cols-2 gap-6">
            <InfoItem label="Full Name" value={submission.formData.name} />
            <InfoItem label="Email" value={submission.formData.email} />
            <div className="col-span-2">
              <InfoItem label="About" value={submission.formData.about} />
            </div>
          </div>
        </FormSection>

        {/* Focus Areas */}
        <FormSection title="Focus Areas" icon={Target}>
          <div className="space-y-4">
            <InfoItem
              label="Focused Industries"
              value={submission.formData.focusedIndustries}
            />
            <InfoItem
              label="Focused Sectors"
              value={submission.formData.focusedSectors}
            />
            <InfoItem
              label="Startup Stages"
              value={submission.formData.stage}
            />
          </div>
        </FormSection>

        {/* Certificates */}
        <FormSection title="Certificates" icon={FileText}>
          <div className="grid md:grid-cols-2 gap-4">
            {submission.formData.certificates.map((cert, index) => (
              <CertificateCard
                key={cert.public_id}
                url={cert.secure_url}
                index={index}
              />
            ))}
          </div>
        </FormSection>

        {/* Action Buttons */}
        {submission.status === "pending" && (
          <motion.div className="flex justify-end gap-4 sticky bottom-6 p-4 rounded-xl border backdrop-blur-sm bg-background/95 shadow-lg">
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
