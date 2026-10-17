import React from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Calendar,
  ChevronLeft,
  Tag,
  ArrowRight,
} from 'lucide-react';
import { newsArticlesList } from '../../data';

export const NewsDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  const article = newsArticlesList.find((a) => a.slug === slug);

  if (!article) {
    return (
      <div className="min-h-[70vh] bg-charcoal-950 flex flex-col items-center justify-center text-center p-4">
        <h2 className="text-2xl font-display font-bold text-white mb-2">Article Not Found</h2>
        <p className="text-sm text-gray-400 mb-6">The requested publication may have been moved or archived.</p>
        <Link
          to="/news"
          className="px-5 py-2.5 rounded-lg bg-crimson-600 hover:bg-crimson-500 text-white text-xs font-semibold transition-colors shadow-md shadow-crimson-900/40"
        >
          Return to News & Articles
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-charcoal-950 text-gray-200">
      {/* Header Banner */}
      <section className="relative py-20 bg-gradient-to-b from-charcoal-900 to-charcoal-950 border-b border-charcoal-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/news"
            className="inline-flex items-center text-xs font-semibold text-gold-400 hover:text-gold-300 mb-6 transition-colors"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            <span>Back to All Articles</span>
          </Link>

          <div className="flex items-center space-x-3 mb-4">
            <span className="px-3 py-1 rounded bg-crimson-950 border border-crimson-800 text-crimson-400 font-mono text-xs font-bold uppercase">
              {article.category}
            </span>
            <span className="text-xs font-mono text-gray-400 flex items-center">
              <Calendar className="w-3.5 h-3.5 mr-1 text-crimson-500" />
              {new Date(article.published_at).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-display font-extrabold text-white leading-tight mb-4">
            {article.title}
          </h1>

          <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-medium">
            {article.summary}
          </p>
        </div>
      </section>

      {/* Main Content & Imagery */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {article.cover_image_url && (
            <div className="rounded-2xl overflow-hidden border border-charcoal-800 bg-charcoal-900 shadow-2xl">
              <img
                src={article.cover_image_url}
                alt={article.title}
                className="w-full max-h-[500px] object-cover"
              />
            </div>
          )}

          <div className="prose prose-invert max-w-none text-gray-300 leading-relaxed text-base space-y-6">
            {article.content.split('\n\n').map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>

          {/* Tags & Footer Navigation */}
          <div className="pt-8 border-t border-charcoal-800 flex flex-wrap items-center justify-between gap-4">
            {article.tags && (
              <div className="flex items-center space-x-2 text-xs text-gray-400">
                <Tag className="w-4 h-4 text-gold-500" />
                <span>Tagged: <strong className="text-white">{article.tags}</strong></span>
              </div>
            )}

            <Link
              to="/join-training"
              className="inline-flex items-center px-6 py-2.5 rounded-lg bg-crimson-600 hover:bg-crimson-500 text-white font-semibold text-xs tracking-wider uppercase transition-colors shadow-md shadow-crimson-900/40"
            >
              <span>Enquire for Traditional Training</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
