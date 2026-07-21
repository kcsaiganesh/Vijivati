"use client";

import { useEffect, useState } from "react";
import { Building, Mail, Phone, MapPin, Globe } from "lucide-react";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    organizationName: "",
    email: "",
    phone: "",
    website: "",
    upiId: ""
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch("/api/v1/organization/my-profile", {
        headers: {
          "Content-Type": "application/json"
        }
      });
      const data = await response.json();
      
      if (data.success && data.data) {
        setProfile(data.data);
        setFormData({
          organizationName: data.data.organizationName || "",
          email: data.data.email || "",
          phone: data.data.phone || "",
          website: data.data.website || "",
          upiId: data.data.upiId || ""
        });
      } else {
        toast.error("Failed to load profile");
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("An error occurred while loading profile");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch("/api/v1/organization/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      if (data.success) {
        toast.success("Profile updated successfully");
        setProfile(data.data);
      } else {
        toast.error(data.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("An error occurred while updating profile");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div></div>;
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">Organization Profile</h1>
        <p className="text-xs text-gray-500 mt-0.5">
          Organization profile settings and details
        </p>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex items-center space-x-4 border-b pb-5">
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-2xl uppercase">
            {profile?.organizationName?.charAt(0) || <Building className="w-8 h-8" />}
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">{profile?.organizationName}</h3>
            <p className="text-xs text-gray-500">
              {profile?.organizationType} • Reg #{profile?.registerNumber}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-gray-500 font-semibold mb-1">Organization Name</label>
            <input 
              type="text" 
              value={formData.organizationName} 
              onChange={e => setFormData({...formData, organizationName: e.target.value})}
              className="w-full p-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent" 
            />
          </div>
          <div>
            <label className="block text-gray-500 font-semibold mb-1">Email Address</label>
            <input 
              type="email" 
              value={formData.email} 
              disabled // Usually email is tied to auth, might want to disable or handle separately
              className="w-full p-2.5 border border-gray-200 rounded-xl bg-gray-50 text-gray-500" 
            />
          </div>
          <div>
            <label className="block text-gray-500 font-semibold mb-1">Phone Number</label>
            <input 
              type="text" 
              value={formData.phone} 
              onChange={e => setFormData({...formData, phone: e.target.value})}
              className="w-full p-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent" 
            />
          </div>
          <div>
            <label className="block text-gray-500 font-semibold mb-1">Website</label>
            <input 
              type="text" 
              value={formData.website} 
              onChange={e => setFormData({...formData, website: e.target.value})}
              placeholder="https://example.org"
              className="w-full p-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent" 
            />
          </div>
          <div>
            <label className="block text-gray-500 font-semibold mb-1">UPI ID / Payment String (For Donations)</label>
            <input 
              type="text" 
              value={formData.upiId} 
              onChange={e => setFormData({...formData, upiId: e.target.value})}
              placeholder="e.g. yourname@okhdfcbank"
              className="w-full p-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent" 
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-xl shadow-sm disabled:opacity-50 transition-colors"
          >
            {isSaving ? "Saving..." : "Save Profile Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
