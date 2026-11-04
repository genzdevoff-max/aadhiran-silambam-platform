import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit2, Trash2, ExternalLink } from 'lucide-react';
import { adminApi } from '../../services/api';
import { AdminRequestError, getAdminRequestError } from '../../components/admin/AdminRequestState';
import { CloudImageUpload } from '../../components/common/CloudImageUpload';
import type { NewsArticle } from '../../types';

export const AdminNews: React.FC = () => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<Partial<NewsArticle> | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fetchArticles = async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const data = await adminApi.getNews();
      if (!Array.isArray(data)) throw new Error('Unexpected news response.');
      setArticles(data);
    } catch (error) {
      setLoadError(getAdminRequestError(error, 'Unable to load news articles.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    try {
      if (editingItem.id) {
        await adminApi.updateNews(editingItem.id, editingItem);
        setFeedback({ type: 'success', message: 'Article updated successfully.' });
      } else {
        await adminApi.createNews(editingItem);
        setFeedback({ type: 'success', message: 'New article published successfully.' });
      }
      setEditingItem(null);
      fetchArticles();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.response?.data?.message || 'Operation failed.' });
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this article?')) return;
    try {
      await adminApi.deleteNews(id);
      setFeedback({ type: 'success', message: 'Article deleted successfully.' });
      fetchArticles();
    } catch {
      setFeedback({ type: 'error', message: 'Failed to delete article.' });
    }
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#102137] tracking-tight">
            News & Research Articles
          </h1>
          <p className="text-xs text-[#64748B] mt-1">
            Publish historical research, association announcements, and tournament press releases.
          </p>
        </div>

        <button
          onClick={() =>
            setEditingItem({
              title: '',
              slug: '',
              summary: '',
              content: '',
              category: 'Heritage Research',
              cover_image_url: '',
              is_featured: false,
              status: 'published',
            })
          }
          className="px-4 py-2.5 rounded-xl bg-[#102137] hover:bg-[#183B5B] text-white font-medium text-xs tracking-wider uppercase transition-all shadow-sm inline-flex items-center gap-2 border border-[#C6A04A]/60 shrink-0"
        >
          <Plus className="w-4 h-4 text-[#D9B96E] shrink-0" />
          <span>New Article</span>
        </button>
      </div>

      {feedback && (
        <div
          role="status"
          className={`p-4 rounded-xl text-xs flex items-center justify-between border ${
            feedback.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-red-50 border-red-200 text-red-700'
          }`}
        >
          <span>{feedback.message}</span>
          <button onClick={() => setFeedback(null)} className="text-xs font-bold px-2">✕</button>
        </div>
      )}

      {loadError ? (
        <AdminRequestError message={loadError} onRetry={fetchArticles} />
      ) : loading ? (
        <div className="p-12 text-center text-[#64748B] text-xs">Loading articles...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((art) => (
            <div
              key={art.id}
              className="p-5 rounded-2xl bg-white border border-[#E8E3D9] shadow-sm flex flex-col justify-between space-y-4 hover:border-[#C6A04A] transition-all"
            >
              <div className="space-y-3">
                {art.cover_image_url && (
                  <div className="w-full h-40 rounded-xl overflow-hidden bg-[#F8F5EE] border border-[#E8E3D9]">
                    <img
                      src={art.cover_image_url}
                      alt={art.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-semibold text-[#C6A04A] uppercase tracking-wider">
                      {art.category}
                    </span>
                    <span className="text-[10px] text-[#64748B]">
                      {new Date(art.published_at || Date.now()).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-[#102137] mt-1 line-clamp-2">
                    {art.title}
                  </h3>
                </div>

                <p className="text-xs text-[#182332] line-clamp-3 leading-relaxed">
                  {art.summary}
                </p>
              </div>

              <div className="pt-3 border-t border-[#E8E3D9] flex items-center justify-between">
                <Link
                  to={`/news/${art.slug}`}
                  target="_blank"
                  className="text-[11px] text-[#C6A04A] hover:text-[#102137] font-semibold inline-flex items-center gap-1"
                >
                  <span>Preview</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setEditingItem(art)}
                    className="px-3 py-1.5 rounded-lg bg-[#F8F5EE] hover:bg-[#E8E3D9] text-[#102137] text-xs font-semibold inline-flex items-center gap-1.5 border border-[#E8E3D9] transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5 shrink-0" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(art.id)}
                    className="px-3 py-1.5 rounded-lg bg-white hover:bg-red-50 text-red-600 text-xs font-semibold inline-flex items-center gap-1.5 border border-red-200 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5 shrink-0" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit / Create Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div data-admin-dialog role="dialog" aria-modal="true" aria-label="News article editor" tabIndex={-1} className="relative w-full max-w-2xl bg-white rounded-3xl overflow-hidden border border-[#E8E3D9] shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-5 bg-[#F8F5EE] flex justify-between items-center border-b border-[#E8E3D9]">
              <h3 className="text-base font-bold text-[#102137]">
                {editingItem.id ? 'Edit Article' : 'Compose New Article'}
              </h3>
              <button
                onClick={() => setEditingItem(null)}
                className="text-[#64748B] hover:text-[#102137] px-2.5 py-1 rounded-lg bg-white border border-[#E8E3D9] text-xs font-medium"
              >
                ✕ Cancel
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#102137] uppercase mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={editingItem.title || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                  placeholder="The Living Legacy of Aadhiran..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F5EE] border border-[#E8E3D9] text-[#182332] text-xs focus:outline-none focus:border-[#C6A04A]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#102137] uppercase mb-1">Slug (URL)</label>
                  <input
                    type="text"
                    required
                    value={editingItem.slug || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, slug: e.target.value })}
                    placeholder="living-legacy-of-aadhiran"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F5EE] border border-[#E8E3D9] text-[#182332] text-xs focus:outline-none focus:border-[#C6A04A] font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#102137] uppercase mb-1">Category</label>
                  <input
                    type="text"
                    required
                    value={editingItem.category || 'Heritage Research'}
                    onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F5EE] border border-[#E8E3D9] text-[#182332] text-xs focus:outline-none focus:border-[#C6A04A]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#102137] uppercase mb-1">Summary / Excerpt</label>
                <textarea
                  rows={2}
                  required
                  value={editingItem.summary || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, summary: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F5EE] border border-[#E8E3D9] text-[#182332] text-xs focus:outline-none focus:border-[#C6A04A]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#102137] uppercase mb-1">Full Content</label>
                <textarea
                  rows={6}
                  required
                  value={editingItem.content || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, content: e.target.value })}
                  placeholder="Article text. Supports multi-paragraph text separated by double newlines..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F5EE] border border-[#E8E3D9] text-[#182332] text-xs focus:outline-none focus:border-[#C6A04A] font-sans"
                />
              </div>

              {/* Cloud B2 Image Upload */}
              <CloudImageUpload
                label="Article Feature Image"
                value={editingItem.cover_image_url || ''}
                onChange={(url) => setEditingItem({ ...editingItem, cover_image_url: url })}
                altText={editingItem.title || 'Article'}
                helperText="Upload feature header photograph for article."
              />

              <div className="pt-4 border-t border-[#E8E3D9] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 rounded-xl border border-[#E8E3D9] bg-white text-[#64748B] hover:text-[#102137] text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#102137] hover:bg-[#183B5B] text-white text-xs font-semibold border border-[#C6A04A]/60 shadow-sm"
                >
                  Save Article
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
