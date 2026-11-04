import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  ExternalLink,
} from 'lucide-react';
import { adminApi } from '../../services/api';
import { AdminRequestError, getAdminRequestError } from '../../components/admin/AdminRequestState';
import { CloudImageUpload } from '../../components/common/CloudImageUpload';
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
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#102137] tracking-tight">
            Heritage & UNESCO Works
          </h1>
          <p className="text-xs text-[#64748B] mt-1">
            Manage documentation projects with UNESCO ICHCAP, GTWHI, and heritage inventories.
          </p>
        </div>

        <button
          onClick={() =>
            setEditingItem({
              title: '',
              slug: '',
              organization: 'UNESCO ICHCAP',
              year: new Date().getFullYear(),
              overview: '',
              cultural_significance: '',
              cover_image_url: '',
              document_url: '',
              is_featured: false,
            })
          }
          className="px-4 py-2.5 rounded-xl bg-[#102137] hover:bg-[#183B5B] text-white font-medium text-xs tracking-wider uppercase transition-all shadow-sm inline-flex items-center gap-2 border border-[#C6A04A]/60 shrink-0"
        >
          <Plus className="w-4 h-4 text-[#D9B96E] shrink-0" />
          <span>New Heritage Project</span>
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

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search heritage documentation by title or organization..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-[#E8E3D9] text-[#182332] text-xs focus:outline-none focus:border-[#C6A04A] shadow-sm"
        />
      </div>

      {loadError ? (
        <AdminRequestError message={loadError} onRetry={fetchHeritage} />
      ) : loading ? (
        <div className="p-12 text-center text-[#64748B] text-xs">Loading heritage documentation...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-2xl bg-white border border-[#E8E3D9] shadow-sm flex flex-col justify-between space-y-4 hover:border-[#C6A04A] transition-all"
            >
              <div className="space-y-3">
                {item.cover_image_url && (
                  <div className="w-full h-40 rounded-xl overflow-hidden bg-[#F8F5EE] border border-[#E8E3D9]">
                    <img
                      src={item.cover_image_url}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-semibold text-[#C6A04A] uppercase tracking-wider">
                      {item.organization} • {item.year}
                    </span>
                    {item.is_featured && (
                      <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#102137] text-white">
                        Featured
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-bold text-[#102137] mt-1 line-clamp-2">
                    {item.title}
                  </h3>
                </div>

                <p className="text-xs text-[#182332] line-clamp-3 leading-relaxed">
                  {item.overview}
                </p>
              </div>

              <div className="pt-3 border-t border-[#E8E3D9] flex items-center justify-between">
                <Link
                  to={`/heritage-works`}
                  className="text-[11px] text-[#C6A04A] hover:text-[#102137] font-semibold inline-flex items-center gap-1"
                >
                  <span>Public View</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setEditingItem(item)}
                    className="px-3 py-1.5 rounded-lg bg-[#F8F5EE] hover:bg-[#E8E3D9] text-[#102137] text-xs font-semibold inline-flex items-center gap-1.5 border border-[#E8E3D9] transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5 shrink-0" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
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
          <div data-admin-dialog role="dialog" aria-modal="true" aria-label="Heritage project editor" tabIndex={-1} className="relative w-full max-w-xl bg-white rounded-3xl overflow-hidden border border-[#E8E3D9] shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-5 bg-[#F8F5EE] flex justify-between items-center border-b border-[#E8E3D9]">
              <h3 className="text-base font-bold text-[#102137]">
                {editingItem.id ? 'Edit Heritage Project' : 'New Heritage Documentation Project'}
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
                <label className="block text-xs font-semibold text-[#102137] uppercase mb-1">Project Title</label>
                <input
                  type="text"
                  required
                  value={editingItem.title || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                  placeholder="UNESCO Living Heritage Community Inventorying..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F5EE] border border-[#E8E3D9] text-[#182332] text-xs focus:outline-none focus:border-[#C6A04A]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#102137] uppercase mb-1">Affiliated Organization</label>
                  <input
                    type="text"
                    required
                    value={editingItem.organization || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, organization: e.target.value })}
                    placeholder="ICHCAP / UNESCO / GTWHI"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F5EE] border border-[#E8E3D9] text-[#182332] text-xs focus:outline-none focus:border-[#C6A04A]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#102137] uppercase mb-1">Year</label>
                  <input
                    type="number"
                    required
                    value={editingItem.year || new Date().getFullYear()}
                    onChange={(e) => setEditingItem({ ...editingItem, year: parseInt(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F5EE] border border-[#E8E3D9] text-[#182332] text-xs focus:outline-none focus:border-[#C6A04A] font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#102137] uppercase mb-1">Slug (URL)</label>
                <input
                  type="text"
                  required
                  value={editingItem.slug || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, slug: e.target.value })}
                  placeholder="unesco-living-heritage-2019"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F5EE] border border-[#E8E3D9] text-[#182332] text-xs focus:outline-none focus:border-[#C6A04A] font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#102137] uppercase mb-1">Overview</label>
                <textarea
                  rows={2}
                  required
                  value={editingItem.overview || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, overview: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F5EE] border border-[#E8E3D9] text-[#182332] text-xs focus:outline-none focus:border-[#C6A04A]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#102137] uppercase mb-1">Cultural Significance</label>
                <textarea
                  rows={4}
                  required
                  value={editingItem.cultural_significance || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, cultural_significance: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F5EE] border border-[#E8E3D9] text-[#182332] text-xs focus:outline-none focus:border-[#C6A04A]"
                />
              </div>

              {/* Cloud B2 Image Upload */}
              <CloudImageUpload
                label="Documentation Cover Image"
                value={editingItem.cover_image_url || ''}
                onChange={(url) => setEditingItem({ ...editingItem, cover_image_url: url })}
                altText={editingItem.title || 'Heritage project'}
                helperText="Upload official documentation photo or publication banner."
              />

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="heritageFeatured"
                  checked={editingItem.is_featured || false}
                  onChange={(e) => setEditingItem({ ...editingItem, is_featured: e.target.checked })}
                  className="w-4 h-4 rounded border-[#E8E3D9] text-[#102137] focus:ring-[#C6A04A]"
                />
                <label htmlFor="heritageFeatured" className="text-xs text-[#182332] font-semibold cursor-pointer">
                  Feature prominently on Heritage Works page
                </label>
              </div>

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
