import React, { useState } from "react";
import { useLibrary } from "../../context/LibraryContext";
import { Button } from "../../components/common/Button";
import { Input } from "../../components/forms/Input";
import { Textarea } from "../../components/forms/Textarea";

export default function AdminSettingsPage({ onNavigate }) {
  const { circulationPolicy, updateCirculationPolicy, addToast } = useLibrary();

  // Local state initialized with context circulation policy
  const [policyForm, setPolicyForm] = useState({
    maxQuota: circulationPolicy?.maxQuota || 3,
    lendingDays: circulationPolicy?.lendingDays || 7,
    maxExtensions: circulationPolicy?.maxExtensions || 1,
    finePerDay: circulationPolicy?.finePerDay || 1000
  });

  // Institutional Info state
  const [institutionForm, setInstitutionForm] = useState({
    libraryName: "Heibook Digital Library Platform",
    institution: "Institute for AdMinerva McGonagalld Architectural & Humanities Studies",
    deskHours: "Monday – Saturday: 08:00 – 21:00 WIB",
    contactEmail: "librarian@heibook.ac.id",
    address: "West Reading Stacks, Tower B, Level 3, Campus Core"
  });

  const handleSavePolicy = (e) => {
    e.preventDefault();
    updateCirculationPolicy({
      maxQuota: parseInt(policyForm.maxQuota, 10) || 3,
      lendingDays: parseInt(policyForm.lendingDays, 10) || 7,
      maxExtensions: parseInt(policyForm.maxExtensions, 10) || 1,
      finePerDay: parseInt(policyForm.finePerDay, 10) || 1000
    });
  };

  const handleSaveInstitution = (e) => {
    e.preventDefault();
    addToast("success", "Institutional Settings Saved", "Library information saved to system ledger.");
  };

  const handleReindex = () => {
    addToast(
      "info",
      "Ledger Reindexed",
      "Catalog indices, Dewey Decimal classifications, and patron quotas refreshed."
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-surface-border pb-5">
        <div>
          <h1 className="font-serif text-2xl font-bold text-text-primary tracking-tight">
            Library System Configuration
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Configure circulation policies, lending quotas, fine tariffs, and institutional premises metadata.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Circulation Policy */}
        <div className="lg:col-span-2 space-y-6">
          {/* Circulation Policies Form */}
          <div className="bg-surface-card rounded-xl border border-surface-border p-6 shadow-subtle space-y-5">
            <div className="flex items-center gap-3 border-b border-surface-border pb-4">
              <div className="w-10 h-10 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center">
                <span className="material-symbols-outlined text-2xl">policy</span>
              </div>
              <div>
                <h2 className="font-serif font-bold text-lg text-text-primary">
                  Circulation & Lending Policy
                </h2>
                <p className="text-xs text-text-secondary">
                  Enforced business rules across patron checkouts, renewals, and overdue calculations.
                </p>
              </div>
            </div>

            <form onSubmit={handleSavePolicy} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Maximum Active Loans Quota"
                  type="number"
                  min="1"
                  max="10"
                  value={policyForm.maxQuota}
                  onChange={(e) => setPolicyForm({ ...policyForm, maxQuota: e.target.value })}
                  helperText="Maximum physical copies a single patron may borrow simultaneously."
                  required
                />

                <Input
                  label="Standard Lending Duration (Days)"
                  type="number"
                  min="1"
                  max="30"
                  value={policyForm.lendingDays}
                  onChange={(e) => setPolicyForm({ ...policyForm, lendingDays: e.target.value })}
                  helperText="Initial lending window duration before marked as due."
                  required
                />

                <Input
                  label="Maximum Allowed Renewals"
                  type="number"
                  min="0"
                  max="5"
                  value={policyForm.maxExtensions}
                  onChange={(e) => setPolicyForm({ ...policyForm, maxExtensions: e.target.value })}
                  helperText="Number of times an active loan may be extended before return."
                  required
                />

                <Input
                  label="Overdue Fine Tariff (Rp / Day)"
                  type="number"
                  min="0"
                  step="500"
                  value={policyForm.finePerDay}
                  onChange={(e) => setPolicyForm({ ...policyForm, finePerDay: e.target.value })}
                  helperText="Calculated daily penalty per volume once past due date."
                  required
                />
              </div>

              <div className="flex justify-end pt-3 border-t border-surface-border">
                <Button variant="primary" type="submit" icon="save">
                  Save Circulation Rules
                </Button>
              </div>
            </form>
          </div>

          {/* Institutional Information */}
          <div className="bg-surface-card rounded-xl border border-surface-border p-6 shadow-subtle space-y-5">
            <div className="flex items-center gap-3 border-b border-surface-border pb-4">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <span className="material-symbols-outlined text-2xl">account_balance</span>
              </div>
              <div>
                <h2 className="font-serif font-bold text-lg text-text-primary">
                  Institution & Premises Information
                </h2>
                <p className="text-xs text-text-secondary">
                  Public library identity, physical desk operational hours, and circulation contacts.
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveInstitution} className="space-y-4">
              <Input
                label="Library Platform Name"
                value={institutionForm.libraryName}
                onChange={(e) =>
                  setInstitutionForm({ ...institutionForm, libraryName: e.target.value })
                }
              />

              <Input
                label="Parent University / Research Institution"
                value={institutionForm.institution}
                onChange={(e) =>
                  setInstitutionForm({ ...institutionForm, institution: e.target.value })
                }
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Circulation Desk Hours"
                  value={institutionForm.deskHours}
                  onChange={(e) =>
                    setInstitutionForm({ ...institutionForm, deskHours: e.target.value })
                  }
                />

                <Input
                  label="Archivist Inquiries Email"
                  type="email"
                  value={institutionForm.contactEmail}
                  onChange={(e) =>
                    setInstitutionForm({ ...institutionForm, contactEmail: e.target.value })
                  }
                />
              </div>

              <Textarea
                label="Physical Facility Location"
                rows={2}
                value={institutionForm.address}
                onChange={(e) =>
                  setInstitutionForm({ ...institutionForm, address: e.target.value })
                }
              />

              <div className="flex justify-end pt-3 border-t border-surface-border">
                <Button variant="primary" type="submit" icon="save">
                  Save Institutional Info
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: Maintenance & System Ledger */}
        <div className="space-y-6">
          <div className="bg-surface-card rounded-xl border border-surface-border p-6 shadow-subtle space-y-4">
            <h3 className="font-serif font-bold text-lg text-text-primary">
              Catalog Ledger Maintenance
            </h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              Administrative utilities for verifying bibliographic checksums, synchronizing shelf positions, and rebuilding search inverted indexes.
            </p>

            <div className="space-y-3 pt-2">
              <Button
                variant="secondary"
                fullWidth
                icon="refresh"
                onClick={handleReindex}
              >
                Rebuild Dewey Decimal Index
              </Button>

              <Button
                variant="secondary"
                fullWidth
                icon="cleaning_services"
                onClick={() =>
                  addToast("info", "Cache Cleared", "Temporary query cache purged successfully.")
                }
              >
                Flush Search Cache
              </Button>

              <Button
                variant="secondary"
                fullWidth
                icon="download"
                onClick={() =>
                  addToast(
                    "success",
                    "Ledger Dump Created",
                    "Bibliographic ledger snapshot exported to secure storage."
                  )
                }
              >
                Download Ledger Backup
              </Button>
            </div>
          </div>

          {/* System Identity Summary */}
          <div className="bg-surface-card rounded-xl border border-surface-border p-5 shadow-subtle space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-text-muted">
              Platform Ledger Status
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-text-muted">Environment:</span>
                <span className="font-mono font-medium text-text-primary">Institutional Core</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-text-muted">Classification System:</span>
                <span className="font-mono font-medium text-text-primary">DDC 23rd Edition</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-text-muted">Catalog Engine:</span>
                <span className="font-mono font-medium text-text-primary">Active</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-text-muted">Compliance:</span>
                <span className="font-mono font-semibold text-emerald-600">Verified</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
