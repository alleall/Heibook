import React, { useState, useMemo } from "react";
import { useLibrary } from "../../context/LibraryContext";
import { Button } from "../../components/common/Button";
import { StatusBadge } from "../../components/common/StatusBadge";
import { Modal } from "../../components/common/Modal";
import { Select } from "../../components/forms/Select";
import { Textarea } from "../../components/forms/Textarea";
import { EmptyState } from "../../components/common/EmptyState";

export default function BorrowingManagementPage({ onNavigate }) {
  const { borrowings, books, members, borrowBook, returnBook, extendLoan, stats } = useLibrary();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);

  // Issue loan form state
  const [selectedBookId, setSelectedBookId] = useState("");
  const [selectedMemberId, setSelectedMemberId] = useState("");
  const [issueNotes, setIssueNotes] = useState("");
  const [formError, setFormError] = useState("");

  // Statistics
  const activeCount = useMemo(
    () => borrowings.filter((b) => b.status === "Active").length,
    [borrowings]
  );
  const dueSoonCount = useMemo(
    () => borrowings.filter((b) => b.status === "Due Soon").length,
    [borrowings]
  );
  const overdueCount = useMemo(
    () => borrowings.filter((b) => b.status === "Overdue").length,
    [borrowings]
  );
  const returnedCount = useMemo(
    () => borrowings.filter((b) => b.status === "Returned").length,
    [borrowings]
  );

  // Filtered loans
  const filteredBorrowings = useMemo(() => {
    return borrowings.filter((loan) => {
      const q = searchQuery.toLowerCase();
      const matchSearch =
        loan.id.toLowerCase().includes(q) ||
        loan.bookTitle.toLowerCase().includes(q) ||
        loan.memberName.toLowerCase().includes(q) ||
        loan.shelfLocation?.toLowerCase().includes(q);

      const matchStatus = statusFilter === "All" || loan.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [borrowings, searchQuery, statusFilter]);

  // Available books for manual checkout
  const availableBooks = useMemo(() => {
    return books.filter((b) => b.availableCopies > 0);
  }, [books]);

  // Eligible members for manual checkout
  const eligibleMembers = useMemo(() => {
    return members.filter((m) => m.status === "Active" && m.activeBorrowings < m.maxQuota);
  }, [members]);

  const handleOpenIssue = () => {
    setSelectedBookId(availableBooks[0]?.id || "");
    setSelectedMemberId(eligibleMembers[0]?.id || "");
    setIssueNotes("");
    setFormError("");
    setIsIssueModalOpen(true);
  };

  const handleSaveIssue = (e) => {
    e.preventDefault();
    if (!selectedBookId || !selectedMemberId) {
      setFormError("Please select both a valid volume and registered patron.");
      return;
    }

    const res = borrowBook(selectedBookId, selectedMemberId);
    if (res.success) {
      setIsIssueModalOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-surface-border pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-2xl font-bold text-text-primary tracking-tight">
              Circulation Desk & Loans
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary-100 text-primary-700">
              {stats.activeBorrowings} Active
            </span>
          </div>
          <p className="text-sm text-text-secondary mt-1">
            Institutional lending ledger, checkout authorizations, and circulation tracking.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="primary" icon="assignment_add" onClick={handleOpenIssue}>
            Issue Loan
          </Button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-surface-card rounded-xl border border-surface-border p-4 shadow-subtle flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">book</span>
          </div>
          <div>
            <span className="text-xs uppercase tracking-wider font-semibold text-text-muted">
              Active Loans
            </span>
            <div className="font-serif text-2xl font-bold text-text-primary mt-0.5">
              {stats.activeBorrowings}
            </div>
          </div>
        </div>

        <div className="bg-surface-card rounded-xl border border-surface-border p-4 shadow-subtle flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">alarm</span>
          </div>
          <div>
            <span className="text-xs uppercase tracking-wider font-semibold text-text-muted">
              Due Soon
            </span>
            <div className="font-serif text-2xl font-bold text-text-primary mt-0.5">
              {dueSoonCount}
            </div>
          </div>
        </div>

        <div className="bg-surface-card rounded-xl border border-surface-border p-4 shadow-subtle flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">warning</span>
          </div>
          <div>
            <span className="text-xs uppercase tracking-wider font-semibold text-text-muted">
              Overdue
            </span>
            <div className="font-serif text-2xl font-bold text-rose-600 mt-0.5">
              {stats.overdueBooks}
            </div>
          </div>
        </div>

        <div className="bg-surface-card rounded-xl border border-surface-border p-4 shadow-subtle flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">check_circle</span>
          </div>
          <div>
            <span className="text-xs uppercase tracking-wider font-semibold text-text-muted">
              Returned Stacks
            </span>
            <div className="font-serif text-2xl font-bold text-text-primary mt-0.5">
              {returnedCount}
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-surface-card rounded-xl border border-surface-border p-4 shadow-subtle flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-lg">
            search
          </span>
          <input
            type="text"
            placeholder="Search by loan ID, title, or borrower..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-surface-ground border border-surface-border rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {["All", "Active", "Due Soon", "Overdue", "Returned"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                statusFilter === status
                  ? "bg-primary-600 text-white shadow-sm"
                  : "bg-surface-ground border border-surface-border text-text-secondary hover:text-text-primary"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Circulation Table */}
      {filteredBorrowings.length === 0 ? (
        <EmptyState
          icon="assignment"
          title="No Circulation Records"
          description="There are no loan records matching the specified criteria."
          actionText="Clear Filter"
          onAction={() => {
            setSearchQuery("");
            setStatusFilter("All");
          }}
        />
      ) : (
        <div className="bg-surface-card rounded-xl border border-surface-border overflow-hidden shadow-subtle">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface-ground border-b border-surface-border text-xs uppercase font-semibold text-text-muted">
                <tr>
                  <th className="py-3.5 px-4">Circulation ID & Shelf</th>
                  <th className="py-3.5 px-4">Accessioned Title</th>
                  <th className="py-3.5 px-4">Borrower Patron</th>
                  <th className="py-3.5 px-4">Checkout & Due</th>
                  <th className="py-3.5 px-4 text-center">Renewals</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Desk Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border text-text-primary">
                {filteredBorrowings.map((loan) => (
                  <tr key={loan.id} className="hover:bg-surface-ground/50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-mono text-xs font-semibold text-text-primary">
                        {loan.id}
                      </div>
                      <div className="text-[11px] text-text-muted mt-0.5">
                        {loan.shelfLocation || "Stacks Row A"}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={loan.bookCover}
                          alt={loan.bookTitle}
                          className="w-8 h-12 object-cover rounded border border-surface-border flex-shrink-0"
                        />
                        <div className="min-w-0">
                          <button
                            onClick={() => onNavigate && onNavigate(`/books/${loan.bookId}`)}
                            className="font-medium text-text-primary hover:text-primary-600 transition-colors text-left truncate max-w-[200px] block"
                          >
                            {loan.bookTitle}
                          </button>
                          <div className="text-xs text-text-muted truncate max-w-[200px]">
                            {loan.bookAuthor}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <button
                        onClick={() => onNavigate && onNavigate(`/admin/members/${loan.memberId}`)}
                        className="font-medium text-text-primary hover:text-primary-600 transition-colors text-left block"
                      >
                        {loan.memberName}
                      </button>
                      <div className="font-mono text-[11px] text-text-muted">{loan.memberId}</div>
                    </td>

                    <td className="py-3 px-4 text-xs">
                      <div className="text-text-secondary">{loan.borrowDate}</div>
                      <div
                        className={`font-semibold mt-0.5 ${
                          loan.status === "Overdue" ? "text-rose-600" : "text-text-primary"
                        }`}
                      >
                        Due: {loan.dueDate}
                      </div>
                    </td>

                    <td className="py-3 px-4 text-center">
                      <span className="text-xs font-mono px-2 py-0.5 rounded bg-surface-ground border border-surface-border text-text-secondary">
                        {loan.extensionsCount} / {loan.maxExtensions}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <StatusBadge status={loan.status} />
                    </td>

                    <td className="py-3 px-4 text-right">
                      {loan.status !== "Returned" ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => extendLoan(loan.id)}
                            disabled={
                              loan.extensionsCount >= loan.maxExtensions || loan.status === "Overdue"
                            }
                            className="p-1.5 text-text-secondary hover:text-primary-600 hover:bg-primary-50 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            title="Extend Due Date"
                          >
                            <span className="material-symbols-outlined text-lg">update</span>
                          </button>
                          <button
                            onClick={() => returnBook(loan.id)}
                            className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                            title="Check-In / Return"
                          >
                            <span className="material-symbols-outlined text-lg">
                              assignment_turned_in
                            </span>
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-text-muted font-mono">Archived</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Manual Loan Checkout Modal */}
      <Modal
        isOpen={isIssueModalOpen}
        onClose={() => setIsIssueModalOpen(false)}
        title="Issue Institutional Loan"
        subtitle="Authorize physical checkout of a catalog volume to an enrolled patron."
        size="md"
      >
        <form onSubmit={handleSaveIssue} className="space-y-4">
          {formError && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg">
              {formError}
            </div>
          )}

          <Select
            label="Catalog Volume (Available Copies)"
            value={selectedBookId}
            onChange={(e) => setSelectedBookId(e.target.value)}
            options={availableBooks.map((b) => ({
              value: b.id,
              label: `${b.title} (${b.availableCopies} available - ${b.shelfLocation})`
            }))}
            required
          />

          <Select
            label="Registered Library Patron"
            value={selectedMemberId}
            onChange={(e) => setSelectedMemberId(e.target.value)}
            options={eligibleMembers.map((m) => ({
              value: m.id,
              label: `${m.name} (${m.activeBorrowings}/${m.maxQuota} active loans - ${m.department})`
            }))}
            required
          />

          <Textarea
            label="Circulation Notes / Reference Authorization"
            placeholder="e.g. Authorized by Department Dean for semester thesis research."
            rows={2}
            value={issueNotes}
            onChange={(e) => setIssueNotes(e.target.value)}
          />

          <div className="p-3 bg-surface-ground border border-surface-border rounded-lg text-xs text-text-secondary">
            <span className="font-semibold text-text-primary block mb-1">
              Circulation Rules Applied:
            </span>
            Standard lending window of {stats.circulationPolicy.lendingDays} days applies. Due date
            will be stamped automatically.
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-surface-border">
            <Button variant="secondary" type="button" onClick={() => setIsIssueModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" icon="check_circle">
              Authorize Loan
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
