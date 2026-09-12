import React from "react";

export const NoticeBanner = ({
  icon = "info",
  title = "Member Lending Policy:",
  message = "Borrow up to 3 active books for a 7-day lending period. Due dates & automatic renewals are tracked in your Member Dashboard.",
  actionText = "Circulation Guidelines",
  onAction = null,
  className = ""
}) => {
  return (
    <div
      className={`flex items-center justify-between gap-space-md p-space-md rounded-xl bg-surface-container-high text-on-surface shadow-sm ${className}`}
    >
      <div className="flex items-center gap-space-sm min-w-0">
        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-secondary text-on-secondary flex items-center justify-center shadow-xs">
          <span className="material-symbols-outlined text-[18px]">{icon}</span>
        </div>
        <p className="font-body-sm text-body-sm text-on-surface leading-snug">
          <span className="font-title-md text-title-md font-semibold text-on-surface mr-1">
            {title}
          </span>
          {message}
        </p>
      </div>
      {actionText && (
        <button
          type="button"
          onClick={onAction}
          className="hidden sm:inline-flex items-center gap-1 font-label-md text-label-md text-secondary hover:text-[#7f2b00] transition-colors whitespace-nowrap font-medium select-none cursor-pointer flex-shrink-0"
        >
          <span>{actionText}</span>
          <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
        </button>
      )}
    </div>
  );
};
