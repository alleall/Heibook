import React, { useMemo, useState } from "react";
import { useLibrary } from "../../context/LibraryContext";
import { Button } from "../../components/common/Button";
import { StatusBadge } from "../../components/common/StatusBadge";
import { EmptyState } from "../../components/common/EmptyState";
import { NoticeBanner } from "../../components/common/NoticeBanner";
import memberImage from "../../components/images/member.jpg";

export default function MemberDetailPage({ memberId, onNavigate }) {
  const { members, borrowings, updateMemberStatus, returnBook, extendLoan } = useLibrary();

  const [activeTab, setActiveTab] = useState("active"); // "active" | "history"

  // Find member
  const member = useMemo(() => {
    return members.find((m) => m.id === memberId) || members[0];
  }, [members, memberId]);

  // Member's active and historical loans
  const memberLoans = useMemo(() => {
    return borrowings.filter((b) => b.memberId === member?.id);
  }, [borrowings, member]);

  const activeLoans = useMemo(() => {
    return memberLoans.filter((b) => b.status !== "Returned");
  }, [memberLoans]);

  const historyLoans = useMemo(() => {
    return memberLoans.filter((b) => b.status === "Returned");
  }, [memberLoans]);

  // Total fines accrued
  const totalFines = useMemo(() => {
    return activeLoans.reduce((sum, loan) => sum + (loan.fineAmount || 0), 0);
  }, [activeLoans]);

  if (!member) {
    return (
      <EmptyState
        icon="person_off"
        title="Patron Record Not Found"
        description="The requested institutional membership ID does not exist in the ledger."
        actionText="Back to Patron Directory"
        onAction={() => onNavigate && onNavigate("/admin/members")}
      />
    );
  }

  const handleToggleStatus = () => {
    const nextStatus = member.status === "Active" ? "Suspended" : "Active";
    updateMemberStatus(member.id, nextStatus);
  };

  return (
    <div className="space-y-6">
      {/* Back button & Title bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-surface-border pb-5">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate && onNavigate("/admin/members")}
            className="w-9 h-9 rounded-lg border border-surface-border flex items-center justify-center text-text-secondary hover:bg-surface-ground transition-colors"
          >
            <span className="material-symbols-outlined text-xl">arrow_back</span>
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-2xl font-bold text-text-primary tracking-tight">
                Patron Circulation Audit
              </h1>
              <span className="font-mono text-xs px-2 py-0.5 rounded bg-surface-ground border border-surface-border text-text-muted">
                {member.id}
              </span>
            </div>
            <p className="text-sm text-text-secondary">
              Review active borrowings, return ledger, and institutional reader privileges.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={member.status === "Active" ? "secondary" : "primary"}
            icon={member.status === "Active" ? "block" : "check_circle"}
            onClick={handleToggleStatus}
          >
            {member.status === "Active" ? "Suspend Privileges" : "Restore Privileges"}
          </Button>
        </div>
      </div>

      {member.status === "Suspended" && (
        <NoticeBanner
          type="error"
          title="Account Circulation Suspended"
          message="This patron account is currently flagged. Borrowing privileges are disabled until clearance by library administration."
        />
      )}

      {/* Profile Overview Card */}
      <div className="bg-surface-card rounded-xl border border-surface-border p-6 shadow-subtle flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
        <div className="flex items-center gap-4">
          <img
            src={member.avatar || memberImage}
            alt={member.name || "Member Avatar"}
            className="w-16 h-16 rounded-full object-cover border-2 border-primary-500 flex-shrink-0"
            onError={(e) => {
              e.target.src = memberImage;
            }}
          />
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="font-serif text-xl font-bold text-text-primary">{member.name}</h2>
              <StatusBadge status={member.status} />
            </div>
            <p className="text-sm text-text-secondary mt-0.5">{member.email}</p>
            <div className="flex flex-wrap items-center gap-3 text-xs text-text-muted mt-1.5 font-mono">
              <span>Card: {member.membershipNumber || member.id}</span>
              <span>•</span>
              <span>Dept: {member.department || "General Humanities"}</span>
              <span>•</span>
              <span>Enrolled: {member.memberSince || "2024-01-15"}</span>
            </div>
          </div>
        </div>

        {/* Quick Numbers */}
        <div className="grid grid-cols-3 gap-4 w-full md:w-auto border-t md:border-t-0 md:border-l border-surface-border pt-4 md:pt-0 md:pl-6">
          <div>
            <span className="text-[11px] uppercase tracking-wider font-semibold text-text-muted block">
              Active Loans
            </span>
            <div className="font-serif text-2xl font-bold text-text-primary mt-0.5">
              {activeLoans.length}
              <span className="text-xs text-text-muted font-normal"> / {member.maxQuota || 3}</span>
            </div>
          </div>

          <div>
            <span className="text-[11px] uppercase tracking-wider font-semibold text-text-muted block">
              Read History
            </span>
            <div className="font-serif text-2xl font-bold text-text-primary mt-0.5">
              {historyLoans.length + (member.totalHistorical || 0)}
            </div>
          </div>

          <div>
            <span className="text-[11px] uppercase tracking-wider font-semibold text-text-muted block">
              Accrued Fines
            </span>
            <div className="font-serif text-xl font-bold text-rose-600 mt-0.5">
              Rp{totalFines.toLocaleString("id-ID")}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-surface-border">
        <button
          onClick={() => setActiveTab("active")}
          className={`pb-3 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${activeTab === "active"
            ? "border-primary-500 text-primary-600"
            : "border-transparent text-text-muted hover:text-text-primary"
            }`}
        >
          <span>Active Borrowings</span>
          <span className="px-2 py-0.5 rounded-full text-xs bg-surface-ground text-text-secondary">
            {activeLoans.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("history")}
          className={`pb-3 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${activeTab === "history"
            ? "border-primary-500 text-primary-600"
            : "border-transparent text-text-muted hover:text-text-primary"
            }`}
        >
          <span>Returned Archive</span>
          <span className="px-2 py-0.5 rounded-full text-xs bg-surface-ground text-text-secondary">
            {historyLoans.length}
          </span>
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "active" ? (
        activeLoans.length === 0 ? (
          <EmptyState
            icon="auto_stories"
            title="No Active Loans"
            description="This patron does not currently have any physical copies checked out from the library stacks."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeLoans.map((loan) => (
              <div
                key={loan.id}
                className="bg-surface-card rounded-xl border border-surface-border p-4 shadow-subtle flex gap-4"
              >
                <img
                  src={loan.bookCover}
                  alt={loan.bookTitle}
                  className="w-16 h-24 object-cover rounded-lg border border-surface-border shadow-subtle flex-shrink-0"
                />
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <StatusBadge status={loan.status} />
                      <span className="font-mono text-[11px] text-text-muted">{loan.id}</span>
                    </div>

                    <h4 className="font-serif font-bold text-sm text-text-primary truncate mt-1">
                      {loan.bookTitle}
                    </h4>
                    <p className="text-xs text-text-secondary truncate">{loan.bookAuthor}</p>

                    <div className="flex items-center gap-3 text-xs text-text-muted mt-2">
                      <span>Borrowed: {loan.borrowDate}</span>
                      <span>•</span>
                      <span className="font-semibold text-text-primary">Due: {loan.dueDate}</span>
                    </div>

                    {loan.status === "Overdue" && (
                      <p className="text-xs text-rose-600 font-semibold mt-1">
                        Fine: Rp{(loan.fineAmount || 0).toLocaleString("id-ID")}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-end gap-2 mt-3 pt-2 border-t border-surface-border">
                    <Button
                      variant="secondary"
                      size="sm"
                      icon="update"
                      disabled={loan.extensionsCount >= loan.maxExtensions || loan.status === "Overdue"}
                      onClick={() => extendLoan(loan.id)}
                    >
                      Renew
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      icon="assignment_turned_in"
                      onClick={() => returnBook(loan.id)}
                    >
                      Check-In
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      ) : historyLoans.length === 0 ? (
        <EmptyState
          icon="history"
          title="No Historical Records"
          description="Past circulation transactions will appear here once the patron returns their checked-out volumes."
        />
      ) : (
        <div className="bg-surface-card rounded-xl border border-surface-border overflow-hidden shadow-subtle">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface-ground border-b border-surface-border text-xs uppercase font-semibold text-text-muted">
                <tr>
                  <th className="py-3.5 px-4">Circulation ID</th>
                  <th className="py-3.5 px-4">Title & Author</th>
                  <th className="py-3.5 px-4">Borrow Date</th>
                  <th className="py-3.5 px-4">Return Date</th>
                  <th className="py-3.5 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border text-text-primary">
                {historyLoans.map((loan) => (
                  <tr key={loan.id} className="hover:bg-surface-ground/50 transition-colors">
                    <td className="py-3 px-4 font-mono text-xs text-text-muted">{loan.id}</td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-text-primary">{loan.bookTitle}</div>
                      <div className="text-xs text-text-muted">{loan.bookAuthor}</div>
                    </td>
                    <td className="py-3 px-4 text-xs text-text-secondary">{loan.borrowDate}</td>
                    <td className="py-3 px-4 text-xs text-emerald-600 font-medium">
                      {loan.returnDate || "Archived"}
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status="Returned" />
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
