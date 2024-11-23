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
  FileCheck,
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
    title: "Trademark Applications",
    href: "/ipr-professional/trademarks",
    icon: FileCheck,
  },
  {
    title: "Copyright Applications",
    href: "/ipr-professional/copyrights",
    icon: Search,
  },
  {
    title: "Trade Secret Applications",
    href: "/ipr-professional/tradesecrets",
    icon: FileText,
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
        <h2 className="mb-2 px-4 text-lg font-semibold">
          IPR Professional Dashboard
        </h2>
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
