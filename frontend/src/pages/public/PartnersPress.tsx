import React from 'react';
import { Link } from 'react-router-dom';
import {
  ExternalLink,
  Quote,
  Newspaper,
} from 'lucide-react';
import { partnersPressList } from '../../data';

export const PartnersPress: React.FC = () => {
  return (
    <div className="bg-charcoal-950 text-gray-200">
      {/* Header Banner */}
      <section className="relative py-24 bg-gradient-to-b from-charcoal-900 to-charcoal-950 border-b border-charcoal-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-crimson-950 border border-crimson-700/60 text-gold-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <Newspaper className="w-3.5 h-3.5 text-crimson-500" />
            <span>Media Spotlight & Institutional Alliances</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-display font-extrabold text-white tracking-tight">
            Partners & Press Coverage
          </h1>
          <p className="mt-3 text-lg font-display text-gold-400 font-semibold tracking-wide">
            பத்திரிகை செய்திகள் மற்றும் கூட்டமைப்புகள் • International Accolades
          </p>
          <div className="flex items-center justify-center space-x-2 text-xs text-gray-400 mt-4">
            <Link to="/" className="hover:text-gold-400">Home</Link>
            <span>/</span>
            <span className="text-gray-300">Partners & Press</span>
          </div>
        </div>
      </section>

      {/* CNN Travel Spotlight */}
      <section className="py-16 border-b border-charcoal-800 bg-charcoal-900/60">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-charcoal-900 via-charcoal-950 to-crimson-950/60 border border-crimson-800/60 shadow-2xl relative overflow-hidden">
            <div className="absolute top-6 right-8 text-charcoal-800 pointer-events-none">
              <Quote className="w-24 h-24 opacity-30 text-crimson-500" />
            </div>

            <div className="relative z-10 space-y-6">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded bg-crimson-600 text-white font-mono text-xs font-bold uppercase">
                <span>CNN International Feature</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-display font-bold text-white">
                "9 Reasons to Visit Penang That Have Nothing to Do with Street Food"
              </h2>

              <p className="text-base sm:text-lg text-gray-300 italic leading-relaxed">
                "Beyond the hawker centers and colonial mansions, George Town is home to living martial traditions that date back millennia. Aadhiran Silambam preserves ancient stick-fighting and intricate footwork brought over by Tamil migrants, an exhilarating testament to the island's enduring cultural tapestry."
              </p>

              <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-charcoal-800">
                <span className="text-xs font-mono text-gold-400">
                  Published: 14th February 2017 • CNN Travel
                </span>

                <a
                  href="https://edition.cnn.com/travel/article/penang-not-about-street-food/index.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 rounded-lg bg-crimson-600 hover:bg-crimson-500 text-white font-semibold text-xs uppercase tracking-wider transition-colors shadow"
                >
                  <span>Read Full CNN Article</span>
                  <ExternalLink className="w-3.5 h-3.5 ml-2" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Press Coverage Grid */}
      <section className="py-20 border-b border-charcoal-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {partnersPressList.map((item) => (
              <div
                key={item.id}
                className="p-8 rounded-2xl bg-charcoal-900 border border-charcoal-800 hover:border-gold-500/50 transition-all flex flex-col justify-between space-y-6 shadow-xl"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-crimson-400 uppercase">
                      {item.organization_name}
                    </span>
                    {item.publication_date && (
                      <span className="text-xs font-mono text-gray-500">
                        {new Date(item.publication_date).getFullYear()}
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-display font-bold text-white">
                    {item.title}
                  </h3>

                  {item.quote_or_excerpt && (
                    <p className="text-xs sm:text-sm text-gray-300 leading-relaxed italic bg-charcoal-950 p-4 rounded-xl border border-charcoal-800">
                      "{item.quote_or_excerpt.replace(/^"|"$/g, '')}"
                    </p>
                  )}
                </div>

                {item.article_url && (
                  <div className="pt-4 border-t border-charcoal-800">
                    <a
                      href={item.article_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-xs font-semibold text-gold-400 hover:text-gold-300 transition-colors"
                    >
                      <span>View Official Source / Coverage</span>
                      <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
