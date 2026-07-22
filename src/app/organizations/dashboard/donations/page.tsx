"use client";

import { useEffect, useState } from "react";
import { 
  DollarSign, TrendingUp, Heart, Plus, Loader2, X, 
  Trash2, UploadCloud, FileText, ArrowDownRed, ArrowUpGreen 
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";
import axios from "axios";

interface Donation {
  _id: string;
  donorName: string;
  donorEmail?: string;
  amount: number;
  method: string;
  isAnonymous: boolean;
  createdAt: string;
}

interface Expense {
  _id: string;
  description: string;
  category: "FOOD" | "MEDICAL" | "FUEL" | "RENT" | "UTILITY" | "SALARY" | "OTHER";
  amount: number;
  date: string;
  receiptUrl?: string;
}

const CATEGORY_MAP: Record<string, string> = {
  FOOD: "🥩 Food",
  MEDICAL: "💉 Medical Care",
  FUEL: "⛽ Fuel / Transport",
  RENT: "🏢 Shelter Rent",
  UTILITY: "⚡ Utilities / Power",
  SALARY: "👥 Staff Salary",
  OTHER: "📝 Other",
};

export default function DonationsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"donations" | "expenses">("donations");
  
  // Data lists
  const [donations, setDonations] = useState<Donation[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  
  // Summary Stats
  const [totalRaised, setTotalRaised] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);
  
  // Loading & Modals
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  // Expense Form State
  const [expenseForm, setExpenseForm] = useState({
    description: "",
    category: "OTHER",
    amount: "",
    date: new Date().toISOString().split("T")[0],
  });
  const [uploadingReceipt, setUploadingReceipt] = useState(false);
  const [receiptUrl, setReceiptUrl] = useState("");

  useEffect(() => {
    if (user?._id || user?.id) {
      fetchFinanceData(user._id || user.id);
    }
  }, [user]);

  const fetchFinanceData = async (orgId: string) => {
    try {
      setLoading(true);
      // Fetch Donations
      const donationsRes = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/donations/org/${orgId}`,
        { withCredentials: true }
      );
      if (donationsRes.data.success) {
        setDonations(donationsRes.data.data || []);
        setTotalRaised(donationsRes.data.totalRaised || 0);
      }

      // Fetch Expenses
      const expensesRes = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/expenses`,
        { withCredentials: true }
      );
      if (expensesRes.data.success) {
        setExpenses(expensesRes.data.data || []);
        const totalExp = (expensesRes.data.data || []).reduce(
          (acc: number, curr: Expense) => acc + curr.amount,
          0
        );
        setTotalSpent(totalExp);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load financial records");
    } finally {
      setLoading(false);
    }
  };

  const handleReceiptUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const payload = new FormData();
    payload.append("file", file);

    try {
      setUploadingReceipt(true);
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/media/upload`,
        payload,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );
      if (res.data.success && res.data.media?.url) {
        setReceiptUrl(res.data.media.url);
        toast.success("Receipt uploaded!");
      }
    } catch (error) {
      toast.error("Failed to upload receipt");
    } finally {
      setUploadingReceipt(false);
    }
  };

  const handleCreateExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const payload = {
        ...expenseForm,
        amount: parseFloat(expenseForm.amount) || 0,
        receiptUrl,
      };

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/expenses`,
        payload,
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success("Expense recorded successfully");
        setIsModalOpen(false);
        setReceiptUrl("");
        setExpenseForm({
          description: "",
          category: "OTHER",
          amount: "",
          date: new Date().toISOString().split("T")[0],
        });
        if (user?._id || user?.id) {
          fetchFinanceData(user._id || user.id);
        }
      }
    } catch (error) {
      toast.error("Failed to record expense");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteExpense = async (id: string) => {
    if (!confirm("Are you sure you want to delete this expense record?")) return;
    try {
      const res = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/expenses/${id}`,
        { withCredentials: true }
      );
      if (res.data.success) {
        toast.success("Record deleted");
        if (user?._id || user?.id) {
          fetchFinanceData(user._id || user.id);
        }
      }
    } catch (error) {
      toast.error("Failed to delete record");
    }
  };

  const currentMonthRaised = donations
    .filter(d => new Date(d.createdAt).getMonth() === new Date().getMonth())
    .reduce((acc, curr) => acc + curr.amount, 0);

  const uniqueDonors = new Set(donations.map(d => d.donorEmail)).size;
  const netBalance = totalRaised - totalSpent;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Donations & Finances</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Track donations, manage expenses and view balance sheets
          </p>
        </div>

        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-xl shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Record Expense</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <ArrowUpGreen className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Total Raised</p>
            <h3 className="text-lg font-extrabold text-gray-900">₹{totalRaised.toLocaleString("en-IN")}</h3>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center">
            <ArrowDownRed className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Total Spent</p>
            <h3 className="text-lg font-extrabold text-gray-900">₹{totalSpent.toLocaleString("en-IN")}</h3>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex items-center space-x-3.5">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            netBalance >= 0 ? "bg-teal-50 text-teal-700" : "bg-red-50 text-red-700"
          }`}>
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Net Balance</p>
            <h3 className="text-lg font-extrabold text-gray-900">₹{netBalance.toLocaleString("en-IN")}</h3>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
            <Heart className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Donors</p>
            <h3 className="text-lg font-extrabold text-gray-900">{uniqueDonors}</h3>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-100">
        <button
          onClick={() => setActiveTab("donations")}
          className={`px-5 py-3 text-xs font-bold transition-all border-b-2 ${
            activeTab === "donations"
              ? "border-emerald-600 text-emerald-700"
              : "border-transparent text-gray-400 hover:text-gray-600"
          }`}
        >
          Donations Received
        </button>
        <button
          onClick={() => setActiveTab("expenses")}
          className={`px-5 py-3 text-xs font-bold transition-all border-b-2 ${
            activeTab === "expenses"
              ? "border-emerald-600 text-emerald-700"
              : "border-transparent text-gray-400 hover:text-gray-600"
          }`}
        >
          Expenses Log
        </button>
      </div>

      {/* Tables Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {activeTab === "donations" ? (
          <div>
            {donations.length === 0 ? (
              <div className="p-12 text-center text-gray-400 text-xs">
                No donations received yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50/55 text-gray-500 text-[10px] uppercase font-semibold border-b">
                      <th className="px-6 py-3">Donor</th>
                      <th className="px-6 py-3">Amount</th>
                      <th className="px-6 py-3">Method</th>
                      <th className="px-6 py-3">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-xs">
                    {donations.map((donation) => (
                      <tr key={donation._id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4 font-bold text-gray-800">
                          {donation.isAnonymous ? "Anonymous" : donation.donorName}
                          {!donation.isAnonymous && donation.donorEmail && (
                            <div className="text-[10px] text-gray-400 font-normal mt-0.5">{donation.donorEmail}</div>
                          )}
                        </td>
                        <td className="px-6 py-4 font-bold text-emerald-600">
                          ₹{donation.amount.toLocaleString("en-IN")}
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-0.5 rounded bg-gray-100 text-[10px] font-bold text-gray-500 uppercase">
                            {donation.method}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-400 font-medium">
                          {new Date(donation.createdAt).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : (
          <div>
            {expenses.length === 0 ? (
              <div className="p-12 text-center text-gray-400 text-xs">
                No expenses logged yet. Click "Record Expense" to add one.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50/55 text-gray-500 text-[10px] uppercase font-semibold border-b">
                      <th className="px-6 py-3">Details</th>
                      <th className="px-6 py-3">Category</th>
                      <th className="px-6 py-3">Amount</th>
                      <th className="px-6 py-3">Receipt</th>
                      <th className="px-6 py-3">Date</th>
                      <th className="px-6 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-xs">
                    {expenses.map((exp) => (
                      <tr key={exp._id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4 font-bold text-gray-800">
                          {exp.description}
                        </td>
                        <td className="px-6 py-4 font-semibold text-gray-600">
                          {CATEGORY_MAP[exp.category] || exp.category}
                        </td>
                        <td className="px-6 py-4 font-bold text-rose-600">
                          ₹{exp.amount.toLocaleString("en-IN")}
                        </td>
                        <td className="px-6 py-4">
                          {exp.receiptUrl ? (
                            <a 
                              href={exp.receiptUrl} 
                              target="_blank" 
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-emerald-700 hover:underline font-bold text-[10px]"
                            >
                              <FileText className="w-3.5 h-3.5" /> View Receipt
                            </a>
                          ) : (
                            <span className="text-gray-400 font-medium">None</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-gray-400 font-medium">
                          {new Date(exp.date).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => handleDeleteExpense(exp._id)}
                            className="p-1 hover:text-red-600 text-gray-400 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Record Expense Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl">
            <div className="bg-white border-b border-gray-100 px-5 py-4 flex items-center justify-between">
              <h2 className="text-base font-extrabold text-gray-900">Record Expense</h2>
              <button 
                onClick={() => {
                  setIsModalOpen(false);
                  setReceiptUrl("");
                }} 
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateExpense} className="p-5 space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-gray-700">Description</label>
                <input 
                  required 
                  type="text" 
                  value={expenseForm.description}
                  onChange={e => setExpenseForm({...expenseForm, description: e.target.value})}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" 
                  placeholder="e.g. Stray Dog Medical Treatment" 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-gray-700">Amount (₹)</label>
                  <input 
                    required 
                    type="number" 
                    min={1}
                    value={expenseForm.amount}
                    onChange={e => setExpenseForm({...expenseForm, amount: e.target.value})}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" 
                    placeholder="e.g. 1500" 
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-gray-700">Category</label>
                  <select 
                    value={expenseForm.category}
                    onChange={e => setExpenseForm({...expenseForm, category: e.target.value})}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  >
                    <option value="FOOD">Food</option>
                    <option value="MEDICAL">Medical Care</option>
                    <option value="FUEL">Fuel / Transport</option>
                    <option value="RENT">Shelter Rent</option>
                    <option value="UTILITY">Utilities / Power</option>
                    <option value="SALARY">Staff Salary</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-700">Date</label>
                <input 
                  required 
                  type="date" 
                  value={expenseForm.date}
                  onChange={e => setExpenseForm({...expenseForm, date: e.target.value})}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" 
                />
              </div>

              {/* Receipt File Upload */}
              <div className="space-y-1.5">
                <label className="font-bold text-gray-700">Receipt Image (Optional)</label>
                <input 
                  type="file" 
                  accept="image/*" 
                  id="receipt-file-input"
                  className="hidden"
                  onChange={handleReceiptUpload} 
                />
                
                {receiptUrl ? (
                  <div className="relative h-20 bg-gray-50 border rounded-xl overflow-hidden flex items-center justify-center p-2">
                    <img src={receiptUrl} alt="Receipt Preview" className="h-full object-contain" />
                    <button 
                      type="button" 
                      onClick={() => setReceiptUrl("")}
                      className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <label 
                    htmlFor="receipt-file-input"
                    className="w-full h-20 border-2 border-dashed border-gray-200 hover:border-emerald-500 hover:bg-emerald-50/50 rounded-xl cursor-pointer flex flex-col items-center justify-center transition-colors"
                  >
                    {uploadingReceipt ? (
                      <Loader2 className="w-5 h-5 text-emerald-600 animate-spin" />
                    ) : (
                      <UploadCloud className="w-5 h-5 text-gray-400" />
                    )}
                    <span className="font-semibold text-gray-500 mt-1">
                      {uploadingReceipt ? "Uploading..." : "Click to upload receipt"}
                    </span>
                  </label>
                )}
              </div>

              <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => {
                    setIsModalOpen(false);
                    setReceiptUrl("");
                  }} 
                  className="px-4 py-2 font-semibold text-gray-600 hover:bg-gray-50 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={submitting} 
                  className="px-4 py-2 font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl transition-colors disabled:opacity-50 flex items-center gap-1.5"
                >
                  {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Save Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
