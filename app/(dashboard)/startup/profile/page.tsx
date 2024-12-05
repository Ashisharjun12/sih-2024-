"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import {
  User, Mail, Phone, Building2, Rocket, 
  Calendar, MapPin, Edit, Briefcase, Globe,
  Users, Target, ChevronRight
} from "lucide-react";
import Link from "next/link";

interface StartupProfile {
  _id: string;
  owner: {
    fullName: string;
    email: string;
    phone: string;
    businessAddress: {
      city: string;
      state: string;
    };
  };
  startupDetails: {
    startupName: string;
    about: string;
    industries: string[];
    stage: string;
  };
}

export default function ProfilePage() {
  const { data: session } = useSession();
  const [profile, setProfile] = useState<StartupProfile | null>(null);
  const [startupCount, setStartupCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
    fetchStartupCount();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/startup/profile');
      const data = await res.json();
      if (data.profile) {
        setProfile(data.profile);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const fetchStartupCount = async () => {
    try {
      const res = await fetch('/api/startup/projects');
      const data = await res.json();
      setStartupCount(data.startups?.length || 0);
    } catch (error) {
      console.error('Error fetching startup count:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container py-6 space-y-6">
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500/10 via-cyan-500/5 to-transparent p-8"
      >
        <div className="flex flex-col md:flex-row items-start gap-6">
          <Avatar className="h-24 w-24 border-4 border-background/50">
            <AvatarImage src={session?.user?.image || ''} />
            <AvatarFallback className="bg-primary/10">
              {session?.user?.name?.[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{session?.user?.name}</h1>
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 transition-colors">
                Startup Founder
              </Badge>
              <Badge variant="outline" className="gap-1 bg-background/50">
                <Rocket className="h-3 w-3" />
                {startupCount} Startups
              </Badge>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Personal Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="h-full rounded-2xl bg-gradient-to-br from-background to-background/80 p-6">
            <div className="flex items-center gap-2 mb-6">
              <User className="h-5 w-5 text-blue-500" />
              <h2 className="font-semibold">Personal Information</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>{session?.user?.email}</span>
              </div>
              {profile && (
                <>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <span>{profile.owner.phone}</span>
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>
                      {profile.owner.businessAddress.city}, {profile.owner.businessAddress.state}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        </motion.div>

        {/* Startup Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="h-full rounded-2xl bg-gradient-to-br from-background to-background/80 p-6">
            <div className="flex items-center gap-2 mb-6">
              <Building2 className="h-5 w-5 text-blue-500" />
              <h2 className="font-semibold">Startup Statistics</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-gradient-to-br from-blue-500/10 via-cyan-500/5 to-transparent">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Rocket className="h-4 w-4" />
                  Total Startups
                </div>
                <p className="text-2xl font-bold">{startupCount}</p>
              </div>
              <div className="p-4 rounded-xl bg-gradient-to-br from-green-500/10 via-emerald-500/5 to-transparent">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Target className="h-4 w-4" />
                  Active Projects
                </div>
                <p className="text-2xl font-bold">{startupCount}</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid gap-4 md:grid-cols-3"
      >
        <Link href="/startup/profile/edit" className="group">
          <div className="h-full rounded-xl bg-gradient-to-br from-background to-background/80 p-6 hover:bg-blue-50/50 transition-colors">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-lg bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors">
                <Edit className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="font-medium">Edit Profile</p>
                <p className="text-sm text-muted-foreground">Update your information</p>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        </Link>

        <Link href="/forms/startup" className="group">
          <div className="h-full rounded-xl bg-gradient-to-br from-background to-background/80 p-6 hover:bg-blue-50/50 transition-colors">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-lg bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors">
                <Rocket className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="font-medium">New Startup</p>
                <p className="text-sm text-muted-foreground">Register a startup</p>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        </Link>

        <Link href="/startup/projects" className="group">
          <div className="h-full rounded-xl bg-gradient-to-br from-background to-background/80 p-6 hover:bg-blue-50/50 transition-colors">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-lg bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors">
                <Globe className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="font-medium">View Portfolio</p>
                <p className="text-sm text-muted-foreground">See all your startups</p>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        </Link>
      </motion.div>
    </div>
  );
}
