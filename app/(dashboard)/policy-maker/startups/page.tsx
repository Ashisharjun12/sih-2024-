"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import dynamic from "next/dynamic";
import { Building2, Users, TrendingUp, MapPin, Award, Briefcase, GraduationCap, LineChart, Target, Rocket } from "lucide-react";
import { gujaratStartups } from "./data/gujarat-startups";
import { motion, AnimatePresence } from "framer-motion";
import type { StartupHub } from "./data/gujarat-startups";
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

type BadgeVariant = "outline" | "default" | "secondary" | "destructive";

const StartupMap = dynamic(() => import("./components/Map"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[300px] md:h-[600px] flex items-center justify-center bg-muted rounded-lg">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
    </div>
  ),
});

export default function StartupsPage() {
  const [selectedStartup, setSelectedStartup] = useState<StartupHub | null>(null);

  return (
    <div className="container px-4 md:px-8 py-4 md:py-8 space-y-6 md:space-y-8 mb-16 md:mb-0">
      {/* Header with gradient background */}
      <div className="relative overflow-hidden rounded-xl md:rounded-2xl bg-gradient-to-br from-purple-500/10 via-cyan-500/5 to-transparent p-4 md:p-8">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-3xl font-bold">Gujarat Startup Ecosystem</h1>
            <p className="text-sm md:text-base text-muted-foreground mt-1 md:mt-2">
              Explore startup distribution across Gujarat
            </p>
          </div>
        
        </div>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
        {/* Map Section */}
        <div className="md:col-span-2">
          <Card className="bg-gradient-to-br from-background to-background/80 border-muted/20">
            <CardHeader className="p-4 md:p-6">
              <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                <MapPin className="h-5 w-5 text-blue-600" />
                Startup Locations
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <StartupMap 
                startups={gujaratStartups}
                onStartupSelect={setSelectedStartup}
              />
            </CardContent>
          </Card>
        </div>

        {/* Stats Section */}
        <div className="space-y-6">
          <AnimatePresence mode="wait">
            {selectedStartup ? (
              <motion.div
                key={selectedStartup.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <Card className="bg-gradient-to-br from-background to-background/80 border-muted/20">
                  <CardHeader className="p-4 md:p-6 pb-2 md:pb-3">
                    <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                      <Building2 className="h-5 w-5 text-blue-600" />
                      {selectedStartup.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 md:p-6 space-y-6">
                    {/* Key Metrics */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 rounded-lg bg-blue-500/10 space-y-1">
                        <p className="text-xs text-muted-foreground">Total Startups</p>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-blue-600" />
                          <p className="text-lg font-semibold">{selectedStartup.startupCount}</p>
                        </div>
                      </div>
                      <div className="p-3 rounded-lg bg-green-500/10 space-y-1">
                        <p className="text-xs text-muted-foreground">Growth Rate</p>
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-green-600" />
                          <p className="text-lg font-semibold">{selectedStartup.growth}</p>
                        </div>
                      </div>
                    </div>

                    {/* Startups List */}
                    <div className="space-y-3">
                      <h3 className="text-sm font-medium flex items-center gap-2">
                        <Rocket className="h-4 w-4 text-blue-600" />
                        Featured Startups
                      </h3>
                      <ScrollArea className="h-[300px] md:h-[400px] pr-4">
                        <div className="space-y-3">
                          {selectedStartup.startups.map((startup, index) => (
                            <div 
                              key={index}
                              className="p-4 rounded-lg bg-gradient-to-br from-muted/50 to-muted/30 hover:from-muted/70 hover:to-muted/50 transition-colors border border-muted/30"
                            >
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <h4 className="font-medium text-sm">{startup.name}</h4>
                                  <p className="text-xs text-muted-foreground">{startup.sector}</p>
                                </div>
                                <Badge variant={
                                  (startup.stage === 'Seed' ? 'default' :
                                  startup.stage === 'Early' ? 'secondary' :
                                  startup.stage === 'Growth' ? 'secondary' : 'outline') as BadgeVariant
                                } className={
                                  startup.stage === 'Seed' ? 'bg-blue-500/10 text-blue-600' :
                                  startup.stage === 'Early' ? 'bg-green-500/10 text-green-600' :
                                  startup.stage === 'Growth' ? 'bg-purple-500/10 text-purple-600' :
                                  'bg-gray-500/10 text-gray-600'
                                }>
                                  {startup.stage}
                                </Badge>
                              </div>
                              <div className="grid grid-cols-2 gap-2 text-xs">
                                <div className="flex items-center gap-2">
                                  <Users className="h-3 w-3 text-blue-600" />
                                  <span>{startup.employees} employees</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <LineChart className="h-3 w-3 text-green-600" />
                                  <span>{startup.funding}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        <ScrollBar orientation="vertical" />
                      </ScrollArea>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <Card className="bg-gradient-to-br from-background to-background/80 border-muted/20">
                <CardContent className="p-6 text-center">
                  <MapPin className="h-8 w-8 mx-auto mb-2 text-blue-600/50" />
                  <p className="text-sm text-muted-foreground">Select a location on the map to view details</p>
                </CardContent>
              </Card>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
