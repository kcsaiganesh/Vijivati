"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import Link from "next/link";
import { ClipboardList, ChevronRight, AlertCircle, PawPrint, Filter } from "lucide-react";

interface Report {
  _id: string;
  reportId: string;
  animalType: string;
  status: string;
  urgencyType: string;
  address?: string;
  condition?: string;
  reportSubmittedTime: string;
  organizationRef?: { organizationName: string };
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; dot: string }> = {
  REPORTED:   { label: "Reported",   color: "text-blue-700",   bg: "bg-blue-50",   dot: "bg-blue-500" },
  DISPATCHED: { label: "Dispatched", color: "text-yellow-700", bg: "bg-yellow-50", dot: "bg-yellow-500" },
  EN_ROUTE:   { label: "En Route",   color: "text-orange-700", bg: "bg-orange-50", dot: "bg-orange-500" },
  ON_SCENE:   { label: "On Scene",   color: "text-red-700",    bg: "bg-red-50",    dot: "bg-red-500" },
  RESCUED:    { label: "Rescued",    color: "text-emerald-700",bg: "bg-emerald-50",dot: "bg-emerald-500" },
  TREATED:    { label: "Treated",    color: "text-teal-700",   bg: "bg-teal-50",   dot: "bg-teal-500" },
  RECOVERED:  { label: "Recovered",  color: "text-cyan-700",   bg: "bg-cyan-50",   dot: "bg-cyan-500" },
  REHOMED:    { label: "Rehomed",    color: "text-purple-700", bg: "bg-purple-50", dot: "bg-purple-500" },
  CLOSED:     { label: "Closed",     color: "text-gray-600",   bg: "bg-gray-100",  dot: "bg-gray-400" },
  CANCELLED:  { label: "Cancelled",  color: "text-gray-500",   bg: "bg-gray-50",   dot: "bg-gray-300" },
};

const URGENCY_EMOJI: Record<string, string> = {
  IMMEDIATE: "🚨", HIGH: "⚡", MODERATE: "🔶", LOW: "🟢"
};

const FILTERS = ["All", "Active", "Resolved"];

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] || { label: status, color: "text-gray-600", bg: "bg-gray-100", dot: "bg-gray-400" };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${cfg.color} ${cfg.bg}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

export default function MyReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  const ACTIVE_STATUSES = ["REPORTED", "DISPATCHED", "EN_ROUTE", "ON_SCENE", "RESCUED", "TREATED", "RECOVERED"];
  const RESOLVED_STATUSES = ["REHOMED", "CLOSED", "CANCELLED"];

  useEffect(() => {
    api.get("/reports/my")
      .then((res) => { if (res.data?.success) setReports(res.data.data); })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const filtered = reports.filter((r) => {
    if (filter === "Active") return ACTIVE_STATUSES.includes(r.status);
    if (filter === "Resolved") return RESOLVED_STATUSES.includes(r.status);
    return true;
  });

  return (
    <div className="space-y-5 py-2">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">My Reports</h1>
        <p className="text-sm text-gray-500 mt-1">Track all your animal rescue submissions</p>
      </div>

      {/* Filter Pills */}
      <div className="flex gap-2">
        {FILTERS.map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
              filter === f ? "bg-emerald-700 text-white" : "bg-white border border-gray-200 text-gray-600 hover:border-emerald-300"
            }`}>
            {f}
            {f !== "All" && (
              <span className={`ml-1.5 ${filter === f ? "text-white/70" : "text-gray-400"}`}>
                ({reports.filter(r =>
                  f === "Active" ? ACTIVE_STATUSES.includes(r.status) : RESOLVED_STATUSES.includes(r.status)
                ).length})
              </span>
            )}
          </button>
        ))}
        <span className="ml-auto text-xs text-gray-400 font-medium self-center">{filtered.length} report{filtered.length !== 1 ? "s" : ""}</span>
      </div>

      {/* Reports List */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-24 rounded-2xl bg-gray-100 animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-3xl border border-dashed border-gray-200 p-10 text-center">
          <PawPrint className="w-10 h-10 text-gray-200 mx-auto mb-3" />
          <p className="font-bold text-gray-500">No {filter !== "All" ? filter.toLowerCase() : ""} reports</p>
          <p className="text-xs text-gray-400 mt-1 mb-5">
            {filter === "All" ? "You haven't submitted any rescue reports yet." : `No ${filter.toLowerCase()} reports found.`}
          </p>
          {filter === "All" && (
            <Link href="/dashboard/report"
              className="inline-flex items-center gap-2 bg-emerald-700 text-white text-sm font-bold px-5 py-2.5 rounded-2xl">
              <AlertCircle className="w-4 h-4" /> Report an Animal
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((r) => (
            <Link key={r._id} href={`/dashboard/reports/${r._id}`}
              className="flex items-center gap-4 bg-white rounded-2xl border border-gray-100 shadow-sm p-4 hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-2xl font-extrabold shrink-0">
                {r.animalType === "Dog" ? "🐕" : r.animalType === "Cat" ? "🐈" : r.animalType === "Cow" ? "🐄" :
                 r.animalType === "Bird" ? "🐦" : r.animalType === "Monkey" ? "🐒" : "🐾"}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-extrabold text-gray-900">{r.animalType}</span>
                  <span className="text-xs text-gray-400">{r.reportId}</span>
                  <span>{URGENCY_EMOJI[r.urgencyType] || ""}</span>
                </div>
                <p className="text-xs text-gray-500 truncate">{r.address || "Location not specified"}</p>
                {r.organizationRef && (
                  <p className="text-xs text-emerald-700 font-semibold mt-0.5 truncate">
                    → {r.organizationRef.organizationName}
                  </p>
                )}
              </div>
              <div className="shrink-0 flex flex-col items-end gap-2">
                <StatusBadge status={r.status} />
                <span className="text-[10px] text-gray-400">
                  {new Date(r.reportSubmittedTime).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}
                </span>
                <ChevronRight className="w-4 h-4 text-gray-300" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
