import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Menu,
  X,
  ChevronDown,
  Phone,
  MapPin,
  Award,
  Users,
  Camera,
  BookOpen,
  ArrowRight,
  Flame,
  Globe,
  Film,
  Trophy,
  Newspaper
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [heritageDropdown, setHeritageDropdown] = useState(false);
  const [archivesDropdown, setArchivesDropdown] = useState(false);
  const mobileMenuButtonRef = useRef<HTMLButtonElement>(null);
  const heritageButtonRef = useRef<HTMLButtonElement>(null);
  const archivesButtonRef = useRef<HTMLButtonElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close all menus and dropdowns on route change
  useEffect(() => {
    setIsOpen(false);
    setHeritageDropdown(false);
    setArchivesDropdown(false);
  }, [location.pathname]);

  // Handle Escape key to close open menus
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
      } else if (archivesDropdown) {
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
    <header
      ref={headerRef}
      className="sticky top-0 z-50 w-full select-none"
    >
      {/* 1. Top Sports Utility Bar (1024px+ Desktop) */}
      <div className="bg-[#102137] border-b border-[#183B5B] text-[11px] text-slate-200 py-1.5 px-4 hidden lg:block">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center space-x-3 min-w-0">
            <span className="inline-flex items-center text-[#D9B96E] font-semibold tracking-wide whitespace-nowrap truncate">
              <Award className="w-3.5 h-3.5 mr-1.5 text-[#C6A04A] shrink-0" />
              Malaysia Book of Records (2022) — Certified Oldest Silambam Association
            </span>
            <span className="hidden xl:inline text-slate-500">|</span>
            <span className="hidden xl:inline-flex items-center text-slate-200 whitespace-nowrap truncate">
              <MapPin className="w-3.5 h-3.5 mr-1 text-[#C6A04A] shrink-0" />
              George Town UNESCO Heritage Zone, Penang
            </span>
          </div>

          <div className="flex items-center space-x-4 shrink-0 whitespace-nowrap text-xs">
            <a
              href="tel:+60164147856"
              className="flex items-center text-slate-200 hover:text-[#D9B96E] transition-colors"
            >
              <Phone className="w-3.5 h-3.5 mr-1.5 text-[#C6A04A] shrink-0" />
              <span className="font-medium">+60 16-414 7856</span>
            </a>
            <span className="text-slate-500">|</span>
            <Link
              to="/admin/login"
              className="text-slate-300 hover:text-[#D9B96E] font-medium transition-colors"
            >
              Admin Portal
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Main Sports Navigation Bar */}
      <nav
        aria-label="Main Navigation"
        className={`relative z-50 w-full transition-all duration-200 ${
          scrolled
            ? 'bg-white/98 backdrop-blur-md shadow-md border-b border-slate-200'
            : 'bg-white/95 backdrop-blur-md border-b border-slate-200'
        }`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 h-16 sm:h-18 flex items-center justify-between gap-2 sm:gap-4">
          
          {/* [ ASSOCIATION LOGO ] */}
          <Link
            to="/"
            className="flex items-center space-x-2 sm:space-x-3 group shrink-0 min-w-0"
          >
            <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full p-0.5 bg-gradient-to-br from-[#102137] via-[#C6A04A] to-[#183B5B] shadow-md group-hover:scale-105 transition-all shrink-0">
              <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden p-0.5">
                <img
                  src="/logo.png"
                  alt="Aadhiran Silambam Association Emblem"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
            
            <div className="flex flex-col min-w-0">
              <div className="flex items-center space-x-1.5">
                <span className="text-sm sm:text-base font-display font-extrabold tracking-tight text-[#102137] whitespace-nowrap">
                  AADHIRAN SILAMBAM
                </span>
                <span className="hidden 2xl:inline-block text-[9px] tracking-wider uppercase font-bold px-1.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-900 shrink-0">
                  EST. 1975
                </span>
              </div>
              
              <span className="text-[10px] sm:text-xs text-[#475569] font-medium tracking-wide truncate max-w-[140px] sm:max-w-xs">
                <span className="text-[#8B6508] font-semibold">George Town, Penang</span>
              </span>
            </div>
          </Link>

          {/* [ NAVIGATION LINKS ] (Visible at lg: 1024px+) */}
          <div className="hidden lg:flex items-center justify-center space-x-0.5 xl:space-x-1 2xl:space-x-1.5 shrink-0">
            {/* Home */}
            <Link
              to="/"
              className={`px-2 xl:px-2.5 py-1.5 text-xs xl:text-sm font-semibold rounded-lg transition-all whitespace-nowrap ${
                isActive('/')
                  ? 'text-[#102137] bg-slate-100 font-bold border-b-2 border-[#C6A04A]'
                  : 'text-[#182332] hover:text-[#102137] hover:bg-slate-50'
              }`}
            >
              Home
            </Link>

            {/* Heritage & Lineage Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setHeritageDropdown(true)}
              onMouseLeave={() => setHeritageDropdown(false)}
            >
              <button
                type="button"
                ref={heritageButtonRef}
                aria-expanded={heritageDropdown}
                aria-haspopup="true"
                aria-controls="heritage-dropdown-menu"
                onClick={() => setHeritageDropdown((open) => !open)}
                className={`flex items-center px-2 xl:px-2.5 py-1.5 text-xs xl:text-sm font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                  isHeritageActive
                    ? 'text-[#102137] bg-slate-100 font-bold border-b-2 border-[#C6A04A]'
                    : 'text-[#182332] hover:text-[#102137] hover:bg-slate-50'
                }`}
              >
                <span>Heritage & Lineage</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 ml-0.5 transition-transform duration-200 shrink-0 ${
                    heritageDropdown ? 'rotate-180 text-[#C6A04A]' : 'text-[#64748B]'
                  }`}
                />
              </button>

              {heritageDropdown && (
                <div
                  id="heritage-dropdown-menu"
                  className="absolute top-full left-0 mt-1.5 w-76 sm:w-80 py-2 bg-white border border-slate-200 rounded-2xl shadow-xl backdrop-blur-xl animate-in fade-in duration-150 p-1.5 space-y-0.5 z-50"
                >
                  <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#C6A04A]">
                    Unbroken Tamil Lineage
                  </div>
                  <Link
                    to="/about"
                    className="flex items-center px-3 py-2 text-xs sm:text-sm text-[#182332] hover:text-[#102137] hover:bg-slate-50 rounded-xl transition-all group/item"
                  >
                    <div className="w-7 h-7 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-[#102137] shrink-0 mr-2.5 group-hover/item:bg-[#102137] group-hover/item:text-[#C6A04A] transition-colors">
                      <BookOpen className="w-3.5 h-3.5 shrink-0" />
                    </div>
                    <div>
                      <div className="font-bold text-[#102137]">About Aadhiran</div>
                      <div className="text-[11px] text-[#64748B]">Founding history, constitution & mission</div>
                    </div>
                  </Link>
                  <Link
                    to="/history-lineage"
                    className="flex items-center px-3 py-2 text-xs sm:text-sm text-[#182332] hover:text-[#102137] hover:bg-slate-50 rounded-xl transition-all group/item"
                  >
                    <div className="w-7 h-7 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-[#102137] shrink-0 mr-2.5 group-hover/item:bg-[#102137] group-hover/item:text-[#C6A04A] transition-colors">
                      <Flame className="w-3.5 h-3.5 shrink-0" />
                    </div>
                    <div>
                      <div className="font-bold text-[#102137]">5,000-Year Lineage</div>
                      <div className="text-[11px] text-[#64748B]">Kurunji Mountains to George Town</div>
                    </div>
                  </Link>
                  <Link
                    to="/instructors"
                    className="flex items-center px-3 py-2 text-xs sm:text-sm text-[#182332] hover:text-[#102137] hover:bg-slate-50 rounded-xl transition-all group/item"
                  >
                    <div className="w-7 h-7 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-[#102137] shrink-0 mr-2.5 group-hover/item:bg-[#102137] group-hover/item:text-[#C6A04A] transition-colors">
                      <Users className="w-3.5 h-3.5 shrink-0" />
                    </div>
                    <div>
                      <div className="font-bold text-[#102137]">Grandmasters & Coaches</div>
                      <div className="text-[11px] text-[#64748B]">Master Siva & Coaching Roster</div>
                    </div>
                  </Link>
                  <Link
                    to="/heritage-works"
                    className="flex items-center px-3 py-2 text-xs sm:text-sm text-[#182332] hover:text-[#102137] hover:bg-slate-50 rounded-xl transition-all group/item"
                  >
                    <div className="w-7 h-7 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-[#102137] shrink-0 mr-2.5 group-hover/item:bg-[#102137] group-hover/item:text-[#C6A04A] transition-colors">
                      <Globe className="w-3.5 h-3.5 shrink-0" />
                    </div>
                    <div>
                      <div className="font-bold text-[#102137]">UNESCO Cultural Safeguarding</div>
                      <div className="text-[11px] text-[#64748B]">Living heritage preservation research</div>
                    </div>
                  </Link>
                </div>
              )}
            </div>

            {/* 10-Stage Syllabus */}
            <Link
              to="/training-syllabus"
              className={`px-2 xl:px-2.5 py-1.5 text-xs xl:text-sm font-semibold rounded-lg transition-all whitespace-nowrap ${
                isActive('/training-syllabus')
                  ? 'text-[#102137] bg-slate-100 font-bold border-b-2 border-[#C6A04A]'
                  : 'text-[#182332] hover:text-[#102137] hover:bg-slate-50'
              }`}
            >
              Syllabus
            </Link>

            {/* Archives & Media Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setArchivesDropdown(true)}
              onMouseLeave={() => setArchivesDropdown(false)}
            >
              <button
                type="button"
                ref={archivesButtonRef}
                aria-expanded={archivesDropdown}
                aria-haspopup="true"
                aria-controls="archives-dropdown-menu"
                onClick={() => setArchivesDropdown((open) => !open)}
                className={`flex items-center px-2 xl:px-2.5 py-1.5 text-xs xl:text-sm font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                  isArchivesActive
                    ? 'text-[#102137] bg-slate-100 font-bold border-b-2 border-[#C6A04A]'
                    : 'text-[#182332] hover:text-[#102137] hover:bg-slate-50'
                }`}
              >
                <span>Media & Records</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 ml-0.5 transition-transform duration-200 shrink-0 ${
                    archivesDropdown ? 'rotate-180 text-[#C6A04A]' : 'text-[#64748B]'
                  }`}
                />
              </button>

              {archivesDropdown && (
                <div
                  id="archives-dropdown-menu"
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-1.5 w-76 sm:w-80 py-2 bg-white border border-slate-200 rounded-2xl shadow-xl backdrop-blur-xl animate-in fade-in duration-150 p-1.5 space-y-0.5 z-50"
                >
                  <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#C6A04A]">
                    Media Vault & Recognitions
                  </div>
                  <Link
                    to="/gallery"
                    className="flex items-center px-3 py-2 text-xs sm:text-sm text-[#182332] hover:text-[#102137] hover:bg-slate-50 rounded-xl transition-all group/item"
                  >
                    <div className="w-7 h-7 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-[#102137] shrink-0 mr-2.5 group-hover/item:bg-[#102137] group-hover/item:text-[#C6A04A] transition-colors">
                      <Camera className="w-3.5 h-3.5 shrink-0" />
                    </div>
                    <div>
                      <div className="font-bold text-[#102137]">Photo Gallery</div>
                      <div className="text-[11px] text-[#64748B]">Action captures & martial demonstrations</div>
                    </div>
                  </Link>
                  <Link
                    to="/videos"
                    className="flex items-center px-3 py-2 text-xs sm:text-sm text-[#182332] hover:text-[#102137] hover:bg-slate-50 rounded-xl transition-all group/item"
                  >
                    <div className="w-7 h-7 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-[#102137] shrink-0 mr-2.5 group-hover/item:bg-[#102137] group-hover/item:text-[#C6A04A] transition-colors">
                      <Film className="w-3.5 h-3.5 shrink-0" />
                    </div>
                    <div>
                      <div className="font-bold text-[#102137]">Videos & Action</div>
                      <div className="text-[11px] text-[#64748B]">Kaaladi footwork, weapon forms & reels</div>
                    </div>
                  </Link>
                  <Link
                    to="/achievements"
                    className="flex items-center px-3 py-2 text-xs sm:text-sm text-[#182332] hover:text-[#102137] hover:bg-slate-50 rounded-xl transition-all group/item"
                  >
                    <div className="w-7 h-7 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-[#102137] shrink-0 mr-2.5 group-hover/item:bg-[#102137] group-hover/item:text-[#C6A04A] transition-colors">
                      <Trophy className="w-3.5 h-3.5 shrink-0" />
                    </div>
                    <div>
                      <div className="font-bold text-[#102137]">Achievements & MBOR</div>
                      <div className="text-[11px] text-[#64748B]">Malaysia Book of Records & Medals</div>
                    </div>
                  </Link>
                  <Link
                    to="/partners-press"
                    className="flex items-center px-3 py-2 text-xs sm:text-sm text-[#182332] hover:text-[#102137] hover:bg-slate-50 rounded-xl transition-all group/item"
                  >
                    <div className="w-7 h-7 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-[#102137] shrink-0 mr-2.5 group-hover/item:bg-[#102137] group-hover/item:text-[#C6A04A] transition-colors">
                      <Newspaper className="w-3.5 h-3.5 shrink-0" />
                    </div>
                    <div>
                      <div className="font-bold text-[#102137]">Partners & Press Media</div>
                      <div className="text-[11px] text-[#64748B]">CNN Travel, GTWHI & allies</div>
                    </div>
                  </Link>
                </div>
              )}
            </div>

            {/* Events */}
            <Link
              to="/events"
              className={`px-2 xl:px-2.5 py-1.5 text-xs xl:text-sm font-semibold rounded-lg transition-all whitespace-nowrap ${
                isActive('/events')
                  ? 'text-[#102137] bg-slate-100 font-bold border-b-2 border-[#C6A04A]'
                  : 'text-[#182332] hover:text-[#102137] hover:bg-slate-50'
              }`}
            >
              Events
            </Link>

            {/* News */}
            <Link
              to="/news"
              className={`px-2 xl:px-2.5 py-1.5 text-xs xl:text-sm font-semibold rounded-lg transition-all whitespace-nowrap ${
                isActive('/news')
                  ? 'text-[#102137] bg-slate-100 font-bold border-b-2 border-[#C6A04A]'
                  : 'text-[#182332] hover:text-[#102137] hover:bg-slate-50'
              }`}
            >
              News
            </Link>

            {/* Contact */}
            <Link
              to="/contact"
              className={`px-2 xl:px-2.5 py-1.5 text-xs xl:text-sm font-semibold rounded-lg transition-all whitespace-nowrap ${
                isActive('/contact')
                  ? 'text-[#102137] bg-slate-100 font-bold border-b-2 border-[#C6A04A]'
                  : 'text-[#182332] hover:text-[#102137] hover:bg-slate-50'
              }`}
            >
              Contact
            </Link>
          </div>

          {/* [ SPORTS ACTION BUTTON ] */}
          <div className="hidden lg:flex items-center shrink-0">
            <Link
              to="/join-training"
              className="inline-flex items-center justify-center px-4 py-2 xl:px-5 xl:py-2.5 rounded-xl bg-[#C6A04A] hover:bg-[#D9B96E] text-[#102137] font-display font-bold text-xs uppercase tracking-wider transition-all shadow-sm hover:scale-[1.02] group/cta shrink-0"
            >
              <span>Join Training</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1.5 group-hover/cta:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Mobile/Tablet Menu Controls */}
          <div className="flex lg:hidden items-center space-x-2 shrink-0">
            <Link
              to="/join-training"
              className="hidden sm:inline-flex items-center justify-center px-3.5 py-1.5 rounded-xl bg-[#C6A04A] hover:bg-[#D9B96E] text-[#102137] font-display font-bold text-xs uppercase tracking-wider shadow-sm"
            >
              <span>Join</span>
            </Link>
            <button
              type="button"
              ref={mobileMenuButtonRef}
              onClick={() => setIsOpen((prev) => !prev)}
              className="p-2 rounded-xl text-[#102137] hover:bg-slate-100 transition-colors focus:outline-none cursor-pointer"
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isOpen}
              aria-controls="mobile-navigation-dropdown"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* 3. Mobile Navigation Dropdown */}
        {isOpen && (
          <div
            id="mobile-navigation-dropdown"
            className="lg:hidden absolute top-full left-0 right-0 w-full bg-white border-b border-slate-200 shadow-2xl z-40 max-h-[calc(100vh-80px)] overflow-y-auto animate-in fade-in duration-200"
          >
            <div className="max-w-xl mx-auto px-4 py-5 space-y-4">
              {/* Association Identity Banner */}
              <div className="flex items-center space-x-3 pb-3 border-b border-slate-200">
                <div className="w-10 h-10 rounded-full bg-white p-0.5 border border-slate-200 shrink-0">
                  <img src="/logo.png" alt="Aadhiran Logo" className="w-full h-full object-contain" />
                </div>
                <div className="min-w-0">
                  <span className="block font-display font-bold text-sm text-[#102137] truncate">
                    Persatuan Aadhiran Silambam
                  </span>
                  <span className="block text-xs text-[#C6A04A] font-semibold truncate">
                    PPM-014-07-25021975 • George Town, Penang
                  </span>
                </div>
              </div>

              {/* Primary Mobile Navigation Links */}
              <div className="grid grid-cols-1 gap-1">
                <Link
                  to="/"
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center px-4 py-2.5 rounded-xl text-sm font-bold transition-colors ${
                    isActive('/') ? 'bg-[#102137] text-white' : 'text-[#182332] hover:bg-slate-100'
                  }`}
                >
                  Home
                </Link>

                <div className="pt-2 pb-1 px-4 text-[10px] font-bold uppercase tracking-wider text-[#8B6508]">
                  Heritage & Lineage
                </div>
                <Link
                  to="/about"
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                    isActive('/about') ? 'bg-[#102137] text-white font-bold' : 'text-[#182332] hover:bg-slate-100'
                  }`}
                >
                  About Aadhiran Association
                </Link>
                <Link
                  to="/history-lineage"
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                    isActive('/history-lineage') ? 'bg-[#102137] text-white font-bold' : 'text-[#182332] hover:bg-slate-100'
                  }`}
                >
                  5,000-Year Lineage & History
                </Link>
                <Link
                  to="/instructors"
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                    isActive('/instructors') ? 'bg-[#102137] text-white font-bold' : 'text-[#182332] hover:bg-slate-100'
                  }`}
                >
                  Grandmasters & Coaching Staff
                </Link>
                <Link
                  to="/heritage-works"
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                    isActive('/heritage-works') ? 'bg-[#102137] text-white font-bold' : 'text-[#182332] hover:bg-slate-100'
                  }`}
                >
                  UNESCO & Living Safeguarding
                </Link>

                <div className="pt-2 pb-1 px-4 text-[10px] font-bold uppercase tracking-wider text-[#8B6508]">
                  Programmes & Media
                </div>
                <Link
                  to="/training-syllabus"
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                    isActive('/training-syllabus') ? 'bg-[#102137] text-white font-bold' : 'text-[#182332] hover:bg-slate-100'
                  }`}
                >
                  Training Syllabus & Programmes
                </Link>
                <Link
                  to="/gallery"
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                    isActive('/gallery') ? 'bg-[#102137] text-white font-bold' : 'text-[#182332] hover:bg-slate-100'
                  }`}
                >
                  Photo Gallery & Albums
                </Link>
                <Link
                  to="/videos"
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                    isActive('/videos') ? 'bg-[#102137] text-white font-bold' : 'text-[#182332] hover:bg-slate-100'
                  }`}
                >
                  Videos & Action Footage
                </Link>
                <Link
                  to="/achievements"
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                    isActive('/achievements') ? 'bg-[#102137] text-white font-bold' : 'text-[#182332] hover:bg-slate-100'
                  }`}
                >
                  Achievements & Malaysia Book of Records
                </Link>
                <Link
                  to="/events"
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                    isActive('/events') ? 'bg-[#102137] text-white font-bold' : 'text-[#182332] hover:bg-slate-100'
                  }`}
                >
                  Events & Tournaments
                </Link>
                <Link
                  to="/news"
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                    isActive('/news') ? 'bg-[#102137] text-white font-bold' : 'text-[#182332] hover:bg-slate-100'
                  }`}
                >
                  News & Dispatches
                </Link>
                <Link
                  to="/partners-press"
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                    isActive('/partners-press') ? 'bg-[#102137] text-white font-bold' : 'text-[#182332] hover:bg-slate-100'
                  }`}
                >
                  Partners & Press
                </Link>
                <Link
                  to="/contact"
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center px-4 py-2 rounded-xl text-sm font-bold transition-colors ${
                    isActive('/contact') ? 'bg-[#102137] text-white' : 'text-[#182332] hover:bg-slate-100'
                  }`}
                >
                  Contact Dojo Headquarters
                </Link>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-200 space-y-2.5">
                <Link
                  to="/join-training"
                  onClick={() => setIsOpen(false)}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-xl bg-[#C6A04A] hover:bg-[#D9B96E] text-[#102137] font-display font-bold text-xs uppercase tracking-wider shadow-md transition-colors"
                >
                  <span>Begin Your Training</span>
                  <ArrowRight className="w-4 h-4 text-[#102137]" />
                </Link>
                <div className="text-center pt-1">
                  <Link
                    to="/admin/login"
                    onClick={() => setIsOpen(false)}
                    className="text-xs text-[#64748B] hover:text-[#102137] font-semibold"
                  >
                    Administrator Portal &rarr;
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Backdrop overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="lg:hidden fixed inset-0 z-30 bg-black/40 backdrop-blur-2xs transition-opacity"
          aria-hidden="true"
        />
      )}
    </header>
  );
};
