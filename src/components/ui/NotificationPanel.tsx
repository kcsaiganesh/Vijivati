"use client";

import { useEffect, useState, useCallback } from "react";
import { X, Bell, Check, CheckCheck, Trash2, PawPrint, Loader2 } from "lucide-react";
import api from "@/lib/api";
import { useSocket } from "@/context/SocketContext";
import Link from "next/link";

interface Notification {
  _id: string;
  type: string;
  title: string;
  body: string;
  isRead: boolean;
  createdAt: string;
  reportRef?: { _id: string; reportId: string; animalType: string };
}

const TYPE_ICONS: Record<string, string> = {
  RESCUE_DISPATCHED: "🚨",
  RESCUE_STATUS_UPDATE: "🐾",
  REPORT_SUBMITTED: "📋",
  VOLUNTEER_APPROVED: "✅",
  VOLUNTEER_REJECTED: "❌",
  NEW_VOLUNTEER_APPLICATION: "👋",
  DONATION_RECEIVED: "💚",
  EVENT_REMINDER: "📅",
  SYSTEM: "ℹ️",
};

function timeAgo(ts: string) {
  const diff = (Date.now() - new Date(ts).getTime()) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return new Date(ts).toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
}

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function NotificationPanel({ open, onClose }: Props) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const socket = useSocket();

  const fetchNotifications = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await api.get("/notifications?limit=30");
      if (res.data?.success) {
        setNotifications(res.data.notifications);
        setUnreadCount(res.data.unreadCount);
      }
    } catch {} finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Fetch initial unread count
    api.get("/notifications/unread-count").then((res) => {
      if (res.data?.success) setUnreadCount(res.data.count);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (open) fetchNotifications();
  }, [open, fetchNotifications]);

  // Live new notification via socket
  useEffect(() => {
    const cleanup = socket.on("NEW_NOTIFICATION", (data) => {
      if (data.notification) {
        setNotifications((prev) => [data.notification, ...prev]);
        setUnreadCount((c) => c + 1);
      }
    });
    return cleanup;
  }, [socket]);

  const markRead = async (id: string) => {
    await api.patch(`/notifications/${id}/read`).catch(() => {});
    setNotifications((prev) => prev.map((n) => n._id === id ? { ...n, isRead: true } : n));
    setUnreadCount((c) => Math.max(0, c - 1));
  };

  const markAllRead = async () => {
    await api.patch("/notifications/read-all").catch(() => {});
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);
  };

  const deleteNotif = async (id: string) => {
    await api.delete(`/notifications/${id}`).catch(() => {});
    const n = notifications.find((x) => x._id === id);
    setNotifications((prev) => prev.filter((x) => x._id !== id));
    if (n && !n.isRead) setUnreadCount((c) => Math.max(0, c - 1));
  };

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50" onClick={onClose} />

      {/* Panel */}
      <div className="fixed top-0 right-0 h-full w-full max-w-sm bg-white shadow-2xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-gray-700" />
            <h2 className="text-base font-extrabold text-gray-900">Notifications</h2>
            {unreadCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button onClick={markAllRead} className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                <CheckCheck className="w-3.5 h-3.5" /> All read
              </button>
            )}
            <button onClick={onClose} className="w-8 h-8 rounded-xl hover:bg-gray-100 flex items-center justify-center text-gray-500 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-6 h-6 text-emerald-600 animate-spin" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
              <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
                <Bell className="w-7 h-7 text-gray-300" />
              </div>
              <p className="font-bold text-gray-500">No notifications yet</p>
              <p className="text-xs text-gray-400 mt-1">We'll notify you when rescue updates arrive.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {notifications.map((n) => (
                <div key={n._id}
                  className={`flex items-start gap-3 p-4 transition-colors ${!n.isRead ? "bg-emerald-50/50" : "hover:bg-gray-50"}`}>
                  {/* Icon */}
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0 ${!n.isRead ? "bg-emerald-100" : "bg-gray-100"}`}>
                    {TYPE_ICONS[n.type] || "🔔"}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className={`text-sm leading-snug ${!n.isRead ? "font-bold text-gray-900" : "font-semibold text-gray-700"}`}>
                        {n.title}
                      </p>
                      {!n.isRead && (
                        <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 mt-1" />
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{n.body}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-[10px] text-gray-400 font-medium">{timeAgo(n.createdAt)}</span>
                      {n.reportRef && (
                        <Link
                          href={`/dashboard/reports/${n.reportRef._id}`}
                          onClick={onClose}
                          className="text-[10px] font-bold text-emerald-700 hover:underline"
                        >
                          View Rescue →
                        </Link>
                      )}
                      {!n.isRead && (
                        <button onClick={() => markRead(n._id)} className="text-[10px] font-bold text-gray-400 hover:text-gray-600">
                          Mark read
                        </button>
                      )}
                      <button onClick={() => deleteNotif(n._id)} className="text-[10px] text-gray-300 hover:text-rose-400 ml-auto">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// Export badge count hook helper
export { NotificationPanel };
