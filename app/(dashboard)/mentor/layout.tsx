import { MentorSidebar } from "@/components/dashboard/panels/mentor/mentor-sidebar";

export default function MentorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <MentorSidebar />
      <main className="pl-16 w-full transition-all duration-300">
        {children}
      </main>
    </div>
  );
} 