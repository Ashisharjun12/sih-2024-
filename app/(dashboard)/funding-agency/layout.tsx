import { FundingAgencySidebar } from "@/components/dashboard/panels/funding-agency/funding-agency-sidebar";
import "../../globals.css";
export default function FundingAgencyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <FundingAgencySidebar />
      <main className="pl-16 w-full transition-all duration-300">
        {children}
      </main>
    </div>
  );
} 