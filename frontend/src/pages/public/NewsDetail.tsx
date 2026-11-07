import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Calendar,
  ChevronLeft,
  Tag,
  ArrowRight,
  Loader2,
} from 'lucide-react';
import { newsArticlesList } from '../../data';
import { publicApi } from '../../services/api';
import type { NewsArticle } from '../../types';
import { ScrollReveal } from '../../components/common/ScrollReveal';

export const NewsDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const staticMatch = newsArticlesList.find((a) => a.slug === slug);
  const [article, setArticle] = useState<NewsArticle | null>(staticMatch || null);
  const [loading, setLoading] = useState<boolean>(!staticMatch);

  useEffect(() => {
    if (!slug) return;
    publicApi
      .getNewsBySlug(slug)
      .then((data) => {
        if (data && data.title) {
          setArticle(data);
        }
      })
      .catch((err) => {
        console.warn('Live news article fetch fallback:', err?.message || err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-[70vh] bg-[#FDFBF7] flex flex-col items-center justify-center text-center p-4">
        <Loader2 className="w-8 h-8 text-[#C6A04A] animate-spin mb-4 shrink-0" />
        <p className="text-sm font-mono text-[#64748B]">Loading publication details...</p>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-[70vh] bg-[#FDFBF7] flex flex-col items-center justify-center text-center p-4">
        <h2 className="text-2xl font-display font-bold text-[#102137] mb-2">Article Not Found</h2>
        <p className="text-sm text-[#64748B] mb-6">The requested publication may have been moved or archived.</p>
        <Link
          to="/news"
          className="px-5 py-2.5 rounded-xl bg-[#102137] hover:bg-[#183B5B] text-white text-xs font-semibold transition-all shadow-sm"
        >
          Return to News & Articles
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#FDFBF7] text-[#182332]">
      {/* Header Banner */}
      <section className="relative py-20 bg-[#102137] border-b border-[#183B5B] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal animation="fade-down" delay={0} duration={600}>
            <Link
              to="/news"
              className="inline-flex items-center text-xs font-semibold text-[#D9B96E] hover:text-white mb-6 transition-colors"
            >
              <ChevronLeft className="w-4 h-4 mr-1 shrink-0" />
              <span>Back to All Articles</span>
            </Link>
          </ScrollReveal>

          <ScrollReveal animation="fade-up" delay={80} duration={650}>
            <div className="flex items-center space-x-3 mb-4">
              <span className="px-3 py-1 rounded-lg bg-[#183B5B] border border-[#C6A04A]/40 text-[#D9B96E] font-mono text-xs font-bold uppercase shadow-sm">
                {article.category}
              </span>
              <span className="text-xs font-mono text-white/80 flex items-center">
                <Calendar className="w-3.5 h-3.5 mr-1 text-[#C6A04A] shrink-0" />
                {new Date(article.published_at).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
            </div>
          </ScrollReveal>

          <ScrollReveal animation="fade-up" delay={160} duration={650}>
            <h1 className="text-3xl sm:text-5xl font-display font-bold text-white leading-tight mb-4">
              {article.title}
            </h1>
          </ScrollReveal>

          <ScrollReveal animation="fade-up" delay={240} duration={650}>
            <p className="text-base sm:text-lg text-white/85 leading-relaxed font-normal">
              {article.summary}
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Main Content & Imagery */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {article.cover_image_url && (
            <ScrollReveal animation="fade-up" delay={0} duration={650}>
              <div className="rounded-2xl overflow-hidden border border-[#E8E3D9] bg-white shadow-md">
                <img
                  src={article.cover_image_url}
                  alt={article.title}
                  className="w-full max-h-[500px] object-cover"
                />
              </div>
            </ScrollReveal>
          )}

          <ScrollReveal animation="fade-up" delay={100} duration={650}>
            <div className="prose max-w-none text-[#182332] leading-relaxed text-base space-y-6">
              {(article.content || '').split('\n\n').map((para, i) => (
                <p key={i} className="text-[#182332] leading-relaxed">{para}</p>
              ))}
            </div>
          </ScrollReveal>

          {/* Tags & Footer Navigation */}
          <ScrollReveal animation="fade-up" delay={150} duration={650}>
            <div className="pt-8 border-t border-[#E8E3D9] flex flex-wrap items-center justify-between gap-4">
              {article.tags && (
                <div className="flex items-center space-x-2 text-xs text-[#64748B]">
                  <Tag className="w-4 h-4 text-[#C6A04A] shrink-0" />
                  <span>Tagged: <strong className="text-[#102137] font-semibold">{article.tags}</strong></span>
                </div>
              )}

              <Link
                to="/join-training"
                className="inline-flex items-center px-6 py-2.5 rounded-xl bg-[#102137] hover:bg-[#183B5B] text-white font-semibold text-xs tracking-wider uppercase transition-all shadow-sm"
              >
                <span>Enquire for Traditional Training</span>
                <ArrowRight className="w-4 h-4 ml-1.5 text-[#C6A04A] shrink-0" />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
};
