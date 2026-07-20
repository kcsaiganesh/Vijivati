"use client";

export default function SettingsPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">Settings</h1>
        <p className="text-xs text-gray-500 mt-0.5">
          System settings and preferences
        </p>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-4">
        <h3 className="font-bold text-gray-900 text-sm">Notification Preferences</h3>
        <div className="space-y-3 text-xs text-gray-700">
          <label className="flex items-center space-x-3">
            <input type="checkbox" defaultChecked className="accent-emerald-600 w-4 h-4 rounded" />
            <span>Email alert on new emergency animal report</span>
          </label>
          <label className="flex items-center space-x-3">
            <input type="checkbox" defaultChecked className="accent-emerald-600 w-4 h-4 rounded" />
            <span>Notify when a volunteer submits an application</span>
          </label>
          <label className="flex items-center space-x-3">
            <input type="checkbox" defaultChecked className="accent-emerald-600 w-4 h-4 rounded" />
            <span>Monthly statistical reports digest</span>
          </label>
        </div>
      </div>
    </div>
  );
}
