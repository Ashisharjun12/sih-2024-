import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import PolicyMakerDashboard from "@/components/dashboard/panels/policy/policy-dashboard";

export default async function PolicyMakerPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/signin");
  }

  if (session.user.role !== "policyMaker") {
    redirect("/");
  }

  return <PolicyMakerDashboard />;
} 