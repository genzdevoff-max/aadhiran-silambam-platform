import React from 'react';
import { Link } from 'react-router-dom';
import {
  Globe,
  ExternalLink,
  FileText,
} from 'lucide-react';
import { heritageProjectsList } from '../../data';

export const HeritageWorks: React.FC = () => {
  return (
    <div className="bg-charcoal-950 text-gray-200">
      {/* Header Banner */}
      <section className="relative py-24 bg-gradient-to-b from-charcoal-900 to-charcoal-950 border-b border-charcoal-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-crimson-950 border border-crimson-700/60 text-gold-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <Globe className="w-3.5 h-3.5 text-crimson-500" />
            <span>Living Heritage Projects</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-display font-extrabold text-white tracking-tight">
            Heritage Projects & Our Works
          </h1>
          <p className="mt-3 text-lg font-display text-gold-400 font-semibold tracking-wide">
            பாரம்பரிய ஆவணப்பணிகள் • Safeguarding Living Intangible Culture
          </p>
          <div className="flex items-center justify-center space-x-2 text-xs text-gray-400 mt-4">
            <Link to="/" className="hover:text-gold-400">Home</Link>
            <span>/</span>
            <span className="text-gray-300">Heritage Projects</span>
          </div>
        </div>
      </section>

      {/* Main Works Grid */}
      <section className="py-20 border-b border-charcoal-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {heritageProjectsList.map((project, idx) => (
            <div
              key={project.id}
              className={`grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-8 rounded-3xl bg-charcoal-900 border border-charcoal-800 hover:border-gold-500/40 transition-all shadow-xl ${
                idx % 2 === 1 ? 'lg:flex-row-reverse' : ''
              }`}
            >
              <div className="lg:col-span-5 relative rounded-2xl overflow-hidden border border-charcoal-700 h-72 bg-charcoal-950">
                <img
                  src={project.cover_image_url || '/uploads/screenshot-2019-06-09-at-5-17-22-am_orig.png'}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 px-3 py-1 rounded bg-charcoal-950/85 backdrop-blur-sm border border-charcoal-700 text-gold-400 font-mono text-xs font-bold">
                  {project.year}
                </div>
              </div>

              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-mono font-bold text-crimson-400 uppercase tracking-wider">
                    {project.organization}
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-display font-bold text-white">
                  {project.title}
                </h3>

                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                  {project.overview}
                </p>

                <div className="p-4 rounded-xl bg-charcoal-950 border border-charcoal-800">
                  <span className="text-xs font-mono font-bold text-gold-400 uppercase tracking-wider block mb-1">
                    Cultural Significance & Impact:
                  </span>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    {project.cultural_significance}
                  </p>
                </div>

                {project.document_url && (
                  <div className="pt-2">
                    <a
                      href={project.document_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-xs font-semibold text-gold-400 hover:text-gold-300 transition-colors"
                    >
                      <FileText className="w-4 h-4 mr-1.5" />
                      <span>View Official Publication / Document</span>
                      <ExternalLink className="w-3.5 h-3.5 ml-1" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Community NGO Collaborations */}
      <section className="py-20 bg-charcoal-900/40 border-b border-charcoal-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-display font-bold text-white mb-4">
            Collaborations with Cultural Organizations & NGOs
          </h2>
          <p className="text-sm text-gray-300 leading-relaxed mb-8">
            Persatuan Aadhiran Silambam Pulau Pinang regularly partners with George Town World Heritage Incorporated (GTWHI), Penang Heritage Trust, Think City, local schools, and university researchers to document and safeguard the living heritage of ancient Tamil martial disciplines in Malaysia.
          </p>
          <Link
            to="/contact"
            className="px-6 py-3 rounded-lg bg-crimson-600 hover:bg-crimson-500 text-white font-semibold text-xs tracking-wider uppercase transition-colors shadow-md shadow-crimson-900/40"
          >
            Propose a Heritage Collaboration →
          </Link>
        </div>
      </section>
    </div>
  );
};
