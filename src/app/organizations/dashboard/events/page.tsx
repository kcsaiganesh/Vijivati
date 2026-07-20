"use client";

import { useState } from "react";
import { Plus, Search, Calendar as CalendarIcon, MapPin } from "lucide-react";

interface EventItem {
  id: string;
  title: string;
  category: string;
  dateTime: string;
  location: string;
  description: string;
  registrations: number;
  organizer: string;
}

const mockEvents: EventItem[] = [
  {
    id: "EVT001",
    title: "Weekend Adoption Drive",
    category: "ADOPTION DRIVE",
    dateTime: "2024-04-15 • 10:00 AM - 4:00 PM",
    location: "Central Park, MG Road",
    description: "Find forever homes for our rescued animals",
    registrations: 45,
    organizer: "Sarah Johnson",
  },
];

export default function EventsPage() {
  const [events, setEvents] = useState<EventItem[]>(mockEvents);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "",
    category: "ADOPTION DRIVE",
    dateTime: "",
    location: "",
    description: "",
    organizer: "",
  });

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvent.title) return;
    const created: EventItem = {
      id: `EVT${Date.now().toString().slice(-3)}`,
      ...newEvent,
      registrations: 0,
    };
    setEvents([created, ...events]);
    setShowModal(false);
    setNewEvent({
      title: "",
      category: "ADOPTION DRIVE",
      dateTime: "",
      location: "",
      description: "",
      organizer: "",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header & Top Action */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Events</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Manage and organize events and campaigns
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center space-x-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-xl shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Create Event</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
          />
        </div>

        <select className="px-3.5 py-2 border border-gray-200 rounded-xl text-xs text-gray-700 bg-white focus:outline-none focus:border-emerald-600">
          <option value="">Type</option>
          <option value="Adoption Drive">Adoption Drive</option>
          <option value="Fundraiser">Fundraiser</option>
          <option value="Awareness">Awareness</option>
        </select>

        <select className="px-3.5 py-2 border border-gray-200 rounded-xl text-xs text-gray-700 bg-white focus:outline-none focus:border-emerald-600">
          <option value="">Status</option>
          <option value="Upcoming">Upcoming</option>
          <option value="Ongoing">Ongoing</option>
          <option value="Completed">Completed</option>
        </select>

        <select className="px-3.5 py-2 border border-gray-200 rounded-xl text-xs text-gray-700 bg-white focus:outline-none focus:border-emerald-600">
          <option value="">Date Range</option>
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
        </select>
      </div>

      {/* Section Header */}
      <div>
        <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
          Upcoming
        </span>
      </div>

      {/* Event Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((evt) => (
          <div
            key={evt.id}
            className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div>
                <h3 className="text-base font-bold text-gray-900">{evt.title}</h3>
                <span className="inline-block mt-1.5 px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-purple-100 text-purple-700 uppercase">
                  {evt.category}
                </span>
              </div>

              <div className="space-y-1.5 text-xs text-gray-500">
                <div className="flex items-center space-x-2">
                  <CalendarIcon className="w-3.5 h-3.5 text-gray-400" />
                  <span>{evt.dateTime}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-3.5 h-3.5 text-gray-400" />
                  <span>{evt.location}</span>
                </div>
              </div>

              <p className="text-xs text-gray-600 leading-relaxed">
                {evt.description}
              </p>
            </div>

            <div className="pt-3 border-t border-gray-100 space-y-3">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Registrations: <strong className="text-gray-900">{evt.registrations}</strong></span>
                <span>Organizer: <strong className="text-gray-900">{evt.organizer}</strong></span>
              </div>

              <div className="flex items-center space-x-3">
                <button className="flex-1 py-2 border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-semibold rounded-xl transition-all">
                  Edit
                </button>
                <button className="flex-1 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-xl shadow-sm transition-all">
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Event Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateEvent}
            className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl"
          >
            <h3 className="text-lg font-bold text-gray-900 border-b pb-3">
              Create New Event
            </h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Event Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Weekend Adoption Drive"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:border-emerald-600"
                />
              </div>
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Date & Time
                </label>
                <input
                  type="text"
                  required
                  placeholder="2024-04-15 • 10:00 AM - 4:00 PM"
                  value={newEvent.dateTime}
                  onChange={(e) => setNewEvent({ ...newEvent, dateTime: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:border-emerald-600"
                />
              </div>
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  required
                  placeholder="Central Park, MG Road"
                  value={newEvent.location}
                  onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:border-emerald-600"
                />
              </div>
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  placeholder="Event description..."
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:border-emerald-600"
                  rows={3}
                />
              </div>
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Organizer Name
                </label>
                <input
                  type="text"
                  placeholder="Sarah Johnson"
                  value={newEvent.organizer}
                  onChange={(e) => setNewEvent({ ...newEvent, organizer: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:border-emerald-600"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 pt-3 border-t">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-xl shadow-sm"
              >
                Save Event
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
