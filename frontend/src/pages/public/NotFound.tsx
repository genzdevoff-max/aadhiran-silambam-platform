import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Home, Compass, Phone, Flame } from 'lucide-react';

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-[75vh] flex items-center justify-center bg-charcoal-950 text-gray-200 px-4 py-20">
      <div className="max-w-xl w-full text-center space-y-6">
        <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-crimson-600 to-charcoal-900 border border-crimson-500/40 flex items-center justify-center text-gold-400 shadow-glow-crimson">
          <Shield className="w-10 h-10" />
        </div>

        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-crimson-950/80 border border-crimson-800/80 text-gold-400 text-xs font-semibold uppercase tracking-wider">
          <Flame className="w-3.5 h-3.5 text-crimson-500" />
          <span>Error 404 • Path Displaced</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-display font-extrabold text-white tracking-tight">
          Page Not Found
        </h1>

        <p className="text-sm sm:text-base text-gray-400 leading-relaxed max-w-md mx-auto">
          Like an elusive deceptive footwork maneuver in Kaaladi Varisai, the page you seek has shifted or does not exist. Return to familiar ground below.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
          <Link
            to="/"
            className="inline-flex items-center px-5 py-2.5 rounded-lg bg-crimson-600 hover:bg-crimson-500 text-white font-semibold text-sm transition-colors shadow-lg shadow-crimson-900/40"
          >
            <Home className="w-4 h-4 mr-2" />
            <span>Return to Home</span>
          </Link>
          <Link
            to="/training-syllabus"
            className="inline-flex items-center px-5 py-2.5 rounded-lg bg-charcoal-900 hover:bg-charcoal-800 border border-charcoal-700 text-gray-300 hover:text-white font-semibold text-sm transition-colors"
          >
            <Compass className="w-4 h-4 mr-2 text-gold-400" />
            <span>10-Stage Syllabus</span>
          </Link>
          <Link
            to="/contact"
            className="inline-flex items-center px-5 py-2.5 rounded-lg bg-charcoal-900 hover:bg-charcoal-800 border border-charcoal-700 text-gray-300 hover:text-white font-semibold text-sm transition-colors"
          >
            <Phone className="w-4 h-4 mr-2 text-crimson-400" />
            <span>Contact Headquarters</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
