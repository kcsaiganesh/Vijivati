"use client";

import { useState } from "react";
import { Filter, Search } from "lucide-react";

interface Report {
  id: string;
  type: string;
  location: string;
  status: "PENDING" | "IN_PROGRESS" | "RESOLVED";
  urgency: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  date: string;
}

const mockReports: Report[] = [
  {
    id: "REP001",
    type: "Dog",
    location: "MG Road, Bangalore",
    status: "PENDING",
    urgency: "HIGH",
    date: "2024-04-12",
  },
  {
    id: "REP002",
    type: "Cat",
    location: "Indiranagar, Bangalore",
    status: "IN_PROGRESS",
    urgency: "MEDIUM",
    date: "2024-04-11",
  },
];

export default function ReportsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

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

        <button className="flex items-center space-x-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-medium text-xs rounded-xl shadow-sm transition-all">
          <Filter className="w-4 h-4" />
          <span>Filter</span>
        </button>
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

        <select className="px-3.5 py-2 border border-gray-200 rounded-xl text-xs text-gray-700 bg-white focus:outline-none focus:border-emerald-600">
          <option value="">Status</option>
          <option value="PENDING">Pending</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="RESOLVED">Resolved</option>
        </select>

        <select className="px-3.5 py-2 border border-gray-200 rounded-xl text-xs text-gray-700 bg-white focus:outline-none focus:border-emerald-600">
          <option value="">Urgency</option>
          <option value="HIGH">High</option>
          <option value="MEDIUM">Medium</option>
          <option value="LOW">Low</option>
        </select>

        <select className="px-3.5 py-2 border border-gray-200 rounded-xl text-xs text-gray-700 bg-white focus:outline-none focus:border-emerald-600">
          <option value="">Date Range</option>
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
        </select>
      </div>

      {/* Reports Data Table */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
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
              {mockReports.map((report) => (
                <tr key={report.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-gray-800">
                    {report.id}
                  </td>
                  <td className="py-3.5 px-4 text-gray-700">{report.type}</td>
                  <td className="py-3.5 px-4 text-gray-700">{report.location}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2.5 py-1 text-[10px] font-bold rounded-full uppercase ${
                        report.status === "PENDING"
                          ? "bg-amber-100 text-amber-700"
                          : report.status === "IN_PROGRESS"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-emerald-100 text-emerald-700"
                      }`}
                    >
                      {report.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2.5 py-1 text-[10px] font-bold rounded-full uppercase ${
                        report.urgency === "HIGH"
                          ? "bg-red-100 text-red-600"
                          : "bg-amber-100 text-amber-600"
                      }`}
                    >
                      {report.urgency}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => setSelectedReport(report)}
                      className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-lg transition-all shadow-sm"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <h3 className="text-lg font-bold text-gray-900 border-b pb-3">
              Case Details - {selectedReport.id}
            </h3>
            <div className="space-y-2 text-xs text-gray-700">
              <p>
                <span className="font-semibold text-gray-900">Animal Type:</span>{" "}
                {selectedReport.type}
              </p>
              <p>
                <span className="font-semibold text-gray-900">Location:</span>{" "}
                {selectedReport.location}
              </p>
              <p>
                <span className="font-semibold text-gray-900">Urgency:</span>{" "}
                {selectedReport.urgency}
              </p>
              <p>
                <span className="font-semibold text-gray-900">Report Date:</span>{" "}
                {selectedReport.date}
              </p>
            </div>
            <div className="flex justify-end pt-4 border-t">
              <button
                onClick={() => setSelectedReport(null)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
