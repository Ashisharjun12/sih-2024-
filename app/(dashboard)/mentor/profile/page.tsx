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
  Star,
  Clock,
  Award,
  Save,
  Briefcase,
  Settings,
  Users,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";

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
  mentees?: Array<{
    _id: string;
    name: string;
    email: string;
  }>;
  experience?: number;
  expertise?: string[];
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
  const { data: session } = useSession();

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
    <div className="container py-6 space-y-8">
      {/* Welcome Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-transparent p-6 md:p-8">
        <div className="relative">
          <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-bold">
              Profile Settings ✨
            </h1>
            <p className="text-sm md:text-base text-muted-foreground">
              Manage your mentor profile and preferences
            </p>
          </div>
        </div>
      </div>

      {/* Profile Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-transparent rounded-xl p-4 md:p-6"
        >
          <Users className="h-6 w-6 text-blue-500 mb-2" />
          <p className="text-2xl font-bold">{profile?.mentees?.length || 0}</p>
          <p className="text-sm text-blue-600/70">Total Mentees</p>
        </motion.div>

        <div className="bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-transparent rounded-xl p-4 md:p-6">
          <Star className="h-6 w-6 text-blue-500 mb-2" />
          <p className="text-2xl font-bold">4.8</p>
          <p className="text-sm text-blue-600/70">Rating</p>
        </div>

        <div className="bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-transparent rounded-xl p-4 md:p-6">
          <Clock className="h-6 w-6 text-blue-500 mb-2" />
          <p className="text-2xl font-bold">{profile?.experience || 0}</p>
          <p className="text-sm text-blue-600/70">Years Experience</p>
        </div>

        <div className="bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-transparent rounded-xl p-4 md:p-6">
          <Award className="h-6 w-6 text-blue-500 mb-2" />
          <p className="text-2xl font-bold">{profile?.expertise?.length || 0}</p>
          <p className="text-sm text-blue-600/70">Expertise Areas</p>
        </div>
      </div>

      {/* Profile Form Section */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold flex items-center gap-2">
              <User className="h-5 w-5 text-blue-500" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
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
              <div className="flex justify-end">
                <Button 
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Save Changes
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-blue-500" />
                Professional Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
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
                <div className="flex justify-end">
                  <Button 
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Update Details
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold flex items-center gap-2">
                <Settings className="h-5 w-5 text-blue-500" />
                Preferences
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-end">
                  <Button 
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Save Preferences
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Fixed Mobile FAB */}
      <div className="fixed bottom-24 right-6 z-50">
        <Button
          className="h-14 w-14 rounded-full bg-blue-600 hover:bg-blue-500 
            flex items-center justify-center transition-all duration-200
            shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgb(59,130,246,0.3)]"
        >
          <Save className="h-6 w-6 text-white" />
        </Button>
      </div>
    </div>
  );
}
