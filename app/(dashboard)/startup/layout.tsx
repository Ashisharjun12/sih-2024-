import BottomNav from "@/components/dashboard/panels/startup/bottom-nav";
import { StartupSidebar } from "@/components/dashboard/panels/startup/startup-sidebar";


export default function StartupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <div className="hidden md:block">
        <StartupSidebar />
      </div>
      <main className="md:pl-16 w-full transition-all duration-300 pb-20 md:pb-0">
        {children}
      </main>
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50">
        <BottomNav />
      </div>
    </div>
  );
} 