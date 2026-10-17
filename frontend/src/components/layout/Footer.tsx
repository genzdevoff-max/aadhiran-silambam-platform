import React from 'react';
import { Link } from 'react-router-dom';
import {
  Phone,
  Mail,
  MapPin,
  Award,
  ChevronRight,
  Globe
} from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-charcoal-950 text-gray-300 border-t border-charcoal-800">
      {/* Top Banner Ribbon */}
      <div className="bg-gradient-to-r from-crimson-900 via-charcoal-900 to-crimson-900 border-b border-charcoal-800 py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gold-500/20 flex items-center justify-center text-gold-400 border border-gold-500/40">
              <Award className="w-5 h-5 text-gold-400" />
            </div>
            <div>
              <p className="text-white font-semibold tracking-wide uppercase text-sm">
                The Malaysia Book of Records — Official Recognition (2022)
              </p>
              <p className="text-gold-400 text-xs font-mono">
                Persatuan Aadhiran Silambam Pulau Pinang (Est. 25 Feb 1975) — Oldest Silambam Association
              </p>
            </div>
          </div>
          <Link
            to="/join"
            className="inline-flex items-center px-6 py-2.5 rounded-md bg-crimson-600 hover:bg-crimson-500 text-white font-semibold text-sm transition-all duration-200 shadow-lg shadow-crimson-900/40 border border-crimson-400/30"
          >
            <span>Begin Traditional Training</span>
            <ChevronRight className="w-4 h-4 ml-1.5" />
          </Link>
        </div>
      </div>

      {/* Main Footer Columns */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Col 1: About & Lineage Identity */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-3.5">
              <div className="w-12 h-12 rounded-full p-0.5 bg-gradient-to-br from-cobalt-500 via-gold-400 to-crimson-600 shadow-md flex-shrink-0">
                <div className="w-full h-full rounded-full bg-black flex items-center justify-center overflow-hidden">
                  <img
                    src="/logo.png"
                    alt="Aadhiran Silambam Association Emblem"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
              <div>
                <span className="block text-xl font-display font-bold tracking-wider text-white">
                  AADHIRAN SILAMBAM
                </span>
                <span className="block text-xs font-medium text-gold-400 tracking-widest uppercase">
                  ASA • George Town, Penang & Global Hub
                </span>
              </div>
            </div>

            <p className="text-sm text-gray-400 leading-relaxed">
              Persatuan Aadhiran Silambam Pulau Pinang safeguards the ancient 5,000-year Kurunji mountain Tamil martial heritage. Migrated to George Town in 1936 by the 14th direct descendant Grandmaster Mariapakkiam, our unbroken discipline emphasizes authentic stick twirling, intricate footwork, and animated animal postures without commercial modification.
            </p>

            <div className="pt-2 flex flex-wrap gap-2 text-xs">
              <span className="inline-flex items-center px-2.5 py-1 rounded bg-charcoal-900 border border-charcoal-700 text-gold-300">
                <Globe className="w-3 h-3 mr-1 text-gold-400" /> UNESCO Living Heritage (2019)
              </span>
              <span className="inline-flex items-center px-2.5 py-1 rounded bg-charcoal-900 border border-charcoal-700 text-gold-300">
                ICHCAP S.Korea Publication (2020)
              </span>
              <span className="inline-flex items-center px-2.5 py-1 rounded bg-charcoal-900 border border-charcoal-700 text-gold-300">
                CNN Travel Featured (2017)
              </span>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div>
            <h3 className="text-white text-sm font-display font-bold tracking-wider uppercase mb-4 border-l-2 border-crimson-500 pl-2.5">
              Explore
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/about" className="hover:text-gold-400 transition-colors flex items-center">
                  <ChevronRight className="w-3.5 h-3.5 mr-1 text-charcoal-600" /> About Association
                </Link>
              </li>
              <li>
                <Link to="/history-lineage" className="hover:text-gold-400 transition-colors flex items-center">
                  <ChevronRight className="w-3.5 h-3.5 mr-1 text-charcoal-600" /> 5,000-Yr Lineage
                </Link>
              </li>
              <li>
                <Link to="/training-syllabus" className="hover:text-gold-400 transition-colors flex items-center">
                  <ChevronRight className="w-3.5 h-3.5 mr-1 text-charcoal-600" /> 10-Stage Syllabus
                </Link>
              </li>
              <li>
                <Link to="/instructors" className="hover:text-gold-400 transition-colors flex items-center">
                  <ChevronRight className="w-3.5 h-3.5 mr-1 text-charcoal-600" /> Masters & Instructors
                </Link>
              </li>
              <li>
                <Link to="/achievements" className="hover:text-gold-400 transition-colors flex items-center">
                  <ChevronRight className="w-3.5 h-3.5 mr-1 text-charcoal-600" /> Awards & Records
                </Link>
              </li>
              <li>
                <Link to="/events" className="hover:text-gold-400 transition-colors flex items-center">
                  <ChevronRight className="w-3.5 h-3.5 mr-1 text-charcoal-600" /> Events & Competitions
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Media & Heritage */}
          <div>
            <h3 className="text-white text-sm font-display font-bold tracking-wider uppercase mb-4 border-l-2 border-crimson-500 pl-2.5">
              Heritage & Media
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/gallery" className="hover:text-gold-400 transition-colors flex items-center">
                  <ChevronRight className="w-3.5 h-3.5 mr-1 text-charcoal-600" /> Photo Archives (1970s+)
                </Link>
              </li>
              <li>
                <Link to="/videos" className="hover:text-gold-400 transition-colors flex items-center">
                  <ChevronRight className="w-3.5 h-3.5 mr-1 text-charcoal-600" /> Video Demonstrations
                </Link>
              </li>
              <li>
                <Link to="/heritage-works" className="hover:text-gold-400 transition-colors flex items-center">
                  <ChevronRight className="w-3.5 h-3.5 mr-1 text-charcoal-600" /> UNESCO Living Heritage
                </Link>
              </li>
              <li>
                <Link to="/partners-press" className="hover:text-gold-400 transition-colors flex items-center">
                  <ChevronRight className="w-3.5 h-3.5 mr-1 text-charcoal-600" /> CNN & Press Coverage
                </Link>
              </li>
              <li>
                <Link to="/news" className="hover:text-gold-400 transition-colors flex items-center">
                  <ChevronRight className="w-3.5 h-3.5 mr-1 text-charcoal-600" /> News & Announcements
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="hover:text-gold-400 transition-colors flex items-center">
                  <ChevronRight className="w-3.5 h-3.5 mr-1 text-charcoal-600" /> Privacy Policy (PDPA)
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Headquarters */}
          <div>
            <h3 className="text-white text-sm font-display font-bold tracking-wider uppercase mb-4 border-l-2 border-gold-500 pl-2.5">
              Headquarters
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start">
                <MapPin className="w-4 h-4 mr-2.5 text-crimson-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-400">
                  Lebuh King, George Town, 10200 Penang, Malaysia
                </span>
              </li>
              <li className="flex items-center">
                <Phone className="w-4 h-4 mr-2.5 text-crimson-500 flex-shrink-0" />
                <a href="tel:+60164147856" className="text-gray-300 hover:text-gold-400 transition-colors">
                  +60 16-414 7856
                </a>
              </li>
              <li className="flex items-center">
                <Mail className="w-4 h-4 mr-2.5 text-crimson-500 flex-shrink-0" />
                <a href="mailto:info@aadhiran.com" className="text-gray-300 hover:text-gold-400 transition-colors">
                  info@aadhiran.com
                </a>
              </li>
              <li className="pt-2">
                <Link
                  to="/contact"
                  className="inline-block text-xs uppercase tracking-wider text-gold-400 hover:text-gold-300 font-semibold underline underline-offset-4"
                >
                  View Map & Directions →
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Admin Portal */}
        <div className="mt-12 pt-8 border-t border-charcoal-900 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-4">
          <p>
            © {new Date().getFullYear()} Persatuan Aadhiran Silambam Pulau Pinang (PPM-014-07-25021975). All rights reserved.
          </p>

          <div className="flex items-center space-x-6">
            <Link to="/privacy-policy" className="hover:text-gray-300 transition-colors">
              Privacy Policy
            </Link>
            <span className="text-charcoal-700">•</span>
            <Link to="/contact" className="hover:text-gray-300 transition-colors">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
