"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Loader2, ShieldCheck, Clock, Settings, Bell, Phone } from "lucide-react";

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // Notification Prefs State
  const [prefs, setPrefs] = useState({
    emailAlerts: true,
    volunteerApps: true,
    monthlyDigest: true
  });

  // Operational State
  const [opsData, setOpsData] = useState({
    emergencyAvailable: false,
    openHours: "",
    organizationType: "SHELTER",
    phone: ""
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
        const profile = data.data;
        if (profile.notificationPreferences) {
          setPrefs({
            emailAlerts: profile.notificationPreferences.emailAlerts ?? true,
            volunteerApps: profile.notificationPreferences.volunteerApps ?? true,
            monthlyDigest: profile.notificationPreferences.monthlyDigest ?? true,
          });
        }
        setOpsData({
          emergencyAvailable: profile.emergencyAvailable ?? false,
          openHours: profile.openHours || "",
          organizationType: profile.organizationType || "SHELTER",
          phone: profile.phone || ""
        });
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
      toast.error("An error occurred while loading settings");
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePref = (key: keyof typeof prefs) => {
    setPrefs(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleToggleOps = () => {
    setOpsData(prev => ({
      ...prev,
      emergencyAvailable: !prev.emergencyAvailable
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch("/api/v1/organization/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ 
          notificationPreferences: prefs,
          emergencyAvailable: opsData.emergencyAvailable,
          openHours: opsData.openHours,
          organizationType: opsData.organizationType,
          phone: opsData.phone
        })
      });
      
      const data = await response.json();
      if (data.success) {
        toast.success("Settings and operational preferences saved!");
      } else {
        toast.error(data.message || "Failed to save settings");
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("An error occurred while saving settings");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Settings</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Manage organization operations, dispatch status and notification channels
          </p>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-xl shadow-sm disabled:opacity-50 transition-colors flex items-center gap-1.5"
        >
          {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
          {isSaving ? "Saving..." : "Save Settings"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Operational Flow */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center space-x-2 border-b pb-3">
              <Settings className="w-5 h-5 text-emerald-700" />
              <h3 className="font-extrabold text-gray-900 text-sm">Emergency & Operations</h3>
            </div>

            {/* Emergency Dispatches Toggle */}
            <div className="flex items-center justify-between p-3.5 bg-gray-50 rounded-xl border border-gray-100">
              <div>
                <p className="font-bold text-gray-800 text-xs">Accept Emergency Dispatches</p>
                <p className="text-[10px] text-gray-500 mt-0.5">Allow automated rescue routing inside 30km radius</p>
              </div>
              <button
                onClick={handleToggleOps}
                className={`w-11 h-6 rounded-full transition-all duration-300 relative ${
                  opsData.emergencyAvailable ? "bg-emerald-600" : "bg-gray-300"
                }`}
              >
                <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${
                  opsData.emergencyAvailable ? "translate-x-5" : ""
                }`} />
              </button>
            </div>

            {/* Operational Fields */}
            <div className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="text-gray-500 font-bold flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> Working / Open Hours
                </label>
                <input
                  type="text"
                  value={opsData.openHours}
                  onChange={e => setOpsData({ ...opsData, openHours: e.target.value })}
                  placeholder="e.g. 24 Hours / 9 AM - 6 PM"
                  className="w-full p-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                />
              </div>

              <div className="space-y-1">
                <label className="text-gray-500 font-bold flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5" /> Hotline / Support Phone
                </label>
                <input
                  type="text"
                  value={opsData.phone}
                  onChange={e => setOpsData({ ...opsData, phone: e.target.value })}
                  className="w-full p-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                />
              </div>

              <div className="space-y-1">
                <label className="text-gray-500 font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Core NGO Focus
                </label>
                <select
                  value={opsData.organizationType}
                  onChange={e => setOpsData({ ...opsData, organizationType: e.target.value })}
                  className="w-full p-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                >
                  <option value="RESCUE">Rescue & Trauma Care</option>
                  <option value="SHELTER">Animal Shelter</option>
                  <option value="CLINIC">Sterilization & Clinic</option>
                  <option value="HOSPITAL">Veterinary Hospital</option>
                  <option value="GROOMING">Sanctuary & Grooming</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center space-x-2 border-b pb-3">
            <Bell className="w-5 h-5 text-emerald-700" />
            <h3 className="font-extrabold text-gray-900 text-sm">Notification Channels</h3>
          </div>

          <div className="space-y-3.5 text-xs text-gray-700">
            <label className="flex items-start space-x-3 cursor-pointer p-2 hover:bg-gray-50 rounded-xl transition-colors">
              <input 
                type="checkbox" 
                checked={prefs.emailAlerts}
                onChange={() => handleTogglePref('emailAlerts')}
                className="accent-emerald-600 w-4 h-4 rounded cursor-pointer mt-0.5" 
              />
              <div>
                <p className="font-bold text-gray-800">Email Dispatches</p>
                <p className="text-[10px] text-gray-400 mt-0.5">Send a real-time email notification when a new emergency dispatch is assigned.</p>
              </div>
            </label>

            <label className="flex items-start space-x-3 cursor-pointer p-2 hover:bg-gray-50 rounded-xl transition-colors">
              <input 
                type="checkbox" 
                checked={prefs.volunteerApps}
                onChange={() => handleTogglePref('volunteerApps')}
                className="accent-emerald-600 w-4 h-4 rounded cursor-pointer mt-0.5" 
              />
              <div>
                <p className="font-bold text-gray-800">Volunteer Notifications</p>
                <p className="text-[10px] text-gray-400 mt-0.5">Notify staff whenever a new local application is received.</p>
              </div>
            </label>

            <label className="flex items-start space-x-3 cursor-pointer p-2 hover:bg-gray-50 rounded-xl transition-colors">
              <input 
                type="checkbox" 
                checked={prefs.monthlyDigest}
                onChange={() => handleTogglePref('monthlyDigest')}
                className="accent-emerald-600 w-4 h-4 rounded cursor-pointer mt-0.5" 
              />
              <div>
                <p className="font-bold text-gray-800">Monthly Digest</p>
                <p className="text-[10px] text-gray-400 mt-0.5">Receive a monthly summary document outlining rescues, adoptions, and active volunteers.</p>
              </div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
