import React, { useState } from "react";
import { useLibrary } from "../../context/LibraryContext";
import { Input } from "../../components/forms/Input";
import { Textarea } from "../../components/forms/Textarea";
import { Button } from "../../components/common/Button";
import { StatusBadge } from "../../components/common/StatusBadge";
import avatarImage from "../../components/images/member.jpg";

export const MemberProfilePage = () => {
  const { currentUser, borrowings, addToast } = useLibrary();

  const [formData, setFormData] = useState({
    name: currentUser.name,
    email: currentUser.email,
    phone: "+62 812-3456-7890",
    department: "Muggle Informatics Engineering &  Potions Magical Computing",
    bio: "Studying computational magic, brewing questionable Potions, chasing Quidditch victories, and occasionally writing code"
  });

  const activeLoans = borrowings.filter(
    (b) => b.memberId === currentUser.memberId && b.status !== "Returned"
  );

  const handleSave = (e) => {
    e.preventDefault();
    addToast("success", "Profile Updated", "Your patron credentials and preferences have been recorded.");
  };

  return (
    <div className="space-y-space-xl">
      <div className="pb-space-sm border-b border-outline-variant/20">
        <h1 className="font-headline-xl text-headline-xl text-on-surface font-extrabold tracking-tight">
          Member Profile
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Personal identification, patron registry credentials, and scholarly research preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start">
        {/* Left Column: Digital Library Patron Card (5 cols) */}
        <div className="lg:col-span-5 space-y-space-md">
          {/* Physical Library Card Simulation */}
          <div className="p-space-lg rounded-3xl bg-primary text-on-primary shadow-2xl relative overflow-hidden space-y-space-md border border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-secondary-fixed">
                <span className="material-symbols-outlined text-[24px]">local_library</span>
                <span className="font-title-md font-bold tracking-tight text-white">Heibook</span>
              </div>
              <StatusBadge status="Active" />
            </div>

            <div className="flex items-center gap-space-md pt-2">
              <img
                src={currentUser.avatar || avatarImage}
                alt={currentUser.name || "Member Avatar"}
                className="w-16 h-16 rounded-2xl object-cover ring-2 ring-secondary-fixed shadow-md"
              />
              <div className="min-w-0">
                <h3 className="font-headline-sm text-headline-sm font-bold text-white truncate">
                  {currentUser.name}
                </h3>
                <p className="font-caption text-caption opacity-80">
                  {currentUser.title}
                </p>
                <span className="font-mono text-caption text-secondary-fixed font-semibold block mt-0.5">
                  ID: {currentUser.memberId}
                </span>
              </div>
            </div>

            {/* Barcode Strip */}
            <div className="p-3 bg-white rounded-xl text-center shadow-inner">
              <div className="font-mono text-xl tracking-[0.3em] font-bold text-black select-all">
                ||| | |||| | || ||| || |||
              </div>
              <span className="font-mono text-[11px] text-gray-700 font-semibold tracking-wider">
                {currentUser.memberId}
              </span>
            </div>

            <div className="flex justify-between text-caption opacity-75 pt-1 text-[11px]">
              <span>Issued: 12 Oct 2023</span>
              <span>Valid Thru: Perpetual Patron</span>
            </div>

            {/* Decorative background circle */}
            <div className="absolute -bottom-12 -right-12 w-48 h-48 rounded-full bg-secondary/30 blur-2xl" />
          </div>

          {/* Quota Usage Gauge */}
          <div className="p-space-md rounded-2xl bg-surface-container-lowest border border-outline-variant/30 space-y-2">
            <div className="flex justify-between text-body-sm font-semibold text-on-surface">
              <span>Lending Allowance Status</span>
              <span className="text-secondary">{activeLoans.length} of 3 Used</span>
            </div>
            <div className="w-full bg-surface-container rounded-full h-2 overflow-hidden">
              <div
                className="bg-secondary h-full rounded-full transition-all"
                style={{ width: `${(activeLoans.length / 3) * 100}%` }}
              />
            </div>
            <p className="font-caption text-caption text-on-surface-variant">
              {3 - activeLoans.length} additional title(s) can be borrowed concurrently.
            </p>
          </div>
        </div>

        {/* Right Column: Profile Edit Form (7 cols) */}
        <div className="lg:col-span-7 bg-surface-container-lowest p-6 sm:p-space-xl rounded-3xl border border-outline-variant/30 shadow-xs space-y-space-md">
          <h3 className="font-title-md text-title-md font-bold text-on-surface">
            Patron Personal Details
          </h3>

          <form onSubmit={handleSave} className="space-y-space-md">
            <Input
              label="Full Name"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              icon="person"
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
              <Input
                label="Patron Email"
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                icon="mail"
                required
              />
              <Input
                label="Contact Number"
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                icon="phone"
              />
            </div>

            <Input
              label="Scholarly Department / Field"
              id="department"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              icon="school"
            />

            <Textarea
              label="Research Interests & Academic Bio"
              id="bio"
              rows={3}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            />

            <div className="pt-2 flex justify-end">
              <Button type="submit" variant="primary" size="md" icon="save">
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
