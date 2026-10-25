import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { adminApi } from '../../services/api';
import { AdminRequestError, getAdminRequestError } from '../../components/admin/AdminRequestState';
import type { EventItem } from '../../types';

export const AdminEvents: React.FC = () => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [editingEvent, setEditingEvent] = useState<Partial<EventItem> | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fetchEvents = async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const data = await adminApi.getEvents();
      if (!Array.isArray(data)) throw new Error('Unexpected events response.');
      setEvents(data);
    } catch (error) {
      setLoadError(getAdminRequestError(error, 'Unable to load events.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent) return;

    try {
      if (editingEvent.id) {
        await adminApi.updateEvent(editingEvent.id, editingEvent);
        setFeedback({ type: 'success', message: 'Event updated successfully.' });
      } else {
        await adminApi.createEvent(editingEvent);
        setFeedback({ type: 'success', message: 'New event published successfully.' });
      }
      setEditingEvent(null);
      fetchEvents();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.response?.data?.message || 'Operation failed.' });
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    try {
      await adminApi.deleteEvent(id);
      setFeedback({ type: 'success', message: 'Event deleted successfully.' });
      fetchEvents();
    } catch {
      setFeedback({ type: 'error', message: 'Failed to delete event.' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-white">
            Events & Competitions Manager
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Manage traditional martial arts tournaments, heritage demos, and annual Poojai ceremonies.
          </p>
        </div>

        <button
          onClick={() =>
            setEditingEvent({
              title: '',
              slug: '',
              event_type: 'competition',
              start_date: new Date().toISOString().split('T')[0],
              location: 'Lebuh King Headquarters, George Town',
              description: '',
              cover_image_url: '/uploads/portfolio-2.jpg',
              registration_url: '',
              status: 'upcoming',
            })
          }
          className="px-4 py-2.5 rounded-xl bg-crimson-600 hover:bg-crimson-500 text-white font-semibold text-xs tracking-wider uppercase transition-colors shadow flex items-center space-x-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Publish Event</span>
        </button>
      </div>

      {feedback && (
        <div
          className={`p-4 rounded-xl text-xs flex items-center justify-between ${
            feedback.type === 'success'
              ? 'bg-emerald-950/80 border border-emerald-700/60 text-emerald-300'
              : 'bg-crimson-950/80 border border-crimson-700/60 text-crimson-300'
          }`}
        >
          <span>{feedback.message}</span>
          <button onClick={() => setFeedback(null)} className="text-gray-400 hover:text-white">✕</button>
        </div>
      )}

      {/* Events Grid */}
      {loading ? (
        <div className="py-12 text-center text-xs text-gray-500 font-mono">Loading events...</div>
      ) : loadError ? (
        <AdminRequestError message={loadError} onRetry={() => fetchEvents()} />
      ) : events.length === 0 ? (
        <div className="rounded-2xl border border-charcoal-800 bg-charcoal-900 p-10 text-center text-sm text-gray-300">
          No events have been added yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((evt) => (
            <div
              key={evt.id}
              className="p-5 rounded-2xl bg-charcoal-900 border border-charcoal-800 shadow-xl flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono font-bold text-crimson-400 uppercase">
                    {evt.event_type}
                  </span>
                  <span
                    className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded ${
                      evt.status === 'upcoming' ? 'bg-emerald-950 text-emerald-400' : 'bg-charcoal-800 text-gray-400'
                    }`}
                  >
                    {evt.status}
                  </span>
                </div>

                <h3 className="text-base font-display font-bold text-white mb-2">
                  {evt.title}
                </h3>

                <div className="space-y-1 text-xs text-gray-400 mb-3 font-mono">
                  <p>Date: {new Date(evt.start_date).toLocaleDateString()}</p>
                  <p className="truncate">Loc: {evt.location}</p>
                </div>

                <p className="text-xs text-gray-400 line-clamp-3 leading-relaxed">
                  {evt.description}
                </p>
              </div>

              <div className="pt-3 border-t border-charcoal-800 flex items-center justify-end space-x-2">
                <button
                  onClick={() => setEditingEvent(evt)}
                  className="px-2.5 py-1 rounded-lg bg-charcoal-800 text-gold-400 hover:text-white text-xs font-semibold"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(evt.id)}
                  className="px-2.5 py-1 rounded-lg bg-charcoal-800 text-gray-400 hover:text-crimson-400 text-xs font-semibold"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {editingEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div data-admin-dialog role="dialog" aria-modal="true" aria-label="Event editor" tabIndex={-1} className="relative w-full max-w-xl bg-charcoal-900 rounded-2xl overflow-hidden border border-charcoal-700 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-5 bg-charcoal-950 flex justify-between items-center border-b border-charcoal-800">
              <h3 className="text-base font-display font-bold text-white">
                {editingEvent.id ? 'Edit Event Schedule' : 'Schedule New Event'}
              </h3>
              <button
                onClick={() => setEditingEvent(null)}
                className="text-gray-400 hover:text-white px-2 py-1 rounded bg-charcoal-800 text-xs"
              >
                ✕ Cancel
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase mb-1">
                  Event Title
                </label>
                <input
                  type="text"
                  required
                  value={editingEvent.title || ''}
                  onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-charcoal-950 border border-charcoal-700 text-white text-xs focus:outline-none focus:border-gold-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase mb-1">
                    Event Type
                  </label>
                  <select
                    value={editingEvent.event_type || 'competition'}
                    onChange={(e) => setEditingEvent({ ...editingEvent, event_type: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-charcoal-950 border border-charcoal-700 text-white text-xs focus:outline-none focus:border-gold-500"
                  >
                    <option value="competition">Competition / Championship</option>
                    <option value="demonstration">Heritage Demonstration</option>
                    <option value="workshop">Training Workshop</option>
                    <option value="ceremony">Annual Guru Poojai / Ceremony</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase mb-1">
                    Status
                  </label>
                  <select
                    value={editingEvent.status || 'upcoming'}
                    onChange={(e) => setEditingEvent({ ...editingEvent, status: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-charcoal-950 border border-charcoal-700 text-white text-xs focus:outline-none focus:border-gold-500"
                  >
                    <option value="upcoming">Upcoming</option>
                    <option value="ongoing">Ongoing</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase mb-1">
                    Date & Start Time
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={
                      editingEvent.start_date
                        ? new Date(editingEvent.start_date).toISOString().slice(0, 16)
                        : ''
                    }
                    onChange={(e) => setEditingEvent({ ...editingEvent, start_date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-charcoal-950 border border-charcoal-700 text-white text-xs focus:outline-none focus:border-gold-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    required
                    value={editingEvent.location || ''}
                    onChange={(e) => setEditingEvent({ ...editingEvent, location: e.target.value })}
                    placeholder="Lebuh King, George Town"
                    className="w-full px-3 py-2 rounded-xl bg-charcoal-950 border border-charcoal-700 text-white text-xs focus:outline-none focus:border-gold-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase mb-1">
                  Registration or Booking URL (Optional)
                </label>
                <input
                  type="url"
                  value={editingEvent.registration_url || ''}
                  onChange={(e) => setEditingEvent({ ...editingEvent, registration_url: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3 py-2 rounded-xl bg-charcoal-950 border border-charcoal-700 text-white text-xs focus:outline-none focus:border-gold-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase mb-1">
                  Description & Itinerary
                </label>
                <textarea
                  rows={4}
                  required
                  value={editingEvent.description || ''}
                  onChange={(e) => setEditingEvent({ ...editingEvent, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-charcoal-950 border border-charcoal-700 text-white text-xs focus:outline-none focus:border-gold-500"
                />
              </div>

              <div className="pt-4 border-t border-charcoal-800 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setEditingEvent(null)}
                  className="px-4 py-2 rounded-xl bg-charcoal-800 text-gray-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-crimson-600 hover:bg-crimson-500 text-white text-xs font-bold uppercase tracking-wider transition-colors shadow"
                >
                  Save Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
