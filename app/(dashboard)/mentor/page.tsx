import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import MentorDashboard from "@/components/dashboard/panels/mentor/mentor-dashboard";

export default async function MentorPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/signin");
  }

  if (session.user.role !== "mentor") {
    redirect("/");
  }

  return <MentorDashboard />;
} 