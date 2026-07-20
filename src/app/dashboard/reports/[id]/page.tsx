"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import { useSocket } from "@/context/SocketContext";
import { useToast } from "@/context/ToastContext";
import {
  ChevronLeft, Phone, Share2, Clock, MapPin, PawPrint, CheckCircle,
  Loader2, AlertCircle, Car, Stethoscope, Home, Check, Zap
} from "lucide-react";
import Link from "next/link";

interface TimelineEvent {
  _id: string;
  status: string;
  actorName?: string;
  note?: string;
  timestamp: string;
}

interface Report {
  _id: string;
  reportId: string;
  animalType: string;
  status: string;
  urgencyType: string;
  address?: string;
  condition?: string;
  reportSubmittedTime: string;
  rescuerEnRouteTime?: string;
  arrivedOnSceneTime?: string;
  estimatedArrivalTime?: string;
  organizationRef?: {
    _id: string;
    organizationName: string;
    phone: string;
    email: string;
    organizationProfilePic?: string;
  };
  timelineRef?: { events: TimelineEvent[] };
}

const LIFECYCLE = [
  { key: "REPORTED",   label: "Reported",   icon: AlertCircle, color: "text-blue-600",   bg: "bg-blue-100",   glow: "shadow-blue-200" },
  { key: "DISPATCHED", label: "Dispatched", icon: Zap,          color: "text-yellow-600", bg: "bg-yellow-100", glow: "shadow-yellow-200" },
  { key: "EN_ROUTE",   label: "En Route",   icon: Car,          color: "text-orange-600", bg: "bg-orange-100", glow: "shadow-orange-200" },
  { key: "ON_SCENE",   label: "On Scene",   icon: MapPin,       color: "text-red-600",    bg: "bg-red-100",    glow: "shadow-red-200" },
  { key: "RESCUED",    label: "Rescued",    icon: PawPrint,     color: "text-emerald-600",bg: "bg-emerald-100",glow: "shadow-emerald-200" },
  { key: "TREATED",    label: "Treated",    icon: Stethoscope,  color: "text-teal-600",   bg: "bg-teal-100",   glow: "shadow-teal-200" },
  { key: "REHOMED",    label: "Rehomed",    icon: Home,         color: "text-purple-600", bg: "bg-purple-100", glow: "shadow-purple-200" },
];

const URGENCY_COLOR: Record<string, string> = {
  IMMEDIATE: "bg-rose-600",
  HIGH: "bg-orange-500",
  MODERATE: "bg-amber-500",
  LOW: "bg-emerald-600",
};

function getStatusIndex(status: string) {
  const idx = LIFECYCLE.findIndex((l) => l.key === status);
  return idx === -1 ? 0 : idx;
}

function formatTime(ts?: string) {
  if (!ts) return null;
  return new Date(ts).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
}

