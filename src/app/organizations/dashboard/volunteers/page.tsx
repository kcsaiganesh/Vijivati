"use client";

import { useState } from "react";
import { useToast } from "@/context/ToastContext";
import { Users, Mail, Phone, Calendar, Check, X, ShieldAlert, Award, FileText } from "lucide-react";

interface Application {
  id: string;
  name: string;
  email: string;
  phone: string;
  skills: string;
  availability: string;
  whyJoin: string;
  experience: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
}

const INITIAL_APPS: Application[] = [
  {
    id: "app-1",
    name: "Rohan Sharma",
    email: "rohan@example.com",
    phone: "+91 99112 23344",
    skills: "Stray feeding, basic animal handling",
    availability: "WEEKENDS",
    whyJoin: "I've been feeding about 15 strays in my neighborhood for the last year and would love to support an NGO structure.",
    experience: "SOME_EXPERIENCE",
    status: "PENDING",
  },
  {
    id: "app-2",
    name: "Dr. Ananya Rao",
    email: "ananya.rao@hospital.com",
    phone: "+91 98877 66554",
    skills: "Wound treatment, surgery assistant",
    availability: "FLEXIBLE",
    whyJoin: "I am a retired veterinarian looking to volunteer my medical skills for injured stray animals.",
    experience: "EXPERIENCED_RESCUER",
    status: "PENDING",
  },
  {
    id: "app-3",
    name: "Karan Patel",
    email: "karan@gmail.com",
    phone: "+91 90000 12345",
    skills: "Photography, Social Media Management",
    availability: "WEEKDAYS",
    whyJoin: "I want to help design posters and campaigns to increase pet adoption rates.",
    experience: "NO_EXPERIENCE",
    status: "APPROVED",
  },
];

const AVAILABILITY_MAP: Record<string, string> = {
  WEEKENDS: "📅 Weekends Only",
  WEEKDAYS: "⏰ Weekdays Only",
  FLEXIBLE: "⚡ Flexible / On-Call",
  FULL_TIME: "🔥 Full Time",
};

const EXP_MAP: Record<string, string> = {
  NO_EXPERIENCE: "No animal experience",
  SOME_EXPERIENCE: "Owns pets / stray feeder",
  VET_STUDENT: "Vet student",
  EXPERIENCED_RESCUER: "Shelter / Rescue handler",
};

export default function OrgVolunteersDashboard() {
  const [apps, setApps] = useState<Application[]>(INITIAL_APPS);
  const toast = useToast();

  const handleAction = (id: string, action: "APPROVED" | "REJECTED") => {
    setApps((prev) => prev.map((a) => a.id === id ? { ...a, status: action } : a));
    const name = apps.find(a => a.id === id)?.name;
    if (action === "APPROVED") {
      toast.success("Application Approved", `${name} is now added to your volunteer team.`);
    } else {
      toast.info("Application Declined", `${name}'s request was declined.`);
    }
  };

  const pending = apps.filter(a => a.status === "PENDING");
  const reviewed = apps.filter(a => a.status !== "PENDING");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Volunteer Applications</h1>
          <p className="text-sm text-gray-500 mt-1">Review and manage join requests from volunteers</p>
        </div>
        <div className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1">
          <Users className="w-4 h-4" /> {pending.length} Pending
        </div>
      </div>

      {/* Warning / Waiver Info */}
      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex gap-3 text-blue-900">
        <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
        <p className="text-xs leading-normal">
          <strong>NGO Responsibility:</strong> Prior to scheduling physical rescue or handling duties, verify volunteer
          identity and issue standard safety waivers. Pranzoo does not inspect or guarantee volunteer compatibility.
        </p>
      </div>

      {/* Pending Applications */}
      <div>
        <h2 className="text-base font-extrabold text-gray-900 mb-4">Pending Requests</h2>
        {pending.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-3xl p-10 text-center">
            <Users className="w-12 h-12 text-gray-200 mx-auto mb-3" />
            <p className="font-bold text-gray-500">All caught up!</p>
            <p className="text-xs text-gray-400 mt-1">New volunteer applications will appear here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pending.map((app) => (
              <div key={app.id} className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-extrabold text-gray-900 text-base">{app.name}</h3>
                      <span className="inline-block mt-1 px-2.5 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-full">
                        {EXP_MAP[app.experience]}
                      </span>
                    </div>
                    <span className="text-xs text-gray-400 font-semibold bg-gray-50 px-2.5 py-1 rounded-lg">
                      {AVAILABILITY_MAP[app.availability]}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <Mail className="w-3.5 h-3.5" /> {app.email}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <Phone className="w-3.5 h-3.5" /> {app.phone}
                    </div>
                  </div>

                  <div className="border-t border-gray-50 pt-3 space-y-2">
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Skills / Expertise</p>
                      <p className="text-xs text-gray-800 font-semibold mt-0.5">{app.skills}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Why Volunteer?</p>
                      <p className="text-xs text-gray-500 mt-0.5 leading-relaxed italic">"{app.whyJoin}"</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-3 border-t border-gray-50 mt-auto">
                  <button
                    onClick={() => handleAction(app.id, "REJECTED")}
                    className="flex-1 py-2 border border-gray-200 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 text-gray-600 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all"
                  >
                    <X className="w-3.5 h-3.5" /> Decline
                  </button>
                  <button
                    onClick={() => handleAction(app.id, "APPROVED")}
                    className="flex-1 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Check className="w-3.5 h-3.5" /> Approve
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Reviewed Applications */}
      {reviewed.length > 0 && (
        <div className="pt-2">
          <h2 className="text-base font-extrabold text-gray-900 mb-4">Past Applications</h2>
          <div className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden">
            <div className="divide-y divide-gray-50">
              {reviewed.map((app) => (
                <div key={app.id} className="flex items-center justify-between p-4 px-5">
                  <div>
                    <p className="font-extrabold text-gray-800 text-sm">{app.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{app.email} · {app.phone}</p>
                  </div>
                  <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${
                    app.status === "APPROVED"
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-gray-100 text-gray-500"
                  }`}>
                    {app.status === "APPROVED" ? "Approved" : "Declined"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
