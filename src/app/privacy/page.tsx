import Link from "next/link";
import { ArrowLeft, ShieldCheck, Eye, Database } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden">
        {/* Banner */}
        <div className="bg-gradient-to-r from-emerald-700 to-teal-800 p-8 text-white">
          <Link
            href="/signup"
            className="inline-flex items-center gap-1 text-xs font-bold text-emerald-100 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Signup
          </Link>
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-emerald-300" />
            <h1 className="text-2xl font-extrabold tracking-tight">Privacy Policy</h1>
          </div>
          <p className="text-emerald-100 text-xs mt-1.5 font-medium">Last updated: July 20, 2026</p>
        </div>

        {/* Content */}
        <div className="p-8 space-y-6 text-gray-700 leading-relaxed text-sm">
          <section className="space-y-2">
            <h2 className="text-base font-extrabold text-gray-900 flex items-center gap-2">
              <span className="w-1.5 h-4 bg-emerald-700 rounded-full" />
              1. Introduction
            </h2>
            <p>
              Pranzoo (developed by Vijivati Pvt Ltd) is committed to protecting your privacy. This Privacy Policy
              describes how we collect, use, process, and share your personal information when you use our web
              applications, services, and mobile interface.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-extrabold text-gray-900 flex items-center gap-2">
              <span className="w-1.5 h-4 bg-emerald-700 rounded-full" />
              2. Information We Collect
            </h2>
            <p>We collect information to facilitate immediate stray animal rescue coordination and verify NGOs:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-gray-600">
              <li>
                <strong>Account Information:</strong> Names, email addresses, phone numbers, and profile details provided
                during registration.
              </li>
              <li>
                <strong>Organization Details:</strong> Government registration numbers, NGO certificates, proof of compliances
                (such as 12A/80G tax registration), address, and official contacts.
              </li>
              <li>
                <strong>Real-Time Geolocation Data:</strong> Precise GPS coordinates captured when submitting animal rescue
                reports. This is essential to dispatch the nearest responder. We request your location permission inside the browser.
              </li>
              <li>
                <strong>Media Files:</strong> Photos or descriptions uploaded when reporting stray animals or listing pets for adoption.
              </li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-extrabold text-gray-900 flex items-center gap-2">
              <span className="w-1.5 h-4 bg-emerald-700 rounded-full" />
              3. How We Use Information
            </h2>
            <p>We use the collected information for purposes including:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-gray-600">
              <li>Matching and dispatching emergency animal reports to the nearest active rescue team (within 30km).</li>
              <li>Verifying the authenticity and NGO status of registering rescue organizations to ensure a safe community.</li>
              <li>Processing volunteer requests, enabling direct contact between users and organizations.</li>
              <li>Displaying dynamic UPI details and QR codes for peer-to-peer donation flows.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-extrabold text-gray-900 flex items-center gap-2">
              <span className="w-1.5 h-4 bg-emerald-700 rounded-full" />
              4. Data Sharing & Security
            </h2>
            <p>
              Pranzoo does not sell, rent, or trade your personal data. Citizen locations and contact info are only shared
              with the specific rescue organization dispatched to coordinate the rescue.
            </p>
            <p className="text-xs text-gray-600">
              We employ industry-standard encryption, secure socket transmissions (SSL/TLS), and cookie security controls.
              However, no storage method over the internet can be guaranteed 100% secure.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-extrabold text-gray-900 flex items-center gap-2">
              <span className="w-1.5 h-4 bg-emerald-700 rounded-full" />
              5. Cookies Policy
            </h2>
            <p>
              We use essential cookies strictly to maintain session tokens and remember authentication state. Non-essential analytical
              cookies may be stored based on your explicit cookie consent selection during login.
            </p>
          </section>

          <div className="border-t border-gray-100 pt-6 flex justify-between items-center text-xs text-gray-500">
            <span>© 2026 Pranzoo. All rights reserved.</span>
            <span>Vijivati Pvt Ltd, Bengaluru</span>
          </div>
        </div>
      </div>
    </div>
  );
}
