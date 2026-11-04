import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Play, Sparkles } from 'lucide-react';

export interface HeroSlide {
  id: string;
  image: string;
  title: string;
  tag: string;
  caption: string;
  technique: string;
}

const DEFAULT_SLIDES: HeroSlide[] = [
  {
    id: 'slide-1',
    image: '/api/public/media/stream/silambam/30f575ff-d7dd-45ca-b024-2d3ec970d369.jpg',
    tag: 'MARTIAL EXCELLENCE',
    title: 'Traditional Bamboo Staff Mastery',
    technique: 'Kaaladi Varisai & Kambu Veechu',
    caption: 'Authentic 5,000-year Kurunji mountain martial art taught in George Town since 1936.',
  },
  {
    id: 'slide-2',
    image: '/api/public/media/stream/silambam/b417be8b-6b26-4914-848f-fdc546a2abd2.jpg',
    tag: 'WARRIOR DYNAMICS',
    title: 'High-Velocity Rotational Twirling',
    technique: 'Continuous Dynamic Spins',
    caption: 'Preserving centripetal staff mechanics and wrist velocity conditioning.',
  },
  {
    id: 'slide-3',
    image: '/api/public/media/stream/silambam/55f38e6f-21d5-4a62-a178-d3921baa25fd.jpg',
    tag: 'SACRED FOOTWORK',
    title: '18-Step Kaaladi Groundwork',
    technique: 'Triangular Evasive Stances',
    caption: 'Earth-grounded combat positioning modeled after tiger and serpent kinematics.',
  },
  {
    id: 'slide-4',
    image: '/api/public/media/stream/silambam/cde7d1f2-37ec-4367-9130-16a957c6bb2e.jpg',
    tag: 'POR SILAMBAM',
    title: 'Battlefield Combat Interception',
    technique: 'Pirivu Thaduppu Deflections',
    caption: 'Direct lineage transmission of battlefield deflection and joint-lock disarmament.',
  },
  {
    id: 'slide-5',
    image: '/api/public/media/stream/silambam/a72ec070-df9c-4566-affb-94b54dd51b14.jpg',
    tag: 'LIVING HERITAGE',
    title: 'UNESCO Recognized Living Heritage',
    technique: 'Intangible Cultural Treasure',
    caption: 'Certified by Malaysia Book of Records (2022) as Malaysia’s oldest Silambam association.',
  },
];

interface HeroSliderProps {
  slides?: HeroSlide[];
  onWatchVideo?: () => void;
  bgImageOverride?: string;
}

