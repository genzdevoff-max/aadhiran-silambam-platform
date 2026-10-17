import React, { useEffect, useState } from 'react';
import {
  Folder,
  Plus,
  Edit2,
  Trash2,
  Search,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { adminApi } from '../../services/api';
import type { Album } from '../../types';

export const AdminAlbums: React.FC = () => {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [editingItem, setEditingItem] = useState<Partial<Album> | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fetchAlbums = async () => {
    try {
      const data = await adminApi.getAlbums();
      if (Array.isArray(data)) {
        setAlbums(data);
      }
    } catch (err) {
      console.error('Failed to load albums:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlbums();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    try {
      if (editingItem.id) {
        await adminApi.updateAlbum(editingItem.id, editingItem);
        setFeedback({ type: 'success', message: 'Photo album updated successfully.' });
      } else {
        await adminApi.createAlbum(editingItem);
        setFeedback({ type: 'success', message: 'Photo album created successfully.' });
      }
      setEditingItem(null);
      fetchAlbums();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.response?.data?.message || 'Operation failed.' });
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this album? Photos assigned to this album will become unassigned.')) return;
    try {
      await adminApi.deleteAlbum(id);
      setFeedback({ type: 'success', message: 'Album deleted successfully.' });
      fetchAlbums();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.response?.data?.message || 'Failed to delete.' });
    }
  };

  const filtered = albums.filter((a) =>
    a.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-white flex items-center space-x-3">
            <Folder className="w-7 h-7 text-gold-400" />
            <span>Photo Albums</span>
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Organize association visual archives into chronological and thematic galleries.
          </p>
        </div>

        <button
          onClick={() =>
            setEditingItem({
              title: '',
              slug: '',
              description: '',
              category: 'Training',
              is_published: true,
            })
          }
          className="px-4 py-2.5 rounded-xl bg-crimson-600 hover:bg-crimson-500 text-white font-semibold text-xs tracking-wider uppercase transition-colors shadow-md shadow-crimson-900/40 flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>New Album</span>
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
          placeholder="Search albums..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-charcoal-900 border border-charcoal-700 text-white placeholder-gray-500 text-xs focus:outline-none focus:border-gold-500"
        />
      </div>

      {loading ? (
        <div className="p-8 text-center text-gray-500 font-mono text-sm">Loading photo albums...</div>
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-charcoal-900 border border-charcoal-800 text-gray-400 text-xs">
          No photo albums recorded yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((album) => (
            <div
              key={album.id}
              className="rounded-2xl bg-charcoal-900 border border-charcoal-800 p-5 flex flex-col justify-between space-y-4 hover:border-gold-500/40 transition-colors shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono font-bold text-crimson-400 uppercase bg-crimson-950/80 px-2 py-0.5 rounded border border-crimson-800/60">
                    {album.category || 'Archive'}
                  </span>
                  <span className="text-xs font-mono text-gray-400">
                    {album.photo_count || 0} photos
                  </span>
                </div>
                <h3 className="text-base font-display font-bold text-white mb-2">{album.title}</h3>
                {album.description && (
                  <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">{album.description}</p>
                )}
              </div>

              <div className="pt-3 border-t border-charcoal-800 flex items-center justify-between">
                <span
                  className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                    album.is_published ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'text-gray-500'
                  }`}
                >
                  {album.is_published ? 'Published' : 'Draft'}
                </span>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setEditingItem(album)}
                    className="p-1.5 rounded-lg bg-charcoal-800 hover:bg-charcoal-700 text-gold-400"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(album.id)}
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
          <div className="relative w-full max-w-lg bg-charcoal-900 rounded-2xl overflow-hidden border border-charcoal-700 shadow-2xl p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-charcoal-800 pb-3">
              <h3 className="text-base font-display font-bold text-white">
                {editingItem.id ? 'Edit Album' : 'Create Photo Album'}
              </h3>
              <button
                onClick={() => setEditingItem(null)}
                className="text-gray-400 hover:text-white px-2 py-1 rounded bg-charcoal-800 text-xs"
              >
                ✕ Cancel
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase mb-1">Album Title</label>
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
                  <label className="block text-xs font-semibold text-gray-300 uppercase mb-1">Slug (URL)</label>
                  <input
                    type="text"
                    required
                    value={editingItem.slug || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, slug: e.target.value })}
                    placeholder="archival-photos-1975"
                    className="w-full px-3 py-2 rounded-xl bg-charcoal-950 border border-charcoal-700 text-white text-xs focus:outline-none focus:border-gold-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase mb-1">Category</label>
                  <input
                    type="text"
                    value={editingItem.category || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                    placeholder="Historical / Training / Events"
                    className="w-full px-3 py-2 rounded-xl bg-charcoal-950 border border-charcoal-700 text-white text-xs focus:outline-none focus:border-gold-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editingItem.description || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-charcoal-950 border border-charcoal-700 text-white text-xs focus:outline-none focus:border-gold-500"
                />
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="albumPublish"
                  checked={editingItem.is_published ?? true}
                  onChange={(e) => setEditingItem({ ...editingItem, is_published: e.target.checked })}
                  className="w-4 h-4 rounded border-charcoal-700 bg-charcoal-950 text-crimson-600 focus:ring-0"
                />
                <label htmlFor="albumPublish" className="text-xs text-gray-300 font-semibold cursor-pointer">
                  Publish on Public Photo Gallery Page
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
                  Save Album
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
