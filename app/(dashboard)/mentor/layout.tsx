import { MentorSidebar } from "@/components/dashboard/panels/mentor/mentor-sidebar";
import MentorBottomNav from "@/components/dashboard/panels/mentor/mentor-bottom-nav";

export default function MentorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <div className="hidden md:block">
        <MentorSidebar />
      </div>
      <main className="md:pl-16 w-full transition-all duration-300 pb-20 md:pb-0">
        {children}
      </main>
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50">
        <MentorBottomNav />
      </div>
    </div>
  );
} 