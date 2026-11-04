import React, { useEffect, useState } from 'react';
import {
  Folder,
  Plus,
  Edit2,
  Trash2,
  Search,
  CheckCircle2,
  AlertCircle,
  X
} from 'lucide-react';
import { adminApi } from '../../services/api';
import { AdminRequestError, getAdminRequestError } from '../../components/admin/AdminRequestState';
import { CloudImageUpload } from '../../components/common/CloudImageUpload';
import type { Album } from '../../types';

export const AdminAlbums: React.FC = () => {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [editingItem, setEditingItem] = useState<Partial<Album> | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fetchAlbums = async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const data = await adminApi.getAlbums();
      if (!Array.isArray(data)) throw new Error('Unexpected albums response.');
      setAlbums(data);
    } catch (error) {
      setLoadError(getAdminRequestError(error, 'Unable to load photo albums.'));
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
    if (!window.confirm('Are you sure you want to delete this album? Photos assigned to this album will remain in the library.')) return;
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
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-[#102137] flex items-center space-x-3">
            <span className="p-2 rounded-xl bg-[#102137]/5 text-[#102137] border border-[#E8E3D9] flex items-center justify-center">
              <Folder className="w-5 h-5 text-[#C6A04A]" />
            </span>
            <span>Photo Albums</span>
          </h1>
          <p className="text-xs text-[#64748B] mt-1">
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
          className="px-4 py-2.5 rounded-xl bg-[#102137] hover:bg-[#183B5B] text-white font-medium text-xs tracking-wider uppercase transition-all shadow-sm border border-[#102137] inline-flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4 text-[#C6A04A]" />
          <span>New Album</span>
        </button>
      </div>

      {feedback && (
        <div
          className={`p-4 rounded-xl text-xs flex items-center space-x-2.5 ${
            feedback.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border border-rose-200 text-rose-800'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
          )}
          <span>{feedback.message}</span>
          <button onClick={() => setFeedback(null)} className="ml-auto text-[#64748B] hover:text-[#182332] text-xs">
            ✕
          </button>
        </div>
      )}

      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2 shrink-0 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search albums..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-[#E8E3D9] text-[#182332] placeholder-[#64748B] text-xs focus:outline-none focus:border-[#102137] transition-colors shadow-sm"
        />
      </div>

      {loading ? (
        <div className="p-8 text-center text-[#64748B] font-mono text-sm">Loading photo albums...</div>
      ) : loadError ? (
        <AdminRequestError message={loadError} onRetry={() => fetchAlbums()} />
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-white border border-[#E8E3D9] text-[#64748B] text-xs">
          {albums.length === 0 ? 'No photo albums have been recorded yet.' : 'No albums match your search.'}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((album) => (
            <div
              key={album.id}
              className="rounded-2xl bg-white border border-[#E8E3D9] hover:border-[#C6A04A] p-5 flex flex-col justify-between space-y-4 transition-all shadow-sm hover:shadow-md"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono font-bold text-[#102137] uppercase tracking-wider px-2 py-0.5 rounded bg-[#F8F5EE] border border-[#E8E3D9]">
                    {album.category || 'Archive'}
                  </span>
                  <span className="text-xs font-mono text-[#C6A04A] font-semibold">
                    {album.photo_count || 0} photos
                  </span>
                </div>
                <h3 className="text-base font-display font-bold text-[#102137] mb-2">{album.title}</h3>
                {album.description && (
                  <p className="text-xs text-[#64748B] line-clamp-2 leading-relaxed">{album.description}</p>
                )}
              </div>

              <div className="pt-3 border-t border-[#E8E3D9] flex items-center justify-between">
                <span
                  className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full border ${
                    album.is_published ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'text-[#64748B] bg-gray-50 border-gray-200'
                  }`}
                >
                  {album.is_published ? 'Published' : 'Draft'}
                </span>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setEditingItem(album)}
                    className="px-3 py-1.5 rounded-lg bg-white hover:bg-[#F8F5EE] text-[#102137] text-xs font-semibold inline-flex items-center gap-1.5 border border-[#E8E3D9] transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-[#C6A04A]" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(album.id)}
                    className="px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold inline-flex items-center gap-1.5 border border-rose-200 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#102137]/60 backdrop-blur-sm">
          <div data-admin-dialog role="dialog" aria-modal="true" aria-label="Photo album editor" tabIndex={-1} className="relative w-full max-w-lg bg-white rounded-3xl overflow-hidden border border-[#E8E3D9] shadow-2xl p-6 space-y-4 max-h-[calc(100dvh-2rem)] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-[#E8E3D9] pb-3">
              <h3 className="text-base font-display font-bold text-[#102137]">
                {editingItem.id ? 'Edit Album' : 'Create Photo Album'}
              </h3>
              <button
                onClick={() => setEditingItem(null)}
                className="text-[#64748B] hover:text-[#182332] p-1.5 rounded-lg hover:bg-[#F8F5EE] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#182332] uppercase mb-1">Album Title</label>
                <input
                  type="text"
                  required
                  value={editingItem.title || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E8E3D9] text-[#182332] text-xs focus:outline-none focus:border-[#102137]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#182332] uppercase mb-1">Slug (URL)</label>
                  <input
                    type="text"
                    required
                    value={editingItem.slug || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, slug: e.target.value })}
                    placeholder="archival-photos-1975"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E8E3D9] text-[#182332] text-xs focus:outline-none focus:border-[#102137] font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#182332] uppercase mb-1">Category</label>
                  <input
                    type="text"
                    value={editingItem.category || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                    placeholder="Historical / Training / Events"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E8E3D9] text-[#182332] text-xs focus:outline-none focus:border-[#102137]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#182332] uppercase mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editingItem.description || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E8E3D9] text-[#182332] text-xs focus:outline-none focus:border-[#102137]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#182332] uppercase mb-1">Album Cover Photo</label>
                <CloudImageUpload
                  value={editingItem.cover_photo || ''}
                  onChange={(url) => setEditingItem({ ...editingItem, cover_photo: url })}
                  label="Upload Album Cover Image"
                />
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="albumPublish"
                  checked={editingItem.is_published ?? true}
                  onChange={(e) => setEditingItem({ ...editingItem, is_published: e.target.checked })}
                  className="w-4 h-4 rounded border-[#E8E3D9] text-[#102137] focus:ring-0"
                />
                <label htmlFor="albumPublish" className="text-xs text-[#182332] font-semibold cursor-pointer">
                  Publish on Public Photo Gallery Page
                </label>
              </div>

              <div className="pt-4 border-t border-[#E8E3D9] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 rounded-xl bg-white text-[#64748B] hover:text-[#182332] text-xs font-semibold border border-[#E8E3D9]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#102137] hover:bg-[#183B5B] text-white text-xs font-medium tracking-wider uppercase transition-all shadow-sm"
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
