import React, { useState } from "react";
import { useLibrary } from "../../context/LibraryContext";
import { Input } from "../../components/forms/Input";
import { Select } from "../../components/forms/Select";
import { Textarea } from "../../components/forms/Textarea";
import { Button } from "../../components/common/Button";

export const AddBookPage = () => {
  const { categories, addBook } = useLibrary();

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    isbn: "",
    categoryId: categories[0]?.id || "CAT-01",
    ddc: "",
    publisher: "",
    year: new Date().getFullYear(),
    pages: 320,
    totalCopies: 3,
    shelfLocation: "Stack 2 · Row B-04",
    coverImage: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=600",
    synopsis: ""
  });

  const [error, setError] = useState("");

  const navigate = (path) => {
    window.location.hash = `#${path}`;
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!formData.title || !formData.author || !formData.isbn) {
      setError("Please fill in the required bibliographic fields (Title, Author, ISBN).");
      return;
    }

    addBook(formData);
    navigate("/admin/books");
  };

  const categoryOptions = categories.map((c) => ({
    value: c.id,
    label: c.name
  }));

  return (
    <div className="space-y-space-xl max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between pb-space-sm border-b border-outline-variant/20">
        <div>
          <h1 className="font-headline-xl text-headline-xl text-on-surface font-extrabold tracking-tight">
            Accession New Volume
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Register a new publication into the master archival collection.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => navigate("/admin/books")} icon="arrow_back">
          Back to Ledger
        </Button>
      </div>

      {/* Form Card */}
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
              placeholder="e.g. The Architecture of Open Source Applications"
              required
            />
            <Input
              label="Author(s) / Creator"
              id="author"
              value={formData.author}
              onChange={handleChange}
              placeholder="e.g. Amy Brown & Greg Wilson"
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
              required
            />
            <Input
              label="Standard ISBN"
              id="isbn"
              value={formData.isbn}
              onChange={handleChange}
              placeholder="e.g. 978-1234567890"
              required
            />
            <Input
              label="Dewey Decimal (DDC)"
              id="ddc"
              value={formData.ddc}
              onChange={handleChange}
              placeholder="e.g. 005.1 BRO"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-space-md">
            <Input
              label="Publisher"
              id="publisher"
              value={formData.publisher}
              onChange={handleChange}
              placeholder="e.g. MIT Press"
            />
            <Input
              label="Year of Publication"
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
              label="Copies in Stacks"
              id="totalCopies"
              type="number"
              min="1"
              value={formData.totalCopies}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
            <Input
              label="Physical Shelf Location"
              id="shelfLocation"
              value={formData.shelfLocation}
              onChange={handleChange}
              placeholder="e.g. Stack 2 · Row B-04"
              required
            />
            <Input
              label="Cover Image URL"
              id="coverImage"
              value={formData.coverImage}
              onChange={handleChange}
              placeholder="https://..."
            />
          </div>

          <Textarea
            label="Archival Abstract / Synopsis"
            id="synopsis"
            rows={4}
            value={formData.synopsis}
            onChange={handleChange}
            placeholder="Comprehensive description of the volume's subject matter and scholarly significance..."
          />

          <div className="pt-space-sm border-t border-outline-variant/20 flex items-center justify-end gap-space-sm">
            <Button variant="outline" size="md" onClick={() => navigate("/admin/books")}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="md" icon="add_box">
              Accession Volume
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
