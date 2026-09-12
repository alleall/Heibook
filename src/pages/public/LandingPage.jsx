import React, { useState } from "react";
import { useLibrary } from "../../context/LibraryContext";
import { BookCard } from "../../components/books/BookCard";
import { BookDetailModal } from "../../components/books/BookDetailModal";
import { Button } from "../../components/common/Button";

export const LandingPage = () => {
  const { books, categories, stats, borrowBook } = useLibrary();
  const [heroSearch, setHeroSearch] = useState("");
  const [selectedBook, setSelectedBook] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = (path) => {
    window.location.hash = `#${path}`;
  };

  const handleHeroSearch = (e) => {
    e.preventDefault();
    if (heroSearch.trim()) {
      navigate(`/books?q=${encodeURIComponent(heroSearch.trim())}`);
    } else {
      navigate("/books");
    }
  };

  const handleInspect = (book) => {
    setSelectedBook(book);
    setIsModalOpen(true);
  };

  const handleBorrow = (book) => {
    borrowBook(book.id);
  };

  const popularBooks = books.slice(0, 4);

  return (
    <div className="flex flex-col w-full">
      {/* Top Hero Architectural Section */}
      <section className="relative w-full overflow-hidden bg-gradient-to-b from-surface via-surface to-surface-container-low py-space-2xl md:py-space-3xl border-b border-outline-variant/20">
        <div className="max-w-max-content-width mx-auto px-gutter-desktop">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-center">
            {/* Left Column (7 cols) */}
            <div className="lg:col-span-7 flex flex-col space-y-space-lg">
              {/* Institution Pill */}
              <div className="inline-flex items-center gap-space-xs self-start bg-secondary-fixed text-on-secondary-fixed px-space-md py-1.5 rounded-full shadow-xs">
                <span className="material-symbols-outlined text-[16px]">verified</span>
                <span className="font-label-sm text-label-sm uppercase tracking-wider font-semibold">
                  Curated Lending Institution
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                <span className="font-label-sm text-label-sm font-semibold">
                  Over 1,200 Titles Available
                </span>
              </div>

              {/* Headlines */}
              <div className="space-y-space-xs">
                <h1 className="font-display-lg text-display-lg text-on-surface tracking-tight font-extrabold leading-[1.08]">
                  Find a book.<br />
                  <span className="text-secondary inline-block">Start a journey.</span>
                </h1>
                <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl pt-space-xs leading-relaxed">
                  Heibook lets curious minds discover, borrow, and manage physical and digitized masterworks seamlessly. Modern library access reimagined for scholars, designers, and systems thinkers.
                </p>
              </div>

              {/* Quick Live Search Shell */}
              <form
                onSubmit={handleHeroSearch}
                className="w-full max-w-xl bg-surface-container-lowest p-space-xs rounded-2xl shadow-lg border border-outline-variant/30 flex items-center gap-space-xs"
              >
                <div className="pl-space-sm flex items-center text-outline">
                  <span className="material-symbols-outlined text-[22px]">search</span>
                </div>
                <input
                  type="text"
                  value={heroSearch}
                  onChange={(e) => setHeroSearch(e.target.value)}
                  placeholder="Search by title, author, or ISBN..."
                  className="w-full bg-transparent font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none px-space-xs py-2"
                />
                <div className="hidden sm:flex items-center bg-surface-container-high px-space-xs py-1 rounded-md text-on-surface-variant font-label-sm text-label-sm font-medium">
                  ⌘K
                </div>
                <Button type="submit" variant="primary" size="md" icon="arrow_forward" iconPosition="right">
                  Find
                </Button>
              </form>

              {/* Guarantees & Actions */}
              <div className="flex flex-wrap items-center gap-space-md pt-space-xs">
                <Button variant="secondary" size="md" onClick={() => navigate("/books")} icon="auto_stories">
                  Explore Full Catalog
                </Button>
                <Button variant="outline" size="md" onClick={() => navigate("/dashboard")} icon="login">
                  Member Portal
                </Button>
              </div>
            </div>

            {/* Right Column: Architectural Book Jacket Showcase (5 cols) */}
            <div className="lg:col-span-5 relative flex justify-center items-center py-6">
              <div className="relative w-full max-w-sm flex gap-4">
                {/* Book Jacket 1 */}
                <div className="w-1/2 flex flex-col gap-3">
                  <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border border-outline-variant/40 bg-surface-container-low transform -rotate-2 hover:rotate-0 transition-transform duration-300">
                    <img
                      src={books[0]?.coverImage}
                      alt={books[0]?.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {/* Floating Micro Status Pill */}
                  <div className="p-2.5 rounded-xl bg-surface-container-lowest shadow-md border border-outline-variant/30 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
                    <span className="font-caption text-caption text-on-surface font-semibold">
                      In Stacks · Stack 3
                    </span>
                  </div>
                </div>

                {/* Book Jacket 2 */}
                <div className="w-1/2 flex flex-col gap-3 pt-8">
                  <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border border-outline-variant/40 bg-surface-container-low transform rotate-3 hover:rotate-0 transition-transform duration-300">
                    <img
                      src={books[1]?.coverImage}
                      alt={books[1]?.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {/* Floating Active Borrowers Card */}
                  <div className="p-3 rounded-xl bg-primary text-on-primary shadow-lg space-y-1">
                    <div className="font-label-sm text-[10px] uppercase tracking-wider text-secondary-fixed">
                      Live Circulation
                    </div>
                    <div className="font-title-md text-title-md font-bold leading-tight">
                      {stats.activeBorrowings} Active Loans
                    </div>
                    <div className="font-caption text-[11px] opacity-80">
                      7-day lending protocol
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Ribbon Section */}
      <section className="w-full bg-surface-container-low py-space-lg shadow-xs border-b border-outline-variant/20">
        <div className="max-w-max-content-width mx-auto px-gutter-desktop">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-space-md divide-y lg:divide-y-0 lg:divide-x divide-outline-variant/30">
            <div className="flex items-center gap-space-md p-space-xs">
              <div className="w-12 h-12 rounded-xl bg-surface-container-lowest flex items-center justify-center text-secondary shadow-xs">
                <span className="material-symbols-outlined text-[26px]">menu_book</span>
              </div>
              <div>
                <div className="font-headline-md text-headline-md font-extrabold text-on-surface">
                  {stats.totalCatalogTitles.toLocaleString()}
                </div>
                <div className="font-body-sm text-body-sm text-on-surface-variant">
                  Archived Titles
                </div>
              </div>
            </div>

            <div className="flex items-center gap-space-md p-space-xs pt-space-md lg:pt-0 lg:pl-space-md">
              <div className="w-12 h-12 rounded-xl bg-surface-container-lowest flex items-center justify-center text-emerald-700 shadow-xs">
                <span className="material-symbols-outlined text-[26px]">library_books</span>
              </div>
              <div>
                <div className="font-headline-md text-headline-md font-extrabold text-on-surface">
                  {stats.inStacksCopies.toLocaleString()}
                </div>
                <div className="font-body-sm text-body-sm text-on-surface-variant">
                  Copies in Stacks
                </div>
              </div>
            </div>

            <div className="flex items-center gap-space-md p-space-xs pt-space-md lg:pt-0 lg:pl-space-md">
              <div className="w-12 h-12 rounded-xl bg-surface-container-lowest flex items-center justify-center text-primary shadow-xs">
                <span className="material-symbols-outlined text-[26px]">groups</span>
              </div>
              <div>
                <div className="font-headline-md text-headline-md font-extrabold text-on-surface">
                  {stats.registeredMembers.toLocaleString()}
                </div>
                <div className="font-body-sm text-body-sm text-on-surface-variant">
                  Registered Scholars
                </div>
              </div>
            </div>

            <div className="flex items-center gap-space-md p-space-xs pt-space-md lg:pt-0 lg:pl-space-md">
              <div className="w-12 h-12 rounded-xl bg-surface-container-lowest flex items-center justify-center text-amber-700 shadow-xs">
                <span className="material-symbols-outlined text-[26px]">assignment_turned_in</span>
              </div>
              <div>
                <div className="font-headline-md text-headline-md font-extrabold text-on-surface">
                  {stats.activeBorrowings.toLocaleString()}
                </div>
                <div className="font-body-sm text-body-sm text-on-surface-variant">
                  Active Circulations
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Books Grid Section */}
      <section className="w-full py-space-3xl bg-surface">
        <div className="max-w-max-content-width mx-auto px-gutter-desktop space-y-space-xl">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md">
            <div>
              <div className="flex items-center gap-space-xs text-secondary font-label-sm text-label-sm uppercase tracking-widest font-semibold mb-1">
                <span className="material-symbols-outlined text-[16px]">stars</span>
                <span>Curatorial Highlights</span>
              </div>
              <h2 className="font-headline-xl text-headline-xl text-on-surface font-extrabold">
                Essential Volumes for Modern Inquirers
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl mt-1">
                Foundational treatises in software craftsmanship, cognitive interaction, and distributed architecture selected by our archival board.
              </p>
            </div>
            <Button variant="outline" size="md" onClick={() => navigate("/books")} icon="arrow_forward" iconPosition="right">
              View All Volumes
            </Button>
          </div>

          {/* Book Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-lg">
            {popularBooks.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                onInspect={handleInspect}
                onBorrow={handleBorrow}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Browse by Category Section */}
      <section className="w-full py-space-3xl bg-surface-container-low border-t border-outline-variant/20">
        <div className="max-w-max-content-width mx-auto px-gutter-desktop space-y-space-xl">
          <div className="text-center max-w-2xl mx-auto space-y-space-xs">
            <span className="font-label-sm text-label-sm uppercase tracking-widest text-secondary font-semibold">
              Archival Taxonomies
            </span>
            <h2 className="font-headline-xl text-headline-xl text-on-surface font-extrabold">
              Indexed Across 8 Core Disciplines
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              From hardware theory to civilizational history, explore rigorous catalogs cataloged under universal Dewey Decimal classifications.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
            {categories.map((cat) => (
              <div
                key={cat.id}
                onClick={() => navigate(`/books?cat=${cat.id}`)}
                className="group p-space-lg rounded-2xl bg-surface-container-lowest border border-outline-variant/30 hover:border-secondary/40 hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-space-sm">
                  <div className="w-12 h-12 rounded-xl bg-surface-container group-hover:bg-secondary-fixed group-hover:text-on-secondary-fixed text-on-surface transition-colors flex items-center justify-center">
                    <span className="material-symbols-outlined text-[24px]">{cat.icon}</span>
                  </div>
                  <span className="font-caption text-caption text-on-surface-variant font-mono">
                    {cat.count} titles
                  </span>
                </div>
                <div>
                  <h3 className="font-title-md text-title-md font-bold text-on-surface group-hover:text-secondary transition-colors">
                    {cat.name}
                  </h3>
                  <p className="font-caption text-caption text-on-surface-variant mt-1 line-clamp-2">
                    {cat.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="w-full py-space-2xl bg-primary text-on-primary">
        <div className="max-w-max-content-width mx-auto px-gutter-desktop flex flex-col lg:flex-row items-center justify-between gap-space-lg">
          <div className="space-y-space-xs text-center lg:text-left">
            <h2 className="font-headline-xl text-headline-xl font-extrabold text-white">
              Ready to access the bibliotheca stacks?
            </h2>
            <p className="font-body-lg text-body-lg opacity-80 max-w-xl">
              Register as a scholar patron to borrow up to 3 active volumes with 7-day lending periods and automatic renewal tracking.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-space-sm">
            <button
              onClick={() => navigate("/register")}
              className="px-space-xl py-space-sm rounded-xl font-title-md text-title-md font-bold bg-secondary text-white hover:bg-[#8b350c] transition-colors shadow-md"
            >
              Join Heibook Registry
            </button>
            <button
              onClick={() => navigate("/login")}
              className="px-space-lg py-space-sm rounded-xl font-title-md text-title-md font-semibold bg-white/10 text-white hover:bg-white/20 transition-colors"
            >
              Sign In to Account
            </button>
          </div>
        </div>
      </section>

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
