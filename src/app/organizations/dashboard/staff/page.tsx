"use client";

import { useState } from "react";
import { Plus, Search, User, Mail, Phone, Edit2, Trash2 } from "lucide-react";

interface StaffMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  joinedDate: string;
  permissions: string[];
  status: "ACTIVE" | "INACTIVE";
}

const mockStaff: StaffMember[] = [
  {
    id: "STF001",
    name: "Dr. Sarah Wilson",
    email: "sarah@example.com",
    phone: "+91 98765 43210",
    role: "VETERINARIAN",
    department: "Medical Care",
    joinedDate: "2023-01-15",
    permissions: ["MEDICAL RECORDS", "TREATMENT PLANS", "PRESCRIPTIONS"],
    status: "ACTIVE",
  },
  {
    id: "STF002",
    name: "John Miller",
    email: "john@example.com",
    phone: "+91 98765 43211",
    role: "COORDINATOR",
    department: "Operations",
    joinedDate: "2023-03-20",
    permissions: ["EVENT MANAGEMENT", "VOLUNTEER COORDINATION"],
    status: "ACTIVE",
  },
];

export default function StaffPage() {
  const [staffList, setStaffList] = useState<StaffMember[]>(mockStaff);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [newStaff, setNewStaff] = useState({
    name: "",
    email: "",
    phone: "",
    role: "COORDINATOR",
    department: "Operations",
  });

  const handleRemove = (id: string) => {
    setStaffList((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaff.name) return;
    const created: StaffMember = {
      id: `STF${Date.now().toString().slice(-3)}`,
      ...newStaff,
      joinedDate: new Date().toISOString().split("T")[0],
      permissions: ["GENERAL ACCESS"],
      status: "ACTIVE",
    };
    setStaffList([...staffList, created]);
    setShowModal(false);
    setNewStaff({
      name: "",
      email: "",
      phone: "",
      role: "COORDINATOR",
      department: "Operations",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header & Action */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">
            Staff Management
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Manage staff members and their roles
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center space-x-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-xl shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Staff Member</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search staff members..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
          />
        </div>

        <select className="px-3.5 py-2 border border-gray-200 rounded-xl text-xs text-gray-700 bg-white focus:outline-none focus:border-emerald-600">
          <option value="">Role</option>
          <option value="VETERINARIAN">Veterinarian</option>
          <option value="COORDINATOR">Coordinator</option>
          <option value="RESCUER">Rescuer</option>
        </select>

        <select className="px-3.5 py-2 border border-gray-200 rounded-xl text-xs text-gray-700 bg-white focus:outline-none focus:border-emerald-600">
          <option value="">Department</option>
          <option value="Medical Care">Medical Care</option>
          <option value="Operations">Operations</option>
          <option value="Logistics">Logistics</option>
        </select>

        <select className="px-3.5 py-2 border border-gray-200 rounded-xl text-xs text-gray-700 bg-white focus:outline-none focus:border-emerald-600">
          <option value="">Status</option>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
        </select>
      </div>

      {/* Staff Cards List */}
      <div className="space-y-4">
        {staffList.map((member) => (
          <div
            key={member.id}
            className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-5"
          >
            {/* Top Row: Avatar, Name, Email/Phone, Status */}
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 shrink-0">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900">
                    {member.name}
                  </h3>
                  <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                    <span className="flex items-center space-x-1">
                      <Mail className="w-3.5 h-3.5 text-gray-400" />
                      <span>{member.email}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Phone className="w-3.5 h-3.5 text-gray-400" />
                      <span>{member.phone}</span>
                    </span>
                  </div>
                </div>
              </div>

              <span className="px-3 py-1 text-[10px] font-bold rounded-full bg-emerald-100 text-emerald-700 uppercase">
                {member.status}
              </span>
            </div>

            {/* Info Grid: Role, Department, Joined Date */}
            <div className="grid grid-cols-3 gap-4 text-xs text-gray-600 border-t border-gray-50 pt-4">
              <div>
                <p className="text-[11px] text-gray-400 uppercase font-semibold">
                  Role
                </p>
                <p className="font-bold text-gray-800 mt-0.5">{member.role}</p>
              </div>
              <div>
                <p className="text-[11px] text-gray-400 uppercase font-semibold">
                  Department
                </p>
                <p className="font-semibold text-gray-700 mt-0.5">
                  {member.department}
                </p>
              </div>
              <div>
                <p className="text-[11px] text-gray-400 uppercase font-semibold">
                  Joined Date
                </p>
                <p className="font-semibold text-gray-700 mt-0.5">
                  {member.joinedDate}
                </p>
              </div>
            </div>

            {/* Permissions Chips */}
            <div>
              <p className="text-[11px] text-gray-400 uppercase font-semibold mb-2">
                Permissions
              </p>
              <div className="flex flex-wrap gap-2">
                {member.permissions.map((perm) => (
                  <span
                    key={perm}
                    className="px-2.5 py-1 bg-gray-100 text-gray-700 text-[10px] font-bold rounded-md uppercase"
                  >
                    {perm}
                  </span>
                ))}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center space-x-3 pt-3 border-t border-gray-100">
              <button className="flex items-center space-x-1.5 px-3 py-1.5 text-gray-700 border border-gray-200 hover:bg-gray-50 text-xs font-semibold rounded-xl transition-all">
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>

              <button
                onClick={() => handleRemove(member.id)}
                className="flex items-center space-x-1.5 px-3 py-1.5 text-rose-600 border border-rose-100 hover:bg-rose-50 text-xs font-semibold rounded-xl transition-all"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Staff Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form
            onSubmit={handleAddStaff}
            className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl"
          >
            <h3 className="text-lg font-bold text-gray-900 border-b pb-3">
              Add Staff Member
            </h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Alex Morgan"
                  value={newStaff.name}
                  onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:border-emerald-600"
                />
              </div>
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="alex@example.com"
                  value={newStaff.email}
                  onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:border-emerald-600"
                />
              </div>
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  required
                  placeholder="+91 98765 43212"
                  value={newStaff.phone}
                  onChange={(e) => setNewStaff({ ...newStaff, phone: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:border-emerald-600"
                />
              </div>
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Role
                </label>
                <select
                  value={newStaff.role}
                  onChange={(e) => setNewStaff({ ...newStaff, role: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:border-emerald-600"
                >
                  <option value="VETERINARIAN">Veterinarian</option>
                  <option value="COORDINATOR">Coordinator</option>
                  <option value="RESCUER">Rescuer</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Department
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Medical Care"
                  value={newStaff.department}
                  onChange={(e) => setNewStaff({ ...newStaff, department: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:border-emerald-600"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 pt-3 border-t">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-xl shadow-sm"
              >
                Add Member
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
