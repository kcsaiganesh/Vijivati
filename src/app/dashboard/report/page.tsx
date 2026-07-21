"use client";

import { useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import api from "@/lib/api";
import {
  PawPrint, ChevronRight, ChevronLeft, MapPin, Camera, User,
  Phone, AlertTriangle, Check, Navigation, Loader2, X
} from "lucide-react";
import dynamic from "next/dynamic";

// Lazy load map to avoid SSR issues
const LocationPicker = dynamic(() => import("@/components/ui/LocationPicker"), { ssr: false, loading: () => (
  <div className="h-48 rounded-2xl bg-gray-100 animate-pulse flex items-center justify-center">
    <MapPin className="w-6 h-6 text-gray-300" />
  </div>
)});

const ANIMAL_TYPES = ["Dog", "Cat", "Cow", "Monkey", "Bird", "Horse", "Goat", "Other"];
const CONDITIONS = ["Injured", "Sick", "Stray", "Lost Pet", "Aggressive", "Malnourished"];
const URGENCIES = [
  { value: "IMMEDIATE", label: "🚨 Immediate", desc: "Life-threatening, critical injury", color: "border-rose-500 bg-rose-50 text-rose-700" },
  { value: "HIGH", label: "⚡ High", desc: "Injured, needs fast help", color: "border-orange-500 bg-orange-50 text-orange-700" },
  { value: "MODERATE", label: "🔶 Moderate", desc: "Unwell but stable", color: "border-amber-500 bg-amber-50 text-amber-700" },
];

interface FormState {
  animalType: string;
  conditions: string[];
  urgencyType: string;
  description: string;
  address: string;
  landMark: string;
  latitude: number | null;
  longitude: number | null;
  reporterName: string;
  reporterPhone: string;
  files: File[];
}

const STEPS = ["Animal", "Location", "Details", "Confirm"];

export default function ReportWizard() {
  const { user } = useAuth();
  const toast = useToast();
  const router = useRouter();

  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGpsLoading, setIsGpsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<FormState>({
    animalType: "",
    conditions: [],
    urgencyType: "MODERATE",
    description: "",
    address: "",
    landMark: "",
    latitude: null,
    longitude: null,
    reporterName: user?.fullName || user?.name || "",
    reporterPhone: "",
    files: [],
  });

  const update = (patch: Partial<FormState>) => setForm((f) => ({ ...f, ...patch }));

  const toggleCondition = (c: string) => {
    update({
      conditions: form.conditions.includes(c)
        ? form.conditions.filter((x) => x !== c)
        : [...form.conditions, c],
    });
  };

  const handleGps = () => {
    setIsGpsLoading(true);
    
    // Check if the browser supports geolocation
    if (!navigator.geolocation) {
      setIsGpsLoading(false);
      toast.error("GPS unavailable", "Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        update({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
        setIsGpsLoading(false);
        toast.success("Location detected!", "GPS coordinates captured.");
      },
      (err) => {
        setIsGpsLoading(false);
        let errorMsg = "Please pin your location on the map or type an address.";
        
        if (err.code === 1) {
            errorMsg = "Location permission denied. Please allow location access in your browser settings.";
        } else if (err.code === 2) {
            errorMsg = "Location unavailable. Ensure your device's GPS is turned on.";
        } else if (err.code === 3) {
            errorMsg = "Location request timed out. Please try again or use the map.";
        } 
        
        // Mobile browsers block GPS over HTTP
        if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
            errorMsg = "Mobile browsers require HTTPS to use GPS. Please use the map instead.";
        }
        
        toast.error("GPS Error", errorMsg);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const canProceed = () => {
    if (step === 0) return !!form.animalType && form.conditions.length > 0;
    if (step === 1) return !!(form.address || form.latitude);
    if (step === 2) return !!form.reporterName && form.reporterPhone.length === 10;
    return true;
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const payload = new FormData();
      payload.append("animalType", form.animalType);
      payload.append("condition", form.conditions.join(", "));
      payload.append("urgencyType", form.urgencyType);
      payload.append("description", form.description);
      payload.append("address", form.address);
      payload.append("landMark", form.landMark);
      payload.append("reporterName", form.reporterName);
      payload.append("reporterPhone", form.reporterPhone);
      if (form.latitude) payload.append("latitude", String(form.latitude));
      if (form.longitude) payload.append("longitude", String(form.longitude));
      form.files.forEach((f) => payload.append("files", f));

      const res = await api.post("/reports", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data?.success) {
        const reportId = res.data.data._id;
        toast.success("Report submitted! 🐾", "We're contacting the nearest rescue organization.");
        router.push(`/dashboard/reports/${reportId}`);
      }
    } catch (err: any) {
      toast.error("Submission failed", err.response?.data?.message || "Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 py-2">
      {/* Header */}
      <div>
        <button onClick={() => step > 0 ? setStep(s => s - 1) : router.push("/dashboard")}
          className="flex items-center gap-1 text-sm text-gray-500 font-semibold mb-4 hover:text-gray-700 transition-colors">
          <ChevronLeft className="w-4 h-4" /> Back
        </button>
        <h1 className="text-2xl font-extrabold text-gray-900">Report an Animal</h1>
        <p className="text-sm text-gray-500 mt-1">We'll dispatch the nearest rescue team immediately</p>
      </div>

      {/* Progress Stepper */}
      <div className="flex items-center gap-0">
        {STEPS.map((label, i) => (
          <div key={label} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                i < step ? "bg-emerald-700 text-white" :
                i === step ? "bg-emerald-700 text-white ring-4 ring-emerald-100" :
                "bg-gray-200 text-gray-500"
              }`}>
                {i < step ? <Check className="w-4 h-4" /> : i + 1}
              </div>
              <span className={`text-[10px] font-semibold ${i === step ? "text-emerald-700" : "text-gray-400"}`}>
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`flex-1 h-0.5 mb-4 mx-1 transition-all ${i < step ? "bg-emerald-700" : "bg-gray-200"}`} />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Animal Info */}
      {step === 0 && (
        <div className="space-y-5">
          <div>
            <p className="text-sm font-bold text-gray-700 mb-3">What animal did you find?</p>
            <div className="grid grid-cols-4 gap-2">
              {ANIMAL_TYPES.map((type) => (
                <button key={type} onClick={() => update({ animalType: type })}
                  className={`py-3 rounded-2xl text-xs font-bold text-center transition-all border-2 ${
                    form.animalType === type
                      ? "border-emerald-600 bg-emerald-50 text-emerald-700"
                      : "border-gray-100 bg-white text-gray-600 hover:border-emerald-200"
                  }`}>
                  {type === "Dog" ? "🐕" : type === "Cat" ? "🐈" : type === "Cow" ? "🐄" :
                   type === "Monkey" ? "🐒" : type === "Bird" ? "🐦" : type === "Horse" ? "🐎" :
                   type === "Goat" ? "🐐" : "🐾"}<br />{type}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-bold text-gray-700 mb-3">What's the condition? <span className="text-gray-400 font-normal">(select all that apply)</span></p>
            <div className="flex flex-wrap gap-2">
              {CONDITIONS.map((c) => (
                <button key={c} onClick={() => toggleCondition(c)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all border-2 ${
                    form.conditions.includes(c)
                      ? "border-emerald-600 bg-emerald-50 text-emerald-700"
                      : "border-gray-100 bg-white text-gray-600 hover:border-emerald-200"
                  }`}>
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-bold text-gray-700 mb-3">Urgency Level</p>
            <div className="space-y-2">
              {URGENCIES.map((u) => (
                <button key={u.value} onClick={() => update({ urgencyType: u.value })}
                  className={`w-full text-left p-3.5 rounded-2xl border-2 transition-all ${
                    form.urgencyType === u.value ? u.color : "border-gray-100 bg-white hover:border-gray-200"
                  }`}>
                  <p className="text-sm font-bold">{u.label}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{u.desc}</p>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Add Photos <span className="text-gray-400 font-normal">(optional, up to 5)</span></label>
            <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden"
              onChange={(e) => update({ files: Array.from(e.target.files || []).slice(0, 5) })} />
            <button onClick={() => fileInputRef.current?.click()}
              className="w-full h-24 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center gap-2 hover:border-emerald-400 hover:bg-emerald-50 transition-all">
              <Camera className="w-6 h-6 text-gray-400" />
              <span className="text-xs font-semibold text-gray-500">
                {form.files.length > 0 ? `${form.files.length} photo(s) selected` : "Tap to add photos"}
              </span>
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Location */}
      {step === 1 && (
        <div className="space-y-4">
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-start gap-3">
            <AlertTriangle className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <p className="text-xs text-emerald-800 font-medium">
              We use this location to dispatch the nearest rescue team. Be as precise as possible.
            </p>
          </div>

          {/* GPS Button */}
          <button onClick={handleGps} disabled={isGpsLoading}
            className="w-full flex items-center gap-3 p-4 bg-emerald-700 text-white rounded-2xl font-bold text-sm disabled:opacity-70">
            {isGpsLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Navigation className="w-5 h-5" />}
            {isGpsLoading ? "Detecting location…" : form.latitude ? `GPS: ${form.latitude.toFixed(4)}, ${form.longitude?.toFixed(4)}` : "Use My Current Location (GPS)"}
          </button>

          {/* Map Picker */}
          <LocationPicker
            lat={form.latitude}
            lng={form.longitude}
            onSelect={(lat, lng) => update({ latitude: lat, longitude: lng })}
          />

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Address / Area</label>
            <div className="relative">
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input value={form.address} onChange={(e) => update({ address: e.target.value })}
                placeholder="e.g. MG Road, near Indiranagar Metro, Bangalore"
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-emerald-600" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Landmark</label>
            <input value={form.landMark} onChange={(e) => update({ landMark: e.target.value })}
              placeholder="e.g. Near the bus stop, in front of ABC temple"
              className="w-full px-4 py-3 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-emerald-600" />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Additional Notes <span className="text-gray-400 font-normal">(optional)</span></label>
            <textarea value={form.description} onChange={(e) => update({ description: e.target.value })}
              rows={3} placeholder="Describe where exactly you saw the animal…"
              className="w-full px-4 py-3 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-emerald-600 resize-none" />
          </div>
        </div>
      )}

      {/* Step 3: Reporter Details */}
      {step === 2 && (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4">
            <p className="text-xs font-semibold text-blue-800">Your details help the rescue team contact you if needed. They won't be shared publicly.</p>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Your Name</label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input required value={form.reporterName} onChange={(e) => update({ reporterName: e.target.value })}
                placeholder="Your full name"
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-emerald-600" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input required value={form.reporterPhone}
                type="tel"
                inputMode="numeric"
                maxLength={10}
                pattern="[0-9]{10}"
                onChange={(e) => {
                  // Strict validation: Indian mobile format, digits only, max 10
                  const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                  update({ reporterPhone: val });
                }}
                placeholder="10-digit mobile number"
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-emerald-600" />
            </div>
            {form.reporterPhone.length > 0 && form.reporterPhone.length < 10 && (
                <p className="text-[10px] text-rose-500 font-medium mt-1 pl-1">Phone number must be exactly 10 digits</p>
            )}
          </div>
        </div>
      )}

      {/* Step 4: Confirm */}
      {step === 3 && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className={`p-4 ${form.urgencyType === "IMMEDIATE" ? "bg-rose-600" : form.urgencyType === "HIGH" ? "bg-orange-500" : "bg-amber-500"}`}>
              <p className="text-white font-extrabold text-lg">{form.animalType} Rescue Report</p>
              <p className="text-white/80 text-xs mt-1">{form.urgencyType} urgency · {form.conditions.join(", ")}</p>
            </div>
            <div className="divide-y divide-gray-50 p-1">
              {[
                { label: "Animal", value: form.animalType },
                { label: "Condition", value: form.conditions.join(", ") || "Not specified" },
                { label: "Urgency", value: form.urgencyType },
                { label: "Address", value: form.address || "GPS coordinates provided" },
                { label: "Landmark", value: form.landMark || "Not provided" },
                { label: "Reporter", value: form.reporterName },
                { label: "Phone", value: form.reporterPhone },
                { label: "Notes", value: form.description || "None" },
              ].map(({ label, value }) => (
                <div key={label} className="flex gap-3 p-3">
                  <span className="text-xs text-gray-400 font-semibold w-20 shrink-0">{label}</span>
                  <span className="text-xs text-gray-800 font-medium flex-1">{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-center">
            <p className="text-sm font-bold text-emerald-800">🚑 On submit, we auto-dispatch to the nearest rescue org within 30km.</p>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex gap-3 pt-2">
        {step > 0 && (
          <button onClick={() => setStep(s => s - 1)}
            className="flex-1 py-3.5 border-2 border-gray-200 rounded-2xl text-sm font-bold text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2">
            <ChevronLeft className="w-4 h-4" /> Back
          </button>
        )}
        {step < 3 ? (
          <button onClick={() => setStep(s => s + 1)} disabled={!canProceed()}
            className="flex-1 py-3.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold text-sm rounded-2xl flex items-center justify-center gap-2 transition-all shadow-sm">
            Continue <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button onClick={handleSubmit} disabled={isSubmitting}
            className="flex-1 py-3.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-60 text-white font-bold text-sm rounded-2xl flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-700/20">
            {isSubmitting ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Submitting…</>
            ) : (
              <><Check className="w-4 h-4" /> Submit Report</>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
