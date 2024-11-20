import { ResearcherSidebar } from "@/components/dashboard/panels/researcher/researcher-sidebar";

export default function ResearcherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <ResearcherSidebar className="w-64 border-r bg-background" />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
} 