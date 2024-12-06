"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";
import {
  Search,
  MessageSquare,
  Send,
  Paperclip,
  Smile,
  User,
  Users as UsersIcon,
  Beaker as BeakerIcon,
  Building2 as Building2Icon,
  Rocket,
  ChevronLeft,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface User {
  _id: string;
  name: string;
  email: string;
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

export default function StartupMessagesPage() {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [lastMessageTimestamp, setLastMessageTimestamp] = useState<string>("");
  const [eventSource, setEventSource] = useState<EventSource | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    fetchUsers();
    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, []);

  useEffect(() => {
    if (!selectedUser) return;

    fetchMessages();
    setupMessageStream();

    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, [selectedUser]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const generateChatId = (userId1: string, userId2: string) => {
    return [userId1, userId2].sort().join('_');
  };

  const setupMessageStream = () => {
    if (!selectedUser || !session?.user) return;

    const chatId = generateChatId(session.user.id, selectedUser._id);
    const sse = new EventSource(`/api/messages/stream?chatId=${chatId}`);

    sse.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.success && data.message) {
        handleNewMessage(data.message);
      }
    };

    sse.onerror = (error) => {
      console.error('SSE error:', error);
      sse.close();
    };

    setEventSource(sse);
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users/available');
      const data = await res.json();
      if (data.success) {
        setAvailableUsers(data.users);
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

  const handleNewMessage = (message: Message) => {
    setMessages(prev => [...prev, message]);
    scrollToBottom();
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser || !session?.user) return;

    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: newMessage,
          receiverId: selectedUser._id,
        }),
      });

      if (!response.ok) throw new Error('Failed to send message');

      const data = await response.json();
      if (data.success) {
        handleNewMessage(data.message);
        setNewMessage('');
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

  const getFilteredUsers = () => {
    let filtered = availableUsers.filter(user => 
      user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (selectedRole !== 'all') {
      filtered = filtered.filter(user => user.role.toLowerCase() === selectedRole);
    }

    return filtered;
  };

  const getRoleIcon = (role: string) => {
    switch (role.toLowerCase()) {
      case 'mentor':
        return {
          icon: UsersIcon,
          color: 'text-purple-500',
          bgColor: 'bg-purple-50',
          label: 'Mentor'
        };
      case 'researcher':
        return {
          icon: BeakerIcon,
          color: 'text-green-500',
          bgColor: 'bg-green-50',
          label: 'Researcher'
        };
      case 'fundingagency':
        return {
          icon: Building2Icon,
          color: 'text-orange-500',
          bgColor: 'bg-orange-50',
          label: 'Funding Agency'
        };
      case 'startup':
        return {
          icon: Rocket,
          color: 'text-blue-500',
          bgColor: 'bg-blue-50',
          label: 'Startup'
        };
      default:
        return {
          icon: User,
          color: 'text-gray-500',
          bgColor: 'bg-gray-50',
          label: role
        };
    }
  };

  const handleUserSelect = (user: User) => {
    setSelectedUser(user);
    setShowChat(true);
  };

  return (
    <div className="container py-6">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500/10 via-cyan-500/5 to-transparent p-6 md:p-8 mb-6">
        <div className="relative space-y-2">
          {showChat && selectedUser ? (
            <div className="flex items-center gap-2 md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowChat(false)}
                className="p-0 hover:bg-transparent"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-xl font-bold">{selectedUser.name}</h1>
            </div>
          ) : (
            <>
              <h1 className="text-2xl md:text-3xl font-bold">Messages</h1>
              <p className="text-sm md:text-base text-muted-foreground">
                Chat with mentors and connect with your network
              </p>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6 h-[calc(100vh-280px)]">
        <div className={cn(
          "col-span-12 md:col-span-4 transition-all duration-300",
          showChat ? "hidden md:block" : "block"
        )}>
          <div className="bg-background rounded-lg">
            <div className="p-4 border-b border-muted">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search conversations..."
                  className="pl-9 bg-transparent border-muted"
                />
              </div>
            </div>
            <ScrollArea className="h-[calc(100vh-400px)]">
              <div className="space-y-1 p-2">
                {getFilteredUsers().map((user) => (
                  <motion.div
                    key={user._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <button
                      onClick={() => handleUserSelect(user)}
                      className={cn(
                        "w-full p-3 rounded-lg transition-colors",
                        "hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/10",
                        selectedUser?._id === user._id && "bg-muted"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={user.image} />
                          <AvatarFallback>
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 text-left">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{user.name}</span>
                            <Badge 
                              variant="secondary" 
                              className={cn(
                                "text-xs",
                                getRoleIcon(user.role).color
                              )}
                            >
                              {getRoleIcon(user.role).label}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground truncate">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </button>
                  </motion.div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>

        <div className={cn(
          "col-span-12 md:col-span-8 transition-all duration-300",
          !showChat ? "hidden md:block" : "block"
        )}>
          <div className="bg-background rounded-lg h-full flex flex-col">
            {selectedUser ? (
              <>
                <div className="p-4 border-b border-muted hidden md:block">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={selectedUser.image} />
                      <AvatarFallback>
                        {selectedUser.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{selectedUser.name}</h3>
                        <Badge 
                          variant="secondary" 
                          className={cn(
                            "text-xs",
                            getRoleIcon(selectedUser.role).color
                          )}
                        >
                          {getRoleIcon(selectedUser.role).label}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {selectedUser.email}
                      </p>
                    </div>
                  </div>
                </div>

                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <motion.div
                        key={message._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={cn(
                          "flex",
                          message.sender._id === selectedUser._id ? "justify-start" : "justify-end"
                        )}
                      >
                        <div
                          className={cn(
                            "max-w-[70%] rounded-2xl px-4 py-2",
                            message.sender._id === selectedUser._id
                              ? "bg-muted"
                              : "bg-blue-600 text-white"
                          )}
                        >
                          <p>{message.content}</p>
                          <span className="text-[10px] opacity-70 mt-1 block">
                            {new Date(message.createdAt).toLocaleTimeString()}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>

                <div className="p-4 border-t border-muted">
                  <form onSubmit={handleSendMessage}>
                    <div className="flex items-center gap-2">
                      <Input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 bg-muted border-0"
                      />
                      <Button 
                        type="submit" 
                        size="icon"
                        className="bg-blue-600 hover:bg-blue-700 rounded-full"
                      >
                        <Send className="h-4 w-4 text-white" />
                      </Button>
                    </div>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-medium mb-2">No Chat Selected</h3>
                  <p className="text-sm text-muted-foreground">
                    Select a user to start chatting
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
