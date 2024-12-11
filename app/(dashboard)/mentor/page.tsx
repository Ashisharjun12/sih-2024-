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
  LinkIcon,
} from "lucide-react";
import {
  ScrollArea,
  ScrollBar
} from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";

interface MenteeData {
  _id: string;
  name: string;
  avatar?: string;
  startupName: string;
  industry: string;
  lastMeeting?: string;
  nextMeeting?: string;
}

interface Meeting {
  _id: string;
  userId: {
    name: string;
    email: string;
    image?: string;
  };
  userType: 'startup' | 'researcher';
  date: string;
  startTime: string;
  endTime: string;
  status: 'pending' | 'approved' | 'rejected';
  meetLink?: string;
}

export default function MentorDashboard() {
  const { data: session } = useSession();
  const router = useRouter();
  const [mentees, setMentees] = useState<MenteeData[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalEarnings, setTotalEarnings] = useState(0);

  const calculateEarnings = (meetings: Meeting[]) => {
    return meetings
      .filter(meeting => meeting.status === 'approved')
      .reduce((total, meeting) => {
        const start = new Date(`2000/01/01 ${meeting.startTime}`);
        const end = new Date(`2000/01/01 ${meeting.endTime}`);
        const durationHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
        
        const hourlyRate = 1000;
        const meetingCost = durationHours * hourlyRate;
        return total + meetingCost;
      }, 0);
  };

  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/mentor/meetings');
        const data = await res.json();
        if (data.success) {
          setMeetings(data.meetings);
          const earnings = calculateEarnings(data.meetings);
          setTotalEarnings(earnings);
        }
      } catch (error) {
        console.error('Error fetching meetings:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeData();
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
      {/* Welcome Section - Remove Schedule Button */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-transparent p-6 md:p-8">
        <div className="relative">
          <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-bold">
              Welcome back, {session?.user?.name}! ✨
            </h1>
            <p className="text-sm md:text-base text-muted-foreground">
              Track your mentoring activities and manage your mentees.
            </p>
          </div>
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
        <div className="bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-transparent rounded-xl p-4 md:p-6">
          <Clock className="h-6 w-6 text-blue-500 mb-2" />
          <p className="text-2xl font-bold">48</p>
          <p className="text-sm text-blue-600/70">Hours Mentored</p>
        </div>
        <div className="bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-transparent rounded-xl p-4 md:p-6">
          <Wallet className="h-6 w-6 text-blue-500 mb-2" />
          <p className="text-2xl font-bold">₹{totalEarnings.toLocaleString('en-IN')}</p>
          <p className="text-sm text-blue-600/70">Earnings</p>
        </div>
        <div className="bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-transparent rounded-xl p-4 md:p-6">
          <Star className="h-6 w-6 text-blue-500 mb-2" />
          <p className="text-2xl font-bold">4.8</p>
          <p className="text-sm text-blue-600/70">Rating</p>
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
            {meetings
              .filter((meeting: Meeting) => meeting.status === 'approved')
              .map((meeting: Meeting) => (
                <Card key={meeting._id} className="flex-none w-[300px] hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-10 w-10 rounded-full bg-blue-500/10 overflow-hidden">
                        {meeting.userId?.image ? (
                          <img 
                            src={meeting.userId.image} 
                            alt={meeting.userId.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <Users className="h-5 w-5 text-blue-500 m-auto mt-2.5" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium">{meeting.userId.name}</h3>
                        <p className="text-sm text-muted-foreground">{meeting.userType}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{format(new Date(meeting.date), 'PPP')}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{meeting.startTime} - {meeting.endTime}</span>
                      </div>
                      {meeting.meetLink && (
                        <div className="mt-3 pt-3 border-t">
                          <a
                            href={meeting.meetLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 transition-colors"
                          >
                            <LinkIcon className="h-4 w-4" />
                            Join Meeting
                          </a>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            {meetings.filter((m: Meeting) => m.status === 'approved').length === 0 && (
              <div className="flex-none w-full text-center py-8 text-muted-foreground">
                No approved meetings scheduled
              </div>
            )}
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
    </div>
  );
}
