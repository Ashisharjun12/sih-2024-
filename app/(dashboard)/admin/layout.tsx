import { AdminSidebar } from "@/components/dashboard/panels/admin/admin-sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <AdminSidebar className="w-64 border-r bg-background" />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
} 