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
  Search,
  LogOut,
  Settings,
  User,
  Building,
  GraduationCap,
  PlusCircle,
} from "lucide-react";

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
    title: "Apply as Policy Maker",
    description: "Join as policy maker",
    href: "/forms/policy",
    icon: FileText,
  },
  {
    title: "Apply as Funding Agency",
    description: "Register funding agency",
    href: "/forms/funding",
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
  researcher: { path: "/researcher", label: "Researcher Panel", icon: Microscope },
  iprProfessional: { path: "/ipr-professional", label: "IPR Panel", icon: Scale },
  policyMaker: { path: "/policy-maker", label: "Policy Panel", icon: FileText },
  fundingAgency: { path: "/funding-agency", label: "Funding Panel", icon: Banknote },
  mentor: { path: "/mentor", label: "Mentor Panel", icon: UserCog },
};

export default function Navbar() {
  const { data: session, status } = useSession();

  const handleSignIn = async () => {
    await signIn("google", { 
      callbackUrl: session?.user?.role ? roleRoutes[session.user.role as keyof typeof roleRoutes]?.path : '/' 
    });
  };

  const getRoleConfig = (role: string | undefined) => {
    if (!role || role === 'user') return null;
    return roleRoutes[role as keyof typeof roleRoutes];
  };

  const roleConfig = getRoleConfig(session?.user?.role);

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <Building className="h-6 w-6" />
          <span className="text-2xl font-bold">StartupHub</span>
        </Link>

        <div className="flex items-center gap-6">
          <Link href="/explore" className="hover:text-primary flex items-center gap-2">
            <Search className="h-4 w-4" />
            Explore
          </Link>

          {/* Role Applications Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="hover:text-primary flex items-center gap-2">
                <PlusCircle className="h-4 w-4" />
                Apply For Role
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[220px]">
              <DropdownMenuLabel>Choose Role</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {roleApplications.map((role) => (
                <DropdownMenuItem key={role.href} asChild>
                  <Link href={role.href} className="flex items-start gap-2 p-2">
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

          <Link href="/researchers" className="hover:text-primary flex items-center gap-2">
            <GraduationCap className="h-4 w-4" />
            Researchers
          </Link>

          {status === 'loading' ? (
            <Avatar>
              <AvatarFallback>...</AvatarFallback>
            </Avatar>
          ) : session ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="focus:outline-none">
                <motion.div 
                  className="h-10 w-10 rounded-full overflow-hidden border"
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
                
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    Profile Settings
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuItem 
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="text-red-600 focus:text-red-600 flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button onClick={handleSignIn} className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Sign In
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
} 