import React from "react";

export const Badge = ({
  children,
  variant = "default",
  size = "md",
  icon = null,
  className = ""
}) => {
  const sizeClasses = {
    sm: "text-label-sm px-2 py-0.5 gap-1",
    md: "text-label-md px-2.5 py-1 gap-1.5"
  };

  const variantClasses = {
    default: "bg-surface-container text-on-surface border border-outline-variant/40",
    primary: "bg-primary-container text-on-primary",
    secondary: "bg-secondary-fixed text-on-secondary-fixed border border-secondary/20",
    neutral: "bg-surface-container-low text-on-surface-variant",
    success: "bg-emerald-50 text-emerald-800 border border-emerald-200",
    warning: "bg-amber-50 text-amber-900 border border-amber-200",
    danger: "bg-error-container text-error border border-error/20"
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full ${sizeClasses[size] || sizeClasses.md} ${
        variantClasses[variant] || variantClasses.default
      } ${className}`}
    >
      {icon && <span className="material-symbols-outlined text-[14px]">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};
