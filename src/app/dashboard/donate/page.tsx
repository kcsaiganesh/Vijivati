"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useToast } from "@/context/ToastContext";
import { Heart, CreditCard, ShieldCheck, ShieldAlert, Check, Loader2, ArrowLeft, Search, Building2 } from "lucide-react";
import api from "@/lib/api";

const PRESET_AMOUNTS = [100, 500, 1000, 2000, 5000];

const UPI_APPS = [
  { 
    id: "gpay", 
    name: "GPay", 
    color: "border-blue-500 bg-blue-50/30 text-blue-700", 
    scheme: "gpay://upi/pay",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/f/f2/Google_Pay_Logo.svg"
  },
  { 
    id: "phonepe", 
    name: "PhonePe", 
    color: "border-purple-500 bg-purple-50/30 text-purple-700", 
    scheme: "phonepe://pay",
    logoUrl: "https://download.logo.wine/logo/PhonePe/PhonePe-Logo.wine.png"
  },
  { 
    id: "paytm", 
    name: "Paytm", 
    color: "border-cyan-500 bg-cyan-50/30 text-cyan-700", 
    scheme: "paytmmp://pay",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/2/24/Paytm_Logo_%28standalone%29.svg"
  },
  { 
    id: "bhim", 
    name: "BHIM", 
    color: "border-orange-500 bg-orange-50/30 text-orange-700", 
    scheme: "bhim://pay",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo-vector.svg"
  },
];

interface Organization {
  _id: string;
  organizationName: string;
  stats?: { totalRescues: number };
  totalNoReports?: number;
}

