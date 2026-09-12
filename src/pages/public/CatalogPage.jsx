import React, { useState, useMemo, useEffect } from "react";
import { useLibrary } from "../../context/LibraryContext";
import { BookCard } from "../../components/books/BookCard";
import { BookFilterBar } from "../../components/books/BookFilterBar";
import { BookDetailModal } from "../../components/books/BookDetailModal";
import { NoticeBanner } from "../../components/common/NoticeBanner";
import { Pagination } from "../../components/common/Pagination";
import { EmptyState } from "../../components/common/EmptyState";

export const CatalogPage = () => {
  const { books, categories, stats, borrowBook } = useLibrary();

  // Filters state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [availabilityFilter, setAvailabilityFilter] = useState("all"); // "all" | "available"
  const [sortBy, setSortBy] = useState("featured"); // "featured" | "newest" | "title" | "rating" | "stock"
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // Selected book for modal
  const [selectedBook, setSelectedBook] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Parse URL query parameters if present (e.g. ?q=... or ?cat=...)
  useEffect(() => {
    const hash = window.location.hash;
    const queryPart = hash.includes("?") ? hash.split("?")[1] : "";
    if (queryPart) {
      const params = new URLSearchParams(queryPart);
      const q = params.get("q");
      const cat = params.get("cat");
      if (q) setSearchQuery(q);
      if (cat) setSelectedCategory(cat);
    }
  }, []);

  // Filtered and sorted books
  const filteredBooks = useMemo(() => {
    return books
      .filter((book) => {
        // Search match (title, author, ISBN)
        const q = searchQuery.toLowerCase().trim();
        const matchesSearch =
          !q ||
          book.title.toLowerCase().includes(q) ||
          book.author.toLowerCase().includes(q) ||
          book.isbn.toLowerCase().includes(q);

        // Category match
        const matchesCategory =
          selectedCategory === "all" || book.categoryId === selectedCategory;

        // Availability match
        const matchesAvailability =
          availabilityFilter === "all" ||
          (availabilityFilter === "available" && book.availableCopies > 0);

        return matchesSearch && matchesCategory && matchesAvailability;
      })
      .sort((a, b) => {
        if (sortBy === "featured") return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
        if (sortBy === "newest") return b.year - a.year;
        if (sortBy === "title") return a.title.localeCompare(b.title);
        if (sortBy === "rating") return b.rating - a.rating;
        if (sortBy === "stock") return b.availableCopies - a.availableCopies;
        return 0;
      });
  }, [books, searchQuery, selectedCategory, availabilityFilter, sortBy]);

  // Pagination slice
  const totalItems = filteredBooks.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const paginatedBooks = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredBooks.slice(start, start + pageSize);
  }, [filteredBooks, currentPage, pageSize]);

  const handleInspect = (book) => {
    setSelectedBook(book);
    setIsModalOpen(true);
  };

  const handleBorrow = (book) => {
    borrowBook(book.id);
  };

  return (
    <div className="max-w-max-content-width mx-auto px-gutter-mobile lg:px-gutter-desktop py-space-xl space-y-space-lg">
      {/* Informational Notice Banner */}
      <NoticeBanner
        title="Member Lending Policy:"
        message="Borrow up to 3 active books for a 7-day lending period. Due dates & automatic renewals are tracked in your Member Dashboard."
        actionText="Circulation Guidelines"
        onAction={() => {
          window.location.hash = "#/dashboard";
        }}
      />

      {/* Header & Exploration Hero Metric Bar */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-lg pb-space-sm border-b border-outline-variant/20">
        <div className="space-y-space-2xs">
          <div className="flex items-center gap-space-xs font-label-sm text-label-sm text-secondary uppercase tracking-widest font-semibold">
            <span className="material-symbols-outlined text-[16px]">local_library</span>
            <span>Curatorial Vault · Live Catalog</span>
          </div>
          <h1 className="font-display-lg text-display-lg tracking-tight text-on-surface font-extrabold">
            Explore Books
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl leading-relaxed">
            Browse our curated archival catalog of over 1,200 indexed volumes spanning 8 core human disciplines, rare editions, and seminal modern works.
          </p>
        </div>

        {/* Quick Stat Chips */}
        <div className="flex items-center gap-space-sm overflow-x-auto pb-1 lg:pb-0">
          <div className="flex items-center gap-space-sm px-space-md py-space-xs rounded-xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs">
            <span className="material-symbols-outlined text-secondary text-[22px]">auto_stories</span>
            <div>
              <div className="font-title-md text-title-md font-bold text-on-surface leading-none">
                {stats.totalCatalogTitles.toLocaleString()}
              </div>
              <div className="font-caption text-caption text-on-surface-variant">Archived Titles</div>
            </div>
          </div>

          <div className="flex items-center gap-space-sm px-space-md py-space-xs rounded-xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs">
            <span className="material-symbols-outlined text-emerald-700 text-[22px]">check_circle</span>
            <div>
              <div className="font-title-md text-title-md font-bold text-on-surface leading-none">
                {stats.inStacksCopies.toLocaleString()}
              </div>
              <div className="font-caption text-caption text-on-surface-variant">In Stacks</div>
            </div>
          </div>

          <div className="flex items-center gap-space-sm px-space-md py-space-xs rounded-xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs">
            <span className="material-symbols-outlined text-amber-700 text-[22px]">import_contacts</span>
            <div>
              <div className="font-title-md text-title-md font-bold text-on-surface leading-none">
                {stats.activeBorrowings.toLocaleString()}
              </div>
              <div className="font-caption text-caption text-on-surface-variant">On Loan</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <BookFilterBar
        searchQuery={searchQuery}
        onSearchChange={(val) => {
          setSearchQuery(val);
          setCurrentPage(1);
        }}
        selectedCategory={selectedCategory}
        onCategoryChange={(catId) => {
          setSelectedCategory(catId);
          setCurrentPage(1);
        }}
        categories={categories}
        availabilityFilter={availabilityFilter}
        onAvailabilityChange={(filter) => {
          setAvailabilityFilter(filter);
          setCurrentPage(1);
        }}
        sortBy={sortBy}
        onSortChange={(sort) => setSortBy(sort)}
        totalResults={filteredBooks.length}
      />

      {/* Catalog Results Grid */}
      {paginatedBooks.length > 0 ? (
        <div className="space-y-space-lg">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-space-lg">
            {paginatedBooks.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                onInspect={handleInspect}
                onBorrow={handleBorrow}
              />
            ))}
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            pageSize={pageSize}
            onPageChange={(p) => {
              setCurrentPage(p);
              window.scrollTo({ top: 300, behavior: "smooth" });
            }}
          />
        </div>
      ) : (
        <EmptyState
          icon="search_off"
          title="No titles match your criteria"
          description="Try broadening your keywords or removing discipline filters to view available stacks."
          actionLabel="Reset All Filters"
          onAction={() => {
            setSearchQuery("");
            setSelectedCategory("all");
            setAvailabilityFilter("all");
          }}
        />
      )}

      {/* Book Detail Modal */}
      {selectedBook && (
        <BookDetailModal
          book={selectedBook}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onBorrowConfirm={(b) => {
            handleBorrow(b);
            setIsModalOpen(false);
          }}
        />
      )}
    </div>
  );
};
