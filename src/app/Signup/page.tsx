"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, User, Building2, Mail, Lock, Phone, ArrowRight, PawPrint, FileText, MapPin, UploadCloud, ShieldAlert } from "lucide-react";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";

type Tab = "individual" | "organization";
type Step = "form" | "otp";

export default function SignupPage() {
  const [tab, setTab] = useState<Tab>("individual");
  const [step, setStep] = useState<Step>("form");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const [pendingEmail, setPendingEmail] = useState("");

  const { refetch, redirectByRole } = useAuth();
  const toast = useToast();

  // Individual form state
  const [indivForm, setIndivForm] = useState({
    fullName: "", email: "", phone: "", password: "", confirmPassword: "", acceptTerms: false
  });

  // Organization form state
  const [orgForm, setOrgForm] = useState({
    organizationName: "", email: "", phone: "", registrationNumber: "",
    organizationType: "RESCUE", address: "", password: "", confirmPassword: "", acceptTerms: false
  });

  // Organization Onboarding Uploads/Compliance
  const [ngoFileName, setNgoFileName] = useState("");
  const [panFileName, setPanFileName] = useState("");
  const [taxExemptionChecked, setTaxExemptionChecked] = useState(false);
  const [verificationConsent, setVerificationConsent] = useState(false);

  const handleGoogleSignup = () => {
    const base = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000/api";
    window.location.href = `${base}/auth/google?userType=${tab}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = tab === "individual" ? indivForm : orgForm;
    if (form.password !== form.confirmPassword) {
      return toast.error("Passwords don't match", "Please check your password fields.");
    }
    setIsLoading(true);
    try {
      const payload = tab === "individual"
        ? { ...indivForm, userType: "individual" }
        : { 
            ...orgForm, 
            userType: "organization",
            ngoCertificate: ngoFileName,
            panCard: panFileName,
            compliance: {
              taxExempt: taxExemptionChecked,
              consent: verificationConsent
            }
          };

      const res = await api.post("/auth/register", payload);
      if (res.data?.success) {
        setPendingEmail(form.email);
        setStep("otp");
        toast.info("Check your inbox!", `We sent a verification code to ${form.email}`);
      }
    } catch (err: any) {
      toast.error("Signup failed", err.response?.data?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await api.post("/auth/verify-otp", { email: pendingEmail, otp });
      if (res.data?.success) {
        await refetch();
        toast.success("Email verified! 🎉", "Welcome to Pranzoo!");
        redirectByRole();
      }
    } catch (err: any) {
      toast.error("Invalid OTP", err.response?.data?.message || "Please check the code.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 mb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-700 flex items-center justify-center">
              <PawPrint className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-extrabold text-emerald-800 tracking-tight">Pranzoo</span>
          </Link>
          <h1 className="text-2xl font-extrabold text-gray-900">
            {step === "otp" ? "Verify your email" : "Create your account"}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {step === "otp"
              ? `Enter the 6-digit code sent to ${pendingEmail}`
              : "Join thousands helping animals across India"}
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 space-y-6">
          {step === "otp" ? (
            /* OTP Step */
            <form onSubmit={handleOtpVerify} className="space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-emerald-700" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2 text-center">
                  Verification Code
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  placeholder="000000"
                  className="w-full text-center text-2xl font-bold tracking-[0.5em] py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-emerald-600 transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading || otp.length < 4}
                className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-60 text-white font-bold text-sm rounded-2xl shadow-sm flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  "Verify & Continue"
                )}
              </button>

              <button
                type="button"
                onClick={() => setStep("form")}
                className="w-full text-center text-xs text-gray-500 hover:text-gray-700"
              >
                ← Back to signup
              </button>
            </form>
          ) : (
            <>
              {/* Role Tabs */}
              <div className="flex bg-gray-100 rounded-2xl p-1 gap-1">
                <button
                  onClick={() => setTab("individual")}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    tab === "individual" ? "bg-white text-emerald-700 shadow-sm" : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <User className="w-4 h-4" /> Individual
                </button>
                <button
                  onClick={() => setTab("organization")}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    tab === "organization" ? "bg-white text-emerald-700 shadow-sm" : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <Building2 className="w-4 h-4" /> Organization
                </button>
              </div>

              {/* Google */}
              <button
                onClick={handleGoogleSignup}
                className="w-full flex items-center justify-center gap-3 py-3 border border-gray-200 rounded-2xl hover:bg-gray-50 text-gray-700 font-semibold text-sm transition-all"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                Continue with Google
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100" /></div>
                <div className="relative flex justify-center"><span className="px-3 bg-white text-xs text-gray-400 font-medium">or create with email</span></div>
              </div>

              {/* Individual Form */}
              {tab === "individual" && (
                <form onSubmit={handleSubmit} className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input required value={indivForm.fullName} onChange={(e) => setIndivForm({...indivForm, fullName: e.target.value})} placeholder="Alex Kumar" className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input type="email" required value={indivForm.email} onChange={(e) => setIndivForm({...indivForm, email: e.target.value})} placeholder="you@example.com" className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">Phone</label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input required value={indivForm.phone} onChange={(e) => setIndivForm({...indivForm, phone: e.target.value})} placeholder="+91 98765 43210" className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input type={showPassword ? "text" : "password"} required value={indivForm.password} onChange={(e) => setIndivForm({...indivForm, password: e.target.value})} placeholder="••••••••" className="w-full pl-10 pr-12 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400"><span>{showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</span></button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">Confirm Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input type="password" required value={indivForm.confirmPassword} onChange={(e) => setIndivForm({...indivForm, confirmPassword: e.target.value})} placeholder="••••••••" className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600" />
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5 py-1">
                    <input
                      type="checkbox"
                      id="indiv-accept-terms"
                      required
                      checked={indivForm.acceptTerms}
                      onChange={(e) => setIndivForm({ ...indivForm, acceptTerms: e.target.checked })}
                      className="mt-1 accent-emerald-700"
                    />
                    <label htmlFor="indiv-accept-terms" className="text-xs text-gray-500 leading-tight">
                      I agree to the{" "}
                      <Link href="/terms" target="_blank" className="text-emerald-700 font-bold hover:underline">
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link href="/privacy" target="_blank" className="text-emerald-700 font-bold hover:underline">
                        Privacy Policy
                      </Link>
                      , including real-time geolocation mapping for rescue reports.
                    </label>
                  </div>
                  <button type="submit" disabled={isLoading || !indivForm.acceptTerms} className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-60 text-white font-bold text-sm rounded-2xl shadow-sm flex items-center justify-center gap-2 mt-4">
                    {isLoading ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><span>Create Account</span><ArrowRight className="w-4 h-4" /></>}
                  </button>
                </form>
              )}

              {/* Organization Form */}
              {tab === "organization" && (
                <form onSubmit={handleSubmit} className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">Organization Name</label>
                    <div className="relative">
                      <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input required value={orgForm.organizationName} onChange={(e) => setOrgForm({...orgForm, organizationName: e.target.value})} placeholder="Paws & Care Foundation" className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">Type</label>
                      <select required value={orgForm.organizationType} onChange={(e) => setOrgForm({...orgForm, organizationType: e.target.value})} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600">
                        <option value="RESCUE">Rescue</option>
                        <option value="SHELTER">Shelter</option>
                        <option value="CLINIC">Clinic</option>
                        <option value="HOSPITAL">Hospital</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">Registration No.</label>
                      <div className="relative">
                        <FileText className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                        <input required value={orgForm.registrationNumber} onChange={(e) => setOrgForm({...orgForm, registrationNumber: e.target.value})} placeholder="NGO-12345" className="w-full pl-8 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600" />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input type="email" required value={orgForm.email} onChange={(e) => setOrgForm({...orgForm, email: e.target.value})} placeholder="contact@org.com" className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">Phone</label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input required value={orgForm.phone} onChange={(e) => setOrgForm({...orgForm, phone: e.target.value})} placeholder="+91 98765 43210" className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">Address</label>
                    <div className="relative">
                      <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input required value={orgForm.address} onChange={(e) => setOrgForm({...orgForm, address: e.target.value})} placeholder="123 Gandhi Nagar, Bangalore" className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input type={showPassword ? "text" : "password"} required value={orgForm.password} onChange={(e) => setOrgForm({...orgForm, password: e.target.value})} placeholder="••••••••" className="w-full pl-10 pr-12 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400">{showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">Confirm Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input type="password" required value={orgForm.confirmPassword} onChange={(e) => setOrgForm({...orgForm, confirmPassword: e.target.value})} placeholder="••••••••" className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600" />
                    </div>
                  </div>

                  {/* NGO Onboarding Compliance section */}
                  <div className="border-t border-b border-gray-100 py-3.5 my-2 space-y-3.5">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Onboarding & NGO Compliance</p>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-gray-700 mb-1">NGO Certificate (10A/80G)</label>
                        <div className="relative">
                          <input 
                            type="file" 
                            id="ngo-cert-upload" 
                            accept=".pdf,image/*" 
                            className="hidden" 
                            onChange={(e) => setNgoFileName(e.target.files?.[0]?.name || "")}
                          />
                          <label htmlFor="ngo-cert-upload" className="w-full flex flex-col items-center justify-center border border-dashed border-gray-200 hover:border-emerald-500 hover:bg-emerald-50/50 py-3.5 rounded-xl cursor-pointer transition-all">
                            <UploadCloud className="w-5 h-5 text-gray-400 mb-1" />
                            <span className="text-[10px] font-bold text-gray-500 truncate max-w-full px-2">
                              {ngoFileName || "Choose File"}
                            </span>
                          </label>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-gray-700 mb-1">Organization PAN Card</label>
                        <div className="relative">
                          <input 
                            type="file" 
                            id="pan-card-upload" 
                            accept=".pdf,image/*" 
                            className="hidden" 
                            onChange={(e) => setPanFileName(e.target.files?.[0]?.name || "")}
                          />
                          <label htmlFor="pan-card-upload" className="w-full flex flex-col items-center justify-center border border-dashed border-gray-200 hover:border-emerald-500 hover:bg-emerald-50/50 py-3.5 rounded-xl cursor-pointer transition-all">
                            <UploadCloud className="w-5 h-5 text-gray-400 mb-1" />
                            <span className="text-[10px] font-bold text-gray-500 truncate max-w-full px-2">
                              {panFileName || "Choose File"}
                            </span>
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <input
                          type="checkbox"
                          id="tax-exemption-check"
                          checked={taxExemptionChecked}
                          onChange={(e) => setTaxExemptionChecked(e.target.checked)}
                          className="mt-0.5 accent-emerald-700"
                        />
                        <label htmlFor="tax-exemption-check" className="text-[11px] text-gray-500 leading-tight">
                          We hold active tax exemptions under section 12A & 80G of the Income Tax Act.
                        </label>
                      </div>

                      <div className="flex items-start gap-2">
                        <input
                          type="checkbox"
                          id="verification-consent-check"
                          required
                          checked={verificationConsent}
                          onChange={(e) => setVerificationConsent(e.target.checked)}
                          className="mt-0.5 accent-emerald-700"
                        />
                        <label htmlFor="verification-consent-check" className="text-[11px] text-gray-500 leading-tight">
                          We authorize Pranzoo (Vijivati Pvt Ltd) to audit our NGO credentials.
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <input
                      type="checkbox"
                      id="org-accept-terms"
                      required
                      checked={orgForm.acceptTerms}
                      onChange={(e) => setOrgForm({ ...orgForm, acceptTerms: e.target.checked })}
                      className="mt-1 accent-emerald-700"
                    />
                    <label htmlFor="org-accept-terms" className="text-xs text-gray-500 leading-tight">
                      I agree to the{" "}
                      <Link href="/terms" target="_blank" className="text-emerald-700 font-bold hover:underline">
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link href="/privacy" target="_blank" className="text-emerald-700 font-bold hover:underline">
                        Privacy Policy
                      </Link>
                      , including legal disclaimers on rescue outcomes and peer donations.
                    </label>
                  </div>

                  <button type="submit" disabled={isLoading || !orgForm.acceptTerms || !ngoFileName || !panFileName || !verificationConsent} className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-60 text-white font-bold text-sm rounded-2xl shadow-sm flex items-center justify-center gap-2 mt-4">
                    {isLoading ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><span>Register Organization</span><ArrowRight className="w-4 h-4" /></>}
                  </button>
                </form>
              )}

              <p className="text-center text-xs text-gray-500">
                Already have an account?{" "}
                <Link href="/login" className="text-emerald-700 font-bold hover:underline">Sign in</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
