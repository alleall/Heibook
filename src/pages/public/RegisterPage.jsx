import React, { useState } from "react";
import { useLibrary } from "../../context/LibraryContext";
import { Input } from "../../components/forms/Input";
import { Button } from "../../components/common/Button";

export const RegisterPage = () => {
  const { addMember, setUserRole } = useLibrary();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    password: "",
    confirmPassword: "",
    agreed: true
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = (path) => {
    window.location.hash = `#${path}`;
  };

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!formData.name || !formData.email || !formData.password) {
      setError("Please fill in all required registration fields.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passphrase confirmation does not match.");
      return;
    }

    if (!formData.agreed) {
      setError("You must accept the Heibook Circulation Protocol.");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      addMember({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        department: formData.department || "Independent Inquiry",
        role: "Patron & Scholar"
      });
      setUserRole("member");
      navigate("/dashboard");
    }, 400);
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center p-4 sm:p-6 lg:p-space-xl">
      <div className="w-full max-w-5xl bg-surface-container-lowest rounded-3xl shadow-2xl border border-outline-variant/30 overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        {/* Left Column: Editorial Guidelines (5 cols) */}
        <div className="hidden lg:flex lg:col-span-5 bg-primary text-on-primary p-space-2xl flex-col justify-between relative overflow-hidden">
          <div className="relative z-10 space-y-space-md">
            <div className="flex items-center gap-space-xs text-secondary-fixed">
              <span className="material-symbols-outlined text-[20px]">badge</span>
              <span className="font-label-sm text-label-sm uppercase tracking-wider font-semibold">
                Patron Membership
              </span>
            </div>
            <h2 className="font-headline-xl text-headline-xl font-bold leading-tight">
              Begin your scholarly accession with Heibook.
            </h2>
            <p className="font-body-md text-body-md opacity-80 leading-relaxed">
              Membership grants direct access to our physical collections, digitized manuscripts, scholarly study pods, and research reservation services.
            </p>
          </div>

          <div className="relative z-10 space-y-3">
            <div className="p-space-md rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 space-y-2">
              <h4 className="font-title-md font-semibold text-secondary-fixed flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">rule</span>
                <span>Core Lending Terms</span>
              </h4>
              <ul className="text-caption opacity-90 space-y-1.5 list-disc list-inside">
                <li>Up to 3 concurrent active titles per patron</li>
                <li>7-day standard duration with 1 renewal allowance</li>
                <li>Rp1.000 daily administrative fine for delayed returns</li>
              </ul>
            </div>
          </div>

          <div className="absolute -bottom-16 -right-16 w-64 h-64 rounded-full bg-secondary/30 blur-3xl" />
        </div>

        {/* Right Column: Register Form (7 cols) */}
        <div className="lg:col-span-7 p-6 sm:p-space-2xl flex flex-col justify-center space-y-space-lg">
          <div className="space-y-1">
            <h2 className="font-headline-md text-headline-md font-extrabold text-on-surface">
              Apply for Scholar Membership
            </h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Complete the accession form to generate your personal library credentials.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-space-sm">
            <Input
              label="Full Name"
              id="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Sirius Black"
              required
              icon="person"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm">
              <Input
                label="Personal Email"
                id="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="name@gmail.com"
                required
                icon="mail"
              />
              <Input
                label="Phone Number"
                id="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+62 812-xxxx-xxxx"
                icon="phone"
              />
            </div>

            <Input
              label="Academic Discipline or Field of Inquiry"
              id="department"
              value={formData.department}
              onChange={handleChange}
              placeholder="e.g. Computer Science, Architecture, Philosophy"
              icon="school"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm">
              <Input
                label="Security Passphrase"
                id="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Minimum 8 characters"
                required
                icon="lock"
              />
              <Input
                label="Confirm Passphrase"
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter passphrase"
                required
                icon="lock_reset"
              />
            </div>

            <div className="pt-2">
              <label className="flex items-start gap-2.5 text-caption text-on-surface cursor-pointer select-none">
                <input
                  type="checkbox"
                  id="agreed"
                  checked={formData.agreed}
                  onChange={handleChange}
                  className="rounded border-outline-variant/60 text-secondary focus:ring-secondary mt-0.5 cursor-pointer"
                />
                <span className="leading-snug">
                  I agree to abide by the Heibook Circulation Protocol, loan durations (7 days), and respectful handling of archival volumes.
                </span>
              </label>
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
              icon="how_to_reg"
              className="mt-2"
            >
              Complete Registration
            </Button>
          </form>

          <div className="pt-space-md border-t border-outline-variant/20 text-center font-body-sm text-body-sm text-on-surface-variant">
            Already registered as a library patron?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-secondary font-bold hover:underline ml-1"
            >
              Sign In Here
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
