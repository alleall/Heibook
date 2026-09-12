import React from "react";

export const BookFilterBar = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  categories = [],
  availabilityFilter,
  onAvailabilityChange,
  sortBy,
  onSortChange,
  totalResults = 0
}) => {
  return (
    <div className="flex flex-col gap-space-md bg-surface-container-lowest p-space-md rounded-2xl border border-outline-variant/30 shadow-xs">
      {/* Top Row: Search Input & Quick Sort */}
      <div className="flex flex-col md:flex-row items-center gap-space-sm justify-between">
        <div className="relative w-full md:max-w-md flex items-center">
          <span className="material-symbols-outlined absolute left-3.5 text-on-surface-variant pointer-events-none text-[20px]">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by title, author, or ISBN..."
            className="w-full h-11 pl-11 pr-space-md bg-surface-container-low rounded-xl font-body-sm text-body-sm text-on-surface placeholder:text-outline focus:outline-none focus:ring-1 focus:ring-secondary transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-3 text-on-surface-variant hover:text-on-surface p-1"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          )}
        </div>

        {/* Filters Group: Availability & Sorting */}
        <div className="flex items-center gap-space-sm w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          {/* Availability Toggle */}
          <div className="flex items-center bg-surface-container-low p-1 rounded-xl flex-shrink-0">
            <button
              onClick={() => onAvailabilityChange("all")}
              className={`px-3 py-1.5 rounded-lg font-label-md text-label-md transition-colors ${
                availabilityFilter === "all"
                  ? "bg-surface-container-lowest text-on-surface font-semibold shadow-xs"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              All Titles
            </button>
            <button
              onClick={() => onAvailabilityChange("available")}
              className={`px-3 py-1.5 rounded-lg font-label-md text-label-md transition-colors ${
                availabilityFilter === "available"
                  ? "bg-surface-container-lowest text-emerald-800 font-semibold shadow-xs"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              In Stacks Only
            </button>
          </div>

          {/* Sort Dropdown */}
          <div className="relative flex items-center flex-shrink-0">
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="h-10 pl-3 pr-8 bg-surface-container-low rounded-xl font-label-md text-label-md text-on-surface focus:outline-none focus:ring-1 focus:ring-secondary appearance-none cursor-pointer"
            >
              <option value="featured">Featured Curations</option>
              <option value="newest">Year: Newest First</option>
              <option value="title">Title: A to Z</option>
              <option value="rating">Highest Rated</option>
              <option value="stock">Available Stacks</option>
            </select>
            <span className="material-symbols-outlined absolute right-2.5 text-on-surface-variant pointer-events-none text-[18px]">
              sort
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Row: Category Pills Scrollable */}
      <div className="flex items-center gap-space-2xs overflow-x-auto no-scrollbar pt-1 border-t border-outline-variant/20">
        <button
          onClick={() => onCategoryChange("all")}
          className={`px-3 py-1.5 rounded-full font-label-sm text-label-sm font-medium whitespace-nowrap transition-colors flex-shrink-0 ${
            selectedCategory === "all"
              ? "bg-primary text-on-primary font-bold shadow-xs"
              : "bg-surface-container text-on-surface hover:bg-surface-container-high"
          }`}
        >
          All Disciplines ({totalResults})
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onCategoryChange(cat.id)}
            className={`px-3 py-1.5 rounded-full font-label-sm text-label-sm font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 flex-shrink-0 ${
              selectedCategory === cat.id
                ? "bg-primary text-on-primary font-bold shadow-xs"
                : "bg-surface-container text-on-surface hover:bg-surface-container-high"
            }`}
          >
            <span className="material-symbols-outlined text-[14px]">{cat.icon}</span>
            <span>{cat.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
