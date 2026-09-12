import React from "react";
import { StatusBadge } from "../common/StatusBadge";
import { Button } from "../common/Button";

export const BookCard = ({ book, onInspect, onBorrow }) => {
  return (
    <div className="group relative bg-surface-container-lowest rounded-2xl border border-outline-variant/30 hover:border-outline-variant/80 hover:shadow-xl transition-all duration-200 flex flex-col overflow-hidden">
      {/* Book Jacket Aspect Area */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-surface-container-low cursor-pointer" onClick={() => onInspect(book)}>
        <img
          src={book.coverImage}
          alt={book.title}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        {/* Category Pill Over Cover */}
        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-1 rounded-md font-label-sm text-label-sm font-semibold bg-primary-container/85 backdrop-blur-md text-on-primary shadow-xs">
            {book.categoryName}
          </span>
        </div>

        {/* Shelf Tag Pill */}
        <div className="absolute bottom-3 right-3">
          <span className="px-2 py-0.5 rounded font-caption text-caption bg-surface-container-lowest/90 backdrop-blur-md text-on-surface-variant font-mono shadow-xs">
            {book.ddc}
          </span>
        </div>
      </div>

      {/* Book Metadata Content */}
      <div className="p-space-md flex-1 flex flex-col justify-between gap-space-sm">
        <div className="space-y-1">
          <div className="flex items-center justify-between gap-space-xs">
            <span className="font-caption text-caption text-on-surface-variant">
              {book.year} · {book.pages} pp.
            </span>
            <div className="flex items-center gap-1 text-amber-600 font-label-sm text-label-sm font-bold">
              <span className="material-symbols-outlined text-[15px] fill-current">star</span>
              <span>{book.rating}</span>
            </div>
          </div>

          <h3
            onClick={() => onInspect(book)}
            className="font-title-md text-title-md font-bold text-on-surface group-hover:text-secondary transition-colors cursor-pointer line-clamp-2 leading-snug"
            title={book.title}
          >
            {book.title}
          </h3>
          <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-1">
            {book.author}
          </p>
        </div>

        {/* Status & Circulation Action */}
        <div className="pt-space-xs border-t border-outline-variant/20 flex items-center justify-between gap-space-xs">
          <div>
            <div className="font-caption text-caption text-on-surface-variant">
              {book.availableCopies > 0 ? (
                <span className="text-emerald-700 font-semibold">{book.availableCopies} in stacks</span>
              ) : (
                <span className="text-error font-semibold">0 in stacks</span>
              )}
            </div>
            <StatusBadge status={book.status} className="mt-0.5" />
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onInspect(book)}
              title="Inspect details"
              className="px-2 py-1.5"
            >
              <span className="material-symbols-outlined text-[18px]">visibility</span>
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => onBorrow(book)}
              disabled={book.availableCopies <= 0}
              className="px-3"
            >
              Borrow
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
