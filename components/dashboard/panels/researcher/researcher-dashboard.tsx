"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

import { useRoleGuard } from "@/hooks/use-role-guard";
import { useToast } from "@/hooks/use-toast";

export default function ResearcherDashboard() {
  const { session, status } = useRoleGuard("researcher");
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <div className="container py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Researcher Dashboard</h1>
          <Button>Add New Research</Button>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="researches">Researches</TabsTrigger>
            <TabsTrigger value="funding">Funding</TabsTrigger>
            <TabsTrigger value="collaborations">Collaborations</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>Active Researches</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">5</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Total Funding</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">₹2.5M</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Collaborations</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">3</p>
                </CardContent>
              </Card>
            </div>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Recent Activities</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  <li className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">New Research Paper Published</p>
                      <p className="text-sm text-muted-foreground">2 days ago</p>
                    </div>
                    <Button variant="outline" size="sm">View</Button>
                  </li>
                  <li className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Funding Received</p>
                      <p className="text-sm text-muted-foreground">1 week ago</p>
                    </div>
                    <Button variant="outline" size="sm">Details</Button>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="researches">
            <Card>
              <CardHeader>
                <CardTitle>Your Researches</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Map through actual researches here */}
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">Deep Learning for NLP</h3>
                      <p className="text-sm text-muted-foreground">Started: Jan 2023</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">Edit</Button>
                      <Button variant="outline" size="sm">View</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="funding">
            <Card>
              <CardHeader>
                <CardTitle>Funding History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Map through actual funding history here */}
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">National Science Foundation</h3>
                      <p className="text-sm text-muted-foreground">Amount: ₹500,000</p>
                    </div>
                    <Button variant="outline" size="sm">Details</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="collaborations">
            <Card>
              <CardHeader>
                <CardTitle>Active Collaborations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Map through actual collaborations here */}
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">Tech University</h3>
                      <p className="text-sm text-muted-foreground">Project: AI Research</p>
                    </div>
                    <Button variant="outline" size="sm">View Details</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
} 