"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { useSession } from "next-auth/react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { 
  Send, Search, Briefcase, Users, Building2, MessageCircle, 
  UserCircle2, Bell, MoreVertical, Smile, PaperclipIcon, 
  Image as ImageIcon, ArrowLeft 
} from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";


interface User {
  _id: string;
  name: string;
  image?: string;
  role: string;
}

interface Message {
  _id: string;
  content: string;
  sender: User;
  receiver: User;
  createdAt: string;
}

export default function ResearcherMessagesPage() {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [eventSource, setEventSource] = useState<EventSource | null>(null);
  const [isMobileUsersOpen, setIsMobileUsersOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [lastMessageTimestamp, setLastMessageTimestamp] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (selectedUser) {
      fetchMessages();
    }
  }, [selectedUser]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!selectedUser) return;

    // Initial fetch
    fetchMessages();

    // Set up polling interval
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/messages?receiverId=${selectedUser._id}&after=${lastMessageTimestamp}`);
        const data = await res.json();
        
        if (data.success && data.messages.length > 0) {
          setMessages(prevMessages => [...prevMessages, ...data.messages]);
          // Update last message timestamp
          const latestMessage = data.messages[data.messages.length - 1];
          setLastMessageTimestamp(latestMessage.createdAt);
        }
      } catch (error) {
        console.error('Error polling messages:', error);
      }
    }, 500); // Poll every 3 seconds

    return () => clearInterval(interval);
  }, [selectedUser, lastMessageTimestamp]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users/available');
      const data = await res.json();
      if (data.success) {
        setUsers(data.users);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    if (!selectedUser) return;

    try {
      const res = await fetch(`/api/messages?receiverId=${selectedUser._id}`);
      const data = await res.json();
      if (data.success) {
        setMessages(data.messages);
        // Set initial last message timestamp
        if (data.messages.length > 0) {
          setLastMessageTimestamp(data.messages[data.messages.length - 1].createdAt);
        }
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast({
        title: "Error",
        description: "Failed to fetch messages",
        variant: "destructive",
      });
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser || !newMessage.trim()) return;

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          receiverId: selectedUser._id,
          content: newMessage
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setNewMessage('');
        // Add new message to the list immediately
        setMessages(prev => [...prev, data.message]);
        // Update last message timestamp
        setLastMessageTimestamp(data.message.createdAt);
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'mentor':
        return <Users className="h-4 w-4 text-purple-500" />;
      case 'startup':
        return <Briefcase className="h-4 w-4 text-blue-500" />;
      case 'fundingAgency':
        return <Building2 className="h-4 w-4 text-orange-500" />;
      default:
        return null;
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  // Function to generate chatId
  const generateChatId = useCallback((userId1: string, userId2: string) => {
    return [userId1, userId2].sort().join('_');
  }, []);

  // Setup SSE when user is selected
  useEffect(() => {
    if (!selectedUser || !session?.user) return;

    const chatId = generateChatId(session.user.id, selectedUser._id);
    const sse = new EventSource(`/api/messages/stream?chatId=${chatId}`);

    sse.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.success && data.message) {
        setMessages(prev => [...prev, data.message]);
      }
    };

    sse.onerror = (error) => {
      console.error('SSE error:', error);
      sse.close();
    };

    setEventSource(sse);

    return () => {
      sse.close();
      setEventSource(null);
    };
  }, [selectedUser, session?.user]);

  // Add getFilteredUsers function
  const getFilteredUsers = (role: string) => {
    return users.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = role === 'all' || user.role === role;
      return matchesSearch && matchesRole;
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container py-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Mobile Header */}
        <div className="lg:hidden col-span-full">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Messages
              </h2>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setIsMobileUsersOpen(!isMobileUsersOpen)}
              >
                {isMobileUsersOpen ? 'Close Users' : 'Show Users'}
              </Button>
            </div>
          </Card>
        </div>

        {/* Users List */}
        <div className={`
          lg:col-span-4 space-y-4
          ${selectedUser && !isMobileUsersOpen ? 'hidden lg:block' : 'block'}
        `}>
          {/* Search and User Stats */}
          <Card className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">Messages</h2>
             
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-muted"
              />
            </div>
            <div className="grid grid-cols-3 gap-2 text-center text-sm">
              <div className="bg-muted p-2 rounded-lg">
                <p className="text-muted-foreground">Total</p>
                <p className="font-medium">{users.length}</p>
              </div>
              <div className="bg-muted p-2 rounded-lg">
                <p className="text-muted-foreground">Online</p>
                <p className="font-medium text-green-500">
                  {users.length > 0 ? Math.floor(users.length * 0.6) : 0}
                </p>
              </div>
              <div className="bg-muted p-2 rounded-lg">
                <p className="text-muted-foreground">Unread</p>
                <p className="font-medium text-primary">0</p>
              </div>
            </div>
          </Card>

          {/* User Categories */}
          <Card className="p-4">
            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-4 mb-4">
                <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
                <TabsTrigger value="mentor" className="text-xs">Mentors</TabsTrigger>
                <TabsTrigger value="startup" className="text-xs">Startups</TabsTrigger>
                <TabsTrigger value="fundingAgency" className="text-xs">Funding</TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="mt-0">
                <ScrollArea className="h-[calc(100vh-20rem)] lg:h-[50vh]">
                  <div className="space-y-2">
                    {getFilteredUsers(activeTab).map((user) => (
                      <div
                        key={user._id}
                        className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all
                          ${selectedUser?._id === user._id 
                            ? 'bg-primary/10 shadow-sm' 
                            : 'hover:bg-muted'
                          }`}
                        onClick={() => setSelectedUser(user)}
                      >
                        <Avatar className="h-10 w-10 ring-2 ring-primary/10">
                          <AvatarImage src={user.image} />
                          <AvatarFallback className="bg-primary/5">
                            {user.name[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="font-medium truncate">{user.name}</p>
                            {getRoleIcon(user.role)}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-green-500"></span>
                            <p className="text-sm text-muted-foreground capitalize truncate">
                              {user.role}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </Card>
        </div>

        {/* Chat Area */}
        <div className={`
          lg:col-span-8
          ${!selectedUser || isMobileUsersOpen ? 'hidden lg:block' : 'block'}
        `}>
          <Card className="h-[calc(100vh-8rem)] flex flex-col shadow-lg">
            {selectedUser ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b bg-card">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {/* Mobile Back Button */}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="lg:hidden mr-2"
                        onClick={() => setIsMobileUsersOpen(true)}
                      >
                        <ArrowLeft className="h-5 w-5" />
                      </Button>
                      <Avatar className="h-10 w-10 lg:h-12 lg:w-12 ring-2 ring-primary/10">
                        <AvatarImage src={selectedUser.image} />
                        <AvatarFallback className="bg-primary/10">
                          {selectedUser.name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold">{selectedUser.name}</p>
                          {getRoleIcon(selectedUser.role)}
                        </div>
                        <p className="text-sm text-muted-foreground capitalize flex items-center gap-1">
                          <span className="h-2 w-2 rounded-full bg-green-500"></span>
                          Online • {selectedUser.role}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon">
                        <Bell className="h-5 w-5" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <ScrollArea className="flex-1 px-2 lg:px-4 py-6">
                  <div className="space-y-6 max-w-3xl mx-auto">
                    {messages.map((message, i) => {
                      const isFirstMessage = i === 0 || 
                        messages[i-1].sender._id !== message.sender._id;
                      const isSender = message.sender._id === session?.user?.id;

                      return (
                        <div
                          key={message._id}
                          className={`flex items-end gap-2 ${isSender ? 'justify-end' : 'justify-start'}`}
                        >
                          {!isSender && isFirstMessage && (
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={message.sender.image} />
                              <AvatarFallback>{message.sender.name[0]}</AvatarFallback>
                            </Avatar>
                          )}
                          <div
                            className={`max-w-[70%] space-y-1 ${
                              isSender ? 'items-end' : 'items-start'
                            }`}
                          >
                            {isFirstMessage && !isSender && (
                              <p className="text-sm text-muted-foreground px-2">
                                {message.sender.name}
                              </p>
                            )}
                            <div
                              className={`rounded-2xl px-4 py-2 ${
                                isSender
                                  ? 'bg-primary text-primary-foreground rounded-br-none'
                                  : 'bg-muted rounded-bl-none'
                              }`}
                            >
                              <p>{message.content}</p>
                            </div>
                            <p className="text-xs text-muted-foreground px-2">
                              {format(new Date(message.createdAt), 'HH:mm')}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>

                {/* Message Input */}
                <div className="p-2 lg:p-4 border-t bg-card">
                  <form onSubmit={sendMessage}>
                    <div className="flex items-center gap-2 max-w-3xl mx-auto">
                     
                      <Input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message..."
                        className="bg-muted"
                      />
                      <Button type="submit" size="icon" className="shrink-0">
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center p-4">
                <div className="text-center space-y-3 max-w-md mx-auto">
                  <div className="bg-primary/10 p-4 rounded-full w-fit mx-auto">
                    <MessageCircle className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">Welcome to Messages</h3>
                  <p className="text-sm text-muted-foreground">
                    Connect with mentors, startups, and funding agencies. Select a user to start chatting.
                  </p>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
