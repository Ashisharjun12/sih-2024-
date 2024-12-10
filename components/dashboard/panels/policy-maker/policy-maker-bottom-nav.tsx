"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  ScrollText,
  Building2,
  MessageSquare,
  Calendar
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const bottomNavItems = [
  {
    title: "Overview",
    href: "/policy-maker",
    icon: LayoutDashboard,
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
    title: "Meetings",
    href: "/policy-maker/meetings",
    icon: Calendar,
  },
  {
    title: "Messages",
    href: "/policy-maker/messages",
    icon: MessageSquare,
  },
];

export default function PolicyMakerBottomNav() {
  const pathname = usePathname();

  return (
    <div className="bg-background/80 backdrop-blur-lg border-t">
      <div className="flex items-center justify-around">
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
                  "flex flex-col items-center gap-1 h-auto py-2 px-0 w-full hover:bg-transparent relative",
                  isActive && "text-blue-600"
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
                  <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-blue-600" />
                )}
              </Button>
            </Link>
          );
        })}
      </div>
    </div>
  );
} 