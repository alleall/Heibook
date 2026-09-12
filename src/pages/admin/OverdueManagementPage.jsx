import React, { useState, useMemo } from "react";
import { useLibrary } from "../../context/LibraryContext";
import { Button } from "../../components/common/Button";
import { StatusBadge } from "../../components/common/StatusBadge";
import { EmptyState } from "../../components/common/EmptyState";

export default function OverdueManagementPage({ onNavigate }) {
  const { borrowings, returnBook, updateMemberStatus, addToast, stats } = useLibrary();

  const [searchQuery, setSearchQuery] = useState("");
  const [daysFilter, setDaysFilter] = useState("All"); // "All" | "1-3" | "4-7" | "8+"

  // All overdue loans
  const overdueLoans = useMemo(() => {
    return borrowings.filter((b) => b.status === "Overdue");
  }, [borrowings]);

  // Calculate days overdue and accrued fine for each loan
  const overdueWithDetails = useMemo(() => {
    const today = new Date();
    return overdueLoans.map((loan) => {
      const due = new Date(loan.dueDate);
      const diffTime = Math.max(0, today - due);
      const diffDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
      const fine = diffDays * (stats.circulationPolicy?.finePerDay || 1000);
      return {
        ...loan,
        daysOverdue: diffDays,
        calculatedFine: loan.fineAmount > 0 ? loan.fineAmount : fine
      };
    });
  }, [overdueLoans, stats.circulationPolicy]);

  // Total fine sum
  const totalFineAccrued = useMemo(() => {
    return overdueWithDetails.reduce((sum, item) => sum + item.calculatedFine, 0);
  }, [overdueWithDetails]);

  // Longest overdue
  const maxDaysOverdue = useMemo(() => {
    if (!overdueWithDetails.length) return 0;
    return Math.max(...overdueWithDetails.map((item) => item.daysOverdue));
  }, [overdueWithDetails]);

  // Filtered overdue list
  const filteredOverdue = useMemo(() => {
    return overdueWithDetails.filter((item) => {
      const q = searchQuery.toLowerCase();
      const matchSearch =
        item.id.toLowerCase().includes(q) ||
        item.bookTitle.toLowerCase().includes(q) ||
        item.memberName.toLowerCase().includes(q) ||
        item.memberEmail?.toLowerCase().includes(q);

      let matchDays = true;
      if (daysFilter === "1-3") matchDays = item.daysOverdue >= 1 && item.daysOverdue <= 3;
      else if (daysFilter === "4-7") matchDays = item.daysOverdue >= 4 && item.daysOverdue <= 7;
      else if (daysFilter === "8+") matchDays = item.daysOverdue >= 8;

      return matchSearch && matchDays;
    });
  }, [overdueWithDetails, searchQuery, daysFilter]);

  const handleSendReminder = (loan) => {
    addToast(
      "info",
      "Overdue Notice Dispatched",
      `Automated notification email sent to ${loan.memberName} (${loan.memberEmail}).`
    );
  };

  const handleBatchReminders = () => {
    addToast(
      "success",
      "Batch Notices Dispatched",
      `Sent ${overdueLoans.length} institutional overdue reminder notices to registered patrons.`
    );
  };

  const handleSuspendBorrower = (memberId, memberName) => {
    updateMemberStatus(memberId, "Suspended");
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-surface-border pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-2xl font-bold text-text-primary tracking-tight">
              Overdue Circulation Ledger
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-700">
              {stats.overdueBooks} Overdue
            </span>
          </div>
          <p className="text-sm text-text-secondary mt-1">
            Monitor unreturned volumes, manage late fine assessments, and dispatch institutional recall notices.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="primary"
            icon="mark_email_read"
            onClick={handleBatchReminders}
            disabled={overdueLoans.length === 0}
          >
            Dispatch Batch Notices
          </Button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-surface-card rounded-xl border border-surface-border p-4 shadow-subtle flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">error</span>
          </div>
          <div>
            <span className="text-xs uppercase tracking-wider font-semibold text-text-muted">
              Overdue Copies
            </span>
            <div className="font-serif text-2xl font-bold text-rose-600 mt-0.5">
              {stats.overdueBooks}
            </div>
          </div>
        </div>

        <div className="bg-surface-card rounded-xl border border-surface-border p-4 shadow-subtle flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">payments</span>
          </div>
          <div>
            <span className="text-xs uppercase tracking-wider font-semibold text-text-muted">
              Accumulated Fines
            </span>
            <div className="font-serif text-xl font-bold text-text-primary mt-0.5">
              Rp{totalFineAccrued.toLocaleString("id-ID")}
            </div>
          </div>
        </div>

        <div className="bg-surface-card rounded-xl border border-surface-border p-4 shadow-subtle flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">hourglass_bottom</span>
          </div>
          <div>
            <span className="text-xs uppercase tracking-wider font-semibold text-text-muted">
              Longest Overdue
            </span>
            <div className="font-serif text-2xl font-bold text-text-primary mt-0.5">
              {maxDaysOverdue} <span className="text-xs font-normal text-text-muted">days</span>
            </div>
          </div>
        </div>

        <div className="bg-surface-card rounded-xl border border-surface-border p-4 shadow-subtle flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-lg bg-surface-ground text-text-muted flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">policy</span>
          </div>
          <div>
            <span className="text-xs uppercase tracking-wider font-semibold text-text-muted">
              Daily Fine Rate
            </span>
            <div className="font-serif text-lg font-bold text-text-primary mt-0.5">
              Rp{(stats.circulationPolicy?.finePerDay || 1000).toLocaleString("id-ID")}{" "}
              <span className="text-xs font-normal text-text-muted">/ day</span>
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
            placeholder="Search overdue volume or patron..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-surface-ground border border-surface-border rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-text-muted">Days Late:</span>
          {["All", "1-3", "4-7", "8+"].map((range) => (
            <button
              key={range}
              onClick={() => setDaysFilter(range)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                daysFilter === range
                  ? "bg-rose-600 text-white shadow-sm"
                  : "bg-surface-ground border border-surface-border text-text-secondary hover:text-text-primary"
              }`}
            >
              {range === "All" ? "All Overdue" : `${range} Days`}
            </button>
          ))}
        </div>
      </div>

      {/* Overdue Table */}
      {filteredOverdue.length === 0 ? (
        <EmptyState
          icon="verified"
          title="No Overdue Borrowings"
          description={
            searchQuery || daysFilter !== "All"
              ? "No overdue records match the selected filters."
              : "All active library loans are currently within their authorized lending window."
          }
        />
      ) : (
        <div className="bg-surface-card rounded-xl border border-surface-border overflow-hidden shadow-subtle">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface-ground border-b border-surface-border text-xs uppercase font-semibold text-text-muted">
                <tr>
                  <th className="py-3.5 px-4">Circulation ID</th>
                  <th className="py-3.5 px-4">Overdue Volume</th>
                  <th className="py-3.5 px-4">Borrower Patron</th>
                  <th className="py-3.5 px-4">Stipulated Due Date</th>
                  <th className="py-3.5 px-4 text-center">Days Past Due</th>
                  <th className="py-3.5 px-4">Fine Accrued</th>
                  <th className="py-3.5 px-4 text-right">Recall Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border text-text-primary">
                {filteredOverdue.map((loan) => (
                  <tr key={loan.id} className="hover:bg-surface-ground/50 transition-colors">
                    <td className="py-3 px-4 font-mono text-xs font-semibold text-text-muted">
                      {loan.id}
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
                      <div className="text-xs text-text-muted">{loan.memberEmail}</div>
                    </td>

                    <td className="py-3 px-4 text-xs font-semibold text-text-secondary">
                      {loan.dueDate}
                    </td>

                    <td className="py-3 px-4 text-center">
                      <span className="inline-block px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700">
                        +{loan.daysOverdue} days
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-serif font-bold text-rose-600">
                        Rp{loan.calculatedFine.toLocaleString("id-ID")}
                      </div>
                      <span className="text-[11px] text-text-muted">
                        at Rp{(stats.circulationPolicy?.finePerDay || 1000).toLocaleString("id-ID")}/day
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleSendReminder(loan)}
                          className="p-1.5 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                          title="Send Email Reminder"
                        >
                          <span className="material-symbols-outlined text-lg">mail</span>
                        </button>
                        <button
                          onClick={() => returnBook(loan.id)}
                          className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                          title="Force Immediate Return"
                        >
                          <span className="material-symbols-outlined text-lg">assignment_turned_in</span>
                        </button>
                        <button
                          onClick={() => handleSuspendBorrower(loan.memberId, loan.memberName)}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Suspend Patron Privileges"
                        >
                          <span className="material-symbols-outlined text-lg">block</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
