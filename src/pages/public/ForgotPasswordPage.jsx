import React, { useState } from "react";
import { Input } from "../../components/forms/Input";
import { Button } from "../../components/common/Button";

export const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = (path) => {
    window.location.hash = `#${path}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 400);
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center p-4 sm:p-6 lg:p-space-xl">
      <div className="w-full max-w-md bg-surface-container-lowest rounded-3xl shadow-xl border border-outline-variant/30 p-6 sm:p-space-xl space-y-space-lg">
        <div className="w-12 h-12 rounded-2xl bg-surface-container flex items-center justify-center text-secondary mb-2 shadow-xs">
          <span className="material-symbols-outlined text-[28px]">lock_reset</span>
        </div>

        <div className="space-y-1">
          <h2 className="font-headline-md text-headline-md font-extrabold text-on-surface">
            Reset Security Passphrase
          </h2>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Enter your registered patron email or membership number to receive recovery instructions.
          </p>
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-space-md">
            <Input
              label="Patron Email or Membership ID"
              id="resetEmail"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. allensiawood@gmail.com"
              required
              icon="mail"
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={loading}
              icon="send"
            >
              Send Recovery Instructions
            </Button>
          </form>
        ) : (
          <div className="p-space-md rounded-2xl bg-emerald-50 text-emerald-950 border border-emerald-200 space-y-2">
            <div className="flex items-center gap-2 font-title-md font-bold text-emerald-800">
              <span className="material-symbols-outlined text-[20px]">mark_email_read</span>
              <span>Recovery Link Dispatched</span>
            </div>
            <p className="font-body-sm text-body-sm text-emerald-900 leading-snug">
              We have transmitted password reset instructions to <strong>{email}</strong>. Please check your inbox and scholarly mail terminal.
            </p>
            <div className="pt-2">
              <Button
                variant="outline"
                size="sm"
                fullWidth
                onClick={() => navigate("/login")}
              >
                Back to Sign In
              </Button>
            </div>
          </div>
        )}

        <div className="pt-space-sm border-t border-outline-variant/20 text-center font-body-sm text-body-sm">
          <button
            onClick={() => navigate("/login")}
            className="text-secondary font-bold hover:underline flex items-center justify-center gap-1 mx-auto"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            <span>Return to Sign In</span>
          </button>
        </div>
      </div>
    </div>
  );
};
