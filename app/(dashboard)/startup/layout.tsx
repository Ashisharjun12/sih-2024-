import { StartupSidebar } from "@/components/dashboard/panels/startup/startup-sidebar";

export default function StartupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <StartupSidebar className="w-64 border-r bg-background" />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
} 