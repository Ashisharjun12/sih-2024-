import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "@/components/shared/navbar";
import AuthProvider from "@/providers/auth-provider";
import { Toaster } from "@/components/ui/toaster"
import { Chatbot } from "@/components/chatbot/chatbot";
import { WelcomeOverlay } from "@/components/welcome-overlay";

// Add these imports
import { X } from "lucide-react";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <div className="min-h-screen flex flex-col">
              <Navbar />
              
              <Chatbot />
              <main className="flex-1">{children}</main>
            </div>
          </AuthProvider>
          <Toaster />
        </ThemeProvider>
      </body>
  
    </html>
  );
}
