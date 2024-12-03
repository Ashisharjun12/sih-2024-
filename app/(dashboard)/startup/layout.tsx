import { StartupSidebar } from "@/components/dashboard/panels/startup/startup-sidebar";

export default function StartupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <StartupSidebar />
      <main className="pl-16 w-full transition-all duration-300">
        {children}
      </main>
    </div>
  );
} 