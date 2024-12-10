import { PolicyMakerSidebar } from "@/components/dashboard/panels/policy-maker/policy-maker-sidebar";
import PolicyMakerBottomNav from "@/components/dashboard/panels/policy-maker/policy-maker-bottom-nav";

export default function PolicyMakerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-[calc(100vh-4rem)]">
      <div className="hidden md:block">
        <PolicyMakerSidebar />
      </div>
      <main className="md:pl-16 w-full transition-all duration-300 md:pb-0 mb-[3rem]">
        {children}
      </main>
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50">
        <PolicyMakerBottomNav />
      </div>
    </div>
  );
} 