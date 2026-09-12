import React, { useState, useMemo } from "react";
import { useLibrary } from "../../context/LibraryContext";
import { Button } from "../../components/common/Button";
import { StatusBadge } from "../../components/common/StatusBadge";
import { Modal } from "../../components/common/Modal";
import { Input } from "../../components/forms/Input";
import { Select } from "../../components/forms/Select";
import { EmptyState } from "../../components/common/EmptyState";
import memberImage from "../../components/images/member.jpg";

export default function MemberManagementPage({ onNavigate }) {
  const { members, updateMemberStatus, addMember, stats } = useLibrary();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Patron Form
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    department: "Department of Humanities",
    role: "Patron"
  });
  const [errors, setErrors] = useState({});

  // Departments list from members
  const departments = useMemo(() => {
    const deps = new Set(members.map((m) => m.department).filter(Boolean));
    return ["All", ...Array.from(deps)];
  }, [members]);

  // Filtered members
  const filteredMembers = useMemo(() => {
    return members.filter((m) => {
      const q = searchQuery.toLowerCase();
      const matchSearch =
        m.name.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        m.membershipNumber?.toLowerCase().includes(q) ||
        m.department?.toLowerCase().includes(q);

      const matchStatus = statusFilter === "All" || m.status === statusFilter;
      const matchDept = departmentFilter === "All" || m.department === departmentFilter;

      return matchSearch && matchStatus && matchDept;
    });
  }, [members, searchQuery, statusFilter, departmentFilter]);

  // Statistics
  const activeCount = useMemo(() => members.filter((m) => m.status === "Active").length, [members]);
  const suspendedCount = useMemo(() => members.filter((m) => m.status === "Suspended").length, [members]);
  const activeBorrowers = useMemo(() => members.filter((m) => m.activeBorrowings > 0).length, [members]);

  const handleToggleStatus = (member) => {
    const newStatus = member.status === "Active" ? "Suspended" : "Active";
    updateMemberStatus(member.id, newStatus);
  };

  const handleSaveMember = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Full name is required";
    if (!formData.email.trim()) newErrors.email = "Email address is required";
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    addMember(formData);
    setIsAddModalOpen(false);
    setFormData({
      name: "",
      email: "",
      phone: "",
      department: "Department of Humanities",
      role: "Patron"
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-surface-border pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-2xl font-bold text-text-primary tracking-tight">
              Patron & Member Registry
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary-100 text-primary-700">
              {members.length} Patrons
            </span>
          </div>
          <p className="text-sm text-text-secondary mt-1">
            Browse registered library patrons, audit circulation status, and manage reader privileges.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="primary" icon="person_add" onClick={() => setIsAddModalOpen(true)}>
            Enroll Patron
          </Button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-surface-card rounded-xl border border-surface-border p-4 shadow-subtle flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">badge</span>
          </div>
          <div>
            <span className="text-xs uppercase tracking-wider font-semibold text-text-muted">
              Total Patrons
            </span>
            <div className="font-serif text-2xl font-bold text-text-primary mt-0.5">
              {members.length}
            </div>
          </div>
        </div>

        <div className="bg-surface-card rounded-xl border border-surface-border p-4 shadow-subtle flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">verified_user</span>
          </div>
          <div>
            <span className="text-xs uppercase tracking-wider font-semibold text-text-muted">
              In Good Standing
            </span>
            <div className="font-serif text-2xl font-bold text-text-primary mt-0.5">
              {activeCount}
            </div>
          </div>
        </div>

        <div className="bg-surface-card rounded-xl border border-surface-border p-4 shadow-subtle flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">local_library</span>
          </div>
          <div>
            <span className="text-xs uppercase tracking-wider font-semibold text-text-muted">
              Active Borrowers
            </span>
            <div className="font-serif text-2xl font-bold text-text-primary mt-0.5">
              {activeBorrowers}
            </div>
          </div>
        </div>

        <div className="bg-surface-card rounded-xl border border-surface-border p-4 shadow-subtle flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">person_off</span>
          </div>
          <div>
            <span className="text-xs uppercase tracking-wider font-semibold text-text-muted">
              Suspended
            </span>
            <div className="font-serif text-2xl font-bold text-text-primary mt-0.5">
              {suspendedCount}
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-surface-card rounded-xl border border-surface-border p-4 shadow-subtle flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-lg">
            search
          </span>
          <input
            type="text"
            placeholder="Search patron by name, email, card #..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-surface-ground border border-surface-border rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Status Filter */}
          <div className="flex items-center gap-1.5 text-xs text-text-secondary">
            <span>Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2.5 py-1.5 text-xs bg-surface-ground border border-surface-border rounded-lg text-text-primary focus:outline-none focus:ring-1 focus:ring-primary-500"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Suspended">Suspended</option>
            </select>
          </div>

          {/* Department Filter */}
          <div className="flex items-center gap-1.5 text-xs text-text-secondary">
            <span>Affiliation:</span>
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="px-2.5 py-1.5 text-xs bg-surface-ground border border-surface-border rounded-lg text-text-primary focus:outline-none focus:ring-1 focus:ring-primary-500 max-w-[180px] truncate"
            >
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Member Directory Table */}
      {filteredMembers.length === 0 ? (
        <EmptyState
          icon="group"
          title="No Patrons Found"
          description="We couldn't find any library members matching your search query and filters."
          actionText="Clear Filters"
          onAction={() => {
            setSearchQuery("");
            setStatusFilter("All");
            setDepartmentFilter("All");
          }}
        />
      ) : (
        <div className="bg-surface-card rounded-xl border border-surface-border overflow-hidden shadow-subtle">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface-ground border-b border-surface-border text-xs uppercase font-semibold text-text-muted">
                <tr>
                  <th className="py-3.5 px-4">Patron Name & Affiliation</th>
                  <th className="py-3.5 px-4">Membership Card</th>
                  <th className="py-3.5 px-4">Enrolled Since</th>
                  <th className="py-3.5 px-4 text-center">Active Loans</th>
                  <th className="py-3.5 px-4">Standing</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border text-text-primary">
                {filteredMembers.map((member) => (
                  <tr key={member.id} className="hover:bg-surface-ground/50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={member.avatar || memberImage}
                          alt={member.name}
                          className="w-10 h-10 rounded-full object-cover border border-surface-border flex-shrink-0"
                          onError={(e) => {
                            e.target.src = memberImage;
                          }}
                        />
                        <div className="min-w-0">
                          <button
                            onClick={() => onNavigate && onNavigate(`/admin/members/${member.id}`)}
                            className="font-semibold text-text-primary hover:text-primary-600 transition-colors text-left truncate max-w-[200px] block"
                          >
                            {member.name}
                          </button>
                          <p className="text-xs text-text-muted truncate max-w-[200px]">
                            {member.email}
                          </p>
                          <span className="text-[11px] text-text-secondary">
                            {member.department}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-mono text-xs font-medium text-text-primary">
                        {member.membershipNumber || member.id}
                      </div>
                      <span className="text-[11px] text-text-muted capitalize">{member.role}</span>
                    </td>

                    <td className="py-3 px-4 text-xs text-text-secondary">
                      {member.memberSince || "2024-01-15"}
                    </td>

                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${member.activeBorrowings >= member.maxQuota
                          ? "bg-rose-50 text-rose-700 font-bold"
                          : member.activeBorrowings > 0
                            ? "bg-sky-50 text-sky-700"
                            : "bg-surface-ground text-text-muted"
                          }`}
                      >
                        {member.activeBorrowings} / {member.maxQuota}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <StatusBadge status={member.status} />
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="ghost"
                          size="sm"
                          icon="visibility"
                          onClick={() => onNavigate && onNavigate(`/admin/members/${member.id}`)}
                          title="View Patron Record"
                        >
                          Audit
                        </Button>
                        <button
                          onClick={() => handleToggleStatus(member)}
                          className={`p-1.5 rounded-lg text-xs transition-colors ${member.status === "Active"
                            ? "text-rose-600 hover:bg-rose-50"
                            : "text-emerald-600 hover:bg-emerald-50"
                            }`}
                          title={member.status === "Active" ? "Suspend Member" : "Activate Member"}
                        >
                          <span className="material-symbols-outlined text-lg">
                            {member.status === "Active" ? "block" : "check_circle"}
                          </span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Enroll Patron Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Enroll New Library Patron"
        subtitle="Issue an institutional library card and register borrowing privileges."
        size="md"
      >
        <form onSubmit={handleSaveMember} className="space-y-4">
          <Input
            label="Full Name"
            placeholder="e.g. Minerva McGonagall, Ph.D."
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={errors.name}
            required
          />

          <Input
            label="Institutional Email"
            type="email"
            placeholder="e.g. e.Minerva McGonagall@university.edu"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            error={errors.email}
            required
          />

          <Input
            label="Telephone / Mobile Contact"
            placeholder="e.g. +62 812-3456-7890"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />

          <Select
            label="Academic Department / Affiliation"
            value={formData.department}
            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            options={[
              { value: "Department of Humanities", label: "Department of Humanities" },
              { value: "Faculty of Computer Science", label: "Faculty of Computer Science" },
              { value: "School of Architecture & Design", label: "School of Architecture & Design" },
              { value: "Department of Philosophy", label: "Department of Philosophy" },
              { value: "General Academic Registry", label: "General Academic Registry" }
            ]}
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-surface-border">
            <Button variant="secondary" type="button" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" icon="how_to_reg">
              Enroll Patron
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
