import React from "react";

export const LoadingState = ({ message = "Loading library records...", height = "min-h-[280px]" }) => {
  return (
    <div className={`w-full ${height} flex flex-col items-center justify-center gap-space-sm bg-surface-container-lowest/50 rounded-2xl`}>
      <div className="w-10 h-10 border-3 border-secondary/20 border-t-secondary rounded-full animate-spin"></div>
      <p className="font-caption text-caption text-on-surface-variant animate-pulse font-medium">
        {message}
      </p>
    </div>
  );
};
