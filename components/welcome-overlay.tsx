"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { X } from "lucide-react";

export function WelcomeOverlay() {
  const [isVisible, setIsVisible] = useState(true);
  const { data: session } = useSession();

  if (!isVisible || !session?.user) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-card w-[90%] max-w-[400px] p-6 rounded-lg shadow-lg relative">
        <button 
          onClick={() => setIsVisible(false)}
          className="absolute right-2 top-2 p-2 hover:bg-muted rounded-full"
        >
          <X className="h-4 w-4" />
        </button>
        
        <div className="space-y-4 text-center">
          <h2 className="text-2xl font-bold">Welcome! 👋</h2>
          <p className="text-lg">
            Hello, <span className="font-semibold">{session.user.name}</span>
          </p>
          <p className="text-muted-foreground capitalize">
            Role: {session.user.role || "User"}
          </p>
        </div>
      </div>
    </div>
  );
} 