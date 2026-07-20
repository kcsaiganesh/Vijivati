import Link from "next/link";
import { ArrowLeft, ShieldAlert, Scale, CheckCircle2 } from "lucide-react";

export default function TermsOfServicePage() {
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
            <Scale className="w-8 h-8 text-emerald-300" />
            <h1 className="text-2xl font-extrabold tracking-tight">Terms of Service</h1>
          </div>
          <p className="text-emerald-100 text-xs mt-1.5 font-medium">Last updated: July 20, 2026</p>
        </div>

        {/* Content */}
        <div className="p-8 space-y-6 text-gray-700 leading-relaxed text-sm">
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-3 text-amber-800">
            <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
            <div className="text-xs">
              <p className="font-bold mb-0.5">IMPORTANT LEGAL NOTICE FOR ALL USERS</p>
              <p>
                Pranzoo is an animal rescue connection platform, not an animal rescue organization. We do not inspect,
                verify, or take responsibility for rescue operations, volunteers, donations, or animal reports.
              </p>
            </div>
          </div>

          <section className="space-y-2">
            <h2 className="text-base font-extrabold text-gray-900 flex items-center gap-2">
              <span className="w-1.5 h-4 bg-emerald-700 rounded-full" />
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing or using the Pranzoo platform, you agree to comply with and be bound by these Terms of Service.
              If you do not agree to these terms, you may not use the services. These terms apply to all individuals,
              rescue groups, NGOs, clinics, and organizations using the platform.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-extrabold text-gray-900 flex items-center gap-2">
              <span className="w-1.5 h-4 bg-emerald-700 rounded-full" />
              2. Nature of Services & Disclaimers
            </h2>
            <p>
              Pranzoo acts solely as a technological intermediary connecting citizens who report stray or injured animals
              with nearby independent registered rescue organizations, shelters, and clinics.
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-gray-600">
              <li>
                <strong>No Agency:</strong> No agency, partnership, joint venture, or employment relationship is created between
                Pranzoo and any user, volunteer, or organization.
              </li>
              <li>
                <strong>No Control:</strong> Pranzoo has no control over, and does not guarantee the truth, safety, accuracy, or quality
                of any animal reports, organization capabilities, response times, or treatment quality.
              </li>
              <li>
                <strong>Limitation of Liability:</strong> Under no circumstances shall Pranzoo or its parent entity (Vijivati Pvt Ltd)
                be liable for any injury, loss, death of any animal, property damage, volunteer accidents, or financial losses
                resulting from the actions of organizations or users on this platform.
              </li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-extrabold text-gray-900 flex items-center gap-2">
              <span className="w-1.5 h-4 bg-emerald-700 rounded-full" />
              3. Organization Registration & Verification
            </h2>
            <p>
              Organizations registering on Pranzoo represent that they are active, legally compliant entities (such as registered NGOs,
              trusts, or clinics) in India.
            </p>
            <p className="text-xs text-gray-600">
              Organizations must provide true, complete registration certificates, compliance documents, and active contact numbers.
              Pranzoo reserves the right to suspend or terminate any organization profile that fails verification checks, provides false information,
              or acts in violation of animal welfare laws.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-extrabold text-gray-900 flex items-center gap-2">
              <span className="w-1.5 h-4 bg-emerald-700 rounded-full" />
              4. Donation Processing & Fees
            </h2>
            <p>
              Donations are processed directly via third-party UPI applications (e.g. Google Pay, PhonePe, Paytm) or bank transfers.
              Pranzoo does not hold, manage, or take commission on peer-to-peer donation transactions.
            </p>
            <p className="text-xs text-gray-600">
              Donors are solely responsible for verifying the tax-exemption status (under 80G/12A of the Income Tax Act) of the
              respective rescue organizations before donating. Pranzoo is not responsible for any refund, dispute, or misappropriation
              of donation funds.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-extrabold text-gray-900 flex items-center gap-2">
              <span className="w-1.5 h-4 bg-emerald-700 rounded-full" />
              5. Indemnification
            </h2>
            <p>
              You agree to indemnify, defend, and hold harmless Pranzoo, its officers, directors, employees, and parent entity (Vijivati Pvt Ltd)
              from and against any claims, liabilities, damages, losses, and expenses arising out of your access to or use of the services,
              your violation of these Terms, or any animal report or volunteer activity conducted by you.
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
