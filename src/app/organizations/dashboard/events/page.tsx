"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Calendar as CalendarIcon, MapPin, Loader2, X } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

export default function EventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "",
    type: "ADOPTION_DRIVE",
    date: "",
    time: "",
    location: "",
    description: "",
    organizer: "",
  });

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/events/my`,
        { withCredentials: true }
      );
      if (res.data.success) {
        setEvents(res.data.data);
      }
    } catch (error) {
      toast.error("Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/events`,
        newEvent,
        { withCredentials: true }
      );
      
      if (res.data.success) {
        toast.success("Event created successfully");
        setShowModal(false);
        setNewEvent({
          title: "",
          type: "ADOPTION_DRIVE",
          date: "",
          time: "",
          location: "",
          description: "",
          organizer: "",
        });
        fetchEvents();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create event");
    } finally {
      setSubmitting(false);
    }
  };

  const deleteEvent = async (id: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return;
    try {
        const res = await axios.delete(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/events/${id}`,
            { withCredentials: true }
        );
        if (res.data.success) {
            toast.success("Event deleted");
            setEvents(events.filter(e => e._id !== id));
        }
    } catch (error) {
        toast.error("Failed to delete event");
    }
  };

  const filteredEvents = events.filter((evt) =>
    evt.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
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
      </div>

      <div>
        <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
          All Events
        </span>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="text-center py-20 bg-white border border-dashed border-gray-200 rounded-2xl">
          <CalendarIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-sm font-semibold text-gray-900">No Events Found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((evt) => (
            <div
              key={evt._id}
              className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div>
                  <h3 className="text-base font-bold text-gray-900">{evt.title}</h3>
                  <span className="inline-block mt-1.5 px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-purple-100 text-purple-700 uppercase">
                    {evt.type?.replace('_', ' ')}
                  </span>
                  <span className={`inline-block ml-2 px-2.5 py-0.5 text-[10px] font-bold rounded-full ${
                      evt.status === 'UPCOMING' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {evt.status}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-gray-500">
                  <div className="flex items-center space-x-2">
                    <CalendarIcon className="w-3.5 h-3.5 text-gray-400" />
                    <span>{new Date(evt.date).toLocaleDateString()} • {evt.time}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-3.5 h-3.5 text-gray-400" />
                    <span>{evt.location}</span>
                  </div>
                </div>

                <p className="text-xs text-gray-600 leading-relaxed line-clamp-2">
                  {evt.description}
                </p>
              </div>

              <div className="pt-3 border-t border-gray-100 space-y-3">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Registrations: <strong className="text-gray-900">{evt.registrations || 0}</strong></span>
                  <span>Organizer: <strong className="text-gray-900">{evt.organizer || 'Staff'}</strong></span>
                </div>

                <div className="flex items-center space-x-3">
                  <button 
                    onClick={() => deleteEvent(evt._id)}
                    className="flex-1 py-2 border border-red-200 hover:bg-red-50 text-red-600 text-xs font-semibold rounded-xl transition-all"
                  >
                    Delete
                  </button>
                  <button className="flex-1 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-xl shadow-sm transition-all">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Event Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateEvent}
            className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto p-6 space-y-4 shadow-xl"
          >
            <div className="flex items-center justify-between border-b pb-3">
                <h3 className="text-lg font-bold text-gray-900">
                Create New Event
                </h3>
                <button type="button" onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                    <X className="w-5 h-5" />
                </button>
            </div>
            
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
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Event Type
                  </label>
                  <select
                    required
                    value={newEvent.type}
                    onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:border-emerald-600"
                  >
                      <option value="ADOPTION_DRIVE">Adoption Drive</option>
                      <option value="FUNDRAISER">Fundraiser</option>
                      <option value="AWARENESS">Awareness</option>
                      <option value="VACCINATION">Vaccination</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    required
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Time
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="10:00 AM - 4:00 PM"
                    value={newEvent.time}
                    onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:border-emerald-600"
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
                disabled={submitting}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-xl shadow-sm flex items-center gap-2"
              >
                {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                Save Event
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
