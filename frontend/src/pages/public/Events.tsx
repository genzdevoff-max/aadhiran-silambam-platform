import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  MapPin,
  ExternalLink,
} from 'lucide-react';
import { eventsList } from '../../data';
import { publicApi } from '../../services/api';
import type { EventItem } from '../../types';

export const Events: React.FC = () => {
  const [events, setEvents] = useState<EventItem[]>(eventsList);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);

  useEffect(() => {
    publicApi.getEvents().then((data) => {
      if (Array.isArray(data) && data.length > 0) {
        setEvents(data);
      }
    }).catch(() => {});
  }, []);

  const filteredEvents = selectedStatus === 'all'
    ? events
    : events.filter((e) => e.status.toLowerCase() === selectedStatus.toLowerCase());

  return (
    <div className="bg-[#FDFBF7] text-[#182332]">
      {/* Header Banner - Deep Heritage Navy */}
      <section className="relative py-20 sm:py-24 bg-[#102137] border-b border-[#183B5B] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#183B5B]/80 border border-[#C6A04A]/50 text-[#D9B96E] text-xs font-semibold uppercase tracking-wider mb-4 shadow-sm">
            <Calendar className="w-3.5 h-3.5 text-[#C6A04A] shrink-0" />
            <span>Community Gatherings & Martial Demos</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-display font-bold text-white tracking-tight">
            Events & Competitions
          </h1>
          <p className="mt-3 text-lg font-display text-[#D9B96E] font-medium tracking-wide">
            நிகழ்வுகளும் போட்டிகளும் • Heritage Demonstrations & Annual Traditions
          </p>
          <div className="flex items-center justify-center space-x-2 text-xs text-white/70 mt-4">
            <Link to="/" className="hover:text-[#D9B96E]">Home</Link>
            <span>/</span>
            <span className="text-[#D9B96E] font-medium">Events</span>
          </div>
        </div>
      </section>

      {/* Filter Tabs - Sticky Bar */}
      <section className="py-4 bg-white border-b border-[#E8E3D9] sticky top-[65px] z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <span className="text-xs font-semibold text-[#182332] uppercase tracking-wider">
            Filter Schedule:
          </span>
          <div className="flex space-x-2">
            {['all', 'upcoming', 'completed'].map((status) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                  selectedStatus === status
                    ? 'bg-[#102137] text-white shadow-sm'
                    : 'bg-[#F8F5EE] text-[#64748B] hover:text-[#182332] border border-[#E8E3D9]'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-16 sm:py-20 border-b border-[#E8E3D9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((evt) => {
              const startDate = new Date(evt.start_date);
              return (
                <div
                  key={evt.id}
                  className="rounded-2xl bg-white border border-[#E8E3D9] overflow-hidden hover:border-[#C6A04A] transition-all duration-300 flex flex-col group shadow-sm hover:shadow-md"
                >
                  <div className="relative h-48 bg-[#F8F5EE] overflow-hidden">
                    <img
                      src={evt.cover_image_url || '/api/public/media/stream/silambam/9661e79a-b91d-4307-b538-70ed6647bafb.jpg'}
                      alt={evt.title}
                      width={400}
                      height={192}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        const t = e.currentTarget;
                        t.onerror = null;
                        t.src = '/uploads/1129754474.jpg';
                      }}
                    />
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded bg-[#102137]/90 backdrop-blur-sm border border-[#183B5B] text-[#D9B96E] text-xs font-mono font-bold uppercase">
                      {evt.event_type}
                    </div>
                    <div
                      className={`absolute top-3 right-3 px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        evt.status === 'upcoming'
                          ? 'bg-emerald-700 text-white'
                          : 'bg-stone-700 text-white'
                      }`}
                    >
                      {evt.status}
                    </div>
                  </div>

                  <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-center space-x-2 text-xs font-mono text-[#C6A04A] mb-2 font-semibold">
                        <Calendar className="w-3.5 h-3.5 text-[#C6A04A] shrink-0" />
                        <span>{startDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      </div>

                      <h3 className="text-xl font-display font-bold text-[#102137] group-hover:text-[#C6A04A] transition-colors">
                        {evt.title}
                      </h3>

                      <div className="flex items-center space-x-2 text-xs text-[#64748B] mt-2 mb-3">
                        <MapPin className="w-3.5 h-3.5 text-[#C6A04A] shrink-0 flex-shrink-0" />
                        <span className="truncate">{evt.location}</span>
                      </div>

                      <p className="text-xs text-[#64748B] leading-relaxed line-clamp-3">
                        {evt.description}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-[#E8E3D9] flex items-center justify-between text-xs">
                      <button
                        onClick={() => setSelectedEvent(evt)}
                        className="text-[#102137] hover:text-[#C6A04A] font-semibold transition-colors"
                      >
                        View Full Details →
                      </button>

                      {evt.registration_url && evt.status === 'upcoming' && (
                        <Link
                          to={evt.registration_url}
                          className="px-3 py-1.5 rounded-lg bg-[#C6A04A] hover:bg-[#D9B96E] text-[#102137] font-semibold flex items-center transition-colors shadow-sm"
                        >
                          <span>Register</span>
                          <ExternalLink className="w-3 h-3 ml-1 shrink-0" />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Modal Detail */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#102137]/75 backdrop-blur-sm">
          <div className="relative w-full max-w-xl bg-white rounded-2xl overflow-hidden border border-[#E8E3D9] shadow-2xl">
            <div className="p-4 bg-[#102137] flex justify-between items-center border-b border-[#183B5B] text-white">
              <span className="text-xs font-mono font-bold text-[#D9B96E] uppercase">
                {selectedEvent.event_type} • {selectedEvent.status}
              </span>
              <button
                onClick={() => setSelectedEvent(null)}
                className="text-white/80 hover:text-white px-2.5 py-1 rounded bg-[#183B5B] border border-[#183B5B] text-sm transition-colors"
              >
                ✕ Close
              </button>
            </div>

            <div className="p-6 space-y-4">
              <h3 className="text-2xl font-display font-bold text-[#102137]">
                {selectedEvent.title}
              </h3>

              <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-[#F8F5EE] border border-[#E8E3D9] text-xs">
                <div>
                  <span className="text-[#64748B] block">Date & Schedule:</span>
                  <span className="text-[#102137] font-semibold">
                    {new Date(selectedEvent.start_date).toLocaleDateString('en-GB', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </div>
                <div>
                  <span className="text-[#64748B] block">Location:</span>
                  <span className="text-[#102137] font-semibold">{selectedEvent.location}</span>
                </div>
              </div>

              <p className="text-sm text-[#182332] leading-relaxed">
                {selectedEvent.description}
              </p>

              {selectedEvent.registration_url && (
                <div className="pt-4 border-t border-[#E8E3D9] flex justify-end">
                  <Link
                    to={selectedEvent.registration_url}
                    className="inline-flex items-center px-5 py-2.5 rounded-xl bg-[#C6A04A] hover:bg-[#D9B96E] text-[#102137] font-bold text-xs uppercase tracking-wider transition-colors shadow-sm"
                  >
                    <span>Register for Event</span>
                    <ExternalLink className="w-3.5 h-3.5 ml-2 shrink-0" />
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
