import { PolicyMakerSidebar } from "@/components/dashboard/panels/policy-maker/policy-maker-sidebar";

export default function PolicyMakerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <div className="hidden border-r bg-gray-100/40 lg:block lg:w-72 lg:bg-gray-100/20">
        <PolicyMakerSidebar />
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );
} 