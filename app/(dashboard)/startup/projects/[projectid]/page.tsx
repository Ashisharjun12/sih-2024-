"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { 
  Building2, Mail, Phone, MapPin, Globe, Users,
  Calendar, Target, Briefcase, Shield, Award,
  FileText, Link as LinkIcon, Facebook, Twitter, Linkedin,
  Rocket, ChevronRight
} from "lucide-react";

interface StartupDetails {
  _id: string;
  userId: string;
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
  };
  startupDetails: {
    startupLogo?: {
      secure_url: string;
    };
    startupName: string;
    about: string;
    industries: string[];
    sectors: string[];
    stage: string;
    registrationNumber: string;
    incorporationDate: string;
    businessModel: string;
    revenueModel: string;
    founders: Array<{
      name: string;
      role: string;
      contactDetails: string;
    }>;
    equitySplits: Array<{
      ownerName: string;
      equityPercentage: number;
    }>;
  };
  businessActivities: {
    missionAndVision: string;
  };
  legalAndCompliance: {
    gstin: string;
    licenses: Array<{
      type: string;
      number: string;
      validUntil: string;
    }>;
  };
  isActivelyFundraising: boolean;
  additionalInfo: {
    website?: string;
    socialMedia?: {
      linkedIn?: string;
      twitter?: string;
      facebook?: string;
    };
    pitchDeck?: {
      secure_url: string;
    };
    incorporationCertificate?: {
      secure_url: string;
  };
  };
}

