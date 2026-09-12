import React from "react";
import { PublicNavbar } from "../components/layout/PublicNavbar";
import { PublicFooter } from "../components/layout/PublicFooter";
import { ToastContainer } from "../components/common/Toast";

export const PublicLayout = ({ children, currentPath = "/" }) => {
  return (
    <div className="min-h-screen flex flex-col bg-background font-body-md text-body-md text-on-surface antialiased">
      <PublicNavbar currentPath={currentPath} />
      <main className="flex-1 w-full pt-20 bg-background">
        {children}
      </main>
      <PublicFooter />
      <ToastContainer />
    </div>
  );
};
