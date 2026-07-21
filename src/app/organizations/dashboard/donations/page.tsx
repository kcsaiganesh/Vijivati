"use client";

import { useEffect, useState } from "react";
import { DollarSign, TrendingUp, Heart } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";

export default function DonationsPage() {
  const { user } = useAuth();
  const [donations, setDonations] = useState<any[]>([]);
  const [totalRaised, setTotalRaised] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?._id || user?.id) {
      fetchDonations(user._id || user.id);
    }
  }, [user]);

  const fetchDonations = async (orgId: string) => {
    try {
      const res = await fetch(`/api/v1/donation/org/${orgId}`);
      const data = await res.json();
      if (data.success) {
        setDonations(data.data || []);
        setTotalRaised(data.totalRaised || 0);
      } else {
        toast.error("Failed to load donations");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred loading donations");
    } finally {
      setLoading(false);
    }
  };

  const currentMonthRaised = donations
    .filter(d => new Date(d.createdAt).getMonth() === new Date().getMonth())
    .reduce((acc, curr) => acc + curr.amount, 0);

  const uniqueDonors = new Set(donations.map(d => d.donorEmail)).size;

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">Donations</h1>
        <p className="text-xs text-gray-500 mt-0.5">
          Track donations and expenses
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-semibold uppercase">Total Raised</p>
            <h3 className="text-2xl font-extrabold text-gray-900">₹{totalRaised.toLocaleString()}</h3>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-semibold uppercase">This Month</p>
            <h3 className="text-2xl font-extrabold text-gray-900">₹{currentMonthRaised.toLocaleString()}</h3>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
            <Heart className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-semibold uppercase">Total Donors</p>
            <h3 className="text-2xl font-extrabold text-gray-900">{uniqueDonors}</h3>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-50 bg-gray-50/50">
          <h3 className="font-semibold text-gray-900">Recent Donations</h3>
        </div>
        {donations.length === 0 ? (
          <div className="p-8 text-center text-gray-500 text-sm">
            No donations received yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase">
                  <th className="px-6 py-3 font-medium">Donor</th>
                  <th className="px-6 py-3 font-medium">Amount</th>
                  <th className="px-6 py-3 font-medium">Method</th>
                  <th className="px-6 py-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {donations.map((donation) => (
                  <tr key={donation._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {donation.isAnonymous ? "Anonymous" : donation.donorName}
                      {!donation.isAnonymous && donation.donorEmail && (
                        <div className="text-xs text-gray-500 font-normal">{donation.donorEmail}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 font-bold text-emerald-600">
                      ₹{donation.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 rounded bg-gray-100 text-xs font-semibold text-gray-600">
                        {donation.method}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-xs">
                      {new Date(donation.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
