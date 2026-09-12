import React from "react";
import { Button } from "./Button";

export const EmptyState = ({
  icon = "auto_stories",
  title = "No records found",
  description = "There are no matching items to display in this view.",
  actionLabel = null,
  onAction = null,
  className = ""
}) => {
  return (
    <div
      className={`w-full py-space-2xl px-space-lg flex flex-col items-center justify-center text-center bg-surface-container-lowest rounded-2xl border border-dashed border-outline-variant/60 ${className}`}
    >
      <div className="w-14 h-14 rounded-2xl bg-surface-container flex items-center justify-center text-on-surface-variant mb-space-md">
        <span className="material-symbols-outlined text-[32px]">{icon}</span>
      </div>
      <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold max-w-md">
        {title}
      </h3>
      <p className="font-body-sm text-body-sm text-on-surface-variant max-w-sm mt-1 mb-space-lg">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button variant="secondary" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
