import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Camera,
  Folder,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react';
import { mediaAssetsList, galleryAlbums } from '../../data';
import type { MediaAsset } from '../../types';

export const Gallery: React.FC = () => {
  const [selectedAlbum, setSelectedAlbum] = useState<string>('all');
  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null);

  const displayPhotos: MediaAsset[] = selectedAlbum === 'all'
    ? mediaAssetsList
    : mediaAssetsList.filter(
        (p) => p.album_id === selectedAlbum || p.album_title?.toLowerCase() === selectedAlbum.toLowerCase()
      );

  const activePhoto = activePhotoIndex !== null ? displayPhotos[activePhotoIndex] : null;

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (activePhotoIndex === null) return;
    if (e.key === 'Escape') setActivePhotoIndex(null);
    if (e.key === 'ArrowLeft') {
      setActivePhotoIndex((prev) => (prev! > 0 ? prev! - 1 : displayPhotos.length - 1));
    }
    if (e.key === 'ArrowRight') {
      setActivePhotoIndex((prev) => (prev! < displayPhotos.length - 1 ? prev! + 1 : 0));
    }
  }, [activePhotoIndex, displayPhotos.length]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="bg-[#090b0f] text-gray-200">
      {/* 1. Header Banner */}
      <section className="relative py-20 sm:py-28 bg-gradient-to-b from-[#0e121a] via-[#090b0f] to-[#090b0f] border-b border-charcoal-800/80 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-900/15 via-transparent to-transparent opacity-60" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-charcoal-900/90 border border-gold-500/30 text-gold-300 text-xs font-semibold uppercase tracking-wider mb-5 backdrop-blur-md">
            <Camera className="w-3.5 h-3.5 text-gold-400" />
            <span>Living Photographic Archives</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-extrabold text-white tracking-tight">
            Photo Gallery & Albums
          </h1>
          <p className="mt-3 text-lg sm:text-xl font-display text-gold-300 font-medium tracking-wide">
            புகைப்பட தொகுப்பு <span className="text-gray-500 font-sans mx-2">•</span> Rare Archival Records from 1936 to Present Day
          </p>

          <p className="mt-4 max-w-2xl mx-auto text-sm sm:text-base text-gray-300 leading-relaxed font-normal">
            Visual chronicle of ancient Tamil martial arts preservation in George Town, Penang — featuring historical grandmasters, weapon demonstrations, and UNESCO cultural showcases.
          </p>

          <div className="flex items-center justify-center space-x-2 text-xs text-gray-400 mt-6">
            <Link to="/" className="hover:text-gold-300 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-gray-300">Photo Gallery</span>
          </div>
        </div>
      </section>

      {/* 2. Visual Album Overview Cards */}
      <section className="py-12 bg-[#0c0f16] border-b border-charcoal-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xs uppercase font-bold text-gold-400 tracking-wider">
              Featured Archival Collections
            </h3>
            <span className="text-xs text-gray-500 font-mono">
              {galleryAlbums.length} Curated Albums
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {galleryAlbums.map((album) => {
              const isSelected = selectedAlbum === album.id;
              return (
                <button
                  key={album.id}
                  onClick={() => {
                    setSelectedAlbum(album.id);
                    setActivePhotoIndex(null);
                  }}
                  className={`text-left p-4 rounded-xl border transition-all duration-300 group flex flex-col justify-between ${
                    isSelected
                      ? 'bg-crimson-950/80 border-gold-500/50 shadow-lg shadow-crimson-950/80'
                      : 'bg-charcoal-900/60 border-charcoal-800 hover:border-gold-500/30 hover:bg-charcoal-850'
                  }`}
                >
                  <div className="relative h-32 w-full rounded-lg overflow-hidden mb-3 bg-charcoal-950">
                    <img
                      src={album.cover_photo || '/uploads/mariapaqiam4.png'}
                      alt={album.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/90 via-transparent to-transparent" />
                    <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/80 text-[10px] font-mono text-gold-400">
                      {album.photo_count} Photos
                    </span>
                  </div>
                  <div>
                    <h4 className={`text-sm font-display font-bold mb-1 transition-colors ${
                      isSelected ? 'text-gold-300' : 'text-white group-hover:text-gold-300'
                    }`}>
                      {album.title}
                    </h4>
                    <p className="text-[11px] text-gray-400 line-clamp-2 leading-relaxed">
                      {album.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. Filter Bar */}
      <section className="py-4 bg-[#090b0f]/90 border-b border-charcoal-800/80 sticky top-[65px] z-30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-2 text-xs font-semibold text-gray-300 uppercase tracking-wider">
            <Folder className="w-3.5 h-3.5 text-gold-400" />
            <span>Filter Archives:</span>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => {
                setSelectedAlbum('all');
                setActivePhotoIndex(null);
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedAlbum === 'all'
                  ? 'bg-crimson-800 text-white border border-gold-500/40 shadow'
                  : 'bg-charcoal-900 text-gray-400 border border-charcoal-800 hover:text-white'
              }`}
            >
              All Archival Photos ({mediaAssetsList.length})
            </button>
            {galleryAlbums.map((album) => (
              <button
                key={album.id}
                onClick={() => {
                  setSelectedAlbum(album.id);
                  setActivePhotoIndex(null);
                }}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedAlbum === album.id
                    ? 'bg-crimson-800 text-white border border-gold-500/40 shadow'
                    : 'bg-charcoal-900 text-gray-400 border border-charcoal-800 hover:text-white'
                }`}
              >
                {album.title.split('(')[0]}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Photographic Grid */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {displayPhotos.map((photo, index) => (
              <div
                key={photo.id || index}
                onClick={() => setActivePhotoIndex(index)}
                className="group relative rounded-xl overflow-hidden bg-charcoal-900 border border-charcoal-800 hover:border-gold-500/40 cursor-pointer transition-all duration-300 shadow-lg flex flex-col"
              >
                <div className="relative aspect-4/3 w-full overflow-hidden bg-charcoal-950">
                  <img
                    src={photo.file_path}
                    alt={photo.alt_text || photo.original_name}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="absolute top-2.5 right-2.5 w-8 h-8 rounded-lg bg-black/60 backdrop-blur-sm border border-charcoal-700 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-gold-400">
                    <Maximize2 className="w-4 h-4" />
                  </div>
                </div>

                <div className="p-3.5 bg-charcoal-900 flex-grow flex flex-col justify-between">
                  <p className="text-xs font-semibold text-white group-hover:text-gold-300 transition-colors line-clamp-1">
                    {photo.caption || photo.original_name}
                  </p>
                  <p className="text-[11px] text-gray-500 font-mono mt-1">
                    {photo.album_title || 'Aadhiran Archives'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Cinema-Grade Archival Lightbox Modal */}
      {activePhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-5xl bg-[#0c0f16] border border-charcoal-700/80 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
            {/* Header */}
            <div className="p-4 bg-[#090b0f] border-b border-charcoal-800 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-mono font-semibold uppercase text-gold-400 tracking-wider block">
                  {activePhoto.album_title || 'Historic Archival Photography'}
                </span>
                <h3 className="text-base sm:text-lg font-display font-bold text-white">
                  {activePhoto.caption || activePhoto.original_name}
                </h3>
              </div>

              <div className="flex items-center space-x-3">
                <span className="text-xs font-mono text-gray-400 hidden sm:inline-block">
                  {activePhotoIndex! + 1} / {displayPhotos.length}
                </span>
                <button
                  onClick={() => setActivePhotoIndex(null)}
                  className="p-1.5 rounded-lg bg-charcoal-800 hover:bg-charcoal-700 text-gray-300 hover:text-white transition-colors"
                  aria-label="Close photo modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Main Image Stage */}
            <div className="relative flex-grow flex items-center justify-center bg-black p-2 sm:p-6 min-h-[350px] overflow-hidden">
              <img
                src={activePhoto.file_path}
                alt={activePhoto.alt_text || activePhoto.original_name}
                className="max-h-[65vh] w-auto max-w-full object-contain rounded-lg shadow-2xl"
              />

              {/* Prev / Next overlay arrows */}
              <button
                onClick={() =>
                  setActivePhotoIndex((prev) => (prev! > 0 ? prev! - 1 : displayPhotos.length - 1))
                }
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 text-white border border-charcoal-700 flex items-center justify-center transition-colors"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                onClick={() =>
                  setActivePhotoIndex((prev) => (prev! < displayPhotos.length - 1 ? prev! + 1 : 0))
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 text-white border border-charcoal-700 flex items-center justify-center transition-colors"
                aria-label="Next image"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Footer Metadata */}
            <div className="p-4 bg-[#090b0f] border-t border-charcoal-800 text-xs text-gray-400 flex flex-wrap items-center justify-between gap-3">
              <span className="text-gray-300">
                {activePhoto.alt_text || 'Preserved in the living heritage archive of George Town, Penang.'}
              </span>
              <div className="flex items-center space-x-3 text-[11px] font-mono text-gray-500">
                <span>Use ← / → keys to navigate</span>
                <span>•</span>
                <span>ESC to close</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
