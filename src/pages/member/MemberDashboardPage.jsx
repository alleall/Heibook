import React, { useState } from "react";
import { useLibrary } from "../../context/LibraryContext";
import { StatusBadge } from "../../components/common/StatusBadge";
import { Button } from "../../components/common/Button";
import { NoticeBanner } from "../../components/common/NoticeBanner";
import { ConfirmDialog } from "../../components/common/ConfirmDialog";
import { BookDetailModal } from "../../components/books/BookDetailModal";

export const MemberDashboardPage = () => {
  const { borrowings, currentUser, returnBook, extendLoan, books, borrowBook } = useLibrary();

  const [returnLoanId, setReturnLoanId] = useState(null);
  const [extendLoanId, setExtendLoanId] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const navigate = (path) => {
    window.location.hash = `#${path}`;
  };

  // Member's active loans
  const myActiveLoans = borrowings.filter(
    (b) => b.memberId === currentUser.memberId && b.status !== "Returned"
  );

  const dueSoonCount = myActiveLoans.filter((b) => b.status === "Due Soon").length;
  const overdueCount = myActiveLoans.filter((b) => b.status === "Overdue").length;
  const totalHistoricalCount = borrowings.filter(
    (b) => b.memberId === currentUser.memberId
  ).length;

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

  // Curated picks for recommendation sidebar
  const recommendedPicks = books
    .filter((b) => !myActiveLoans.some((l) => l.bookId === b.id))
    .slice(0, 3);

  return (
    <div className="flex flex-col w-full space-y-space-xl">
      {/* Header & Greeting Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md pb-space-sm border-b border-outline-variant/20">
        <div>
          <div className="flex items-center gap-space-xs font-label-sm text-label-sm text-secondary uppercase tracking-widest font-semibold">
            <span className="material-symbols-outlined text-[16px]">account_circle</span>
            <span>Scholar Desk · Circulation Status</span>
          </div>
          <h1 className="font-headline-xl text-headline-xl text-on-surface font-extrabold tracking-tight mt-0.5">
            Welcome, {currentUser.name}
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            {currentUser.title} · Member ID: <strong className="font-mono text-on-surface">{currentUser.memberId}</strong>
          </p>
        </div>

        <div className="flex items-center gap-space-sm">
          <Button variant="outline" size="sm" onClick={() => navigate("/my-loans")} icon="import_contacts">
            My Loans ({myActiveLoans.length})
          </Button>
          <Button variant="primary" size="sm" onClick={() => navigate("/books")} icon="add">
            Borrow New Title
          </Button>
        </div>
      </div>

      {/* Circulation KPI Quad Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
        {/* Card 1: Currently Borrowed */}
        <div className="p-space-lg rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
              Currently Borrowed
            </span>
            <div className="w-8 h-8 rounded-lg bg-surface-container text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">book</span>
            </div>
          </div>
          <div className="mt-space-md">
            <div className="font-headline-xl text-headline-xl font-extrabold text-on-surface">
              {myActiveLoans.length} <span className="text-body-md font-normal text-on-surface-variant">/ 3 quota</span>
            </div>
            <div className="w-full bg-surface-container rounded-full h-1.5 mt-2 overflow-hidden">
              <div
                className="bg-primary h-full rounded-full transition-all"
                style={{ width: `${(myActiveLoans.length / 3) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Card 2: Due Soon */}
        <div className="p-space-lg rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
              Due Soon (≤ 2 Days)
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-800 flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">schedule</span>
            </div>
          </div>
          <div className="mt-space-md">
            <div className="font-headline-xl text-headline-xl font-extrabold text-amber-700">
              {dueSoonCount}
            </div>
            <p className="font-caption text-caption text-on-surface-variant mt-1">
              {dueSoonCount > 0 ? "Requires return or extension" : "No urgent deadlines"}
            </p>
          </div>
        </div>

        {/* Card 3: Overdue */}
        <div className="p-space-lg rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
              Overdue Loans
            </span>
            <div className="w-8 h-8 rounded-lg bg-error-container text-error flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">warning</span>
            </div>
          </div>
          <div className="mt-space-md">
            <div className={`font-headline-xl text-headline-xl font-extrabold ${overdueCount > 0 ? "text-error" : "text-on-surface"}`}>
              {overdueCount}
            </div>
            <p className="font-caption text-caption text-on-surface-variant mt-1">
              Fine: Rp1.000 / day per volume
            </p>
          </div>
        </div>

        {/* Card 4: Total Borrowed */}
        <div className="p-space-lg rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
              Historical Accessions
            </span>
            <div className="w-8 h-8 rounded-lg bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">history_edu</span>
            </div>
          </div>
          <div className="mt-space-md">
            <div className="font-headline-xl text-headline-xl font-extrabold text-on-surface">
              {totalHistoricalCount}
            </div>
            <p className="font-caption text-caption text-on-surface-variant mt-1">
              Completed reading journeys
            </p>
          </div>
        </div>
      </div>

      {/* Dynamic Policy Notice Banner */}
      <NoticeBanner
        icon="rule"
        title="Active Borrowing Status:"
        message={`You currently have ${myActiveLoans.length} of 3 active borrowing slots utilized. Books can be renewed once for an additional 7 days before their due date.`}
        actionText="Review Policy"
        onAction={() => navigate("/settings")}
      />

      {/* Main Asymmetric Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start">
        {/* Left Column: Currently Borrowed Detail Stream (8 cols) */}
        <div className="lg:col-span-8 space-y-space-lg">
          <div className="flex items-center justify-between">
            <h2 className="font-headline-md text-headline-md font-bold text-on-surface">
              Active Lending Stream
            </h2>
            <span className="font-caption text-caption text-on-surface-variant font-mono">
              {myActiveLoans.length} active volume(s)
            </span>
          </div>

          {myActiveLoans.length > 0 ? (
            <div className="space-y-space-md">
              {myActiveLoans.map((loan) => (
                <div
                  key={loan.id}
                  className="p-space-md rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs hover:shadow-md transition-all flex flex-col sm:flex-row items-start sm:items-center gap-space-md"
                >
                  {/* Book Jacket Art */}
                  <div
                    onClick={() => {
                      const b = books.find((x) => x.id === loan.bookId);
                      if (b) {
                        setSelectedBook(b);
                        setIsDetailModalOpen(true);
                      }
                    }}
                    className="w-20 h-28 flex-shrink-0 rounded-xl overflow-hidden bg-surface-container-low shadow-sm border border-outline-variant/20 cursor-pointer"
                  >
                    <img
                      src={loan.bookCover}
                      alt={loan.bookTitle}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Loan Metadata */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-caption text-caption text-on-surface-variant font-mono">
                        {loan.id} · {loan.ddc}
                      </span>
                      <StatusBadge status={loan.status} />
                    </div>

                    <h3
                      onClick={() => {
                        const b = books.find((x) => x.id === loan.bookId);
                        if (b) {
                          setSelectedBook(b);
                          setIsDetailModalOpen(true);
                        }
                      }}
                      className="font-title-md text-title-md font-bold text-on-surface hover:text-secondary transition-colors cursor-pointer truncate"
                      title={loan.bookTitle}
                    >
                      {loan.bookTitle}
                    </h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      {loan.bookAuthor}
                    </p>

                    {/* Schedule & Progress Track */}
                    <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-caption text-on-surface-variant">
                      <div>
                        Borrowed: <span className="font-semibold text-on-surface">{loan.borrowDate}</span>
                      </div>
                      <div>
                        Due Date:{" "}
                        <span className={`font-semibold ${loan.status === "Overdue" ? "text-error" : loan.status === "Due Soon" ? "text-amber-800" : "text-on-surface"}`}>
                          {loan.dueDate}
                        </span>
                      </div>
                      <div>
                        Renewed: <span className="font-semibold text-on-surface">{loan.extensionsCount}/1</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex sm:flex-col items-center gap-2 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-outline-variant/20 flex-shrink-0">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => setReturnLoanId(loan.id)}
                      className="flex-1 sm:flex-initial w-full"
                    >
                      Return Book
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={loan.extensionsCount >= loan.maxExtensions || loan.status === "Overdue"}
                      onClick={() => setExtendLoanId(loan.id)}
                      className="flex-1 sm:flex-initial w-full"
                    >
                      {loan.extensionsCount >= loan.maxExtensions ? "Renewed (1x)" : "Extend +7D"}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-space-xl rounded-2xl bg-surface-container-lowest border border-dashed border-outline-variant/60 text-center space-y-space-sm">
              <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center text-on-surface-variant mx-auto">
                <span className="material-symbols-outlined text-[28px]">auto_stories</span>
              </div>
              <h3 className="font-title-md text-title-md font-bold text-on-surface">
                No active borrowings
              </h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant max-w-sm mx-auto">
                You have 3 available loan slots. Explore our archival catalogue to checkout physical or digital copies.
              </p>
              <Button variant="secondary" size="sm" onClick={() => navigate("/books")} icon="search">
                Browse Archive Catalog
              </Button>
            </div>
          )}

          {/* Historical Reading Pattern Card */}
          <div className="p-space-lg rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs space-y-space-md">
            <div className="flex items-center justify-between">
              <h3 className="font-title-md text-title-md font-bold text-on-surface">
                Scholarly Activity & Reading Cadence
              </h3>
              <span className="font-caption text-caption text-secondary font-semibold">
                High Circulation Rating (98% On-Time)
              </span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
              Based on your archival record, your average lending cycle is <strong>5.4 days per volume</strong> with exemplary returns compliance.
            </p>
            <div className="grid grid-cols-3 gap-space-sm text-center pt-2 border-t border-outline-variant/20">
              <div className="p-2 rounded-xl bg-surface-container-low">
                <div className="font-headline-sm text-headline-sm font-bold text-on-surface">14</div>
                <div className="font-caption text-caption text-on-surface-variant">Volumes Read</div>
              </div>
              <div className="p-2 rounded-xl bg-surface-container-low">
                <div className="font-headline-sm text-headline-sm font-bold text-emerald-700">0</div>
                <div className="font-caption text-caption text-on-surface-variant">Outstanding Fines</div>
              </div>
              <div className="p-2 rounded-xl bg-surface-container-low">
                <div className="font-headline-sm text-headline-sm font-bold text-secondary">Level 3</div>
                <div className="font-caption text-caption text-on-surface-variant">Patron Tier</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Recommended For You & Physical Dropoff (4 cols) */}
        <div className="lg:col-span-4 space-y-space-lg">
          {/* Recommended Curations */}
          <div className="p-space-lg rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs space-y-space-md">
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-2">
              <h3 className="font-title-md text-title-md font-bold text-on-surface">
                Recommended For You
              </h3>
              <button
                onClick={() => navigate("/books")}
                className="font-caption text-secondary hover:underline font-semibold"
              >
                Catalog
              </button>
            </div>

            <div className="space-y-space-sm">
              {recommendedPicks.map((pick) => (
                <div
                  key={pick.id}
                  onClick={() => {
                    setSelectedBook(pick);
                    setIsDetailModalOpen(true);
                  }}
                  className="flex items-center gap-space-sm p-2 rounded-xl hover:bg-surface-container-low transition-colors cursor-pointer group"
                >
                  <img
                    src={pick.coverImage}
                    alt={pick.title}
                    className="w-12 h-16 rounded-lg object-cover bg-surface-container flex-shrink-0 shadow-xs"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="font-caption text-[11px] text-secondary font-semibold block uppercase tracking-wider">
                      {pick.categoryName}
                    </span>
                    <h4 className="font-body-sm text-body-sm font-bold text-on-surface group-hover:text-secondary transition-colors truncate">
                      {pick.title}
                    </h4>
                    <p className="font-caption text-caption text-on-surface-variant truncate">
                      {pick.author}
                    </p>
                  </div>
                  <span className="material-symbols-outlined text-[18px] text-on-surface-variant group-hover:text-secondary">
                    chevron_right
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Desk Dropoff Info Card */}
          <div className="p-space-lg rounded-2xl bg-surface-container-low border border-outline-variant/30 space-y-space-sm">
            <div className="flex items-center gap-space-xs font-title-md font-bold text-on-surface">
              <span className="material-symbols-outlined text-secondary text-[20px]">
                local_shipping
              </span>
              <span>Physical Drop-off Points</span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
              Books may be returned at:
            </p>
            <ul className="text-caption text-on-surface space-y-1.5 list-disc list-inside">
              <li>
                <strong className="font-semibold">Main Circulation Desk:</strong> Level 1, 08:00 – 21:00 WIB
              </li>
              <li>
                <strong className="font-semibold">East Archival Drop Box:</strong> Available 24/7 with automated barcode scanner
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Return Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!returnLoanId}
        onClose={() => setReturnLoanId(null)}
        onConfirm={handleReturnConfirm}
        title="Confirm Book Return"
        message="Are you returning this volume to the library stacks? The book stock will be replenished in the master catalog and your borrowing allowance will be updated."
        confirmText="Confirm Return"
        cancelText="Keep Borrowing"
        variant="primary"
        icon="assignment_return"
      />

      {/* Extend Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!extendLoanId}
        onClose={() => setExtendLoanId(null)}
        onConfirm={handleExtendConfirm}
        title="Extend Loan Duration"
        message="Extend this book's due date by an additional 7 calendar days? Please note that only 1 renewal is permitted per loan."
        confirmText="Extend +7 Days"
        cancelText="Cancel"
        variant="secondary"
        icon="update"
      />

      {/* Book Detail Modal */}
      {selectedBook && (
        <BookDetailModal
          book={selectedBook}
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          onBorrowConfirm={(b) => {
            borrowBook(b.id);
            setIsDetailModalOpen(false);
          }}
        />
      )}
    </div>
  );
};
