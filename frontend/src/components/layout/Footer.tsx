import React from 'react';
import { Link } from 'react-router-dom';
import {
  Phone,
  Mail,
  MapPin,
  Award,
  ChevronRight,
  Globe,
  ArrowRight,
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
    <footer className="bg-[#0B1726] text-slate-300 border-t border-[#183B5B]">
      {/* 1. Pre-Footer Call to Action Banner (Sports Inspiration from Anchor Sports World) */}
      <div className="bg-[#102137] border-b border-[#183B5B] py-8 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="flex items-center space-x-4 text-left">
            <div className="w-12 h-12 rounded-2xl bg-[#0B1726] flex items-center justify-center text-[#C6A04A] border border-[#C6A04A]/40 shrink-0 shadow-md">
              <Award className="w-6 h-6 text-[#C6A04A] shrink-0" />
            </div>
            <div>
              <p className="text-white font-display font-bold tracking-wide uppercase text-base">
                Certified by The Malaysia Book of Records (2022)
              </p>
              <p className="text-[#D9B96E] text-xs font-medium">
                Oldest Traditional Silambam Martial Arts Association in Malaysia • Founded 1975
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 shrink-0">
            <Link
              to="/join-training"
              className="btn-sports-primary text-xs uppercase"
            >
              <span>Join Training</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Main Footer Columns */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Col 1 & 2: Brand & Institution Overview */}
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
                <span className="block text-xl font-display font-extrabold tracking-tight text-white">
                  AADHIRAN SILAMBAM
                </span>
                <span className="block text-xs font-semibold text-[#D9B96E] tracking-widest uppercase">
                  Traditional Martial Arts Academy • George Town, Penang
                </span>
              </div>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed font-sans">
              Safeguarding ancient Tamil martial arts heritage in George Town since 1975. Malaysia's oldest Silambam association officially certified by The Malaysia Book of Records.
            </p>

            <div className="pt-2 flex flex-wrap gap-2 text-xs">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#102137] border border-[#183B5B] text-slate-200 font-medium">
                <Globe className="w-3.5 h-3.5 text-[#C6A04A] shrink-0" />
                <span>UNESCO Living Heritage (2019)</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#102137] border border-[#183B5B] text-slate-200 font-medium">
                <Award className="w-3.5 h-3.5 text-[#C6A04A] shrink-0" />
                <span>MBOR National Record (2022)</span>
              </span>
            </div>

            {/* Social Media Channels */}
            <div className="pt-3">
              <span className="block text-xs font-display font-bold uppercase tracking-wider text-[#D9B96E] mb-3">
                Follow & Connect With Us
              </span>
              <div className="flex items-center space-x-3" aria-label="Official Social Media Links">
                <a
                  href={generalInfo.socials.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow Aadhiran Silambam on Instagram"
                  className="w-10 h-10 rounded-xl bg-[#102137] border border-[#183B5B] flex items-center justify-center text-slate-200 hover:text-[#C6A04A] hover:border-[#C6A04A] transition-all"
                >
                  <FaInstagram className="w-5 h-5" />
                </a>
                <a
                  href={generalInfo.socials.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Subscribe to Aadhiran Silambam on YouTube"
                  className="w-10 h-10 rounded-xl bg-[#102137] border border-[#183B5B] flex items-center justify-center text-slate-200 hover:text-[#C6A04A] hover:border-[#C6A04A] transition-all"
                >
                  <FaYoutube className="w-5 h-5" />
                </a>
                <a
                  href={generalInfo.socials.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Connect with Aadhiran Silambam on Facebook"
                  className="w-10 h-10 rounded-xl bg-[#102137] border border-[#183B5B] flex items-center justify-center text-slate-200 hover:text-[#C6A04A] hover:border-[#C6A04A] transition-all"
                >
                  <FaFacebookF className="w-4 h-4" />
                </a>
                {generalInfo.socials.whatsapp && (
                  <a
                    href={generalInfo.socials.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Chat with Aadhiran Silambam on WhatsApp"
                    className="w-10 h-10 rounded-xl bg-[#102137] border border-[#183B5B] flex items-center justify-center text-slate-200 hover:text-[#C6A04A] hover:border-[#C6A04A] transition-all"
                  >
                    <FaWhatsapp className="w-5 h-5" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Col 3: Lineage & Programmes */}
          <div className="space-y-3">
            <h3 className="text-sm font-display font-bold uppercase tracking-wider text-white border-b border-[#183B5B] pb-2">
              Academy & Syllabus
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/training-syllabus" className="hover:text-[#D9B96E] transition-colors flex items-center">
                  <ChevronRight className="w-3.5 h-3.5 mr-1 text-[#C6A04A]" />
                  <span>10-Stage Training Syllabus</span>
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#D9B96E] transition-colors flex items-center">
                  <ChevronRight className="w-3.5 h-3.5 mr-1 text-[#C6A04A]" />
                  <span>About Academy & Heritage</span>
                </Link>
              </li>
              <li>
                <Link to="/history-lineage" className="hover:text-[#D9B96E] transition-colors flex items-center">
                  <ChevronRight className="w-3.5 h-3.5 mr-1 text-[#C6A04A]" />
                  <span>5,000-Year Ancient Lineage</span>
                </Link>
              </li>
              <li>
                <Link to="/instructors" className="hover:text-[#D9B96E] transition-colors flex items-center">
                  <ChevronRight className="w-3.5 h-3.5 mr-1 text-[#C6A04A]" />
                  <span>Grandmasters & Coaches</span>
                </Link>
              </li>
              <li>
                <Link to="/achievements" className="hover:text-[#D9B96E] transition-colors flex items-center">
                  <ChevronRight className="w-3.5 h-3.5 mr-1 text-[#C6A04A]" />
                  <span>Malaysia Book of Records</span>
                </Link>
              </li>
              <li>
                <Link to="/heritage-works" className="hover:text-[#D9B96E] transition-colors flex items-center">
                  <ChevronRight className="w-3.5 h-3.5 mr-1 text-[#C6A04A]" />
                  <span>UNESCO Documentation</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Media & Schedules */}
          <div className="space-y-3">
            <h3 className="text-sm font-display font-bold uppercase tracking-wider text-white border-b border-[#183B5B] pb-2">
              Media & Updates
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/gallery" className="hover:text-[#D9B96E] transition-colors flex items-center">
                  <ChevronRight className="w-3.5 h-3.5 mr-1 text-[#C6A04A]" />
                  <span>Photo Gallery</span>
                </Link>
              </li>
              <li>
                <Link to="/videos" className="hover:text-[#D9B96E] transition-colors flex items-center">
                  <ChevronRight className="w-3.5 h-3.5 mr-1 text-[#C6A04A]" />
                  <span>Demonstration Videos</span>
                </Link>
              </li>
              <li>
                <Link to="/events" className="hover:text-[#D9B96E] transition-colors flex items-center">
                  <ChevronRight className="w-3.5 h-3.5 mr-1 text-[#C6A04A]" />
                  <span>Events & Tournaments</span>
                </Link>
              </li>
              <li>
                <Link to="/news" className="hover:text-[#D9B96E] transition-colors flex items-center">
                  <ChevronRight className="w-3.5 h-3.5 mr-1 text-[#C6A04A]" />
                  <span>News & Dispatches</span>
                </Link>
              </li>
              <li>
                <Link to="/partners-press" className="hover:text-[#D9B96E] transition-colors flex items-center">
                  <ChevronRight className="w-3.5 h-3.5 mr-1 text-[#C6A04A]" />
                  <span>Press & Affiliates</span>
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="hover:text-[#D9B96E] transition-colors flex items-center">
                  <ChevronRight className="w-3.5 h-3.5 mr-1 text-[#C6A04A]" />
                  <span>Privacy Policy</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 5: Academy Headquarters & Contact */}
          <div className="space-y-3">
            <h3 className="text-sm font-display font-bold uppercase tracking-wider text-white border-b border-[#183B5B] pb-2">
              Headquarters Dojo
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
                <a href="tel:+60164147856" className="hover:text-[#D9B96E] transition-colors font-medium">
                  +60 16-414 7856
                </a>
              </div>
              <div className="flex items-center space-x-2.5">
                <Mail className="w-4 h-4 text-[#C6A04A] shrink-0" />
                <a href="mailto:info@aadhiran.com" className="hover:text-[#D9B96E] transition-colors font-medium">
                  info@aadhiran.com
                </a>
              </div>
            </div>

            <div className="pt-3">
              <Link
                to="/join-training"
                className="w-full inline-flex items-center justify-center px-4 py-3 rounded-xl bg-[#102137] hover:bg-[#183B5B] text-white text-xs font-display font-bold uppercase tracking-wider border border-[#C6A04A]/60 transition-colors shadow-sm"
              >
                <span>Register for Trial</span>
                <ChevronRight className="w-3.5 h-3.5 ml-1 text-[#D9B96E]" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Bottom Legal Notice Bar */}
      <div className="border-t border-[#183B5B] bg-[#070E17] py-6 px-4 text-xs text-slate-400">
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
            <Link to="/admin/login" className="hover:text-[#D9B96E] font-medium transition-colors">
              Admin Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
