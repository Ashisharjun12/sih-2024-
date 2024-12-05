"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Globe } from "lucide-react";
import { useRouter } from "next/navigation";

interface StartupCardProps {
  startup: {
    _id: string;
    startupDetails: {
      startupName: string;
      startupLogo?: {
        secure_url: string;
      };
      industries: string[];
      stage: string;
    };
    businessActivities: {
      missionAndVision: string;
    };
    additionalInfo?: {
      website?: string;
    };
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      onClick={() => router.push(`/startup/projects/${startup._id}`)}
    >
      <Card className="cursor-pointer group hover:shadow-lg transition-all duration-300 overflow-hidden">
        <CardContent className="p-0">
          <div className="relative">
            {/* Banner Image with Gradient Overlay */}
            <div className="h-32 relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('/startup-banner.jpg')] bg-cover bg-center" />
              <div className={`absolute inset-0 bg-gradient-to-r ${BANNER_GRADIENTS[index % BANNER_GRADIENTS.length]} mix-blend-multiply`} />
              <div className="absolute inset-0 bg-black/20" />
              
              {/* Logo and Title */}
              <div className="relative p-6 flex items-start gap-4">
                {startup.startupDetails.startupLogo ? (
                  <img
                    src={startup.startupDetails.startupLogo.secure_url}
                    alt={startup.startupDetails.startupName}
                    className="h-16 w-16 rounded-lg object-cover bg-white p-1"
                  />
                ) : (
                  <div className="h-16 w-16 rounded-lg bg-white/90 flex items-center justify-center">
                    <Building2 className="h-8 w-8 text-primary" />
                  </div>
                )}
                <div>
                  <h3 className="font-semibold text-lg text-white">{startup.startupDetails.startupName}</h3>
                  <Badge variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-none">
                    {startup.startupDetails.stage}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="p-6">
              <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                {startup.businessActivities.missionAndVision}
              </p>

              <div className="flex flex-wrap gap-2 mb-4">
                {startup.startupDetails.industries.map((industry, i) => (
                  <Badge 
                    key={i} 
                    variant="outline"
                    className="bg-transparent"
                  >
                    {industry}
                  </Badge>
                ))}
              </div>

              {startup.additionalInfo?.website && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground pt-4 border-t">
                  <Globe className="h-4 w-4" />
                  <span>{startup.additionalInfo.website}</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
} 