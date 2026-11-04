import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Calendar,
  ChevronRight,
  Search,
  Tag,
} from 'lucide-react';
import { newsArticlesList } from '../../data';
import { publicApi } from '../../services/api';
import type { NewsArticle } from '../../types';

export const News: React.FC = () => {
  const [articles, setArticles] = useState<NewsArticle[]>(newsArticlesList);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    publicApi.getNews().then((data) => {
      if (Array.isArray(data) && data.length > 0) {
        setArticles(data);
      }
    }).catch(() => {});
  }, []);

  const filteredArticles = articles.filter((art) => {
    const matchesSearch =
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.summary.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' || art.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(new Set(articles.map((a) => a.category).filter(Boolean)));

  return (
    <div className="bg-[#FDFBF7] text-[#182332]">
      {/* Header Banner - Deep Heritage Navy */}
      <section className="relative py-20 sm:py-24 bg-[#102137] border-b border-[#183B5B] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#183B5B]/80 border border-[#C6A04A]/50 text-[#D9B96E] text-xs font-semibold uppercase tracking-wider mb-4 shadow-sm">
            <BookOpen className="w-3.5 h-3.5 text-[#C6A04A] shrink-0" />
            <span>Association Chronicles & Research</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-display font-bold text-white tracking-tight">
            News & Blog Articles
          </h1>
          <p className="mt-3 text-lg font-display text-[#D9B96E] font-medium tracking-wide">
            செய்திகள் மற்றும் கட்டுரைகள் • Historical Research & Official Dispatches
          </p>
          <div className="flex items-center justify-center space-x-2 text-xs text-white/70 mt-4">
            <Link to="/" className="hover:text-[#D9B96E] transition-colors">Home</Link>
            <span>/</span>
            <span className="text-[#D9B96E] font-medium">News & Blog</span>
          </div>
        </div>
      </section>

      {/* Search & Filter Bar */}
      <section className="py-5 bg-white border-b border-[#E8E3D9] sticky top-[65px] z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2 shrink-0" />
            <input
              type="text"
              placeholder="Search articles & history..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#F8F5EE] border border-[#E8E3D9] text-[#182332] placeholder-[#64748B] text-xs focus:outline-none focus:border-[#102137] transition-colors"
            />
          </div>

          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedCategory === 'all'
                  ? 'bg-[#102137] text-white shadow-sm'
                  : 'bg-[#F8F5EE] text-[#64748B] hover:text-[#182332] border border-[#E8E3D9]'
              }`}
            >
              All Topics ({articles.length})
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
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

      {/* Articles Grid */}
      <section className="py-20 border-b border-[#E8E3D9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles.map((article) => {
              const pubDate = new Date(article.published_at);
              return (
                <article
                  key={article.id}
                  className="rounded-2xl bg-white border border-[#E8E3D9] overflow-hidden hover:border-[#C6A04A] hover:shadow-lg transition-all duration-300 flex flex-col group shadow-sm"
                >
                  <div className="relative h-48 bg-[#F8F5EE] overflow-hidden">
                    <img
                      src={article.cover_image_url || '/api/public/media/stream/silambam/silambam-back.jpg'}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded bg-[#102137]/90 backdrop-blur-sm border border-[#183B5B] text-[#D9B96E] text-xs font-mono font-bold uppercase shadow-sm">
                      {article.category}
                    </div>
                  </div>

                  <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-center space-x-2 text-xs font-mono text-[#C6A04A] mb-2 font-semibold">
                        <Calendar className="w-3.5 h-3.5 text-[#C6A04A] shrink-0" />
                        <span>
                          {pubDate.toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                      </div>

                      <h2 className="text-xl font-display font-bold text-[#102137] group-hover:text-[#C6A04A] transition-colors">
                        <Link to={`/news/${article.slug}`}>
                          {article.title}
                        </Link>
                      </h2>

                      <p className="text-xs text-[#64748B] leading-relaxed line-clamp-3 mt-3">
                        {article.summary}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-[#E8E3D9] flex items-center justify-between text-xs">
                      {article.tags && (
                        <span className="text-[#64748B] flex items-center">
                          <Tag className="w-3 h-3 mr-1 text-[#C6A04A] shrink-0" />
                          <span className="truncate max-w-[120px]">{article.tags.split(',')[0]}</span>
                        </span>
                      )}

                      <Link
                        to={`/news/${article.slug}`}
                        className="text-[#102137] hover:text-[#C6A04A] font-semibold flex items-center ml-auto transition-colors group-hover:translate-x-0.5"
                      >
                        <span>Read Full Chronicle</span>
                        <ChevronRight className="w-3.5 h-3.5 ml-1 text-[#C6A04A] shrink-0" />
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};
