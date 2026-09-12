import React from "react";
import { useLibrary } from "../../context/LibraryContext";
import logoImage from "../images/heibook_logo.png";

export const Sidebar = ({ currentPath = "", isOpen = false, onClose = () => {} }) => {
  const { userRole, setUserRole, currentUser } = useLibrary();

  const navigate = (path) => {
    window.location.hash = `#${path}`;
    onClose();
  };

  const isAdmin = userRole === "admin";

  const memberNavLinks = [
    { label: "Dashboard", path: "/dashboard", icon: "grid_view" },
    { label: "Explore Books", path: "/books", icon: "menu_book" },
    { label: "My Borrowings", path: "/my-loans", icon: "import_contacts" },
    { label: "Borrowing History", path: "/history", icon: "history_edu" }
  ];

  const adminNavLinks = [
    { label: "Dashboard", path: "/admin/dashboard", icon: "grid_view" },
    { label: "Catalog Ledger", path: "/admin/books", icon: "auto_stories" },
    { label: "Categories", path: "/admin/categories", icon: "category" },
    { label: "Members Directory", path: "/admin/members", icon: "groups" },
    { label: "Active Loans", path: "/admin/loans", icon: "receipt_long" },
    { label: "Returns Desk", path: "/admin/returns", icon: "assignment_return" },
    { label: "Overdue Alerts", path: "/admin/overdue", icon: "priority_high" },
    { label: "Library Reports", path: "/admin/reports", icon: "bar_chart" }
  ];

  const currentNav = isAdmin ? adminNavLinks : memberNavLinks;

  const isActive = (path) => {
    if (path === "/books") {
      return currentPath === "/books" || currentPath.startsWith("/books/");
    }
    return currentPath === path || currentPath.startsWith(path + "/");
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-on-surface/50 backdrop-blur-xs z-40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 w-72 bg-surface border-r border-outline-variant/30 flex flex-col justify-between p-space-md z-50 transition-transform duration-200 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="space-y-space-lg flex-1 overflow-y-auto no-scrollbar">
          {/* Top Brand & Close on Mobile */}
          <div className="flex items-center justify-between px-space-xs pb-space-xs border-b border-outline-variant/20">
            <div
              onClick={() => navigate("/")}
              className="flex items-center gap-space-sm cursor-pointer select-none"
            >
              <img
                src={logoImage}
                alt="Heibook Logo"
                className="w-9 h-9 rounded-xl object-contain shadow-xs"
              />
              <div className="flex flex-col">
                <span className="font-title-md text-title-md font-bold text-on-surface leading-none">
                  Heibook
                </span>
                <span className="font-caption text-[11px] text-on-surface-variant tracking-wider uppercase font-medium mt-0.5">
                  {isAdmin ? "Curatorial Admin" : "Member Portal"}
                </span>
              </div>
            </div>

            {/* Mobile Close Button */}
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container"
              aria-label="Close sidebar"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          {/* Navigation Section */}
          <div className="space-y-space-xs">
            <div className="px-space-xs font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
              {isAdmin ? "Curatorial Operations" : "Navigation"}
            </div>
            <nav className="space-y-space-2xs">
              {currentNav.map((link) => {
                const active = isActive(link.path);
                return (
                  <button
                    key={link.path}
                    onClick={() => navigate(link.path)}
                    className={`w-full flex items-center gap-space-sm px-space-sm py-space-xs rounded-lg transition-all text-left font-body-sm text-body-sm cursor-pointer ${
                      active
                        ? "bg-primary text-on-primary font-semibold shadow-sm"
                        : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px]">{link.icon}</span>
                    <span>{link.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Quick Cross-Link for Admin/Member Toggle */}
          <div className="p-space-xs rounded-xl bg-surface-container-low border border-outline-variant/30 text-caption">
            <div className="flex items-center justify-between mb-1 text-on-surface-variant font-medium">
              <span>View Mode:</span>
              <span className="font-bold text-secondary uppercase text-[10px]">{userRole}</span>
            </div>
            <div className="grid grid-cols-2 gap-1">
              <button
                onClick={() => {
                  setUserRole("member");
                  navigate("/dashboard");
                }}
                className={`py-1 text-center rounded text-[11px] font-semibold transition-colors ${
                  userRole === "member"
                    ? "bg-primary text-on-primary shadow-xs"
                    : "bg-surface-container text-on-surface hover:bg-surface-container-high"
                }`}
              >
                Member
              </button>
              <button
                onClick={() => {
                  setUserRole("admin");
                  navigate("/admin/dashboard");
                }}
                className={`py-1 text-center rounded text-[11px] font-semibold transition-colors ${
                  userRole === "admin"
                    ? "bg-primary text-on-primary shadow-xs"
                    : "bg-surface-container text-on-surface hover:bg-surface-container-high"
                }`}
              >
                Admin
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Section: Account / Settings / Sign Out */}
        <div className="pt-space-sm border-t border-outline-variant/20 space-y-space-2xs">
          {!isAdmin ? (
            <>
              <button
                onClick={() => navigate("/profile")}
                className={`w-full flex items-center gap-space-sm px-space-sm py-space-xs rounded-lg transition-all text-left font-body-sm text-body-sm ${
                  isActive("/profile")
                    ? "bg-primary text-on-primary font-semibold shadow-sm"
                    : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">account_circle</span>
                <span>Member Profile</span>
              </button>
              <button
                onClick={() => navigate("/settings")}
                className={`w-full flex items-center gap-space-sm px-space-sm py-space-xs rounded-lg transition-all text-left font-body-sm text-body-sm ${
                  isActive("/settings")
                    ? "bg-primary text-on-primary font-semibold shadow-sm"
                    : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">settings</span>
                <span>Settings</span>
              </button>
            </>
          ) : (
            <button
              onClick={() => navigate("/admin/settings")}
              className={`w-full flex items-center gap-space-sm px-space-sm py-space-xs rounded-lg transition-all text-left font-body-sm text-body-sm ${
                isActive("/admin/settings")
                  ? "bg-primary text-on-primary font-semibold shadow-sm"
                  : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">tune</span>
              <span>Circulation Rules</span>
            </button>
          )}

          <button
            onClick={() => {
              setUserRole("guest");
              navigate("/login");
            }}
            className="w-full flex items-center gap-space-sm px-space-sm py-space-xs rounded-lg text-on-surface-variant hover:bg-error-container hover:text-on-error-container transition-all text-left font-body-sm text-body-sm"
          >
            <span className="material-symbols-outlined text-[20px]">logout</span>
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};
