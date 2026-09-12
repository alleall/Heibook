import React, { useState, useEffect, useCallback } from "react";
import { useLibrary } from "./context/LibraryContext";

// Layouts
import { PublicLayout } from "./layouts/PublicLayout";
import { MemberLayout } from "./layouts/MemberLayout";
import { AdminLayout } from "./layouts/AdminLayout";

// Public Pages  (named exports → { } imports)
import { LandingPage } from "./pages/public/LandingPage";
import { CatalogPage } from "./pages/public/CatalogPage";
import { BookDetailPage } from "./pages/public/BookDetailPage";
import { LoginPage } from "./pages/public/LoginPage";
import { RegisterPage } from "./pages/public/RegisterPage";
import { ForgotPasswordPage } from "./pages/public/ForgotPasswordPage";

// Member Pages  (named exports → { } imports)
import { MemberDashboardPage } from "./pages/member/MemberDashboardPage";
import { MyLoansPage } from "./pages/member/MyLoansPage";
import { LoanDetailPage } from "./pages/member/LoanDetailPage";
import { BorrowingHistoryPage } from "./pages/member/BorrowingHistoryPage";
import { MemberProfilePage } from "./pages/member/MemberProfilePage";
import { MemberSettingsPage } from "./pages/member/MemberSettingsPage";

// Admin Pages  (mix: some default, some named)
import { AdminDashboardPage } from "./pages/admin/AdminDashboardPage";
import { BookManagementPage } from "./pages/admin/BookManagementPage";
import { AddBookPage } from "./pages/admin/AddBookPage";
import { EditBookPage } from "./pages/admin/EditBookPage";
import CategoryManagementPage from "./pages/admin/CategoryManagementPage";
import MemberManagementPage from "./pages/admin/MemberManagementPage";
import MemberDetailPage from "./pages/admin/MemberDetailPage";
import BorrowingManagementPage from "./pages/admin/BorrowingManagementPage";
import ReturnManagementPage from "./pages/admin/ReturnManagementPage";
import OverdueManagementPage from "./pages/admin/OverdueManagementPage";
import ReportsPage from "./pages/admin/ReportsPage";
import AdminSettingsPage from "./pages/admin/AdminSettingsPage";

// System Pages  (default exports)
import AccessDeniedPage from "./pages/system/AccessDeniedPage";
import NotFoundPage from "./pages/system/NotFoundPage";