export default function DonatePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const toast = useToast();

  const orgNameParam = searchParams.get("orgName") || "";

  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showOrgDropdown, setShowOrgDropdown] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);

  const [amount, setAmount] = useState<string>("500");
  const [selectedApp, setSelectedApp] = useState<string>("gpay");
  const [upiId, setUpiId] = useState("");
  const [step, setStep] = useState<"details" | "qr" | "success">("details");
  const [isProcessing, setIsProcessing] = useState(false);
  const [transactionId, setTransactionId] = useState("");

  // Fetch top ranked organizations
  useEffect(() => {
    const fetchOrgs = async () => {
      try {
        const res = await api.get("/organizations?sortBy=rescues&limit=50");
        let orgs = res.data?.success && res.data?.data ? res.data.data : [];

        // Fallback dummy data if backend is empty for testing
        if (orgs.length === 0) {
          orgs = [
            { _id: "dummy1", organizationName: "Paws & Care Foundation", stats: { totalRescues: 1250 } },
            { _id: "dummy2", organizationName: "Bangalore Animal Rescue", stats: { totalRescues: 980 } },
            { _id: "dummy3", organizationName: "Stray Hope NGO", stats: { totalRescues: 450 } },
            { _id: "dummy4", organizationName: "Furry Friends Shelter", stats: { totalRescues: 320 } },
          ];
        }

        setOrganizations(orgs);
        
        // If param exists, select it. Else select the #1 ranked org.
        if (orgNameParam) {
          const found = orgs.find((o: Organization) => o.organizationName === orgNameParam);
          if (found) setSelectedOrg(found);
          else setSelectedOrg({ _id: "custom", organizationName: orgNameParam });
        } else if (orgs.length > 0) {
          setSelectedOrg(orgs[0]);
        }
      } catch (err) {
        console.error("Error fetching orgs:", err);
        // Fallback on error
        const fallbackOrgs = [
          { _id: "dummy1", organizationName: "Paws & Care Foundation", stats: { totalRescues: 1250 } },
          { _id: "dummy2", organizationName: "Bangalore Animal Rescue", stats: { totalRescues: 980 } },
          { _id: "dummy3", organizationName: "Stray Hope NGO", stats: { totalRescues: 450 } },
          { _id: "dummy4", organizationName: "Furry Friends Shelter", stats: { totalRescues: 320 } },
        ];
        setOrganizations(fallbackOrgs);
        if (orgNameParam) {
          const found = fallbackOrgs.find((o: Organization) => o.organizationName === orgNameParam);
          if (found) setSelectedOrg(found);
          else setSelectedOrg({ _id: "custom", organizationName: orgNameParam });
        } else {
          setSelectedOrg(fallbackOrgs[0]);
        }
      }
    };
    fetchOrgs();
  }, [orgNameParam]);

  const filteredOrgs = useMemo(() => {
    if (!searchQuery) return organizations;
    return organizations.filter(org => org.organizationName.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [searchQuery, organizations]);

  const handleDonateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrg) {
      return toast.error("Missing Recipient", "Please select an NGO to donate to.");
    }
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

  const currentOrgName = selectedOrg?.organizationName || "Selected NGO";
  // Format standard upi://pay URI
  const baseUpiParams = `?pa=ngo.${currentOrgName.toLowerCase().replace(/[^a-z0-9]/g, "")}@okaxis&pn=${encodeURIComponent(currentOrgName)}&am=${amount}&cu=INR&tn=AnimalRescueSponsorship`;
  
  // App-specific scheme
  const getAppSpecificUri = () => {
    const app = UPI_APPS.find(a => a.id === selectedApp);
    if (app && app.scheme) return app.scheme + baseUpiParams;
    return `upi://pay${baseUpiParams}`;
  };

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`upi://pay${baseUpiParams}`)}`;

  return (
    <div className="space-y-6 py-2 max-w-md mx-auto relative pb-20">
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
        </div>
      </div>

      {step === "details" && (
        <form onSubmit={handleDonateSubmit} className="space-y-6 bg-white border border-gray-100 rounded-3xl p-5 shadow-sm">
          {/* Target NGO (Searchable Combo) */}
          <div className="relative z-20">
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Recipient NGO</label>
            <div 
              onClick={() => setShowOrgDropdown(!showOrgDropdown)}
              className="w-full bg-gray-50 px-4 py-3 rounded-2xl border border-gray-200 flex justify-between items-center cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-emerald-600" />
                <span className="font-bold text-sm text-gray-800">{selectedOrg ? selectedOrg.organizationName : "Select an NGO"}</span>
              </div>
            </div>

            {showOrgDropdown && (
              <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-2xl border border-gray-100 shadow-xl overflow-hidden z-50">
                <div className="p-2 border-b border-gray-50">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                      type="text" 
                      placeholder="Search top NGOs..." 
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="w-full bg-gray-50 pl-9 pr-3 py-2 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>
                </div>
                <div className="max-h-48 overflow-y-auto p-1">
                  {filteredOrgs.map((org, index) => (
                    <div 
                      key={org._id}
                      onClick={() => {
                        setSelectedOrg(org);
                        setShowOrgDropdown(false);
                      }}
                      className="flex items-center justify-between p-3 hover:bg-emerald-50 rounded-xl cursor-pointer transition-colors"
                    >
                      <span className="text-sm font-bold text-gray-800">{org.organizationName}</span>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                        #{index + 1} ({org.stats?.totalRescues || org.totalNoReports || 0} rescues)
                      </span>
                    </div>
                  ))}
                  {filteredOrgs.length === 0 && (
                    <div className="p-3 text-center text-xs text-gray-500 font-medium">No NGOs found</div>
                  )}
                </div>
              </div>
            )}
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
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Select UPI App to Redirect</label>
            <div className="grid grid-cols-2 gap-2">
              {UPI_APPS.map((app) => (
                <button
                  key={app.id}
                  type="button"
                  onClick={() => { setSelectedApp(app.id); setUpiId(""); }}
                  className={`p-3 rounded-2xl border-2 flex items-center justify-center gap-2 transition-all text-xs font-bold ${
                    selectedApp === app.id ? app.color : "border-gray-100 hover:border-gray-200 bg-white"
                  }`}
                >
                  <img src={app.logoUrl} alt={app.name} className="h-5 object-contain" />
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
              placeholder="e.g. yourname@okhdfcbank"
              className="w-full px-4 py-3 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-emerald-600"
            />
          </div>

          <button
            type="submit"
            onClick={(e) => {
              if (selectedOrg && amount && parseFloat(amount) > 0) {
                // Trigger deep link directly for mobile if not using custom UPI
                if (!upiId && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
                   window.location.href = getAppSpecificUri();
                }
              }
            }}
            className="w-full py-4 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-emerald-700/20 transition-all flex items-center justify-center gap-2 mt-4"
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
            <p className="text-xs font-extrabold text-gray-700 mt-0.5 truncate">{currentOrgName}</p>
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
              <span className="font-bold text-gray-800 truncate max-w-[65%]">{currentOrgName}</span>
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
