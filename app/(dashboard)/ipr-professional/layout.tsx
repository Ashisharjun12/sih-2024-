import { IPRProfessionalSidebar } from "@/components/dashboard/panels/ipr-professional/ipr-professional-sidebar";
import { IPRBottomNav } from "@/components/dashboard/panels/ipr-professional/ipr-bottom-nav";

export default function IPRProfessionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <IPRProfessionalSidebar />
      <main className="md:pl-16 w-full transition-all duration-300 pb-16 md:pb-0">
        {children}
      </main>
      <IPRBottomNav />
    </div>
  );
} 