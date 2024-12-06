"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";
import {
  MessageSquare,
  Send,
  ChevronLeft,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useMessages } from "@/contexts/messages-context";

interface Message {
  _id: string;
  content: string;
  sender: {
    _id: string;
    name: string;
    image?: string;
  };
  receiver: {
    _id: string;
    name: string;
    image?: string;
  };
  createdAt: string;
}

interface User {
  _id: string;
  name: string;
  email: string;
  image?: string;
  role: string;
}

export default function ChatPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { data: session } = useSession();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [eventSource, setEventSource] = useState<EventSource | null>(null);
  const [lastMessageTimestamp, setLastMessageTimestamp] = useState<string>("");
  const { setShowChat } = useMessages();

  useEffect(() => {
    if (messages.length > 0) {
      console.log("Messages present, setting showChat to true");
      setShowChat(true);
    } else {
      console.log("No messages, setting showChat to false");
      setShowChat(false);
    }
  }, [messages.length, setShowChat]);

  useEffect(() => {
    fetchUserAndMessages();

    // Set up polling for new messages
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/messages/${params.id}?after=${lastMessageTimestamp}`);
        const data = await res.json();
        
        if (data.success && data.messages.length > 0) {
          setMessages(prevMessages => {
            // Filter out duplicates
            const newMessages = data.messages.filter((newMsg: Message) => 
              !prevMessages.some(existingMsg => existingMsg._id === newMsg._id)
            );
            const updatedMessages = [...prevMessages, ...newMessages];
            
            // Update showChat based on messages presence
            if (updatedMessages.length > 0) {
              setShowChat(true);
            }
            
            return updatedMessages;
          });
          
          const latestMessage = data.messages[data.messages.length - 1];
          setLastMessageTimestamp(latestMessage.createdAt);
          scrollToBottom();
        }
      } catch (error) {
        console.error('Error polling messages:', error);
      }
    }, 1000);

    return () => {
      clearInterval(interval);
      if (eventSource) {
        eventSource.close();
      }
      setShowChat(false);
    };
  }, [params.id, lastMessageTimestamp, setShowChat]);

  const fetchUserAndMessages = async () => {
    try {
      // Fetch user details
      const userRes = await fetch(`/api/users/${params.id}`);
      const userData = await userRes.json();
      if (userData.success) {
        setUser(userData.user);
      }

      // Fetch messages
      const messagesRes = await fetch(`/api/messages/${params.id}`);
      const messagesData = await messagesRes.json();
      if (messagesData.success) {
        setMessages(messagesData.messages);
        if (messagesData.messages.length > 0) {
          setLastMessageTimestamp(
            messagesData.messages[messagesData.messages.length - 1].createdAt
          );
        }
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to fetch chat data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const setupMessageStream = () => {
    if (!session?.user) return;

    const chatId = generateChatId(session.user.id, params.id);
    const sse = new EventSource(`/api/messages/stream?chatId=${chatId}`);

    sse.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.success && data.message) {
        setMessages(prev => {
          const messageExists = prev.some(m => m._id === data.message._id);
          if (messageExists) return prev;
          return [...prev, data.message];
        });
        scrollToBottom();
      }
    };

    sse.onerror = (error) => {
      console.error('SSE error:', error);
      sse.close();
    };

    setEventSource(sse);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !session?.user) return;

    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: newMessage,
          receiverId: params.id,
        }),
      });

      if (!response.ok) throw new Error('Failed to send message');

      const data = await response.json();
      if (data.success) {
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

  const generateChatId = (userId1: string, userId2: string) => {
    return [userId1, userId2].sort().join('_');
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      {user ? (
        <>
          <div className="p-4 bg-muted/30 border-b flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="md:hidden -ml-2"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Avatar>
              <AvatarImage src={user.image} />
              <AvatarFallback>
                {user.name.split(' ').map((n: string) => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium truncate">{user.name}</h3>
              <Badge variant="secondary" className="text-xs">
                {user.role}
              </Badge>
            </div>
          </div>

          <ScrollArea className="flex-1 p-4 bg-muted/10">
            {/* Messages */}
            <div className="space-y-4 max-w-3xl mx-auto">
              {messages.map((message) => (
                <motion.div
                  key={message._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "flex",
                    message.sender._id === params.id ? "justify-start" : "justify-end"
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[75%] px-4 py-2 rounded-2xl",
                      message.sender._id === params.id
                        ? "bg-muted rounded-tl-none" 
                        : "bg-blue-600 text-white rounded-tr-none"
                    )}
                  >
                    <p className="whitespace-pre-wrap break-words">{message.content}</p>
                    <span className="text-[10px] opacity-70 mt-1 block text-right">
                      {new Date(message.createdAt).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </span>
                  </div>
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          <div className="p-4 bg-background border-t max-md:mb-[49px]">
            <form onSubmit={handleSendMessage} className="flex items-center gap-2 max-w-3xl mx-auto">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1"
                autoComplete="off"
              />
              <Button 
                type="submit" 
                size="icon"
                className="bg-blue-600 hover:bg-blue-700 rounded-full shrink-0"
              >
                <Send className="h-4 w-4 text-white" />
              </Button>
            </form>
          </div>
        </>
      ) : (
        <div className="flex-1 flex items-center justify-center bg-muted/10">
          <div className="text-center">
            <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-medium mb-2">No Chat Selected</h3>
            <p className="text-sm text-muted-foreground">
              Select a user to start chatting
            </p>
          </div>
        </div>
      )}
    </>
  );
}