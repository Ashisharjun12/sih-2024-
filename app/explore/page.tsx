"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { AnimatedCard } from "@/components/ui/animated-card";

export default function ExplorePage() {
  return (
    <motion.div 
      className="container py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h1 
        className="text-4xl font-bold mb-8"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        Explore
      </motion.h1>
      
      <motion.div 
        className="mb-8"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Input 
          placeholder="Search startups, researchers, or innovations..." 
          className="max-w-2xl"
        />
      </motion.div>

      <Tabs defaultValue="startups">
        <TabsList className="mb-8">
          <TabsTrigger value="startups">Startups</TabsTrigger>
          <TabsTrigger value="researchers">Researchers</TabsTrigger>
          <TabsTrigger value="innovations">Innovations</TabsTrigger>
        </TabsList>

        <TabsContent value="startups">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {demoStartups.map((startup, index) => (
              <AnimatedCard
                key={startup.name}
                title={startup.name}
                delay={index * 0.1}
              >
                <p className="text-muted-foreground mb-2">{startup.description}</p>
                <div className="flex gap-2 flex-wrap">
                  {startup.tags.map((tag, i) => (
                    <motion.span
                      key={i}
                      className="bg-muted px-2 py-1 rounded-md text-sm"
                      whileHover={{ scale: 1.05 }}
                    >
                      {tag}
                    </motion.span>
                  ))}
                </div>
              </AnimatedCard>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}

const demoStartups = [
  {
    name: "EcoTech Solutions",
    description: "Developing sustainable energy solutions for urban environments",
    tags: ["CleanTech", "Sustainability", "Energy"],
  },
  {
    name: "HealthAI",
    description: "AI-powered healthcare diagnostics platform",
    tags: ["HealthTech", "AI", "MedTech"],
  },
  {
    name: "FinLoop",
    description: "Revolutionizing financial services with blockchain",
    tags: ["FinTech", "Blockchain", "Banking"],
  },
]; 