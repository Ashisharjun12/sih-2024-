import { FundingAgencySidebar } from "@/components/dashboard/panels/funding-agency/funding-agency-sidebar";

export default function FundingAgencyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <div className="hidden border-r bg-gray-100/40 lg:block lg:w-72 lg:bg-gray-100/20">
        <FundingAgencySidebar />
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );
} 