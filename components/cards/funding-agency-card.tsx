"use client";

import { motion } from "framer-motion";
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
  Globe,
  BarChart2,
  IndianRupee,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
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

const BANNER_GRADIENTS = [
  "from-blue-600/90 to-cyan-600/90",
  "from-purple-600/90 to-blue-600/90",
  "from-emerald-600/90 to-cyan-600/90",
];

export function FundingAgencyCard({
  agency,
  index = 0,
}: FundingAgencyCardProps & { index?: number }) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="w-[90%]"
    >
      <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
        <CardContent className="p-0">
          <div className="relative">
            {/* Clickable section */}
            <div
              onClick={() => setShowDetails(true)}
              className="cursor-pointer"
            >
              {/* Banner Image with Gradient Overlay */}
              <div className="h-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/agency-banner.jpg')] bg-cover bg-center" />
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${
                    BANNER_GRADIENTS[index % BANNER_GRADIENTS.length]
                  } mix-blend-multiply`}
                />
                <div className="absolute inset-0 bg-black/20" />
              </div>

              {/* Logo and Title Section */}
              <div className="relative px-4 -mt-8">
                <div className="flex items-center gap-3">
                  {agency.documentation?.registrationCertificate ? (
                    <Image
                      width={56}
                      height={56}
                      src={agency.documentation.registrationCertificate.secure_url}
                      alt={agency.agencyDetails.name}
                      className="rounded-full object-cover bg-white p-1 ring-2 ring-white shadow-lg"
                    />
                  ) : (
                    <div className="h-14 w-14 rounded-full bg-white/90 flex items-center justify-center ring-2 ring-white shadow-lg">
                      <Building2 className="h-7 w-7 text-primary" />
                    </div>
                  )}
                  <div>
                    <h3 className="text-lg font-bold text-white">
                      {agency.agencyDetails.name}
                    </h3>
                    <div className="flex gap-1.5 flex-wrap mt-1">
                      <Badge
                        variant="secondary"
                        className="bg-white/20 text-white border-none text-xs"
                      >
                        {agency.agencyDetails.type}
                      </Badge>
                      <Badge
                        variant="secondary"
                        className="bg-white/20 text-white border-none text-xs"
                      >
                        Est.{" "}
                        {new Date(
                          agency.agencyDetails.establishmentDate
                        ).getFullYear()}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-4 space-y-2.5 bg-gradient-to-b from-transparent to-blue-50/50">
                {/* Key Metrics */}
                <div className="grid grid-cols-3 gap-3 pt-1.5">
                  <div className="flex items-center gap-1.5 text-xs">
                    <Users className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>{agency.experience.yearsOfOperation} Years Exp.</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs">
                    <IndianRupee className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>
                      {(agency.experience.averageTicketSize / 10000000).toFixed(
                        1
                      )}
                      Cr Avg.
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs">
                    <Briefcase className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>
                      {agency.activeInvestments?.length || 0} Investments
                    </span>
                  </div>
                </div>

                {/* Preferred Industries & Sectors */}
                <div className="space-y-1.5">
                  <div className="flex flex-wrap gap-1.5">
                    {agency.fundingPreferences.preferredIndustries
                      .slice(0, 3)
                      .map((industry, i) => (
                        <Badge
                          key={i}
                          variant="outline"
                          className="bg-transparent text-xs"
                        >
                          {industry}
                        </Badge>
                      ))}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {agency.fundingPreferences.preferredSectors
                      .slice(0, 3)
                      .map((sector, i) => (
                        <Badge
                          key={i}
                          variant="outline"
                          className="bg-blue-500/10 text-blue-600 text-xs border-none"
                        >
                          {sector}
                        </Badge>
                      ))}
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {agency.agencyDetails.description}
                </p>
              </div>
            </div>

            {/* Non-clickable section */}
            <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground p-4 pt-2 border-t">
              <div className="flex items-center gap-2">
                {agency.contactInformation.websiteURL && (
                  <Link
                    href={agency.contactInformation.websiteURL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 hover:bg-blue-50 rounded-full transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Globe className="h-3.5 w-3.5 text-blue-600" />
                  </Link>
                )}
                <Link
                  href={`mailto:${agency.contactInformation.officialEmail}`}
                  className="p-1.5 hover:bg-blue-50 rounded-full transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Mail className="h-3.5 w-3.5 text-blue-600" />
                </Link>
              </div>

              {/* Details Button */}
              <Button
                size="sm"
                variant="ghost"
                className="hover:bg-blue-50 -mr-2"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDetails(true);
                }}
              >
                <BarChart2 className="h-4 w-4 text-blue-600 mr-1.5" />
                <span className="text-xs font-medium text-blue-600">
                  Details
                </span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Funding Agency Details</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Header Section */}
            <div className="flex items-start gap-6">
              <div className="relative h-24 w-24 rounded-xl overflow-hidden">
                {agency.documentation?.registrationCertificate ? (
                  <Image
                    src={
                      agency.documentation.registrationCertificate.secure_url
                    }
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
                    Est.{" "}
                    {new Date(
                      agency.agencyDetails.establishmentDate
                    ).getFullYear()}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Agency Information */}
            <div className="grid gap-4">
              <h3 className="font-semibold">Agency Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">
                    Registration No.
                  </p>
                  <p className="font-medium">
                    {agency.agencyDetails.registrationNumber}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Location</p>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <p className="font-medium">
                      {agency.contactInformation.officialAddress}
                    </p>
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
                        window.open(
                          agency.contactInformation.websiteURL,
                          "_blank"
                        )
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
                    ₹
                    {agency.fundingPreferences.minimumInvestment.toLocaleString(
                      "en-IN"
                    )}
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <p className="text-sm">Average Ticket Size</p>
                  <Badge variant="secondary">
                    ₹
                    {agency.experience.averageTicketSize.toLocaleString(
                      "en-IN"
                    )}
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <p className="text-sm">Total Investments</p>
                  <Badge variant="secondary">
                    ₹
                    {agency.experience.totalInvestments.toLocaleString("en-IN")}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
