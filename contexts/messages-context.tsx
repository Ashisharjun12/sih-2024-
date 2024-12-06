"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface MessagesContextType {
  showChat: boolean;
  setShowChat: (value: boolean) => void;
}

const MessagesContext = createContext<MessagesContextType | undefined>(undefined);

export function MessagesProvider({ children }: { children: ReactNode }) {
  const [showChat, setShowChat] = useState(false);

  return (
    <MessagesContext.Provider value={{ showChat, setShowChat }}>
      {children}
    </MessagesContext.Provider>
  );
}

export function useMessages() {
  const context = useContext(MessagesContext);
  if (context === undefined) {
    throw new Error('useMessages must be used within a MessagesProvider');
  }
  return context;
} 