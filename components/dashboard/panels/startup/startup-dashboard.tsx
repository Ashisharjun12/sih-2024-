"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

const demoStartupData = {
  startupName: "TechPioneers",
  industry: "Green Technology",
  stage: "Scaling",
  metrics: {
    revenue: "₹500,000",
    employees: 15,
    customers: 100,
  },
  recentActivities: [
    "Completed seed funding round",
    "Launched new product feature",
    "Hired 3 new developers",
  ],
};

export default function StartupDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Startup Dashboard</h1>
      
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="metrics">Metrics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Startup Info</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Name: {demoStartupData.startupName}</p>
                <p>Industry: {demoStartupData.industry}</p>
                <p>Stage: {demoStartupData.stage}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Key Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Revenue: {demoStartupData.metrics.revenue}</p>
                <p>Employees: {demoStartupData.metrics.employees}</p>
                <p>Customers: {demoStartupData.metrics.customers}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activities</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-4">
                  {demoStartupData.recentActivities.map((activity, index) => (
                    <li key={index}>{activity}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Add other tab contents as needed */}
      </Tabs>
    </div>
  );
} 