"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  Building2,
  FileText,
  DollarSign,
  Users,
  Settings,
  PieChart,
  Briefcase,
  LineChart,
  Target
} from "lucide-react";

const fundingAgencyLinks = [
  {
    title: "Overview",
    href: "/funding-agency",
    icon: BarChart3,
  },
  {
    title: "Investment Portfolio",
    href: "/funding-agency/portfolio",
    icon: PieChart,
  },
  {
    title: "Funding Applications",
    href: "/funding-agency/applications",
    icon: FileText,
  },
  {
    title: "Startups",
    href: "/funding-agency/startups",
    icon: Building2,
  },
  {
    title: "Investments",
    href: "/funding-agency/investments",
    icon: DollarSign,
  },
  {
    title: "Performance",
    href: "/funding-agency/performance",
    icon: LineChart,
  },
  {
    title: "Projects",
    href: "/funding-agency/projects",
    icon: Briefcase,
  },
  {
    title: "Goals",
    href: "/funding-agency/goals",
    icon: Target,
  },
  {
    title: "Network",
    href: "/funding-agency/network",
    icon: Users,
  },
  {
    title: "Settings",
    href: "/funding-agency/settings",
    icon: Settings,
  },
];

export function FundingAgencySidebar() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col gap-4 py-4">
      <div className="px-3 py-2">
        <h2 className="mb-2 px-4 text-lg font-semibold">Funding Agency Dashboard</h2>
        <div className="space-y-1">
          {fundingAgencyLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Button
                key={link.href}
                variant={pathname === link.href ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start gap-2",
                  pathname === link.href && "bg-primary/10"
                )}
                asChild
              >
                <Link href={link.href}>
                  <Icon className="h-4 w-4" />
                  {link.title}
                </Link>
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
} 