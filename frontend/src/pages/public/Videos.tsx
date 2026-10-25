import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Play,
  Film,
  ExternalLink,
} from 'lucide-react';
import { videosList } from '../../data';
import type { AuthenticVideo } from '../../data';

export const Videos: React.FC = () => {
  const [activeVideo, setActiveVideo] = useState<AuthenticVideo>(videosList[0]);

  return (
    <div className="bg-[#FDFBF7] text-slate-800">
      {/* Header Banner - Deep Navy */}
      <section className="relative py-20 sm:py-24 bg-gradient-to-b from-[#0B1B3D] to-navy-950 border-b border-navy-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-navy-900/90 border border-amber-400/40 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-4 shadow-sm">
            <Film className="w-3.5 h-3.5 text-amber-400" />
            <span>Living Motion Archives</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-display font-extrabold text-white tracking-tight">
            Videos & Media Vault
          </h1>
          <p className="mt-3 text-lg font-display text-amber-300 font-semibold tracking-wide">
            காணொளி தொகுப்பு • Authentic Footwork, Twirling & Documentary Footage
          </p>
          <div className="flex items-center justify-center space-x-2 text-xs text-slate-300 mt-4">
            <Link to="/" className="hover:text-amber-300">Home</Link>
            <span>/</span>
            <span className="text-amber-200">Videos & Media</span>
          </div>
        </div>
      </section>

      {/* Featured Video Player */}
      <section className="py-16 border-b border-stone-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl overflow-hidden bg-black border border-stone-300 shadow-xl">
            {/* HTML5 Video Element */}
            <div className="aspect-video w-full bg-black flex items-center justify-center">
              <video
                key={activeVideo.src}
                src={activeVideo.src}
                poster={activeVideo.poster}
                controls
                autoPlay={false}
                className="w-full h-full object-contain"
              >
                Your browser does not support HTML5 video.
              </video>
            </div>

            {/* Video Details */}
            <div className="p-8 bg-[#0B1B3D] border-t border-navy-800 flex flex-col md:flex-row justify-between items-start gap-6 text-white">
              <div className="space-y-2 max-w-3xl">
                <div className="flex items-center space-x-3">
                  <span className="px-3 py-0.5 rounded bg-amber-500 text-white font-mono text-xs font-bold uppercase">
                    {activeVideo.category}
                  </span>
                  <span className="text-xs font-mono text-amber-300">
                    {activeVideo.duration}
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-display font-bold text-white">
                  {activeVideo.title}
                </h2>
                {activeVideo.tamil_title && (
                  <p className="text-sm font-mono text-amber-300">
                    {activeVideo.tamil_title}
                  </p>
                )}
                <p className="text-sm text-slate-300 leading-relaxed pt-2">
                  {activeVideo.description}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
                <Link
                  to="/join-training"
                  className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs tracking-wider uppercase transition-colors shadow-md"
                >
                  Learn This Discipline →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Video Playlist Grid */}
      <section className="py-20 border-b border-stone-200 bg-[#FDFBF7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <span className="text-xs uppercase font-bold text-crimson-600 tracking-widest">
                Curated Reel
              </span>
              <h3 className="text-2xl sm:text-3xl font-display font-bold text-[#0B1B3D] mt-1">
                Authentic Video Reel
              </h3>
            </div>
            <a
              href="https://youtube.com/@aadhiransilambam"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-xs font-semibold text-amber-700 hover:text-amber-800"
            >
              <span>Visit Official Channel</span>
              <ExternalLink className="w-3.5 h-3.5 ml-1" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {videosList.map((video) => {
              const isSelected = video.id === activeVideo.id;
              return (
                <div
                  key={video.id}
                  onClick={() => {
                    setActiveVideo(video);
                    window.scrollTo({ top: 400, behavior: 'smooth' });
                  }}
                  className={`rounded-2xl overflow-hidden cursor-pointer border transition-all duration-300 flex flex-col group ${
                    isSelected
                      ? 'border-[#0B1B3D] bg-navy-50/70 shadow-md ring-2 ring-[#0B1B3D]/20'
                      : 'border-stone-200 bg-white hover:border-amber-400 hover:shadow-md'
                  }`}
                >
                  <div className="relative h-48 bg-black overflow-hidden">
                    <img
                      src={video.poster}
                      alt={video.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                    />
                    <div className="absolute inset-0 bg-navy-950/40 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-amber-500/90 group-hover:bg-amber-500 flex items-center justify-center text-white transition-all transform group-hover:scale-110 shadow-lg">
                        <Play className="w-5 h-5 fill-current ml-0.5" />
                      </div>
                    </div>
                    <div className="absolute top-3 left-3 px-2 py-0.5 rounded bg-black/80 text-amber-300 font-mono text-[11px] font-bold uppercase">
                      {video.category}
                    </div>
                  </div>

                  <div className="p-5 flex-grow flex flex-col justify-between">
                    <div>
                      <h4 className="text-base font-display font-bold text-[#0B1B3D] group-hover:text-amber-700 transition-colors line-clamp-1">
                        {video.title}
                      </h4>
                      <p className="text-xs text-slate-600 line-clamp-2 mt-2 leading-relaxed">
                        {video.description}
                      </p>
                    </div>

                    <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between text-xs text-slate-500">
                      <span>{video.duration}</span>
                      <span className="text-amber-700 font-semibold group-hover:text-amber-800">
                        {isSelected ? 'Now Playing' : 'Click to Play →'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA - Deep Navy Banner */}
      <section className="py-16 bg-[#0B1B3D] text-center text-white">
        <div className="max-w-4xl mx-auto px-4">
          <h3 className="text-2xl font-display font-bold text-white mb-2">
            Experience the Physical Discipline In Person
          </h3>
          <p className="text-xs text-slate-300 max-w-xl mx-auto leading-relaxed mb-6">
            Video recordings only show a glimpse. Real mastery requires continuous hands-on instruction in George Town.
          </p>
          <Link
            to="/join-training"
            className="px-6 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs uppercase tracking-wider transition-colors shadow-md"
          >
            Submit Training Enquiry →
          </Link>
        </div>
      </section>
    </div>
  );
};
