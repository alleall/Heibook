import React from "react";
import { Modal } from "../common/Modal";
import { Button } from "../common/Button";
import { StatusBadge } from "../common/StatusBadge";
import { useLibrary } from "../../context/LibraryContext";

export const BookDetailModal = ({ book, isOpen, onClose, onBorrowConfirm }) => {
  const { userRole, currentUser } = useLibrary();

  if (!book) return null;

  const isOutOfStock = book.availableCopies <= 0;
  const isMember = userRole === "member";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Bibliographic Record"
      subtitle={`Accession ID: ${book.id}`}
      size="lg"
      footer={
        <>
          <Button variant="outline" size="md" onClick={onClose}>
            Close
          </Button>
          {isMember ? (
            <Button
              variant="primary"
              size="md"
              disabled={isOutOfStock}
              onClick={() => {
                onBorrowConfirm(book);
              }}
              icon="book"
            >
              {isOutOfStock ? "Out of Stock" : "Borrow This Book"}
            </Button>
          ) : userRole === "guest" ? (
            <Button
              variant="primary"
              size="md"
              onClick={() => {
                window.location.hash = "#/login";
                onClose();
              }}
              icon="login"
            >
              Sign In to Borrow
            </Button>
          ) : (
            <Button
              variant="secondary"
              size="md"
              onClick={() => {
                window.location.hash = `#/admin/books/${book.id}/edit`;
                onClose();
              }}
              icon="edit"
            >
              Edit Catalog Record
            </Button>
          )}
        </>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-space-lg items-start">
        {/* Left Column: Book Jacket & Shelf Info (5 cols) */}
        <div className="md:col-span-5 flex flex-col gap-space-md">
          <div className="aspect-[3/4] w-full rounded-2xl overflow-hidden bg-surface-container-low shadow-md border border-outline-variant/30">
            <img
              src={book.coverImage}
              alt={book.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Quick Stack Card */}
          <div className="p-space-md rounded-xl bg-surface-container-low border border-outline-variant/30 space-y-2 text-caption">
            <div className="flex items-center justify-between">
              <span className="text-on-surface-variant font-medium">Shelf Location:</span>
              <span className="font-bold text-on-surface font-mono">{book.shelfLocation}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-on-surface-variant font-medium">DDC Call Number:</span>
              <span className="font-bold text-on-surface font-mono">{book.ddc}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-on-surface-variant font-medium">Catalog Copies:</span>
              <span className="font-bold text-on-surface">
                {book.availableCopies} available / {book.totalCopies} total
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Bibliographic Metadata & Synopsis (7 cols) */}
        <div className="md:col-span-7 flex flex-col space-y-space-md">
          <div>
            <div className="flex items-center gap-space-xs mb-1">
              <span className="px-2.5 py-0.5 rounded-full font-label-sm text-label-sm font-semibold bg-secondary-fixed text-on-secondary-fixed">
                {book.categoryName}
              </span>
              <StatusBadge status={book.status} />
            </div>
            <h2 className="font-headline-md text-headline-md font-bold text-on-surface leading-snug">
              {book.title}
            </h2>
            <p className="font-title-md text-title-md text-secondary font-medium mt-1">
              {book.author}
            </p>
          </div>

          {/* Specification Pill Grid */}
          <div className="grid grid-cols-2 gap-2 text-caption bg-surface-container-lowest p-space-sm rounded-xl border border-outline-variant/30">
            <div>
              <span className="text-on-surface-variant block">Publisher:</span>
              <span className="font-semibold text-on-surface">{book.publisher}</span>
            </div>
            <div>
              <span className="text-on-surface-variant block">Year & Length:</span>
              <span className="font-semibold text-on-surface">{book.year} · {book.pages} pages</span>
            </div>
            <div>
              <span className="text-on-surface-variant block">Standard ISBN:</span>
              <span className="font-mono text-on-surface text-xs">{book.isbn}</span>
            </div>
            <div>
              <span className="text-on-surface-variant block">Reader Rating:</span>
              <span className="font-bold text-amber-600 flex items-center gap-0.5">
                ★ {book.rating} ({book.reviewsCount} logs)
              </span>
            </div>
          </div>

          {/* Synopsis */}
          <div>
            <h4 className="font-label-md text-label-md uppercase tracking-wider text-on-surface-variant font-semibold mb-1">
              Archival Synopsis
            </h4>
            <p className="font-body-md text-body-md text-on-surface leading-relaxed text-justify">
              {book.synopsis}
            </p>
          </div>

          {/* Lending Policy Notice */}
          <div className="p-space-sm rounded-xl bg-surface-container flex items-start gap-space-xs text-caption text-on-surface">
            <span className="material-symbols-outlined text-secondary text-[18px] flex-shrink-0 mt-0.5">
              policy
            </span>
            <p className="leading-snug">
              <strong className="font-semibold">Circulation Rule:</strong> Borrowing period is 7 calendar days with a maximum quota of 3 active titles. One renewal allowed before due date.
            </p>
          </div>
        </div>
      </div>
    </Modal>
  );
};
