"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  Users,
  Calendar,
  MessageSquare,
  Settings,
  GraduationCap,
  ClipboardList,
  Target,
  Lightbulb,
  Star,
  User
} from "lucide-react";

const mentorLinks = [
  {
    title: "Overview",
    href: "/mentor",
    icon: BarChart3,
  },
  {
    title: "Profile",
    href: "/mentor/profile",
    icon: User,
  },
  {
    title: "Mentees",
    href: "/mentor/mentees",
    icon: Users,
  },
  {
    title: "Sessions",
    href: "/mentor/sessions",
    icon: Calendar,
  },
  {
    title: "Progress Tracking",
    href: "/mentor/progress",
    icon: Target,
  },
  {
    title: "Resources",
    href: "/mentor/resources",
    icon: GraduationCap,
  },
  {
    title: "Feedback",
    href: "/mentor/feedback",
    icon: Star,
  },
  {
    title: "Tasks",
    href: "/mentor/tasks",
    icon: ClipboardList,
  },
  {
    title: "Messages",
    href: "/mentor/messages",
    icon: MessageSquare,
  },
  {
    title: "Insights",
    href: "/mentor/insights",
    icon: Lightbulb,
  },
  {
    title: "Settings",
    href: "/mentor/settings",
    icon: Settings,
  },
];

export function MentorSidebar() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col gap-4 py-4">
      <div className="px-3 py-2">
        <h2 className="mb-2 px-4 text-lg font-semibold">Mentor Dashboard</h2>
        <div className="space-y-1">
          {mentorLinks.map((link) => {
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