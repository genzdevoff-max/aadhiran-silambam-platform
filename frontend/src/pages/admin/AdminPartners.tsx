import React, { useEffect, useState } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
} from 'lucide-react';
import { adminApi } from '../../services/api';
import { AdminRequestError, getAdminRequestError } from '../../components/admin/AdminRequestState';
import { CloudImageUpload } from '../../components/common/CloudImageUpload';
import type { PartnerPress } from '../../types';

export const AdminPartners: React.FC = () => {
  const [partners, setPartners] = useState<PartnerPress[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [editingItem, setEditingItem] = useState<Partial<PartnerPress> | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fetchPartners = async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const data = await adminApi.getPartners();
      if (!Array.isArray(data)) throw new Error('Unexpected partners response.');
      setPartners(data);
    } catch (error) {
      setLoadError(getAdminRequestError(error, 'Unable to load partners & press entries.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    try {
      if (editingItem.id) {
        await adminApi.updatePartner(editingItem.id, editingItem);
        setFeedback({ type: 'success', message: 'Partner / Press entry updated.' });
      } else {
        await adminApi.createPartner(editingItem);
        setFeedback({ type: 'success', message: 'New Partner / Press entry published.' });
      }
      setEditingItem(null);
      fetchPartners();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.response?.data?.message || 'Operation failed.' });
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this entry?')) return;
    try {
      await adminApi.deletePartner(id);
      setFeedback({ type: 'success', message: 'Entry removed successfully.' });
      fetchPartners();
    } catch {
      setFeedback({ type: 'error', message: 'Failed to delete.' });
    }
  };

  const filtered = filterType === 'all' ? partners : partners.filter((p) => p.entity_type === filterType);

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#102137] tracking-tight">
            Partners & Press Media
          </h1>
          <p className="text-xs text-[#64748B] mt-1">
            Manage CNN Travel citations, UNESCO affiliations, and state heritage partnerships.
          </p>
        </div>

        <button
          onClick={() =>
            setEditingItem({
              title: '',
              entity_type: 'press',
              organization_name: '',
              quote_or_excerpt: '',
              article_url: '',
              logo_or_image_url: '',
              is_featured: false,
            })
          }
          className="px-4 py-2.5 rounded-xl bg-[#102137] hover:bg-[#183B5B] text-white font-medium text-xs tracking-wider uppercase transition-all shadow-sm inline-flex items-center gap-2 border border-[#C6A04A]/60 shrink-0"
        >
          <Plus className="w-4 h-4 text-[#D9B96E] shrink-0" />
          <span>Add Media Citation</span>
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

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {['all', 'press', 'partner'].map((t) => (
          <button
            key={t}
            onClick={() => setFilterType(t)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
              filterType === t
                ? 'bg-[#102137] text-white'
                : 'bg-white border border-[#E8E3D9] text-[#64748B] hover:text-[#102137]'
            }`}
          >
            {t === 'all' ? 'All Entries' : t === 'press' ? 'Press & Media' : 'Partners'}
          </button>
        ))}
      </div>

      {loadError ? (
        <AdminRequestError message={loadError} onRetry={fetchPartners} />
      ) : loading ? (
        <div className="p-12 text-center text-[#64748B] text-xs">Loading media citations...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-2xl bg-white border border-[#E8E3D9] shadow-sm flex flex-col justify-between space-y-4 hover:border-[#C6A04A] transition-all"
            >
              <div className="space-y-3">
                {item.logo_or_image_url && (
                  <div className="w-full h-36 rounded-xl overflow-hidden bg-[#F8F5EE] border border-[#E8E3D9]">
                    <img
                      src={item.logo_or_image_url}
                      alt={item.organization_name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-semibold text-[#C6A04A] uppercase tracking-wider">
                      {item.entity_type === 'press' ? 'Press Feature' : 'Partner Org'}
                    </span>
                    <span className="text-xs font-bold text-[#102137]">
                      {item.organization_name}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-[#102137] mt-1 line-clamp-2">
                    {item.title}
                  </h3>
                </div>

                {item.quote_or_excerpt && (
                  <p className="text-xs text-[#182332] italic line-clamp-3 leading-relaxed bg-[#F8F5EE] p-2.5 rounded-xl border border-[#E8E3D9]">
                    "{item.quote_or_excerpt}"
                  </p>
                )}
              </div>

              <div className="pt-3 border-t border-[#E8E3D9] flex items-center justify-between">
                {item.article_url ? (
                  <a
                    href={item.article_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-[#C6A04A] hover:text-[#102137] font-semibold inline-flex items-center gap-1"
                  >
                    <span>Read Feature</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ) : <span />}

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

      {/* Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div data-admin-dialog role="dialog" aria-modal="true" aria-label="Partner and press editor" tabIndex={-1} className="relative w-full max-w-xl bg-white rounded-3xl overflow-hidden border border-[#E8E3D9] shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-5 bg-[#F8F5EE] flex justify-between items-center border-b border-[#E8E3D9]">
              <h3 className="text-base font-bold text-[#102137]">
                {editingItem.id ? 'Edit Press/Partner Entry' : 'New Press/Partner Entry'}
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
                <label className="block text-xs font-semibold text-[#102137] uppercase mb-1">Headline / Title</label>
                <input
                  type="text"
                  required
                  value={editingItem.title || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                  placeholder="CNN Travel: 9 reasons to visit Penang..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F5EE] border border-[#E8E3D9] text-[#182332] text-xs focus:outline-none focus:border-[#C6A04A]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#102137] uppercase mb-1">Entity Type</label>
                  <select
                    value={editingItem.entity_type || 'press'}
                    onChange={(e) => setEditingItem({ ...editingItem, entity_type: e.target.value as 'press' | 'partner' })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F5EE] border border-[#E8E3D9] text-[#182332] text-xs focus:outline-none focus:border-[#C6A04A]"
                  >
                    <option value="press">Press & Media</option>
                    <option value="partner">Institutional Partner</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#102137] uppercase mb-1">Organization Name</label>
                  <input
                    type="text"
                    required
                    value={editingItem.organization_name || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, organization_name: e.target.value })}
                    placeholder="CNN Travel / UNESCO ICHCAP / GTWHI"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F5EE] border border-[#E8E3D9] text-[#182332] text-xs focus:outline-none focus:border-[#C6A04A]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#102137] uppercase mb-1">Quote or Excerpt</label>
                <textarea
                  rows={3}
                  value={editingItem.quote_or_excerpt || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, quote_or_excerpt: e.target.value })}
                  placeholder="The sole traditional martial arts school safeguarding George Town's living heritage..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F5EE] border border-[#E8E3D9] text-[#182332] text-xs focus:outline-none focus:border-[#C6A04A]"
                />
              </div>

              {/* Cloud B2 Image Upload */}
              <CloudImageUpload
                label="Organization Logo or Article Image"
                value={editingItem.logo_or_image_url || ''}
                onChange={(url) => setEditingItem({ ...editingItem, logo_or_image_url: url })}
                altText={editingItem.organization_name || 'Partner logo'}
                helperText="Upload official media logo or featured article snapshot."
              />

              <div>
                <label className="block text-xs font-semibold text-[#102137] uppercase mb-1">External Article / Reference URL</label>
                <input
                  type="url"
                  value={editingItem.article_url || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, article_url: e.target.value })}
                  placeholder="https://edition.cnn.com/..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F5EE] border border-[#E8E3D9] text-[#182332] text-xs focus:outline-none focus:border-[#C6A04A] font-mono"
                />
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="partnerFeatured"
                  checked={editingItem.is_featured || false}
                  onChange={(e) => setEditingItem({ ...editingItem, is_featured: e.target.checked })}
                  className="w-4 h-4 rounded border-[#E8E3D9] text-[#102137] focus:ring-[#C6A04A]"
                />
                <label htmlFor="partnerFeatured" className="text-xs text-[#182332] font-semibold cursor-pointer">
                  Feature in Homepage Recognition Ribbon
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
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
