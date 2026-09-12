import React, { useState } from "react";
import { useLibrary } from "../../context/LibraryContext";
import { Input } from "../../components/forms/Input";
import { Button } from "../../components/common/Button";

export const MemberSettingsPage = () => {
  const { addToast } = useLibrary();
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");

  const [notifications, setNotifications] = useState({
    dueReminder: true,
    overdueAlert: true,
    newAccessions: false,
    emailReceipts: true
  });

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (!currentPw || !newPw) {
      addToast("error", "Password Error", "Please fill in all passphrase fields.");
      return;
    }
    if (newPw !== confirmPw) {
      addToast("error", "Mismatch", "New passphrases do not match.");
      return;
    }
    addToast("success", "Security Updated", "Your security passphrase has been successfully modified.");
    setCurrentPw("");
    setNewPw("");
    setConfirmPw("");
  };

  const handleNotificationSave = () => {
    addToast("success", "Preferences Saved", "Circulation notification preferences recorded.");
  };

  return (
    <div className="space-y-space-xl max-w-4xl">
      <div className="pb-space-sm border-b border-outline-variant/20">
        <h1 className="font-headline-xl text-headline-xl text-on-surface font-extrabold tracking-tight">
          Member Settings
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Manage circulation alerts, email reminders, and account security.
        </p>
      </div>

      {/* Circulation Notification Settings */}
      <div className="p-6 sm:p-space-lg rounded-3xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs space-y-space-md">
        <div className="flex items-center gap-space-xs font-title-md text-title-md font-bold text-on-surface">
          <span className="material-symbols-outlined text-secondary text-[22px]">notifications</span>
          <span>Circulation Reminders & Alerts</span>
        </div>

        <div className="space-y-space-sm divide-y divide-outline-variant/10 text-body-sm">
          <label className="flex items-center justify-between py-2 cursor-pointer">
            <div>
              <strong className="block text-on-surface font-semibold">Due Date Reminders (48h AdMinerva McGonagall)</strong>
              <span className="font-caption text-caption text-on-surface-variant">
                Receive an email notice 2 days prior to scheduled book return date.
              </span>
            </div>
            <input
              type="checkbox"
              checked={notifications.dueReminder}
              onChange={(e) => setNotifications({ ...notifications, dueReminder: e.target.checked })}
              className="w-5 h-5 rounded border-outline text-secondary focus:ring-secondary cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between py-2 cursor-pointer">
            <div>
              <strong className="block text-on-surface font-semibold">Overdue Protocol Alerts</strong>
              <span className="font-caption text-caption text-on-surface-variant">
                Instant notification when a loan enters overdue status with fine details.
              </span>
            </div>
            <input
              type="checkbox"
              checked={notifications.overdueAlert}
              onChange={(e) => setNotifications({ ...notifications, overdueAlert: e.target.checked })}
              className="w-5 h-5 rounded border-outline text-secondary focus:ring-secondary cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between py-2 cursor-pointer">
            <div>
              <strong className="block text-on-surface font-semibold">Circulation Receipts</strong>
              <span className="font-caption text-caption text-on-surface-variant">
                Email formal digital accession slips upon borrowing and returning volumes.
              </span>
            </div>
            <input
              type="checkbox"
              checked={notifications.emailReceipts}
              onChange={(e) => setNotifications({ ...notifications, emailReceipts: e.target.checked })}
              className="w-5 h-5 rounded border-outline text-secondary focus:ring-secondary cursor-pointer"
            />
          </label>
        </div>

        <div className="pt-2 flex justify-end">
          <Button variant="primary" size="sm" onClick={handleNotificationSave}>
            Save Preferences
          </Button>
        </div>
      </div>

      {/* Security Passphrase Change */}
      <div className="p-6 sm:p-space-lg rounded-3xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs space-y-space-md">
        <div className="flex items-center gap-space-xs font-title-md text-title-md font-bold text-on-surface">
          <span className="material-symbols-outlined text-secondary text-[22px]">lock</span>
          <span>Change Security Passphrase</span>
        </div>

        <form onSubmit={handlePasswordSubmit} className="space-y-space-sm max-w-lg">
          <Input
            label="Current Passphrase"
            id="currentPw"
            type="password"
            value={currentPw}
            onChange={(e) => setCurrentPw(e.target.value)}
            required
            icon="key"
          />
          <Input
            label="New Passphrase"
            id="newPw"
            type="password"
            value={newPw}
            onChange={(e) => setNewPw(e.target.value)}
            required
            icon="lock"
            helperText="Minimum 8 characters with at least 1 number and symbol."
          />
          <Input
            label="Confirm New Passphrase"
            id="confirmPw"
            type="password"
            value={confirmPw}
            onChange={(e) => setConfirmPw(e.target.value)}
            required
            icon="lock_reset"
          />

          <div className="pt-2">
            <Button type="submit" variant="secondary" size="md" icon="security">
              Update Passphrase
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
