"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useToast } from "@/context/ToastContext";
import { Heart, CreditCard, ShieldCheck, ShieldAlert, Check, Loader2, ArrowLeft, Smartphone } from "lucide-react";
import api from "@/lib/api";

const PRESET_AMOUNTS = [100, 500, 1000, 2000, 5000];

const UPI_APPS = [
  { id: "gpay", name: "Google Pay", color: "border-blue-500 bg-blue-50/30 text-blue-700", logo: "https://unpkg.com/simple-icons@v11/icons/googlepay.svg" },
  { id: "phonepe", name: "PhonePe", color: "border-purple-500 bg-purple-50/30 text-purple-700", logo: "🟣" },
  { id: "paytm", name: "Paytm", color: "border-cyan-500 bg-cyan-50/30 text-cyan-700", logo: "🔵" },
  { id: "bhim", name: "BHIM UPI", color: "border-orange-500 bg-orange-50/30 text-orange-700", logo: "🔸" },
];

export default function DonatePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const toast = useToast();

  const orgNameParam = searchParams.get("orgName") || "Paws & Care Foundation";

  const [amount, setAmount] = useState<string>("500");
  const [selectedApp, setSelectedApp] = useState<string>("gpay");
  const [upiId, setUpiId] = useState("");
  const [step, setStep] = useState<"details" | "qr" | "success">("details");
  const [isProcessing, setIsProcessing] = useState(false);
  const [transactionId, setTransactionId] = useState("");

  const handleDonateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) {
      return toast.error("Invalid Amount", "Please select or enter a valid donation amount.");
    }
    setStep("qr");
  };

  const handlePaymentConfirm = () => {
    setIsProcessing(true);
    // Simulate payment verification
    setTimeout(() => {
      setIsProcessing(false);
      const mockTx = "TXN" + Math.floor(100000000 + Math.random() * 900000000);
      setTransactionId(mockTx);
      setStep("success");
      toast.success("Donation Successful! 💚", "Thank you for supporting animal rescue operations.");
    }, 2500);
  };

  // Generate dynamic QR Code payload stub using standard UPI format
  // format: upi://pay?pa=recipient@upi&pn=name&am=amount&cu=INR
  const upiPayload = `upi://pay?pa=ngo.${orgNameParam.toLowerCase().replace(/[^a-z0-9]/g, "")}@okaxis&pn=${encodeURIComponent(orgNameParam)}&am=${amount}&cu=INR&tn=AnimalRescueSponsorship`;

  // QR Code generator source
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiPayload)}`;

  return (
    <div className="space-y-6 py-2 max-w-md mx-auto">
      {/* Header */}
      <div>
        <button
          onClick={() => step !== "details" ? setStep("details") : router.back()}
          className="flex items-center gap-1 text-sm text-gray-500 font-semibold mb-4 hover:text-gray-700"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <h1 className="text-2xl font-extrabold text-gray-900">Make a Donation</h1>
        <p className="text-sm text-gray-500 mt-1">Directly sponsor emergency medical care and food drives</p>
      </div>

      {/* Legal Disclaimers */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-3 text-amber-800">
        <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <p className="font-bold">Peer-to-Peer Donation Disclaimer</p>
          <p>
            Pranzoo is a matchmaker platform, not a charity. 100% of your donation is sent directly to the organization's
            registered UPI account. We do not hold, handle, or charge commissions on funds.
          </p>
          <p className="text-[10px] text-amber-700/80">
            * Verify tax exemption status (80G/12A) directly with the NGO. Pranzoo disclaims all liability for tax claims or dispute resolutions.
          </p>
        </div>
      </div>

      {step === "details" && (
        <form onSubmit={handleDonateSubmit} className="space-y-5 bg-white border border-gray-100 rounded-3xl p-5 shadow-sm">
          {/* Target NGO */}
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Recipient NGO</label>
            <div className="bg-gray-50 px-4 py-3 rounded-2xl border border-gray-100 font-extrabold text-sm text-gray-800">
              🏢 {orgNameParam}
            </div>
          </div>

          {/* Amount Selector */}
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Donation Amount (INR)</label>
            <div className="grid grid-cols-5 gap-1.5 mb-3">
              {PRESET_AMOUNTS.map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setAmount(String(amt))}
                  className={`py-2 rounded-xl text-xs font-extrabold transition-all border ${
                    amount === String(amt)
                      ? "border-emerald-600 bg-emerald-50 text-emerald-700"
                      : "border-gray-100 bg-gray-50 text-gray-600 hover:border-gray-200"
                  }`}
                >
                  ₹{amt}
                </button>
              ))}
            </div>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-extrabold text-gray-400">₹</span>
              <input
                required
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter custom amount"
                className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-2xl text-sm font-bold focus:outline-none focus:border-emerald-600"
              />
            </div>
          </div>

          {/* UPI App selector */}
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Select UPI Payment Application</label>
            <div className="grid grid-cols-2 gap-2">
              {UPI_APPS.map((app) => (
                <button
                  key={app.id}
                  type="button"
                  onClick={() => { setSelectedApp(app.id); setUpiId(""); }}
                  className={`p-3 rounded-2xl border-2 flex items-center gap-2.5 transition-all text-xs font-bold ${
                    selectedApp === app.id ? app.color : "border-gray-100 hover:border-gray-200"
                  }`}
                >
                  <span className="text-lg">{app.logo}</span>
                  {app.name}
                </button>
              ))}
            </div>
          </div>

          {/* Custom UPI ID */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-50" /></div>
            <div className="relative flex justify-center"><span className="px-3 bg-white text-[10px] text-gray-400 font-bold uppercase tracking-widest">or pay with custom UPI ID</span></div>
          </div>

          <div>
            <input
              type="text"
              value={upiId}
              onChange={(e) => { setUpiId(e.target.value); setSelectedApp(""); }}
              placeholder="e.g. name@okhdfcbank"
              className="w-full px-4 py-3 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-emerald-600"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-sm rounded-2xl shadow-md transition-all flex items-center justify-center gap-2"
          >
            <Heart className="w-4 h-4 fill-current" /> Proceed to Pay ₹{amount || "0"}
          </button>
        </form>
      )}

      {step === "qr" && (
        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-xl text-center space-y-5 animate-slide-in">
          <div>
            <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest">Scan & Sponsor</p>
            <h3 className="text-base font-extrabold text-gray-900 mt-0.5">UPI QR Code</h3>
            <p className="text-xs text-gray-400 mt-1">Scan using any UPI App (GPay, PhonePe, Paytm, BHIM)</p>
          </div>

          {/* QR Display */}
          <div className="w-48 h-48 border border-gray-100 rounded-2xl p-2 mx-auto bg-white flex items-center justify-center shadow-inner">
            <img src={qrCodeUrl} alt="UPI QR Code" className="w-full h-full object-contain" />
          </div>

          <div className="bg-gray-50 px-4 py-3 rounded-2xl border border-gray-100 max-w-xs mx-auto">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Recipient</p>
            <p className="text-xs font-extrabold text-gray-700 mt-0.5 truncate">{orgNameParam}</p>
            <p className="text-lg font-extrabold text-emerald-700 mt-1">₹{amount}</p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setStep("details")}
              className="flex-1 py-3 border border-gray-200 text-gray-600 font-bold text-xs rounded-xl hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handlePaymentConfirm}
              disabled={isProcessing}
              className="flex-1 py-3 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-60 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5"
            >
              {isProcessing ? (
                <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Verifying...</>
              ) : (
                <><Check className="w-3.5 h-3.5" /> I Have Paid</>
              )}
            </button>
          </div>
        </div>
      )}

      {step === "success" && (
        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-xl text-center space-y-5 animate-slide-in">
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto shadow-md">
            <Check className="w-8 h-8 text-emerald-700 stroke-[3px]" />
          </div>

          <div className="space-y-1">
            <h2 className="text-xl font-extrabold text-gray-900">Donation Successful!</h2>
            <p className="text-xs text-gray-500">Thank you for making a positive impact 💚</p>
          </div>

          <div className="bg-gray-50 rounded-2xl p-4 text-left divide-y divide-gray-100 max-w-xs mx-auto text-xs space-y-2">
            <div className="flex justify-between py-1 pt-1.5">
              <span className="text-gray-400 font-medium">To NGO</span>
              <span className="font-bold text-gray-800 truncate max-w-[65%]">{orgNameParam}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-gray-400 font-medium">Amount</span>
              <span className="font-bold text-emerald-700">₹{amount}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-gray-400 font-medium">Txn ID</span>
              <span className="font-semibold text-gray-500 font-mono">{transactionId}</span>
            </div>
            <div className="flex justify-between py-1 pb-1.5">
              <span className="text-gray-400 font-medium">Status</span>
              <span className="font-bold text-emerald-700 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> SECURE
              </span>
            </div>
          </div>

          <button
            onClick={() => router.push("/dashboard")}
            className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm rounded-2xl"
          >
            Return to Dashboard
          </button>
        </div>
      )}
    </div>
  );
}
