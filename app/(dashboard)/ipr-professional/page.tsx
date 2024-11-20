import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import IprDashboard from "@/components/dashboard/panels/ipr/ipr-dashboard";

export default async function IprProfessionalPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/signin");
  }

  if (session.user.role !== "iprProfessional") {
    redirect("/");
  }

  return <IprDashboard />;
} 