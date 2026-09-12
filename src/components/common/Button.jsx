import React from "react";

export const Button = ({
  children,
  variant = "primary",
  size = "md",
  icon = null,
  iconPosition = "left",
  loading = false,
  disabled = false,
  fullWidth = false,
  className = "",
  onClick,
  type = "button",
  ...props
}) => {
  const baseClasses =
    "inline-flex items-center justify-center font-title-md font-semibold transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-1 select-none disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer";

  const sizeClasses = {
    sm: "px-space-sm py-1.5 text-label-md rounded-lg gap-space-2xs",
    md: "px-space-md py-space-xs text-title-md rounded-lg gap-space-xs",
    lg: "px-space-lg py-space-sm text-title-md rounded-xl gap-space-sm"
  };

  const variantClasses = {
    primary:
      "bg-primary text-on-primary hover:bg-secondary focus:ring-secondary shadow-sm active:scale-[0.98]",
    secondary:
      "bg-secondary text-on-secondary hover:bg-[#8b350c] focus:ring-secondary shadow-sm active:scale-[0.98]",
    outline:
      "bg-transparent text-on-surface border border-outline hover:bg-surface-container focus:ring-primary active:scale-[0.98]",
    ghost:
      "bg-transparent text-on-surface hover:bg-surface-container hover:text-primary focus:ring-primary",
    danger:
      "bg-error text-on-error hover:bg-[#9f1515] focus:ring-error shadow-sm active:scale-[0.98]",
    subtle:
      "bg-surface-container text-on-surface hover:bg-surface-container-high focus:ring-outline"
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${baseClasses} ${sizeClasses[size] || sizeClasses.md} ${
        variantClasses[variant] || variantClasses.primary
      } ${fullWidth ? "w-full" : ""} ${className}`}
      {...props}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
      ) : (
        icon &&
        iconPosition === "left" && (
          <span className="material-symbols-outlined text-[18px]">{icon}</span>
        )
      )}
      <span>{children}</span>
      {!loading && icon && iconPosition === "right" && (
        <span className="material-symbols-outlined text-[18px]">{icon}</span>
      )}
    </button>
  );
};
