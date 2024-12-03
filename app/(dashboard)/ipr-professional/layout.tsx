import { IPRProfessionalSidebar } from "@/components/dashboard/panels/ipr-professional/ipr-professional-sidebar";

export default function IPRProfessionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <IPRProfessionalSidebar />
      <main className="pl-16 w-full transition-all duration-300">
        {children}
      </main>
    </div>
  );
} 