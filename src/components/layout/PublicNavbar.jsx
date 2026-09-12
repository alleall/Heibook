import React, { useState } from "react";
import { useLibrary } from "../../context/LibraryContext";
import logoImage from "../images/heibook_logo.png";
import memberImage from "../images/member.jpg";
import adminImage from "../images/admin.jpg";

export const PublicNavbar = ({ currentPath = "/" }) => {
  const { userRole, setUserRole, currentUser } = useLibrary();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigate = (path) => {
    window.location.hash = `#${path}`;
    setMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-surface/85 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-outline-variant/20">
      <div className="h-20 max-w-max-content-width mx-auto px-gutter-desktop flex items-center justify-between gap-space-md">
        {/* Left: Brand Identity */}
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
            <span className="font-title-md text-title-md tracking-tight text-on-surface font-extrabold leading-none">
              Heibook
            </span>
            <span className="font-caption text-[11px] text-on-surface-variant font-medium tracking-wider uppercase">
              Digital Library
            </span>
          </div>
        </div>

        {/* Center: Nav Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-space-lg">
          <button
            onClick={() => navigate("/")}
            className={`font-body-md text-body-md transition-colors ${currentPath === "/"
              ? "text-primary font-bold border-b-2 border-primary py-1"
              : "text-on-surface-variant hover:text-on-surface py-1"
              }`}
          >
            Home
          </button>
          <button
            onClick={() => navigate("/books")}
            className={`font-body-md text-body-md transition-colors ${currentPath === "/books"
              ? "text-primary font-bold border-b-2 border-primary py-1"
              : "text-on-surface-variant hover:text-on-surface py-1"
              }`}
          >
            Explore Catalog
          </button>
          <button
            onClick={() => navigate("/dashboard")}
            className={`font-body-md text-body-md transition-colors ${currentPath.startsWith("/dashboard") || currentPath.startsWith("/my-loans")
              ? "text-primary font-bold border-b-2 border-primary py-1"
              : "text-on-surface-variant hover:text-on-surface py-1"
              }`}
          >
            Member Desk
          </button>
          <button
            onClick={() => navigate("/admin/dashboard")}
            className={`font-body-md text-body-md transition-colors ${currentPath.startsWith("/admin")
              ? "text-primary font-bold border-b-2 border-primary py-1"
              : "text-on-surface-variant hover:text-on-surface py-1"
              }`}
          >
            Curatorial Admin
          </button>
        </nav>

        {/* Right: Actions & User Switcher */}
        <div className="flex items-center gap-space-sm">
          {/* Quick Role Simulator Pill */}
          <div className="hidden lg:flex items-center bg-surface-container px-2.5 py-1 rounded-full text-caption text-on-surface-variant border border-outline-variant/30">
            <span className="text-[10px] uppercase font-bold tracking-wider mr-1.5 text-secondary">
              Role:
            </span>
            <select
              value={userRole}
              onChange={(e) => setUserRole(e.target.value)}
              className="bg-transparent font-semibold text-on-surface text-caption focus:outline-none cursor-pointer"
            >
              <option value="guest">Guest</option>
              <option value="member">Member (Allensia Wood)</option>
              <option value="admin">Admin (Prof. Minerva McGonagall)</option>
            </select>
          </div>

          {userRole === "guest" ? (
            <div className="flex items-center gap-space-xs">
              <button
                onClick={() => navigate("/login")}
                className="px-space-md py-space-xs font-label-md text-label-md text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
              >
                Sign In
              </button>
              <button
                onClick={() => navigate("/register")}
                className="bg-primary text-on-primary px-space-md py-space-xs rounded-lg font-label-md text-label-md hover:bg-secondary transition-colors shadow-xs cursor-pointer font-semibold"
              >
                Join Heibook
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-space-xs">
              <button
                onClick={() => navigate(userRole === "admin" ? "/admin/dashboard" : "/dashboard")}
                className="flex items-center gap-space-xs px-space-sm py-1.5 rounded-xl bg-surface-container hover:bg-surface-container-high transition-colors cursor-pointer"
              >
                <img
                  src={currentUser.avatar || (userRole === "admin" ? adminImage : memberImage)}
                  alt={currentUser.name}
                  className="w-7 h-7 rounded-full object-cover ring-1 ring-outline-variant/40"
                  onError={(e) => {
                    e.target.src = userRole === "admin" ? adminImage : memberImage;
                  }}
                />
                <span className="font-label-md text-label-md font-semibold text-on-surface hidden sm:inline">
                  {currentUser.name}
                </span>
                <span className="material-symbols-outlined text-[16px] text-on-surface-variant">
                  arrow_forward
                </span>
              </button>
            </div>
          )}

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-on-surface hover:bg-surface-container transition-colors"
            aria-label="Toggle navigation menu"
          >
            <span className="material-symbols-outlined text-[24px]">
              {mobileMenuOpen ? "close" : "menu"}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-surface-container-lowest border-b border-outline-variant/30 px-gutter-mobile py-space-md flex flex-col space-y-3 animate-in slide-in-from-top-3 duration-150 shadow-lg">
          <button
            onClick={() => navigate("/")}
            className="text-left py-2 px-3 rounded-lg font-title-md text-on-surface hover:bg-surface-container"
          >
            Home
          </button>
          <button
            onClick={() => navigate("/books")}
            className="text-left py-2 px-3 rounded-lg font-title-md text-on-surface hover:bg-surface-container"
          >
            Explore Catalog
          </button>
          <button
            onClick={() => navigate("/dashboard")}
            className="text-left py-2 px-3 rounded-lg font-title-md text-on-surface hover:bg-surface-container"
          >
            Member Dashboard
          </button>
          <button
            onClick={() => navigate("/admin/dashboard")}
            className="text-left py-2 px-3 rounded-lg font-title-md text-on-surface hover:bg-surface-container"
          >
            Admin Operations
          </button>

          <div className="pt-2 border-t border-outline-variant/20 flex flex-col gap-2">
            <div className="flex items-center justify-between p-2 rounded-lg bg-surface-container-low text-caption">
              <span className="font-semibold text-secondary">Simulated Role:</span>
              <select
                value={userRole}
                onChange={(e) => setUserRole(e.target.value)}
                className="bg-transparent font-semibold text-on-surface focus:outline-none"
              >
                <option value="guest">Guest</option>
                <option value="member">Member</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            {userRole === "guest" && (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => navigate("/login")}
                  className="py-2 text-center rounded-lg border border-outline font-title-md text-on-surface"
                >
                  Sign In
                </button>
                <button
                  onClick={() => navigate("/register")}
                  className="py-2 text-center rounded-lg bg-primary text-on-primary font-title-md"
                >
                  Join
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
