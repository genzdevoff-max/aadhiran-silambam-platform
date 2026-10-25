import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  MapPin,
  ExternalLink,
} from 'lucide-react';
import { eventsList } from '../../data';
import type { EventItem } from '../../types';

export const Events: React.FC = () => {
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);

  const filteredEvents = selectedStatus === 'all'
    ? eventsList
    : eventsList.filter((e) => e.status.toLowerCase() === selectedStatus.toLowerCase());

  return (
    <div className="bg-[#FDFBF7] text-slate-800">
      {/* Header Banner - Deep Navy */}
      <section className="relative py-20 sm:py-24 bg-gradient-to-b from-[#0B1B3D] to-navy-950 border-b border-navy-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-navy-900/90 border border-amber-400/40 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-4 shadow-sm">
            <Calendar className="w-3.5 h-3.5 text-amber-400" />
            <span>Community Gatherings & Martial Demos</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-display font-extrabold text-white tracking-tight">
            Events & Competitions
          </h1>
          <p className="mt-3 text-lg font-display text-amber-300 font-semibold tracking-wide">
            நிகழ்வுகளும் போட்டிகளும் • Heritage Demonstrations & Annual Traditions
          </p>
          <div className="flex items-center justify-center space-x-2 text-xs text-slate-300 mt-4">
            <Link to="/" className="hover:text-amber-300">Home</Link>
            <span>/</span>
            <span className="text-amber-200">Events</span>
          </div>
        </div>
      </section>

      {/* Filter Tabs - Sticky White Bar */}
      <section className="py-4 bg-white/95 border-b border-stone-200 sticky top-[65px] z-30 backdrop-blur-md shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
            Filter Schedule:
          </span>
          <div className="flex space-x-2">
            {['all', 'upcoming', 'completed'].map((status) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                  selectedStatus === status
                    ? 'bg-[#0B1B3D] text-white shadow-sm'
                    : 'bg-stone-100 text-slate-600 hover:bg-stone-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-16 sm:py-20 border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((evt) => {
              const startDate = new Date(evt.start_date);
              return (
                <div
                  key={evt.id}
                  className="rounded-2xl bg-white border border-stone-200 overflow-hidden hover:border-amber-400 transition-all duration-300 flex flex-col group shadow-sm hover:shadow-md"
                >
                  <div className="relative h-48 bg-stone-100 overflow-hidden">
                    <img
                      src={evt.cover_image_url || '/uploads/portfolio-2.jpg'}
                      alt={evt.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded bg-navy-950/85 backdrop-blur-sm border border-navy-700 text-amber-300 text-xs font-mono font-bold uppercase">
                      {evt.event_type}
                    </div>
                    <div
                      className={`absolute top-3 right-3 px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        evt.status === 'upcoming'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-stone-700 text-white'
                      }`}
                    >
                      {evt.status}
                    </div>
                  </div>

                  <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-center space-x-2 text-xs font-mono text-amber-800 mb-2">
                        <Calendar className="w-3.5 h-3.5 text-amber-600" />
                        <span>{startDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      </div>

                      <h3 className="text-xl font-display font-bold text-[#0B1B3D] group-hover:text-amber-700 transition-colors">
                        {evt.title}
                      </h3>

                      <div className="flex items-center space-x-2 text-xs text-slate-500 mt-2 mb-3">
                        <MapPin className="w-3.5 h-3.5 text-crimson-600 flex-shrink-0" />
                        <span className="truncate">{evt.location}</span>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                        {evt.description}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-xs">
                      <button
                        onClick={() => setSelectedEvent(evt)}
                        className="text-amber-700 hover:text-amber-800 font-semibold transition-colors"
                      >
                        View Full Details →
                      </button>

                      {evt.registration_url && evt.status === 'upcoming' && (
                        <Link
                          to={evt.registration_url}
                          className="px-3 py-1.5 rounded bg-amber-500 hover:bg-amber-600 text-white font-semibold flex items-center transition-colors shadow-sm"
                        >
                          <span>Register</span>
                          <ExternalLink className="w-3 h-3 ml-1" />
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-sm">
          <div className="relative w-full max-w-xl bg-white rounded-2xl overflow-hidden border border-stone-200 shadow-2xl">
            <div className="p-4 bg-[#0B1B3D] flex justify-between items-center border-b border-navy-800 text-white">
              <span className="text-xs font-mono font-bold text-amber-300 uppercase">
                {selectedEvent.event_type} • {selectedEvent.status}
              </span>
              <button
                onClick={() => setSelectedEvent(null)}
                className="text-slate-300 hover:text-white px-2.5 py-1 rounded bg-navy-800 text-sm transition-colors"
              >
                ✕ Close
              </button>
            </div>

            <div className="p-6 space-y-4">
              <h3 className="text-2xl font-display font-bold text-[#0B1B3D]">
                {selectedEvent.title}
              </h3>

              <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-stone-50 border border-stone-200 text-xs">
                <div>
                  <span className="text-slate-500 block">Date & Schedule:</span>
                  <span className="text-slate-900 font-semibold">
                    {new Date(selectedEvent.start_date).toLocaleDateString('en-GB', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Location:</span>
                  <span className="text-slate-900 font-semibold">{selectedEvent.location}</span>
                </div>
              </div>

              <p className="text-sm text-slate-700 leading-relaxed">
                {selectedEvent.description}
              </p>

              {selectedEvent.registration_url && (
                <div className="pt-4 border-t border-stone-100 flex justify-end">
                  <Link
                    to={selectedEvent.registration_url}
                    className="inline-flex items-center px-5 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs uppercase tracking-wider transition-colors shadow-sm"
                  >
                    <span>Register for Event</span>
                    <ExternalLink className="w-3.5 h-3.5 ml-2" />
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
