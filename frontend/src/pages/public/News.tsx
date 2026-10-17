import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Calendar,
  ChevronRight,
  Search,
  Tag,
} from 'lucide-react';
import { newsArticlesList } from '../../data';

export const News: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredArticles = newsArticlesList.filter((art) => {
    const matchesSearch =
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.summary.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' || art.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(new Set(newsArticlesList.map((a) => a.category).filter(Boolean)));

  return (
    <div className="bg-charcoal-950 text-gray-200">
      {/* Header Banner */}
      <section className="relative py-24 bg-gradient-to-b from-charcoal-900 to-charcoal-950 border-b border-charcoal-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-crimson-950 border border-crimson-700/60 text-gold-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <BookOpen className="w-3.5 h-3.5 text-crimson-500" />
            <span>Association Chronicles & Research</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-display font-extrabold text-white tracking-tight">
            News & Blog Articles
          </h1>
          <p className="mt-3 text-lg font-display text-gold-400 font-semibold tracking-wide">
            செய்திகள் மற்றும் கட்டுரைகள் • Historical Research & Official Dispatches
          </p>
          <div className="flex items-center justify-center space-x-2 text-xs text-gray-400 mt-4">
            <Link to="/" className="hover:text-gold-400">Home</Link>
            <span>/</span>
            <span className="text-gray-300">News & Blog</span>
          </div>
        </div>
      </section>

      {/* Search & Filter Bar */}
      <section className="py-6 bg-charcoal-900/60 border-b border-charcoal-800 sticky top-[65px] z-30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search articles & history..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-charcoal-950 border border-charcoal-700 text-white placeholder-gray-500 text-xs focus:outline-none focus:border-gold-500"
            />
          </div>

          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedCategory === 'all'
                  ? 'bg-crimson-600 text-white shadow'
                  : 'bg-charcoal-800 text-gray-400 hover:text-white'
              }`}
            >
              All Topics ({newsArticlesList.length})
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedCategory.toLowerCase() === cat.toLowerCase()
                    ? 'bg-crimson-600 text-white shadow'
                    : 'bg-charcoal-800 text-gray-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-20 border-b border-charcoal-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles.map((article) => {
              const pubDate = new Date(article.published_at);
              return (
                <article
                  key={article.id}
                  className="rounded-2xl bg-charcoal-900 border border-charcoal-800 overflow-hidden hover:border-gold-500/50 transition-all duration-300 flex flex-col group shadow-xl"
                >
                  <div className="relative h-48 bg-charcoal-950 overflow-hidden">
                    <img
                      src={article.cover_image_url || '/uploads/silambam-back.jpg'}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded bg-charcoal-950/85 backdrop-blur-sm border border-charcoal-700 text-gold-400 text-xs font-mono font-bold uppercase">
                      {article.category}
                    </div>
                  </div>

                  <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-center space-x-2 text-xs font-mono text-gray-400 mb-2">
                        <Calendar className="w-3.5 h-3.5 text-crimson-500" />
                        <span>
                          {pubDate.toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                      </div>

                      <h2 className="text-xl font-display font-bold text-white group-hover:text-gold-300 transition-colors">
                        <Link to={`/news/${article.slug}`}>
                          {article.title}
                        </Link>
                      </h2>

                      <p className="text-xs text-gray-400 leading-relaxed line-clamp-3 mt-3">
                        {article.summary}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-charcoal-800 flex items-center justify-between text-xs">
                      {article.tags && (
                        <span className="text-gray-500 flex items-center">
                          <Tag className="w-3 h-3 mr-1 text-gold-500" />
                          <span className="truncate max-w-[120px]">{article.tags.split(',')[0]}</span>
                        </span>
                      )}

                      <Link
                        to={`/news/${article.slug}`}
                        className="text-crimson-400 hover:text-crimson-300 font-semibold flex items-center ml-auto transition-colors"
                      >
                        <span>Read Full Chronicle</span>
                        <ChevronRight className="w-3.5 h-3.5 ml-1" />
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
