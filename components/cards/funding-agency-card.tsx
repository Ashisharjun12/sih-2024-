"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Building2,
  MapPin,
  Users,
  Briefcase,
  ExternalLink,
  Mail,
  Phone,
} from "lucide-react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";

interface FundingAgencyCardProps {
  agency: {
    _id: string;
    userId: string;
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
      websiteURL?: string;
    };
    representatives: Array<{
      name: string;
      designation: string;
      email: string;
      phone: string;
    }>;
    fundingPreferences: {
      minimumInvestment: number;
      preferredStages: string[];
      fundingTypes: string[];
      preferredSectors: string[];
      preferredIndustries: string[];
    };
    documentation: {
      registrationCertificate?: {
        public_id: string;
        secure_url: string;
      };
      governmentApprovals?: {
        public_id: string;
        secure_url: string;
      };
      taxDocuments?: {
        public_id: string;
        secure_url: string;
      };
    };
    experience: {
      yearsOfOperation: number;
      totalInvestments: number;
      averageTicketSize: number;
    };
    activeInvestments: any[];
    requests: any[];
  };
}

export function FundingAgencyCard({ agency }: FundingAgencyCardProps) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="relative h-16 w-16 rounded-lg overflow-hidden">
              {agency.documentation?.registrationCertificate ? (
                <Image
                  src={agency.documentation.registrationCertificate.secure_url}
                  alt={agency.agencyDetails.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <Building2 className="h-8 w-8 text-muted-foreground" />
                </div>
              )}
            </div>

            <div className="flex-1 space-y-2">
              <div>
                <h3 className="font-semibold text-lg">
                  {agency.agencyDetails.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {agency.agencyDetails.type}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  {agency.contactInformation.officialAddress}
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  {agency.experience.yearsOfOperation} years experience
                </div>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDetails(true)}
            >
              View Details
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Funding Agency Details</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Header Section */}
            <div className="flex items-start gap-6">
              <div className="relative h-24 w-24 rounded-xl overflow-hidden">
                {agency.documentation?.registrationCertificate ? (
                  <Image
                    src={agency.documentation.registrationCertificate.secure_url}
                    alt={agency.agencyDetails.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center">
                    <Building2 className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}
              </div>

              <div className="flex-1">
                <h2 className="text-2xl font-bold">
                  {agency.agencyDetails.name}
                </h2>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline">{agency.agencyDetails.type}</Badge>
                  <Badge variant="secondary">
                    Est. {new Date(agency.agencyDetails.establishmentDate).getFullYear()}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Agency Information */}
            <div className="grid gap-4">
              <h3 className="font-semibold">Agency Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Registration No.</p>
                  <p className="font-medium">
                    {agency.agencyDetails.registrationNumber}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Location</p>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <p className="font-medium">{agency.contactInformation.officialAddress}</p>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Experience</p>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <p className="font-medium">
                      {agency.experience.yearsOfOperation} years
                    </p>
                  </div>
                </div>
                {agency.contactInformation.websiteURL && (
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Website</p>
                    <Button
                      variant="link"
                      className="p-0 h-auto"
                      onClick={() =>
                        window.open(agency.contactInformation.websiteURL, "_blank")
                      }
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Visit Website
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Contact Information */}
            <div className="grid gap-4">
              <h3 className="font-semibold">Contact Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Email</p>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <p className="font-medium">
                      {agency.contactInformation.officialEmail}
                    </p>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    <p className="font-medium">
                      {agency.contactInformation.phoneNumber}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Funding Preferences */}
            <div className="grid gap-4">
              <h3 className="font-semibold">Funding Details</h3>
              <div className="grid gap-2">
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <p className="text-sm">Minimum Investment</p>
                  <Badge variant="secondary">
                    ₹{agency.fundingPreferences.minimumInvestment.toLocaleString('en-IN')}
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <p className="text-sm">Average Ticket Size</p>
                  <Badge variant="secondary">
                    ₹{agency.experience.averageTicketSize.toLocaleString('en-IN')}
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <p className="text-sm">Total Investments</p>
                  <Badge variant="secondary">
                    ₹{agency.experience.totalInvestments.toLocaleString('en-IN')}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
} 