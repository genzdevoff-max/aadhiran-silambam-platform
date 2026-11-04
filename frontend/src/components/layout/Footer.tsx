import React from 'react';
import { Link } from 'react-router-dom';
import {
  Phone,
  Mail,
  MapPin,
  Award,
  ChevronRight,
  Globe,
} from 'lucide-react';
import {
  FaInstagram,
  FaYoutube,
  FaFacebookF,
  FaWhatsapp,
} from 'react-icons/fa6';
import { generalInfo } from '../../data/siteContent';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#102137] text-slate-300 border-t border-[#183B5B]">
      {/* Top Banner Ribbon — Secondary Navy (#183B5B) with Gold Accents */}
      <div className="bg-[#183B5B] border-b border-[#224D77]/50 py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="flex items-center space-x-3 text-left">
            <div className="w-10 h-10 rounded-full bg-[#102137] flex items-center justify-center text-[#C6A04A] border border-[#C6A04A]/40 shrink-0">
              <Award className="w-5 h-5 text-[#C6A04A] shrink-0" />
            </div>
            <div>
              <p className="text-white font-semibold tracking-wide uppercase text-sm">
                The Malaysia Book of Records — Official Verification (2022)
              </p>
              <p className="text-[#D9B96E] text-xs font-mono">
                Persatuan Aadhiran Silambam Pulau Pinang (Est. 25 Feb 1975) — Oldest Silambam Association in Malaysia
              </p>
            </div>
          </div>
          <Link
            to="/join-training"
            className="inline-flex items-center px-6 py-2.5 rounded-xl bg-[#C6A04A] hover:bg-[#D9B96E] text-[#102137] font-semibold text-sm transition-all duration-200 shadow-sm border border-[#D9B96E] shrink-0"
          >
            <span>Begin Traditional Training</span>
            <ChevronRight className="w-4 h-4 ml-1.5 shrink-0" />
          </Link>
        </div>
      </div>

      {/* Main Footer Columns */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Col 1: About & Lineage Identity */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-3.5">
              <div className="w-12 h-12 rounded-full p-0.5 bg-gradient-to-br from-[#183B5B] via-[#C6A04A] to-[#102137] shadow-md flex-shrink-0">
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden p-0.5">
                  <img
                    src="/logo.png"
                    alt="Aadhiran Silambam Association Emblem"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
              <div>
                <span className="block text-xl font-bold tracking-tight text-white">
                  AADHIRAN SILAMBAM
                </span>
                <span className="block text-xs font-medium text-[#D9B96E] tracking-widest uppercase">
                  ASA • George Town, Penang & Global Hub
                </span>
              </div>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed">
              Persatuan Aadhiran Silambam Pulau Pinang safeguards the ancient 5,000-year Kurunji mountain Tamil martial heritage. Migrated to George Town in 1936 by the 14th direct descendant Grandmaster Mariapakkiam, our unbroken discipline emphasizes authentic stick twirling, intricate footwork, and animal postures without commercial modification.
            </p>

            <div className="pt-2 flex flex-wrap gap-2 text-xs">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#183B5B] border border-[#224D77] text-slate-200 font-medium">
                <Globe className="w-3.5 h-3.5 text-[#C6A04A] shrink-0" />
                <span>UNESCO Living Heritage (2019)</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#183B5B] border border-[#224D77] text-slate-200 font-medium">
                <Award className="w-3.5 h-3.5 text-[#C6A04A] shrink-0" />
                <span>ICHCAP S.Korea (2020)</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#183B5B] border border-[#224D77] text-slate-200 font-medium">
                <Award className="w-3.5 h-3.5 text-[#C6A04A] shrink-0" />
                <span>CNN Travel Featured (2017)</span>
              </span>
            </div>

            {/* Official Social Media Channels */}
            <div className="pt-3">
              <span className="block text-xs font-semibold uppercase tracking-wider text-[#D9B96E] mb-2.5">
                Official Channels & Social
              </span>
              <div className="flex items-center space-x-3" aria-label="Official Social Media Links">
                <a
                  href={generalInfo.socials.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow Aadhiran Silambam on Instagram"
                  className="w-9 h-9 rounded-xl bg-[#183B5B] border border-[#224D77] flex items-center justify-center text-slate-200 hover:text-[#C6A04A] hover:border-[#C6A04A] transition-all"
                >
                  <FaInstagram className="w-4 h-4" />
                </a>
                <a
                  href={generalInfo.socials.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Subscribe to Aadhiran Silambam on YouTube"
                  className="w-9 h-9 rounded-xl bg-[#183B5B] border border-[#224D77] flex items-center justify-center text-slate-200 hover:text-[#C6A04A] hover:border-[#C6A04A] transition-all"
                >
                  <FaYoutube className="w-4 h-4" />
                </a>
                <a
                  href={generalInfo.socials.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Connect with Aadhiran Silambam on Facebook"
                  className="w-9 h-9 rounded-xl bg-[#183B5B] border border-[#224D77] flex items-center justify-center text-slate-200 hover:text-[#C6A04A] hover:border-[#C6A04A] transition-all"
                >
                  <FaFacebookF className="w-4 h-4" />
                </a>
                {generalInfo.socials.whatsapp && (
                  <a
                    href={generalInfo.socials.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Chat with Aadhiran Silambam on WhatsApp"
                    className="w-9 h-9 rounded-xl bg-[#183B5B] border border-[#224D77] flex items-center justify-center text-slate-200 hover:text-[#C6A04A] hover:border-[#C6A04A] transition-all"
                  >
                    <FaWhatsapp className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Col 2: Lineage & History */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white border-b border-[#183B5B] pb-2">
              Lineage & Tradition
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="hover:text-[#D9B96E] transition-colors flex items-center">
                  <ChevronRight className="w-3.5 h-3.5 mr-1 text-[#C6A04A]" />
                  <span>About Association</span>
                </Link>
              </li>
              <li>
                <Link to="/history-lineage" className="hover:text-[#D9B96E] transition-colors flex items-center">
                  <ChevronRight className="w-3.5 h-3.5 mr-1 text-[#C6A04A]" />
                  <span>5,000-Year Heritage</span>
                </Link>
              </li>
              <li>
                <Link to="/instructors" className="hover:text-[#D9B96E] transition-colors flex items-center">
                  <ChevronRight className="w-3.5 h-3.5 mr-1 text-[#C6A04A]" />
                  <span>Masters & Grandmasters</span>
                </Link>
              </li>
              <li>
                <Link to="/heritage-works" className="hover:text-[#D9B96E] transition-colors flex items-center">
                  <ChevronRight className="w-3.5 h-3.5 mr-1 text-[#C6A04A]" />
                  <span>UNESCO Heritage Documentation</span>
                </Link>
              </li>
              <li>
                <Link to="/syllabus" className="hover:text-[#D9B96E] transition-colors flex items-center">
                  <ChevronRight className="w-3.5 h-3.5 mr-1 text-[#C6A04A]" />
                  <span>10-Stage Traditional Syllabus</span>
                </Link>
              </li>
              <li>
                <Link to="/achievements" className="hover:text-[#D9B96E] transition-colors flex items-center">
                  <ChevronRight className="w-3.5 h-3.5 mr-1 text-[#C6A04A]" />
                  <span>Malaysia Book of Records</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Media & Public Pages */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white border-b border-[#183B5B] pb-2">
              Archives & Academy
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/gallery" className="hover:text-[#D9B96E] transition-colors flex items-center">
                  <ChevronRight className="w-3.5 h-3.5 mr-1 text-[#C6A04A]" />
                  <span>Historical Photo Gallery</span>
                </Link>
              </li>
              <li>
                <Link to="/videos" className="hover:text-[#D9B96E] transition-colors flex items-center">
                  <ChevronRight className="w-3.5 h-3.5 mr-1 text-[#C6A04A]" />
                  <span>Combat & Routine Videos</span>
                </Link>
              </li>
              <li>
                <Link to="/events" className="hover:text-[#D9B96E] transition-colors flex items-center">
                  <ChevronRight className="w-3.5 h-3.5 mr-1 text-[#C6A04A]" />
                  <span>Upcoming Events & Guru Pooja</span>
                </Link>
              </li>
              <li>
                <Link to="/news" className="hover:text-[#D9B96E] transition-colors flex items-center">
                  <ChevronRight className="w-3.5 h-3.5 mr-1 text-[#C6A04A]" />
                  <span>News & Research Blog</span>
                </Link>
              </li>
              <li>
                <Link to="/partners-press" className="hover:text-[#D9B96E] transition-colors flex items-center">
                  <ChevronRight className="w-3.5 h-3.5 mr-1 text-[#C6A04A]" />
                  <span>Press Coverage & Partners</span>
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="hover:text-[#D9B96E] transition-colors flex items-center">
                  <ChevronRight className="w-3.5 h-3.5 mr-1 text-[#C6A04A]" />
                  <span>Privacy Policy & Ethics</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Academy Headquarters */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white border-b border-[#183B5B] pb-2">
              Heritage Headquarters
            </h3>
            <div className="space-y-3 text-xs text-slate-300">
              <div className="flex items-start space-x-2.5">
                <MapPin className="w-4 h-4 text-[#C6A04A] shrink-0 mt-0.5" />
                <span>
                  Lebuh King, George Town,<br />
                  10200 Penang, Malaysia<br />
                  (UNESCO World Heritage City)
                </span>
              </div>
              <div className="flex items-center space-x-2.5">
                <Phone className="w-4 h-4 text-[#C6A04A] shrink-0" />
                <a href="tel:+60164147856" className="hover:text-[#D9B96E] transition-colors">
                  +60 16-414 7856
                </a>
              </div>
              <div className="flex items-center space-x-2.5">
                <Mail className="w-4 h-4 text-[#C6A04A] shrink-0" />
                <a href="mailto:info@aadhiran.com" className="hover:text-[#D9B96E] transition-colors">
                  info@aadhiran.com
                </a>
              </div>
            </div>

            <div className="pt-3">
              <Link
                to="/join-training"
                className="w-full inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-[#183B5B] hover:bg-[#224D77] text-white text-xs font-semibold border border-[#C6A04A]/60 transition-colors"
              >
                <span>Register for Training</span>
                <ChevronRight className="w-3.5 h-3.5 ml-1 text-[#D9B96E]" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Legal Notice Bar */}
      <div className="border-t border-[#183B5B] bg-[#0B1726] py-5 px-4 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <p>
            © {new Date().getFullYear()} Persatuan Aadhiran Silambam Pulau Pinang (PPM-014-07-25021975). All rights reserved.
          </p>
          <div className="flex items-center space-x-4 text-slate-400">
            <Link to="/privacy-policy" className="hover:text-slate-200 transition-colors">
              Privacy Policy
            </Link>
            <span>•</span>
            <Link to="/contact" className="hover:text-slate-200 transition-colors">
              Contact
            </Link>
            <span>•</span>
            <Link to="/admin/login" className="hover:text-[#D9B96E] transition-colors">
              Admin CMS
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
