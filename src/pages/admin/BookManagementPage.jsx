import React, { useState, useMemo } from "react";
import { useLibrary } from "../../context/LibraryContext";
import { StatusBadge } from "../../components/common/StatusBadge";
import { Button } from "../../components/common/Button";
import { ConfirmDialog } from "../../components/common/ConfirmDialog";
import { Pagination } from "../../components/common/Pagination";
import { EmptyState } from "../../components/common/EmptyState";
import { BookDetailModal } from "../../components/books/BookDetailModal";

export const BookManagementPage = () => {
  const { books, categories, deleteBook, borrowBook } = useLibrary();

  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState("all");
  const [deleteBookId, setDeleteBookId] = useState(null);
  const [inspectBook, setInspectBook] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const navigate = (path) => {
    window.location.hash = `#${path}`;
  };

  const filteredBooks = useMemo(() => {
    return books.filter((b) => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        b.title.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q) ||
        b.isbn.toLowerCase().includes(q) ||
        b.id.toLowerCase().includes(q);
      const matchCat = selectedCat === "all" || b.categoryId === selectedCat;
      return matchSearch && matchCat;
    });
  }, [books, search, selectedCat]);

  const totalPages = Math.ceil(filteredBooks.length / pageSize);
  const paginatedBooks = filteredBooks.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleDeleteConfirm = () => {
    if (deleteBookId) {
      deleteBook(deleteBookId);
      setDeleteBookId(null);
    }
  };

  return (
    <div className="space-y-space-lg">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-md pb-space-sm border-b border-outline-variant/20">
        <div>
          <h1 className="font-headline-xl text-headline-xl text-on-surface font-extrabold tracking-tight">
            Catalog Ledger & Accessions
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Manage bibliotheca inventory, bibliographic classifications, and shelf assignments.
          </p>
        </div>

        <Button variant="primary" size="sm" onClick={() => navigate("/admin/books/create")} icon="add_box">
          Accession New Title
        </Button>
      </div>

      {/* Filter and Search Ribbon */}
      <div className="flex flex-col sm:flex-row items-center gap-space-sm justify-between bg-surface-container-lowest p-space-sm rounded-2xl border border-outline-variant/30">
        <div className="relative w-full sm:max-w-md flex items-center">
          <span className="material-symbols-outlined absolute left-3 text-on-surface-variant pointer-events-none text-[20px]">
            search
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search titles, authors, ISBN, or accession ID..."
            className="w-full h-10 pl-10 pr-4 bg-surface-container-low rounded-xl font-body-sm text-body-sm text-on-surface placeholder:text-outline focus:outline-none focus:ring-1 focus:ring-secondary"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={selectedCat}
            onChange={(e) => {
              setSelectedCat(e.target.value);
              setCurrentPage(1);
            }}
            className="h-10 px-3 bg-surface-container-low rounded-xl font-body-sm text-body-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-secondary cursor-pointer"
          >
            <option value="all">All Disciplines</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Catalog Table */}
      {paginatedBooks.length > 0 ? (
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-xs overflow-hidden">
          <div className="overflow-x-auto table-scroll-container">
            <table className="w-full text-left font-body-sm text-body-sm">
              <thead className="bg-surface-container-low border-b border-outline-variant/20 font-label-md text-label-md text-on-surface uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3.5 px-4">Title & Accession</th>
                  <th className="py-3.5 px-4">Discipline</th>
                  <th className="py-3.5 px-4">Classification</th>
                  <th className="py-3.5 px-4">Stack Copies</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10 text-on-surface">
                {paginatedBooks.map((book) => (
                  <tr key={book.id} className="hover:bg-surface-container-low/40 transition-colors">
                    <td className="py-3.5 px-4 flex items-center gap-3">
                      <img
                        src={book.coverImage}
                        alt={book.title}
                        className="w-10 h-14 rounded-md object-cover bg-surface-container shadow-xs flex-shrink-0 cursor-pointer"
                        onClick={() => setInspectBook(book)}
                      />
                      <div className="min-w-0">
                        <div
                          className="font-title-md text-title-md font-bold text-on-surface hover:text-secondary cursor-pointer truncate max-w-xs"
                          onClick={() => setInspectBook(book)}
                          title={book.title}
                        >
                          {book.title}
                        </div>
                        <div className="font-caption text-caption text-on-surface-variant truncate">
                          {book.author} · <span className="font-mono">{book.id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="font-caption text-caption px-2 py-0.5 rounded bg-surface-container text-on-surface font-medium">
                        {book.categoryName}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-caption whitespace-nowrap">
                      <div className="font-bold text-on-surface">{book.ddc}</div>
                      <div className="text-on-surface-variant text-[11px]">{book.shelfLocation}</div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="font-bold text-on-surface">{book.availableCopies}</span>{" "}
                      <span className="text-caption text-on-surface-variant">/ {book.totalCopies}</span>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <StatusBadge status={book.status} />
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap space-x-1">
                      <Button
                        variant="subtle"
                        size="sm"
                        onClick={() => setInspectBook(book)}
                        title="View bibliographic record"
                        className="px-2"
                      >
                        <span className="material-symbols-outlined text-[18px]">visibility</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/admin/books/${book.id}/edit`)}
                        title="Edit catalog record"
                        className="px-2"
                      >
                        <span className="material-symbols-outlined text-[18px]">edit</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteBookId(book.id)}
                        title="Delete from active ledger"
                        className="px-2 text-error hover:bg-error-container hover:text-error"
                      >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 border-t border-outline-variant/20">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredBooks.length}
              pageSize={pageSize}
              onPageChange={(p) => setCurrentPage(p)}
            />
          </div>
        </div>
      ) : (
        <EmptyState
          icon="menu_book"
          title="No titles match your ledger filter"
          description="Adjust your search keywords or discipline selector."
          actionLabel="Add New Title"
          onAction={() => navigate("/admin/books/create")}
        />
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={!!deleteBookId}
        onClose={() => setDeleteBookId(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Catalog Record"
        message="Are you sure you want to remove this title from the master accession ledger? Note: books with active loans cannot be deleted."
        confirmText="Confirm Delete"
        cancelText="Cancel"
        variant="danger"
        icon="delete"
      />

      {/* Book Detail Modal */}
      {inspectBook && (
        <BookDetailModal
          book={inspectBook}
          isOpen={!!inspectBook}
          onClose={() => setInspectBook(null)}
          onBorrowConfirm={(b) => {
            borrowBook(b.id);
            setInspectBook(null);
          }}
        />
      )}
    </div>
  );
};
