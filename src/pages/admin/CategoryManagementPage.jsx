import React, { useState, useMemo } from "react";
import { useLibrary } from "../../context/LibraryContext";
import { Button } from "../../components/common/Button";
import { Input } from "../../components/forms/Input";
import { Textarea } from "../../components/forms/Textarea";
import { Modal } from "../../components/common/Modal";
import { ConfirmDialog } from "../../components/common/ConfirmDialog";
import { EmptyState } from "../../components/common/EmptyState";

const AVAILABLE_ICONS = [
  "devices",
  "palette",
  "database",
  "psychology",
  "menu_book",
  "biotech",
  "history_edu",
  "public",
  "school",
  "science",
  "calculate",
  "architecture"
];

export default function CategoryManagementPage({ onNavigate }) {
  const { categories, books, addCategory, updateCategory, deleteCategory } = useLibrary();

  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [deletingCategoryId, setDeletingCategoryId] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    icon: "menu_book",
    description: ""
  });
  const [errors, setErrors] = useState({});

  // Filtered categories
  const filteredCategories = useMemo(() => {
    return categories.filter((cat) => {
      const matchName = cat.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchDesc = cat.description?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchName || matchDesc;
    });
  }, [categories, searchQuery]);

  // Statistics
  const totalCategoryTitles = useMemo(() => {
    return categories.reduce((sum, c) => sum + (c.count || 0), 0);
  }, [categories]);

  const topCategory = useMemo(() => {
    if (!categories.length) return null;
    return [...categories].sort((a, b) => (b.count || 0) - (a.count || 0))[0];
  }, [categories]);

  const handleOpenAdd = () => {
    setFormData({ name: "", icon: "menu_book", description: "" });
    setErrors({});
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      icon: category.icon || "menu_book",
      description: category.description || ""
    });
    setErrors({});
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Category name is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveAdd = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    addCategory({
      name: formData.name.trim(),
      icon: formData.icon,
      description: formData.description.trim()
    });

    setIsAddModalOpen(false);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!validateForm() || !editingCategory) return;

    updateCategory(editingCategory.id, {
      name: formData.name.trim(),
      icon: formData.icon,
      description: formData.description.trim()
    });

    setEditingCategory(null);
  };

  const handleConfirmDelete = () => {
    if (deletingCategoryId) {
      deleteCategory(deletingCategoryId);
      setDeletingCategoryId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-surface-border pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-2xl font-bold text-text-primary tracking-tight">
              Taxonomy & Disciplines
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary-100 text-primary-700">
              {categories.length} Nodes
            </span>
          </div>
          <p className="text-sm text-text-secondary mt-1">
            Manage archival discipline taxonomy, bibliographic classifications, and subject headings.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="primary" icon="add" onClick={handleOpenAdd}>
            Add Discipline
          </Button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-surface-card rounded-xl border border-surface-border p-5 shadow-subtle flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">account_tree</span>
          </div>
          <div>
            <span className="text-xs uppercase tracking-wider font-semibold text-text-muted">
              Total Disciplines
            </span>
            <div className="font-serif text-2xl font-bold text-text-primary mt-0.5">
              {categories.length}
            </div>
            <p className="text-xs text-text-muted mt-0.5">Active catalog branches</p>
          </div>
        </div>

        <div className="bg-surface-card rounded-xl border border-surface-border p-5 shadow-subtle flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">auto_stories</span>
          </div>
          <div>
            <span className="text-xs uppercase tracking-wider font-semibold text-text-muted">
              Catalogued Titles
            </span>
            <div className="font-serif text-2xl font-bold text-text-primary mt-0.5">
              {totalCategoryTitles.toLocaleString()}
            </div>
            <p className="text-xs text-text-muted mt-0.5">Across all disciplines</p>
          </div>
        </div>

        <div className="bg-surface-card rounded-xl border border-surface-border p-5 shadow-subtle flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">trending_up</span>
          </div>
          <div>
            <span className="text-xs uppercase tracking-wider font-semibold text-text-muted">
              Leading Discipline
            </span>
            <div className="font-serif text-lg font-bold text-text-primary mt-0.5 truncate max-w-[180px]">
              {topCategory?.name || "None"}
            </div>
            <p className="text-xs text-text-muted mt-0.5">
              {topCategory ? `${topCategory.count} accessions registered` : "No titles"}
            </p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-surface-card rounded-xl border border-surface-border p-4 shadow-subtle flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-lg">
            search
          </span>
          <input
            type="text"
            placeholder="Search discipline or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-surface-ground border border-surface-border rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
          />
        </div>
        <span className="text-xs text-text-muted">
          Showing {filteredCategories.length} of {categories.length} disciplines
        </span>
      </div>

      {/* Disciplines Grid */}
      {filteredCategories.length === 0 ? (
        <EmptyState
          icon="category"
          title="No Disciplines Match Your Query"
          description="Try modifying your search terms or add a new archival category to the system."
          actionText="Create Category"
          onAction={handleOpenAdd}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCategories.map((cat) => (
            <div
              key={cat.id}
              className="bg-surface-card rounded-xl border border-surface-border p-5 shadow-subtle hover:border-primary-200 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="w-11 h-11 rounded-lg bg-surface-ground border border-surface-border flex items-center justify-center text-primary-600 group-hover:bg-primary-50 transition-colors">
                    <span className="material-symbols-outlined text-2xl">
                      {cat.icon || "menu_book"}
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-surface-ground border border-surface-border text-text-muted">
                    {cat.id}
                  </span>
                </div>

                <h3 className="font-serif font-bold text-lg text-text-primary group-hover:text-primary-600 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-text-muted font-mono mt-0.5">/{cat.slug || cat.id}</p>

                <p className="text-xs text-text-secondary mt-2.5 line-clamp-2 leading-relaxed">
                  {cat.description || "Archival classification node registered in Heibook library taxonomy."}
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-surface-border flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-text-secondary">
                  <span className="material-symbols-outlined text-sm text-text-muted">menu_book</span>
                  <span className="font-semibold text-text-primary">{cat.count || 0}</span>
                  <span>titles</span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(cat)}
                    className="p-1.5 text-text-muted hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                    title="Edit Discipline"
                  >
                    <span className="material-symbols-outlined text-lg">edit</span>
                  </button>
                  <button
                    onClick={() => setDeletingCategoryId(cat.id)}
                    className="p-1.5 text-text-muted hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Delete Discipline"
                  >
                    <span className="material-symbols-outlined text-lg">delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Category Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Archival Discipline"
        subtitle="Create a new classification heading for bibliographic indexing."
        size="md"
      >
        <form onSubmit={handleSaveAdd} className="space-y-4">
          <Input
            label="Discipline Name"
            placeholder="e.g. Theoretical Physics & Cosmology"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={errors.name}
            required
          />

          <div>
            <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">
              Discipline Icon
            </label>
            <div className="grid grid-cols-6 gap-2">
              {AVAILABLE_ICONS.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => setFormData({ ...formData, icon })}
                  className={`h-10 rounded-lg border flex items-center justify-center transition-all ${
                    formData.icon === icon
                      ? "border-primary-500 bg-primary-50 text-primary-600 ring-2 ring-primary-500/20"
                      : "border-surface-border text-text-secondary hover:bg-surface-ground"
                  }`}
                >
                  <span className="material-symbols-outlined text-lg">{icon}</span>
                </button>
              ))}
            </div>
          </div>

          <Textarea
            label="Taxonomy Description"
            placeholder="Brief scope note or subject definition for this bibliographic discipline..."
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-surface-border">
            <Button variant="secondary" type="button" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" icon="check">
              Create Discipline
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Category Modal */}
      <Modal
        isOpen={Boolean(editingCategory)}
        onClose={() => setEditingCategory(null)}
        title="Edit Archival Discipline"
        subtitle={`Updating metadata for ${editingCategory?.name}`}
        size="md"
      >
        <form onSubmit={handleSaveEdit} className="space-y-4">
          <Input
            label="Discipline Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={errors.name}
            required
          />

          <div>
            <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">
              Discipline Icon
            </label>
            <div className="grid grid-cols-6 gap-2">
              {AVAILABLE_ICONS.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => setFormData({ ...formData, icon })}
                  className={`h-10 rounded-lg border flex items-center justify-center transition-all ${
                    formData.icon === icon
                      ? "border-primary-500 bg-primary-50 text-primary-600 ring-2 ring-primary-500/20"
                      : "border-surface-border text-text-secondary hover:bg-surface-ground"
                  }`}
                >
                  <span className="material-symbols-outlined text-lg">{icon}</span>
                </button>
              ))}
            </div>
          </div>

          <Textarea
            label="Taxonomy Description"
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-surface-border">
            <Button variant="secondary" type="button" onClick={() => setEditingCategory(null)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" icon="save">
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(deletingCategoryId)}
        onClose={() => setDeletingCategoryId(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Archival Discipline?"
        message="Are you sure you want to remove this discipline? Existing books under this classification will retain their catalog status but become unassociated."
        confirmText="Delete Discipline"
        type="danger"
      />
    </div>
  );
}
