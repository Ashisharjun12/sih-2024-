"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  FileText,
  ScrollText,
  BarChart3,
  Users,
  Settings,
  BookOpen,
  Building2,
  FileCheck,
  Activity,
  Briefcase
} from "lucide-react";

const policyMakerLinks = [
  {
    title: "Overview",
    href: "/policy-maker",
    icon: BarChart3,
  },
  {
    title: "Applications",
    href: "/policy-maker/applications",
    icon: FileText,
  },
  {
    title: "Policies",
    href: "/policy-maker/policy",
    icon: ScrollText,
  },
  {
    title: "Startups",
    href: "/policy-maker/startups",
    icon: Building2,
  },
  {
    title: "Frameworks",
    href: "/policy-maker/frameworks",
    icon: BookOpen,
  },
  {
    title: "Compliance",
    href: "/policy-maker/compliance",
    icon: FileCheck,
  },
  {
    title: "Analytics",
    href: "/policy-maker/analytics",
    icon: Activity,
  },
  {
    title: "Stakeholders",
    href: "/policy-maker/stakeholders",
    icon: Users,
  },
  {
    title: "Projects",
    href: "/policy-maker/projects",
    icon: Briefcase,
  },
  {
    title: "Settings",
    href: "/policy-maker/settings",
    icon: Settings,
  },
];

export function PolicyMakerSidebar() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col gap-4 py-4">
      <div className="px-3 py-2">
        <h2 className="mb-2 px-4 text-lg font-semibold">Policy Maker Dashboard</h2>
        <div className="space-y-1">
          {policyMakerLinks.map((link) => {
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