"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Shield,
  FileCheck,
  Search,
  FileText,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const bottomNavItems = [
  {
    title: "Overview",
    href: "/ipr-professional",
    icon: LayoutDashboard,
  },
  {
    title: "Patents",
    href: "/ipr-professional/patents",
    icon: Shield,
  },
  {
    title: "Trademarks",
    href: "/ipr-professional/trademarks",
    icon: FileCheck,
  },
  {
    title: "Copyrights",
    href: "/ipr-professional/copyrights",
    icon: Search,
  },
  {
    title: "Trade Secrets",
    href: "/ipr-professional/tradesecrets",
    icon: FileText,
  },
];

export function IPRBottomNav() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-t md:hidden">
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
                  "flex flex-col items-center gap-1 h-16 w-full hover:bg-transparent relative",
                  isActive && "text-blue-600"
                )}
              >
                {isActive && (
                  <span className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-8 h-1 bg-blue-600 rounded-full" />
                )}
                <Icon className={cn(
                  "h-5 w-5 transition-all",
                  isActive ? "text-blue-600" : "text-muted-foreground"
                )} />
                <span className={cn(
                  "text-[10px] font-medium",
                  isActive ? "text-blue-600" : "text-muted-foreground"
                )}>
                  {item.title.split(' ')[0]}
                </span>
              </Button>
            </Link>
          );
        })}
      </div>
    </div>
  );
} 