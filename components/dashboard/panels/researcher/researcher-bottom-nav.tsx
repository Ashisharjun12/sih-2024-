"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  FileText,
  Calendar,
  MessageSquare,
  BookOpen,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const bottomNavItems = [
  {
    title: "Overview",
    href: "/researcher",
    icon: LayoutDashboard,
  },
  {
    title: "Publications",
    href: "/researcher/publications",
    icon: BookOpen,
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
    title: "IPR",
    href: "/researcher/ipr",
    icon: FileText,
  },
];

export default function ResearcherBottomNav() {
  const pathname = usePathname();

  return (
    <div className="bg-background border-t">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {bottomNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link 
              key={item.href} 
              href={item.href}
              className="w-16"
            >
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "flex flex-col items-center gap-1 h-auto py-2 px-0 w-full hover:bg-transparent",
                  isActive && "text-primary font-medium"
                )}
              >
                <Icon className={cn(
                  "h-6 w-6 transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground"
                )} />
                <span className={cn(
                  "text-[10px]",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}>
                  {item.title}
                </span>
              </Button>
            </Link>
          );
        })}
      </div>
    </div>
  );
} 