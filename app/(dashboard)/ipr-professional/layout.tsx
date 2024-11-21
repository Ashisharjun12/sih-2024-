import { IPRProfessionalSidebar } from "@/components/dashboard/panels/ipr-professional/ipr-professional-sidebar";

export default function IPRProfessionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <div className="hidden border-r bg-gray-100/40 lg:block lg:w-72 lg:bg-gray-100/20">
        <IPRProfessionalSidebar />
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );
} 