function formatDate(ts?: string) {
  if (!ts) return null;
  return new Date(ts).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

export default function RescueTrackerPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const toast = useToast();
  const socket = useSocket();

  const [report, setReport] = useState<Report | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [liveStatus, setLiveStatus] = useState<string | null>(null);

  useEffect(() => {
    api.get(`/reports/${id}`)
      .then((res) => { if (res.data?.success) setReport(res.data.data); })
      .catch(() => toast.error("Error", "Could not load rescue report."))
      .finally(() => setIsLoading(false));
  }, [id]);

  // Join socket room for live updates
  useEffect(() => {
    socket.joinReportRoom(id);
    const cleanup = socket.on("STATUS_UPDATE", (data) => {
      if (data.reportId === id) {
        setLiveStatus(data.status);
        setReport((prev) => prev ? { ...prev, status: data.status } : prev);
        toast.info(`Status Updated`, `Rescue is now: ${data.status.replace("_", " ")}`);
      }
    });
    return () => {
      socket.leaveReportRoom(id);
      cleanup();
    };
  }, [id, socket]);

  const handleShare = async () => {
    try {
      await navigator.share({ title: `Rescue Report ${report?.reportId}`, url: window.location.href });
    } catch {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Copied!", "Report link copied to clipboard.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-emerald-700 animate-spin" />
          <p className="text-sm text-gray-500 font-medium">Loading rescue status…</p>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="text-center py-24">
        <AlertCircle className="w-10 h-10 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500 font-semibold">Report not found</p>
        <Link href="/dashboard/my-reports" className="text-emerald-700 text-sm font-bold mt-2 inline-block">
          ← Back to My Reports
        </Link>
      </div>
    );
  }

  const currentStatus = liveStatus || report.status;
  const currentIdx = getStatusIndex(currentStatus);
  const currentStep = LIFECYCLE[currentIdx];
  const isResolved = ["CLOSED", "CANCELLED", "REHOMED"].includes(currentStatus);

  return (
    <div className="space-y-5 py-2">
      {/* Back + Actions */}
      <div className="flex items-center justify-between">
        <button onClick={() => router.push("/dashboard/my-reports")}
          className="flex items-center gap-1 text-sm text-gray-500 font-semibold hover:text-gray-700">
          <ChevronLeft className="w-4 h-4" /> My Reports
        </button>
        <button onClick={handleShare}
          className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full">
          <Share2 className="w-3.5 h-3.5" /> Share
        </button>
      </div>

      {/* Status Hero Card */}
      <div className={`rounded-3xl p-5 text-white relative overflow-hidden ${URGENCY_COLOR[report.urgencyType] || "bg-emerald-700"}`}>
        <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/10" />
        <div className="absolute -bottom-10 right-4 w-24 h-24 rounded-full bg-white/5" />
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-white/60">{report.reportId}</p>
              <h1 className="text-2xl font-extrabold mt-0.5">{report.animalType} Rescue</h1>
              <p className="text-sm text-white/80 mt-1">{report.condition || "Condition not specified"}</p>
            </div>
            <div className={`w-12 h-12 rounded-2xl ${currentStep.bg} flex items-center justify-center shadow-lg ${currentStep.glow}`}>
              {currentStep && <currentStep.icon className={`w-6 h-6 ${currentStep.color}`} />}
            </div>
          </div>

          {/* Current Status Badge */}
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            <span className="text-sm font-bold text-white">{currentStatus.replace("_", " ")}</span>
          </div>

          {report.address && (
            <div className="flex items-center gap-1.5 mt-3 text-white/70 text-xs">
              <MapPin className="w-3.5 h-3.5" />
              <span>{report.address}</span>
            </div>
          )}
        </div>
      </div>

      {/* Rescue Timeline */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5">
        <h2 className="text-sm font-extrabold text-gray-900 mb-5">Rescue Timeline</h2>
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-[19px] top-0 bottom-0 w-0.5 bg-gray-100" />

          <div className="space-y-5">
            {LIFECYCLE.filter((_, i) => !isResolved || i <= currentIdx).map((step, i) => {
              const isDone = i < currentIdx;
              const isActive = i === currentIdx;
              const isPending = i > currentIdx;

              // Find timeline event for this status
              const events = report.timelineRef?.events || [];
              const event = events.find((e) => e.status === step.key);

              return (
                <div key={step.key} className={`flex items-start gap-4 ${isPending ? "opacity-35" : ""}`}>
                  <div className={`relative z-10 w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 transition-all ${
                    isActive ? `${step.bg} shadow-md ${step.glow}` :
                    isDone ? "bg-emerald-100" : "bg-gray-100"
                  }`}>
                    {isDone ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <step.icon className={`w-4 h-4 ${isActive ? step.color : "text-gray-400"}`} />
                    )}
                    {isActive && (
                      <span className={`absolute -inset-1 rounded-2xl border-2 ${step.bg.replace("bg-", "border-").replace("-100", "-400")} animate-ping opacity-30`} />
                    )}
                  </div>

                  <div className="flex-1 min-w-0 pt-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <p className={`text-sm font-bold ${isActive ? step.color : isDone ? "text-gray-700" : "text-gray-400"}`}>
                        {step.label}
                        {isActive && <span className="ml-2 text-xs font-semibold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">Current</span>}
                      </p>
                      {event && (
                        <span className="text-[10px] text-gray-400 font-medium shrink-0">
                          {formatTime(event.timestamp)}
                        </span>
                      )}
                    </div>
                    {event?.note && (
                      <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{event.note}</p>
                    )}
                    {event?.actorName && !isPending && (
                      <p className="text-[10px] text-gray-400 mt-0.5">by {event.actorName}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Dispatched Org Card */}
      {report.organizationRef && (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5 space-y-4">
          <h2 className="text-sm font-extrabold text-gray-900">Rescue Organization</h2>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-700 font-extrabold text-2xl shrink-0">
              {report.organizationRef.organizationName[0]}
            </div>
            <div className="flex-1">
              <p className="font-extrabold text-gray-900">{report.organizationRef.organizationName}</p>
              <p className="text-xs text-gray-500 mt-0.5">{report.organizationRef.email}</p>
            </div>
          </div>
          <a href={`tel:${report.organizationRef.phone}`}
            className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm rounded-2xl transition-all">
            <Phone className="w-4 h-4" />
            Call Rescue Team · {report.organizationRef.phone}
          </a>
        </div>
      )}

      {/* Report Details */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5">
        <h2 className="text-sm font-extrabold text-gray-900 mb-3">Report Details</h2>
        <div className="space-y-2">
          {[
            { label: "Report ID", value: report.reportId },
            { label: "Submitted", value: `${formatDate(report.reportSubmittedTime)} at ${formatTime(report.reportSubmittedTime)}` },
            { label: "Animal", value: report.animalType },
            { label: "Urgency", value: report.urgencyType },
            { label: "Condition", value: report.condition || "Not specified" },
          ].map(({ label, value }) => (
            <div key={label} className="flex gap-3 py-1.5 border-b border-gray-50 last:border-0">
              <span className="text-xs text-gray-400 font-semibold w-20 shrink-0">{label}</span>
              <span className="text-xs text-gray-800 font-medium">{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Resolution Message */}
      {isResolved && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-5 text-center">
          <CheckCircle className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
          <p className="font-extrabold text-emerald-800 text-lg">Rescue Complete! 🐾</p>
          <p className="text-sm text-emerald-700 mt-1">Thank you for helping this animal find safety.</p>
          <Link href="/dashboard/report"
            className="mt-4 inline-flex items-center gap-2 bg-emerald-700 text-white text-sm font-bold px-5 py-2.5 rounded-2xl">
            Report Another Animal
          </Link>
        </div>
      )}
    </div>
  );
}
