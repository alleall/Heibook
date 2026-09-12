import React, { useState, useMemo } from "react";
import { useLibrary } from "../../context/LibraryContext";
import { Button } from "../../components/common/Button";
import { StatusBadge } from "../../components/common/StatusBadge";
import { Modal } from "../../components/common/Modal";
import { Select } from "../../components/forms/Select";
import { Textarea } from "../../components/forms/Textarea";
import { EmptyState } from "../../components/common/EmptyState";

export default function ReturnManagementPage({ onNavigate }) {
  const { borrowings, returnBook, stats } = useLibrary();

  const [scanQuery, setScanQuery] = useState("");
  const [selectedLoanForReturn, setSelectedLoanForReturn] = useState(null);
  const [conditionGrade, setConditionGrade] = useState("Pristine / Excellent");
  const [returnNotes, setReturnNotes] = useState("");

  // Outstanding loans (not yet returned)
  const outstandingLoans = useMemo(() => {
    return borrowings.filter((b) => b.status !== "Returned");
  }, [borrowings]);

  // Returned loans archive (recently checked in)
  const recentReturns = useMemo(() => {
    return borrowings.filter((b) => b.status === "Returned");
  }, [borrowings]);

  // Filtered outstanding by scan or search query
  const filteredOutstanding = useMemo(() => {
    if (!scanQuery.trim()) return outstandingLoans;
    const q = scanQuery.toLowerCase();
    return outstandingLoans.filter((loan) => {
      return (
        loan.id.toLowerCase().includes(q) ||
        loan.bookTitle.toLowerCase().includes(q) ||
        loan.memberName.toLowerCase().includes(q) ||
        loan.isbn?.toLowerCase().includes(q)
      );
    });
  }, [outstandingLoans, scanQuery]);

  const handleOpenCheckIn = (loan) => {
    setSelectedLoanForReturn(loan);
    setConditionGrade("Pristine / Excellent");
    setReturnNotes("");
  };

  const handleExecuteReturn = (e) => {
    e.preventDefault();
    if (!selectedLoanForReturn) return;

    returnBook(selectedLoanForReturn.id);
    setSelectedLoanForReturn(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-surface-border pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-2xl font-bold text-text-primary tracking-tight">
              Check-In & Return Desk
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
              Circulation Reception
            </span>
          </div>
          <p className="text-sm text-text-secondary mt-1">
            Process returned library volumes, inspect physical archival condition, and settle fine records.
          </p>
        </div>
      </div>

      {/* Barcode / Loan ID Fast Lookup */}
      <div className="bg-surface-card rounded-xl border border-surface-border p-5 shadow-subtle">
        <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
          Fast Barcode / Circulation ID Scan
        </label>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted text-xl">
              qr_code_scanner
            </span>
            <input
              type="text"
              placeholder="Scan barcode or enter Circulation ID (e.g. LN-2024-8841)..."
              value={scanQuery}
              onChange={(e) => setScanQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 text-sm bg-surface-ground border border-surface-border rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent font-mono transition-all"
            />
          </div>
          {scanQuery && (
            <Button variant="secondary" onClick={() => setScanQuery("")}>
              Clear
            </Button>
          )}
        </div>
        <p className="text-xs text-text-muted mt-2">
          Tip: You can also search by patron name or title keyword to locate the active loan record.
        </p>
      </div>

      {/* Outstanding Loans Desk */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-lg font-bold text-text-primary">
            Volumes Awaiting Physical Check-In ({filteredOutstanding.length})
          </h2>
          <span className="text-xs text-text-muted">
            {outstandingLoans.filter((l) => l.status === "Overdue").length} flagged overdue
          </span>
        </div>

        {filteredOutstanding.length === 0 ? (
          <EmptyState
            icon="task_alt"
            title="All Checked-Out Items Clear"
            description={
              scanQuery
                ? "No active loan found matching this barcode or query."
                : "There are currently no outstanding loans requiring physical check-in."
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredOutstanding.map((loan) => (
              <div
                key={loan.id}
                className="bg-surface-card rounded-xl border border-surface-border p-4 shadow-subtle flex flex-col justify-between hover:border-primary-300 transition-all"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <StatusBadge status={loan.status} />
                    <span className="font-mono text-xs font-semibold text-text-muted">{loan.id}</span>
                  </div>

                  <div className="flex gap-3">
                    <img
                      src={loan.bookCover}
                      alt={loan.bookTitle}
                      className="w-14 h-20 object-cover rounded border border-surface-border flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <h4 className="font-serif font-bold text-sm text-text-primary line-clamp-1">
                        {loan.bookTitle}
                      </h4>
                      <p className="text-xs text-text-secondary truncate">{loan.bookAuthor}</p>
                      <div className="text-xs text-text-muted mt-1.5">
                        Patron:{" "}
                        <span className="font-medium text-text-primary">{loan.memberName}</span>
                      </div>
                      <div className="text-[11px] text-text-muted font-mono">{loan.memberId}</div>
                    </div>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-surface-border flex items-center justify-between text-xs">
                    <span className="text-text-muted">Due: {loan.dueDate}</span>
                    {loan.status === "Overdue" && (
                      <span className="font-semibold text-rose-600">
                        Fine: Rp{(loan.fineAmount || 0).toLocaleString("id-ID")}
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-surface-border">
                  <Button
                    variant="primary"
                    size="sm"
                    fullWidth
                    icon="assignment_turned_in"
                    onClick={() => handleOpenCheckIn(loan)}
                  >
                    Receive & Check-In
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recently Returned Log */}
      <div className="space-y-3 pt-6 border-t border-surface-border">
        <h2 className="font-serif text-lg font-bold text-text-primary">
          Recently Received Volumes ({recentReturns.length})
        </h2>

        {recentReturns.length === 0 ? (
          <p className="text-xs text-text-muted">No volumes checked in during this session.</p>
        ) : (
          <div className="bg-surface-card rounded-xl border border-surface-border overflow-hidden shadow-subtle">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-surface-ground border-b border-surface-border text-xs uppercase font-semibold text-text-muted">
                  <tr>
                    <th className="py-3 px-4">Loan Reference</th>
                    <th className="py-3 px-4">Title</th>
                    <th className="py-3 px-4">Borrower</th>
                    <th className="py-3 px-4">Received On</th>
                    <th className="py-3 px-4">Stack Clearance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-border text-text-primary text-xs">
                  {recentReturns.slice(0, 5).map((loan) => (
                    <tr key={loan.id} className="hover:bg-surface-ground/50 transition-colors">
                      <td className="py-2.5 px-4 font-mono text-text-muted">{loan.id}</td>
                      <td className="py-2.5 px-4 font-medium text-text-primary">{loan.bookTitle}</td>
                      <td className="py-2.5 px-4 text-text-secondary">{loan.memberName}</td>
                      <td className="py-2.5 px-4 text-emerald-600 font-medium">
                        {loan.returnDate || "Today"}
                      </td>
                      <td className="py-2.5 px-4">
                        <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold">
                          <span className="material-symbols-outlined text-base">check_circle</span>
                          Restocked
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Process Return Verification Modal */}
      <Modal
        isOpen={Boolean(selectedLoanForReturn)}
        onClose={() => setSelectedLoanForReturn(null)}
        title="Check-In Verification Desk"
        subtitle={`Processing return for loan ${selectedLoanForReturn?.id}`}
        size="md"
      >
        {selectedLoanForReturn && (
          <form onSubmit={handleExecuteReturn} className="space-y-4">
            <div className="p-3 bg-surface-ground border border-surface-border rounded-lg flex gap-3 items-center">
              <img
                src={selectedLoanForReturn.bookCover}
                alt={selectedLoanForReturn.bookTitle}
                className="w-12 h-16 object-cover rounded border border-surface-border"
              />
              <div className="min-w-0">
                <h4 className="font-serif font-bold text-sm text-text-primary truncate">
                  {selectedLoanForReturn.bookTitle}
                </h4>
                <p className="text-xs text-text-secondary truncate">
                  {selectedLoanForReturn.bookAuthor}
                </p>
                <div className="text-xs text-text-muted mt-1">
                  Returned by: <span className="font-semibold text-text-primary">{selectedLoanForReturn.memberName}</span>
                </div>
              </div>
            </div>

            {selectedLoanForReturn.status === "Overdue" && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-800 space-y-1">
                <div className="font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-base">warning</span>
                  Overdue Fine Settlement Required
                </div>
                <p>
                  This volume is overdue. Total fine calculated:{" "}
                  <span className="font-bold">
                    Rp{(selectedLoanForReturn.fineAmount || 0).toLocaleString("id-ID")}
                  </span>
                  .
                </p>
              </div>
            )}

            <Select
              label="Physical Book Condition"
              value={conditionGrade}
              onChange={(e) => setConditionGrade(e.target.value)}
              options={[
                { value: "Pristine / Excellent", label: "Pristine / Excellent (No wear)" },
                { value: "Good / Minor Wear", label: "Good / Minor Wear (Acceptable)" },
                { value: "Page Dog-ears", label: "Minor Page Dog-ears" },
                { value: "Cover Wear / Needs Binding", label: "Needs Binding / Cover Wear" },
                { value: "Severe Damage", label: "Severe Damage (Assessed for replacement)" }
              ]}
            />

            <Textarea
              label="Librarian Inspection Note"
              placeholder="e.g. Volume inspected, pages clean, returned to Shelf Row A-01."
              rows={2}
              value={returnNotes}
              onChange={(e) => setReturnNotes(e.target.value)}
            />

            <div className="p-3 bg-surface-ground border border-surface-border rounded-lg text-xs text-text-secondary">
              Upon confirmation, catalog stock for this title will be automatically incremented by 1
              copy and returned to circulation stacks.
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-surface-border">
              <Button
                variant="secondary"
                type="button"
                onClick={() => setSelectedLoanForReturn(null)}
              >
                Cancel
              </Button>
              <Button variant="primary" type="submit" icon="check_circle">
                Confirm Return & Restock
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
