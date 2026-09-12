import React, { useState } from "react";
import { useLibrary } from "../../context/LibraryContext";
import { StatusBadge } from "../../components/common/StatusBadge";
import { Button } from "../../components/common/Button";
import { EmptyState } from "../../components/common/EmptyState";

export const BorrowingHistoryPage = () => {
  const { borrowings, currentUser, borrowBook } = useLibrary();
  const [search, setSearch] = useState("");

  const navigate = (path) => {
    window.location.hash = `#${path}`;
  };

  const memberHistory = borrowings.filter(
    (b) => b.memberId === currentUser.memberId && b.status === "Returned"
  );

  const filteredHistory = memberHistory.filter((item) => {
    const q = search.toLowerCase();
    return (
      !q ||
      item.bookTitle.toLowerCase().includes(q) ||
      item.bookAuthor.toLowerCase().includes(q) ||
      item.id.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-space-lg">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-md pb-space-sm border-b border-outline-variant/20">
        <div>
          <h1 className="font-headline-xl text-headline-xl text-on-surface font-extrabold tracking-tight">
            Borrowing History
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Archival log of all previously borrowed and returned literature volumes.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => navigate("/books")} icon="search">
          Browse Catalog
        </Button>
      </div>

      {/* Search Input */}
      <div className="flex items-center gap-space-sm max-w-md bg-surface-container-lowest p-2 rounded-xl border border-outline-variant/30">
        <span className="material-symbols-outlined text-on-surface-variant pl-2 text-[20px]">
          search
        </span>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter history by title, author, or token ID..."
          className="w-full bg-transparent font-body-sm text-body-sm text-on-surface placeholder:text-outline focus:outline-none"
        />
        {search && (
          <button onClick={() => setSearch("")} className="text-on-surface-variant p-1">
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        )}
      </div>

      {/* History Table */}
      {filteredHistory.length > 0 ? (
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-xs overflow-hidden">
          <div className="overflow-x-auto table-scroll-container">
            <table className="w-full text-left font-body-sm text-body-sm">
              <thead className="bg-surface-container-low border-b border-outline-variant/20 font-label-md text-label-md text-on-surface uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3.5 px-4">Accession / Volume</th>
                  <th className="py-3.5 px-4">Borrowed</th>
                  <th className="py-3.5 px-4">Returned</th>
                  <th className="py-3.5 px-4">Shelf Location</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10 text-on-surface">
                {filteredHistory.map((item) => (
                  <tr key={item.id} className="hover:bg-surface-container-low/50 transition-colors">
                    <td className="py-3.5 px-4 flex items-center gap-3">
                      <img
                        src={item.bookCover}
                        alt={item.bookTitle}
                        className="w-10 h-14 rounded-md object-cover bg-surface-container shadow-xs flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="font-title-md text-title-md font-bold text-on-surface hover:text-secondary cursor-pointer truncate" onClick={() => navigate(`/books/${item.bookId}`)}>
                          {item.bookTitle}
                        </div>
                        <div className="font-caption text-caption text-on-surface-variant truncate">
                          {item.bookAuthor} · <span className="font-mono">{item.id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-caption text-on-surface-variant whitespace-nowrap">
                      {item.borrowDate}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-caption text-emerald-800 font-semibold whitespace-nowrap">
                      {item.returnDate || "Returned"}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-caption text-on-surface-variant whitespace-nowrap">
                      {item.shelfLocation}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <StatusBadge status="Returned" />
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <Button
                        variant="subtle"
                        size="sm"
                        onClick={() => borrowBook(item.bookId)}
                      >
                        Borrow Again
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <EmptyState
          icon="history"
          title="No completed borrowings recorded"
          description="Your past returned volumes and reading logs will appear here once returned to stacks."
          actionLabel="Explore Catalog"
          onAction={() => navigate("/books")}
        />
      )}
    </div>
  );
};
