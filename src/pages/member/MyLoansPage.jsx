import React, { useState } from "react";
import { useLibrary } from "../../context/LibraryContext";
import { StatusBadge } from "../../components/common/StatusBadge";
import { Button } from "../../components/common/Button";
import { ConfirmDialog } from "../../components/common/ConfirmDialog";
import { EmptyState } from "../../components/common/EmptyState";
import { NoticeBanner } from "../../components/common/NoticeBanner";

export const MyLoansPage = () => {
  const { borrowings, currentUser, returnBook, extendLoan } = useLibrary();
  const [filter, setFilter] = useState("all"); // "all" | "duesoon" | "overdue"
  const [returnLoanId, setReturnLoanId] = useState(null);
  const [extendLoanId, setExtendLoanId] = useState(null);

  const navigate = (path) => {
    window.location.hash = `#${path}`;
  };

  const myLoans = borrowings.filter(
    (b) => b.memberId === currentUser.memberId && b.status !== "Returned"
  );

  const filteredLoans = myLoans.filter((loan) => {
    if (filter === "duesoon") return loan.status === "Due Soon";
    if (filter === "overdue") return loan.status === "Overdue";
    return true;
  });

  const handleReturnConfirm = () => {
    if (returnLoanId) {
      returnBook(returnLoanId);
      setReturnLoanId(null);
    }
  };

  const handleExtendConfirm = () => {
    if (extendLoanId) {
      extendLoan(extendLoanId);
      setExtendLoanId(null);
    }
  };

  return (
    <div className="space-y-space-lg">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-md pb-space-sm border-b border-outline-variant/20">
        <div>
          <h1 className="font-headline-xl text-headline-xl text-on-surface font-extrabold tracking-tight">
            My Active Borrowings
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Track current physical and digital loans, renewal dates, and drop-off obligations.
          </p>
        </div>
        <Button variant="primary" size="sm" onClick={() => navigate("/books")} icon="add">
          Borrow Another Title
        </Button>
      </div>

      <NoticeBanner
        icon="info"
        title="Circulation Guidelines:"
        message="Active titles must be returned to the main desk or drop box on or before the due date to avoid an administrative late fee of Rp1.000 / volume / day."
      />

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-outline-variant/30 pb-2">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-1.5 rounded-lg font-label-md text-label-md transition-colors ${
            filter === "all"
              ? "bg-primary text-on-primary font-bold shadow-xs"
              : "text-on-surface-variant hover:bg-surface-container"
          }`}
        >
          All Active ({myLoans.length})
        </button>
        <button
          onClick={() => setFilter("duesoon")}
          className={`px-4 py-1.5 rounded-lg font-label-md text-label-md transition-colors ${
            filter === "duesoon"
              ? "bg-amber-600 text-white font-bold shadow-xs"
              : "text-on-surface-variant hover:bg-surface-container"
          }`}
        >
          Due Soon ({myLoans.filter((l) => l.status === "Due Soon").length})
        </button>
        <button
          onClick={() => setFilter("overdue")}
          className={`px-4 py-1.5 rounded-lg font-label-md text-label-md transition-colors ${
            filter === "overdue"
              ? "bg-error text-on-error font-bold shadow-xs"
              : "text-on-surface-variant hover:bg-surface-container"
          }`}
        >
          Overdue ({myLoans.filter((l) => l.status === "Overdue").length})
        </button>
      </div>

      {/* Loans Grid / Cards */}
      {filteredLoans.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
          {filteredLoans.map((loan) => (
            <div
              key={loan.id}
              className="p-space-lg rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-space-md"
            >
              <div className="flex items-start gap-space-md">
                <img
                  src={loan.bookCover}
                  alt={loan.bookTitle}
                  className="w-20 h-28 rounded-xl object-cover shadow-sm bg-surface-container flex-shrink-0"
                />
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-caption text-caption text-on-surface-variant font-mono">
                      {loan.id}
                    </span>
                    <StatusBadge status={loan.status} />
                  </div>
                  <h3
                    onClick={() => navigate(`/my-loans/${loan.id}`)}
                    className="font-title-md text-title-md font-bold text-on-surface hover:text-secondary transition-colors cursor-pointer truncate"
                    title={loan.bookTitle}
                  >
                    {loan.bookTitle}
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant truncate">
                    {loan.bookAuthor}
                  </p>
                  <p className="font-caption text-caption text-on-surface-variant font-mono">
                    {loan.shelfLocation}
                  </p>
                </div>
              </div>

              {/* Timeline Info */}
              <div className="p-space-xs rounded-xl bg-surface-container-low text-caption space-y-1">
                <div className="flex justify-between text-on-surface-variant">
                  <span>Borrowed Date:</span>
                  <span className="font-semibold text-on-surface">{loan.borrowDate}</span>
                </div>
                <div className="flex justify-between text-on-surface-variant">
                  <span>Due Date:</span>
                  <span
                    className={`font-semibold ${
                      loan.status === "Overdue"
                        ? "text-error"
                        : loan.status === "Due Soon"
                        ? "text-amber-800"
                        : "text-on-surface"
                    }`}
                  >
                    {loan.dueDate}
                  </span>
                </div>
                <div className="flex justify-between text-on-surface-variant">
                  <span>Extensions:</span>
                  <span className="font-semibold text-on-surface">
                    {loan.extensionsCount} of {loan.maxExtensions} max
                  </span>
                </div>
                {loan.fineAmount > 0 && (
                  <div className="flex justify-between text-error font-semibold pt-1 border-t border-outline-variant/10">
                    <span>Accrued Fine:</span>
                    <span>Rp{loan.fineAmount.toLocaleString()}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-3 gap-2 pt-1 border-t border-outline-variant/20">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/my-loans/${loan.id}`)}
                >
                  Details
                </Button>
                <Button
                  variant="subtle"
                  size="sm"
                  disabled={loan.extensionsCount >= loan.maxExtensions || loan.status === "Overdue"}
                  onClick={() => setExtendLoanId(loan.id)}
                >
                  Extend 7D
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setReturnLoanId(loan.id)}
                >
                  Return
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon="check_circle"
          title="No active loans in this view"
          description="You currently have no active borrowings matching the selected filter."
          actionLabel="Explore Catalog"
          onAction={() => navigate("/books")}
        />
      )}

      {/* Dialogs */}
      <ConfirmDialog
        isOpen={!!returnLoanId}
        onClose={() => setReturnLoanId(null)}
        onConfirm={handleReturnConfirm}
        title="Confirm Return of Volume"
        message="Are you returning this book to the circulation stacks? The catalog ledger will be updated immediately."
        confirmText="Confirm Return"
        cancelText="Cancel"
      />

      <ConfirmDialog
        isOpen={!!extendLoanId}
        onClose={() => setExtendLoanId(null)}
        onConfirm={handleExtendConfirm}
        title="Confirm 7-Day Extension"
        message="Extend this borrowing by an additional 7 calendar days? Only one renewal is allowed."
        confirmText="Extend Loan"
        cancelText="Cancel"
        variant="secondary"
      />
    </div>
  );
};
