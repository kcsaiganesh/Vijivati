"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import { useSocket } from "@/context/SocketContext";
import { useToast } from "@/context/ToastContext";
import {
  ChevronLeft, Phone, MapPin, AlertCircle, User, Clock,
  Check, Car, Stethoscope, Home, PawPrint, Zap, Loader2, MessageSquare
} from "lucide-react";

interface Report {
  _id: string;
  reportId: string;
  animalType: string;
  status: string;
  urgencyType: string;
  address?: string;
  condition?: string;
  description?: string;
  landMark?: string;
  reporterName: string;
  reporterPhone?: string;
  reportSubmittedTime: string;
  reportAssignedTime?: string;
  rescuerEnRouteTime?: string;
  arrivedOnSceneTime?: string;
  timelineRef?: { events: any[] };
}

const STATUS_FLOW = [
  { key: "REPORTED",   label: "Reported",   icon: AlertCircle },
  { key: "DISPATCHED", label: "Dispatched", icon: Zap },
  { key: "EN_ROUTE",   label: "En Route",   icon: Car },
  { key: "ON_SCENE",   label: "On Scene",   icon: MapPin },
  { key: "RESCUED",    label: "Rescued",    icon: PawPrint },
  { key: "TREATED",    label: "Treated",    icon: Stethoscope },
  { key: "RECOVERED",  label: "Recovered",  icon: Clock },
  { key: "REHOMED",    label: "Rehomed",    icon: Home },
];

const NEXT_STATUS: Record<string, string | null> = {
  DISPATCHED: "EN_ROUTE",
  EN_ROUTE:   "ON_SCENE",
  ON_SCENE:   "RESCUED",
  RESCUED:    "TREATED",
  TREATED:    "RECOVERED",
  RECOVERED:  "REHOMED",
  REHOMED:    null,
  CLOSED:     null,
};

const BUTTON_LABELS: Record<string, string> = {
  EN_ROUTE:  "🚗 Mark En Route",
  ON_SCENE:  "📍 Mark On Scene",
  RESCUED:   "🐾 Mark Rescued",
  TREATED:   "💉 Mark Treated",
  RECOVERED: "💚 Mark Recovered",
  REHOMED:   "🏠 Mark Rehomed",
};

const URGENCY_COLOR: Record<string, string> = {
  IMMEDIATE: "bg-rose-600", HIGH: "bg-orange-500", MODERATE: "bg-amber-500", LOW: "bg-emerald-600",
};

