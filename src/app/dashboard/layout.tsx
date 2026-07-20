"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { PawPrint, Bell, Home, AlertCircle, ClipboardList, Heart, Users, ChevronRight, User } from "lucide-react";
import NotificationPanel from "@/components/ui/NotificationPanel";
import { useState } from "react";

export default function CitizenLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const [notifOpen, setNotifOpen] = useState(false);

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_DEV_BYPASS === "true") return; // skip auth redirect in dev mode
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    } else if (!isLoading && user?.userType === "organization") {
      router.push("/organizations/dashboard");
    }
  }, [isLoading, isAuthenticated, user, router]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-700 flex items-center justify-center animate-pulse">
            <PawPrint className="w-6 h-6 text-white" />
          </div>
          <p className="text-sm text-gray-500 font-medium">Loading Pranzoo…</p>
        </div>
      </div>
    );
  }

  const navLinks = [
    { href: "/dashboard", icon: Home, label: "Home" },
    { href: "/dashboard/report", icon: AlertCircle, label: "Report" },
    { href: "/dashboard/my-reports", icon: ClipboardList, label: "My Reports" },
    { href: "/dashboard/adopt", icon: Heart, label: "Adopt" },
    { href: "/dashboard/volunteer", icon: Users, label: "Volunteer" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-700 flex items-center justify-center">
              <PawPrint className="w-4.5 h-4.5 text-white" />
            </div>
            <span className="text-lg font-extrabold text-emerald-800 tracking-tight">Pranzoo</span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setNotifOpen(true)}
              className="relative w-9 h-9 rounded-xl flex items-center justify-center hover:bg-gray-100 transition-colors"
            >
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
            </button>
            <button
              onClick={() => router.push("/dashboard/profile")}
              className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-sm"
            >
              {user.fullName?.[0] || user.name?.[0] || <User className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 pt-4 pb-24">
        {children}
      </main>

      {/* Bottom Tab Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
        <div className="max-w-2xl mx-auto flex items-center justify-around px-2 h-16">
          {navLinks.map(({ href, icon: Icon, label }) => (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all group ${
                typeof window !== "undefined" && window.location.pathname === href
                  ? "text-emerald-700"
                  : "text-gray-400"
              }`}
            >
              {href === "/dashboard/report" ? (
                <div className="w-12 h-12 -mt-6 rounded-2xl bg-emerald-700 shadow-lg shadow-emerald-700/30 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-white" />
                </div>
              ) : (
                <Icon className="w-5 h-5" />
              )}
              <span className={`text-[10px] font-semibold ${href === "/dashboard/report" ? "text-emerald-700 mt-1" : ""}`}>
                {label}
              </span>
            </Link>
          ))}
        </div>
      </nav>

      {/* Notification Panel */}
      <NotificationPanel open={notifOpen} onClose={() => setNotifOpen(false)} />
    </div>
  );
}
