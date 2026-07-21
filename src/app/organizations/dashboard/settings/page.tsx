"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function SettingsPage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [prefs, setPrefs] = useState({
    emailAlerts: true,
    volunteerApps: true,
    monthlyDigest: true
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
        if (data.data.notificationPreferences) {
            setPrefs({
                emailAlerts: data.data.notificationPreferences.emailAlerts ?? true,
                volunteerApps: data.data.notificationPreferences.volunteerApps ?? true,
                monthlyDigest: data.data.notificationPreferences.monthlyDigest ?? true,
            });
        }
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
      toast.error("An error occurred while loading settings");
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (key: keyof typeof prefs) => {
    setPrefs(prev => ({
      ...prev,
      [key]: !prev[key]
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
        body: JSON.stringify({ notificationPreferences: prefs })
      });
      
      const data = await response.json();
      if (data.success) {
        toast.success("Settings saved successfully");
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
    return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div></div>;
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Settings</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            System settings and preferences
          </p>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-xl shadow-sm disabled:opacity-50 transition-colors"
        >
          {isSaving ? "Saving..." : "Save Settings"}
        </button>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-4">
        <h3 className="font-bold text-gray-900 text-sm">Notification Preferences</h3>
        <div className="space-y-3 text-xs text-gray-700">
          <label className="flex items-center space-x-3 cursor-pointer">
            <input 
              type="checkbox" 
              checked={prefs.emailAlerts}
              onChange={() => handleToggle('emailAlerts')}
              className="accent-emerald-600 w-4 h-4 rounded cursor-pointer" 
            />
            <span>Email alert on new emergency animal report</span>
          </label>
          <label className="flex items-center space-x-3 cursor-pointer">
            <input 
              type="checkbox" 
              checked={prefs.volunteerApps}
              onChange={() => handleToggle('volunteerApps')}
              className="accent-emerald-600 w-4 h-4 rounded cursor-pointer" 
            />
            <span>Notify when a volunteer submits an application</span>
          </label>
          <label className="flex items-center space-x-3 cursor-pointer">
            <input 
              type="checkbox" 
              checked={prefs.monthlyDigest}
              onChange={() => handleToggle('monthlyDigest')}
              className="accent-emerald-600 w-4 h-4 rounded cursor-pointer" 
            />
            <span>Monthly statistical reports digest</span>
          </label>
        </div>
      </div>
    </div>
  );
}
