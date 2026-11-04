import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Home, Compass, Phone, Sparkles } from 'lucide-react';

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-[75vh] flex items-center justify-center bg-[#FDFBF7] text-[#182332] px-4 py-20">
      <div className="max-w-xl w-full text-center space-y-6">
        <div className="w-20 h-20 mx-auto rounded-2xl bg-[#102137] border-2 border-[#C6A04A]/60 flex items-center justify-center text-[#D9B96E] shadow-xl">
          <Shield className="w-10 h-10 shrink-0" />
        </div>

        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#F8F5EE] border border-[#E8E3D9] text-[#102137] text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-[#C6A04A] shrink-0" />
          <span>Error 404 • Path Displaced</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-bold text-[#182332] tracking-tight">
          Page Not Found
        </h1>

        <p className="text-sm sm:text-base text-[#64748B] leading-relaxed max-w-md mx-auto">
          Like an elusive deceptive footwork maneuver in Kaaladi Varisai, the page you seek has shifted or does not exist. Return to familiar ground below.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 rounded-xl bg-[#102137] hover:bg-[#183B5B] text-white font-semibold text-xs tracking-wider uppercase transition-all shadow-sm border border-[#C6A04A]/40"
          >
            <Home className="w-4 h-4 mr-2 shrink-0 text-[#C6A04A]" />
            <span>Return to Home</span>
          </Link>
          <Link
            to="/training-syllabus"
            className="inline-flex items-center px-5 py-3 rounded-xl bg-white hover:bg-[#F8F5EE] border border-[#E8E3D9] hover:border-[#C6A04A] text-[#182332] font-semibold text-xs tracking-wider uppercase transition-all shadow-xs"
          >
            <Compass className="w-4 h-4 mr-2 text-[#C6A04A] shrink-0" />
            <span>10-Stage Syllabus</span>
          </Link>
          <Link
            to="/contact"
            className="inline-flex items-center px-5 py-3 rounded-xl bg-white hover:bg-[#F8F5EE] border border-[#E8E3D9] hover:border-[#C6A04A] text-[#182332] font-semibold text-xs tracking-wider uppercase transition-all shadow-xs"
          >
            <Phone className="w-4 h-4 mr-2 text-[#C6A04A] shrink-0" />
            <span>Contact Headquarters</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
