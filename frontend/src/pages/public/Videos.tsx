import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Play,
  Film,
  ExternalLink,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { videosList } from '../../data';
import type { AuthenticVideo } from '../../data';
import { publicApi } from '../../services/api';

export const Videos: React.FC = () => {
  const [videos, setVideos] = useState<AuthenticVideo[]>(videosList);
  const [activeVideo, setActiveVideo] = useState<AuthenticVideo>(videosList[0]);

  useEffect(() => {
    publicApi
      .getVideos()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const mapped: AuthenticVideo[] = data.map((v: any) => ({
            id: v.id,
            title: v.title,
            tamil_title: v.tamil_title,
            src: v.videoUrl || v.src || '',
            poster: v.thumbnailUrl || v.poster || '/api/public/media/stream/silambam/silambam-back.jpg',
            category: v.category || 'Feature',
            duration: v.duration || 'Video',
            description: v.description || '',
          }));
          setVideos(mapped);
          if (mapped[0]) setActiveVideo(mapped[0]);
        }
      })
      .catch((err) => {
        console.warn('Using static videos fallback:', err?.message || err);
      });
  }, []);

  return (
    <div className="bg-[#FDFBF7] text-[#182332] min-h-screen">
      {/* Header Banner - Heritage Navy */}
      <section className="relative py-20 sm:py-24 bg-[#102137] text-white overflow-hidden border-b border-[#C6A04A]/30">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#C6A04A_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#183B5B] border border-[#C6A04A]/40 text-[#D9B96E] text-xs font-semibold uppercase tracking-wider mb-4 shadow-xs">
            <Film className="w-3.5 h-3.5 text-[#C6A04A] shrink-0" />
            <span>Living Motion Archives</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight">
            Videos & Media Vault
          </h1>
          <p className="mt-3 text-lg font-semibold text-[#D9B96E] tracking-wide">
            காணொளி தொகுப்பு • Authentic Footwork, Twirling & Documentary Footage
          </p>
          <div className="flex items-center justify-center space-x-2 text-xs text-slate-300 mt-4 font-medium">
            <Link to="/" className="hover:text-[#D9B96E] transition-colors">Home</Link>
            <span>/</span>
            <span className="text-[#D9B96E]">Videos & Media</span>
          </div>
        </div>
      </section>

      {/* Featured Video Player */}
      <section className="py-16 border-b border-[#E8E3D9] bg-[#F8F5EE]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl overflow-hidden bg-[#102137] border border-[#C6A04A]/30 shadow-xl">
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
            <div className="p-6 sm:p-8 bg-[#102137] border-t border-[#C6A04A]/20 flex flex-col md:flex-row justify-between items-start gap-6 text-white">
              <div className="space-y-2 max-w-3xl">
                <div className="flex items-center space-x-3">
                  <span className="px-3 py-0.5 rounded-full bg-[#183B5B] text-[#D9B96E] border border-[#C6A04A]/40 text-xs font-semibold uppercase">
                    {activeVideo.category}
                  </span>
                  <span className="text-xs text-slate-300 font-mono">
                    {activeVideo.duration}
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white">
                  {activeVideo.title}
                </h2>
                {activeVideo.tamil_title && (
                  <p className="text-sm text-[#D9B96E] font-medium">
                    {activeVideo.tamil_title}
                  </p>
                )}
                <p className="text-sm text-slate-300 leading-relaxed pt-2">
                  {activeVideo.description}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                <Link
                  to="/join-training"
                  className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-[#C6A04A] hover:bg-[#D9B96E] text-[#102137] font-semibold text-xs tracking-wider uppercase transition-all shadow-sm"
                >
                  <span>Learn This Discipline</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Video Playlist Grid */}
      <section className="py-20 border-b border-[#E8E3D9] bg-[#FDFBF7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <Sparkles className="w-4 h-4 text-[#C6A04A]" />
                <span className="text-xs uppercase font-bold text-[#102137] tracking-widest">
                  Curated Reel
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-[#182332]">
                Authentic Video Reel
              </h3>
            </div>
            <a
              href="https://youtube.com/@aadhiransilambam"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-xs font-semibold text-[#102137] hover:text-[#183B5B] transition-colors"
            >
              <span>Visit Official Channel</span>
              <ExternalLink className="w-3.5 h-3.5 ml-1 shrink-0 text-[#C6A04A]" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {videos.map((video) => {
              const isSelected = video.id === activeVideo.id;
              return (
                <div
                  key={video.id}
                  onClick={() => {
                    setActiveVideo(video);
                    window.scrollTo({ top: 380, behavior: 'smooth' });
                  }}
                  className={`rounded-2xl overflow-hidden cursor-pointer border transition-all duration-300 flex flex-col group ${
                    isSelected
                      ? 'border-[#C6A04A] bg-[#F8F5EE] shadow-md ring-2 ring-[#C6A04A]/30'
                      : 'border-[#E8E3D9] bg-white hover:border-[#C6A04A] hover:shadow-md'
                  }`}
                >
                  <div className="relative h-48 bg-slate-900 overflow-hidden">
                    <img
                      src={video.poster}
                      alt={video.title}
                      width={400}
                      height={192}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-85"
                      onError={(e) => {
                        const t = e.currentTarget;
                        t.onerror = null;
                        t.src = '/uploads/silambam-back.jpg';
                      }}
                    />
                    <div className="absolute inset-0 bg-[#102137]/40 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-[#102137]/90 group-hover:bg-[#C6A04A] flex items-center justify-center text-[#D9B96E] group-hover:text-[#102137] transition-all transform group-hover:scale-110 shadow-lg border border-[#C6A04A]/50">
                        <Play className="w-5 h-5 fill-current ml-0.5 shrink-0" />
                      </div>
                    </div>
                    <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-[#102137]/90 text-[#D9B96E] border border-[#C6A04A]/40 text-[11px] font-semibold uppercase">
                      {video.category}
                    </div>
                  </div>

                  <div className="p-5 grow flex flex-col justify-between">
                    <div>
                      <h4 className="text-base font-bold text-[#182332] group-hover:text-[#183B5B] transition-colors line-clamp-1">
                        {video.title}
                      </h4>
                      <p className="text-xs text-[#64748B] line-clamp-2 mt-2 leading-relaxed">
                        {video.description}
                      </p>
                    </div>

                    <div className="pt-4 mt-4 border-t border-[#E8E3D9] flex items-center justify-between text-xs text-[#64748B]">
                      <span className="font-mono">{video.duration}</span>
                      <span className="text-[#102137] font-semibold group-hover:text-[#183B5B]">
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

      {/* CTA - Heritage Navy Section */}
      <section className="py-16 bg-[#102137] border-t border-[#C6A04A]/30 text-center text-white">
        <div className="max-w-4xl mx-auto px-4">
          <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            Experience the Physical Discipline In Person
          </h3>
          <p className="text-sm text-slate-300 max-w-xl mx-auto leading-relaxed mb-6 font-normal">
            Video recordings only show a glimpse. Real mastery requires continuous hands-on instruction in George Town.
          </p>
          <Link
            to="/join-training"
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-[#C6A04A] hover:bg-[#D9B96E] text-[#102137] font-semibold text-xs uppercase tracking-wider transition-all shadow-sm"
          >
            <span>Submit Training Enquiry</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
};
