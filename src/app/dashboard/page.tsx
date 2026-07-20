"use client";

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { AlertCircle, PawPrint, Heart, Users, ChevronRight, MapPin, Clock, CheckCircle, AlertTriangle, Gift } from "lucide-react";
import { useEffect, useState } from "react";
import api from "@/lib/api";

interface Report {
  _id: string;
  reportId: string;
  animalType: string;
  status: string;
  urgencyType: string;
  address?: string;
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
  CLOSED:     { label: "Closed",     color: "text-gray-600",   bg: "bg-gray-100",  dot: "bg-gray-400" },
};

const QUICK_ACTIONS = [
  {
    href: "/dashboard/report",
    icon: AlertCircle,
    label: "Report Animal",
    sub: "Stray or injured",
    bg: "bg-rose-50",
    iconBg: "bg-rose-500",
    color: "text-rose-700",
  },
  {
    href: "/dashboard/adopt",
    icon: Heart,
    label: "Adopt a Pet",
    sub: "Find your friend",
    bg: "bg-purple-50",
    iconBg: "bg-purple-500",
    color: "text-purple-700",
  },
  {
    href: "/dashboard/volunteer",
    icon: Users,
    label: "Volunteer",
    sub: "Help locally",
    bg: "bg-blue-50",
    iconBg: "bg-blue-500",
    color: "text-blue-700",
  },
  {
    href: "/dashboard/donate",
    icon: Gift,
    label: "Donate to NGO",
    sub: "Support via UPI",
    bg: "bg-emerald-50",
    iconBg: "bg-emerald-500",
    color: "text-emerald-700",
  },
];

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.REPORTED;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${cfg.color} ${cfg.bg}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

export default function CitizenDashboardHome() {
  const { user } = useAuth();
  const [recentReports, setRecentReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const displayName = user?.fullName || user?.name || "Friend";
  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  useEffect(() => {
    api.get("/reports/my").then((res) => {
      if (res.data?.success) setRecentReports(res.data.data.slice(0, 3));
    }).catch(() => {}).finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="space-y-6 py-2">
      {/* Greeting Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 font-medium">{greeting()},</p>
          <h1 className="text-2xl font-extrabold text-gray-900 leading-tight">{displayName} 👋</h1>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-700 font-extrabold text-lg shadow-inner">
          {displayName[0]?.toUpperCase()}
        </div>
      </div>

      {/* Hero Report CTA */}
      <Link
        href="/dashboard/report"
        className="block w-full bg-gradient-to-br from-emerald-600 to-teal-700 rounded-3xl p-5 text-white shadow-xl shadow-emerald-600/20 relative overflow-hidden"
      >
        <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full bg-white/10" />
        <div className="absolute -bottom-8 -right-2 w-20 h-20 rounded-full bg-white/5" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
              <AlertCircle className="w-4 h-4 text-white" />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-white/70">Emergency Rescue</span>
          </div>
          <h2 className="text-xl font-extrabold leading-tight mb-1">Spotted a stray or injured animal?</h2>
          <p className="text-sm text-white/80 mb-4">We connect you instantly with the nearest rescue organization.</p>
          <div className="inline-flex items-center gap-2 bg-white text-emerald-700 font-bold text-sm px-4 py-2 rounded-xl">
            Report Now <ChevronRight className="w-4 h-4" />
          </div>
        </div>
      </Link>

      {/* Quick Actions Grid */}
      <div>
        <h2 className="text-base font-extrabold text-gray-900 mb-3">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-3">
          {QUICK_ACTIONS.map((a) => (
            <Link key={a.href} href={a.href} className={`${a.bg} rounded-2xl p-4 flex items-start gap-3 hover:scale-[1.02] transition-transform`}>
              <div className={`${a.iconBg} w-9 h-9 rounded-xl flex items-center justify-center shrink-0`}>
                <a.icon className="w-4.5 h-4.5 text-white" />
              </div>
              <div>
                <p className={`text-sm font-bold ${a.color}`}>{a.label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{a.sub}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Reports */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-extrabold text-gray-900">My Recent Reports</h2>
          <Link href="/dashboard/my-reports" className="text-xs font-bold text-emerald-700 flex items-center gap-1">
            See all <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[1,2].map(i => (
              <div key={i} className="h-20 rounded-2xl bg-gray-100 animate-pulse" />
            ))}
          </div>
        ) : recentReports.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-6 text-center">
            <PawPrint className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-gray-500">No reports yet</p>
            <p className="text-xs text-gray-400 mt-1">Report a stray or injured animal and we'll dispatch help!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentReports.map((r) => (
              <Link
                key={r._id}
                href={`/dashboard/reports/${r._id}`}
                className="flex items-center gap-4 bg-white rounded-2xl border border-gray-100 shadow-sm p-4 hover:shadow-md transition-shadow"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 font-extrabold text-lg shrink-0">
                  {r.animalType[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-900 truncate">{r.animalType} · {r.reportId}</p>
                  <p className="text-xs text-gray-500 truncate mt-0.5">
                    {r.address || "Location not specified"}
                  </p>
                </div>
                <div className="shrink-0 flex flex-col items-end gap-1.5">
                  <StatusBadge status={r.status} />
                  <span className="text-[10px] text-gray-400">
                    {new Date(r.reportSubmittedTime).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Impact Banner */}
      <div className="bg-gradient-to-r from-teal-700 to-emerald-600 rounded-3xl p-5 text-white text-center">
        <p className="text-xs font-bold uppercase tracking-widest text-white/60 mb-1">Community Impact</p>
        <p className="text-3xl font-extrabold">12,400+</p>
        <p className="text-sm text-white/80 mt-1">Animals rescued across India with your help 🐾</p>
      </div>
    </div>
  );
}
