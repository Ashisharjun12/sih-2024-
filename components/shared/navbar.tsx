"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession, signIn, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import {
  Rocket,
  Microscope,
  Scale,
  FileText,
  Banknote,
  UserCog,
  LogOut,
  Settings,
  User,
  Building,
  PlusCircle,
  Bell,
  Wallet,
  Plus,
  IndianRupee,
} from "lucide-react";
import { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";

interface Notification {
  _id: string;
  name: string;
  message: string;
  role: string;
}

const roleApplications = [
  {
    title: "Apply as Startup",
    description: "Register your startup",
    href: "/forms/startup",
    icon: Rocket,
  },
  {
    title: "Apply as Researcher",
    description: "Join as a researcher",
    href: "/forms/researcher",
    icon: Microscope,
  },
  {
    title: "Apply as IPR Professional",
    description: "Register as IPR expert",
    href: "/forms/iprprofessional",
    icon: Scale,
  },
  {
    title: "Apply as Funding Agency",
    description: "Register funding agency",
    href: "/forms/fundingAgency",
    icon: Banknote,
  },
  {
    title: "Apply as Mentor",
    description: "Become a mentor",
    href: "/forms/mentor",
    icon: UserCog,
  },
];

const roleRoutes = {
  admin: { path: "/admin", label: "Admin Panel", icon: Settings },
  startup: { path: "/startup", label: "Startup Panel", icon: Rocket },
  researcher: {
    path: "/researcher",
    label: "Researcher Panel",
    icon: Microscope,
  },
  iprProfessional: {
    path: "/ipr-professional",
    label: "IPR Panel",
    icon: Scale,
  },
  policyMaker: { path: "/policy-maker", label: "Policy Panel", icon: FileText },
  fundingAgency: {
    path: "/funding-agency",
    label: "Funding Panel",
    icon: Banknote,
  },
  mentor: { path: "/mentor", label: "Mentor Panel", icon: UserCog },
};

export default function Navbar() {
  const { data: session, status } = useSession();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(true);
  const router = useRouter();
  const [showAddMoneyDialog, setShowAddMoneyDialog] = useState(false);
  const [depositAmount, setDepositAmount] = useState("");
  const [walletBalance, setWalletBalance] = useState(0);
  const [isDepositing, setIsDepositing] = useState(false);

  const handleSignIn = async () => {
    await signIn("google", {
      callbackUrl: session?.user?.role
        ? roleRoutes[session.user.role as keyof typeof roleRoutes]?.path
        : "/",
    });
  };

  const getRoleConfig = (role: string | undefined) => {
    if (!role || role === "user") return null;
    return roleRoutes[role as keyof typeof roleRoutes];
  };

  const roleConfig = getRoleConfig(session?.user?.role);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (session) {
        try {
          const response = await fetch("/api/notifications");
          if (!response.ok) throw new Error("Failed to fetch notifications");
          const data = await response.json();
          setNotifications(data.notifications);
          if (session.user.role === "fundingAgency") {
            setNotifications((prevNotifications) => [
              ...prevNotifications,
              { _id: "new-notification-id", name: "Start Yo", message: "ROI is low", role: "Startup" },
            ]);
          }
        } catch (error) {
          console.error("Error fetching notifications:", error);
        } finally {
          setIsLoadingNotifications(false);
        }
      }
    };

    fetchNotifications();
  }, [session]);

  useEffect(() => {
    if (session) {
      fetchWalletBalance();
    }
  }, [session]);

  const fetchWalletBalance = async () => {
    try {
      const response = await fetch("/api/wallet/balance");
      const data = await response.json();
      setWalletBalance(data.balance);
    } catch (error) {
      console.error("Error fetching wallet:", error);
    }
  };

  const handleDeposit = async () => {
    if (
      !depositAmount ||
      isNaN(Number(depositAmount)) ||
      Number(depositAmount) <= 0
    ) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }

    setIsDepositing(true);
    try {
      const response = await fetch("/api/wallet/deposit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: Number(depositAmount) }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      setWalletBalance(data.balance);
      setShowAddMoneyDialog(false);
      setDepositAmount("");
      toast({
        title: "Success",
        description: "Money added to wallet successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to add money",
        variant: "destructive",
      });
    } finally {
      setIsDepositing(false);
    }
  };

  const handleProfileClick = () => {
    if (session?.user?.role === "startup") {
      router.push("/startup/profile");
    } else {
      router.push("/profile");
    }
  };

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        {/* Logo - Always visible */}
        <Link href="/" className="flex items-center space-x-2">
          <Building className="h-5 w-5 md:h-6 md:w-6" />
          <span className="text-lg md:text-2xl font-bold">Udyog Saathi</span>
        </Link>

        <div className="flex items-center gap-2 md:gap-6">
          {/* Desktop Navigation - Hidden on mobile */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/explore" className="hover:text-primary">
              Explore
            </Link>
          </div>

          {/* Wallet Button - Only show when logged in */}
          {session?.user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 md:h-10 md:w-10"
                >
                  <div className="relative">
                    <Wallet className="h-4 w-4 md:h-5 md:w-5" />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-[280px] md:w-[320px]"
              >
                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm font-medium">Wallet Balance</p>
                      <p className="text-2xl font-bold text-primary">
                        ₹{walletBalance.toLocaleString("en-IN")}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => setShowAddMoneyDialog(true)}
                      className="bg-primary/10 text-primary hover:bg-primary/20"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Money
                    </Button>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Use your wallet balance to purchase research papers and
                    other services
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Notifications - Show on both mobile and desktop */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 md:h-10 md:w-10"
              >
                <div className="relative">
                  <Bell className="h-4 w-4 md:h-5 md:w-5" />
                  {notifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] font-medium text-white flex items-center justify-center">
                      {notifications.length}
                    </span>
                  )}
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[280px] md:w-[320px]">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {isLoadingNotifications ? (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  Loading...
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  No notifications
                </div>
              ) : (
                <ScrollArea className="h-[300px]">
                  <div className="p-2">
                    {notifications.map((notification) => (
                      <div
                        key={notification._id}
                        className="mb-2 rounded-lg p-3 hover:bg-muted"
                      >
                        <p className="font-medium text-sm">
                          {notification.role[0].toUpperCase() +
                            notification.role.slice(1)}{" "}
                          <span className="text-gray-500 ">
                            {notification.name !== "Admin" && notification.name}
                          </span>
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {notification.message}
                        </p>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Role Applications - Simplified on mobile */}
          {session && session.user.role === "user" && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 md:h-10 md:w-auto md:px-4"
                >
                  <PlusCircle className="h-4 w-4 md:mr-2" />
                  <span className="hidden md:inline">Apply For Role</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[220px]">
                <DropdownMenuLabel>Choose Role</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {roleApplications.map((role) => (
                  <DropdownMenuItem key={role.href} asChild>
                    <Link
                      href={role.href}
                      className="flex items-start gap-2 p-2"
                    >
                      <role.icon className="h-5 w-5" />
                      <div className="flex flex-col">
                        <span className="font-medium">{role.title}</span>
                        <span className="text-xs text-muted-foreground">
                          {role.description}
                        </span>
                      </div>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* User Menu */}
          {status === "loading" ? (
            <Avatar className="h-8 w-8 md:h-10 md:w-10">
              <AvatarFallback>...</AvatarFallback>
            </Avatar>
          ) : session ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="focus:outline-none">
                <motion.div
                  className="h-8 w-8 md:h-10 md:w-10 rounded-full overflow-hidden border"
                  whileHover={{ scale: 1.05 }}
                >
                  {session.user?.image ? (
                    <Image
                      src={session.user.image}
                      alt={session.user.name || "User"}
                      width={40}
                      height={40}
                      className="h-full w-full object-cover"
                      priority
                    />
                  ) : (
                    <Avatar>
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </motion.div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="flex flex-col px-2 py-1.5">
                  <p className="font-medium">{session.user?.name}</p>
                  {roleConfig && (
                    <Link
                      href={roleConfig.path}
                      className="text-xs text-primary hover:underline mt-1 font-medium flex items-center gap-2"
                    >
                      <roleConfig.icon className="h-3 w-3" />
                      {roleConfig.label}
                    </Link>
                  )}
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="focus:bg-primary/10"
                  onClick={handleProfileClick}
                >
                  <div className="flex items-center gap-2 w-full">
                    <User className="h-4 w-4" />
                    <span className="flex-1">Profile</span>
                    {session.user?.role === "startup" && (
                      <span className="text-xs text-muted-foreground">
                        Startup Profile
                      </span>
                    )}
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="/research-papers"
                    className="flex items-center gap-2"
                  >
                    <FileText className="h-4 w-4" />
                    Research Papers
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950"
                >
                  <div className="flex items-center gap-2">
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button onClick={handleSignIn} size="sm" className="h-8 md:h-10">
              <User className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline">Sign In</span>
            </Button>
          )}
        </div>
      </div>

      {/* Add Money Dialog */}
      <Dialog open={showAddMoneyDialog} onOpenChange={setShowAddMoneyDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Money to Wallet</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Current Balance</Label>
              <div className="p-3 bg-muted rounded-lg flex items-center gap-2">
                <IndianRupee className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">
                  {walletBalance.toLocaleString("en-IN")}
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Amount to Add</Label>
              <div className="relative">
                <IndianRupee className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="number"
                  placeholder="Enter amount"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={handleDeposit}
              disabled={isDepositing}
              className="w-full"
            >
              {isDepositing ? (
                <>
                  <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                  Processing...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Money
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </nav>
  );
}
