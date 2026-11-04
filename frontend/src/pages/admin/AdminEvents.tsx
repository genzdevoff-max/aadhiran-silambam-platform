import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Calendar, MapPin, ExternalLink } from 'lucide-react';
import { adminApi } from '../../services/api';
import { AdminRequestError, getAdminRequestError } from '../../components/admin/AdminRequestState';
import { CloudImageUpload } from '../../components/common/CloudImageUpload';
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
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#102137] tracking-tight">
            Events & Demonstrations
          </h1>
          <p className="text-xs text-[#64748B] mt-1">
            Manage traditional martial arts tournaments, heritage showcases, and annual Guru Pooja ceremonies.
          </p>
        </div>

        <button
          onClick={() =>
            setEditingEvent({
              title: '',
              slug: '',
              event_type: 'competition',
              start_date: new Date().toISOString().split('T')[0],
              location: 'George Town, Penang',
              description: '',
              cover_image_url: '',
              registration_url: '',
              is_featured: false,
              status: 'upcoming',
            })
          }
          className="px-4 py-2.5 rounded-xl bg-[#102137] hover:bg-[#183B5B] text-white font-medium text-xs tracking-wider uppercase transition-all shadow-sm inline-flex items-center gap-2 border border-[#C6A04A]/60 shrink-0"
        >
          <Plus className="w-4 h-4 text-[#D9B96E] shrink-0" />
          <span>Add Event</span>
        </button>
      </div>

      {feedback && (
        <div
          role="status"
          className={`p-4 rounded-xl text-xs flex items-center justify-between border ${
            feedback.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-red-50 border-red-200 text-red-700'
          }`}
        >
          <span>{feedback.message}</span>
          <button onClick={() => setFeedback(null)} className="text-xs font-bold px-2">✕</button>
        </div>
      )}

      {loadError ? (
        <AdminRequestError message={loadError} onRetry={fetchEvents} />
      ) : loading ? (
        <div className="p-12 text-center text-[#64748B] text-xs">Loading scheduled events...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((evt) => (
            <div
              key={evt.id}
              className="p-5 rounded-2xl bg-white border border-[#E8E3D9] shadow-sm flex flex-col justify-between space-y-4 hover:border-[#C6A04A] transition-all"
            >
              <div className="space-y-3">
                {evt.cover_image_url && (
                  <div className="w-full h-40 rounded-xl overflow-hidden bg-[#F8F5EE] border border-[#E8E3D9]">
                    <img
                      src={evt.cover_image_url}
                      alt={evt.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-semibold text-[#C6A04A] uppercase tracking-wider">
                      {evt.event_type}
                    </span>
                    <span
                      className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        evt.status === 'upcoming'
                          ? 'bg-[#102137] text-white'
                          : evt.status === 'ongoing'
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {evt.status}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-[#102137] mt-1 line-clamp-2">
                    {evt.title}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-[#64748B] mt-1">
                    <Calendar className="w-3.5 h-3.5 text-[#C6A04A]" />
                    <span>{new Date(evt.start_date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-[#64748B] mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-[#C6A04A]" />
                    <span>{evt.location}</span>
                  </div>
                </div>

                <p className="text-xs text-[#182332] line-clamp-3 leading-relaxed">
                  {evt.description}
                </p>
              </div>

              <div className="pt-3 border-t border-[#E8E3D9] flex items-center justify-between">
                {evt.registration_url ? (
                  <a
                    href={evt.registration_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-[#C6A04A] hover:text-[#102137] font-semibold inline-flex items-center gap-1"
                  >
                    <span>Registration Link</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ) : <span />}

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setEditingEvent(evt)}
                    className="px-3 py-1.5 rounded-lg bg-[#F8F5EE] hover:bg-[#E8E3D9] text-[#102137] text-xs font-semibold inline-flex items-center gap-1.5 border border-[#E8E3D9] transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5 shrink-0" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(evt.id)}
                    className="px-3 py-1.5 rounded-lg bg-white hover:bg-red-50 text-red-600 text-xs font-semibold inline-flex items-center gap-1.5 border border-red-200 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5 shrink-0" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {editingEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div data-admin-dialog role="dialog" aria-modal="true" aria-label="Event editor" tabIndex={-1} className="relative w-full max-w-xl bg-white rounded-3xl overflow-hidden border border-[#E8E3D9] shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-5 bg-[#F8F5EE] flex justify-between items-center border-b border-[#E8E3D9]">
              <h3 className="text-base font-bold text-[#102137]">
                {editingEvent.id ? 'Edit Event' : 'Create New Event'}
              </h3>
              <button
                onClick={() => setEditingEvent(null)}
                className="text-[#64748B] hover:text-[#102137] px-2.5 py-1 rounded-lg bg-white border border-[#E8E3D9] text-xs font-medium"
              >
                ✕ Cancel
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#102137] uppercase mb-1">
                  Event Title
                </label>
                <input
                  type="text"
                  required
                  value={editingEvent.title || ''}
                  onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })}
                  placeholder="George Town World Heritage Day Showcase 2026"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F5EE] border border-[#E8E3D9] text-[#182332] text-xs focus:outline-none focus:border-[#C6A04A]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#102137] uppercase mb-1">
                    Event Type
                  </label>
                  <select
                    value={editingEvent.event_type || 'competition'}
                    onChange={(e) => setEditingEvent({ ...editingEvent, event_type: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F5EE] border border-[#E8E3D9] text-[#182332] text-xs focus:outline-none focus:border-[#C6A04A]"
                  >
                    <option value="competition">Competition / Tournament</option>
                    <option value="heritage_demo">Heritage Demonstration</option>
                    <option value="guru_pooja">Guru Pooja Commemoration</option>
                    <option value="workshop">Technical Workshop</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#102137] uppercase mb-1">
                    Status
                  </label>
                  <select
                    value={editingEvent.status || 'upcoming'}
                    onChange={(e) => setEditingEvent({ ...editingEvent, status: e.target.value as EventItem['status'] })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F5EE] border border-[#E8E3D9] text-[#182332] text-xs focus:outline-none focus:border-[#C6A04A]"
                  >
                    <option value="upcoming">Upcoming</option>
                    <option value="ongoing">Ongoing</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#102137] uppercase mb-1">
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
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F5EE] border border-[#E8E3D9] text-[#182332] text-xs focus:outline-none focus:border-[#C6A04A] font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#102137] uppercase mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    required
                    value={editingEvent.location || ''}
                    onChange={(e) => setEditingEvent({ ...editingEvent, location: e.target.value })}
                    placeholder="Lebuh King, George Town"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F5EE] border border-[#E8E3D9] text-[#182332] text-xs focus:outline-none focus:border-[#C6A04A]"
                  />
                </div>
              </div>

              {/* Cloud B2 Image Upload */}
              <CloudImageUpload
                label="Event Banner / Poster"
                value={editingEvent.cover_image_url || ''}
                onChange={(url) => setEditingEvent({ ...editingEvent, cover_image_url: url })}
                altText={editingEvent.title || 'Event'}
                helperText="Upload event promotional poster or action banner."
              />

              <div>
                <label className="block text-xs font-semibold text-[#102137] uppercase mb-1">
                  Registration or Booking URL (Optional)
                </label>
                <input
                  type="url"
                  value={editingEvent.registration_url || ''}
                  onChange={(e) => setEditingEvent({ ...editingEvent, registration_url: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F5EE] border border-[#E8E3D9] text-[#182332] text-xs focus:outline-none focus:border-[#C6A04A] font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#102137] uppercase mb-1">
                  Description & Itinerary
                </label>
                <textarea
                  rows={4}
                  required
                  value={editingEvent.description || ''}
                  onChange={(e) => setEditingEvent({ ...editingEvent, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F5EE] border border-[#E8E3D9] text-[#182332] text-xs focus:outline-none focus:border-[#C6A04A]"
                />
              </div>

              <div className="pt-4 border-t border-[#E8E3D9] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingEvent(null)}
                  className="px-4 py-2 rounded-xl border border-[#E8E3D9] bg-white text-[#64748B] hover:text-[#102137] text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#102137] hover:bg-[#183B5B] text-white text-xs font-semibold border border-[#C6A04A]/60 shadow-sm"
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
