import { PolicyMakerSidebar } from "@/components/dashboard/panels/policy-maker/policy-maker-sidebar";

export default function PolicyMakerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <PolicyMakerSidebar />
      <main className="pl-16 w-full transition-all duration-300">
        {children}
      </main>
    </div>
  );
} 