import React, { useEffect } from "react";

export const Modal = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
  size = "md",
  className = ""
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-xl",
    lg: "max-w-3xl",
    xl: "max-w-5xl"
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Dimmed Backdrop */}
      <div
        className="fixed inset-0 bg-on-surface/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog Content */}
      <div
        className={`relative w-full ${sizeClasses[size] || sizeClasses.md} bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant/30 flex flex-col max-h-[90vh] overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150 ${className}`}
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="px-space-lg py-space-md border-b border-outline-variant/20 flex items-center justify-between gap-space-md bg-surface-container-low/50">
          <div>
            <h3 className="font-headline-sm text-headline-sm text-on-surface">{title}</h3>
            {subtitle && (
              <p className="font-caption text-caption text-on-surface-variant mt-0.5">{subtitle}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors"
            aria-label="Close dialog"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="px-space-lg py-space-md overflow-y-auto flex-1 font-body-md text-body-md text-on-surface">
          {children}
        </div>

        {/* Modal Footer */}
        {footer && (
          <div className="px-space-lg py-space-md border-t border-outline-variant/20 bg-surface-container-low/40 flex items-center justify-end gap-space-sm">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
