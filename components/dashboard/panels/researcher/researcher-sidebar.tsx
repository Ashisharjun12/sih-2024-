"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  LayoutDashboard,
  FileText,
  Settings,
  GraduationCap,
  Users,
  Banknote,
  LineChart,
  BookOpen,
  FileSpreadsheet,
  MessageSquare,
  Mail,
  Target,
  Award,
  Network,
  Calendar,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

const sidebarItems = [
  {
    title: "Overview",
    href: "/researcher",
    icon: LayoutDashboard,
  },
  {
    title: "Research Projects",
    href: "/researcher/projects",
    icon: BookOpen,
  },
  {
    title: "Publications",
    href: "/researcher/publications",
    icon: FileText,
  },
  {
    title: "Collaborations",
    href: "/researcher/collaborations",
    icon: Network,
  },
  {
    title: "Funding",
    href: "/researcher/funding",
    icon: Banknote,
  },
  {
    title: "Achievements",
    href: "/researcher/achievements",
    icon: Award,
  },
  {
    title: "Team Members",
    href: "/researcher/team",
    icon: Users,
  },
  {
    title: "Analytics",
    href: "/researcher/analytics",
    icon: LineChart,
  },
  {
    title: "Reports",
    href: "/researcher/reports",
    icon: FileSpreadsheet,
  },
  {
    title: "Meetings",
    href: "/researcher/meetings",
    icon: Calendar,
  },
  {
    title: "Messages",
    href: "/researcher/messages",
    icon: MessageSquare,
  },
  {
    title: "Settings",
    href: "/researcher/settings",
    icon: Settings,
  },
  {
    title: "IPR",
    href: "/researcher/ipr",
    icon: FileText,
  },
];

export function ResearcherSidebar({ className }: SidebarProps) {
  const pathname = usePathname();

  return (
    <div className={cn("pb-12 min-h-screen", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold">
            Researcher Dashboard
          </h2>
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