// ---------------------------------------------------------------------------
// Hash Router Helpers
// ---------------------------------------------------------------------------
const getHash = () => {
  const hash = window.location.hash.replace(/^#/, "") || "/";
  return hash;
};

// Parse a path against a pattern, returning params object or null if no match.
// Pattern segments starting with ":" are captured as params.
const matchPath = (pattern, path) => {
  const patternParts = pattern.split("/").filter(Boolean);
  const pathParts = path.split("/").filter(Boolean);

  if (patternParts.length !== pathParts.length) return null;

  const params = {};
  for (let i = 0; i < patternParts.length; i++) {
    if (patternParts[i].startsWith(":")) {
      params[patternParts[i].slice(1)] = pathParts[i];
    } else if (patternParts[i] !== pathParts[i]) {
      return null;
    }
  }
  return params;
};

// ---------------------------------------------------------------------------
// Route Table
// Format: { pattern, layout, component, adminOnly, memberOnly }
// ---------------------------------------------------------------------------
const ROUTES = [
  // Public
  { pattern: "/",                          layout: "public",  component: "landing" },
  { pattern: "/catalog",                   layout: "public",  component: "catalog" },
  { pattern: "/books",                     layout: "public",  component: "catalog" },        // navbar alias
  { pattern: "/books/:id",                 layout: "public",  component: "book-detail" },
  { pattern: "/catalog/:id",               layout: "public",  component: "book-detail" },    // catalog alias
  { pattern: "/login",                     layout: "public",  component: "login" },
  { pattern: "/register",                  layout: "public",  component: "register" },
  { pattern: "/forgot-password",           layout: "public",  component: "forgot-password" },

  // Member
  { pattern: "/dashboard",                 layout: "member",  component: "member-dashboard",  memberOnly: true },
  { pattern: "/my-loans",                  layout: "member",  component: "my-loans",          memberOnly: true },
  { pattern: "/my-loans/:id",              layout: "member",  component: "loan-detail",       memberOnly: true },
  { pattern: "/history",                   layout: "member",  component: "borrowing-history", memberOnly: true },
  { pattern: "/profile",                   layout: "member",  component: "member-profile",    memberOnly: true },
  { pattern: "/settings",                  layout: "member",  component: "member-settings",   memberOnly: true },

  // Admin
  { pattern: "/admin",                     layout: "admin",   component: "admin-dashboard",   adminOnly: true },
  { pattern: "/admin/dashboard",           layout: "admin",   component: "admin-dashboard",   adminOnly: true },
  { pattern: "/admin/books",               layout: "admin",   component: "book-management",   adminOnly: true },
  { pattern: "/admin/books/add",           layout: "admin",   component: "add-book",          adminOnly: true },
  { pattern: "/admin/books/create",        layout: "admin",   component: "add-book",          adminOnly: true }, // dashboard alias
  { pattern: "/admin/books/:id/edit",      layout: "admin",   component: "edit-book",         adminOnly: true },
  { pattern: "/admin/categories",          layout: "admin",   component: "categories",        adminOnly: true },
  { pattern: "/admin/members",             layout: "admin",   component: "member-management", adminOnly: true },
  { pattern: "/admin/members/:id",         layout: "admin",   component: "member-detail",     adminOnly: true },
  { pattern: "/admin/loans",               layout: "admin",   component: "borrowing-management", adminOnly: true },
  { pattern: "/admin/returns",             layout: "admin",   component: "return-management", adminOnly: true },
  { pattern: "/admin/overdue",             layout: "admin",   component: "overdue-management",adminOnly: true },
  { pattern: "/admin/reports",             layout: "admin",   component: "reports",           adminOnly: true },
  { pattern: "/admin/settings",            layout: "admin",   component: "admin-settings",    adminOnly: true },

  // System
  { pattern: "/403",                       layout: "public",  component: "access-denied" },
  { pattern: "/404",                       layout: "public",  component: "not-found" },
];

// ---------------------------------------------------------------------------
// App Component
// ---------------------------------------------------------------------------
export default function App() {
  const { userRole, setUserRole } = useLibrary();
  const [currentPath, setCurrentPath] = useState(getHash);

  // Listen for hash changes
  useEffect(() => {
    const handleHashChange = () => setCurrentPath(getHash());
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  // Navigate helper passed down to every page component
  const navigate = useCallback((path) => {
    window.location.hash = `#${path}`;
  }, []);

  // Match current path against route table
  let matchedRoute = null;
  let matchedParams = {};

  for (const route of ROUTES) {
    const params = matchPath(route.pattern, currentPath);
    if (params !== null) {
      matchedRoute = route;
      matchedParams = params;
      break;
    }
  }

  // If no route matched, show 404
  if (!matchedRoute) {
    return (
      <PublicLayout currentPath={currentPath}>
        <NotFoundPage onNavigate={navigate} />
      </PublicLayout>
    );
  }

  // Role-based access control
  if (matchedRoute.adminOnly && userRole !== "admin") {
    return (
      <PublicLayout currentPath={currentPath}>
        <AccessDeniedPage onNavigate={navigate} />
      </PublicLayout>
    );
  }

  if (matchedRoute.memberOnly && userRole === "guest") {
    return (
      <PublicLayout currentPath={currentPath}>
        <LoginPage onNavigate={navigate} />
      </PublicLayout>
    );
  }

  // Resolve the page component
  const renderPage = () => {
    const c = matchedRoute.component;
    const p = matchedParams;

    switch (c) {
      // Public
      case "landing":           return <LandingPage onNavigate={navigate} />;
      case "catalog":           return <CatalogPage onNavigate={navigate} />;
      case "book-detail":       return <BookDetailPage bookId={p.id} onNavigate={navigate} />;
      case "login":             return <LoginPage onNavigate={navigate} />;
      case "register":          return <RegisterPage onNavigate={navigate} />;
      case "forgot-password":   return <ForgotPasswordPage onNavigate={navigate} />;

      // Member
      case "member-dashboard":  return <MemberDashboardPage onNavigate={navigate} />;
      case "my-loans":          return <MyLoansPage onNavigate={navigate} />;
      case "loan-detail":       return <LoanDetailPage loanId={p.id} onNavigate={navigate} />;
      case "borrowing-history": return <BorrowingHistoryPage onNavigate={navigate} />;
      case "member-profile":    return <MemberProfilePage onNavigate={navigate} />;
      case "member-settings":   return <MemberSettingsPage onNavigate={navigate} />;

      // Admin
      case "admin-dashboard":   return <AdminDashboardPage onNavigate={navigate} />;
      case "book-management":   return <BookManagementPage onNavigate={navigate} />;
      case "add-book":          return <AddBookPage onNavigate={navigate} />;
      case "edit-book":         return <EditBookPage bookId={p.id} onNavigate={navigate} />;
      case "categories":        return <CategoryManagementPage onNavigate={navigate} />;
      case "member-management": return <MemberManagementPage onNavigate={navigate} />;
      case "member-detail":     return <MemberDetailPage memberId={p.id} onNavigate={navigate} />;
      case "borrowing-management": return <BorrowingManagementPage onNavigate={navigate} />;
      case "return-management": return <ReturnManagementPage onNavigate={navigate} />;
      case "overdue-management": return <OverdueManagementPage onNavigate={navigate} />;
      case "reports":           return <ReportsPage onNavigate={navigate} />;
      case "admin-settings":    return <AdminSettingsPage onNavigate={navigate} />;

      // System
      case "access-denied":     return <AccessDeniedPage onNavigate={navigate} />;
      case "not-found":         return <NotFoundPage onNavigate={navigate} />;

      default:
        return <NotFoundPage onNavigate={navigate} />;
    }
  };

  // Render in the correct layout
  const layout = matchedRoute.layout;

  if (layout === "admin") {
    return (
      <AdminLayout currentPath={currentPath}>
        {renderPage()}
      </AdminLayout>
    );
  }

  if (layout === "member") {
    return (
      <MemberLayout currentPath={currentPath}>
        {renderPage()}
      </MemberLayout>
    );
  }

  // Public layout (default)
  return (
    <PublicLayout currentPath={currentPath}>
      {renderPage()}
    </PublicLayout>
  );
}
