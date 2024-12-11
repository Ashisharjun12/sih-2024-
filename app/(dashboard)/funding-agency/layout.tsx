import { FundingAgencySidebar } from "@/components/dashboard/panels/funding-agency/funding-agency-sidebar";
<<<<<<< HEAD

=======
>>>>>>> c1cca49062179b2a05a995c54ad323a9a13b6b91
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