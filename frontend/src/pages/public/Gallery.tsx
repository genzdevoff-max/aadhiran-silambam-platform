import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Camera,
  Folder,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  X,
  Sparkles
} from 'lucide-react';
import { mediaAssetsList, galleryAlbums } from '../../data';
import { publicApi } from '../../services/api';
import type { MediaAsset } from '../../types';

export const Gallery: React.FC = () => {
  const [albums, setAlbums] = useState<any[]>(galleryAlbums);
  const [photos, setPhotos] = useState<MediaAsset[]>(mediaAssetsList);
  const [selectedAlbum, setSelectedAlbum] = useState<string>('all');
  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null);

  useEffect(() => {
    publicApi
      .getAlbums()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setAlbums(data);
        }
      })
      .catch((err) => console.warn('Using static albums fallback:', err?.message || err));

    publicApi
      .getPhotos()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setPhotos(data);
        }
      })
      .catch((err) => console.warn('Using static photos fallback:', err?.message || err));
  }, []);

  const displayPhotos: MediaAsset[] = selectedAlbum === 'all'
    ? photos
    : photos.filter(
        (p) => p.album_id === selectedAlbum || p.album_slug === selectedAlbum || p.album_title?.toLowerCase() === selectedAlbum.toLowerCase()
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
    <div className="bg-[#FDFBF7] text-[#182332] min-h-screen">
      {/* 1. Header Banner - Heritage Navy */}
      <section className="relative py-20 sm:py-24 bg-[#102137] text-white overflow-hidden border-b border-[#C6A04A]/30">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#C6A04A_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#183B5B] border border-[#C6A04A]/40 text-[#D9B96E] text-xs font-semibold uppercase tracking-wider mb-5 shadow-xs">
            <Camera className="w-3.5 h-3.5 text-[#C6A04A] shrink-0" />
            <span>Living Photographic Archives</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight">
            Photo Gallery & Albums
          </h1>
          <p className="mt-3 text-lg sm:text-xl text-[#D9B96E] font-medium tracking-wide">
            புகைப்பட தொகுப்பு <span className="text-slate-400 mx-2">•</span> Rare Archival Records from 1936 to Present Day
          </p>

          <p className="mt-4 max-w-2xl mx-auto text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
            Visual chronicle of ancient Tamil martial arts preservation in George Town, Penang — featuring historical grandmasters, weapon demonstrations, and UNESCO cultural showcases.
          </p>

          <div className="flex items-center justify-center space-x-2 text-xs text-slate-300 mt-6 font-medium">
            <Link to="/" className="hover:text-[#D9B96E] transition-colors">Home</Link>
            <span>/</span>
            <span className="text-[#D9B96E]">Photo Gallery</span>
          </div>
        </div>
      </section>

      {/* 2. Visual Album Overview Cards */}
      <section className="py-12 bg-white border-b border-[#E8E3D9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-[#C6A04A]" />
              <h3 className="text-xs uppercase font-bold text-[#102137] tracking-wider">
                Featured Archival Collections
              </h3>
            </div>
            <span className="text-xs text-[#64748B] font-medium">
              {albums.length} Curated Albums
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {albums.map((album) => {
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
                      ? 'bg-[#F8F5EE] border-[#C6A04A] ring-2 ring-[#C6A04A]/30 shadow-md'
                      : 'bg-[#FDFBF7] border-[#E8E3D9] hover:border-[#C6A04A] hover:bg-white hover:shadow-sm'
                  }`}
                >
                  <div className="relative h-36 w-full rounded-lg overflow-hidden mb-3 bg-slate-100 border border-[#E8E3D9]">
                    <img
                      src={album.cover_photo || '/api/public/media/stream/silambam/mariapaqiam4.png'}
                      alt={album.title}
                      width={300}
                      height={144}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        const t = e.currentTarget;
                        t.onerror = null;
                        t.src = '/uploads/silambam-back.jpg';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#102137]/80 via-transparent to-transparent" />
                    <span className="absolute bottom-2 left-2 px-2.5 py-0.5 rounded-full bg-[#102137]/90 text-[10px] font-semibold text-[#D9B96E] border border-[#C6A04A]/40">
                      {album.photo_count || 0} Photos
                    </span>
                  </div>
                  <div>
                    <h4 className={`text-sm font-bold mb-1 transition-colors ${
                      isSelected ? 'text-[#102137]' : 'text-[#182332] group-hover:text-[#183B5B]'
                    }`}>
                      {album.title}
                    </h4>
                    <p className="text-xs text-[#64748B] line-clamp-2 leading-relaxed">
                      {album.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. Filter Bar - Sticky */}
      <section className="py-4 bg-[#F8F5EE]/95 border-b border-[#E8E3D9] sticky top-[65px] z-30 backdrop-blur-md shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-2 text-xs font-semibold text-[#182332] uppercase tracking-wider">
            <Folder className="w-3.5 h-3.5 text-[#C6A04A] shrink-0" />
            <span>Filter Archives:</span>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => {
                setSelectedAlbum('all');
                setActivePhotoIndex(null);
              }}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                selectedAlbum === 'all'
                  ? 'bg-[#102137] text-white shadow-xs border border-[#C6A04A]/50'
                  : 'bg-white text-[#182332] border border-[#E8E3D9] hover:bg-[#FDFBF7] hover:border-[#C6A04A]'
              }`}
            >
              All Archival Photos ({photos.length})
            </button>
            {albums.map((album) => (
              <button
                key={album.id}
                onClick={() => {
                  setSelectedAlbum(album.id);
                  setActivePhotoIndex(null);
                }}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                  selectedAlbum === album.id
                    ? 'bg-[#102137] text-white shadow-xs border border-[#C6A04A]/50'
                    : 'bg-white text-[#182332] border border-[#E8E3D9] hover:bg-[#FDFBF7] hover:border-[#C6A04A]'
                }`}
              >
                {album.title.split('(')[0]}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Photographic Grid */}
      <section className="py-16 sm:py-20 bg-[#FDFBF7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {displayPhotos.map((photo, index) => (
              <div
                key={photo.id || index}
                onClick={() => setActivePhotoIndex(index)}
                className="group relative rounded-xl overflow-hidden bg-white border border-[#E8E3D9] hover:border-[#C6A04A] cursor-pointer transition-all duration-300 shadow-xs hover:shadow-md flex flex-col"
              >
                <div className="relative aspect-4/3 w-full overflow-hidden bg-slate-100">
                  <img
                    src={photo.file_path}
                    alt={photo.alt_text || photo.original_name}
                    width={400}
                    height={300}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      const t = e.currentTarget;
                      t.onerror = null;
                      t.src = '/uploads/silambam-back.jpg';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#102137]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="absolute top-2.5 right-2.5 w-8 h-8 rounded-lg bg-[#102137]/80 backdrop-blur-sm border border-[#C6A04A]/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-[#D9B96E]">
                    <Maximize2 className="w-4 h-4" />
                  </div>
                </div>

                <div className="p-4 bg-white flex-grow flex flex-col justify-between">
                  <p className="text-xs font-semibold text-[#182332] group-hover:text-[#183B5B] transition-colors line-clamp-1">
                    {photo.caption || photo.original_name}
                  </p>
                  <p className="text-[11px] text-[#64748B] mt-1 font-medium">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#102137]/90 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-5xl bg-[#102137] border border-[#C6A04A]/40 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
            {/* Header */}
            <div className="p-4 bg-[#183B5B] border-b border-[#C6A04A]/30 flex items-center justify-between text-white">
              <div>
                <span className="text-[11px] font-semibold uppercase text-[#D9B96E] tracking-wider block">
                  {activePhoto.album_title || 'Historic Archival Photography'}
                </span>
                <h3 className="text-base sm:text-lg font-bold text-white">
                  {activePhoto.caption || activePhoto.original_name}
                </h3>
              </div>

              <div className="flex items-center space-x-3">
                <span className="text-xs text-slate-300 hidden sm:inline-block font-mono">
                  {activePhotoIndex! + 1} / {displayPhotos.length}
                </span>
                <button
                  onClick={() => setActivePhotoIndex(null)}
                  className="p-1.5 rounded-lg bg-[#102137] hover:bg-[#183B5B] border border-[#C6A04A]/30 text-slate-300 hover:text-white transition-colors"
                  aria-label="Close photo modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Main Image Stage */}
            <div className="relative flex-grow flex items-center justify-center bg-black/40 p-2 sm:p-6 min-h-[350px] overflow-hidden">
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
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#102137]/80 hover:bg-[#183B5B] text-white border border-[#C6A04A]/40 flex items-center justify-center transition-colors shadow-lg"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                onClick={() =>
                  setActivePhotoIndex((prev) => (prev! < displayPhotos.length - 1 ? prev! + 1 : 0))
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#102137]/80 hover:bg-[#183B5B] text-white border border-[#C6A04A]/40 flex items-center justify-center transition-colors shadow-lg"
                aria-label="Next image"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Footer Metadata */}
            <div className="p-4 bg-[#183B5B] border-t border-[#C6A04A]/30 text-xs text-slate-300 flex flex-wrap items-center justify-between gap-3">
              <span className="text-slate-200">
                {activePhoto.alt_text || 'Preserved in the living heritage archive of George Town, Penang.'}
              </span>
              <div className="flex items-center space-x-3 text-[11px] text-slate-300 font-mono">
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
