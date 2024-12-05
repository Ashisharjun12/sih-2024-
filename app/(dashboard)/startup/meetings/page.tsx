"use client";

import { useState, useEffect } from 'react';
import { format, addHours, parseISO } from "date-fns";
import { Calendar as CalendarIcon, Clock, Users, Wallet2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface Mentor {
  _id: string;
  name: string;
  expertise: string[];
  hourlyRate: number;
}

interface Meeting {
  _id: string;
  mentorId: string;
  mentor: {
    name: string;
  };
  date: Date;
  startTime: string;
  endTime: string;
  status: 'pending' | 'approved' | 'rejected';
  meetLink?: string;
}

const TIME_SLOTS = [
  "09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00"
];

export default function MeetingsPage() {
  const { toast } = useToast();
  const [date, setDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [walletBalance, setWalletBalance] = useState(5000);

  useEffect(() => {
    fetchMentors();
    fetchMeetings();
  }, []);

  const fetchMentors = async () => {
    try {
      const res = await fetch('/api/mentor/mentors');
      const data = await res.json();
      if (data.success) {
        setMentors(data.mentors);
      }
    } catch (error) {
      console.error('Error fetching mentors:', error);
      toast({
        title: "Error",
        description: "Failed to fetch mentors",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchMeetings = async () => {
    try {
      const res = await fetch('/api/meetings');
      const data = await res.json();
      if (data.success) {
        setMeetings(data.meetings);
        if (data.walletBalance !== undefined) {
          setWalletBalance(data.walletBalance);
        }
      }
    } catch (error) {
      console.error('Error fetching meetings:', error);
      toast({
        title: "Error",
        description: "Failed to fetch meetings",
        variant: "destructive",
      });
    }
  };

  const handleMeetingRequest = async () => {
    if (!date || !selectedTime || !selectedMentor) {
      toast({
        title: "Error",
        description: "Please select all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const endTime = format(
        addHours(parseISO(`2000-01-01T${selectedTime}`), 1),
        'HH:mm'
      );

      const response = await fetch('/api/meetings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mentorId: selectedMentor._id,
          date: date,
          startTime: selectedTime,
          endTime: endTime
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create meeting');
      }

      toast({
        title: "Success",
        description: "Meeting requested successfully",
      });
      
      if (data.walletBalance !== undefined) {
        setWalletBalance(data.walletBalance);
      }
      fetchMeetings();
      
      // Reset form
      setDate(undefined);
      setSelectedTime("");
      setSelectedMentor(null);
    } catch (error) {
      console.error('Error requesting meeting:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to request meeting",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container py-4 px-2 md:px-6 space-y-6 md:space-y-8">
      {/* Header Section with Wallet */}
      <div className="relative overflow-hidden rounded-xl md:rounded-2xl bg-gradient-to-br from-blue-500/10 via-cyan-500/5 to-transparent p-4 md:p-8">
        <div className="relative flex flex-col md:flex-row md:justify-between md:items-start gap-4 md:gap-0">
          <div>
            <h1 className="text-xl md:text-3xl font-bold">Your Meetings</h1>
            <p className="text-sm md:text-base text-muted-foreground mt-1 md:mt-2">
              Schedule and manage your mentor meetings
            </p>
          </div>
          <div className="flex items-center gap-3 bg-background/60 backdrop-blur-sm rounded-lg p-3 md:p-4 self-start">
            <Wallet2 className="h-4 w-4 md:h-5 md:w-5 text-blue-500" />
            <div>
              <p className="text-xs md:text-sm text-muted-foreground">Balance</p>
              <p className="text-sm md:text-base font-bold">₹{walletBalance}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid - Make it scroll horizontally on mobile */}
      <div className="flex md:grid md:grid-cols-3 gap-3 md:gap-4 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0">
        {/* Stats cards with adjusted padding */}
        <div className="min-w-[160px] md:min-w-0 bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-transparent rounded-xl p-3 md:p-6">
          <Users className="h-5 w-5 md:h-6 md:w-6 text-blue-500 mb-2" />
          <p className="text-xl md:text-2xl font-bold">{meetings.length}</p>
          <p className="text-xs md:text-sm text-blue-600/70">Total Meetings</p>
        </div>
        <div className="min-w-[160px] md:min-w-0 bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent rounded-xl p-3 md:p-6">
          <Clock className="h-5 w-5 md:h-6 md:w-6 text-emerald-500 mb-2" />
          <p className="text-xl md:text-2xl font-bold">
            {meetings.filter(m => m.status === 'approved').length}
          </p>
          <p className="text-xs md:text-sm text-emerald-600/70">Approved</p>
        </div>
        <div className="min-w-[160px] md:min-w-0 bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent rounded-xl p-3 md:p-6">
          <CalendarIcon className="h-5 w-5 md:h-6 md:w-6 text-amber-500 mb-2" />
          <p className="text-xl md:text-2xl font-bold">
            {meetings.filter(m => m.status === 'pending').length}
          </p>
          <p className="text-xs md:text-sm text-amber-600/70">Pending</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-2 gap-4 md:gap-6">
        {/* Scheduling Section */}
        <div className="bg-gradient-to-br from-background to-background/80 border rounded-xl p-4 md:p-6">
          <h2 className="text-base md:text-lg font-semibold mb-4 md:mb-6 flex items-center gap-2">
            <CalendarIcon className="h-4 w-4 md:h-5 md:w-5 text-blue-500" />
            Schedule Meeting
          </h2>
          
          {/* Date & Time Selection with better mobile spacing */}
          <div className="space-y-3 md:space-y-4">
            {/* Date Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Time Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Time</label>
              <Select onValueChange={setSelectedTime}>
                <SelectTrigger>
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  {TIME_SLOTS.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Mentor Selection with adjusted spacing */}
            <div className="space-y-2 md:space-y-3">
              <label className="text-sm font-medium">Select Mentor</label>
              <div className="grid gap-2 md:gap-3">
                {mentors.map((mentor) => (
                  <div
                    key={mentor._id}
                    onClick={() => setSelectedMentor(mentor)}
                    className={cn(
                      "p-3 md:p-4 rounded-xl transition-colors cursor-pointer border",
                      selectedMentor?._id === mentor._id
                        ? "bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-transparent"
                        : "bg-gradient-to-br from-background to-background/80 hover:bg-blue-50/50 dark:hover:bg-blue-950/10"
                    )}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-sm md:text-base font-medium">{mentor.name}</h3>
                        <div className="flex flex-wrap gap-1 md:gap-2 mt-1 md:mt-2">
                          {mentor.expertise?.map((exp) => (
                            <Badge 
                              key={exp} 
                              variant="secondary"
                              className="text-xs md:text-sm bg-blue-500/10 text-blue-600 hover:bg-blue-500/20"
                            >
                              {exp}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs md:text-sm">
                        ₹{mentor.hourlyRate}/hr
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Button
              className="w-full mt-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 
                hover:to-blue-600 text-white transition-all duration-300 text-sm md:text-base"
              onClick={handleMeetingRequest}
              disabled={!date || !selectedTime || !selectedMentor}
            >
              Book Meeting
            </Button>
          </div>
        </div>

        {/* Meetings List */}
        <div className="bg-gradient-to-br from-background to-background/80 border rounded-xl p-4 md:p-6">
          <h2 className="text-base md:text-lg font-semibold mb-4 md:mb-6 flex items-center gap-2">
            <Users className="h-4 w-4 md:h-5 md:w-5 text-blue-500" />
            Your Meetings
          </h2>
          
          <div className="space-y-3 md:space-y-4">
            {meetings.map((meeting) => (
              <div
                key={meeting._id}
                className="bg-gradient-to-br from-background to-background/80 border rounded-xl p-3 md:p-4 
                  hover:bg-blue-50/50 dark:hover:bg-blue-950/10 transition-colors"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-medium">{meeting.mentor?.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(meeting.date), 'PPP')} at {meeting.startTime}
                    </p>
                  </div>
                  <Badge variant="secondary" className={cn(
                    meeting.status === 'approved' && "bg-emerald-500/10 text-emerald-600",
                    meeting.status === 'rejected' && "bg-red-500/10 text-red-600",
                    meeting.status === 'pending' && "bg-amber-500/10 text-amber-600"
                  )}>
                    {meeting.status}
                  </Badge>
                </div>
                
                {meeting.meetLink && (
                  <div className="pt-3 border-t">
                    <Button
                      variant="link"
                      className="p-0 h-auto text-blue-500 hover:text-blue-600"
                      asChild
                    >
                      <a
                        href={meeting.meetLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Join Meeting
                      </a>
                    </Button>
                  </div>
                )}
              </div>
            ))}
            
            {meetings.length === 0 && (
              <p className="text-center text-muted-foreground py-4">
                No meetings scheduled yet
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
