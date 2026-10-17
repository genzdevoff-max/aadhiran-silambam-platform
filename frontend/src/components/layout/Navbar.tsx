import React, { useState, useEffect } from 'react';
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
      {/* Top Prestige Heritage Utility Bar */}
      <div className="bg-[#090b0f] border-b border-charcoal-800/80 text-[11px] text-gray-400 py-2 px-4 hidden md:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-5">
            <span className="inline-flex items-center text-gold-300 font-medium tracking-wide">
              <Award className="w-3.5 h-3.5 mr-1.5 text-gold-400 flex-shrink-0" />
              Malaysia Book of Records (2022) — Oldest Silambam Association
            </span>
            <span className="text-charcoal-700">|</span>
            <span className="flex items-center text-gray-400">
              <MapPin className="w-3.5 h-3.5 mr-1 text-crimson-400 flex-shrink-0" />
              Lebuh King, George Town UNESCO Heritage Zone, Penang
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <a
              href="tel:+60164147856"
              className="flex items-center text-gray-300 hover:text-gold-300 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 mr-1.5 text-crimson-400" />
              <span>+60 16-414 7856</span>
            </a>
            <span className="text-charcoal-700">|</span>
            <span className="text-gold-400 font-mono text-[10px] tracking-wider uppercase">
              PPM-014-07-25021975
            </span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav
        className={`w-full transition-all duration-300 ${
          scrolled
            ? 'bg-[#0b0e14]/95 backdrop-blur-md shadow-2xl border-b border-charcoal-800/80 py-3'
            : 'bg-[#0d1017]/90 backdrop-blur-md border-b border-charcoal-800/60 py-3.5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo & Martial Arts Brand */}
          <Link to="/" className="flex items-center space-x-3.5 group">
            <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-full p-0.5 bg-gradient-to-br from-cobalt-500 via-gold-400 to-crimson-600 shadow-md group-hover:scale-105 transition-all flex-shrink-0">
              <div className="w-full h-full rounded-full bg-black flex items-center justify-center overflow-hidden">
                <img
                  src="/logo.png"
                  alt="Aadhiran Silambam Association Emblem"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center space-x-2">
                <span className="font-display text-lg sm:text-xl font-extrabold tracking-wider text-white">
                  AADHIRAN
                </span>
                <span className="text-[10px] tracking-widest uppercase font-semibold px-2 py-0.5 rounded bg-cobalt-950/90 border border-cobalt-700/60 text-cobalt-300">
                  ASA • EST 1975
                </span>
              </div>
              <span className="text-[11px] text-gold-400 font-medium tracking-wide">
                ஆதிரன் சிலம்ப சங்கம் <span className="text-gray-500 font-sans mx-1">•</span> Penang & Global
              </span>
            </div>
          </Link>

          {/* Desktop Links (Consolidated 5 Clean Groups) */}
          <div className="hidden lg:flex items-center space-x-1 xl:space-x-2">
            <Link
              to="/"
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-all ${
                isActive('/')
                  ? 'text-gold-300 bg-charcoal-850/80 font-semibold'
                  : 'text-gray-300 hover:text-white hover:bg-charcoal-850/50'
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
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all ${
                  isHeritageActive
                    ? 'text-gold-300 bg-charcoal-850/80 font-semibold'
                    : 'text-gray-300 hover:text-white hover:bg-charcoal-850/50'
                }`}
              >
                <span>Heritage & Lineage</span>
                <ChevronDown
                  className={`w-4 h-4 ml-1 transition-transform duration-200 ${
                    heritageDropdown ? 'rotate-180 text-gold-400' : 'text-gray-500'
                  }`}
                />
              </button>

              {heritageDropdown && (
                <div className="absolute top-full left-0 w-72 py-2 bg-[#0e121a] border border-charcoal-700/80 rounded-xl shadow-2xl backdrop-blur-xl animate-in fade-in duration-150">
                  <div className="px-3.5 py-1.5 mb-1 text-[10px] font-bold uppercase tracking-wider text-gold-500/80">
                    Living Martial Tradition
                  </div>
                  <Link
                    to="/about"
                    className="flex items-start px-3.5 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-charcoal-800/80 rounded-lg mx-1 transition-colors"
                  >
                    <Shield className="w-4 h-4 mr-3 text-crimson-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-white">About Aadhiran</div>
                      <div className="text-xs text-gray-400 mt-0.5">Founding history & 1975 ROS charter</div>
                    </div>
                  </Link>
                  <Link
                    to="/history-lineage"
                    className="flex items-start px-3.5 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-charcoal-800/80 rounded-lg mx-1 transition-colors"
                  >
                    <Compass className="w-4 h-4 mr-3 text-gold-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-white">5,000-Year Kurunji Lineage</div>
                      <div className="text-xs text-gray-400 mt-0.5">Origins from Madurai to Penang 1936</div>
                    </div>
                  </Link>
                  <Link
                    to="/instructors"
                    className="flex items-start px-3.5 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-charcoal-800/80 rounded-lg mx-1 transition-colors"
                  >
                    <Users className="w-4 h-4 mr-3 text-crimson-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-white">Grandmasters & Masters</div>
                      <div className="text-xs text-gray-400 mt-0.5">Master Mariapakkiam & Chief Master Siva</div>
                    </div>
                  </Link>
                  <Link
                    to="/heritage-works"
                    className="flex items-start px-3.5 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-charcoal-800/80 rounded-lg mx-1 transition-colors"
                  >
                    <Sparkles className="w-4 h-4 mr-3 text-gold-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-white">Heritage Preservation</div>
                      <div className="text-xs text-gray-400 mt-0.5">UNESCO bid & archival book projects</div>
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
                  ? 'text-gold-300 bg-charcoal-850/80 font-semibold'
                  : 'text-gray-300 hover:text-white hover:bg-charcoal-850/50'
              }`}
            >
              <BookOpen className="w-4 h-4 mr-1.5 text-gold-400" />
              <span>10-Stage Syllabus</span>
            </Link>

            {/* 3. Archives & Media Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setArchivesDropdown(true)}
              onMouseLeave={() => setArchivesDropdown(false)}
            >
              <button
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all ${
                  isArchivesActive
                    ? 'text-gold-300 bg-charcoal-850/80 font-semibold'
                    : 'text-gray-300 hover:text-white hover:bg-charcoal-850/50'
                }`}
              >
                <span>Archives & Media</span>
                <ChevronDown
                  className={`w-4 h-4 ml-1 transition-transform duration-200 ${
                    archivesDropdown ? 'rotate-180 text-gold-400' : 'text-gray-500'
                  }`}
                />
              </button>

              {archivesDropdown && (
                <div className="absolute top-full left-0 w-72 py-2 bg-[#0e121a] border border-charcoal-700/80 rounded-xl shadow-2xl backdrop-blur-xl animate-in fade-in duration-150">
                  <div className="px-3.5 py-1.5 mb-1 text-[10px] font-bold uppercase tracking-wider text-gold-500/80">
                    Documentary & Evidence
                  </div>
                  <Link
                    to="/achievements"
                    className="flex items-start px-3.5 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-charcoal-800/80 rounded-lg mx-1 transition-colors"
                  >
                    <Award className="w-4 h-4 mr-3 text-gold-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-white">Achievements & MBOR</div>
                      <div className="text-xs text-gray-400 mt-0.5">Malaysia Book of Records & Citations</div>
                    </div>
                  </Link>
                  <Link
                    to="/gallery"
                    className="flex items-start px-3.5 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-charcoal-800/80 rounded-lg mx-1 transition-colors"
                  >
                    <Camera className="w-4 h-4 mr-3 text-crimson-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-white">Historical Photo Gallery</div>
                      <div className="text-xs text-gray-400 mt-0.5">Rare 20th century archival imagery</div>
                    </div>
                  </Link>
                  <Link
                    to="/videos"
                    className="flex items-start px-3.5 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-charcoal-800/80 rounded-lg mx-1 transition-colors"
                  >
                    <Flame className="w-4 h-4 mr-3 text-crimson-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-white">Documentary & Twirling Videos</div>
                      <div className="text-xs text-gray-400 mt-0.5">Master demonstrations & documentary</div>
                    </div>
                  </Link>
                  <Link
                    to="/partners-press"
                    className="flex items-start px-3.5 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-charcoal-800/80 rounded-lg mx-1 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4 mr-3 text-gold-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-white">Press & Institutional Citations</div>
                      <div className="text-xs text-gray-400 mt-0.5">George Town World Heritage & media</div>
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
                  ? 'text-gold-300 bg-charcoal-850/80 font-semibold'
                  : 'text-gray-300 hover:text-white hover:bg-charcoal-850/50'
              }`}
            >
              Events
            </Link>

            <Link
              to="/news"
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-all ${
                isActive('/news')
                  ? 'text-gold-300 bg-charcoal-850/80 font-semibold'
                  : 'text-gray-300 hover:text-white hover:bg-charcoal-850/50'
              }`}
            >
              News
            </Link>

            {/* 5. Contact */}
            <Link
              to="/contact"
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-all ${
                isActive('/contact')
                  ? 'text-gold-300 bg-charcoal-850/80 font-semibold'
                  : 'text-gray-300 hover:text-white hover:bg-charcoal-850/50'
              }`}
            >
              Contact
            </Link>
          </div>

          {/* Join Training CTA Button */}
          <div className="hidden lg:flex items-center space-x-3">
            <Link
              to="/join-training"
              className="relative group inline-flex items-center px-5 py-2.5 rounded-lg font-semibold text-sm text-white overflow-hidden shadow-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-crimson-800 via-crimson-700 to-crimson-800 border border-gold-500/40 rounded-lg group-hover:border-gold-400 transition-colors" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gold-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="relative z-10 flex items-center">
                <span>Join Training</span>
                <ArrowRight className="w-4 h-4 ml-1.5 text-gold-300 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </Link>
          </div>

          {/* Mobile menu trigger */}
          <div className="flex lg:hidden items-center space-x-3">
            <Link
              to="/join-training"
              className="inline-flex items-center px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-crimson-700 border border-gold-500/40"
            >
              Join
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-gray-300 hover:text-white bg-charcoal-900 border border-charcoal-700/60 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {isOpen ? <X className="w-5 h-5 text-gold-400" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile slideout drawer */}
        {isOpen && (
          <div className="lg:hidden bg-[#0c0f16] border-b border-charcoal-800 px-4 pt-4 pb-6 space-y-3 animate-in fade-in duration-200">
            <Link
              to="/"
              className={`block px-3 py-2.5 rounded-lg text-base font-medium ${
                isActive('/') ? 'text-gold-300 bg-charcoal-850 font-semibold' : 'text-gray-300'
              }`}
            >
              Home
            </Link>

            {/* Mobile Heritage Section */}
            <div className="p-3 rounded-xl bg-charcoal-900/60 border border-charcoal-800/80 space-y-1.5">
              <span className="text-[11px] font-bold text-gold-400 uppercase tracking-wider block px-1">
                Heritage & Lineage
              </span>
              <Link to="/about" className="block px-2 py-1.5 text-sm text-gray-300 hover:text-white">
                • About Aadhiran
              </Link>
              <Link to="/history-lineage" className="block px-2 py-1.5 text-sm text-gray-300 hover:text-white">
                • 5,000-Year Kurunji Lineage
              </Link>
              <Link to="/instructors" className="block px-2 py-1.5 text-sm text-gray-300 hover:text-white">
                • Grandmasters & Instructors
              </Link>
              <Link to="/heritage-works" className="block px-2 py-1.5 text-sm text-gray-300 hover:text-white">
                • Heritage Preservation Works
              </Link>
            </div>

            {/* Mobile Syllabus Link */}
            <Link
              to="/training-syllabus"
              className={`block px-3 py-2.5 rounded-lg text-base font-medium ${
                isActive('/training-syllabus')
                  ? 'text-gold-300 bg-charcoal-850 font-semibold'
                  : 'text-gray-300'
              }`}
            >
              10-Stage Traditional Syllabus
            </Link>

            {/* Mobile Archives Section */}
            <div className="p-3 rounded-xl bg-charcoal-900/60 border border-charcoal-800/80 space-y-1.5">
              <span className="text-[11px] font-bold text-gold-400 uppercase tracking-wider block px-1">
                Archives & Proof
              </span>
              <Link to="/achievements" className="block px-2 py-1.5 text-sm text-gray-300 hover:text-white">
                • Achievements & Malaysia Book of Records
              </Link>
              <Link to="/gallery" className="block px-2 py-1.5 text-sm text-gray-300 hover:text-white">
                • Historical Photo Gallery
              </Link>
              <Link to="/videos" className="block px-2 py-1.5 text-sm text-gray-300 hover:text-white">
                • Documentary & Twirling Videos
              </Link>
              <Link to="/partners-press" className="block px-2 py-1.5 text-sm text-gray-300 hover:text-white">
                • Press & Citations
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <Link
                to="/events"
                className="text-center py-2 px-3 rounded-lg bg-charcoal-900 border border-charcoal-800 text-sm text-gray-300"
              >
                Events
              </Link>
              <Link
                to="/news"
                className="text-center py-2 px-3 rounded-lg bg-charcoal-900 border border-charcoal-800 text-sm text-gray-300"
              >
                News
              </Link>
              <Link
                to="/contact"
                className="text-center py-2 px-3 rounded-lg bg-charcoal-900 border border-charcoal-800 text-sm text-gray-300"
              >
                Contact
              </Link>
              <Link
                to="/join-training"
                className="text-center py-2 px-3 rounded-lg bg-crimson-700 border border-gold-500/40 text-sm font-semibold text-white"
              >
                Join Enquiry
              </Link>
            </div>

            <div className="pt-3 border-t border-charcoal-800 text-xs text-gray-400 flex items-center justify-between">
              <span>Lebuh King, George Town</span>
              <a href="tel:+60164147856" className="text-gold-400 font-semibold">
                +60 16-414 7856
              </a>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};
