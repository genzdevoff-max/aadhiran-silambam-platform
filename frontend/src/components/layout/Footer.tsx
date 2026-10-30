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
import {
  FaInstagram,
  FaYoutube,
  FaFacebookF,
  FaWhatsapp
} from 'react-icons/fa6';
import { generalInfo } from '../../data/siteContent';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0B1B3D] text-slate-300 border-t border-[#142C66]">
      {/* Top Banner Ribbon */}
      <div className="bg-gradient-to-r from-[#0E2452] via-[#0B1B3D] to-[#0E2452] border-b border-[#142C66] py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 border border-amber-500/40 flex-shrink-0">
              <Award className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <p className="text-white font-semibold tracking-wide uppercase text-sm">
                The Malaysia Book of Records — Official Recognition (2022)
              </p>
              <p className="text-amber-300 text-xs font-mono">
                Persatuan Aadhiran Silambam Pulau Pinang (Est. 25 Feb 1975) — Oldest Silambam Association
              </p>
            </div>
          </div>
          <Link
            to="/join-training"
            className="inline-flex items-center px-6 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-[#0B1B3D] font-bold text-sm transition-all duration-200 shadow-md hover:shadow-lg border border-amber-300/60"
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
              <div className="w-12 h-12 rounded-full p-0.5 bg-gradient-to-br from-[#1E3A8A] via-amber-400 to-[#2563EB] shadow-md flex-shrink-0">
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
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
                <span className="block text-xs font-medium text-amber-400 tracking-widest uppercase">
                  ASA • George Town, Penang & Global Hub
                </span>
              </div>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed">
              Persatuan Aadhiran Silambam Pulau Pinang safeguards the ancient 5,000-year Kurunji mountain Tamil martial heritage. Migrated to George Town in 1936 by the 14th direct descendant Grandmaster Mariapakkiam, our unbroken discipline emphasizes authentic stick twirling, intricate footwork, and animated animal postures without commercial modification.
            </p>

            <div className="pt-2 flex flex-wrap gap-2 text-xs">
              <span className="inline-flex items-center px-2.5 py-1 rounded bg-[#142C66] border border-[#1E3A8A] text-amber-300 font-medium">
                <Globe className="w-3 h-3 mr-1 text-amber-400" /> UNESCO Living Heritage (2019)
              </span>
              <span className="inline-flex items-center px-2.5 py-1 rounded bg-[#142C66] border border-[#1E3A8A] text-amber-300 font-medium">
                ICHCAP S.Korea Publication (2020)
              </span>
              <span className="inline-flex items-center px-2.5 py-1 rounded bg-[#142C66] border border-[#1E3A8A] text-amber-300 font-medium">
                CNN Travel Featured (2017)
              </span>
            </div>

            {/* Official Social Media Channels */}
            <div className="pt-3">
              <span className="block text-xs font-semibold uppercase tracking-wider text-amber-400 mb-2.5">
                Official Channels & Social
              </span>
              <div className="flex items-center space-x-3" aria-label="Official Social Media Links">
                <a
                  href={generalInfo.socials.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram: Visit Aadhiran Silambam Profile"
                  title="Follow Aadhiran Silambam on Instagram"
                  className="w-10 h-10 rounded-full bg-[#142C66] border border-[#1E3A8A] flex items-center justify-center text-slate-300 hover:text-amber-400 hover:border-amber-400/80 hover:bg-[#1B3678] hover:scale-110 transition-all duration-200 shadow-sm"
                >
                  <FaInstagram className="w-4 h-4" aria-hidden="true" />
                </a>
                <a
                  href={generalInfo.socials.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube: Visit Aadhiran Silambam Channel"
                  title="Subscribe to Aadhiran Silambam on YouTube"
                  className="w-10 h-10 rounded-full bg-[#142C66] border border-[#1E3A8A] flex items-center justify-center text-slate-300 hover:text-amber-400 hover:border-amber-400/80 hover:bg-[#1B3678] hover:scale-110 transition-all duration-200 shadow-sm"
                >
                  <FaYoutube className="w-4 h-4" aria-hidden="true" />
                </a>
                <a
                  href={generalInfo.socials.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook: Visit Aadhiran Silambam Page"
                  title="Follow Aadhiran Silambam on Facebook"
                  className="w-10 h-10 rounded-full bg-[#142C66] border border-[#1E3A8A] flex items-center justify-center text-slate-300 hover:text-amber-400 hover:border-amber-400/80 hover:bg-[#1B3678] hover:scale-110 transition-all duration-200 shadow-sm"
                >
                  <FaFacebookF className="w-4 h-4" aria-hidden="true" />
                </a>
                <a
                  href={generalInfo.socials.whatsapp || 'https://wa.me/97433690769'}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp: Chat with Aadhiran Silambam"
                  title="Chat with Aadhiran Silambam on WhatsApp"
                  className="w-10 h-10 rounded-full bg-[#142C66] border border-[#1E3A8A] flex items-center justify-center text-slate-300 hover:text-[#25D366] hover:border-[#25D366]/80 hover:bg-[#1B3678] hover:scale-110 transition-all duration-200 shadow-sm"
                >
                  <FaWhatsapp className="w-4 h-4" aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div>
            <h3 className="text-white text-sm font-display font-bold tracking-wider uppercase mb-4 border-l-2 border-amber-500 pl-2.5">
              Explore
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/about" className="hover:text-amber-300 transition-colors flex items-center text-slate-300">
                  <ChevronRight className="w-3.5 h-3.5 mr-1 text-amber-500/60" /> About Association
                </Link>
              </li>
              <li>
                <Link to="/history-lineage" className="hover:text-amber-300 transition-colors flex items-center text-slate-300">
                  <ChevronRight className="w-3.5 h-3.5 mr-1 text-amber-500/60" /> 5,000-Yr Lineage
                </Link>
              </li>
              <li>
                <Link to="/training-syllabus" className="hover:text-amber-300 transition-colors flex items-center text-slate-300">
                  <ChevronRight className="w-3.5 h-3.5 mr-1 text-amber-500/60" /> 10-Stage Syllabus
                </Link>
              </li>
              <li>
                <Link to="/instructors" className="hover:text-amber-300 transition-colors flex items-center text-slate-300">
                  <ChevronRight className="w-3.5 h-3.5 mr-1 text-amber-500/60" /> Masters & Instructors
                </Link>
              </li>
              <li>
                <Link to="/achievements" className="hover:text-amber-300 transition-colors flex items-center text-slate-300">
                  <ChevronRight className="w-3.5 h-3.5 mr-1 text-amber-500/60" /> Awards & Records
                </Link>
              </li>
              <li>
                <Link to="/events" className="hover:text-amber-300 transition-colors flex items-center text-slate-300">
                  <ChevronRight className="w-3.5 h-3.5 mr-1 text-amber-500/60" /> Events & Competitions
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Media & Heritage */}
          <div>
            <h3 className="text-white text-sm font-display font-bold tracking-wider uppercase mb-4 border-l-2 border-amber-500 pl-2.5">
              Heritage & Media
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/gallery" className="hover:text-amber-300 transition-colors flex items-center text-slate-300">
                  <ChevronRight className="w-3.5 h-3.5 mr-1 text-amber-500/60" /> Photo Archives (1970s+)
                </Link>
              </li>
              <li>
                <Link to="/videos" className="hover:text-amber-300 transition-colors flex items-center text-slate-300">
                  <ChevronRight className="w-3.5 h-3.5 mr-1 text-amber-500/60" /> Video Demonstrations
                </Link>
              </li>
              <li>
                <Link to="/heritage-works" className="hover:text-amber-300 transition-colors flex items-center text-slate-300">
                  <ChevronRight className="w-3.5 h-3.5 mr-1 text-amber-500/60" /> UNESCO Living Heritage
                </Link>
              </li>
              <li>
                <Link to="/partners-press" className="hover:text-amber-300 transition-colors flex items-center text-slate-300">
                  <ChevronRight className="w-3.5 h-3.5 mr-1 text-amber-500/60" /> CNN & Press Coverage
                </Link>
              </li>
              <li>
                <Link to="/news" className="hover:text-amber-300 transition-colors flex items-center text-slate-300">
                  <ChevronRight className="w-3.5 h-3.5 mr-1 text-amber-500/60" /> News & Announcements
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="hover:text-amber-300 transition-colors flex items-center text-slate-300">
                  <ChevronRight className="w-3.5 h-3.5 mr-1 text-amber-500/60" /> Privacy Policy (PDPA)
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Headquarters */}
          <div>
            <h3 className="text-white text-sm font-display font-bold tracking-wider uppercase mb-4 border-l-2 border-amber-500 pl-2.5">
              Headquarters
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start">
                <MapPin className="w-4 h-4 mr-2.5 text-amber-400 mt-0.5 flex-shrink-0" />
                <span className="text-slate-300">
                  Lebuh King, George Town, 10200 Penang, Malaysia
                </span>
              </li>
              <li className="flex items-center">
                <Phone className="w-4 h-4 mr-2.5 text-amber-400 flex-shrink-0" />
                <a href="tel:+60164147856" className="text-slate-300 hover:text-amber-300 transition-colors">
                  +60 16-414 7856
                </a>
              </li>
              <li className="flex items-center">
                <FaWhatsapp className="w-4 h-4 mr-2.5 text-[#25D366] flex-shrink-0" />
                <a
                  href={generalInfo.socials.whatsapp || 'https://wa.me/97433690769'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-300 hover:text-emerald-400 transition-colors"
                >
                  +974 3369 0769 (WhatsApp)
                </a>
              </li>
              <li className="flex items-center">
                <Mail className="w-4 h-4 mr-2.5 text-amber-400 flex-shrink-0" />
                <a href="mailto:info@aadhiran.com" className="text-slate-300 hover:text-amber-300 transition-colors">
                  info@aadhiran.com
                </a>
              </li>
              <li className="pt-2">
                <Link
                  to="/contact"
                  className="inline-block text-xs uppercase tracking-wider text-amber-400 hover:text-amber-300 font-semibold underline underline-offset-4"
                >
                  View Map & Directions →
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Navigation */}
        <div className="mt-12 pt-8 border-t border-[#142C66] flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>
            © {new Date().getFullYear()} Persatuan Aadhiran Silambam Pulau Pinang (PPM-014-07-25021975). All rights reserved.
          </p>

          <div className="flex items-center space-x-6">
            <Link to="/privacy-policy" className="hover:text-amber-300 transition-colors">
              Privacy Policy
            </Link>
            <span className="text-slate-600">•</span>
            <Link to="/contact" className="hover:text-amber-300 transition-colors">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
