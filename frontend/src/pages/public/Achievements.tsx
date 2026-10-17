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
    <div className="bg-charcoal-950 text-gray-200">
      {/* Header Banner */}
      <section className="relative py-24 bg-gradient-to-b from-charcoal-900 to-charcoal-950 border-b border-charcoal-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-crimson-950 border border-crimson-700/60 text-gold-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <Award className="w-3.5 h-3.5 text-crimson-500" />
            <span>Documented Accolades & Records</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-display font-extrabold text-white tracking-tight">
            Achievements & Awards
          </h1>
          <p className="mt-3 text-lg font-display text-gold-400 font-semibold tracking-wide">
            சாதனைகளும் விருதுகளும் • Official Verifications & Historic Milestones
          </p>
          <div className="flex items-center justify-center space-x-2 text-xs text-gray-400 mt-4">
            <Link to="/" className="hover:text-gold-400">Home</Link>
            <span>/</span>
            <span className="text-gray-300">Achievements</span>
          </div>
        </div>
      </section>

      {/* Filter Ribbon */}
      <section className="py-6 bg-charcoal-900/60 border-b border-charcoal-800 sticky top-[65px] z-30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gold-400" />
            <span className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
              Filter By Category:
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                selectedCategory === 'all'
                  ? 'bg-crimson-600 text-white shadow-md'
                  : 'bg-charcoal-800 text-gray-300 hover:bg-charcoal-700'
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
                    ? 'bg-crimson-600 text-white shadow-md'
                    : 'bg-charcoal-800 text-gray-300 hover:bg-charcoal-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements Cards */}
      <section className="py-20 border-b border-charcoal-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredAchievements.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl bg-charcoal-900 border border-charcoal-800 overflow-hidden hover:border-gold-500/50 transition-all duration-300 flex flex-col group shadow-xl"
              >
                {item.cover_image_url && (
                  <div className="relative h-56 overflow-hidden bg-charcoal-950">
                    <img
                      src={item.cover_image_url}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3 px-3 py-1 rounded bg-charcoal-950/85 backdrop-blur-sm border border-charcoal-700 text-gold-400 text-xs font-mono font-bold">
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
                    <span className="text-[11px] font-mono text-crimson-400 uppercase tracking-wider font-semibold block mb-1">
                      {item.category}
                    </span>
                    <h3 className="text-xl font-display font-bold text-white group-hover:text-gold-300 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs font-semibold text-gray-300 mt-2">
                      Conferred by: <span className="text-gold-400">{item.awarding_organization}</span>
                    </p>
                    <p className="text-xs text-gray-400 mt-3 leading-relaxed line-clamp-4">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-charcoal-800 flex items-center justify-between text-xs">
                    <button
                      onClick={() => setSelectedAchievement(item)}
                      className="text-gold-400 hover:text-gold-300 font-semibold flex items-center transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5 mr-1" />
                      <span>View Details & Evidence</span>
                    </button>

                    {item.evidence_url && (
                      <a
                        href={item.evidence_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-white flex items-center transition-colors"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl bg-charcoal-900 rounded-2xl overflow-hidden border border-charcoal-700 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-4 bg-charcoal-950 flex justify-between items-center border-b border-charcoal-800">
              <span className="text-xs font-mono font-bold text-crimson-400 uppercase">
                {selectedAchievement.category} • {selectedAchievement.year}
              </span>
              <button
                onClick={() => setSelectedAchievement(null)}
                className="text-gray-400 hover:text-white px-2.5 py-1 rounded bg-charcoal-800 text-sm transition-colors"
              >
                ✕ Close
              </button>
            </div>

            {selectedAchievement.cover_image_url && (
              <div className="h-64 bg-black overflow-hidden">
                <img
                  src={selectedAchievement.cover_image_url}
                  alt={selectedAchievement.title}
                  className="w-full h-full object-contain"
                />
              </div>
            )}

            <div className="p-6 space-y-4">
              <h3 className="text-2xl font-display font-bold text-white">
                {selectedAchievement.title}
              </h3>
              <p className="text-xs font-semibold text-gold-400">
                Awarding Organization: {selectedAchievement.awarding_organization}
              </p>
              {selectedAchievement.date_awarded && (
                <p className="text-xs text-gray-400">
                  Date Conferred: {new Date(selectedAchievement.date_awarded).toLocaleDateString()}
                </p>
              )}

              <p className="text-sm text-gray-300 leading-relaxed pt-2 border-t border-charcoal-800">
                {selectedAchievement.description}
              </p>

              {selectedAchievement.evidence_url && (
                <div className="pt-4">
                  <a
                    href={selectedAchievement.evidence_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 rounded-lg bg-crimson-600 hover:bg-crimson-500 text-white font-semibold text-xs tracking-wider uppercase transition-colors shadow-md shadow-crimson-900/40"
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
