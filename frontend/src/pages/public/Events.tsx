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
    <div className="bg-charcoal-950 text-gray-200">
      {/* Header Banner */}
      <section className="relative py-24 bg-gradient-to-b from-charcoal-900 to-charcoal-950 border-b border-charcoal-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-crimson-950 border border-crimson-700/60 text-gold-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <Calendar className="w-3.5 h-3.5 text-crimson-500" />
            <span>Community Gatherings & Martial Demos</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-display font-extrabold text-white tracking-tight">
            Events & Competitions
          </h1>
          <p className="mt-3 text-lg font-display text-gold-400 font-semibold tracking-wide">
            நிகழ்வுகளும் போட்டிகளும் • Heritage Demonstrations & Annual Traditions
          </p>
          <div className="flex items-center justify-center space-x-2 text-xs text-gray-400 mt-4">
            <Link to="/" className="hover:text-gold-400">Home</Link>
            <span>/</span>
            <span className="text-gray-300">Events</span>
          </div>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="py-6 bg-charcoal-900/60 border-b border-charcoal-800 sticky top-[65px] z-30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Filter Schedule:
          </span>
          <div className="flex space-x-2">
            {['all', 'upcoming', 'completed'].map((status) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                  selectedStatus === status
                    ? 'bg-crimson-600 text-white shadow'
                    : 'bg-charcoal-800 text-gray-400 hover:text-white'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-20 border-b border-charcoal-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((evt) => {
              const startDate = new Date(evt.start_date);
              return (
                <div
                  key={evt.id}
                  className="rounded-2xl bg-charcoal-900 border border-charcoal-800 overflow-hidden hover:border-gold-500/50 transition-all duration-300 flex flex-col group shadow-xl"
                >
                  <div className="relative h-48 bg-charcoal-950 overflow-hidden">
                    <img
                      src={evt.cover_image_url || '/uploads/portfolio-2.jpg'}
                      alt={evt.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded bg-charcoal-950/85 backdrop-blur-sm border border-charcoal-700 text-gold-400 text-xs font-mono font-bold uppercase">
                      {evt.event_type}
                    </div>
                    <div
                      className={`absolute top-3 right-3 px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        evt.status === 'upcoming'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-charcoal-800 text-gray-400'
                      }`}
                    >
                      {evt.status}
                    </div>
                  </div>

                  <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-center space-x-2 text-xs font-mono text-gold-400 mb-2">
                        <Calendar className="w-3.5 h-3.5 text-crimson-500" />
                        <span>{startDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      </div>

                      <h3 className="text-xl font-display font-bold text-white group-hover:text-gold-300 transition-colors">
                        {evt.title}
                      </h3>

                      <div className="flex items-center space-x-2 text-xs text-gray-400 mt-2 mb-3">
                        <MapPin className="w-3.5 h-3.5 text-crimson-500 flex-shrink-0" />
                        <span className="truncate">{evt.location}</span>
                      </div>

                      <p className="text-xs text-gray-400 leading-relaxed line-clamp-3">
                        {evt.description}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-charcoal-800 flex items-center justify-between text-xs">
                      <button
                        onClick={() => setSelectedEvent(evt)}
                        className="text-gold-400 hover:text-gold-300 font-semibold transition-colors"
                      >
                        View Full Details →
                      </button>

                      {evt.registration_url && evt.status === 'upcoming' && (
                        <Link
                          to={evt.registration_url}
                          className="px-3 py-1.5 rounded bg-crimson-600 hover:bg-crimson-500 text-white font-semibold flex items-center transition-colors shadow-md shadow-crimson-900/40"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="relative w-full max-w-xl bg-charcoal-900 rounded-2xl overflow-hidden border border-charcoal-700 shadow-2xl">
            <div className="p-4 bg-charcoal-950 flex justify-between items-center border-b border-charcoal-800">
              <span className="text-xs font-mono font-bold text-gold-400 uppercase">
                {selectedEvent.event_type} • {selectedEvent.status}
              </span>
              <button
                onClick={() => setSelectedEvent(null)}
                className="text-gray-400 hover:text-white px-2.5 py-1 rounded bg-charcoal-800 text-sm transition-colors"
              >
                ✕ Close
              </button>
            </div>

            <div className="p-6 space-y-4">
              <h3 className="text-2xl font-display font-bold text-white">
                {selectedEvent.title}
              </h3>

              <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-charcoal-950 border border-charcoal-800 text-xs">
                <div>
                  <span className="text-gray-400 block">Date & Schedule:</span>
                  <span className="text-white font-semibold">
                    {new Date(selectedEvent.start_date).toLocaleDateString('en-GB', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 block">Location:</span>
                  <span className="text-white font-semibold">{selectedEvent.location}</span>
                </div>
              </div>

              <p className="text-sm text-gray-300 leading-relaxed">
                {selectedEvent.description}
              </p>

              {selectedEvent.registration_url && (
                <div className="pt-4 border-t border-charcoal-800 flex justify-end">
                  <Link
                    to={selectedEvent.registration_url}
                    className="inline-flex items-center px-5 py-2.5 rounded-lg bg-crimson-600 hover:bg-crimson-500 text-white font-semibold text-xs uppercase tracking-wider transition-colors shadow-md shadow-crimson-900/40"
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
