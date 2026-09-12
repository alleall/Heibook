import React from "react";
import logoImage from "../images/heibook_logo.png";

export const PublicFooter = () => {
  const navigate = (path) => {
    window.location.hash = `#${path}`;
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="w-full bg-surface-container-low border-t border-outline-variant/30 pt-space-2xl pb-space-xl text-on-surface">
      <div className="max-w-max-content-width mx-auto px-gutter-desktop">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-space-xl pb-space-2xl border-b border-outline-variant/20">
          {/* Brand & Manifesto Column (5 cols) */}
          <div className="lg:col-span-5 space-y-space-md">
            <div className="flex items-center gap-space-sm cursor-pointer" onClick={() => navigate("/")}>
              <img
                src={logoImage}
                alt="Heibook Logo"
                className="w-8 h-8 rounded-lg object-contain"
              />
              <span className="font-title-md text-title-md font-bold text-on-surface">
                Heibook
              </span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant max-w-sm leading-relaxed">
              Curated lending institution and digital bibliotheca indexing over 1,200 physical and digitized masterworks across 8 core human disciplines.
            </p>
            <div className="flex items-center gap-space-sm font-label-sm text-label-sm text-secondary font-medium">
              <span className="flex h-2 w-2 rounded-full bg-emerald-600 animate-pulse"></span>
              <span>Physical Reading Stacks Open Daily · 08:00 – 21:00 WIB</span>
            </div>
          </div>

          {/* Quick Links Column 1: Archival Vault (2 cols) */}
          <div className="lg:col-span-2 space-y-space-sm">
            <h4 className="font-label-md text-label-md uppercase tracking-wider font-bold text-on-surface">
              Archival Vault
            </h4>
            <ul className="space-y-2 font-body-sm text-body-sm text-on-surface-variant">
              <li>
                <button onClick={() => navigate("/books")} className="hover:text-primary transition-colors">
                  Full Catalog
                </button>
              </li>
              <li>
                <button onClick={() => navigate("/books")} className="hover:text-primary transition-colors">
                  Design Systems
                </button>
              </li>
              <li>
                <button onClick={() => navigate("/books")} className="hover:text-primary transition-colors">
                  Computer Science
                </button>
              </li>
              <li>
                <button onClick={() => navigate("/books")} className="hover:text-primary transition-colors">
                  Data Architecture
                </button>
              </li>
            </ul>
          </div>

          {/* Quick Links Column 2: Lending Policy (3 cols) */}
          <div className="lg:col-span-3 space-y-space-sm">
            <h4 className="font-label-md text-label-md uppercase tracking-wider font-bold text-on-surface">
              Circulation Rules
            </h4>
            <ul className="space-y-2 font-body-sm text-body-sm text-on-surface-variant">
              <li>
                <span className="block font-medium text-on-surface">Maximum Quota: 3 Books</span>
                <span className="font-caption text-caption text-on-surface-variant/80">Active borrowing allowance per member</span>
              </li>
              <li>
                <span className="block font-medium text-on-surface">Duration: 7 Calendar Days</span>
                <span className="font-caption text-caption text-on-surface-variant/80">1 renewal allowed prior to due date</span>
              </li>
              <li>
                <span className="block font-medium text-on-surface">Overdue Fine: Rp1.000 / day</span>
                <span className="font-caption text-caption text-on-surface-variant/80">Standard administrative recovery fee</span>
              </li>
            </ul>
          </div>

          {/* Quick Links Column 3: Platform Portals (2 cols) */}
          <div className="lg:col-span-2 space-y-space-sm">
            <h4 className="font-label-md text-label-md uppercase tracking-wider font-bold text-on-surface">
              Member Desks
            </h4>
            <ul className="space-y-2 font-body-sm text-body-sm text-on-surface-variant">
              <li>
                <button onClick={() => navigate("/dashboard")} className="hover:text-primary transition-colors">
                  Member Portal
                </button>
              </li>
              <li>
                <button onClick={() => navigate("/my-loans")} className="hover:text-primary transition-colors">
                  My Borrowings
                </button>
              </li>
              <li>
                <button onClick={() => navigate("/history")} className="hover:text-primary transition-colors">
                  Loan History
                </button>
              </li>
              <li>
                <button onClick={() => navigate("/admin/dashboard")} className="hover:text-primary transition-colors">
                  Librarian Desk
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright & Sub-bar */}
        <div className="pt-space-lg flex flex-col sm:flex-row items-center justify-between gap-space-sm text-caption text-on-surface-variant">
          <p>© {new Date().getFullYear()} Heibook Digital Library Platform. All rights reserved.</p>
          <div className="flex items-center gap-space-md">
            <span className="hover:text-on-surface transition-colors cursor-pointer">Circulation Protocol</span>
            <span className="hover:text-on-surface transition-colors cursor-pointer">Academic Terms</span>
            <span className="hover:text-on-surface transition-colors cursor-pointer">Stacks Directory</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
