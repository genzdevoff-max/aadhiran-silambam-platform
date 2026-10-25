import React, { useEffect, useState } from 'react';
import {
  Newspaper,
  Plus,
  Edit2,
  Trash2,
  Search,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { adminApi } from '../../services/api';
import { AdminRequestError, getAdminRequestError } from '../../components/admin/AdminRequestState';
import type { PartnerPress } from '../../types';

export const AdminPartners: React.FC = () => {
  const [items, setItems] = useState<PartnerPress[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [editingItem, setEditingItem] = useState<Partial<PartnerPress> | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fetchItems = async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const data = await adminApi.getPartners();
      if (!Array.isArray(data)) throw new Error('Unexpected partner response.');
      setItems(data);
    } catch (error) {
      setLoadError(getAdminRequestError(error, 'Unable to load partners and press items.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    try {
      if (editingItem.id) {
        await adminApi.updatePartner(editingItem.id, editingItem);
        setFeedback({ type: 'success', message: 'Item updated successfully.' });
      } else {
        await adminApi.createPartner(editingItem);
        setFeedback({ type: 'success', message: 'Item added successfully.' });
      }
      setEditingItem(null);
      fetchItems();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.response?.data?.message || 'Operation failed.' });
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this press/partner item?')) return;
    try {
      await adminApi.deletePartner(id);
      setFeedback({ type: 'success', message: 'Item removed successfully.' });
      fetchItems();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.response?.data?.message || 'Failed to delete.' });
    }
  };

  const filtered = items.filter((item) => {
    const matchesType = typeFilter === 'all' || item.entity_type === typeFilter;
    const matchesQuery =
      item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.organization_name?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesQuery;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-white flex items-center space-x-3">
            <Newspaper className="w-7 h-7 text-crimson-500" />
            <span>Partners & Press Media</span>
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Manage CNN, Astro, national news media coverage and institutional partner affiliations.
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
              is_featured: false,
            })
          }
          className="px-4 py-2.5 rounded-xl bg-crimson-600 hover:bg-crimson-500 text-white font-semibold text-xs tracking-wider uppercase transition-colors shadow-md shadow-crimson-900/40 flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>New Entry</span>
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

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="sm:col-span-2 relative">
          <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by publication name or title..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-charcoal-900 border border-charcoal-700 text-white placeholder-gray-500 text-xs focus:outline-none focus:border-gold-500"
          />
        </div>

        <div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl bg-charcoal-900 border border-charcoal-700 text-white text-xs focus:outline-none focus:border-gold-500"
          >
            <option value="all">All Types</option>
            <option value="press">Press & Media</option>
            <option value="partner">Institutional Partner</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="p-8 text-center text-gray-500 font-mono text-sm">Loading press items...</div>
      ) : loadError ? (
        <AdminRequestError message={loadError} onRetry={() => fetchItems()} />
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-charcoal-900 border border-charcoal-800 text-gray-400 text-xs">
          {items.length === 0 ? 'No records have been added yet.' : 'No records match the selected filters.'}
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
                  <span className="text-[10px] font-mono font-bold text-crimson-400 uppercase bg-crimson-950/80 px-2 py-0.5 rounded border border-crimson-800/60">
                    {item.entity_type}
                  </span>
                  <span className="text-xs font-mono font-semibold text-gold-400">{item.organization_name}</span>
                </div>
                <h3 className="text-base font-display font-bold text-white mb-2">{item.title}</h3>
                {item.quote_or_excerpt && (
                  <p className="text-xs text-gray-400 line-clamp-3 italic leading-relaxed">
                    "{item.quote_or_excerpt}"
                  </p>
                )}
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
          <div data-admin-dialog role="dialog" aria-modal="true" aria-label="Partner and press editor" tabIndex={-1} className="relative w-full max-w-xl bg-charcoal-900 rounded-2xl overflow-hidden border border-charcoal-700 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-5 bg-charcoal-950 flex justify-between items-center border-b border-charcoal-800">
              <h3 className="text-base font-display font-bold text-white">
                {editingItem.id ? 'Edit Press/Partner Entry' : 'New Press/Partner Entry'}
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
                <label className="block text-xs font-semibold text-gray-300 uppercase mb-1">Headline / Title</label>
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
                  <label className="block text-xs font-semibold text-gray-300 uppercase mb-1">Entity Type</label>
                  <select
                    value={editingItem.entity_type || 'press'}
                    onChange={(e) => setEditingItem({ ...editingItem, entity_type: e.target.value as 'press' | 'partner' })}
                    className="w-full px-3 py-2 rounded-xl bg-charcoal-950 border border-charcoal-700 text-white text-xs focus:outline-none focus:border-gold-500"
                  >
                    <option value="press">Press & Media</option>
                    <option value="partner">Institutional Partner</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase mb-1">Organization Name</label>
                  <input
                    type="text"
                    required
                    value={editingItem.organization_name || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, organization_name: e.target.value })}
                    placeholder="CNN Travel / Astro / RTM"
                    className="w-full px-3 py-2 rounded-xl bg-charcoal-950 border border-charcoal-700 text-white text-xs focus:outline-none focus:border-gold-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase mb-1">Quote or Excerpt</label>
                <textarea
                  rows={3}
                  value={editingItem.quote_or_excerpt || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, quote_or_excerpt: e.target.value })}
                  placeholder="The sole traditional martial arts school safeguarding George Town's living heritage..."
                  className="w-full px-3 py-2 rounded-xl bg-charcoal-950 border border-charcoal-700 text-white text-xs focus:outline-none focus:border-gold-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase mb-1">External Article / Reference URL</label>
                <input
                  type="url"
                  value={editingItem.article_url || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, article_url: e.target.value })}
                  placeholder="https://edition.cnn.com/..."
                  className="w-full px-3 py-2 rounded-xl bg-charcoal-950 border border-charcoal-700 text-white text-xs focus:outline-none focus:border-gold-500 font-mono"
                />
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="partnerFeatured"
                  checked={editingItem.is_featured || false}
                  onChange={(e) => setEditingItem({ ...editingItem, is_featured: e.target.checked })}
                  className="w-4 h-4 rounded border-charcoal-700 bg-charcoal-950 text-crimson-600 focus:ring-0"
                />
                <label htmlFor="partnerFeatured" className="text-xs text-gray-300 font-semibold cursor-pointer">
                  Feature in Homepage Recognition Ribbon
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
