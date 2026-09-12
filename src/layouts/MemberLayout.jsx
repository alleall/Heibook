import React, { useState } from "react";
import { Sidebar } from "../components/layout/Sidebar";
import { Header } from "../components/layout/Header";
import { ToastContainer } from "../components/common/Toast";

export const MemberLayout = ({ children, currentPath = "/dashboard" }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background font-body-md text-body-md text-on-surface antialiased">
      {/* Sidebar Navigation */}
      <Sidebar
        currentPath={currentPath}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content Pane */}
      <div className="lg:pl-72 flex flex-col min-h-screen">
        <Header onToggleSidebar={() => setSidebarOpen(true)} />
        <main className="flex-1 pt-16 p-4 sm:p-6 lg:p-gutter-desktop max-w-max-content-width w-full mx-auto">
          {children}
        </main>
      </div>

      <ToastContainer />
    </div>
  );
};