export const HeroSlider: React.FC<HeroSliderProps> = ({
  slides = DEFAULT_SLIDES,
  onWatchVideo,
  bgImageOverride,
}) => {
  // If a custom background image is provided from CMS, ensure it appears as slide 0
  const activeSlides = React.useMemo(() => {
    if (bgImageOverride && !slides.some((s) => s.image === bgImageOverride)) {
      return [
        {
          id: 'cms-bg',
          image: bgImageOverride,
          tag: 'FEATURED DISCIPLINE',
          title: 'Authentic Silambam Instruction',
          technique: '10-Stage Traditional Syllabus',
          caption: 'Living Tamil martial heritage preserved in George Town, Penang.',
        },
        ...slides,
      ];
    }
    return slides;
  }, [slides, bgImageOverride]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Touch gesture tracking for mobile swipe
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % activeSlides.length);
  }, [activeSlides.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + activeSlides.length) % activeSlides.length);
  }, [activeSlides.length]);

  // Autoplay with 5500ms interval
  useEffect(() => {
    if (isPaused) return;
    timerRef.current = setInterval(nextSlide, 5500);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, nextSlide]);

  // Preload next image for instant transitions
  useEffect(() => {
    const nextIdx = (currentIndex + 1) % activeSlides.length;
    if (activeSlides[nextIdx]) {
      const img = new Image();
      img.src = activeSlides[nextIdx].image;
    }
  }, [currentIndex, activeSlides]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsPaused(true);
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    setIsPaused(false);
    if (touchStartX.current !== null && touchEndX.current !== null) {
      const distance = touchStartX.current - touchEndX.current;
      // Minimum swipe threshold 45px
      if (distance > 45) {
        nextSlide();
      } else if (distance < -45) {
        prevSlide();
      }
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      prevSlide();
    } else if (e.key === 'ArrowRight') {
      nextSlide();
    }
  };

  const currentSlide = activeSlides[currentIndex] || activeSlides[0];

  return (
    <div
      tabIndex={0}
      role="region"
      aria-label="Silambam action photo showcase"
      onKeyDown={handleKeyDown}
      className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden border border-[#C6A04A]/30 bg-[#102137] shadow-2xl group select-none outline-none focus:ring-2 focus:ring-[#C6A04A]/50"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Slider Visual Viewport */}
      <div className="relative aspect-[4/3] sm:aspect-[16/11] lg:aspect-[4/3] xl:aspect-[16/11] min-h-[320px] sm:min-h-[400px] lg:min-h-[460px] w-full overflow-hidden bg-[#102137]">
        {activeSlides.map((slide, idx) => {
          const isActive = idx === currentIndex;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              <img
                src={slide.image}
                alt={slide.title}
                className={`w-full h-full object-cover object-center filter brightness-[0.93] contrast-[1.05] transition-transform duration-[6000ms] ease-out ${
                  isActive ? 'scale-105' : 'scale-100'
                }`}
                loading={idx === 0 ? 'eager' : 'lazy'}
              />
              {/* Refined Ambient Navy Gradients for readable overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#102137] via-[#102137]/35 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#102137]/50 via-transparent to-[#102137]/30" />
            </div>
          );
        })}

        {/* Top-Left Technique Pill Badge & Watch Reel CTA */}
        <div className="absolute top-4 left-4 z-20 flex items-center space-x-2">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#102137]/90 backdrop-blur-md border border-[#C6A04A]/50 text-[#D9B96E] text-[11px] font-bold uppercase tracking-wider shadow-md">
            <Sparkles className="w-3 h-3 text-[#C6A04A] shrink-0" />
            <span>{currentSlide.tag}</span>
          </div>
          {onWatchVideo && (
            <button
              onClick={onWatchVideo}
              aria-label="Watch Silambam demonstration reel"
              className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#183B5B]/90 hover:bg-[#C6A04A] hover:text-[#102137] text-white text-[11px] font-semibold tracking-wide backdrop-blur-md border border-white/20 transition-all shadow-md group/btn cursor-pointer"
            >
              <Play className="w-3 h-3 text-[#C6A04A] group-hover/btn:text-[#102137] fill-current shrink-0" />
              <span>Watch Reel</span>
            </button>
          )}
        </div>

        {/* Top-Right Watermark Label (ISF Inspired) */}
        <div className="absolute top-4 right-4 z-20 hidden sm:inline-flex items-center px-2.5 py-1 rounded-md bg-[#102137]/75 backdrop-blur-xs border border-white/10 text-[10px] font-mono uppercase tracking-widest text-slate-300">
          Photo {currentIndex + 1} of {activeSlides.length}
        </div>

        {/* Bottom Slide Info Overlay */}
        <div className="absolute bottom-0 inset-x-0 z-20 p-4 sm:p-6 bg-gradient-to-t from-[#102137] via-[#102137]/85 to-transparent">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div className="max-w-md">
              <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-[#D9B96E] block mb-0.5">
                {currentSlide.technique}
              </span>
              <h3 className="text-base sm:text-lg lg:text-xl font-bold text-white leading-tight drop-shadow-sm">
                {currentSlide.title}
              </h3>
              <p className="text-xs text-slate-200 line-clamp-2 mt-1 drop-shadow-xs hidden sm:block">
                {currentSlide.caption}
              </p>
            </div>

            {/* Slider Navigation Controls (ISF Inspired Arrow Control Group) */}
            <div className="flex items-center space-x-2 shrink-0 self-end">
              <button
                onClick={prevSlide}
                aria-label="Previous photograph"
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#183B5B]/90 hover:bg-[#C6A04A] hover:text-[#102137] text-white border border-[#C6A04A]/40 flex items-center justify-center transition-all duration-200 shadow-md active:scale-95 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <button
                onClick={nextSlide}
                aria-label="Next photograph"
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#C6A04A] hover:bg-[#D9B96E] text-[#102137] border border-[#C6A04A] flex items-center justify-center transition-all duration-200 shadow-md active:scale-95 cursor-pointer font-bold"
              >
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>

          {/* Pagination Indicators Bar */}
          <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/10">
            <div className="flex items-center space-x-1.5">
              {activeSlides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                    idx === currentIndex
                      ? 'w-7 bg-[#C6A04A]'
                      : 'w-2 bg-white/30 hover:bg-white/60'
                  }`}
                />
              ))}
            </div>
            <div className="text-[10px] font-mono text-slate-300 tracking-wider">
              <span className="text-[#D9B96E] font-bold">0{currentIndex + 1}</span> / 0{activeSlides.length}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
