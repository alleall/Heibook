import React, { useState } from "react";
import { useLibrary } from "../../context/LibraryContext";
import { Input } from "../../components/forms/Input";
import { Button } from "../../components/common/Button";

export const LoginPage = () => {
  const { setUserRole, addToast } = useLibrary();
  const [email, setEmail] = useState("allensiawood@gmail.com");
  const [password, setPassword] = useState("••••••••");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = (path) => {
    window.location.hash = `#${path}`;
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      if (email.includes("admin")) {
        setUserRole("admin");
        addToast("success", "Welcome Back, Curator", "Logged in as Archival Administrator.");
        navigate("/admin/dashboard");
      } else {
        setUserRole("member");
        addToast("success", "Welcome Back, Scholar", "Logged in as Allensia Wood.");
        navigate("/dashboard");
      }
    }, 400);
  };

  const handleQuickLogin = (role) => {
    setUserRole(role);
    if (role === "admin") {
      addToast("success", "Admin Mode Activated", "Access granted to Curatorial Operations.");
      navigate("/admin/dashboard");
    } else {
      addToast("success", "Member Mode Activated", "Welcome to Member Reading Desk.");
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center p-4 sm:p-6 lg:p-space-xl">
      <div className="w-full max-w-5xl bg-surface-container-lowest rounded-3xl shadow-2xl border border-outline-variant/30 overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        {/* Left Side: Editorial Archival Visual (5 cols) */}
        <div className="hidden lg:flex lg:col-span-5 bg-primary text-on-primary p-space-2xl flex-col justify-between relative overflow-hidden">
          <div className="relative z-10 space-y-space-md">
            <div className="flex items-center gap-space-xs text-secondary-fixed">
              <span className="material-symbols-outlined text-[20px]">local_library</span>
              <span className="font-label-sm text-label-sm uppercase tracking-wider font-semibold">
                Universal Archive
              </span>
            </div>
            <h2 className="font-headline-xl text-headline-xl font-bold leading-tight">
              A repository of human inquiry & thought.
            </h2>
            <p className="font-body-md text-body-md opacity-80 leading-relaxed">
              Sign in to manage your active loans, track renewals, access archival reading rooms, and reserve physical volumes from our stacks.
            </p>
          </div>

          <div className="relative z-10 p-space-md rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 space-y-2">
            <div className="flex items-center gap-2 text-secondary-fixed font-title-md font-semibold">
              <span className="material-symbols-outlined text-[18px]">verified</span>
              <span>Scholarly Policy</span>
            </div>
            <p className="font-caption text-caption opacity-90 leading-snug">
              Every patron is entitled to 3 concurrent loans for a standard 7-day period. Renewals are enabled up to 24 hours before due date.
            </p>
          </div>

          {/* Decorative Background Glow */}
          <div className="absolute -bottom-16 -right-16 w-64 h-64 rounded-full bg-secondary/30 blur-3xl" />
        </div>

        {/* Right Side: Authentication Form (7 cols) */}
        <div className="lg:col-span-7 p-6 sm:p-space-2xl flex flex-col justify-center space-y-space-lg">
          <div className="space-y-1">
            <h2 className="font-headline-md text-headline-md font-extrabold text-on-surface">
              Sign In to Heibook
            </h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Enter your library credentials or membership number to continue.
            </p>
          </div>

          {/* Quick Demo Role Switcher Buttons */}
          <div className="p-space-sm rounded-xl bg-surface-container-low border border-outline-variant/30 space-y-2">
            <div className="flex items-center justify-between text-caption">
              <span className="font-semibold text-secondary flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">bolt</span>
                <span>Fast Evaluation Access</span>
              </span>
              <span className="text-on-surface-variant text-[11px]">Instant Login</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="subtle"
                size="sm"
                onClick={() => handleQuickLogin("member")}
                className="text-[12px] py-1.5 justify-center"
              >
                Sign In as Member
              </Button>
              <Button
                variant="subtle"
                size="sm"
                onClick={() => handleQuickLogin("admin")}
                className="text-[12px] py-1.5 justify-center"
              >
                Sign In as Admin
              </Button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-space-md">
            <Input
              label="Patron Email or Membership ID"
              id="loginEmail"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. allensiawood@gmail.com or HBK-992014"
              required
              icon="mail"
            />

            <div className="space-y-1">
              <div className="relative">
                <Input
                  label="Password"
                  id="loginPassword"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your security passphrase"
                  required
                  icon="lock"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-9 text-on-surface-variant hover:text-on-surface"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-caption">
              <label className="flex items-center gap-2 text-on-surface cursor-pointer select-none">
                <input
                  type="checkbox"
                  defaultChecked
                  className="rounded border-outline-variant/60 text-secondary focus:ring-secondary cursor-pointer"
                />
                <span>Remember this terminal</span>
              </label>

              <button
                type="button"
                onClick={() => navigate("/forgot-password")}
                className="text-secondary hover:underline font-medium"
              >
                Forgot passphrase?
              </button>
            </div>

            {error && (
              <div className="p-space-sm rounded-lg bg-error-container text-error text-caption flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px]">error</span>
                <span>{error}</span>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={loading}
              icon="login"
            >
              Sign In to Stacks
            </Button>
          </form>

          {/* Register Prompt */}
          <div className="pt-space-md border-t border-outline-variant/20 text-center font-body-sm text-body-sm text-on-surface-variant">
            Not yet a registered library scholar?{" "}
            <button
              onClick={() => navigate("/register")}
              className="text-secondary font-bold hover:underline ml-1"
            >
              Apply for Membership
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
