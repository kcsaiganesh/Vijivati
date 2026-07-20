"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  FileText,
  PawPrint,
  Users,
  Calendar,
  UserCheck,
  DollarSign,
  User,
  Settings,
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    {
      name: "Overview",
      subtext: "Dashboard overview and statistics",
      href: "/organizations/dashboard",
      icon: BarChart3,
      exact: true,
    },
    {
      name: "Reports",
      subtext: "Manage animal reports and cases",
      href: "/organizations/dashboard/reports",
      icon: FileText,
    },
    {
      name: "Adoptions",
      subtext: "Manage adoption listings and applications",
      href: "/organizations/dashboard/adoptions",
      icon: PawPrint,
    },
    {
      name: "Volunteers",
      subtext: "Manage volunteer applications",
      href: "/organizations/dashboard/volunteers",
      icon: Users,
    },
    {
      name: "Events",
      subtext: "Manage events and campaigns",
      href: "/organizations/dashboard/events",
      icon: Calendar,
    },
    {
      name: "Staff",
      subtext: "Manage staff and roles",
      href: "/organizations/dashboard/staff",
      icon: UserCheck,
    },
    {
      name: "Donations",
      subtext: "Track donations and expenses",
      href: "/organizations/dashboard/donations",
      icon: DollarSign,
    },
    {
      name: "Profile",
      subtext: "Organization profile settings",
      href: "/organizations/dashboard/profile",
      icon: User,
    },
    {
      name: "Settings",
      subtext: "System settings and preferences",
      href: "/organizations/dashboard/settings",
      icon: Settings,
    },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-100 min-h-[calc(100vh-65px)] p-4 flex flex-col justify-between">
      <div>
        <div className="px-3 py-2 mb-2">
          <h2 className="text-xl font-bold text-gray-900">Dashboard</h2>
        </div>

        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-start gap-3 p-2.5 rounded-xl transition-all ${
                  isActive
                    ? "bg-emerald-50 text-emerald-700"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <Icon
                  className={`w-5 h-5 mt-0.5 shrink-0 ${
                    isActive ? "text-emerald-700" : "text-gray-400"
                  }`}
                />
                <div className="flex flex-col">
                  <span className="text-sm font-bold leading-tight">
                    {item.name}
                  </span>
                  <span className="text-[11px] leading-tight text-gray-400 mt-0.5 font-normal">
                    {item.subtext}
                  </span>
                </div>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
