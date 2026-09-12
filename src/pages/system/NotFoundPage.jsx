import React from "react";
import { Button } from "../../components/common/Button";

export default function NotFoundPage({ onNavigate }) {
  return (
    <div className="min-h-[75vh] flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-20 h-20 rounded-2xl bg-amber-50 text-amber-600 mx-auto flex items-center justify-center border border-amber-200 shadow-subtle">
          <span className="material-symbols-outlined text-4xl">search_off</span>
        </div>

        <div className="space-y-2">
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
            Error 404 · Uncatalogued Resource
          </span>
          <h1 className="font-serif text-3xl font-bold text-text-primary tracking-tight mt-3">
            Bibliographic Volume Not Found
          </h1>
          <p className="text-sm text-text-secondary leading-relaxed max-w-sm mx-auto">
            The shelf call number or route you are searching for does not match any accessioned document in the Heibook Digital Library Platform.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            variant="primary"
            icon="auto_stories"
            onClick={() => onNavigate && onNavigate("/catalog")}
          >
            Explore Catalog
          </Button>
          <Button
            variant="secondary"
            icon="home"
            onClick={() => onNavigate && onNavigate("/")}
          >
            Return to Beranda
          </Button>
        </div>

        <div className="pt-4 border-t border-surface-border text-xs text-text-muted">
          Need assistance tracking a misfiled volume? Inquire at the main reading room desk or search the full institutional index.
        </div>
      </div>
    </div>
  );
}
