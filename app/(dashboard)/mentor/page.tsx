"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Users,
  Calendar,
  Target,
  ChevronRight,
  Star,
  MessageSquare,
  Clock,
  Wallet,
  TrendingUp,
} from "lucide-react";
import {
  ScrollArea,
  ScrollBar
} from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";

interface MenteeData {
  _id: string;
  name: string;
  avatar?: string;
  startupName: string;
  industry: string;
  lastMeeting?: string;
  nextMeeting?: string;
}

export default function MentorDashboard() {
  const { data: session } = useSession();
  const router = useRouter();
  const [mentees, setMentees] = useState<MenteeData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch mentees data
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container py-6 space-y-8">
      {/* Welcome Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500/10 via-cyan-500/5 to-transparent p-6 md:p-8">
        <div className="relative flex justify-between items-start">
          <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-bold">
              Welcome back, {session?.user?.name}! ✨
            </h1>
            <p className="text-sm md:text-base text-muted-foreground">
              Track your mentoring activities and manage your mentees.
            </p>
          </div>
          <Button
            onClick={() => router.push('/mentor/meetings/schedule')}
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:from-blue-700 hover:to-cyan-600 hidden md:flex"
          >
            <Calendar className="h-5 w-5 mr-2" />
            Schedule Session
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-transparent rounded-xl p-4 md:p-6"
        >
          <Users className="h-6 w-6 text-blue-500 mb-2" />
          <p className="text-2xl font-bold">12</p>
          <p className="text-sm text-blue-600/70">Active Mentees</p>
        </motion.div>
        <div className="bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent rounded-xl p-4 md:p-6">
          <Clock className="h-6 w-6 text-emerald-500 mb-2" />
          <p className="text-2xl font-bold">48</p>
          <p className="text-sm text-emerald-600/70">Hours Mentored</p>
        </div>
        <div className="bg-gradient-to-br from-violet-500/10 via-violet-500/5 to-transparent rounded-xl p-4 md:p-6">
          <Wallet className="h-6 w-6 text-violet-500 mb-2" />
          <p className="text-2xl font-bold">₹24K</p>
          <p className="text-sm text-violet-600/70">Earnings</p>
        </div>
        <div className="bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent rounded-xl p-4 md:p-6">
          <Star className="h-6 w-6 text-amber-500 mb-2" />
          <p className="text-2xl font-bold">4.8</p>
          <p className="text-sm text-amber-600/70">Rating</p>
        </div>
      </div>

      {/* Upcoming Sessions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-4"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Upcoming Sessions</h2>
          <Button
            variant="ghost"
            onClick={() => router.push('/mentor/meetings')}
            className="text-blue-500 hover:text-blue-600"
          >
            View All
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>

        <ScrollArea className="w-full">
          <div className="flex space-x-4 pb-4">
            {[1, 2, 3].map((_, i) => (
              <Card key={i} className="flex-none w-[300px] hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                      <Users className="h-5 w-5 text-blue-500" />
                    </div>
                    <div>
                      <h3 className="font-medium">Mentee Name {i + 1}</h3>
                      <p className="text-sm text-muted-foreground">Startup {i + 1}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>Tomorrow, 10:00 AM</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Target className="h-4 w-4 text-muted-foreground" />
                      <span>Growth Strategy Discussion</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </motion.div>

      {/* Recent Activities */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-4"
      >
        <h2 className="text-xl font-semibold">Recent Activities</h2>
        <div className="space-y-4">
          {[1, 2, 3].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                    {i === 0 ? (
                      <MessageSquare className="h-5 w-5 text-blue-500" />
                    ) : i === 1 ? (
                      <Calendar className="h-5 w-5 text-blue-500" />
                    ) : (
                      <Star className="h-5 w-5 text-blue-500" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium">
                      {i === 0
                        ? "New message from Mentee"
                        : i === 1
                        ? "Session completed"
                        : "Received feedback"}
                    </h3>
                    <p className="text-sm text-muted-foreground">2 hours ago</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.div>

      {/* Mobile FAB */}
      <motion.div 
        className="fixed bottom-24 right-6 z-50 md:hidden"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5 }}
      >
        <Button
          onClick={() => router.push('/mentor/meetings/schedule')}
          size="lg"
          className="h-14 w-14 rounded-full shadow-lg bg-gradient-to-r from-blue-600 to-cyan-500 
            hover:from-blue-700 hover:to-cyan-600 p-0"
        >
          <Calendar className="h-6 w-6 text-white" />
        </Button>
      </motion.div>
    </div>
  );
}
