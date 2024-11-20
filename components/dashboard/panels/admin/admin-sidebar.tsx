"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Users,
  Building2,
  GraduationCap,
  Scale,
  FileText,
  Banknote,
  UserCog,
  LayoutDashboard,
  Settings,
  FileSpreadsheet,
  Mail,
  MessageSquare,
  ClipboardList,
  CheckSquare,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

const sidebarItems = [
  {
    title: "Overview",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Form Applications",
    href: "/admin/forms",
    icon: ClipboardList,
  },
  {
    title: "User Management",
    href: "/admin/users",
    icon: Users,
  },
  {
    title: "Startups",
    href: "/admin/startups",
    icon: Building2,
  },
  {
    title: "Researchers",
    href: "/admin/researchers",
    icon: GraduationCap,
  },
  {
    title: "IPR Professionals",
    href: "/admin/ipr",
    icon: Scale,
  },
  {
    title: "Policy Makers",
    href: "/admin/policy",
    icon: FileText,
  },
  {
    title: "Funding Agencies",
    href: "/admin/funding",
    icon: Banknote,
  },
  {
    title: "Mentors",
    href: "/admin/mentors",
    icon: UserCog,
  },
  {
    title: "Reports",
    href: "/admin/reports",
    icon: FileSpreadsheet,
  },
  {
    title: "Messages",
    href: "/admin/messages",
    icon: MessageSquare,
  },
  {
    title: "Email",
    href: "/admin/email",
    icon: Mail,
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

export function AdminSidebar({ className }: SidebarProps) {
  const pathname = usePathname();

  return (
    <div className={cn("pb-12 min-h-screen", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold">Admin Dashboard</h2>
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