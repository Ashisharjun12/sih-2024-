"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import {
  FileText,
  Loader2,
  User,
  Target,
  Mail,
  Info,
} from "lucide-react";

interface MentorProfile {
  _id: string;
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
  createdAt: string;
  updatedAt: string;
}

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
  icon: Icon,
}: {
  label: string;
  value: string | string[] | undefined;
  icon?: React.ElementType;
}) => (
  <div className="space-y-1">
    <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
      {Icon && <Icon className="h-4 w-4" />}
      {label}
    </label>
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

const CertificateCard = ({ url, index }: { url: string; index: number }) => (
  <Card>
    <CardHeader className="border-b bg-muted">
      <div className="flex items-center gap-2">
        <FileText className="h-5 w-5 text-primary" />
        <CardTitle className="text-base">Certificate {index + 1}</CardTitle>
      </div>
    </CardHeader>
    <CardContent className="p-4">
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 hover:underline"
      >
        View Certificate
      </a>
    </CardContent>
  </Card>
);

export default function MentorProfilePage() {
  const { toast } = useToast();
  const [profile, setProfile] = useState<MentorProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch("/api/mentor/profile");
      if (!response.ok) throw new Error("Failed to fetch profile");
      const data = await response.json();
      setProfile(data.mentor);
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to fetch profile",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!profile) return null;

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
            <h1 className="text-3xl font-bold mb-2">Mentor Profile</h1>
            <p className="text-muted-foreground">
              Mentor since {new Date(profile.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Personal Information */}
        <FormSection title="Personal Information" icon={User}>
          <div className="grid grid-cols-2 gap-6">
            <InfoItem 
              label="Full Name" 
              value={profile.name} 
              icon={User}
            />
            <InfoItem 
              label="Email" 
              value={profile.email} 
              icon={Mail}
            />
            <div className="col-span-2">
              <InfoItem 
                label="About" 
                value={profile.about} 
                icon={Info}
              />
            </div>
          </div>
        </FormSection>

        {/* Focus Areas */}
        <FormSection title="Focus Areas" icon={Target}>
          <div className="space-y-4">
            <InfoItem
              label="Focused Industries"
              value={profile.focusedIndustries}
            />
            <InfoItem
              label="Focused Sectors"
              value={profile.focusedSectors}
            />
            <InfoItem
              label="Startup Stages"
              value={profile.stage}
            />
          </div>
        </FormSection>

        {/* Certificates */}
        <FormSection title="Certificates" icon={FileText}>
          <div className="grid md:grid-cols-2 gap-4">
            {profile.certificates.map((cert, index) => (
              <CertificateCard
                key={cert.public_id}
                url={cert.secure_url}
                index={index}
              />
            ))}
          </div>
        </FormSection>
      </motion.div>
    </div>
  );
}
