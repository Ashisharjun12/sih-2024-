"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, X, Send, Bot, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const INITIAL_MESSAGE = {
  role: "assistant" as const,
  content: `👋 નમસ્તે! I'm your Gujarat Innovation Assistant.

I can help you with:
• Starting up in Gujarat
• Research & Innovation opportunities 
• Government policies & support
• Funding & Investment
• Connecting with mentors
• And much more!

What would you like to know about?`
};

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([INITIAL_MESSAGE]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: userMessage,
          history: messages // Send chat history for context
        }),
      });

      const data = await response.json();
      setMessages(prev => [...prev, { role: "assistant", content: data.response }]);
    } catch (error) {
      console.error("Error:", error);
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: "Sorry, I encountered an error. Please try again." 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg 
          bg-gradient-to-r from-orange-600 to-orange-500 
          hover:from-orange-500 hover:to-orange-600 
          transition-all duration-300"
      >
        <MessageSquare className="h-6 w-6" />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed bottom-24 right-6 w-[90vw] sm:w-[400px] h-[600px] 
              bg-background border rounded-xl shadow-xl overflow-hidden z-50"
          >
            {/* Header */}
            <div className="p-4 border-b flex items-center justify-between 
              bg-gradient-to-r from-orange-600 to-orange-500 text-white">
              <div className="flex items-center gap-2">
                <Bot className="h-5 w-5" />
                <h3 className="font-semibold">Gujarat Innovation Assistant</h3>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="hover:bg-white/10 text-white"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Messages */}
            <ScrollArea 
              className="h-[calc(100%-8rem)] p-4 bg-gradient-to-br from-orange-50/50 via-background to-orange-50/50" 
              ref={scrollRef}
            >
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={cn(
                      "flex gap-3 text-sm",
                      message.role === "assistant" ? "flex-row" : "flex-row-reverse"
                    )}
                  >
                    <div
                      className={cn(
                        "h-8 w-8 rounded-full flex items-center justify-center shrink-0",
                        message.role === "assistant" 
                          ? "bg-gradient-to-r from-orange-600 to-orange-500 text-white" 
                          : "bg-orange-100"
                      )}
                    >
                      {message.role === "assistant" ? (
                        <Bot className="h-4 w-4" />
                      ) : (
                        <User className="h-4 w-4 text-orange-600" />
                      )}
                    </div>
                    <div
                      className={cn(
                        "rounded-2xl px-4 py-2 max-w-[80%] shadow-sm",
                        message.role === "assistant" 
                          ? "bg-white border border-orange-100" 
                          : "bg-gradient-to-r from-orange-600 to-orange-500 text-white"
                      )}
                    >
                      {message.content}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex gap-3">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-r from-orange-600 to-orange-500 
                      text-white flex items-center justify-center">
                      <Bot className="h-4 w-4" />
                    </div>
                    <div className="bg-white border border-orange-100 rounded-2xl px-4 py-2 shadow-sm">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-orange-500/30 rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-orange-500/30 rounded-full animate-bounce delay-150" />
                        <div className="w-2 h-2 bg-orange-500/30 rounded-full animate-bounce delay-300" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Input */}
            <form onSubmit={handleSubmit} className="p-4 border-t bg-white">
              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 border-orange-100 focus-visible:ring-orange-500"
                />
                <Button 
                  type="submit" 
                  size="icon"
                  disabled={isLoading}
                  className="bg-gradient-to-r from-orange-600 to-orange-500 
                    hover:from-orange-500 hover:to-orange-600 text-white rounded-full"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
} 