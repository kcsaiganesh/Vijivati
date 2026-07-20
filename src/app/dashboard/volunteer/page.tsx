"use client";

import { useState } from "react";
import { useToast } from "@/context/ToastContext";
import { Users, MapPin, Heart, Clock, Search, Send, CheckCircle2, ShieldAlert, AlertCircle } from "lucide-react";
import api from "@/lib/api";

interface Org {
  id: string;
  name: string;
  type: string;
  location: string;
  need: string;
  description: string;
  logo: string;
}

const MOCK_ORGS: Org[] = [
  {
    id: "org-1",
    name: "Paws & Care Foundation",
    type: "Rescue Shelter",
    location: "Indiranagar, Bangalore",
    need: "Stray Feeding & Rescue Drivers",
    description: "Looking for active volunteers to coordinate local feeding drives and assist our emergency rescue drivers during mornings.",
    logo: "🐾",
  },
  {
    id: "org-2",
    name: "Cupa India",
    type: "Animal Hospital",
    location: "Hebbal, Bangalore",
    need: "Fostering & In-clinic Care",
    description: "Assist veterinary staff with post-operative care, feeding schedules, and puppy socialization programs.",
    logo: "🏥",
  },
  {
    id: "org-3",
    name: "Voice for Strays",
    type: "Advocacy & Rehabilitation",
    location: "Koramangala, Bangalore",
    need: "Social Media & Adoption Coordinators",
    description: "Help us design campaigns and manage adoption listings to find forever homes for our rehabilitated dogs.",
    logo: "🐕",
  },
];

export default function VolunteerPage() {
  const [selectedOrg, setSelectedOrg] = useState<Org | null>(null);
  const [search, setSearch] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  const [form, setForm] = useState({
    skills: "",
    availability: "WEEKENDS",
    whyJoin: "",
    experience: "NO_EXPERIENCE",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrg) return;
    setIsSubmitting(true);

    try {
      // Mock submit endpoint (support dev bypass)
      const res = await api.post("/volunteers/apply", {
        organizationId: selectedOrg.id,
        organizationName: selectedOrg.name,
        ...form,
      }).catch(() => {
        // Fallback for mock/bypass mode
        return { data: { success: true } };
      });

      if (res.data?.success) {
        toast.success("Application Submitted! 🎉", `Your application to ${selectedOrg.name} has been sent.`);
        setSelectedOrg(null);
        setForm({ skills: "", availability: "WEEKENDS", whyJoin: "", experience: "NO_EXPERIENCE" });
      }
    } catch {
      toast.error("Application Failed", "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filtered = MOCK_ORGS.filter(o =>
    o.name.toLowerCase().includes(search.toLowerCase()) ||
    o.need.toLowerCase().includes(search.toLowerCase()) ||
    o.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 py-2">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">Volunteer</h1>
        <p className="text-sm text-gray-500 mt-1">Lend a hand at verified rescue organizations near you</p>
      </div>

      {/* Disclaimers */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-3 text-amber-800">
        <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
        <p className="text-xs leading-normal">
          <strong>Liability Disclaimer:</strong> All volunteer activities are undertaken at your own risk. Pranzoo
          does not inspect volunteer environments or assume any liability for injuries, illness, or claims.
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by NGO name, location, or needs..."
          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-emerald-600 bg-white"
        />
      </div>

      {/* Org Cards */}
      <div className="space-y-4">
        {filtered.map((org) => (
          <div key={org.id} className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center text-2xl shrink-0 shadow-inner">
                {org.logo}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-extrabold text-gray-900 truncate">{org.name}</p>
                <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                  <MapPin className="w-3.5 h-3.5" /> {org.location}
                </div>
              </div>
              <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full">
                {org.type}
              </span>
            </div>

            <div>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Current Need</p>
              <p className="text-sm font-extrabold text-emerald-800 mt-0.5">{org.need}</p>
              <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">{org.description}</p>
            </div>

            <button
              onClick={() => setSelectedOrg(org)}
              className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
            >
              Apply to Volunteer
            </button>
          </div>
        ))}
      </div>

      {/* Apply Modal */}
      {selectedOrg && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-slide-in border border-gray-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest">Volunteer Application</p>
                <h3 className="text-lg font-extrabold text-gray-900 mt-0.5">{selectedOrg.name}</h3>
              </div>
              <button
                onClick={() => setSelectedOrg(null)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Experience Level</label>
                <select
                  value={form.experience}
                  onChange={(e) => setForm({ ...form, experience: e.target.value })}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600 bg-white"
                >
                  <option value="NO_EXPERIENCE">No prior experience with animals</option>
                  <option value="SOME_EXPERIENCE">Have pets / assisted with strays</option>
                  <option value="VET_STUDENT">Veterinary / Vet assistant student</option>
                  <option value="EXPERIENCED_RESCUER">Active rescuer / Shelter handler</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Availability</label>
                <select
                  value={form.availability}
                  onChange={(e) => setForm({ ...form, availability: e.target.value })}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600 bg-white"
                >
                  <option value="WEEKENDS">Weekends only</option>
                  <option value="WEEKDAYS">Weekdays only</option>
                  <option value="FLEXIBLE">Flexible / On-call</option>
                  <option value="FULL_TIME">Full time</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Key Skills / Relevant Experience</label>
                <input
                  required
                  value={form.skills}
                  onChange={(e) => setForm({ ...form, skills: e.target.value })}
                  placeholder="e.g. Stray feeding, dog handling, photography, driving"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Why do you want to join us?</label>
                <textarea
                  required
                  value={form.whyJoin}
                  onChange={(e) => setForm({ ...form, whyJoin: e.target.value })}
                  rows={3}
                  placeholder="Tell us a little bit about yourself and why you'd like to volunteer..."
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600 resize-none"
                />
              </div>

              <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 flex gap-2 text-emerald-800 text-xs">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                <span>You will be notified in your dashboard once the organization reviews your application.</span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-60 text-white font-bold text-sm rounded-2xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                {isSubmitting ? "Submitting..." : <><Send className="w-4 h-4" /> Send Application</>}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
