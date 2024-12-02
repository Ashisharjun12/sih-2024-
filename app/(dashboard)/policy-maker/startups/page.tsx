"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import dynamic from "next/dynamic";
import { Building2, Users, TrendingUp, MapPin, Award, Briefcase, GraduationCap, LineChart, Target } from "lucide-react";
import { gujaratStartups } from "./data/gujarat-startups";
import { motion, AnimatePresence } from "framer-motion";
import type { StartupHub } from "./data/gujarat-startups";
import { Badge } from "@/components/ui/badge";

type BadgeVariant = "outline" | "default" | "secondary" | "destructive";

const StartupMap = dynamic(() => import("./components/Map"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[600px] flex items-center justify-center bg-muted rounded-lg">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
    </div>
  ),
});

export default function StartupsPage() {
  const [selectedStartup, setSelectedStartup] = useState<StartupHub | null>(null);

  return (
    <div className="container py-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Gujarat Startup Ecosystem</h1>
        <p className="text-muted-foreground mt-2">
          Explore startup distribution across Gujarat
        </p>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Map Section */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
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

        {/* Details Section */}
        <div className="space-y-6">
          <AnimatePresence mode="wait">
            {selectedStartup ? (
              <motion.div
                key={selectedStartup.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>{selectedStartup.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Overview Stats */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-primary/10 rounded-lg">
                        <p className="text-sm text-muted-foreground">Total Startups</p>
                        <p className="text-2xl font-bold">{selectedStartup.startupCount}</p>
                        <p className="text-sm text-green-600">{selectedStartup.growth} growth</p>
                      </div>
                      <div className="p-4 bg-green-500/10 rounded-lg">
                        <p className="text-sm text-muted-foreground">Total Funding</p>
                        <p className="text-2xl font-bold">{selectedStartup.funding}</p>
                        <p className="text-sm text-muted-foreground">{selectedStartup.metrics.avgValuation} avg</p>
                      </div>
                    </div>

                    {/* Facilities & Amenities */}
                    <div>
                      <h3 className="font-semibold mb-3">Facilities & Amenities</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedStartup.facilities.map((facility, index) => (
                          <Badge key={index} variant="secondary">
                            {facility}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Key Partners */}
                    <div>
                      <h3 className="font-semibold mb-3">Key Partners</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedStartup.keyPartners.map((partner, index) => (
                          <Badge key={index} variant="outline" className="bg-blue-50">
                            {partner}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Startups List */}
                    <div>
                      <h3 className="font-semibold mb-3">Notable Startups</h3>
                      <div className="space-y-3">
                        {selectedStartup.startups.map((startup, index) => (
                          <div 
                            key={index}
                            className="p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
                          >
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h4 className="font-medium">{startup.name}</h4>
                                <p className="text-sm text-muted-foreground">{startup.sector}</p>
                              </div>
                              <Badge variant={
                                (startup.stage === 'Seed' ? 'default' :
                                startup.stage === 'Early' ? 'secondary' :
                                startup.stage === 'Growth' ? 'secondary' : 'outline') as BadgeVariant
                              }>
                                {startup.stage}
                              </Badge>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div className="flex items-center gap-2">
                                <Users className="h-4 w-4 text-muted-foreground" />
                                <span>{startup.employees} employees</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <LineChart className="h-4 w-4 text-muted-foreground" />
                                <span>{startup.funding}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <Card>
                <CardContent className="p-6 text-center text-muted-foreground">
                  Select a location on the map to view details
                </CardContent>
              </Card>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
