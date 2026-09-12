import React, { useState } from "react";
import { useLibrary } from "../../context/LibraryContext";
import { StatusBadge } from "../../components/common/StatusBadge";
import { Button } from "../../components/common/Button";
import { NoticeBanner } from "../../components/common/NoticeBanner";
import { ConfirmDialog } from "../../components/common/ConfirmDialog";

export const AdminDashboardPage = () => {
  const { stats, borrowings, returnBook, books, members, borrowBook } = useLibrary();
  const [returnLoanId, setReturnLoanId] = useState(null);

  // Quick Issue Loan State
  const [quickBookId, setQuickBookId] = useState(books[0]?.id || "");
  const [quickMemberId, setQuickMemberId] = useState(members[0]?.id || "");

  const navigate = (path) => {
    window.location.hash = `#${path}`;
  };

  const handleQuickBorrow = (e) => {
    e.preventDefault();
    borrowBook(quickBookId, quickMemberId);
  };

  const handleReturnConfirm = () => {
    if (returnLoanId) {
      returnBook(returnLoanId);
      setReturnLoanId(null);
    }
  };

  const recentTransactions = borrowings.slice(0, 6);

  return (
    <div className="space-y-space-xl">
      {/* Top Operational Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md pb-space-sm border-b border-outline-variant/20">
        <div>
          <div className="flex items-center gap-space-xs font-label-sm text-label-sm text-secondary uppercase tracking-widest font-semibold">
            <span className="material-symbols-outlined text-[16px]">admin_panel_settings</span>
            <span>Archival Command & Curatorial Ledger</span>
          </div>
          <h1 className="font-headline-xl text-headline-xl text-on-surface font-extrabold tracking-tight mt-0.5">
            Admin Operations Dashboard
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Live telemetry of library circulation, collection accessions, and stack maintenance.
          </p>
        </div>

        {/* Quick Action Bar */}
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => navigate("/admin/books/create")} icon="add_box">
            Add Title
          </Button>
          <Button variant="outline" size="sm" onClick={() => navigate("/admin/loans")} icon="receipt_long">
            Issue Loan
          </Button>
          <Button variant="secondary" size="sm" onClick={() => navigate("/admin/returns")} icon="assignment_return">
            Process Return
          </Button>
        </div>
      </div>

      {/* Business Rules Protocol Banner */}
      <NoticeBanner
        icon="verified_user"
        title="Active Circulation Protocol:"
        message="Maximum 3 titles per scholar patron · 7 calendar days loan duration · 1 renewal permitted · Overdue fine of Rp1.000 / day enforced."
        actionText="Manage Settings"
        onAction={() => navigate("/admin/settings")}
      />

      {/* Top KPI Stats (4-grid) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-space-md">
        {/* Stat 1: Total Catalog */}
        <div
          onClick={() => navigate("/admin/books")}
          className="p-space-lg rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs hover:border-secondary/40 transition-all cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
              Master Catalog
            </span>
            <div className="w-9 h-9 rounded-xl bg-surface-container text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">auto_stories</span>
            </div>
          </div>
          <div className="mt-space-md">
            <div className="font-headline-xl text-headline-xl font-extrabold text-on-surface">
              {stats.totalCatalogTitles.toLocaleString()}
            </div>
            <p className="font-caption text-caption text-on-surface-variant mt-1">
              {stats.totalCopies.toLocaleString()} physical copies in stacks
            </p>
          </div>
        </div>

        {/* Stat 2: Registered Members */}
        <div
          onClick={() => navigate("/admin/members")}
          className="p-space-lg rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs hover:border-secondary/40 transition-all cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
              Active Scholars
            </span>
            <div className="w-9 h-9 rounded-xl bg-surface-container text-emerald-800 flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">groups</span>
            </div>
          </div>
          <div className="mt-space-md">
            <div className="font-headline-xl text-headline-xl font-extrabold text-on-surface">
              {stats.registeredMembers.toLocaleString()}
            </div>
            <p className="font-caption text-caption text-on-surface-variant mt-1">
              Patron accounts in good standing
            </p>
          </div>
        </div>

        {/* Stat 3: Currently Borrowed */}
        <div
          onClick={() => navigate("/admin/loans")}
          className="p-space-lg rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs hover:border-secondary/40 transition-all cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
              Active Circulations
            </span>
            <div className="w-9 h-9 rounded-xl bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">import_contacts</span>
            </div>
          </div>
          <div className="mt-space-md">
            <div className="font-headline-xl text-headline-xl font-extrabold text-on-surface">
              {stats.activeBorrowings.toLocaleString()}
            </div>
            <p className="font-caption text-caption text-on-surface-variant mt-1">
              Volumes checked out of stacks
            </p>
          </div>
        </div>

        {/* Stat 4: Overdue Alert */}
        <div
          onClick={() => navigate("/admin/overdue")}
          className="p-space-lg rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs hover:border-error/40 transition-all cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
              Overdue Alerts
            </span>
            <div className="w-9 h-9 rounded-xl bg-error-container text-error flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">warning</span>
            </div>
          </div>
          <div className="mt-space-md">
            <div className="font-headline-xl text-headline-xl font-extrabold text-error">
              {stats.overdueBooks.toLocaleString()}
            </div>
            <p className="font-caption text-caption text-on-surface-variant mt-1">
              Overdue recovery fee accruals
            </p>
          </div>
        </div>
      </div>

      {/* Two-Column Operations Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-space-xl items-start">
        {/* Left Column: Transactions Table & Trend Chart (7 cols on xl) */}
        <div className="xl:col-span-7 space-y-space-lg">
          {/* Recent Live Circulation Table */}
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-xs overflow-hidden">
            <div className="p-space-md border-b border-outline-variant/20 flex items-center justify-between">
              <div>
                <h3 className="font-title-md text-title-md font-bold text-on-surface">
                  Recent Circulation Activity
                </h3>
                <span className="font-caption text-caption text-on-surface-variant">
                  Live transaction telemetry from main desk and drop boxes
                </span>
              </div>
              <button
                onClick={() => navigate("/admin/loans")}
                className="font-caption text-secondary hover:underline font-semibold"
              >
                View Full Ledger →
              </button>
            </div>

            <div className="overflow-x-auto table-scroll-container">
              <table className="w-full text-left font-body-sm text-body-sm">
                <thead className="bg-surface-container-low border-b border-outline-variant/20 font-label-md text-label-md text-on-surface uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="py-3 px-4">Token / Title</th>
                    <th className="py-3 px-4">Patron</th>
                    <th className="py-3 px-4">Due Date</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10 text-on-surface">
                  {recentTransactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-surface-container-low/40 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-title-md text-[13px] font-bold text-on-surface truncate max-w-[200px]" title={tx.bookTitle}>
                          {tx.bookTitle}
                        </div>
                        <div className="font-mono text-caption text-on-surface-variant">
                          {tx.id}
                        </div>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="font-medium text-on-surface">{tx.memberName}</div>
                        <div className="font-caption text-on-surface-variant text-[11px]">{tx.memberId}</div>
                      </td>
                      <td className="py-3 px-4 font-mono text-caption whitespace-nowrap">
                        {tx.dueDate}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <StatusBadge status={tx.status} />
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        {tx.status !== "Returned" ? (
                          <Button
                            variant="subtle"
                            size="sm"
                            onClick={() => setReturnLoanId(tx.id)}
                            className="text-[12px] py-1"
                          >
                            Check In
                          </Button>
                        ) : (
                          <span className="text-caption text-on-surface-variant font-medium">Archived</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Weekly Circulation Distribution Bar Chart */}
          <div className="p-space-lg rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs space-y-space-md">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-title-md text-title-md font-bold text-on-surface">
                  Weekly Lending Activity Distribution
                </h3>
                <p className="font-caption text-caption text-on-surface-variant">
                  Daily loan issuances and check-in volumes over the last 7 days
                </p>
              </div>
              <div className="flex items-center gap-3 text-caption">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded bg-primary" /> Borrows
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded bg-secondary" /> Returns
                </span>
              </div>
            </div>

            {/* Custom SVG Bar Chart */}
            <div className="h-48 w-full flex items-end justify-between gap-3 pt-4 px-2 border-b border-outline-variant/20">
              {stats.weeklyCirculation.map((day) => {
                const maxVal = 100;
                const borrowHeight = (day.borrows / maxVal) * 100;
                const returnHeight = (day.returns / maxVal) * 100;

                return (
                  <div key={day.day} className="flex-1 flex flex-col items-center gap-1 h-full justify-end group">
                    <div className="w-full flex items-end justify-center gap-1 h-36">
                      <div
                        style={{ height: `${borrowHeight}%` }}
                        className="w-full max-w-[14px] bg-primary rounded-t group-hover:bg-primary-container transition-all"
                        title={`${day.day} Borrows: ${day.borrows}`}
                      />
                      <div
                        style={{ height: `${returnHeight}%` }}
                        className="w-full max-w-[14px] bg-secondary rounded-t group-hover:bg-[#8b350c] transition-all"
                        title={`${day.day} Returns: ${day.returns}`}
                      />
                    </div>
                    <span className="font-caption text-caption text-on-surface-variant font-medium mt-1">
                      {day.day}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Fast Issue Desk & Disciplines (5 cols on xl) */}
        <div className="xl:col-span-5 space-y-space-lg">
          {/* Rapid Circulation Desk Module */}
          <div className="p-space-lg rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs space-y-space-md">
            <div className="flex items-center gap-2 border-b border-outline-variant/20 pb-2">
              <div className="w-8 h-8 rounded-lg bg-secondary text-on-secondary flex items-center justify-center shadow-xs">
                <span className="material-symbols-outlined text-[18px]">barcode_scanner</span>
              </div>
              <div>
                <h3 className="font-title-md text-title-md font-bold text-on-surface">
                  Circulation Desk Express
                </h3>
                <p className="font-caption text-caption text-on-surface-variant">
                  Instantly issue accession loans to registered patrons
                </p>
              </div>
            </div>

            <form onSubmit={handleQuickBorrow} className="space-y-space-sm">
              <div>
                <label className="font-label-md text-label-md text-on-surface font-semibold block mb-1">
                  Select Volume (In Stacks)
                </label>
                <select
                  value={quickBookId}
                  onChange={(e) => setQuickBookId(e.target.value)}
                  className="w-full h-10 px-3 bg-surface-container-low border border-outline-variant/60 rounded-lg font-body-sm text-body-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-secondary"
                >
                  {books.map((b) => (
                    <option key={b.id} value={b.id} disabled={b.availableCopies <= 0}>
                      {b.id} · {b.title} ({b.availableCopies} available)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-label-md text-label-md text-on-surface font-semibold block mb-1">
                  Select Registered Patron
                </label>
                <select
                  value={quickMemberId}
                  onChange={(e) => setQuickMemberId(e.target.value)}
                  className="w-full h-10 px-3 bg-surface-container-low border border-outline-variant/60 rounded-lg font-body-sm text-body-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-secondary"
                >
                  {members.map((m) => (
                    <option key={m.id} value={m.id} disabled={m.activeBorrowings >= 3 || m.status === "Suspended"}>
                      {m.membershipNumber} · {m.name} ({m.activeBorrowings}/3 loans) {m.status === "Suspended" ? "- Suspended" : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-2">
                <Button type="submit" variant="primary" size="md" fullWidth icon="add_task">
                  Authorize & Issue Loan
                </Button>
              </div>
            </form>
          </div>

          {/* Popular Disciplines Breakdown */}
          <div className="p-space-lg rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs space-y-space-md">
            <h3 className="font-title-md text-title-md font-bold text-on-surface">
              Curatorial Circulation Share
            </h3>

            <div className="space-y-space-sm">
              {stats.popularDisciplines.map((item) => (
                <div key={item.name} className="space-y-1">
                  <div className="flex justify-between text-body-sm">
                    <span className="font-medium text-on-surface">{item.name}</span>
                    <span className="font-bold text-secondary font-mono">{item.percentage}%</span>
                  </div>
                  <div className="w-full bg-surface-container rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-secondary h-full rounded-full"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Return Dialog */}
      <ConfirmDialog
        isOpen={!!returnLoanId}
        onClose={() => setReturnLoanId(null)}
        onConfirm={handleReturnConfirm}
        title="Check In Volume to Stacks"
        message="Confirm that this physical copy has been inspected and returned to the library stacks? Book inventory will be updated."
        confirmText="Confirm Check In"
        cancelText="Cancel"
      />
    </div>
  );
};
