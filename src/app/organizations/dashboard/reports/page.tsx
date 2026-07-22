"use client";

import { useState, useEffect } from "react";
import { Filter, Search, Loader2, ChevronDown } from "lucide-react";
import Link from "next/link";
import api from "@/lib/api";

interface Report {
  _id: string;
  reportId: string;
  animalType: string;
  status: string;
  urgencyType: string;
  address?: string;
  reportSubmittedTime: string;
}

// Custom Premium Dropdown Component
function CustomDropdown({
  value,
  onChange,
  options,
  placeholder,
}: {
  value: string;
  onChange: (val: string) => void;
  options: { value: string; label: string }[];
  placeholder: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find((o) => o.value === value);

  return (
    <div className="relative inline-block text-left min-w-[120px]">
      <div>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex w-full justify-between items-center gap-x-1.5 rounded-xl bg-white px-3.5 py-2 text-xs font-semibold text-gray-700 shadow-sm ring-1 ring-inset ring-gray-200 hover:bg-gray-50 transition-all focus:outline-none"
        >
          {selectedOption ? selectedOption.label : placeholder}
          <ChevronDown className="-mr-1 h-3.5 w-3.5 text-gray-400" />
        </button>
      </div>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 z-20 mt-1.5 min-w-full origin-top-right rounded-xl bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none divide-y divide-gray-50 overflow-hidden">
            <div className="py-1">
              <button
                onClick={() => {
                  onChange("");
                  setIsOpen(false);
                }}
                className="block w-full text-left px-4 py-2 text-xs text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              >
                Clear
              </button>
              {options.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                  }}
                  className={`block w-full text-left px-4 py-2 text-xs hover:bg-gray-50 hover:text-gray-900 transition-colors ${
                    value === opt.value ? "bg-emerald-50 text-emerald-800 font-bold" : "text-gray-700"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

const STATUS_LABELS: Record<string, string> = {
  REPORTED: "Reported",
  DISPATCHED: "Dispatched",
  EN_ROUTE: "En Route",
  ON_SCENE: "On Scene",
  RESCUED: "Rescued",
  TREATED: "Treated",
  RECOVERED: "Recovered",
  REHOMED: "Rehomed",
  CLOSED: "Closed",
  CANCELLED: "Cancelled",
};

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [urgencyFilter, setUrgencyFilter] = useState("");

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (statusFilter) queryParams.append("status", statusFilter);
        if (urgencyFilter) queryParams.append("urgency", urgencyFilter);

        const res = await api.get(`/reports?${queryParams.toString()}`);
        if (res.data?.success) {
          setReports(res.data.data);
        }
      } catch (error) {
        console.error("Error loading reports", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, [statusFilter, urgencyFilter]);

  const filteredReports = reports.filter((r) => {
    const matchSearch =
      r.reportId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.animalType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.address?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Title & Top Action */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Reports</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Manage animal reports and cases
          </p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search reports..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
          />
        </div>

        <CustomDropdown
          value={statusFilter}
          onChange={setStatusFilter}
          placeholder="Status"
          options={[
            { value: "REPORTED", label: "Reported" },
            { value: "DISPATCHED", label: "Dispatched" },
            { value: "EN_ROUTE", label: "En Route" },
            { value: "ON_SCENE", label: "On Scene" },
            { value: "RESCUED", label: "Rescued" },
            { value: "TREATED", label: "Treated" },
            { value: "RECOVERED", label: "Recovered" },
            { value: "REHOMED", label: "Rehomed" },
            { value: "CLOSED", label: "Closed" },
            { value: "CANCELLED", label: "Cancelled" },
          ]}
        />

        <CustomDropdown
          value={urgencyFilter}
          onChange={setUrgencyFilter}
          placeholder="Urgency"
          options={[
            { value: "IMMEDIATE", label: "🚨 Immediate" },
            { value: "HIGH", label: "⚡ High" },
            { value: "MODERATE", label: "🔶 Moderate" },
            { value: "LOW", label: "💚 Low" },
          ]}
        />
      </div>

      {/* Reports Data Table */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
          </div>
        ) : filteredReports.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <p>No reports found matching your criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-600">
              <thead className="bg-gray-50/70 border-b border-gray-100 text-[11px] uppercase font-semibold text-gray-400">
                <tr>
                  <th className="py-3 px-4">ID</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Urgency</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredReports.map((report) => (
                  <tr key={report._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-gray-800">
                      {report.reportId}
                    </td>
                    <td className="py-3.5 px-4 text-gray-700 font-medium">{report.animalType}</td>
                    <td className="py-3.5 px-4 text-gray-700 truncate max-w-[200px]">
                      {report.address || "GPS location"}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-1 text-[10px] font-bold rounded-full uppercase ${
                          report.status === "REPORTED"
                            ? "bg-amber-100 text-amber-700"
                            : report.status === "DISPATCHED" || report.status === "EN_ROUTE"
                            ? "bg-blue-100 text-blue-700"
                            : report.status === "ON_SCENE"
                            ? "bg-purple-100 text-purple-700"
                            : report.status === "RESCUED" || report.status === "TREATED" || report.status === "RECOVERED"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {STATUS_LABELS[report.status] || report.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-1 text-[10px] font-bold rounded-full uppercase ${
                          report.urgencyType === "IMMEDIATE"
                            ? "bg-rose-100 text-rose-700"
                            : report.urgencyType === "HIGH"
                            ? "bg-orange-100 text-orange-700"
                            : report.urgencyType === "MODERATE"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-emerald-100 text-emerald-700"
                        }`}
                      >
                        {report.urgencyType}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href={`/organizations/dashboard/reports/${report._id}`}
                        className="inline-block px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-lg transition-all shadow-sm"
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