export default function StartupDetails({ params }: { params: { projectid: string } }) {
  const { data: session } = useSession();
  const [startup, setStartup] = useState<StartupDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStartupDetails = async () => {
      try {
        const response = await fetch(`/api/startup/projects/${params.projectid}`);
        if (!response.ok) {
          throw new Error("Failed to fetch startup details");
        }
        const data = await response.json();
        console.log("Startup data received:", data);
        setStartup(data.startup);
      } catch (err) {
        console.error("Error fetching startup:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch startup details");
      } finally {
        setLoading(false);
      }
    };

    if (session?.user) {
      fetchStartupDetails();
    }
  }, [session, params.projectid]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error || !startup) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">Error: {error || "Startup not found"}</p>
      </div>
    );
  }

  return (
    <div className="container py-4 space-y-6">
      {/* Header Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500/10 via-cyan-500/5 to-transparent p-8">
        <div className="relative flex flex-col md:flex-row items-start justify-between gap-8">
          {/* Basic Info */}
          <div>
            <div className="flex items-center gap-6 mb-6">
              {startup?.startupDetails.startupLogo ? (
                <img 
                  src={startup.startupDetails.startupLogo.secure_url}
                  alt={startup.startupDetails.startupName}
                  className="h-20 w-20 object-contain rounded-xl bg-background p-2"
                />
              ) : (
                <div className="h-20 w-20 rounded-xl bg-background p-2 flex items-center justify-center">
                  <Building2 className="h-10 w-10 text-blue-500/70" />
                </div>
              )}
              <div>
                <h1 className="text-3xl font-bold">{startup?.startupDetails.startupName}</h1>
                <p className="text-muted-foreground mt-1">{startup?.owner.fullName}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <Badge variant="secondary" className="px-3 py-1">{startup?.startupDetails.stage}</Badge>
                  <Badge variant="secondary" className="px-3 py-1">{startup?.startupDetails.businessModel}</Badge>
                  {startup?.isActivelyFundraising && (
                    <Badge variant="outline" className="border-emerald-500 text-emerald-500 px-3 py-1">
                      Actively Fundraising
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4 min-w-[240px]">
            <div className="bg-background/50 p-4 rounded-xl text-center">
              <Users className="h-6 w-6 mx-auto mb-2 text-blue-500" />
              <p className="text-2xl font-bold">{startup?.startupDetails.founders.length}</p>
              <p className="text-sm text-muted-foreground">Founders</p>
            </div>
            <div className="bg-background/50 p-4 rounded-xl text-center">
              <Calendar className="h-6 w-6 mx-auto mb-2 text-blue-500" />
              <p className="text-2xl font-bold">
                {format(new Date(startup?.startupDetails.incorporationDate || ""), 'yyyy')}
              </p>
              <p className="text-sm text-muted-foreground">Founded</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Contact Information */}
        <div className="bg-gradient-to-br from-blue-500/5 via-cyan-500/5 to-transparent rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <Mail className="h-5 w-5 text-blue-500" />
            Contact Information
          </h2>
          <div className="space-y-4">
            <div className="flex items-center gap-4 bg-background/50 p-4 rounded-lg hover:bg-background/70 transition-colors">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Mail className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{startup?.owner.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-background/50 p-4 rounded-lg hover:bg-background/70 transition-colors">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Phone className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium">{startup?.owner.phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-background/50 p-4 rounded-lg hover:bg-background/70 transition-colors">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <MapPin className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Address</p>
                <p className="font-medium">
                  {startup?.owner.businessAddress.physicalAddress}<br />
                  {startup?.owner.businessAddress.city}, {startup?.owner.businessAddress.state}<br />
                  {startup?.owner.businessAddress.pincode}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Business Details */}
        <div className="bg-gradient-to-br from-teal-500/5 via-emerald-500/5 to-transparent rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-teal-500" />
            Business Details
          </h2>
          <div className="space-y-6">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Industries</p>
              <div className="flex flex-wrap gap-2">
                {startup?.startupDetails.industries.map((industry, index) => (
                  <Badge 
                    key={index} 
                    variant="secondary" 
                    className="bg-teal-500/10 text-teal-600 hover:bg-teal-500/20 px-3 py-1"
                  >
                    {industry}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">Sectors</p>
              <div className="flex flex-wrap gap-2">
                {startup?.startupDetails.sectors.map((sector, index) => (
                  <Badge 
                    key={index} 
                    variant="secondary" 
                    className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 px-3 py-1"
                  >
                    {sector}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="bg-background/50 p-4 rounded-lg hover:bg-background/70 transition-colors">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-teal-500/10 rounded-lg">
                  <Target className="h-4 w-4 text-teal-500" />
                </div>
                <div>
              <p className="text-sm text-muted-foreground">Revenue Model</p>
              <p className="font-medium mt-1">{startup?.startupDetails.revenueModel}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Legal Information */}
        <div className="bg-gradient-to-br from-violet-500/5 via-purple-500/5 to-transparent rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <Shield className="h-5 w-5 text-violet-500" />
            Legal Information
          </h2>
          <div className="space-y-4">
            <div className="bg-background/50 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">Registration Number</p>
              <p className="font-medium mt-1">{startup?.startupDetails.registrationNumber}</p>
            </div>
            <div className="bg-background/50 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">GSTIN</p>
              <p className="font-medium mt-1">{startup?.legalAndCompliance.gstin}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">Licenses</p>
              <div className="grid gap-3">
                {startup?.legalAndCompliance.licenses.map((license, index) => (
                  <div 
                    key={index} 
                    className="bg-background/50 p-4 rounded-lg hover:bg-background/70 transition-colors"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-violet-500/10 rounded-lg">
                        <Shield className="h-4 w-4 text-violet-500" />
                      </div>
                      <p className="font-medium">{license.type}</p>
                    </div>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <p>Number: {license.number}</p>
                      <p>Valid until: {format(new Date(license.validUntil), 'MMM dd, yyyy')}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Team Information */}
        <div className="bg-gradient-to-br from-amber-500/5 via-orange-500/5 to-transparent rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <Users className="h-5 w-5 text-amber-500" />
            Team Information
          </h2>
          <div className="space-y-6">
            <div>
              <p className="text-sm text-muted-foreground mb-3">Founders</p>
              <div className="grid gap-3">
                {startup?.startupDetails.founders.map((founder, index) => (
                  <div 
                    key={index} 
                    className="bg-background/50 p-4 rounded-lg hover:bg-background/70 transition-colors"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-amber-500/10 rounded-lg">
                        <Users className="h-4 w-4 text-amber-500" />
                      </div>
                      <div>
                        <p className="font-medium">{founder.name}</p>
                        <p className="text-sm text-muted-foreground">{founder.role}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                      <Phone className="h-4 w-4" />
                      <p>{founder.contactDetails}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-3">Equity Distribution</p>
              <div className="grid gap-3">
                {startup?.startupDetails.equitySplits.map((split, index) => (
                  <div 
                    key={index} 
                    className="bg-background/50 p-4 rounded-lg hover:bg-background/70 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-amber-500/10 rounded-lg">
                          <Target className="h-4 w-4 text-amber-500" />
                        </div>
                        <p className="font-medium">{split.ownerName}</p>
                      </div>
                      <Badge 
                        variant="secondary" 
                        className="bg-amber-500/10 text-amber-600 hover:bg-amber-500/20"
                      >
                        {split.equityPercentage}%
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Documents & Links Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Documents */}
        <div className="bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-transparent rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-500" />
            Documents
          </h2>
          <div className="grid gap-4">
            {startup?.additionalInfo.pitchDeck && (
              <a 
                href={startup.additionalInfo.pitchDeck.secure_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-background/50 p-4 rounded-lg hover:bg-background/70 transition-colors group"
              >
                <div className="p-2 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20">
                  <FileText className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="font-medium">Pitch Deck</p>
                  <p className="text-sm text-muted-foreground">View Document</p>
                </div>
              </a>
            )}
            
            {startup?.additionalInfo.incorporationCertificate && (
              <a 
                href={startup.additionalInfo.incorporationCertificate.secure_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-background/50 p-4 rounded-lg hover:bg-background/70 transition-colors group"
              >
                <div className="p-2 bg-purple-500/10 rounded-lg group-hover:bg-purple-500/20">
                  <FileText className="h-5 w-5 text-purple-500" />
                </div>
                <div>
                  <p className="font-medium">Incorporation Certificate</p>
                  <p className="text-sm text-muted-foreground">View Document</p>
                </div>
              </a>
            )}
          </div>
        </div>

        {/* Online Presence */}
        <div className="bg-gradient-to-br from-emerald-500/5 via-teal-500/5 to-transparent rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <Globe className="h-5 w-5 text-emerald-500" />
            Online Presence
          </h2>
          <div className="grid gap-4">
            {startup?.additionalInfo.website && (
              <a 
                href={startup.additionalInfo.website.startsWith('http') ? 
                  startup.additionalInfo.website : 
                  `https://${startup.additionalInfo.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-background/50 p-4 rounded-lg hover:bg-background/70 transition-colors group"
              >
                <div className="p-2 bg-emerald-500/10 rounded-lg group-hover:bg-emerald-500/20">
                  <Globe className="h-5 w-5 text-emerald-500" />
                </div>
                <div>
                  <p className="font-medium">Website</p>
                  <p className="text-sm text-muted-foreground">{startup.additionalInfo.website}</p>
                </div>
              </a>
            )}

            {startup?.additionalInfo.socialMedia && (
              <div className="grid gap-3">
                {startup.additionalInfo.socialMedia.linkedIn && (
                  <a 
                  href={startup.additionalInfo.socialMedia.linkedIn.startsWith('http') ? 
                    startup.additionalInfo.socialMedia.linkedIn : 
                    `https://${startup.additionalInfo.socialMedia.linkedIn}`}
                    
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 bg-background/50 p-4 rounded-lg hover:bg-background/70 transition-colors group"
                  >
                    <div className="p-2 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20">
                      <Linkedin className="h-5 w-5 text-blue-500" />
                    </div>
                    <div>
                      <p className="font-medium">LinkedIn</p>
                      <p className="text-sm text-muted-foreground">View Profile</p>
                    </div>
                  </a>
                )}

                {startup.additionalInfo.socialMedia.twitter && (
                  <a 
                    href={startup.additionalInfo.socialMedia.twitter.startsWith('http') ? 
                      startup.additionalInfo.socialMedia.twitter : 
                      `https://${startup.additionalInfo.socialMedia.twitter}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 bg-background/50 p-4 rounded-lg hover:bg-background/70 transition-colors group"
                  >
                    <div className="p-2 bg-sky-500/10 rounded-lg group-hover:bg-sky-500/20">
                      <Twitter className="h-5 w-5 text-sky-500" />
                    </div>
                    <div>
                      <p className="font-medium">Twitter</p>
                      <p className="text-sm text-muted-foreground">View Profile</p>
                    </div>
                  </a>
                )}

                {startup.additionalInfo.socialMedia.facebook && (
                  <a 
                    href={startup.additionalInfo.socialMedia.facebook.startsWith('http') ? 
                      startup.additionalInfo.socialMedia.facebook : 
                      `https://${startup.additionalInfo.socialMedia.facebook}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 bg-background/50 p-4 rounded-lg hover:bg-background/70 transition-colors group"
                  >
                    <div className="p-2 bg-indigo-500/10 rounded-lg group-hover:bg-indigo-500/20">
                      <Facebook className="h-5 w-5 text-indigo-500" />
                    </div>
                    <div>
                      <p className="font-medium">Facebook</p>
                      <p className="text-sm text-muted-foreground">View Profile</p>
                    </div>
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
