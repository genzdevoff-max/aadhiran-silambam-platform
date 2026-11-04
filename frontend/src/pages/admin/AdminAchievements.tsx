import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, ExternalLink } from 'lucide-react';
import { adminApi } from '../../services/api';
import { AdminRequestError, getAdminRequestError } from '../../components/admin/AdminRequestState';
import { CloudImageUpload } from '../../components/common/CloudImageUpload';
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
        setFeedback({ type: 'success', message: 'Achievement record updated successfully.' });
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
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#102137] tracking-tight">
            Achievements & Recognitions
          </h1>
          <p className="text-xs text-[#64748B] mt-1">
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
              cover_image_url: '',
              evidence_url: '',
              is_featured: false,
              status: 'published',
            })
          }
          className="px-4 py-2.5 rounded-xl bg-[#102137] hover:bg-[#183B5B] text-white font-medium text-xs tracking-wider uppercase transition-all shadow-sm inline-flex items-center gap-2 border border-[#C6A04A]/60 shrink-0"
        >
          <Plus className="w-4 h-4 text-[#D9B96E] shrink-0" />
          <span>Add Achievement</span>
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
        <AdminRequestError message={loadError} onRetry={fetchAchievements} />
      ) : loading ? (
        <div className="p-12 text-center text-[#64748B] text-xs">Loading achievements...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map((ach) => (
            <div
              key={ach.id}
              className="p-5 rounded-2xl bg-white border border-[#E8E3D9] shadow-sm flex flex-col justify-between space-y-4 hover:border-[#C6A04A] transition-all"
            >
              <div className="space-y-3">
                {ach.cover_image_url && (
                  <div className="w-full h-40 rounded-xl overflow-hidden bg-[#F8F5EE] border border-[#E8E3D9]">
                    <img
                      src={ach.cover_image_url}
                      alt={ach.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-semibold text-[#C6A04A] uppercase tracking-wider">
                      {ach.category} • {ach.year}
                    </span>
                    {ach.is_featured && (
                      <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#102137] text-white">
                        Featured
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-bold text-[#102137] mt-1 line-clamp-2">
                    {ach.title}
                  </h3>
                  <p className="text-xs font-medium text-[#183B5B] mt-0.5">
                    {ach.awarding_organization}
                  </p>
                </div>

                <p className="text-xs text-[#182332] line-clamp-3 leading-relaxed">
                  {ach.description}
                </p>
              </div>

              <div className="pt-3 border-t border-[#E8E3D9] flex items-center justify-between">
                {ach.evidence_url ? (
                  <a
                    href={ach.evidence_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-[#C6A04A] hover:text-[#102137] font-semibold inline-flex items-center gap-1"
                  >
                    <span>Verification</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ) : <span />}

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setEditingItem(ach)}
                    className="px-3 py-1.5 rounded-lg bg-[#F8F5EE] hover:bg-[#E8E3D9] text-[#102137] text-xs font-semibold inline-flex items-center gap-1.5 border border-[#E8E3D9] transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5 shrink-0" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(ach.id)}
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

      {/* Edit Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div data-admin-dialog role="dialog" aria-modal="true" aria-label="Achievement editor" tabIndex={-1} className="relative w-full max-w-xl bg-white rounded-3xl overflow-hidden border border-[#E8E3D9] shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-5 bg-[#F8F5EE] flex justify-between items-center border-b border-[#E8E3D9]">
              <h3 className="text-base font-bold text-[#102137]">
                {editingItem.id ? 'Edit Achievement Record' : 'Record New Achievement'}
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
                <label className="block text-xs font-semibold text-[#102137] uppercase mb-1">
                  Achievement Title
                </label>
                <input
                  type="text"
                  required
                  value={editingItem.title || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                  placeholder="e.g. Oldest Silambam Association in Malaysia"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F5EE] border border-[#E8E3D9] text-[#182332] text-xs focus:outline-none focus:border-[#C6A04A]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#102137] uppercase mb-1">
                    Category
                  </label>
                  <select
                    value={editingItem.category || 'National Record'}
                    onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F5EE] border border-[#E8E3D9] text-[#182332] text-xs focus:outline-none focus:border-[#C6A04A]"
                  >
                    <option value="National Record">National Record (MBOR)</option>
                    <option value="International Recognition">International Recognition (UNESCO)</option>
                    <option value="Cultural Heritage">Cultural Heritage</option>
                    <option value="Global Media">Global Media</option>
                    <option value="State Heritage">State Heritage Citation</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#102137] uppercase mb-1">
                    Year Awarded
                  </label>
                  <input
                    type="number"
                    required
                    value={editingItem.year || new Date().getFullYear()}
                    onChange={(e) => setEditingItem({ ...editingItem, year: parseInt(e.target.value) || 2026 })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F5EE] border border-[#E8E3D9] text-[#182332] text-xs focus:outline-none focus:border-[#C6A04A]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#102137] uppercase mb-1">
                  Awarding Organization
                </label>
                <input
                  type="text"
                  required
                  value={editingItem.awarding_organization || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, awarding_organization: e.target.value })}
                  placeholder="The Malaysia Book of Records / UNESCO"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F5EE] border border-[#E8E3D9] text-[#182332] text-xs focus:outline-none focus:border-[#C6A04A]"
                />
              </div>

              {/* Cloud B2 Image Upload */}
              <CloudImageUpload
                label="Certificate / Cover Image"
                value={editingItem.cover_image_url || ''}
                onChange={(url) => setEditingItem({ ...editingItem, cover_image_url: url })}
                altText={editingItem.title || 'Achievement'}
                helperText="Upload official award certificate or citation photograph."
              />

              <div>
                <label className="block text-xs font-semibold text-[#102137] uppercase mb-1">
                  Official Verification / Source URL
                </label>
                <input
                  type="url"
                  value={editingItem.evidence_url || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, evidence_url: e.target.value })}
                  placeholder="https://www.malaysiarecords.com.my"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F5EE] border border-[#E8E3D9] text-[#182332] text-xs focus:outline-none focus:border-[#C6A04A] font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#102137] uppercase mb-1">
                  Detailed Description & Citation
                </label>
                <textarea
                  rows={4}
                  required
                  value={editingItem.description || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F5EE] border border-[#E8E3D9] text-[#182332] text-xs focus:outline-none focus:border-[#C6A04A]"
                />
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="featuredCheck"
                  checked={editingItem.is_featured || false}
                  onChange={(e) => setEditingItem({ ...editingItem, is_featured: e.target.checked })}
                  className="w-4 h-4 rounded border-[#E8E3D9] text-[#102137] focus:ring-[#C6A04A]"
                />
                <label htmlFor="featuredCheck" className="text-xs font-medium text-[#182332]">
                  Highlight as Featured Milestone on Homepage
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
                  Save Achievement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
