import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Award,
  ExternalLink,
  Filter,
  Eye,
} from 'lucide-react';
import { achievementsList } from '../../data';
import type { Achievement } from '../../types';

export const Achievements: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);

  // Extract unique categories from authentic achievements
  const categories = Array.from(new Set(achievementsList.map((a) => a.category)));

  const filteredAchievements = selectedCategory === 'all'
    ? achievementsList
    : achievementsList.filter((a) => a.category.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <div className="bg-[#FDFBF7] text-slate-800">
      {/* Header Banner - Deep Navy */}
      <section className="relative py-20 sm:py-24 bg-gradient-to-b from-[#0B1B3D] to-navy-950 border-b border-navy-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-navy-900/90 border border-amber-400/40 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-4 shadow-sm">
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span>Documented Accolades & Records</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-display font-extrabold text-white tracking-tight">
            Achievements & Awards
          </h1>
          <p className="mt-3 text-lg font-display text-amber-300 font-semibold tracking-wide">
            சாதனைகளும் விருதுகளும் • Official Verifications & Historic Milestones
          </p>
          <div className="flex items-center justify-center space-x-2 text-xs text-slate-300 mt-4">
            <Link to="/" className="hover:text-amber-300">Home</Link>
            <span>/</span>
            <span className="text-amber-200">Achievements</span>
          </div>
        </div>
      </section>

      {/* Filter Ribbon - Clean White Sticky Bar */}
      <section className="py-4 bg-white/95 border-b border-stone-200 sticky top-[65px] z-30 backdrop-blur-md shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-amber-600" />
            <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Filter By Category:
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                selectedCategory === 'all'
                  ? 'bg-[#0B1B3D] text-white shadow-sm'
                  : 'bg-stone-100 text-slate-700 hover:bg-stone-200'
              }`}
            >
              All Accolades ({achievementsList.length})
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                  selectedCategory.toLowerCase() === cat.toLowerCase()
                    ? 'bg-[#0B1B3D] text-white shadow-sm'
                    : 'bg-stone-100 text-slate-700 hover:bg-stone-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements Cards */}
      <section className="py-16 sm:py-20 border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredAchievements.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl bg-white border border-stone-200 overflow-hidden hover:border-amber-400 transition-all duration-300 flex flex-col group shadow-sm hover:shadow-md"
              >
                {item.cover_image_url && (
                  <div className="relative h-56 overflow-hidden bg-stone-100">
                    <img
                      src={item.cover_image_url}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3 px-3 py-1 rounded bg-navy-950/85 backdrop-blur-sm border border-navy-700 text-amber-300 text-xs font-mono font-bold">
                      {item.year}
                    </div>
                    {item.is_featured && (
                      <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded bg-crimson-600 text-white text-[10px] font-bold uppercase tracking-wider shadow">
                        Featured Milestone
                      </div>
                    )}
                  </div>
                )}

                <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                  <div>
                    <span className="text-[11px] font-mono text-crimson-600 uppercase tracking-wider font-semibold block mb-1">
                      {item.category}
                    </span>
                    <h3 className="text-xl font-display font-bold text-[#0B1B3D] group-hover:text-amber-700 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs font-semibold text-slate-700 mt-2">
                      Conferred by: <span className="text-amber-700">{item.awarding_organization}</span>
                    </p>
                    <p className="text-xs text-slate-600 mt-3 leading-relaxed line-clamp-4">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-xs">
                    <button
                      onClick={() => setSelectedAchievement(item)}
                      className="text-amber-700 hover:text-amber-800 font-semibold flex items-center transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5 mr-1" />
                      <span>View Details & Evidence</span>
                    </button>

                    {item.evidence_url && (
                      <a
                        href={item.evidence_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-400 hover:text-[#0B1B3D] flex items-center transition-colors"
                        title="Open external source"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Detail Modal */}
      {selectedAchievement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl bg-white rounded-2xl overflow-hidden border border-stone-200 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-4 bg-[#0B1B3D] flex justify-between items-center border-b border-navy-800 text-white">
              <span className="text-xs font-mono font-bold text-amber-300 uppercase">
                {selectedAchievement.category} • {selectedAchievement.year}
              </span>
              <button
                onClick={() => setSelectedAchievement(null)}
                className="text-slate-300 hover:text-white px-2.5 py-1 rounded bg-navy-800 text-sm transition-colors"
              >
                ✕ Close
              </button>
            </div>

            {selectedAchievement.cover_image_url && (
              <div className="h-64 bg-stone-900 overflow-hidden flex items-center justify-center">
                <img
                  src={selectedAchievement.cover_image_url}
                  alt={selectedAchievement.title}
                  className="w-full h-full object-contain"
                />
              </div>
            )}

            <div className="p-6 space-y-4">
              <h3 className="text-2xl font-display font-bold text-[#0B1B3D]">
                {selectedAchievement.title}
              </h3>
              <p className="text-xs font-semibold text-amber-800">
                Awarding Organization: {selectedAchievement.awarding_organization}
              </p>
              {selectedAchievement.date_awarded && (
                <p className="text-xs text-slate-500">
                  Date Conferred: {new Date(selectedAchievement.date_awarded).toLocaleDateString()}
                </p>
              )}

              <p className="text-sm text-slate-700 leading-relaxed pt-2 border-t border-stone-100">
                {selectedAchievement.description}
              </p>

              {selectedAchievement.evidence_url && (
                <div className="pt-4">
                  <a
                    href={selectedAchievement.evidence_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs tracking-wider uppercase transition-colors shadow-sm"
                  >
                    <span>Visit External Verification Source</span>
                    <ExternalLink className="w-3.5 h-3.5 ml-2" />
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
