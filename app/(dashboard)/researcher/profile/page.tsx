"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  GraduationCap,
  Mail,
  Phone,
  Building2,
  BookOpen,
  Award,
  Link2,
  FileText,
  Globe,
  MapPin,
  Briefcase,
  ScrollText,
  User,
  Loader2,
} from "lucide-react";

interface ResearcherProfile {
  _id: string;
  userId: string;
  personalInfo: {
    name: string;
    email: { 
      address: string; 
      verified: boolean 
    };
    phone: { 
      number: string; 
      verified: boolean 
    };
    fieldOfResearch: string[];
  };
  academicInfo: {
    institution: string;
    department: string;
    position: string;
    yearsOfExperience: number;
    qualifications: string[];
  };
  professionalCredentials: {
    publications: number;
    citations: number;
    hIndex: number;
    researchGate?: string;
    googleScholar?: string;
    orcid?: string;
  };
  documents: {
    profilePicture?: { 
      public_id: string;
      secure_url: string 
    };
    cv?: { 
      public_id: string;
      secure_url: string 
    };
  };
  researchPapers: Array<{
    _id: string;
    title: string;
    stage: string;
  }>;
  onGoingResearches: Array<{
    _id: string;
    title: string;
    stage: string;
  }>;
}

const Section = ({ title, icon: Icon, children }: any) => (
  <Card className="overflow-hidden transition-colors hover:bg-muted/50">
    <CardHeader className="p-4 md:p-6 bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10">
      <CardTitle className="text-lg flex items-center gap-2">
        <Icon className="h-5 w-5 text-blue-600" />
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent className="p-4 md:p-6">{children}</CardContent>
  </Card>
);

