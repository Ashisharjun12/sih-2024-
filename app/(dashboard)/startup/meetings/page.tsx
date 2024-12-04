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
    <div className="container mx-auto px-4 py-8">
      {/* Wallet Balance */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <Wallet2 className="h-8 w-8 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Wallet Balance</p>
              <h2 className="text-3xl font-bold">₹{walletBalance}</h2>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Scheduling Section */}
        <Card>
          <CardHeader>
            <CardTitle>Schedule Meeting</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
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

            {/* Mentor Selection */}
            <div className="space-y-4">
              <label className="text-sm font-medium">Select Mentor</label>
              <div className="grid gap-4">
                {mentors.map((mentor) => (
                  <div
                    key={mentor._id}
                    className={cn(
                      "p-4 border rounded-lg cursor-pointer transition-colors",
                      selectedMentor?._id === mentor._id
                        ? "border-primary bg-primary/5"
                        : "hover:border-primary/50"
                    )}
                    onClick={() => setSelectedMentor(mentor)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{mentor.name}</h3>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {mentor.expertise?.map((exp) => (
                            <Badge key={exp} variant="secondary">
                              {exp}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <span className="text-sm font-medium">₹{mentor.hourlyRate}/hr</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Button
              className="w-full"
              onClick={handleMeetingRequest}
              disabled={!date || !selectedTime || !selectedMentor}
            >
              Book Meeting 
            </Button>
          </CardContent>
        </Card>

        {/* Meetings List */}
        <Card>
          <CardHeader>
            <CardTitle>Your Meetings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {meetings.map((meeting) => (
                <div
                  key={meeting._id}
                  className="p-4 border rounded-lg"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{meeting.mentor?.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(meeting.date), 'PPP')} at {meeting.startTime}
                      </p>
                    </div>
                    <Badge variant={
                      meeting.status === 'approved' 
                        ? "default"
                        : meeting.status === 'rejected'
                        ? "destructive"
                        : "secondary"
                    }>
                      {meeting.status}
                    </Badge>
                  </div>
                  
                  {meeting.meetLink && (
                    <Button
                      variant="link"
                      className="mt-2 p-0 h-auto"
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
                  )}
                </div>
              ))}
              
              {meetings.length === 0 && (
                <p className="text-center text-muted-foreground py-4">
                  No meetings scheduled yet
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
