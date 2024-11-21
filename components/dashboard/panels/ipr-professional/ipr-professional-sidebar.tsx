"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  FileText,
  Shield,
  Search,
  Settings,
  BookOpen,
  FileCheck,
  GraduationCap,
  Scale,
  Globe
} from "lucide-react";

const iprProfessionalLinks = [
  {
    title: "Overview",
    href: "/ipr-professional",
    icon: BarChart3,
  },
  {
    title: "Patent Applications",
    href: "/ipr-professional/patents",
    icon: Shield,
  },
  {
    title: "Trademark Reviews",
    href: "/ipr-professional/trademarks",
    icon: FileCheck,
  },
  {
    title: "IP Search",
    href: "/ipr-professional/search",
    icon: Search,
  },
  {
    title: "Legal Documents",
    href: "/ipr-professional/documents",
    icon: FileText,
  },
  {
    title: "IP Education",
    href: "/ipr-professional/education",
    icon: GraduationCap,
  },
  {
    title: "Compliance",
    href: "/ipr-professional/compliance",
    icon: Scale,
  },
  {
    title: "Global IP",
    href: "/ipr-professional/global",
    icon: Globe,
  },
  {
    title: "Resources",
    href: "/ipr-professional/resources",
    icon: BookOpen,
  },
  {
    title: "Settings",
    href: "/ipr-professional/settings",
    icon: Settings,
  },
];

export function IPRProfessionalSidebar() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col gap-4 py-4">
      <div className="px-3 py-2">
        <h2 className="mb-2 px-4 text-lg font-semibold">IPR Professional Dashboard</h2>
        <div className="space-y-1">
          {iprProfessionalLinks.map((link) => {
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