export default function ResearcherProfilePage() {
  const [profile, setProfile] = useState<ResearcherProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch("/api/researcher/profile");
        const data = await response.json();
        console.log("respro" , response.data)

        if (data.success) {
          setProfile(data.profile);
        } else {
          throw new Error(data.error || "Failed to fetch profile");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to fetch profile",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <User className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium">Profile Not Found</h3>
        <p className="text-sm text-muted-foreground">
          Unable to load researcher profile
        </p>
      </div>
    );
  }

  return (
    <div className="container py-6 space-y-6">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500/10 via-indigo-500/5 to-transparent p-6 md:p-8"
      >
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
          {/* Profile Picture */}
          <div className="relative h-24 w-24 rounded-2xl overflow-hidden bg-muted">
            {profile.documents.profilePicture ? (
              <img
                src={profile.documents.profilePicture.secure_url}
                alt={profile.personalInfo.name}
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-blue-50">
                <User className="h-12 w-12 text-blue-600" />
              </div>
            )}
          </div>

          {/* Basic Info */}
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold">
              {profile.personalInfo.name}
            </h1>
            <div className="flex flex-wrap gap-2 mt-2">
              <Badge variant="outline" className="bg-blue-50 text-blue-700">
                {profile.academicInfo.position}
              </Badge>
              <Badge variant="outline" className="bg-purple-50 text-purple-700">
                {profile.academicInfo.department}
              </Badge>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex gap-2 w-full md:w-auto">
            {profile.documents.cv && (
              <Button
                variant="outline"
                className="flex-1 md:flex-none border-blue-200 hover:bg-blue-50"
                onClick={() => window.open(profile.documents.cv?.secure_url)}
              >
                <FileText className="h-4 w-4 mr-2 text-blue-600" />
                View CV
              </Button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Personal Information */}
        <Section title="Personal Information" icon={User}>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-blue-600" />
              <span>{profile.personalInfo.email.address}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-blue-600" />
              <span>{profile.personalInfo.phone.number}</span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-blue-600" />
              <div className="flex flex-wrap gap-2">
                {profile.personalInfo.fieldOfResearch.map((field) => (
                  <Badge
                    key={field}
                    variant="outline"
                    className="bg-blue-50 text-blue-700"
                  >
                    {field}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </Section>

        {/* Academic Information */}
        <Section title="Academic Information" icon={GraduationCap}>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-blue-600" />
              <span>{profile.academicInfo.institution}</span>
            </div>
            <div className="flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-blue-600" />
              <span>{profile.academicInfo.yearsOfExperience} Years Experience</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-blue-600" />
                <span className="font-medium">Qualifications</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {profile.academicInfo.qualifications.map((qual) => (
                  <Badge
                    key={qual}
                    variant="outline"
                    className="bg-purple-50 text-purple-700"
                  >
                    {qual}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </Section>

        {/* Research Papers */}
        <Section title="Research Papers" icon={ScrollText}>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium flex items-center gap-2 mb-3">
                <BookOpen className="h-4 w-4 text-blue-600" />
                Published Papers ({profile.researchPapers.length})
              </h3>
              <div className="space-y-2">
                {profile.researchPapers.map((paper) => (
                  <div
                    key={paper._id}
                    className="p-3 rounded-lg bg-blue-50/50 hover:bg-blue-50 transition-colors"
                  >
                    <p className="font-medium text-sm">{paper.title}</p>
                    <Badge variant="outline" className="mt-2 text-xs">
                      {paper.stage}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-medium flex items-center gap-2 mb-3">
                <ScrollText className="h-4 w-4 text-purple-600" />
                Ongoing Research ({profile.onGoingResearches.length})
              </h3>
              <div className="space-y-2">
                {profile.onGoingResearches.map((paper) => (
                  <div
                    key={paper._id}
                    className="p-3 rounded-lg bg-purple-50/50 hover:bg-purple-50 transition-colors"
                  >
                    <p className="font-medium text-sm">{paper.title}</p>
                    <Badge variant="outline" className="mt-2 text-xs">
                      {paper.stage}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Section>

        {/* Research Metrics */}
        <Section title="Research Metrics" icon={ScrollText}>
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100/50">
              <p className="text-sm text-blue-600 mb-1">Publications</p>
              <p className="text-2xl font-bold text-blue-700">
                {profile.professionalCredentials.publications}
              </p>
            </div>
            <div className="p-4 rounded-lg bg-gradient-to-br from-purple-50 to-purple-100/50">
              <p className="text-sm text-purple-600 mb-1">Citations</p>
              <p className="text-2xl font-bold text-purple-700">
                {profile.professionalCredentials.citations}
              </p>
            </div>
            <div className="p-4 rounded-lg bg-gradient-to-br from-indigo-50 to-indigo-100/50">
              <p className="text-sm text-indigo-600 mb-1">h-index</p>
              <p className="text-2xl font-bold text-indigo-700">
                {profile.professionalCredentials.hIndex}
              </p>
            </div>
          </div>
        </Section>

        {/* Professional Links */}
        <Section title="Professional Links" icon={Globe}>
          <div className="space-y-4">
            {profile.professionalCredentials.researchGate && (
              <Button
                variant="outline"
                className="w-full justify-start hover:bg-blue-50"
                onClick={() => window.open(profile.professionalCredentials.researchGate)}
              >
                <Link2 className="h-4 w-4 mr-2 text-blue-600" />
                ResearchGate Profile
              </Button>
            )}
            {profile.professionalCredentials.googleScholar && (
              <Button
                variant="outline"
                className="w-full justify-start hover:bg-blue-50"
                onClick={() => window.open(profile.professionalCredentials.googleScholar)}
              >
                <Link2 className="h-4 w-4 mr-2 text-blue-600" />
                Google Scholar Profile
              </Button>
            )}
            {profile.professionalCredentials.orcid && (
              <Button
                variant="outline"
                className="w-full justify-start hover:bg-blue-50"
                onClick={() => window.open(profile.professionalCredentials.orcid)}
              >
                <Link2 className="h-4 w-4 mr-2 text-blue-600" />
                ORCID Profile
              </Button>
            )}
          </div>
        </Section>
      </div>
    </div>
  );
}
 