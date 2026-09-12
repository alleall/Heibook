import React from "react";

export const StatusBadge = ({ status, className = "" }) => {
  const normalized = (status || "").toLowerCase();

  let config = {
    label: status,
    dotColor: "bg-gray-400",
    classes: "bg-surface-container text-on-surface ring-1 ring-outline/20"
  };

  if (normalized === "available" || normalized === "in stacks") {
    config = {
      label: "In Stacks",
      dotColor: "bg-emerald-600",
      classes: "bg-emerald-50 text-emerald-800 ring-1 ring-emerald-600/20"
    };
  } else if (normalized === "checked out" || normalized === "borrowed") {
    config = {
      label: "Borrowed",
      dotColor: "bg-blue-600",
      classes: "bg-blue-50 text-blue-800 ring-1 ring-blue-600/20"
    };
  } else if (normalized === "due soon") {
    config = {
      label: "Due Soon",
      dotColor: "bg-amber-600 animate-pulse",
      classes: "bg-amber-50 text-amber-900 ring-1 ring-amber-600/30"
    };
  } else if (normalized === "overdue") {
    config = {
      label: "Overdue",
      dotColor: "bg-error",
      classes: "bg-error-container text-error ring-1 ring-error/30"
    };
  } else if (normalized === "returned") {
    config = {
      label: "Returned",
      dotColor: "bg-slate-500",
      classes: "bg-slate-100 text-slate-700 ring-1 ring-slate-300/40"
    };
  } else if (normalized === "active") {
    config = {
      label: "Active",
      dotColor: "bg-emerald-600",
      classes: "bg-emerald-50 text-emerald-800 ring-1 ring-emerald-600/20"
    };
  } else if (normalized === "suspended") {
    config = {
      label: "Suspended",
      dotColor: "bg-error",
      classes: "bg-error-container text-error ring-1 ring-error/30"
    };
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-label-sm font-semibold tracking-wide ${config.classes} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dotColor}`} />
      <span>{config.label}</span>
    </span>
  );
};
