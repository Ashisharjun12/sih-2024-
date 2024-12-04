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
import { Send, Search, Briefcase, Users, Beaker, MessageCircle, UserCircle2, X } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface User {
  _id: string;
  name: string;
  image?: string;
  role: string;
  email?: string;
}

interface Message {
  _id: string;
  content: string;
  sender: User;
  receiver: User;
  createdAt: string;
}

export default function FundingAgencyMessagesPage() {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [eventSource, setEventSource] = useState<EventSource | null>(null);
  const [isMobileUsersOpen, setIsMobileUsersOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [lastMessageTimestamp, setLastMessageTimestamp] = useState<string | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const generateChatId = useCallback((userId1: string, userId2: string) => {
    return [userId1, userId2].sort().join('_');
  }, []);

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

  const setupMessageStream = () => {
    if (!selectedUser || !session?.user) return;

    const chatId = generateChatId(session.user.id, selectedUser._id);
    const sse = new EventSource(`/api/messages/stream?chatId=${chatId}`);

    sse.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.success && data.message) {
        setMessages(prev => [...prev, data.message]);
        scrollToBottom();
      }
    };

    sse.onerror = (error) => {
      console.error('SSE error:', error);
      sse.close();
    };

    setEventSource(sse);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (!selectedUser) return;

    fetchMessages();

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/messages?receiverId=${selectedUser._id}&after=${lastMessageTimestamp}`);
        const data = await res.json();
        
        if (data.success && data.messages.length > 0) {
          setMessages(prevMessages => [...prevMessages, ...data.messages]);
          const latestMessage = data.messages[data.messages.length - 1];
          setLastMessageTimestamp(latestMessage.createdAt);
        }
      } catch (error) {
        console.error('Error polling messages:', error);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [selectedUser, lastMessageTimestamp]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
        setMessages(prev => [...prev, data.message]);
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
      case 'startup':
        return <Briefcase className="h-4 w-4 text-blue-500" />;
      case 'researcher':
        return <Beaker className="h-4 w-4 text-green-500" />;
      case 'mentor':
        return <Users className="h-4 w-4 text-purple-500" />;
      default:
        return null;
    }
  };

  const getFilteredUsers = (tab: string) => {
    return users.filter(user => {
      const searchTermLower = searchTerm.toLowerCase();
      const matchesSearch = 
        user.name.toLowerCase().includes(searchTermLower) ||
        user.role.toLowerCase().includes(searchTermLower) ||
        user.email?.toLowerCase().includes(searchTermLower);

      const matchesRole = tab === 'all' || user.role === tab;

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
        {/* Mobile Header - same as mentor */}
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
            
            {/* Enhanced Search */}
            <div className="space-y-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, role..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-muted"
                />
                {searchTerm && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0"
                    onClick={() => setSearchTerm('')}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              {searchTerm && (
                <p className="text-sm text-muted-foreground">
                  Found {getFilteredUsers(activeTab).length} results
                </p>
              )}
            </div>

            {/* Stats Grid */}
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
                <p className="text-muted-foreground">Filtered</p>
                <p className="font-medium text-primary">
                  {getFilteredUsers(activeTab).length}
                </p>
              </div>
            </div>
          </Card>

          {/* User Categories with Search Results */}
          <Card className="p-4">
            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-4 mb-4">
                <TabsTrigger value="all" className="text-xs">
                  All
                  <span className="ml-1 text-xs text-muted-foreground">
                    ({getFilteredUsers('all').length})
                  </span>
                </TabsTrigger>
                <TabsTrigger value="startup" className="text-xs">
                  Startups
                  <span className="ml-1 text-xs text-muted-foreground">
                    ({getFilteredUsers('startup').length})
                  </span>
                </TabsTrigger>
                <TabsTrigger value="researcher" className="text-xs">
                  Research
                  <span className="ml-1 text-xs text-muted-foreground">
                    ({getFilteredUsers('researcher').length})
                  </span>
                </TabsTrigger>
                <TabsTrigger value="mentor" className="text-xs">
                  Mentors
                  <span className="ml-1 text-xs text-muted-foreground">
                    ({getFilteredUsers('mentor').length})
                  </span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="mt-0">
                <ScrollArea className="h-[calc(100vh-20rem)] lg:h-[50vh]">
                  {getFilteredUsers(activeTab).length > 0 ? (
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
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <Search className="h-8 w-8 text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">No users found</p>
                      <p className="text-sm text-muted-foreground">
                        Try adjusting your search or filters
                      </p>
                    </div>
                  )}
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </Card>
        </div>

        {/* Chat Area - same as mentor */}
        <div className={`
          lg:col-span-8
          ${!selectedUser || isMobileUsersOpen ? 'hidden lg:block' : 'block'}
        `}>
          <Card className="h-[calc(100vh-8rem)] flex flex-col shadow-lg">
            {selectedUser ? (
              <>
                {/* Chat Header - same as mentor */}
                <div className="p-4 border-b bg-card">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={selectedUser.image} />
                      <AvatarFallback>{selectedUser.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{selectedUser.name}</p>
                        {getRoleIcon(selectedUser.role)}
                      </div>
                      <p className="text-sm text-muted-foreground capitalize">{selectedUser.role}</p>
                    </div>
                  </div>
                </div>

                {/* Messages - same as mentor */}
                <ScrollArea className="flex-1 px-2 lg:px-4 py-6">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message._id}
                        className={`flex ${message.sender._id === session?.user?.id ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[70%] rounded-lg p-3 ${
                            message.sender._id === session?.user?.id
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted'
                          }`}
                        >
                          <p>{message.content}</p>
                          <p className="text-xs mt-1 opacity-70">
                            {format(new Date(message.createdAt), 'HH:mm')}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>

                {/* Message Input - same as mentor */}
                <div className="p-2 lg:p-4 border-t bg-card">
                  <div className="flex gap-2">
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                    />
                    <Button type="submit" size="icon">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
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
                    Connect with startups, researchers, and mentors. Select a user to start chatting.
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

