import React, { useState, useEffect } from "react";
import { useLibrary } from "../../context/LibraryContext";
import { Input } from "../../components/forms/Input";
import { Select } from "../../components/forms/Select";
import { Textarea } from "../../components/forms/Textarea";
import { Button } from "../../components/common/Button";

export const EditBookPage = ({ bookId }) => {
  const { books, categories, updateBook } = useLibrary();

  const book = books.find((b) => b.id === bookId) || books[0];

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    isbn: "",
    categoryId: "CAT-01",
    ddc: "",
    publisher: "",
    year: 2020,
    pages: 300,
    totalCopies: 1,
    shelfLocation: "",
    coverImage: "",
    synopsis: ""
  });

  const [error, setError] = useState("");

  const navigate = (path) => {
    window.location.hash = `#${path}`;
  };

  useEffect(() => {
    if (book) {
      setFormData({
        title: book.title,
        author: book.author,
        isbn: book.isbn,
        categoryId: book.categoryId,
        ddc: book.ddc,
        publisher: book.publisher,
        year: book.year,
        pages: book.pages,
        totalCopies: book.totalCopies,
        shelfLocation: book.shelfLocation,
        coverImage: book.coverImage,
        synopsis: book.synopsis
      });
    }
  }, [book]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!formData.title || !formData.author) {
      setError("Title and Author are required.");
      return;
    }

    const catName = categories.find((c) => c.id === formData.categoryId)?.name || book.categoryName;

    updateBook(book.id, {
      ...formData,
      categoryName: catName
    });

    navigate("/admin/books");
  };

  const categoryOptions = categories.map((c) => ({
    value: c.id,
    label: c.name
  }));

  return (
    <div className="space-y-space-xl max-w-4xl">
      <div className="flex items-center justify-between pb-space-sm border-b border-outline-variant/20">
        <div>
          <h1 className="font-headline-xl text-headline-xl text-on-surface font-extrabold tracking-tight">
            Edit Catalog Record
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Accession ID: <strong className="font-mono text-on-surface">{book.id}</strong>
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => navigate("/admin/books")} icon="arrow_back">
          Back to Ledger
        </Button>
      </div>

      <div className="p-6 sm:p-space-xl rounded-3xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs">
        <form onSubmit={handleSubmit} className="space-y-space-md">
          {error && (
            <div className="p-space-sm rounded-xl bg-error-container text-error text-caption flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">error</span>
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
            <Input
              label="Volume Title"
              id="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
            <Input
              label="Author(s) / Creator"
              id="author"
              value={formData.author}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-md">
            <Select
              label="Archival Discipline"
              id="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              options={categoryOptions}
            />
            <Input
              label="Standard ISBN"
              id="isbn"
              value={formData.isbn}
              onChange={handleChange}
              required
            />
            <Input
              label="Dewey Decimal (DDC)"
              id="ddc"
              value={formData.ddc}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-space-md">
            <Input
              label="Publisher"
              id="publisher"
              value={formData.publisher}
              onChange={handleChange}
            />
            <Input
              label="Year"
              id="year"
              type="number"
              value={formData.year}
              onChange={handleChange}
            />
            <Input
              label="Page Count"
              id="pages"
              type="number"
              value={formData.pages}
              onChange={handleChange}
            />
            <Input
              label="Total Stack Copies"
              id="totalCopies"
              type="number"
              min={book.borrowedCopies}
              value={formData.totalCopies}
              onChange={handleChange}
              helperText={`Min ${book.borrowedCopies} (${book.borrowedCopies} currently on loan)`}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
            <Input
              label="Physical Shelf Location"
              id="shelfLocation"
              value={formData.shelfLocation}
              onChange={handleChange}
              required
            />
            <Input
              label="Cover Image URL"
              id="coverImage"
              value={formData.coverImage}
              onChange={handleChange}
            />
          </div>

          <Textarea
            label="Archival Abstract / Synopsis"
            id="synopsis"
            rows={4}
            value={formData.synopsis}
            onChange={handleChange}
          />

          <div className="pt-space-sm border-t border-outline-variant/20 flex items-center justify-end gap-space-sm">
            <Button variant="outline" size="md" onClick={() => navigate("/admin/books")}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="md" icon="save">
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
