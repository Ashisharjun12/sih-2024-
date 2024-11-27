"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Globe, 
  Users, 
  Building2, 
  Mail, 
  Phone, 
  MapPin,
  Briefcase,
  Award,
  Target,
  Link,
  FileText
} from "lucide-react";
import { format } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";

interface StartupDetails {
  _id: string;
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
    dateOfBirth: string;
    gender: string;
    identityProof: {
      type: string;
      number: string;
      secure_url: string;
    };
  };
  startupDetails: {
    startupName: string;
    industry: string;
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
    directors: Array<{
      name: string;
      role: string;
      contactDetails: string;
    }>;
    ownershipPercentage: number;
  };
  businessActivities: {
    missionAndVision: string;
    intellectualProperty: Array<{
      type: string;
      details: string;
    }>;
  };
  legalAndCompliance: {
    gstin: string;
    licenses: Array<{
      type: string;
      number: string;
      validUntil: string;
    }>;
    certifications: Array<{
      type: string;
      certificationNumber: string;
      issuingAuthority: string;
      validUntil: string;
      certificationDetails: string;
    }>;
    auditorDetails: {
      name: string;
      firm: string;
      contact: string;
      email: string;
      registrationNumber: string;
    };
  };
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
    documents: Array<{
      secure_url: string;
    }>;
  };
  createdAt: string;
  supportAndNetworking: {
    supportRequested: Array<string>;
    mentorshipPrograms: string;
    potentialInvestors: string;
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
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{startup.startupDetails.startupName}</h1>
        <div className="flex gap-2 mt-2">
          <Badge variant="secondary">{startup.startupDetails.industry}</Badge>
          <Badge variant="outline">{startup.startupDetails.stage}</Badge>
          <Badge>{startup.startupDetails.businessModel}</Badge>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="legal">Legal & Compliance</TabsTrigger>
          <TabsTrigger value="intellectual">Intellectual Property</TabsTrigger>
          <TabsTrigger value="support">Support & Networking</TabsTrigger>
          <TabsTrigger value="documents">Documents & Images</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <span className="text-sm text-muted-foreground">Registration Number</span>
                  <p>{startup.startupDetails.registrationNumber}</p>
                </div>
                <div className="space-y-2">
                  <span className="text-sm text-muted-foreground">Incorporation Date</span>
                  <p>{format(new Date(startup.startupDetails.incorporationDate), 'MMM dd, yyyy')}</p>
                </div>
                <div className="space-y-2">
                  <span className="text-sm text-muted-foreground">Revenue Model</span>
                  <p>{startup.startupDetails.revenueModel}</p>
                </div>
                <div className="space-y-2">
                  <span className="text-sm text-muted-foreground">Business Model</span>
                  <p>{startup.startupDetails.businessModel}</p>
                </div>
                <div className="space-y-2">
                  <span className="text-sm text-muted-foreground">Industry</span>
                  <p>{startup.startupDetails.industry}</p>
                </div>
                <div className="space-y-2">
                  <span className="text-sm text-muted-foreground">Stage</span>
                  <p>{startup.startupDetails.stage}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Owner Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <span className="text-sm text-muted-foreground">Full Name</span>
                  <p>{startup.owner.fullName}</p>
                </div>
                <div className="space-y-2">
                  <span className="text-sm text-muted-foreground">Gender</span>
                  <p>{startup.owner.gender}</p>
                </div>
                <div className="space-y-2">
                  <span className="text-sm text-muted-foreground">Date of Birth</span>
                  <p>{format(new Date(startup.owner.dateOfBirth), 'MMM dd, yyyy')}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <p>{startup.owner.email}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <p>{startup.owner.phone}</p>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <p>
                    {startup.owner.businessAddress.physicalAddress}, 
                    {startup.owner.businessAddress.city}, 
                    {startup.owner.businessAddress.state} - 
                    {startup.owner.businessAddress.pincode}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Mission & Vision</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {startup.businessActivities.missionAndVision}
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="team">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Founders */}
            <Card>
              <CardHeader>
                <CardTitle>Founders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {startup.startupDetails.founders.map((founder, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <h3 className="font-semibold">{founder.name}</h3>
                      <p className="text-sm text-muted-foreground">{founder.role}</p>
                      <p className="text-sm">{founder.contactDetails}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Equity Splits */}
            <Card>
              <CardHeader>
                <CardTitle>Equity Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {startup.startupDetails.equitySplits.map((split, index) => (
                    <div key={index} className="flex justify-between items-center p-4 border rounded-lg">
                      <span>{split.ownerName}</span>
                      <Badge variant="secondary">{split.equityPercentage}%</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Directors Card */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Directors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {startup.startupDetails.directors.map((director, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <h3 className="font-semibold">{director.name}</h3>
                      <p className="text-sm text-muted-foreground">{director.role}</p>
                      <p className="text-sm">{director.contactDetails}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="legal">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Licenses */}
            <Card>
              <CardHeader>
                <CardTitle>Licenses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {startup.legalAndCompliance.licenses.map((license, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <h3 className="font-semibold">{license.type}</h3>
                      <p className="text-sm">Number: {license.number}</p>
                      <p className="text-sm text-muted-foreground">
                        Valid until: {format(new Date(license.validUntil), 'MMM dd, yyyy')}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Certifications */}
            <Card>
              <CardHeader>
                <CardTitle>Certifications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {startup.legalAndCompliance.certifications.map((cert, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <h3 className="font-semibold">{cert.type}</h3>
                      <p className="text-sm">Number: {cert.certificationNumber}</p>
                      <p className="text-sm">Issuing Authority: {cert.issuingAuthority}</p>
                      <p className="text-sm text-muted-foreground">
                        Valid until: {format(new Date(cert.validUntil), 'MMM dd, yyyy')}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* GSTIN Card */}
            <Card>
              <CardHeader>
                <CardTitle>GSTIN Details</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{startup.legalAndCompliance.gstin || "Not provided"}</p>
              </CardContent>
            </Card>

            {/* Auditor Details Card */}
            <Card>
              <CardHeader>
                <CardTitle>Auditor Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {startup.legalAndCompliance.auditorDetails && (
                  <>
                    <div>
                      <span className="text-sm text-muted-foreground block">Name</span>
                      <p>{startup.legalAndCompliance.auditorDetails.name}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground block">Firm</span>
                      <p>{startup.legalAndCompliance.auditorDetails.firm}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground block">Contact</span>
                      <p>{startup.legalAndCompliance.auditorDetails.contact}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground block">Email</span>
                      <p>{startup.legalAndCompliance.auditorDetails.email}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground block">Registration Number</span>
                      <p>{startup.legalAndCompliance.auditorDetails.registrationNumber}</p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="intellectual">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Intellectual Property</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {startup.businessActivities.intellectualProperty.map((ip, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <h3 className="font-semibold">{ip.type}</h3>
                      <p className="text-sm text-muted-foreground">{ip.details}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="support">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Support Requested</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {startup.supportAndNetworking.supportRequested.map((support, index) => (
                    <Badge key={index} variant="secondary">
                      {support}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Mentorship & Investment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <span className="text-sm text-muted-foreground block">Mentorship Programs</span>
                  <p>{startup.supportAndNetworking.mentorshipPrograms}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground block">Potential Investors</span>
                  <p>{startup.supportAndNetworking.potentialInvestors}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="documents">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Identity Proof */}
            {startup.owner.identityProof && (
              <Card>
                <CardHeader>
                  <CardTitle>Identity Proof</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <span className="text-sm text-muted-foreground block">Type</span>
                      <p>{startup.owner.identityProof.type}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground block">Number</span>
                      <p>{startup.owner.identityProof.number}</p>
                    </div>
                    {startup.owner.identityProof.secure_url && (
                      <div className="relative h-48 w-full">
                        <Image
                          src={startup.owner.identityProof.secure_url}
                          alt="Identity Proof"
                          fill
                          className="object-contain rounded-lg"
                        />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Pitch Deck */}
            {startup.additionalInfo.pitchDeck && (
              <Card>
                <CardHeader>
                  <CardTitle>Pitch Deck</CardTitle>
                </CardHeader>
                <CardContent>
                  <a 
                    href={startup.additionalInfo.pitchDeck.secure_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-blue-500 hover:underline"
                  >
                    <FileText className="h-4 w-4" />
                    View Pitch Deck
                  </a>
                </CardContent>
              </Card>
            )}

            {/* Additional Documents */}
            {startup.additionalInfo.documents && startup.additionalInfo.documents.length > 0 && (
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Additional Documents</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {startup.additionalInfo.documents.map((doc, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <a 
                          href={doc.secure_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-blue-500 hover:underline"
                        >
                          <FileText className="h-4 w-4" />
                          View Document {index + 1}
                        </a>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
