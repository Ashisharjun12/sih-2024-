import BottomNav from "@/components/dashboard/panels/startup/bottom-nav";
import { StartupSidebar } from "@/components/dashboard/panels/startup/startup-sidebar";

export default function StartupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-[calc(100vh-4rem)]">
      <div className="hidden md:block">
        <StartupSidebar />
      </div>
      <main className="md:pl-16 w-full transition-all duration-300 md:pb-0 mb-[3rem]">
        {children}
      </main>
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50">
        <BottomNav />
      </div>
    </div>
  );
} 