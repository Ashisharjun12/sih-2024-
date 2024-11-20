import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import StartupDashboard from "@/components/dashboard/panels/startup/startup-dashboard";

export default async function StartupPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/signin");
  }

  if (session.user.role !== "startup") {
    redirect("/");
  }

  return <StartupDashboard />;
} 