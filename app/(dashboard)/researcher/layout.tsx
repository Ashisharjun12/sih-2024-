import { ResearcherSidebar } from "@/components/dashboard/panels/researcher/researcher-sidebar";
import ResearcherBottomNav from "@/components/dashboard/panels/researcher/researcher-bottom-nav";

export default function ResearcherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <div className="hidden md:block">
        <ResearcherSidebar />
      </div>
      <main className="md:pl-16 w-full transition-all duration-300 pb-20 md:pb-0">
        {children}
      </main>
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50">
        <ResearcherBottomNav />
      </div>
    </div>
  );
} 