// components/Layout.js
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/Sidebar";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function Layout({ children }) {
  return (
    <ProtectedRoute>
      <SidebarProvider>
        <div className="flex h-screen">
          <div className="w-64">
            <AppSidebar />
          </div>
          <main className="w-[calc(100vw-256px)]">{children}</main>
        </div>
      </SidebarProvider>
    </ProtectedRoute>
  );
}
