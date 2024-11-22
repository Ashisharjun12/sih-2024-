"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  LayoutDashboard,
  FileText,
  Settings,
  Building2,
  Users,
  Banknote,
  LineChart,
  Briefcase,
  FileSpreadsheet,
  MessageSquare,
  Mail,
  Target,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

const sidebarItems = [
  {
    title: "Overview",
    href: "/startup",
    icon: LayoutDashboard,
  },
  {
    title: "Profile",
    href: "/startup/profile",
    icon: Building2,
  },
  {
    title: "Team",
    href: "/startup/team",
    icon: Users,
  },
  {
    title: "Funding",
    href: "/startup/funding",
    icon: Banknote,
  },
  {
    title: "Metrics",
    href: "/startup/metrics",
    icon: LineChart,
  },
  {
    title: "Startup",
    href: "/startup/startup",
    icon: Building2,
  },
  {
    title: "Reports",
    href: "/startup/reports",
    icon: FileSpreadsheet,
  },
  {
    title: "Goals",
    href: "/startup/goals",
    icon: Target,
  },
  {
    title: "Messages",
    href: "/startup/messages",
    icon: MessageSquare,
  },
  {
    title: "Email",
    href: "/startup/email",
    icon: Mail,
  },
  {
    title: "Settings",
    href: "/startup/settings",
    icon: Settings,
  },
  {
    title: "IPR",
    href: "/startup/ipr",
    icon: FileText,
  },
];

export function StartupSidebar({ className }: SidebarProps) {
  const pathname = usePathname();

  return (
    <div className={cn("pb-12 min-h-screen", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold">Startup Dashboard</h2>
          <ScrollArea className="h-[calc(100vh-10rem)] px-2">
            <div className="space-y-1">
              {sidebarItems.map((item) => (
                <Button
                  key={item.href}
                  asChild
                  variant={pathname === item.href ? "secondary" : "ghost"}
                  className="w-full justify-start"
                >
                  <Link href={item.href}>
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.title}
                  </Link>
                </Button>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
} 