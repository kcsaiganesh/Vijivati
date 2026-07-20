"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { User, Building2, ChevronDown, Zap, Home, LayoutDashboard } from "lucide-react";

const IS_DEV = process.env.NEXT_PUBLIC_DEV_BYPASS === "true";

export default function DevPanel() {
  const [open, setOpen] = useState(false);
  const [role, setRole] = useState<"individual" | "organization">("individual");
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!IS_DEV) return;
    const stored = localStorage.getItem("dev_user_type");
    if (stored === "organization" || stored === "individual") {
      setRole(stored);
    }
  }, []);

  if (!IS_DEV) return null;

  const switchRole = (newRole: "individual" | "organization") => {
    localStorage.setItem("dev_user_type", newRole);
    setRole(newRole);
    window.dispatchEvent(new Event("dev-role-switch"));
    setOpen(false);

    // Navigate to the correct dashboard
    if (newRole === "organization") {
      router.push("/organizations/dashboard");
    } else {
      router.push("/dashboard");
    }
  };

  const quickLinks =
    role === "individual"
      ? [
          { label: "Home", href: "/dashboard" },
          { label: "Report Animal", href: "/dashboard/report" },
          { label: "My Reports", href: "/dashboard/my-reports" },
          { label: "Adopt", href: "/dashboard/adopt" },
          { label: "Volunteer", href: "/dashboard/volunteer" },
        ]
      : [
          { label: "Overview", href: "/organizations/dashboard" },
          { label: "Reports", href: "/organizations/dashboard/reports" },
          { label: "Staff", href: "/organizations/dashboard/staff" },
          { label: "Volunteers", href: "/organizations/dashboard/volunteers" },
          { label: "Events", href: "/organizations/dashboard/events" },
          { label: "Donations", href: "/organizations/dashboard/donations" },
        ];

  return (
    <div className="fixed bottom-20 right-4 z-[9999] flex flex-col items-end gap-2 select-none">
      {/* Dropdown panel */}
      {open && (
        <div className="bg-gray-900 text-white rounded-2xl shadow-2xl border border-gray-700 w-56 overflow-hidden animate-slide-in">
          {/* Header */}
          <div className="px-4 py-3 border-b border-gray-700">
            <div className="flex items-center gap-2 mb-0.5">
              <Zap className="w-3.5 h-3.5 text-yellow-400" />
              <span className="text-xs font-extrabold uppercase tracking-widest text-yellow-400">Dev Mode</span>
            </div>
            <p className="text-[10px] text-gray-500">Auth bypass · UI testing only</p>
          </div>

          {/* Role Switcher */}
          <div className="p-3 border-b border-gray-700">
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Switch Role</p>
            <div className="flex gap-2">
              <button
                onClick={() => switchRole("individual")}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  role === "individual"
                    ? "bg-emerald-600 text-white"
                    : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                }`}
              >
                <User className="w-3 h-3" /> User
              </button>
              <button
                onClick={() => switchRole("organization")}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  role === "organization"
                    ? "bg-emerald-600 text-white"
                    : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                }`}
              >
                <Building2 className="w-3 h-3" /> Org
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="p-3">
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Quick Links</p>
            <div className="space-y-1">
              {quickLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => { router.push(link.href); setOpen(false); }}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    pathname === link.href
                      ? "bg-emerald-900/60 text-emerald-400"
                      : "text-gray-300 hover:bg-gray-800"
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Trigger Pill */}
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl shadow-lg font-bold text-xs transition-all ${
          open
            ? "bg-gray-900 text-yellow-400 border border-gray-700"
            : "bg-yellow-400 text-gray-900 hover:bg-yellow-300 shadow-yellow-400/30"
        }`}
      >
        <Zap className="w-3.5 h-3.5" />
        DEV
        {role === "individual" ? (
          <span className="flex items-center gap-1 bg-gray-900/20 px-2 py-0.5 rounded-full">
            <User className="w-2.5 h-2.5" /> User
          </span>
        ) : (
          <span className="flex items-center gap-1 bg-gray-900/20 px-2 py-0.5 rounded-full">
            <Building2 className="w-2.5 h-2.5" /> Org
          </span>
        )}
        <ChevronDown className={`w-3 h-3 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
    </div>
  );
}
