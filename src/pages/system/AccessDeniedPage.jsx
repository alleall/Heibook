import React from "react";
import { useLibrary } from "../../context/LibraryContext";
import { Button } from "../../components/common/Button";

export default function AccessDeniedPage({ onNavigate }) {
  const { userRole, setUserRole } = useLibrary();

  const handleElevateToAdmin = () => {
    setUserRole("admin");
    if (onNavigate) onNavigate("/admin");
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-20 h-20 rounded-2xl bg-rose-50 text-rose-600 mx-auto flex items-center justify-center border border-rose-200 shadow-subtle">
          <span className="material-symbols-outlined text-4xl">lock</span>
        </div>

        <div className="space-y-2">
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
            Error 403 · Access Denied
          </span>
          <h1 className="font-serif text-3xl font-bold text-text-primary tracking-tight mt-3">
            Restricted Archival Ledger
          </h1>
          <p className="text-sm text-text-secondary leading-relaxed max-w-sm mx-auto">
            You do not possess the necessary institutional archivist clearances to inspect this administrative console. Current active session role:{" "}
            <span className="font-semibold text-text-primary uppercase font-mono">{userRole}</span>.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            variant="primary"
            icon="admin_panel_settings"
            onClick={handleElevateToAdmin}
          >
            Switch to Admin Persona
          </Button>
          <Button
            variant="secondary"
            icon="arrow_back"
            onClick={() => onNavigate && onNavigate("/catalog")}
          >
            Return to Catalog
          </Button>
        </div>

        <div className="pt-4 border-t border-surface-border text-xs text-text-muted">
          Need archival research credentials? Contact the chief librarian desk at{" "}
          <span className="font-mono text-text-secondary">librarian@heibook.ac.id</span>.
        </div>
      </div>
    </div>
  );
}
