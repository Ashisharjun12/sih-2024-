"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronRight,
  FileCheck,
  CalendarClock,
  Building2,
  Target,
  Users,
  ArrowUpRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface PolicyCardProps {
  policy: {
    _id: string;
    title: string;
    description: string;
    status: "Draft" | "Active" | "Under Review" | "Archived";
    sector: string;
    lastUpdated: string;
    implementationDate: string;
  };
  onClick?: () => void;
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "Draft":
      return <Clock className="h-4 w-4" />;
    case "Active":
      return <CheckCircle className="h-4 w-4" />;
    case "Under Review":
      return <AlertCircle className="h-4 w-4" />;
    case "Archived":
      return <XCircle className="h-4 w-4" />;
    default:
      return null;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "Draft":
      return "bg-yellow-500/10 text-yellow-700 border-yellow-500/20";
    case "Active":
      return "bg-green-500/10 text-green-700 border-green-500/20";
    case "Under Review":
      return "bg-blue-500/10 text-blue-700 border-blue-500/20";
    case "Archived":
      return "bg-gray-500/10 text-gray-700 border-gray-500/20";
    default:
      return "bg-gray-500/10 text-gray-700 border-gray-500/20";
  }
};

const GRADIENT_VARIANTS = [
  "from-blue-600/10 via-indigo-600/5 to-purple-600/10",
  "from-emerald-600/10 via-teal-600/5 to-cyan-600/10",
  "from-orange-600/10 via-pink-600/5 to-rose-600/10",
  "from-violet-600/10 via-purple-600/5 to-fuchsia-600/10",
];

export function PolicyCard({ policy, onClick }: PolicyCardProps) {
  // Format dates safely
  const formatDate = (dateString: string) => {
    try {
      if (!dateString) return "Not set";
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Invalid date";
      
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }).format(date);
    } catch (error) {
      return "Invalid date";
    }
  };

  // Get random gradient for card
  const gradientIndex = Math.abs(policy._id.charCodeAt(0)) % GRADIENT_VARIANTS.length;
  const gradientClass = GRADIENT_VARIANTS[gradientIndex];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      onClick={onClick}
      className="cursor-pointer group"
    >
      <Card className="overflow-hidden bg-gradient-to-br from-background to-background/80 border-muted/20 hover:shadow-lg transition-all duration-300">
        <CardContent className="p-0">
          {/* Header with gradient */}
          <div className={cn(
            "relative h-24 bg-gradient-to-r p-4",
            gradientClass
          )}>
            <div className="absolute inset-0 bg-background/10 backdrop-blur-sm" />
            <div className="relative flex justify-between items-start">
              <Badge variant="secondary" className={cn("border", getStatusColor(policy.status))}>
                <div className="flex items-center gap-1.5">
                  {getStatusIcon(policy.status)}
                  {policy.status}
                </div>
              </Badge>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1" />
            </div>
          </div>

          {/* Content */}
          <div className="p-4 space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                {policy.title}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {policy.description}
              </p>
            </div>

            {/* Stats Grid - Simplified */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2 text-sm">
                <div className="p-2 rounded-md bg-blue-500/10">
                  <Building2 className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Sector</p>
                  <p className="font-medium truncate">{policy.sector}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="p-2 rounded-md bg-purple-500/10">
                  <Users className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Stakeholders</p>
                  <p className="font-medium">12 Active</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
} 