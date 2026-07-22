"use client";

import { useState } from "react";
import { Bell, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import NotificationPanel from "@/components/ui/NotificationPanel";

export default function DashboardHeader() {
  const { user } = useAuth();
  const [notifOpen, setNotifOpen] = useState(false);
  const displayName = user?.organizationName || user?.fullName || user?.name || "Organization";

  return (
    <div className="w-full bg-white border border-gray-100 rounded-xl p-3.5 mb-6 flex items-center justify-start space-x-4 shadow-sm">
      <button
        aria-label="Notifications"
        onClick={() => setNotifOpen(true)}
        className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-full transition-colors"
      >
        <Bell className="w-5 h-5 text-gray-600" />
        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white"></span>
      </button>

      <div className="flex items-center space-x-2 text-gray-800 font-semibold text-sm">
        <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold">
          {displayName[0]?.toUpperCase() || <User className="w-4 h-4" />}
        </div>
        <span>{displayName}</span>
      </div>

      <NotificationPanel open={notifOpen} onClose={() => setNotifOpen(false)} />
    </div>
  );
}

