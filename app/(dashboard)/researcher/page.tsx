import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import ResearcherDashboard from "@/components/dashboard/panels/researcher/researcher-dashboard";

export default async function ResearcherPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/signin");
  }

  if (session.user.role !== "researcher") {
    redirect("/");
  }

  return <ResearcherDashboard />;
} 