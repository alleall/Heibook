import React from "react";

export const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  pageSize = 10,
  onPageChange
}) => {
  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-space-sm pt-space-md border-t border-outline-variant/30 text-caption text-on-surface-variant">
      <div>
        Showing <span className="font-semibold text-on-surface">{startItem}</span> to{" "}
        <span className="font-semibold text-on-surface">{endItem}</span> of{" "}
        <span className="font-semibold text-on-surface">{totalItems}</span> entries
      </div>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="px-2.5 py-1 rounded-lg border border-outline-variant/60 text-on-surface hover:bg-surface-container disabled:opacity-40 disabled:pointer-events-none transition-colors"
        >
          <span className="material-symbols-outlined text-[16px]">chevron_left</span>
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-8 h-8 rounded-lg font-label-md text-label-md transition-colors ${
              currentPage === page
                ? "bg-primary text-on-primary font-bold shadow-xs"
                : "text-on-surface-variant hover:bg-surface-container"
            }`}
          >
            {page}
          </button>
        ))}
        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="px-2.5 py-1 rounded-lg border border-outline-variant/60 text-on-surface hover:bg-surface-container disabled:opacity-40 disabled:pointer-events-none transition-colors"
        >
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
        </button>
      </div>
    </div>
  );
};
