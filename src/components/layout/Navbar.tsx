"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    { name: "Report Animal", href: "/dashboard/report" },
    { name: "Find Help", href: "/dashboard" },
    { name: "Adopt", href: "/dashboard/adopt" },
    { name: "Donate", href: "/dashboard/donate" },
    { name: "Volunteer", href: "/dashboard/volunteer" },
  ];

  return (
    <header className="w-full bg-white border-b border-gray-100 px-6 py-3.5 flex items-center justify-between shadow-sm sticky top-0 z-50">
      {/* Brand & Main Nav Links */}
      <div className="flex items-center space-x-8">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-2xl font-extrabold text-emerald-700 tracking-tight">
            Pranzoo
          </span>
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-gray-600 hover:text-emerald-700 transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </nav>
      </div>

      {/* Auth Actions */}
      <div className="flex items-center space-x-3">
        <Link
          href="/login"
          className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-all"
        >
          Sign in
        </Link>
        <Link
          href="/signup"
          className="px-4 py-2 text-sm font-medium text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-sm transition-all"
        >
          Sign up
        </Link>
      </div>
    </header>
  );
}
