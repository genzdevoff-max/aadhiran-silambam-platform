import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Menu,
  X,
  ChevronDown,
  Shield,
  Phone,
  MapPin,
  Award,
  Users,
  Camera,
  Compass,
  BookOpen,
  Flame,
  ArrowRight,
  Sparkles,
  ExternalLink
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [heritageDropdown, setHeritageDropdown] = useState(false);
  const [archivesDropdown, setArchivesDropdown] = useState(false);
  const mobileMenuButtonRef = useRef<HTMLButtonElement>(null);
  const heritageButtonRef = useRef<HTMLButtonElement>(null);
  const archivesButtonRef = useRef<HTMLButtonElement>(null);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
    setHeritageDropdown(false);
    setArchivesDropdown(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!isOpen && !heritageDropdown && !archivesDropdown) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      if (isOpen) {
        setIsOpen(false);
        mobileMenuButtonRef.current?.focus();
      } else if (heritageDropdown) {
        setHeritageDropdown(false);
        heritageButtonRef.current?.focus();
      } else {
        setArchivesDropdown(false);
        archivesButtonRef.current?.focus();
      }
    };

    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [isOpen, heritageDropdown, archivesDropdown]);

  const isActive = (path: string) => location.pathname === path;
  const isHeritageActive =
    ['/about', '/history-lineage', '/history', '/instructors', '/heritage-works', '/heritage'].includes(
      location.pathname
    );
  const isArchivesActive =
    ['/gallery', '/videos', '/achievements', '/partners-press', '/partners'].includes(
      location.pathname
    );

  return (
    <header className="sticky top-0 z-50 w-full transition-all duration-300">
      {/* Top Prestige Heritage Utility Bar (Navy Heritage Tone) */}
      <div className="bg-[#0B1B3D] border-b border-[#162A56] text-[11px] text-white/90 py-2 px-4 hidden md:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-5">
            <span className="inline-flex items-center text-amber-300 font-medium tracking-wide">
              <Award className="w-3.5 h-3.5 mr-1.5 text-amber-400 flex-shrink-0" />
              Malaysia Book of Records (2022) — Oldest Silambam Association
            </span>
            <span className="text-white/30">|</span>
            <span className="flex items-center text-white/80">
              <MapPin className="w-3.5 h-3.5 mr-1 text-amber-400 flex-shrink-0" />
              Lebuh King, George Town UNESCO Heritage Zone, Penang
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <a
              href="tel:+60164147856"
              className="flex items-center text-white/90 hover:text-amber-300 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 mr-1.5 text-amber-400" />
              <span>+60 16-414 7856</span>
            </a>
            <span className="text-white/30">|</span>
            <span className="text-amber-300 font-mono text-[10px] tracking-wider uppercase font-semibold">
              PPM-014-07-25021975
            </span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar (Clean Ivory & White Heritage Theme) */}
      <nav
        className={`w-full transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-md shadow-md border-b border-stone-200/90 py-3'
            : 'bg-[#FDFBF7]/95 backdrop-blur-md border-b border-stone-200/70 py-3.5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo & Martial Arts Brand */}
          <Link to="/" className="flex items-center space-x-3.5 group">
            <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-full p-0.5 bg-gradient-to-br from-[#0B1B3D] via-amber-500 to-[#1E3A8A] shadow-sm group-hover:scale-105 transition-all flex-shrink-0">
              <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                <img
                  src="/logo.png"
                  alt="Aadhiran Silambam Association Emblem"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center space-x-2">
                <span className="font-display text-lg sm:text-xl font-extrabold tracking-wider text-[#0B1B3D]">
                  AADHIRAN
                </span>
                <span className="text-[10px] tracking-widest uppercase font-bold px-2 py-0.5 rounded bg-amber-50 border border-amber-300/80 text-amber-800">
                  EST 1975
                </span>
              </div>
              <span className="text-[11px] text-amber-800 font-medium tracking-wide">
                ஆதிரன் சிலம்ப சங்கம் <span className="text-stone-400 font-sans mx-1">•</span> Penang & Global
              </span>
            </div>
          </Link>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center space-x-1 xl:space-x-2">
            <Link
              to="/"
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-all ${
                isActive('/')
                  ? 'text-[#0B1B3D] bg-amber-100/70 font-bold border-b-2 border-amber-600'
                  : 'text-slate-700 hover:text-[#0B1B3D] hover:bg-stone-100/70'
              }`}
            >
              Home
            </Link>

            {/* 1. Lineage & Heritage Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setHeritageDropdown(true)}
              onMouseLeave={() => setHeritageDropdown(false)}
            >
              <button
                type="button"
                ref={heritageButtonRef}
                aria-expanded={heritageDropdown}
                aria-controls="heritage-navigation"
                onClick={() => setHeritageDropdown((open) => !open)}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all ${
                  isHeritageActive
                    ? 'text-[#0B1B3D] bg-amber-100/70 font-bold border-b-2 border-amber-600'
                    : 'text-slate-700 hover:text-[#0B1B3D] hover:bg-stone-100/70'
                }`}
              >
                <span>Heritage & Lineage</span>
                <ChevronDown
                  className={`w-4 h-4 ml-1 transition-transform duration-200 ${
                    heritageDropdown ? 'rotate-180 text-amber-600' : 'text-slate-400'
                  }`}
                />
              </button>

              {heritageDropdown && (
                <div id="heritage-navigation" className="absolute top-full left-0 w-72 py-2 bg-white border border-stone-200 rounded-xl shadow-xl backdrop-blur-xl animate-in fade-in duration-150">
                  <div className="px-3.5 py-1.5 mb-1 text-[10px] font-bold uppercase tracking-wider text-amber-700">
                    Living Martial Tradition
                  </div>
                  <Link
                    to="/about"
                    className="flex items-start px-3.5 py-2.5 text-sm text-slate-700 hover:text-[#0B1B3D] hover:bg-amber-50/80 rounded-lg mx-1 transition-colors"
                  >
                    <Shield className="w-4 h-4 mr-3 text-[#1E3A8A] flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-slate-900">About Aadhiran</div>
                      <div className="text-xs text-slate-500 mt-0.5">Founding history & 1975 ROS charter</div>
                    </div>
                  </Link>
                  <Link
                    to="/history-lineage"
                    className="flex items-start px-3.5 py-2.5 text-sm text-slate-700 hover:text-[#0B1B3D] hover:bg-amber-50/80 rounded-lg mx-1 transition-colors"
                  >
                    <Compass className="w-4 h-4 mr-3 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-slate-900">5,000-Year Kurunji Lineage</div>
                      <div className="text-xs text-slate-500 mt-0.5">Origins from Madurai to Penang 1936</div>
                    </div>
                  </Link>
                  <Link
                    to="/instructors"
                    className="flex items-start px-3.5 py-2.5 text-sm text-slate-700 hover:text-[#0B1B3D] hover:bg-amber-50/80 rounded-lg mx-1 transition-colors"
                  >
                    <Users className="w-4 h-4 mr-3 text-[#1E3A8A] flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-slate-900">Grandmasters & Masters</div>
                      <div className="text-xs text-slate-500 mt-0.5">Master Mariapakkiam & Chief Master Siva</div>
                    </div>
                  </Link>
                  <Link
                    to="/heritage-works"
                    className="flex items-start px-3.5 py-2.5 text-sm text-slate-700 hover:text-[#0B1B3D] hover:bg-amber-50/80 rounded-lg mx-1 transition-colors"
                  >
                    <Sparkles className="w-4 h-4 mr-3 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-slate-900">Heritage Preservation</div>
                      <div className="text-xs text-slate-500 mt-0.5">UNESCO bid & archival book projects</div>
                    </div>
                  </Link>
                </div>
              )}
            </div>

            {/* 2. 10-Stage Traditional Syllabus */}
            <Link
              to="/training-syllabus"
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all ${
                isActive('/training-syllabus')
                  ? 'text-[#0B1B3D] bg-amber-100/70 font-bold border-b-2 border-amber-600'
                  : 'text-slate-700 hover:text-[#0B1B3D] hover:bg-stone-100/70'
              }`}
            >
              <BookOpen className="w-4 h-4 mr-1.5 text-amber-600" />
              <span>10-Stage Syllabus</span>
            </Link>

            {/* 3. Archives & Media Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setArchivesDropdown(true)}
              onMouseLeave={() => setArchivesDropdown(false)}
            >
              <button
                type="button"
                ref={archivesButtonRef}
                aria-expanded={archivesDropdown}
                aria-controls="archives-navigation"
                onClick={() => setArchivesDropdown((open) => !open)}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all ${
                  isArchivesActive
                    ? 'text-[#0B1B3D] bg-amber-100/70 font-bold border-b-2 border-amber-600'
                    : 'text-slate-700 hover:text-[#0B1B3D] hover:bg-stone-100/70'
                }`}
              >
                <span>Archives & Media</span>
                <ChevronDown
                  className={`w-4 h-4 ml-1 transition-transform duration-200 ${
                    archivesDropdown ? 'rotate-180 text-amber-600' : 'text-slate-400'
                  }`}
                />
              </button>

              {archivesDropdown && (
                <div id="archives-navigation" className="absolute top-full left-0 w-72 py-2 bg-white border border-stone-200 rounded-xl shadow-xl backdrop-blur-xl animate-in fade-in duration-150">
                  <div className="px-3.5 py-1.5 mb-1 text-[10px] font-bold uppercase tracking-wider text-amber-700">
                    Documentary & Evidence
                  </div>
                  <Link
                    to="/achievements"
                    className="flex items-start px-3.5 py-2.5 text-sm text-slate-700 hover:text-[#0B1B3D] hover:bg-amber-50/80 rounded-lg mx-1 transition-colors"
                  >
                    <Award className="w-4 h-4 mr-3 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-slate-900">Achievements & MBOR</div>
                      <div className="text-xs text-slate-500 mt-0.5">Malaysia Book of Records & Citations</div>
                    </div>
                  </Link>
                  <Link
                    to="/gallery"
                    className="flex items-start px-3.5 py-2.5 text-sm text-slate-700 hover:text-[#0B1B3D] hover:bg-amber-50/80 rounded-lg mx-1 transition-colors"
                  >
                    <Camera className="w-4 h-4 mr-3 text-[#1E3A8A] flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-slate-900">Historical Photo Gallery</div>
                      <div className="text-xs text-slate-500 mt-0.5">Rare 20th century archival imagery</div>
                    </div>
                  </Link>
                  <Link
                    to="/videos"
                    className="flex items-start px-3.5 py-2.5 text-sm text-slate-700 hover:text-[#0B1B3D] hover:bg-amber-50/80 rounded-lg mx-1 transition-colors"
                  >
                    <Flame className="w-4 h-4 mr-3 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-slate-900">Documentary & Twirling Videos</div>
                      <div className="text-xs text-slate-500 mt-0.5">Master demonstrations & documentary</div>
                    </div>
                  </Link>
                  <Link
                    to="/partners-press"
                    className="flex items-start px-3.5 py-2.5 text-sm text-slate-700 hover:text-[#0B1B3D] hover:bg-amber-50/80 rounded-lg mx-1 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4 mr-3 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-slate-900">Press & Institutional Citations</div>
                      <div className="text-xs text-slate-500 mt-0.5">George Town World Heritage & media</div>
                    </div>
                  </Link>
                </div>
              )}
            </div>

            {/* 4. Events & News */}
            <Link
              to="/events"
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-all ${
                isActive('/events')
                  ? 'text-[#0B1B3D] bg-amber-100/70 font-bold border-b-2 border-amber-600'
                  : 'text-slate-700 hover:text-[#0B1B3D] hover:bg-stone-100/70'
              }`}
            >
              Events
            </Link>

            <Link
              to="/news"
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-all ${
                isActive('/news')
                  ? 'text-[#0B1B3D] bg-amber-100/70 font-bold border-b-2 border-amber-600'
                  : 'text-slate-700 hover:text-[#0B1B3D] hover:bg-stone-100/70'
              }`}
            >
              News
            </Link>

            {/* 5. Contact */}
            <Link
              to="/contact"
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-all ${
                isActive('/contact')
                  ? 'text-[#0B1B3D] bg-amber-100/70 font-bold border-b-2 border-amber-600'
                  : 'text-slate-700 hover:text-[#0B1B3D] hover:bg-stone-100/70'
              }`}
            >
              Contact
            </Link>
          </div>

          {/* Join Training CTA Button (Navy Heritage Tone with Gold Accent) */}
          <div className="hidden lg:flex items-center space-x-3">
            <Link
              to="/join-training"
              className="inline-flex items-center px-5 py-2.5 rounded-lg font-semibold text-sm text-white bg-[#0B1B3D] hover:bg-[#142C66] border border-amber-500/50 shadow-sm transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Join Training</span>
              <ArrowRight className="w-4 h-4 ml-1.5 text-amber-300" />
            </Link>
          </div>

          {/* Mobile menu trigger */}
          <div className="flex lg:hidden items-center space-x-3">
            <Link
              to="/join-training"
              className="inline-flex items-center px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-[#0B1B3D] border border-amber-400/50"
            >
              Join
            </Link>
            <button
              ref={mobileMenuButtonRef}
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-slate-700 hover:text-[#0B1B3D] bg-stone-100 border border-stone-200 focus:outline-none"
              aria-label="Toggle navigation menu"
              aria-expanded={isOpen}
              aria-controls="mobile-navigation"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isOpen && (
          <div id="mobile-navigation" className="lg:hidden border-t border-stone-200 bg-white px-4 pt-3 pb-6 space-y-1 shadow-lg animate-in slide-in-from-top-2 duration-200">
            <Link
              to="/"
              className={`block px-3 py-2 text-base font-semibold rounded-lg ${
                isActive('/') ? 'text-[#0B1B3D] bg-amber-50 font-bold' : 'text-slate-700 hover:bg-stone-50'
              }`}
            >
              Home
            </Link>

            <div className="pt-2 pb-1 border-t border-stone-100">
              <div className="px-3 text-xs font-bold uppercase tracking-wider text-amber-800">
                Heritage & Lineage
              </div>
              <Link
                to="/about"
                className="block px-3 py-1.5 text-sm text-slate-600 hover:text-[#0B1B3D] hover:bg-stone-50 rounded-lg"
              >
                About Aadhiran Association
              </Link>
              <Link
                to="/history-lineage"
                className="block px-3 py-1.5 text-sm text-slate-600 hover:text-[#0B1B3D] hover:bg-stone-50 rounded-lg"
              >
                5,000-Year Kurunji Martial Lineage
              </Link>
              <Link
                to="/instructors"
                className="block px-3 py-1.5 text-sm text-slate-600 hover:text-[#0B1B3D] hover:bg-stone-50 rounded-lg"
              >
                Grandmasters & Lineage Masters
              </Link>
              <Link
                to="/heritage-works"
                className="block px-3 py-1.5 text-sm text-slate-600 hover:text-[#0B1B3D] hover:bg-stone-50 rounded-lg"
              >
                Intangible Cultural Heritage Safeguarding
              </Link>
            </div>

            <div className="pt-2 pb-1 border-t border-stone-100">
              <Link
                to="/training-syllabus"
                className={`block px-3 py-2 text-base font-semibold rounded-lg ${
                  isActive('/training-syllabus') ? 'text-[#0B1B3D] bg-amber-50 font-bold' : 'text-slate-700'
                }`}
              >
                10-Stage Traditional Syllabus
              </Link>
            </div>

            <div className="pt-2 pb-1 border-t border-stone-100">
              <div className="px-3 text-xs font-bold uppercase tracking-wider text-amber-800">
                Archives & Proof Points
              </div>
              <Link
                to="/achievements"
                className="block px-3 py-1.5 text-sm text-slate-600 hover:text-[#0B1B3D] hover:bg-stone-50 rounded-lg"
              >
                Achievements & Malaysia Book of Records
              </Link>
              <Link
                to="/gallery"
                className="block px-3 py-1.5 text-sm text-slate-600 hover:text-[#0B1B3D] hover:bg-stone-50 rounded-lg"
              >
                Historical Photo Gallery
              </Link>
              <Link
                to="/videos"
                className="block px-3 py-1.5 text-sm text-slate-600 hover:text-[#0B1B3D] hover:bg-stone-50 rounded-lg"
              >
                Documentary & Twirling Videos
              </Link>
              <Link
                to="/partners-press"
                className="block px-3 py-1.5 text-sm text-slate-600 hover:text-[#0B1B3D] hover:bg-stone-50 rounded-lg"
              >
                Press Coverage & Institutional Partners
              </Link>
            </div>

            <div className="pt-2 pb-2 border-t border-stone-100 space-y-1">
              <Link
                to="/events"
                className={`block px-3 py-2 text-base font-semibold rounded-lg ${
                  isActive('/events') ? 'text-[#0B1B3D] bg-amber-50 font-bold' : 'text-slate-700'
                }`}
              >
                Events & Showcases
              </Link>
              <Link
                to="/news"
                className={`block px-3 py-2 text-base font-semibold rounded-lg ${
                  isActive('/news') ? 'text-[#0B1B3D] bg-amber-50 font-bold' : 'text-slate-700'
                }`}
              >
                Articles & Heritage News
              </Link>
              <Link
                to="/contact"
                className={`block px-3 py-2 text-base font-semibold rounded-lg ${
                  isActive('/contact') ? 'text-[#0B1B3D] bg-amber-50 font-bold' : 'text-slate-700'
                }`}
              >
                Contact & Headquarters
              </Link>
            </div>

            <div className="pt-3">
              <Link
                to="/join-training"
                className="w-full py-3 rounded-lg bg-[#0B1B3D] text-white font-semibold text-sm flex items-center justify-center space-x-2 border border-amber-500/40"
              >
                <span>Join Traditional Training</span>
                <ArrowRight className="w-4 h-4 text-amber-300" />
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};