export default function OrgReportDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const toast = useToast();
  const socket = useSocket();

  const [report, setReport] = useState<Report | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [note, setNote] = useState("");
  const [showNote, setShowNote] = useState(false);

  useEffect(() => {
    api.get(`/reports/${id}`)
      .then((res) => { if (res.data?.success) setReport(res.data.data); })
      .catch(() => toast.error("Error", "Could not load report."))
      .finally(() => setIsLoading(false));
  }, [id]);

  // Listen for external status updates
  useEffect(() => {
    socket.joinReportRoom(id);
    const cleanup = socket.on("STATUS_UPDATE", (data) => {
      if (data.reportId === id) {
        setReport((prev) => prev ? { ...prev, status: data.status } : prev);
      }
    });
    return () => { socket.leaveReportRoom(id); cleanup(); };
  }, [id, socket]);

  const updateStatus = async (newStatus: string) => {
    setIsUpdating(true);
    try {
      const res = await api.patch(`/reports/${id}/status`, { status: newStatus, note });
      if (res.data?.success) {
        setReport((prev) => prev ? { ...prev, status: newStatus } : prev);
        toast.success(`Status updated`, `Report is now ${newStatus.replace("_", " ")}`);
        setNote("");
        setShowNote(false);
      }
    } catch (err: any) {
      toast.error("Update failed", err.response?.data?.message || "Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  const closeCase = async () => {
    await updateStatus("CLOSED");
    router.push("/organizations/dashboard");
  };

  if (isLoading) return (
    <div className="flex items-center justify-center py-24">
      <Loader2 className="w-8 h-8 text-emerald-700 animate-spin" />
    </div>
  );

  if (!report) return (
    <div className="text-center py-24">
      <p className="text-gray-500 font-semibold">Report not found</p>
    </div>
  );

  const currentIdx = STATUS_FLOW.findIndex(s => s.key === report.status);
  const nextStatus = NEXT_STATUS[report.status];
  const isTerminal = !nextStatus;

  return (
    <div className="space-y-5 max-w-2xl">
      {/* Back */}
      <button onClick={() => router.back()}
        className="flex items-center gap-1 text-sm text-gray-500 font-semibold hover:text-gray-700">
        <ChevronLeft className="w-4 h-4" /> Back to Reports
      </button>

      {/* Hero Banner */}
      <div className={`rounded-2xl p-5 text-white ${URGENCY_COLOR[report.urgencyType] || "bg-emerald-700"}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-white/60 uppercase tracking-widest">{report.reportId}</p>
            <h1 className="text-xl font-extrabold mt-0.5">{report.animalType} · {report.condition || "Unknown condition"}</h1>
          </div>
          <div className="text-right">
            <p className="text-xs text-white/60">Current Status</p>
            <p className="font-extrabold text-sm mt-0.5 bg-white/20 px-3 py-1 rounded-full">
              {report.status.replace("_", " ")}
            </p>
          </div>
        </div>
      </div>

      {/* Status Update Controls */}
      {!isTerminal && (
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-3">
          <h2 className="text-sm font-extrabold text-gray-900">Update Rescue Status</h2>

          {/* Status Flow Visual */}
          <div className="flex items-center gap-1 overflow-x-auto pb-2">
            {STATUS_FLOW.slice(1).map((s, i) => {
              const sIdx = STATUS_FLOW.findIndex(x => x.key === s.key);
              const isDone = sIdx < currentIdx;
              const isActive = sIdx === currentIdx;
              return (
                <div key={s.key} className="flex items-center gap-1 shrink-0">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    isDone ? "bg-emerald-600 text-white" :
                    isActive ? "bg-emerald-700 text-white ring-2 ring-emerald-200" :
                    "bg-gray-100 text-gray-400"
                  }`}>
                    {isDone ? <Check className="w-3.5 h-3.5" /> : <s.icon className="w-3 h-3" />}
                  </div>
                  {i < STATUS_FLOW.length - 2 && <div className={`w-6 h-0.5 ${isDone ? "bg-emerald-600" : "bg-gray-200"}`} />}
                </div>
              );
            })}
          </div>

          {/* Note Toggle */}
          <button onClick={() => setShowNote(!showNote)}
            className="flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-gray-600">
            <MessageSquare className="w-3.5 h-3.5" />
            {showNote ? "Hide note" : "Add a note (optional)"}
          </button>
          {showNote && (
            <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={2}
              placeholder="Add a note about the rescue situation…"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600 resize-none" />
          )}

          {/* Primary Action Button */}
          {nextStatus && (
            <button onClick={() => updateStatus(nextStatus)} disabled={isUpdating}
              className="w-full py-3.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-60 text-white font-extrabold text-sm rounded-2xl flex items-center justify-center gap-2 transition-all shadow-sm">
              {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : BUTTON_LABELS[nextStatus] || `Mark as ${nextStatus}`}
            </button>
          )}

          {/* Close Case */}
          {report.status !== "CLOSED" && report.status !== "CANCELLED" && (
            <button onClick={closeCase} disabled={isUpdating}
              className="w-full py-2.5 border border-gray-200 text-gray-500 font-semibold text-xs rounded-2xl hover:bg-gray-50">
              Close Case
            </button>
          )}
        </div>
      )}

      {/* Reporter Info */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
        <h2 className="text-sm font-extrabold text-gray-900 mb-3">Reporter Information</h2>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
            <User className="w-5 h-5 text-gray-500" />
          </div>
          <div>
            <p className="font-bold text-gray-900">{report.reporterName}</p>
            {report.reporterPhone && <p className="text-xs text-gray-500">{report.reporterPhone}</p>}
          </div>
        </div>
        {report.reporterPhone && (
          <a href={`tel:${report.reporterPhone}`}
            className="w-full flex items-center justify-center gap-2 py-2.5 border-2 border-emerald-200 text-emerald-700 font-bold text-sm rounded-xl hover:bg-emerald-50 transition-colors">
            <Phone className="w-4 h-4" /> Call Reporter
          </a>
        )}
      </div>

      {/* Location */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
        <h2 className="text-sm font-extrabold text-gray-900 mb-3">Location Details</h2>
        <div className="space-y-2">
          {[
            { label: "Address", value: report.address },
            { label: "Landmark", value: report.landMark },
            { label: "Notes", value: report.description },
          ].filter(item => item.value).map(({ label, value }) => (
            <div key={label} className="flex gap-3">
              <span className="text-xs text-gray-400 font-semibold w-20 shrink-0">{label}</span>
              <span className="text-xs text-gray-800 font-medium">{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Timeline */}
      {report.timelineRef?.events && report.timelineRef.events.length > 0 && (
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <h2 className="text-sm font-extrabold text-gray-900 mb-4">Activity Timeline</h2>
          <div className="space-y-3">
            {report.timelineRef.events.map((event, i) => (
              <div key={event._id || i} className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5 text-emerald-700" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-gray-800">{event.status?.replace("_", " ")}</p>
                  {event.note && <p className="text-xs text-gray-500 mt-0.5">{event.note}</p>}
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    {new Date(event.timestamp).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                    {event.actorName && ` · by ${event.actorName}`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
