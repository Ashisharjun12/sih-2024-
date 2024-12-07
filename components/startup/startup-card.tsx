"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Globe, Users, TrendingUp, Briefcase, Linkedin, BarChart2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { MetricsModal } from "@/components/metrics/metrics-modal";

interface StartupCardProps {
  startup: {
    _id: string;
    startupDetails: {
      startupName: string;
      startupLogo?: {
        secure_url: string;
      };
      industries: string[];
      sectors: string[];
      stage: string;
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
      about: string;
    };
    businessActivities: {
      missionAndVision: string;
    };
    additionalInfo: {
      website?: string;
      socialMedia?: {
        linkedIn?: string;
        twitter?: string;
        facebook?: string;
      };
    };
    isActivelyFundraising: boolean;
  };
  index: number;
}

const BANNER_GRADIENTS = [
  "from-blue-600/90 to-cyan-600/90",
  "from-purple-600/90 to-blue-600/90",
  "from-emerald-600/90 to-cyan-600/90",
];

export function StartupCard({ startup, index }: StartupCardProps) {
  const router = useRouter();
  const [showMetrics, setShowMetrics] = useState(false);

  const handleMainSectionClick = () => {
    router.push(`/explore/startupDetails/${startup._id}`);
  };

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
            {/* Clickable section (Banner, Logo, Title, Content) */}
            <div 
              onClick={handleMainSectionClick}
              className="cursor-pointer"
            >
              {/* Banner Image with Gradient Overlay */}
              <div className="h-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/startup-banner.jpg')] bg-cover bg-center" />
                <div className={`absolute inset-0 bg-gradient-to-r ${BANNER_GRADIENTS[index % BANNER_GRADIENTS.length]} mix-blend-multiply`} />
                <div className="absolute inset-0 bg-black/20" />
              </div>

              {/* Logo and Title Section */}
              <div className="relative px-4 -mt-8">
                <div className="flex items-center gap-3">
                  {startup.startupDetails.startupLogo ? (
                    <img
                      src={startup.startupDetails.startupLogo.secure_url}
                      alt={startup.startupDetails.startupName}
                      className="h-14 w-14 rounded-full object-cover bg-white p-1 ring-2 ring-white shadow-lg"
                    />
                  ) : (
                    <div className="h-14 w-14 rounded-full bg-white/90 flex items-center justify-center ring-2 ring-white shadow-lg">
                      <Building2 className="h-7 w-7 text-primary" />
                    </div>
                  )}
                  <div>
                    <h3 className="text-lg font-bold text-white">
                      {startup.startupDetails.startupName}
                    </h3>
                    <div className="flex gap-1.5 flex-wrap mt-1">
                      {startup.isActivelyFundraising && (
                        <Badge variant="secondary" className="bg-green-500 mt-1.5 text-white border-none text-xs">
                          Actively Fundraising
                        </Badge>
                      )}
                      <Badge variant="secondary" className="bg-white/20 text-white border-none text-xs">
                        {startup.startupDetails.stage}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content Section (Industries, Sectors, About) */}
              <div className="p-4 space-y-2.5 bg-gradient-to-b from-transparent to-blue-50/50">
                {/* Key Metrics */}
                <div className="grid grid-cols-3 gap-3 pt-1.5">
                  <div className="flex items-center gap-1.5 text-xs">
                    <Users className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>{startup.startupDetails.founders.length} Founders</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs">
                    <TrendingUp className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>{startup.startupDetails.revenueModel}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs">
                    <Briefcase className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>{startup.startupDetails.businessModel}</span>
                  </div>
                </div>

                {/* Industries & Sectors */}
                <div className="space-y-1.5">
                  <div className="flex flex-wrap gap-1.5">
                    {startup.startupDetails.industries.map((industry, i) => (
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
                    {startup.startupDetails.sectors.map((sector, i) => (
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

                {/* About */}
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {startup.startupDetails.about || startup.businessActivities.missionAndVision}
                </p>
              </div>
            </div>

            {/* Non-clickable section (Social Links and Analytics) */}
            <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground p-4 pt-2 border-t">
              <div className="flex items-center gap-2">
                {startup.additionalInfo?.website && (
                  <Link 
                    href={startup.additionalInfo.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-1.5 hover:bg-blue-50 rounded-full transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Globe className="h-3.5 w-3.5 text-blue-600" />
                  </Link>
                )}
                {startup.additionalInfo?.socialMedia?.linkedIn && (
                  <Link 
                    href={startup.additionalInfo.socialMedia.linkedIn} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-1.5 hover:bg-blue-50 rounded-full transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Linkedin className="h-3.5 w-3.5 text-blue-600" />
                  </Link>
                )}
              </div>

              {/* Analytics Button */}
              <Button
                size="sm"
                variant="ghost"
                className="hover:bg-blue-50 -mr-2"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMetrics(true);
                }}
              >
                <BarChart2 className="h-4 w-4 text-blue-600 mr-1.5" />
                <span className="text-xs font-medium text-blue-600">Analytics</span>
              </Button>
            </div>
          </div>
        </CardContent>

        {/* Metrics Modal */}
        <MetricsModal 
          isOpen={showMetrics}
          onClose={() => setShowMetrics(false)}
          startupId={startup._id}
        />
      </Card>
    </motion.div>
  );
} 