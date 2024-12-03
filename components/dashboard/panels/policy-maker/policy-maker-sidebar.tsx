"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  FileText,
  ScrollText,
  BarChart3,
  Users,
  Settings,
  BookOpen,
  Building2,
  FileCheck,
  Activity,
  Briefcase,
  Menu,
  ChevronLeft
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const policyMakerLinks = [
  {
    title: "Overview",
    href: "/policy-maker",
    icon: BarChart3,
  },
  {
    title: "Applications",
    href: "/policy-maker/applications",
    icon: FileText,
  },
  {
    title: "Policies",
    href: "/policy-maker/policies",
    icon: ScrollText,
  },
  {
    title: "Startups",
    href: "/policy-maker/startups",
    icon: Building2,
  },
  {
    title: "Frameworks",
    href: "/policy-maker/frameworks",
    icon: BookOpen,
  },
  {
    title: "Compliance",
    href: "/policy-maker/compliance",
    icon: FileCheck,
  },
  {
    title: "Analytics",
    href: "/policy-maker/analytics",
    icon: Activity,
  },
  {
    title: "Stakeholders",
    href: "/policy-maker/stakeholders",
    icon: Users,
  },
  {
    title: "Projects",
    href: "/policy-maker/projects",
    icon: Briefcase,
  },
  {
    title: "Settings",
    href: "/policy-maker/settings",
    icon: Settings,
  },
];

export function PolicyMakerSidebar() {
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  return (
    <TooltipProvider>
      <div className={cn(
        "fixed top-0 left-0 h-screen bg-background z-30 shadow-lg transition-all duration-300",
        isExpanded ? "w-64 border-r" : "w-16",
        "flex flex-col"
      )}>
        {/* Header with Toggle Button and Title */}
        <div className="p-4 flex items-center border-b">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-8 w-8"
          >
            {isExpanded ? <ChevronLeft className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
          <AnimatePresence mode="wait">
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ 
                  opacity: 1, 
                  width: "auto",
                  transition: {
                    duration: 0.2,
                    ease: "easeOut"
                  }
                }}
                exit={{ 
                  opacity: 0,
                  width: 0,
                  transition: {
                    duration: 0.2,
                    ease: "easeIn"
                  }
                }}
                className="overflow-hidden whitespace-nowrap"
              >
                <motion.h2 
                  className="ml-2 text-lg font-semibold"
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ 
                    y: 0, 
                    opacity: 1,
                    transition: {
                      delay: 0.1,
                      duration: 0.2
                    }
                  }}
                  exit={{ 
                    y: -10, 
                    opacity: 0,
                    transition: {
                      duration: 0.1
                    }
                  }}
                >
                  Policy Maker Dashboard
                </motion.h2>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex flex-col gap-2 py-4 flex-1">
          {/* Navigation Links */}
          <div className="px-3 space-y-1">
            {policyMakerLinks.map((link) => {
              const Icon = link.icon;
              return (
                <div key={link.href} className="relative">
                  <Tooltip delayDuration={0} open={!isExpanded && hoveredItem === link.href}>
                    <TooltipTrigger asChild>
                      <Button
                        variant={pathname === link.href ? "secondary" : "ghost"}
                        className={cn(
                          "w-full justify-start",
                          pathname === link.href && "bg-primary/10",
                          !isExpanded && "px-2"
                        )}
                        asChild
                        onMouseEnter={() => setHoveredItem(link.href)}
                        onMouseLeave={() => setHoveredItem(null)}
                      >
                        <Link href={link.href}>
                          <Icon className={cn(
                            "h-4 w-4",
                            isExpanded && "mr-2"
                          )} />
                          {isExpanded && (
                            <motion.span
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                            >
                              {link.title}
                            </motion.span>
                          )}
                        </Link>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent 
                      side="right" 
                      className="animate-none"
                      sideOffset={5}
                    >
                      {link.title}
                    </TooltipContent>
                  </Tooltip>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Overlay when sidebar is expanded */}
      {isExpanded && (
        <div 
          className="fixed inset-0 bg-black/20 z-20"
          onClick={() => setIsExpanded(false)}
        />
      )}
    </TooltipProvider>
  );
} 