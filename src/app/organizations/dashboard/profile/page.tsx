"use client";

import { Building, Mail, Phone, MapPin, Globe } from "lucide-react";

export default function ProfilePage() {
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
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-2xl">
            P
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Pranzoo Animal Rescue Foundation</h3>
            <p className="text-xs text-gray-500">Registered Non-Profit NGO • Reg #NGO-8921</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-gray-500 font-semibold mb-1">Organization Name</label>
            <input type="text" defaultValue="Pranzoo Animal Rescue Foundation" className="w-full p-2.5 border rounded-xl" />
          </div>
          <div>
            <label className="block text-gray-500 font-semibold mb-1">Email Address</label>
            <input type="email" defaultValue="contact@pranzoo.org" className="w-full p-2.5 border rounded-xl" />
          </div>
          <div>
            <label className="block text-gray-500 font-semibold mb-1">Phone Number</label>
            <input type="text" defaultValue="+91 98765 00000" className="w-full p-2.5 border rounded-xl" />
          </div>
          <div>
            <label className="block text-gray-500 font-semibold mb-1">Website</label>
            <input type="text" defaultValue="https://pranzoo.org" className="w-full p-2.5 border rounded-xl" />
          </div>
        </div>

        <div className="flex justify-end">
          <button className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-xl shadow-sm">
            Save Profile Changes
          </button>
        </div>
      </div>
    </div>
  );
}
