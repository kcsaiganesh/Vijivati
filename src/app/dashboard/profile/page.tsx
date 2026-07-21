"use client";

import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { User, Mail, Phone, MapPin, Bell, Shield, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function UserProfilePage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.fullName || user?.name || "",
    phone: user?.phone || "",
    address: user?.address || ""
  });

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch("/api/v1/auth/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (data.success) {
        toast.success("Profile updated successfully!");
        setIsEditing(false);
        // We could also re-fetch the user context here if exposed,
        // but updating local state is fine for the UI flow.
      } else {
        toast.error(data.message || "Failed to update profile");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while saving");
    } finally {
      setIsSaving(false);
    }
  };

  // Sync form data when user loads
  useState(() => {
      if (user) {
          setFormData({
              fullName: user.fullName || user.name || "",
              phone: user.phone || "",
              address: user.address || ""
          });
      }
  });


  return (
    <div className="space-y-6 max-w-lg mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="text-sm font-medium text-emerald-600 hover:text-emerald-700"
        >
          {isEditing ? "Cancel" : "Edit Profile"}
        </button>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-2xl">
          {formData.fullName?.[0] || <User className="w-8 h-8" />}
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">{formData.fullName || "User"}</h2>
          <p className="text-gray-500 text-sm">Member since {new Date().getFullYear()}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-50 bg-gray-50/50">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <User className="w-4 h-4 text-emerald-600" />
            Personal Information
          </h3>
        </div>
        <div className="p-4 space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Full Name</label>
            {isEditing ? (
              <input 
                type="text" 
                value={formData.fullName} 
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                className="w-full border-gray-200 rounded-lg text-sm" 
              />
            ) : (
              <p className="text-sm font-medium text-gray-900">{formData.fullName || "Not provided"}</p>
            )}
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Email Address</label>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-gray-400" />
              <p className="text-sm font-medium text-gray-900">{user?.email}</p>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Phone Number</label>
            {isEditing ? (
              <input 
                type="tel" 
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full border-gray-200 rounded-lg text-sm" 
              />
            ) : (
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-400" />
                <p className="text-sm font-medium text-gray-900">{formData.phone || "Not provided"}</p>
              </div>
            )}
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Location</label>
            {isEditing ? (
              <input 
                type="text" 
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                className="w-full border-gray-200 rounded-lg text-sm" 
              />
            ) : (
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-400" />
                <p className="text-sm font-medium text-gray-900">{formData.address || "Not provided"}</p>
              </div>
            )}
          </div>
        </div>
        {isEditing && (
          <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end">
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className="px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-50"
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-50 bg-gray-50/50">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <Bell className="w-4 h-4 text-emerald-600" />
            Preferences
          </h3>
        </div>
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">Email Notifications</p>
              <p className="text-xs text-gray-500">Receive updates about your reports</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>
        </div>
      </div>

      <button
        onClick={handleLogout}
        className="w-full py-3 rounded-2xl border border-rose-100 bg-rose-50 text-rose-600 font-semibold flex items-center justify-center gap-2 hover:bg-rose-100 transition-colors"
      >
        <LogOut className="w-5 h-5" />
        Sign Out
      </button>
    </div>
  );
}
