import React, { useState } from "react";
import { useLibrary } from "../../context/LibraryContext";
import { Button } from "../../components/common/Button";
import { StatusBadge } from "../../components/common/StatusBadge";
import { BookCard } from "../../components/books/BookCard";
import { BookDetailModal } from "../../components/books/BookDetailModal";

export const BookDetailPage = ({ bookId }) => {
  const { books, borrowBook, userRole } = useLibrary();
  const [selectedBook, setSelectedBook] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const book = books.find((b) => b.id === bookId) || books[0];

  const navigate = (path) => {
    window.location.hash = `#${path}`;
  };

  const handleBorrow = () => {
    borrowBook(book.id);
  };

  // Related titles in same category
  const relatedBooks = books
    .filter((b) => b.categoryId === book.categoryId && b.id !== book.id)
    .slice(0, 4);

  const isOutOfStock = book.availableCopies <= 0;

  return (
    <div className="max-w-max-content-width mx-auto px-gutter-mobile lg:px-gutter-desktop py-space-xl space-y-space-2xl">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-caption text-on-surface-variant">
        <button onClick={() => navigate("/")} className="hover:text-on-surface">Home</button>
        <span>/</span>
        <button onClick={() => navigate("/books")} className="hover:text-on-surface">Catalog</button>
        <span>/</span>
        <span className="text-on-surface font-semibold truncate max-w-xs">{book.title}</span>
      </div>

      {/* Main Bibliographic Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-2xl items-start">
        {/* Book Cover Showcase (4 cols) */}
        <div className="lg:col-span-4 space-y-space-md">
          <div className="aspect-[3/4] w-full rounded-2xl overflow-hidden shadow-2xl border border-outline-variant/30 bg-surface-container-low">
            <img
              src={book.coverImage}
              alt={book.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Stacks Physical Coordinates Card */}
          <div className="p-space-md rounded-2xl bg-surface-container-lowest border border-outline-variant/30 space-y-space-xs">
            <div className="flex items-center gap-space-xs font-label-sm text-label-sm text-secondary uppercase tracking-wider font-semibold">
              <span className="material-symbols-outlined text-[16px]">pin_drop</span>
              <span>Physical Stacks Coordinates</span>
            </div>
            <div className="space-y-1 text-caption text-on-surface-variant">
              <div className="flex justify-between py-1 border-b border-outline-variant/10">
                <span>Dewey Decimal Classification:</span>
                <span className="font-mono font-bold text-on-surface">{book.ddc}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-outline-variant/10">
                <span>Stack & Row:</span>
                <span className="font-bold text-on-surface">{book.shelfLocation}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-outline-variant/10">
                <span>Standard ISBN:</span>
                <span className="font-mono text-on-surface">{book.isbn}</span>
              </div>
              <div className="flex justify-between py-1">
                <span>Current Availability:</span>
                <span className="font-bold text-emerald-700">
                  {book.availableCopies} available of {book.totalCopies} copies
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Book Details & Circulation Panel (8 cols) */}
        <div className="lg:col-span-8 space-y-space-lg">
          <div className="space-y-space-2xs">
            <div className="flex flex-wrap items-center gap-space-xs mb-2">
              <span className="px-3 py-1 rounded-full font-label-sm text-label-sm font-semibold bg-secondary-fixed text-on-secondary-fixed">
                {book.categoryName}
              </span>
              <StatusBadge status={book.status} />
              <div className="flex items-center gap-1 text-amber-600 font-label-sm text-label-sm font-bold ml-2">
                <span className="material-symbols-outlined text-[16px] fill-current">star</span>
                <span>{book.rating}</span>
                <span className="text-on-surface-variant font-normal">({book.reviewsCount} reviews)</span>
              </div>
            </div>

            <h1 className="font-display-lg text-display-lg text-on-surface font-extrabold leading-tight">
              {book.title}
            </h1>
            <p className="font-headline-sm text-headline-sm text-secondary font-medium">
              By {book.author}
            </p>
          </div>

          {/* Quick Specifications Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-space-sm p-space-md rounded-2xl bg-surface-container-low border border-outline-variant/20 text-center">
            <div>
              <span className="font-caption text-caption text-on-surface-variant block">Publisher</span>
              <span className="font-title-md text-title-md font-bold text-on-surface">{book.publisher}</span>
            </div>
            <div>
              <span className="font-caption text-caption text-on-surface-variant block">Published Year</span>
              <span className="font-title-md text-title-md font-bold text-on-surface">{book.year}</span>
            </div>
            <div>
              <span className="font-caption text-caption text-on-surface-variant block">Page Length</span>
              <span className="font-title-md text-title-md font-bold text-on-surface">{book.pages} pp.</span>
            </div>
            <div>
              <span className="font-caption text-caption text-on-surface-variant block">Format</span>
              <span className="font-title-md text-title-md font-bold text-on-surface">Hardcover & Digital</span>
            </div>
          </div>

          {/* Synopsis */}
          <div className="space-y-2">
            <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
              Archival Abstract
            </h3>
            <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed text-justify">
              {book.synopsis}
            </p>
          </div>

          {/* Lending Policy Box & Direct Borrow CTA */}
          <div className="p-space-lg rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-md space-y-space-md">
            <div className="flex items-start gap-space-sm">
              <div className="w-10 h-10 rounded-xl bg-secondary text-on-secondary flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-[22px]">policy</span>
              </div>
              <div className="space-y-1">
                <h4 className="font-title-md text-title-md font-bold text-on-surface">
                  Lending Terms & Durations
                </h4>
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                  Borrow up to 3 active titles for 7 calendar days. Automatic renewal tracking in your member dashboard. Settle returns at the Main Circulation Stacks or automated East Drop Box.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-space-sm pt-2 border-t border-outline-variant/20">
              {userRole === "member" ? (
                <Button
                  variant="primary"
                  size="lg"
                  disabled={isOutOfStock}
                  onClick={handleBorrow}
                  icon="book"
                  className="px-8"
                >
                  {isOutOfStock ? "Out of Stock in Stacks" : "Borrow Volume Now"}
                </Button>
              ) : userRole === "guest" ? (
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => navigate("/login")}
                  icon="login"
                  className="px-8"
                >
                  Sign In to Borrow
                </Button>
              ) : (
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={() => navigate(`/admin/books/${book.id}/edit`)}
                  icon="edit"
                  className="px-8"
                >
                  Edit Master Record
                </Button>
              )}
              <Button variant="outline" size="lg" onClick={() => navigate("/books")}>
                Return to Catalog
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Related Titles Section */}
      {relatedBooks.length > 0 && (
        <div className="space-y-space-lg pt-space-xl border-t border-outline-variant/20">
          <div className="flex items-center justify-between">
            <h3 className="font-headline-md text-headline-md font-bold text-on-surface">
              More in {book.categoryName}
            </h3>
            <button
              onClick={() => navigate(`/books?cat=${book.categoryId}`)}
              className="font-title-md text-secondary hover:text-primary transition-colors flex items-center gap-1 font-semibold"
            >
              <span>Explore discipline</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-lg">
            {relatedBooks.map((rel) => (
              <BookCard
                key={rel.id}
                book={rel}
                onInspect={(b) => {
                  setSelectedBook(b);
                  setIsModalOpen(true);
                }}
                onBorrow={(b) => borrowBook(b.id)}
              />
            ))}
          </div>
        </div>
      )}

      {selectedBook && (
        <BookDetailModal
          book={selectedBook}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onBorrowConfirm={(b) => {
            borrowBook(b.id);
            setIsModalOpen(false);
          }}
        />
      )}
    </div>
  );
};
