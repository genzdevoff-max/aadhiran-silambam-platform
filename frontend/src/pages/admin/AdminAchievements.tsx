import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { adminApi } from '../../services/api';
import { AdminRequestError, getAdminRequestError } from '../../components/admin/AdminRequestState';
import type { Achievement } from '../../types';

export const AdminAchievements: React.FC = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<Partial<Achievement> | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fetchAchievements = async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const data = await adminApi.getAchievements();
      if (!Array.isArray(data)) throw new Error('Unexpected achievements response.');
      setAchievements(data);
    } catch (error) {
      setLoadError(getAdminRequestError(error, 'Unable to load achievement records.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAchievements();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    try {
      if (editingItem.id) {
        await adminApi.updateAchievement(editingItem.id, editingItem);
        setFeedback({ type: 'success', message: 'Achievement updated successfully.' });
      } else {
        await adminApi.createAchievement(editingItem);
        setFeedback({ type: 'success', message: 'New achievement recorded successfully.' });
      }
      setEditingItem(null);
      fetchAchievements();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.response?.data?.message || 'Operation failed.' });
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this achievement record?')) return;
    try {
      await adminApi.deleteAchievement(id);
      setFeedback({ type: 'success', message: 'Achievement deleted successfully.' });
      fetchAchievements();
    } catch {
      setFeedback({ type: 'error', message: 'Failed to delete achievement.' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-white">
            Achievements & Awards Manager
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Manage certified records from the Malaysia Book of Records, UNESCO, and international awards.
          </p>
        </div>

        <button
          onClick={() =>
            setEditingItem({
              title: '',
              category: 'National Record',
              year: new Date().getFullYear(),
              awarding_organization: '',
              description: '',
              cover_image_url: '/uploads/screenshot-2019-06-09-at-5-17-22-am_orig.png',
              evidence_url: '',
              is_featured: false,
              status: 'published',
            })
          }
          className="px-4 py-2.5 rounded-xl bg-crimson-600 hover:bg-crimson-500 text-white font-semibold text-xs tracking-wider uppercase transition-colors shadow flex items-center space-x-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Add Achievement</span>
        </button>
      </div>

      {feedback && (
        <div
          className={`p-4 rounded-xl text-xs flex items-center justify-between ${
            feedback.type === 'success'
              ? 'bg-emerald-950/80 border border-emerald-700/60 text-emerald-300'
              : 'bg-crimson-950/80 border border-crimson-700/60 text-crimson-300'
          }`}
        >
          <span>{feedback.message}</span>
          <button onClick={() => setFeedback(null)} className="text-gray-400 hover:text-white">✕</button>
        </div>
      )}

      {/* Grid */}
      {loading ? (
        <div className="py-12 text-center text-xs text-gray-500 font-mono">Loading records...</div>
      ) : loadError ? (
        <AdminRequestError message={loadError} onRetry={() => fetchAchievements()} />
      ) : achievements.length === 0 ? (
        <div className="rounded-2xl border border-charcoal-800 bg-charcoal-900 p-10 text-center text-sm text-gray-300">
          No achievement records have been added yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-2xl bg-charcoal-900 border border-charcoal-800 shadow-xl flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono font-bold text-crimson-400 uppercase">
                    {item.category}
                  </span>
                  <span className="text-xs font-mono font-bold text-gold-400 bg-charcoal-800 px-2 py-0.5 rounded">
                    {item.year}
                  </span>
                </div>
                <h3 className="text-base font-display font-bold text-white mb-1">
                  {item.title}
                </h3>
                <p className="text-xs text-gray-300 font-semibold mb-2">
                  {item.awarding_organization}
                </p>
                <p className="text-xs text-gray-400 line-clamp-3 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="pt-3 border-t border-charcoal-800 flex items-center justify-between text-xs">
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    item.is_featured ? 'bg-gold-950 border border-gold-700 text-gold-400' : 'text-gray-500'
                  }`}
                >
                  {item.is_featured ? 'Featured' : 'Standard'}
                </span>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setEditingItem(item)}
                    className="px-2.5 py-1 rounded-lg bg-charcoal-800 text-gold-400 hover:text-white text-xs font-semibold"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="px-2.5 py-1 rounded-lg bg-charcoal-800 text-gray-400 hover:text-crimson-400 text-xs font-semibold"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div data-admin-dialog role="dialog" aria-modal="true" aria-label="Achievement editor" tabIndex={-1} className="relative w-full max-w-xl bg-charcoal-900 rounded-2xl overflow-hidden border border-charcoal-700 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-5 bg-charcoal-950 flex justify-between items-center border-b border-charcoal-800">
              <h3 className="text-base font-display font-bold text-white">
                {editingItem.id ? 'Edit Achievement Record' : 'Record New Achievement'}
              </h3>
              <button
                onClick={() => setEditingItem(null)}
                className="text-gray-400 hover:text-white px-2 py-1 rounded bg-charcoal-800 text-xs"
              >
                ✕ Cancel
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase mb-1">
                  Achievement Title
                </label>
                <input
                  type="text"
                  required
                  value={editingItem.title || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-charcoal-950 border border-charcoal-700 text-white text-xs focus:outline-none focus:border-gold-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase mb-1">
                    Category
                  </label>
                  <select
                    value={editingItem.category || 'National Record'}
                    onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-charcoal-950 border border-charcoal-700 text-white text-xs focus:outline-none focus:border-gold-500"
                  >
                    <option value="National Record">National Record</option>
                    <option value="International Recognition">International Recognition</option>
                    <option value="Cultural Heritage">Cultural Heritage</option>
                    <option value="Global Media">Global Media</option>
                    <option value="State Heritage">State Heritage</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase mb-1">
                    Year Conferred
                  </label>
                  <input
                    type="number"
                    required
                    value={editingItem.year || new Date().getFullYear()}
                    onChange={(e) => setEditingItem({ ...editingItem, year: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-charcoal-950 border border-charcoal-700 text-white text-xs focus:outline-none focus:border-gold-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase mb-1">
                  Awarding Organization
                </label>
                <input
                  type="text"
                  required
                  value={editingItem.awarding_organization || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, awarding_organization: e.target.value })}
                  placeholder="The Malaysia Book of Records / UNESCO"
                  className="w-full px-3 py-2 rounded-xl bg-charcoal-950 border border-charcoal-700 text-white text-xs focus:outline-none focus:border-gold-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase mb-1">
                  Cover Photo URL or Upload Path
                </label>
                <input
                  type="text"
                  value={editingItem.cover_image_url || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, cover_image_url: e.target.value })}
                  placeholder="/uploads/screenshot-2019-06-09-at-5-17-22-am_orig.png"
                  className="w-full px-3 py-2 rounded-xl bg-charcoal-950 border border-charcoal-700 text-white text-xs focus:outline-none focus:border-gold-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase mb-1">
                  Official Verification / Source URL
                </label>
                <input
                  type="url"
                  value={editingItem.evidence_url || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, evidence_url: e.target.value })}
                  placeholder="https://www.malaysiarecords.com.my"
                  className="w-full px-3 py-2 rounded-xl bg-charcoal-950 border border-charcoal-700 text-white text-xs focus:outline-none focus:border-gold-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase mb-1">
                  Detailed Description & Citation
                </label>
                <textarea
                  rows={4}
                  required
                  value={editingItem.description || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-charcoal-950 border border-charcoal-700 text-white text-xs focus:outline-none focus:border-gold-500"
                />
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="featuredCheck"
                  checked={editingItem.is_featured || false}
                  onChange={(e) => setEditingItem({ ...editingItem, is_featured: e.target.checked })}
                  className="w-4 h-4 rounded border-charcoal-700 bg-charcoal-950 text-crimson-600 focus:ring-0"
                />
                <label htmlFor="featuredCheck" className="text-xs text-gray-300 font-semibold cursor-pointer">
                  Display as Featured Milestone on Homepage
                </label>
              </div>

              <div className="pt-4 border-t border-charcoal-800 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 rounded-xl bg-charcoal-800 text-gray-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-crimson-600 hover:bg-crimson-500 text-white text-xs font-bold uppercase tracking-wider transition-colors shadow"
                >
                  Save Achievement Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
