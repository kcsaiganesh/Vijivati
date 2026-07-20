"use client";

import { useEffect, useState, useCallback } from "react";
import {
  PawPrint, AlertCircle, CheckCircle, Clock, TrendingUp,
  Bell, Phone, MapPin, ChevronRight, Loader2, Zap, Users
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line,
} from "recharts";
import Link from "next/link";
import api from "@/lib/api";
import { useSocket } from "@/context/SocketContext";
import { useToast } from "@/context/ToastContext";

interface DispatchReport {
  reportId: string;
  _id?: string;
  animalType: string;
  urgencyType: string;
  condition: string;
  address: string;
  reporterName: string;
  reporterPhone: string;
  submittedAt: string;
}

interface ReportSummary {
  _id: string;
  reportId: string;
  animalType: string;
  status: string;
  urgencyType: string;
  address?: string;
  reportSubmittedTime: string;
  reporterName: string;
}

interface Stats {
  totalRescues: number;
  active: number;
  resolved: number;
  volunteers: number;
}

const URGENCY_COLORS: Record<string, string> = {
  IMMEDIATE: "bg-rose-600 text-white",
  HIGH: "bg-orange-500 text-white",
  MODERATE: "bg-amber-400 text-gray-900",
  LOW: "bg-emerald-500 text-white",
};

const STATUS_COLORS: Record<string, string> = {
  REPORTED: "bg-blue-100 text-blue-700",
  DISPATCHED: "bg-yellow-100 text-yellow-700",
  EN_ROUTE: "bg-orange-100 text-orange-700",
  ON_SCENE: "bg-red-100 text-red-700",
  RESCUED: "bg-emerald-100 text-emerald-700",
  TREATED: "bg-teal-100 text-teal-700",
  CLOSED: "bg-gray-100 text-gray-600",
};

const MOCK_MONTHLY = [
  { month: "Feb", cases: 53, resolved: 39 },
  { month: "Mar", cases: 50, resolved: 36 },
  { month: "Apr", cases: 61, resolved: 48 },
  { month: "May", cases: 55, resolved: 44 },
  { month: "Jun", cases: 67, resolved: 52 },
  { month: "Jul", cases: 72, resolved: 58 },
];

