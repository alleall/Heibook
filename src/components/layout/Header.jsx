import React, { useState } from "react";
import { useLibrary } from "../../context/LibraryContext";
import memberImage from "../images/member.jpg";
import adminImage from "../images/admin.jpg";

export const Header = ({ onToggleSidebar }) => {
  const { currentUser, userRole, stats } = useLibrary();
  const [searchVal, setSearchVal] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchVal.trim()) {
      window.location.hash = `#/books?q=${encodeURIComponent(searchVal.trim())}`;
    }
  };

  return (
    <header className="fixed top-0 left-0 lg:left-72 right-0 h-16 bg-surface/85 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-outline-variant/20 z-40 px-gutter-mobile lg:px-gutter-desktop flex items-center justify-between gap-space-md">
      {/* Left: Mobile Toggle & Quick Catalog Search */}
      <div className="flex items-center gap-space-sm flex-1 max-w-lg">
        {/* Hamburger on Mobile */}
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-lg text-on-surface hover:bg-surface-container transition-colors"
          aria-label="Open navigation menu"
        >
          <span className="material-symbols-outlined text-[24px]">menu</span>
        </button>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="relative w-full flex items-center">
          <span className="material-symbols-outlined absolute left-space-sm text-on-surface-variant pointer-events-none text-[20px]">
            search
          </span>
          <input
            type="text"
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            placeholder="Search catalog title, author, ISBN (⌘K)..."
            className="w-full h-10 pl-10 pr-space-md bg-surface-container-lowest rounded-lg font-body-sm text-body-sm text-on-surface placeholder:text-outline-variant focus:outline-none focus:ring-1 focus:ring-secondary border border-transparent focus:border-secondary transition-all"
          />
        </form>
      </div>

      {/* Right: Notifications & User Profile */}
      <div className="flex items-center gap-space-sm sm:gap-space-md">
        {/* Notifications Icon Button */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors cursor-pointer"
            aria-label="View notifications"
          >
            <span className="material-symbols-outlined text-[22px]">notifications</span>
            {stats.overdueBooks > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-secondary ring-2 ring-surface animate-pulse" />
            )}
          </button>

          {/* Notifications Dropdown Card */}
          {showNotifications && (
            <div className="absolute right-0 top-12 w-80 bg-surface-container-lowest rounded-2xl shadow-xl border border-outline-variant/30 p-space-md space-y-space-sm z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between border-b border-outline-variant/20 pb-2">
                <span className="font-title-md text-title-md font-bold text-on-surface">
                  Circulation Notices
                </span>
                <span className="font-label-sm text-label-sm text-secondary font-semibold">
                  2 Unread
                </span>
              </div>
              <div className="space-y-2 text-caption">
                <div className="p-2 rounded-lg bg-surface-container-low flex items-start gap-2">
                  <span className="material-symbols-outlined text-secondary text-[18px]">info</span>
                  <div>
                    <strong className="block text-on-surface font-semibold">Due in 2 days</strong>
                    <span className="text-on-surface-variant">
                      "The Design of Everyday Things" due date is approaching.
                    </span>
                  </div>
                </div>
                <div className="p-2 rounded-lg bg-emerald-50 text-emerald-900 flex items-start gap-2">
                  <span className="material-symbols-outlined text-emerald-700 text-[18px]">verified</span>
                  <div>
                    <strong className="block font-semibold">New Additions</strong>
                    <span className="text-emerald-800">
                      12 new titles indexed in Computer Science stacks.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Identity Chip */}
        <div
          onClick={() => {
            window.location.hash = userRole === "admin" ? "#/admin/settings" : "#/profile";
          }}
          className="flex items-center gap-space-xs p-1 sm:pr-space-sm rounded-full sm:rounded-xl hover:bg-surface-container transition-colors cursor-pointer select-none"
        >
          <img
            alt={currentUser.name}
            src={currentUser.avatar || (userRole === "admin" ? adminImage : memberImage)}
            className="w-8 h-8 rounded-full object-cover ring-1 ring-outline-variant/30 flex-shrink-0"
            onError={(e) => {
              e.target.src = userRole === "admin" ? adminImage : memberImage;
            }}
          />
          <div className="hidden md:flex flex-col text-left">
            <span className="font-label-md text-label-md text-on-surface font-semibold leading-tight">
              {currentUser.name}
            </span>
            <span className="font-caption text-[11px] text-on-surface-variant leading-tight">
              {currentUser.title}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
