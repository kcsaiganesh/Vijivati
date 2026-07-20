import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import { ArrowRight, ShieldCheck, Heart, PawPrint } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-4xl mx-auto my-12">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase mb-6">
          <PawPrint className="w-4 h-4" />
          <span>Pranzoo Animal Welfare Network</span>
        </div>

        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight mb-4">
          Protecting & Rescuing Animals Together
        </h1>
        <p className="text-base text-gray-600 max-w-2xl mb-8">
          Pranzoo connects citizens, volunteers, and shelters in one unified platform for emergency reports, adoptions, event coordination, and staff management.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/organizations/dashboard"
            className="px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center space-x-2"
          >
            <span>Open Organization Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/organizations/dashboard/reports"
            className="px-6 py-3 border border-gray-300 hover:bg-white text-gray-800 font-semibold text-sm rounded-xl transition-all"
          >
            View Active Reports
          </Link>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 text-left w-full">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-gray-900 text-base">Emergency Rescue</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Real-time report dispatch and urgency tracking for injured or stray animals.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center mb-3">
              <PawPrint className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-gray-900 text-base">Adoptions & Drives</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Organize adoption drives and connect loving families with rescued pets.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center mb-3">
              <Heart className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-gray-900 text-base">Volunteer Network</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Manage volunteer applications, roles, and shift scheduling effortlessly.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