export default function OrgDashboardPage() {
  const [stats, setStats] = useState<Stats>({ totalRescues: 0, active: 0, resolved: 0, volunteers: 0 });
  const [recentReports, setRecentReports] = useState<ReportSummary[]>([]);
  const [incomingDispatch, setIncomingDispatch] = useState<DispatchReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const socket = useSocket();
  const toast = useToast();

  const fetchDashboardData = useCallback(async () => {
    try {
      const res = await api.get("/reports?limit=5");
      if (res.data?.success) {
        const reports: ReportSummary[] = res.data.data;
        setRecentReports(reports.slice(0, 5));
        const active = reports.filter(r => !["CLOSED", "CANCELLED", "REHOMED"].includes(r.status)).length;
        const resolved = reports.filter(r => ["CLOSED", "REHOMED"].includes(r.status)).length;
        setStats({ totalRescues: res.data.pagination?.total || reports.length, active, resolved, volunteers: 24 });
      }
    } catch {} finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchDashboardData(); }, [fetchDashboardData]);

  // Live dispatch queue via socket
  useEffect(() => {
    const cleanup = socket.on("RESCUE_DISPATCH", (data) => {
      const newDispatch: DispatchReport = data.reportData;
      setIncomingDispatch((prev) => [newDispatch, ...prev]);
      toast.warning("🚨 New Dispatch!", `${newDispatch.animalType} rescue case (${newDispatch.urgencyType}) near ${newDispatch.address}`);
    });
    return cleanup;
  }, [socket, toast]);

  const dismissDispatch = (reportId: string) => {
    setIncomingDispatch((prev) => prev.filter((d) => d.reportId !== reportId));
  };

  const STAT_CARDS = [
    { label: "Total Rescues", value: stats.totalRescues, icon: PawPrint, bg: "bg-emerald-100", color: "text-emerald-700", trend: "+12%" },
    { label: "Active Cases", value: stats.active, icon: AlertCircle, bg: "bg-orange-100", color: "text-orange-700", trend: "Live" },
    { label: "Resolved", value: stats.resolved, icon: CheckCircle, bg: "bg-blue-100", color: "text-blue-700", trend: "+8%" },
    { label: "Volunteers", value: stats.volunteers, icon: Users, bg: "bg-purple-100", color: "text-purple-700", trend: "Active" },
  ];

  return (
    <div className="space-y-6">
      {/* Live Dispatch Queue */}
      {incomingDispatch.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            <h2 className="text-sm font-extrabold text-gray-900 uppercase tracking-wide">Incoming Dispatch</h2>
            <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 text-xs font-bold">{incomingDispatch.length}</span>
          </div>
          {incomingDispatch.map((d) => (
            <div key={d.reportId} className="bg-white border-2 border-rose-200 rounded-2xl p-4 shadow-sm shadow-rose-100 animate-slide-in">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${URGENCY_COLORS[d.urgencyType] || "bg-gray-100 text-gray-700"}`}>
                      🚨 {d.urgencyType}
                    </span>
                    <span className="text-xs text-gray-400">{d.reportId}</span>
                  </div>
                  <p className="font-extrabold text-gray-900">{d.animalType} · {d.condition}</p>
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1">
                    <MapPin className="w-3 h-3" /> {d.address || "Location provided via GPS"}
                  </div>
                </div>
                <button onClick={() => dismissDispatch(d.reportId)} className="text-gray-300 hover:text-gray-500 shrink-0">✕</button>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <Phone className="w-3.5 h-3.5" />
                  <span className="font-semibold">{d.reporterName} · {d.reporterPhone}</span>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => dismissDispatch(d.reportId)}
                    className="px-3 py-1.5 border border-gray-200 text-gray-600 font-bold text-xs rounded-xl hover:bg-gray-50">
                    Decline
                  </button>
                  <Link href={`/organizations/dashboard/reports/${d.reportId}`}
                    className="px-4 py-1.5 bg-emerald-700 text-white font-bold text-xs rounded-xl hover:bg-emerald-800">
                    Accept →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STAT_CARDS.map((s) => (
          <div key={s.label} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl ${s.bg} ${s.color} flex items-center justify-center`}>
                <s.icon className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-gray-400">{s.trend}</span>
            </div>
            <p className="text-2xl font-extrabold text-gray-900">{isLoading ? "—" : s.value}</p>
            <p className="text-xs text-gray-500 font-semibold mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-extrabold text-gray-900">Monthly Rescues</h3>
            <span className="text-xs text-gray-400">Last 6 months</span>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={MOCK_MONTHLY} barSize={10} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }} />
              <Bar dataKey="cases" fill="#d1fae5" radius={[6, 6, 0, 0]} name="Cases" />
              <Bar dataKey="resolved" fill="#059669" radius={[6, 6, 0, 0]} name="Resolved" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-extrabold text-gray-900">Response Time (min)</h3>
            <span className="text-xs text-emerald-600 font-bold">Avg: 23 min</span>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={[
              { day: "Mon", time: 25 }, { day: "Tue", time: 21 }, { day: "Wed", time: 23 },
              { day: "Thu", time: 19 }, { day: "Fri", time: 22 }, { day: "Sat", time: 26 }, { day: "Sun", time: 20 },
            ]}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }} />
              <Line type="monotone" dataKey="time" stroke="#059669" strokeWidth={2.5} dot={{ fill: "#059669", r: 4 }} name="Response Time" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Reports Table */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
          <h3 className="text-sm font-extrabold text-gray-900">Recent Reports</h3>
          <Link href="/organizations/dashboard/reports" className="text-xs font-bold text-emerald-700 flex items-center gap-1">
            View all <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 text-emerald-600 animate-spin" />
          </div>
        ) : recentReports.length === 0 ? (
          <div className="text-center py-12">
            <PawPrint className="w-8 h-8 text-gray-200 mx-auto mb-2" />
            <p className="text-sm text-gray-400 font-semibold">No reports yet</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {recentReports.map((r) => (
              <Link key={r._id} href={`/organizations/dashboard/reports/${r._id}`}
                className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50 transition-colors">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center text-lg shrink-0">
                  {r.animalType === "Dog" ? "🐕" : r.animalType === "Cat" ? "🐈" : r.animalType === "Cow" ? "🐄" : "🐾"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-900">{r.animalType} · {r.reportId}</p>
                  <p className="text-xs text-gray-500 truncate">{r.address || r.reporterName}</p>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${STATUS_COLORS[r.status] || "bg-gray-100 text-gray-600"}`}>
                  {r.status?.replace("_", " ")}
                </span>
                <ChevronRight className="w-4 h-4 text-gray-300 shrink-0" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
