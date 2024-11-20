import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import FundingDashboard from "@/components/dashboard/panels/funding/funding-dashboard";

export default async function FundingAgencyPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/signin");
  }

  if (session.user.role !== "fundingAgency") {
    redirect("/");
  }

  return <FundingDashboard />;
} 