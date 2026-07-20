"use client";

import { PawPrint, Plus, Search } from "lucide-react";

export default function AdoptionsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Adoptions</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Manage adoption listings and applications
          </p>
        </div>

        <button className="flex items-center space-x-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-xl shadow-sm transition-all">
          <Plus className="w-4 h-4" />
          <span>Add Adoption Listing</span>
        </button>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search listings..."
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-emerald-600"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="h-40 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400">
            <PawPrint className="w-10 h-10" />
          </div>
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-gray-900 text-base">Buddy (Golden Retriever)</h3>
            <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded-full">
              AVAILABLE
            </span>
          </div>
          <p className="text-xs text-gray-500">2 years old • Male • Vaccinated</p>
          <div className="flex space-x-2 pt-2">
            <button className="flex-1 py-1.5 border border-gray-200 text-xs font-semibold rounded-lg hover:bg-gray-50">
              Edit
            </button>
            <button className="flex-1 py-1.5 bg-emerald-700 text-white text-xs font-semibold rounded-lg hover:bg-emerald-800">
              Applications (3)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
