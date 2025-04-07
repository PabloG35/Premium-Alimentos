// src/components/Layout.js
"use client";

import Footer from "@/src/components/Footer";
import Navbar from "@/src/components/Navbar";
import { SidebarProvider } from "@/src/components/ui/sidebar";
import { AppSidebar } from "@/src/components/NavSideBar";

function Layout({ children }) {
  return (
    <SidebarProvider>
      <div className="layout-container w-full bg-zinc-50">
        {/* Sidebar for tablet/mobile */}
        <AppSidebar />

        <div className="fixed top-0 w-full z-50">
          <Navbar />
        </div>
        {/* Main Content with top padding to avoid navbar overlap */}
        <main className="pt-28 max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16 xl:px-20 bg-zinc-50">
          {children}
        </main>
        <Footer />
      </div>
    </SidebarProvider>
  );
}

export default Layout;
