import React, { useState } from "react";
import { useLibrary } from "../../context/LibraryContext";
import { StatusBadge } from "../../components/common/StatusBadge";
import { Button } from "../../components/common/Button";
import { ConfirmDialog } from "../../components/common/ConfirmDialog";

export const LoanDetailPage = ({ loanId }) => {
  const { borrowings, returnBook, extendLoan } = useLibrary();
  const [returnConfirm, setReturnConfirm] = useState(false);
  const [extendConfirm, setExtendConfirm] = useState(false);

  const navigate = (path) => {
    window.location.hash = `#${path}`;
  };

  const loan = borrowings.find((b) => b.id === loanId) || borrowings[0];

  const handleReturn = () => {
    returnBook(loan.id);
    setReturnConfirm(false);
    navigate("/my-loans");
  };

  const handleExtend = () => {
    extendLoan(loan.id);
    setExtendConfirm(false);
  };

  return (
    <div className="space-y-space-xl">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-caption text-on-surface-variant">
        <button onClick={() => navigate("/dashboard")} className="hover:text-on-surface">Dashboard</button>
        <span>/</span>
        <button onClick={() => navigate("/my-loans")} className="hover:text-on-surface">My Borrowings</button>
        <span>/</span>
        <span className="text-on-surface font-semibold font-mono">{loan.id}</span>
      </div>

      {/* Main Loan Sheet */}
      <div className="p-6 sm:p-space-xl rounded-3xl bg-surface-container-lowest border border-outline-variant/30 shadow-md space-y-space-lg">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm pb-space-md border-b border-outline-variant/20">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-caption text-caption text-on-surface-variant font-mono font-bold">
                CIRCULATION TOKEN: {loan.id}
              </span>
              <StatusBadge status={loan.status} />
            </div>
            <h1 className="font-headline-md text-headline-md font-extrabold text-on-surface">
              Borrowing & Lending Record
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={loan.status === "Returned" || loan.extensionsCount >= loan.maxExtensions || loan.status === "Overdue"}
              onClick={() => setExtendConfirm(true)}
              icon="update"
            >
              Extend 7 Days
            </Button>
            {loan.status !== "Returned" && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => setReturnConfirm(true)}
                icon="assignment_return"
              >
                Return Volume
              </Button>
            )}
          </div>
        </div>

        {/* Content Columns */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-space-xl items-start">
          {/* Left Column: Book Details (5 cols) */}
          <div className="md:col-span-5 flex flex-col gap-space-md">
            <div className="aspect-[3/4] w-full max-w-xs mx-auto rounded-2xl overflow-hidden shadow-lg border border-outline-variant/30 bg-surface-container-low">
              <img
                src={loan.bookCover}
                alt={loan.bookTitle}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-center space-y-1">
              <h3 className="font-title-md text-title-md font-bold text-on-surface">
                {loan.bookTitle}
              </h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                {loan.bookAuthor}
              </p>
              <span className="font-caption text-caption text-secondary font-mono block">
                {loan.shelfLocation}
              </span>
            </div>
          </div>

          {/* Right Column: Loan Timeline & Verification Barcode (7 cols) */}
          <div className="md:col-span-7 space-y-space-md">
            <div className="p-space-md rounded-2xl bg-surface-container-low border border-outline-variant/20 space-y-3">
              <h4 className="font-title-md text-title-md font-bold text-on-surface">
                Circulation Schedule
              </h4>
              <div className="grid grid-cols-2 gap-space-sm text-caption">
                <div className="p-3 rounded-xl bg-surface-container-lowest">
                  <span className="text-on-surface-variant block">Date Borrowed:</span>
                  <span className="font-title-md text-title-md font-bold text-on-surface">
                    {loan.borrowDate}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-surface-container-lowest">
                  <span className="text-on-surface-variant block">Scheduled Due Date:</span>
                  <span className={`font-title-md text-title-md font-bold ${loan.status === "Overdue" ? "text-error" : "text-secondary"}`}>
                    {loan.dueDate}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-surface-container-lowest">
                  <span className="text-on-surface-variant block">Renewals Permitted:</span>
                  <span className="font-title-md text-title-md font-bold text-on-surface">
                    {loan.extensionsCount} / {loan.maxExtensions} Used
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-surface-container-lowest">
                  <span className="text-on-surface-variant block">Accrued Fines:</span>
                  <span className={`font-title-md text-title-md font-bold ${loan.fineAmount > 0 ? "text-error" : "text-emerald-700"}`}>
                    Rp{loan.fineAmount.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Verification Barcode Token */}
            <div className="p-space-md rounded-2xl bg-surface-container-lowest border border-outline-variant/30 text-center space-y-space-xs">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-semibold">
                Archival Desk Barcode
              </span>
              <div className="py-2 px-4 bg-white rounded-lg border border-outline-variant/20 inline-block">
                <div className="font-mono text-xl tracking-[0.3em] font-bold text-black select-all">
                  ||| | |||| | || ||| || |||
                </div>
                <span className="font-mono text-caption text-on-surface font-semibold tracking-wider">
                  {loan.id}
                </span>
              </div>
              <p className="font-caption text-caption text-on-surface-variant">
                Present this barcode token at the circulation desk or automated drop box scanner for instant check-in.
              </p>
            </div>

            {/* Procedural Instructions */}
            <div className="p-space-md rounded-2xl bg-surface-container-low text-caption space-y-1">
              <strong className="font-bold text-on-surface block">Lending Guidelines:</strong>
              <p className="text-on-surface-variant leading-relaxed">
                {loan.notes}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Dialogs */}
      <ConfirmDialog
        isOpen={returnConfirm}
        onClose={() => setReturnConfirm(false)}
        onConfirm={handleReturn}
        title="Check In Volume"
        message="Are you returning this book to the circulation desk? This action will restore 1 available loan slot to your member account."
        confirmText="Confirm Return"
        cancelText="Cancel"
      />

      <ConfirmDialog
        isOpen={extendConfirm}
        onClose={() => setExtendConfirm(false)}
        onConfirm={handleExtend}
        title="Confirm Loan Renewal"
        message="Extend borrowing period by 7 days? Only 1 renewal is authorized per volume."
        confirmText="Confirm Extension"
        cancelText="Cancel"
        variant="secondary"
      />
    </div>
  );
};
