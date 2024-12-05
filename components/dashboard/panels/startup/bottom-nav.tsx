"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  LineChart,
  Calendar,
  MessageSquare,
  FileText,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const bottomNavItems = [
  {
    title: "Overview",
    href: "/startup",
    icon: LayoutDashboard,
  },
  {
    title: "Metrics",
    href: "/startup/metrics",
    icon: LineChart,
  },
  {
    title: "Meetings",
    href: "/startup/meetings",
    icon: Calendar,
  },
  {
    title: "Messages",
    href: "/startup/messages",
    icon: MessageSquare,
  },
  {
    title: "IPR",
    href: "/startup/ipr",
    icon: FileText,
  },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <div className="bg-background/80 backdrop-blur-lg border-t px-2 py-2">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {bottomNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link 
              key={item.href} 
              href={item.href}
              className="w-16 flex flex-col items-center"
            >
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "flex flex-col items-center gap-1 h-auto py-2 px-0 w-full hover:bg-transparent relative",
                  isActive && "text-primary"
                )}
              >
                <Icon className={cn(
                  "h-5 w-5 transition-all",
                  isActive && "scale-110"
                )} />
                <span className={cn(
                  "text-[10px] font-medium transition-all",
                  isActive ? "opacity-100" : "opacity-70"
                )}>
                  {item.title}
                </span>
                {isActive && (
                  <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
                )}
              </Button>
            </Link>
          );
        })}
      </div>
    </div>
  );
} 