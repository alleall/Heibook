import React from "react";
import { useLibrary } from "../../context/LibraryContext";

export const ToastContainer = () => {
  const { toasts, removeToast } = useLibrary();

  if (toasts.length === 0) return null;

  const typeConfig = {
    success: {
      icon: "check_circle",
      bg: "bg-emerald-900 text-white",
      iconColor: "text-emerald-300",
      border: "border-emerald-700"
    },
    error: {
      icon: "error",
      bg: "bg-red-950 text-white",
      iconColor: "text-red-400",
      border: "border-red-800"
    },
    warning: {
      icon: "warning",
      bg: "bg-amber-950 text-white",
      iconColor: "text-amber-400",
      border: "border-amber-800"
    },
    info: {
      icon: "info",
      bg: "bg-surface-container-high text-on-surface",
      iconColor: "text-secondary",
      border: "border-outline-variant"
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((toast) => {
        const config = typeConfig[toast.type] || typeConfig.info;
        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl shadow-xl border ${config.bg} ${config.border} animate-in slide-in-from-bottom-5 duration-200`}
            role="alert"
          >
            <span className={`material-symbols-outlined text-[20px] flex-shrink-0 mt-0.5 ${config.iconColor}`}>
              {config.icon}
            </span>
            <div className="flex-1 min-w-0">
              <h4 className="font-title-md text-title-md font-semibold leading-tight">
                {toast.title}
              </h4>
              <p className="font-caption text-caption opacity-90 mt-0.5 leading-snug">
                {toast.message}
              </p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="flex-shrink-0 text-current opacity-60 hover:opacity-100 transition-opacity p-0.5"
              aria-label="Dismiss notification"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
        );
      })}
    </div>
  );
};
