import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Award,
  ExternalLink,
  Filter,
  Eye,
} from 'lucide-react';
import { achievementsList } from '../../data';
import { publicApi } from '../../services/api';
import type { Achievement } from '../../types';

export const Achievements: React.FC = () => {
  const [achievements, setAchievements] = useState<Achievement[]>(achievementsList);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);

  useEffect(() => {
    publicApi.getAchievements().then((data) => {
      const list = data?.data || data?.achievements || data;
      if (Array.isArray(list) && list.length > 0) {
        setAchievements(list);
      }
    }).catch(() => {});
  }, []);

  const categories = Array.from(new Set(achievements.map((a) => a.category)));

  const filteredAchievements = selectedCategory === 'all'
    ? achievements
    : achievements.filter((a) => a.category.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <div className="bg-[#F8FAFC] text-[#182332]">
      {/* Header Banner - Deep Heritage Navy */}
      <section className="relative py-20 sm:py-24 bg-[#102137] border-b border-[#183B5B] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#183B5B] border border-[#C6A04A]/50 text-[#D9B96E] text-xs font-display font-bold uppercase tracking-wider mb-4 shadow-sm">
            <Award className="w-3.5 h-3.5 text-[#C6A04A] shrink-0" />
            <span>Documented Accolades & Records</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-black text-white tracking-tight uppercase">
            Achievements & Records
          </h1>
          <p className="mt-3 text-lg font-display text-[#D9B96E] font-semibold tracking-wide">
            சாதனைகளும் விருதுகளும் • Official Verifications & Historic Milestones
          </p>
          <div className="flex items-center justify-center space-x-2 text-xs text-slate-300 mt-4 font-medium">
            <Link to="/" className="hover:text-[#D9B96E]">Home</Link>
            <span>/</span>
            <span className="text-[#D9B96E]">Achievements</span>
          </div>
        </div>
      </section>

      {/* Filter Ribbon */}
      <section className="py-4 bg-white border-b border-slate-200 sticky top-[65px] z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-[#C6A04A] shrink-0" />
            <span className="text-xs font-semibold text-[#182332] uppercase tracking-wider">
              Filter By Category:
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                selectedCategory === 'all'
                  ? 'bg-[#102137] text-white shadow-sm'
                  : 'bg-[#F8F5EE] text-[#64748B] hover:text-[#182332] border border-[#E8E3D9]'
              }`}
            >
              All Accolades ({achievements.length})
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                  selectedCategory.toLowerCase() === cat.toLowerCase()
                    ? 'bg-[#102137] text-white shadow-sm'
                    : 'bg-[#F8F5EE] text-[#64748B] hover:text-[#182332] border border-[#E8E3D9]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements Cards */}
      <section className="py-16 sm:py-20 border-b border-[#E8E3D9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredAchievements.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl bg-white border border-[#E8E3D9] overflow-hidden hover:border-[#C6A04A] transition-all duration-300 flex flex-col group shadow-sm hover:shadow-md"
              >
                {item.cover_image_url && (
                  <div className="relative h-56 overflow-hidden bg-[#F8F5EE] flex items-center justify-center">
                    <img
                      src={item.cover_image_url}
                      alt={item.title}
                      width={400}
                      height={224}
                      loading="lazy"
                      decoding="async"
                      className={`w-full h-full group-hover:scale-105 transition-transform duration-500 ${
                        item.cover_image_url.includes('298977c4') || item.cover_image_url.includes('cert')
                          ? 'object-contain p-2 bg-white'
                          : 'object-cover'
                      }`}
                      onError={(e) => {
                        const t = e.currentTarget;
                        t.onerror = null;
                        t.src = '/uploads/screenshot-2019-06-09-at-5-17-22-am_orig.png';
                      }}
                    />
                    <div className="absolute top-3 right-3 px-3 py-1 rounded-lg bg-[#102137]/90 backdrop-blur-sm border border-[#183B5B] text-[#D9B96E] text-xs font-mono font-bold shadow-sm">
                      {item.year}
                    </div>
                    {item.is_featured && (
                      <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-[#C6A04A] text-[#102137] text-[10px] font-bold uppercase tracking-wider shadow-sm">
                        Featured Milestone
                      </div>
                    )}
                  </div>
                )}

                <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                  <div>
                    <span className="text-[11px] font-mono text-[#C6A04A] uppercase tracking-wider font-semibold block mb-1">
                      {item.category}
                    </span>
                    <h3 className="text-xl font-display font-bold text-[#102137] group-hover:text-[#C6A04A] transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs font-semibold text-[#64748B] mt-2">
                      Conferred by: <span className="text-[#102137]">{item.awarding_organization}</span>
                    </p>
                    <p className="text-xs text-[#64748B] mt-3 leading-relaxed line-clamp-4">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#E8E3D9] flex items-center justify-between text-xs">
                    <button
                      onClick={() => setSelectedAchievement(item)}
                      className="text-[#102137] hover:text-[#C6A04A] font-semibold flex items-center transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5 mr-1 text-[#C6A04A] shrink-0" />
                      <span>View Details & Evidence</span>
                    </button>

                    {item.evidence_url && (
                      <a
                        href={item.evidence_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#64748B] hover:text-[#102137] flex items-center transition-colors"
                        title="Open external source"
                      >
                        <ExternalLink className="w-3.5 h-3.5 shrink-0" />
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#102137]/75 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl bg-white rounded-2xl overflow-hidden border border-[#E8E3D9] shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-4 bg-[#102137] flex justify-between items-center border-b border-[#183B5B] text-white">
              <span className="text-xs font-mono font-bold text-[#D9B96E] uppercase">
                {selectedAchievement.category} • {selectedAchievement.year}
              </span>
              <button
                onClick={() => setSelectedAchievement(null)}
                className="text-white/80 hover:text-white px-2.5 py-1 rounded bg-[#183B5B] border border-[#183B5B] text-sm transition-colors"
              >
                ✕ Close
              </button>
            </div>

            {selectedAchievement.cover_image_url && (
              <div className="h-64 bg-[#F8F5EE] overflow-hidden flex items-center justify-center">
                <img
                  src={selectedAchievement.cover_image_url}
                  alt={selectedAchievement.title}
                  className="w-full h-full object-contain"
                />
              </div>
            )}

            <div className="p-6 space-y-4">
              <h3 className="text-2xl font-display font-bold text-[#102137]">
                {selectedAchievement.title}
              </h3>
              <p className="text-xs font-semibold text-[#C6A04A]">
                Awarding Organization: {selectedAchievement.awarding_organization}
              </p>
              {selectedAchievement.date_awarded && (
                <p className="text-xs text-[#64748B]">
                  Date Conferred: {new Date(selectedAchievement.date_awarded).toLocaleDateString()}
                </p>
              )}

              <p className="text-sm text-[#182332] leading-relaxed pt-2 border-t border-[#E8E3D9]">
                {selectedAchievement.description}
              </p>

              {selectedAchievement.evidence_url && (
                <div className="pt-4">
                  <a
                    href={selectedAchievement.evidence_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 rounded-xl bg-[#102137] hover:bg-[#183B5B] text-white font-semibold text-xs tracking-wider uppercase transition-colors shadow-sm"
                  >
                    <span>Visit External Verification Source</span>
                    <ExternalLink className="w-3.5 h-3.5 ml-2 text-[#C6A04A] shrink-0" />
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
