import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ExternalLink,
  Quote,
  Newspaper,
} from 'lucide-react';
import { partnersPressList } from '../../data';
import { publicApi } from '../../services/api';
import type { PartnerPress } from '../../types';

export const PartnersPress: React.FC = () => {
  const [items, setItems] = useState<PartnerPress[]>(partnersPressList);

  useEffect(() => {
    publicApi
      .getPartnersPress()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setItems(data);
        }
      })
      .catch((err) => {
        console.warn('Using static partners press fallback:', err?.message || err);
      });
  }, []);

  return (
    <div className="bg-[#FDFBF7] text-[#182332]">
      {/* Header Banner - Deep Heritage Navy */}
      <section className="relative py-20 sm:py-24 bg-[#102137] border-b border-[#183B5B] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#183B5B]/80 border border-[#C6A04A]/50 text-[#D9B96E] text-xs font-semibold uppercase tracking-wider mb-4 shadow-sm">
            <Newspaper className="w-3.5 h-3.5 text-[#C6A04A] shrink-0" />
            <span>Media Spotlight & Institutional Alliances</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-display font-bold text-white tracking-tight">
            Partners & Press Coverage
          </h1>
          <p className="mt-3 text-lg font-display text-[#D9B96E] font-medium tracking-wide">
            பத்திரிகை செய்திகள் மற்றும் கூட்டமைப்புகள் • International Accolades
          </p>
          <div className="flex items-center justify-center space-x-2 text-xs text-white/70 mt-4">
            <Link to="/" className="hover:text-[#D9B96E] transition-colors">Home</Link>
            <span>/</span>
            <span className="text-[#D9B96E] font-medium">Partners & Press</span>
          </div>
        </div>
      </section>

      {/* CNN Travel Spotlight */}
      <section className="py-16 border-b border-[#E8E3D9] bg-[#F8F5EE]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 sm:p-12 rounded-3xl bg-[#102137] border border-[#183B5B] shadow-xl relative overflow-hidden text-white">
            <div className="absolute top-6 right-8 pointer-events-none">
              <Quote className="w-24 h-24 opacity-10 text-[#C6A04A] shrink-0" />
            </div>

            <div className="relative z-10 space-y-6">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-lg bg-[#183B5B] text-[#D9B96E] font-mono text-xs font-bold uppercase shadow-sm border border-[#C6A04A]/30">
                <span>CNN International Feature</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-display font-bold text-white">
                "9 Reasons to Visit Penang That Have Nothing to Do with Street Food"
              </h2>

              <p className="text-base sm:text-lg text-white/90 italic leading-relaxed">
                "Beyond the hawker centers and colonial mansions, George Town is home to living martial traditions that date back millennia. Aadhiran Silambam preserves ancient stick-fighting and intricate footwork brought over by Tamil migrants, an exhilarating testament to the island's enduring cultural tapestry."
              </p>

              <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/10">
                <span className="text-xs font-mono text-[#D9B96E] font-medium">
                  Published: 14th February 2017 • CNN Travel
                </span>

                <a
                  href="https://edition.cnn.com/travel/article/penang-not-about-street-food/index.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-5 py-2.5 rounded-xl bg-[#C6A04A] hover:bg-[#D9B96E] text-[#102137] font-bold text-xs uppercase tracking-wider transition-all shadow-sm"
                >
                  <span>Read Full CNN Article</span>
                  <ExternalLink className="w-3.5 h-3.5 ml-2 shrink-0" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Press Coverage Grid */}
      <section className="py-20 border-b border-[#E8E3D9] bg-[#FDFBF7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {items.map((item) => (
              <div
                key={item.id}
                className="p-8 rounded-2xl bg-white border border-[#E8E3D9] hover:border-[#C6A04A] transition-all flex flex-col justify-between space-y-6 shadow-sm hover:shadow-md"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-[#C6A04A] uppercase">
                      {item.organization_name}
                    </span>
                    {item.publication_date && (
                      <span className="text-xs font-mono text-[#64748B]">
                        {new Date(item.publication_date).getFullYear()}
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-display font-bold text-[#102137]">
                    {item.title}
                  </h3>

                  {item.quote_or_excerpt && (
                    <p className="text-xs sm:text-sm text-[#182332] leading-relaxed italic bg-[#F8F5EE] p-4 rounded-xl border border-[#E8E3D9]">
                      "{item.quote_or_excerpt.replace(/^"|"$/g, '')}"
                    </p>
                  )}
                </div>

                {item.article_url && (
                  <div className="pt-4 border-t border-[#E8E3D9]">
                    <a
                      href={item.article_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-xs font-semibold text-[#102137] hover:text-[#C6A04A] transition-colors"
                    >
                      <span>View Official Source / Coverage</span>
                      <ExternalLink className="w-3.5 h-3.5 ml-1.5 text-[#C6A04A] shrink-0" />
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
