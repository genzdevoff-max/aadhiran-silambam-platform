import React, { useEffect, useState } from 'react';
import {
  Globe,
  Plus,
  Edit2,
  Trash2,
  Search,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { adminApi } from '../../services/api';
import { AdminRequestError, getAdminRequestError } from '../../components/admin/AdminRequestState';
import type { HeritageProject } from '../../types';

export const AdminHeritage: React.FC = () => {
  const [projects, setProjects] = useState<HeritageProject[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [editingItem, setEditingItem] = useState<Partial<HeritageProject> | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fetchHeritage = async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const data = await adminApi.getHeritage();
      if (!Array.isArray(data)) throw new Error('Unexpected heritage response.');
      setProjects(data);
    } catch (error) {
      setLoadError(getAdminRequestError(error, 'Unable to load heritage projects.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHeritage();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    try {
      if (editingItem.id) {
        await adminApi.updateHeritage(editingItem.id, editingItem);
        setFeedback({ type: 'success', message: 'Heritage project updated successfully.' });
      } else {
        await adminApi.createHeritage(editingItem);
        setFeedback({ type: 'success', message: 'Heritage project created successfully.' });
      }
      setEditingItem(null);
      fetchHeritage();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.response?.data?.message || 'Operation failed.' });
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this heritage project?')) return;
    try {
      await adminApi.deleteHeritage(id);
      setFeedback({ type: 'success', message: 'Project removed successfully.' });
      fetchHeritage();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.response?.data?.message || 'Failed to delete.' });
    }
  };

  const filtered = projects.filter(
    (p) =>
      p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.organization?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-white flex items-center space-x-3">
            <Globe className="w-7 h-7 text-gold-400" />
            <span>Heritage & Research Projects</span>
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Manage global preservation initiatives, UNESCO living heritage listings, and ICHCAP records.
          </p>
        </div>

        <button
          onClick={() =>
            setEditingItem({
              title: '',
              slug: '',
              organization: 'UNESCO / ICHCAP',
              year: new Date().getFullYear(),
              overview: '',
              cultural_significance: '',
              is_featured: false,
            })
          }
          className="px-4 py-2.5 rounded-xl bg-crimson-600 hover:bg-crimson-500 text-white font-semibold text-xs tracking-wider uppercase transition-colors shadow-md shadow-crimson-900/40 flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>New Project</span>
        </button>
      </div>

      {feedback && (
        <div
          className={`p-4 rounded-xl text-xs flex items-center space-x-2.5 ${
            feedback.type === 'success'
              ? 'bg-emerald-950/80 border border-emerald-700/60 text-emerald-300'
              : 'bg-crimson-950/80 border border-crimson-700/60 text-crimson-300'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-crimson-400 flex-shrink-0" />
          )}
          <span>{feedback.message}</span>
          <button onClick={() => setFeedback(null)} className="ml-auto text-gray-400 hover:text-white text-xs">
            ✕
          </button>
        </div>
      )}

      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search projects..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-charcoal-900 border border-charcoal-700 text-white placeholder-gray-500 text-xs focus:outline-none focus:border-gold-500"
        />
      </div>

      {loading ? (
        <div className="p-8 text-center text-gray-500 font-mono text-sm">Loading heritage records...</div>
      ) : loadError ? (
        <AdminRequestError message={loadError} onRetry={() => fetchHeritage()} />
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-charcoal-900 border border-charcoal-800 text-gray-400 text-xs">
          {projects.length === 0 ? 'No heritage records have been added yet.' : 'No records match your search.'}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl bg-charcoal-900 border border-charcoal-800 p-5 flex flex-col justify-between space-y-4 hover:border-gold-500/40 transition-colors shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono font-bold text-gold-400 uppercase bg-gold-950/80 px-2 py-0.5 rounded border border-gold-800/60">
                    {item.organization}
                  </span>
                  <span className="text-[11px] font-mono text-gray-400">{item.year}</span>
                </div>
                <h3 className="text-base font-display font-bold text-white mb-2">{item.title}</h3>
                <p className="text-xs text-gray-400 line-clamp-3 leading-relaxed">{item.overview}</p>
              </div>

              <div className="pt-3 border-t border-charcoal-800 flex items-center justify-between">
                <span
                  className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                    item.is_featured ? 'bg-gold-950 text-gold-400 border border-gold-800' : 'text-gray-500'
                  }`}
                >
                  {item.is_featured ? 'Featured' : 'Standard'}
                </span>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setEditingItem(item)}
                    className="p-1.5 rounded-lg bg-charcoal-800 hover:bg-charcoal-700 text-gold-400"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1.5 rounded-lg bg-charcoal-800 hover:bg-crimson-950 text-gray-400 hover:text-crimson-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div data-admin-dialog role="dialog" aria-modal="true" aria-label="Heritage project editor" tabIndex={-1} className="relative w-full max-w-2xl bg-charcoal-900 rounded-2xl overflow-hidden border border-charcoal-700 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-5 bg-charcoal-950 flex justify-between items-center border-b border-charcoal-800">
              <h3 className="text-base font-display font-bold text-white">
                {editingItem.id ? 'Edit Heritage Project' : 'New Heritage Project'}
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
                <label className="block text-xs font-semibold text-gray-300 uppercase mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={editingItem.title || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-charcoal-950 border border-charcoal-700 text-white text-xs focus:outline-none focus:border-gold-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-gray-300 uppercase mb-1">Organization</label>
                  <input
                    type="text"
                    required
                    value={editingItem.organization || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, organization: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-charcoal-950 border border-charcoal-700 text-white text-xs focus:outline-none focus:border-gold-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase mb-1">Year</label>
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
                <label className="block text-xs font-semibold text-gray-300 uppercase mb-1">Slug (URL)</label>
                <input
                  type="text"
                  required
                  value={editingItem.slug || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, slug: e.target.value })}
                  placeholder="unesco-living-heritage-2019"
                  className="w-full px-3 py-2 rounded-xl bg-charcoal-950 border border-charcoal-700 text-white text-xs focus:outline-none focus:border-gold-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase mb-1">Overview</label>
                <textarea
                  rows={2}
                  required
                  value={editingItem.overview || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, overview: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-charcoal-950 border border-charcoal-700 text-white text-xs focus:outline-none focus:border-gold-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase mb-1">Cultural Significance</label>
                <textarea
                  rows={4}
                  required
                  value={editingItem.cultural_significance || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, cultural_significance: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-charcoal-950 border border-charcoal-700 text-white text-xs focus:outline-none focus:border-gold-500"
                />
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="heritageFeatured"
                  checked={editingItem.is_featured || false}
                  onChange={(e) => setEditingItem({ ...editingItem, is_featured: e.target.checked })}
                  className="w-4 h-4 rounded border-charcoal-700 bg-charcoal-950 text-crimson-600 focus:ring-0"
                />
                <label htmlFor="heritageFeatured" className="text-xs text-gray-300 font-semibold cursor-pointer">
                  Feature prominently on Heritage Works page
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
                  Save Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
