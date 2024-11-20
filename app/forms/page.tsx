"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";

const formTypes = [
  {
    title: "Startup Registration",
    description: "Register your startup and join our ecosystem",
    href: "/forms/startup",
    icon: "🚀",
  },
  {
    title: "Researcher Registration",
    description: "Join as a researcher and collaborate",
    href: "/forms/researcher",
    icon: "🔬",
  },
  {
    title: "IPR Professional",
    description: "Register as an IPR professional",
    href: "/forms/ipr",
    icon: "⚖️",
  },
  {
    title: "Policy Maker",
    description: "Join as a policy maker",
    href: "/forms/policy",
    icon: "📜",
  },
  {
    title: "Funding Agency",
    description: "Register your funding agency",
    href: "/forms/funding",
    icon: "💰",
  },
  {
    title: "Mentor Registration",
    description: "Become a mentor",
    href: "/forms/mentor",
    icon: "👨‍🏫",
  },
];

export default function FormsPage() {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Choose Registration Type</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {formTypes.map((form, index) => (
          <motion.div
            key={form.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link href={form.href}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-2xl">{form.icon}</span>
                    {form.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{form.description}</p>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
} 