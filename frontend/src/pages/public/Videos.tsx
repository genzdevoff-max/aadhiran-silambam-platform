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
    <div className="bg-charcoal-950 text-gray-200">
      {/* Header Banner */}
      <section className="relative py-24 bg-gradient-to-b from-charcoal-900 to-charcoal-950 border-b border-charcoal-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-crimson-950 border border-crimson-700/60 text-gold-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <Film className="w-3.5 h-3.5 text-crimson-500" />
            <span>Living Motion Archives</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-display font-extrabold text-white tracking-tight">
            Videos & Media Vault
          </h1>
          <p className="mt-3 text-lg font-display text-gold-400 font-semibold tracking-wide">
            காணொளி தொகுப்பு • Authentic Footwork, Twirling & Documentary Footage
          </p>
          <div className="flex items-center justify-center space-x-2 text-xs text-gray-400 mt-4">
            <Link to="/" className="hover:text-gold-400">Home</Link>
            <span>/</span>
            <span className="text-gray-300">Videos & Media</span>
          </div>
        </div>
      </section>

      {/* Featured Video Player */}
      <section className="py-16 border-b border-charcoal-800 bg-charcoal-900/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl overflow-hidden bg-black border border-charcoal-800 shadow-2xl">
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
            <div className="p-8 bg-charcoal-950 border-t border-charcoal-800 flex flex-col md:flex-row justify-between items-start gap-6">
              <div className="space-y-2 max-w-3xl">
                <div className="flex items-center space-x-3">
                  <span className="px-3 py-0.5 rounded bg-crimson-600 text-white font-mono text-xs font-bold uppercase">
                    {activeVideo.category}
                  </span>
                  <span className="text-xs font-mono text-gold-400">
                    {activeVideo.duration}
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-display font-bold text-white">
                  {activeVideo.title}
                </h2>
                {activeVideo.tamil_title && (
                  <p className="text-sm font-mono text-gold-400">
                    {activeVideo.tamil_title}
                  </p>
                )}
                <p className="text-sm text-gray-400 leading-relaxed pt-2">
                  {activeVideo.description}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
                <Link
                  to="/join-training"
                  className="px-6 py-3 rounded-xl bg-crimson-600 hover:bg-crimson-500 text-white font-semibold text-xs tracking-wider uppercase transition-colors shadow-md shadow-crimson-900/50"
                >
                  Learn This Discipline →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Video Playlist Grid */}
      <section className="py-20 border-b border-charcoal-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <span className="text-xs uppercase font-bold text-crimson-500 tracking-widest">
                Curated Reel
              </span>
              <h3 className="text-2xl sm:text-3xl font-display font-bold text-white mt-1">
                Authentic Video Reel
              </h3>
            </div>
            <a
              href="https://youtube.com/@aadhiransilambam"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-xs font-semibold text-gold-400 hover:text-gold-300"
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
                      ? 'border-crimson-500 bg-charcoal-900 shadow-glow-crimson'
                      : 'border-charcoal-800 bg-charcoal-900/80 hover:border-charcoal-700 hover:bg-charcoal-850'
                  }`}
                >
                  <div className="relative h-48 bg-black overflow-hidden">
                    <img
                      src={video.poster}
                      alt={video.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                    />
                    <div className="absolute inset-0 bg-charcoal-950/40 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-crimson-600/80 group-hover:bg-crimson-600 flex items-center justify-center text-white transition-all transform group-hover:scale-110 shadow-lg">
                        <Play className="w-5 h-5 fill-current ml-0.5" />
                      </div>
                    </div>
                    <div className="absolute top-3 left-3 px-2 py-0.5 rounded bg-charcoal-950/80 text-gold-400 font-mono text-[11px] font-bold uppercase">
                      {video.category}
                    </div>
                  </div>

                  <div className="p-5 flex-grow flex flex-col justify-between">
                    <div>
                      <h4 className="text-base font-display font-bold text-white group-hover:text-gold-300 transition-colors line-clamp-1">
                        {video.title}
                      </h4>
                      <p className="text-xs text-gray-400 line-clamp-2 mt-2 leading-relaxed">
                        {video.description}
                      </p>
                    </div>

                    <div className="pt-4 mt-4 border-t border-charcoal-800 flex items-center justify-between text-xs text-gray-500">
                      <span>{video.duration}</span>
                      <span className="text-crimson-400 font-semibold group-hover:text-gold-400">
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

      {/* CTA */}
      <section className="py-16 bg-charcoal-950 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h3 className="text-2xl font-display font-bold text-white mb-2">
            Experience the Physical Discipline In Person
          </h3>
          <p className="text-xs text-gray-400 max-w-xl mx-auto leading-relaxed mb-6">
            Video recordings only show a glimpse. Real mastery requires continuous hands-on instruction in George Town.
          </p>
          <Link
            to="/join-training"
            className="px-6 py-2.5 rounded-lg bg-crimson-600 hover:bg-crimson-500 text-white font-semibold text-xs uppercase tracking-wider transition-colors shadow-md shadow-crimson-900/40"
          >
            Submit Training Enquiry →
          </Link>
        </div>
      </section>
    </div>
  );
};
