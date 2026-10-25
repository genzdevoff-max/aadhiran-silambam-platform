import React, { useEffect, useState, useRef } from 'react';
import {
  Image as ImageIcon,
  Upload,
  Trash2,
  Search,
  CheckCircle2,
  AlertCircle,
  Edit2,
  X,
  AlertTriangle,
  Folder,
  Star
} from 'lucide-react';
import { adminApi } from '../../services/api';
import type { MediaAsset, Album } from '../../types';

export const AdminMedia: React.FC = () => {
  const [media, setMedia] = useState<MediaAsset[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [selectedAlbumFilter, setSelectedAlbumFilter] = useState<string>('all');
  const [loading, setLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [uploading, setUploading] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Edit modal state
  const [editingAsset, setEditingAsset] = useState<MediaAsset | null>(null);
  const [editFormData, setEditFormData] = useState({
    alt_text: '',
    caption: '',
    album_id: '',
    is_featured: false,
  });
  const [editSaving, setEditSaving] = useState<boolean>(false);

  // Delete / Reference warning modal state
  const [deleteTarget, setDeleteTarget] = useState<MediaAsset | null>(null);
  const [referenceCount, setReferenceCount] = useState<number>(0);
  const [referenceChecking, setReferenceChecking] = useState<boolean>(false);
  const [referencesVerified, setReferencesVerified] = useState<boolean>(false);
  const [referenceError, setReferenceError] = useState<string | null>(null);
  const [deleteSaving, setDeleteSaving] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchMedia = async (showLoading = true) => {
    if (showLoading) {
      setLoading(true);
      setLoadError(null);
    }
    try {
      const [mediaData, albumData] = await Promise.all([
        adminApi.getMedia(),
        adminApi.getAlbums(),
      ]);

      setMedia(Array.isArray(mediaData) ? mediaData : []);
      setAlbums(Array.isArray(albumData) ? albumData : []);
    } catch {
      setMedia([]);
      setAlbums([]);
      setLoadError('Unable to load media from the server. Check the connection and retry.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia(false);
  }, []);

  // Client-side file validation
  const validateFiles = (files: FileList): { valid: boolean; error?: string } => {
    const maxSizeBytes = 10 * 1024 * 1024; // 10MB
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/gif',
      'video/mp4',
      'video/webm',
      'application/pdf',
    ];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      if (file.size > maxSizeBytes) {
        return {
          valid: false,
          error: `File "${file.name}" exceeds the maximum upload limit of 10MB (${(file.size / (1024 * 1024)).toFixed(1)}MB).`,
        };
      }

      if (!allowedTypes.includes(file.type)) {
        return {
          valid: false,
          error: `File "${file.name}" has an unsupported format (${file.type || 'unknown'}). Allowed: JPEG, PNG, WebP, GIF, MP4, WebM, and PDF.`,
        };
      }
    }

    return { valid: true };
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Validate files before upload
    const validation = validateFiles(files);
    if (!validation.valid) {
      setFeedback({ type: 'error', message: validation.error || 'Invalid file selection.' });
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }
    if (selectedAlbumFilter !== 'all') {
      formData.append('album_id', selectedAlbumFilter);
    }

    setUploading(true);
    setFeedback(null);
    try {
      await adminApi.uploadMedia(formData);
      setFeedback({ type: 'success', message: `${files.length} file(s) uploaded successfully.` });
      await fetchMedia();
    } catch (err: any) {
      const errMsg =
        err.response?.data?.message ||
        'Media upload failed. Check the selected files and server connection, then retry.';
      setFeedback({ type: 'error', message: errMsg });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Open Edit Modal
  const openEditModal = (asset: MediaAsset) => {
    setEditingAsset(asset);
    setEditFormData({
      alt_text: asset.alt_text || '',
      caption: asset.caption || '',
      album_id: asset.album_id || '',
      is_featured: !!asset.is_featured,
    });
  };

  // Save Edit
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAsset) return;

    setEditSaving(true);
    try {
      await adminApi.updateMedia(editingAsset.id, editFormData);
      setMedia((prev) =>
        prev.map((m) =>
          m.id === editingAsset.id
            ? {
                ...m,
                alt_text: editFormData.alt_text,
                caption: editFormData.caption,
                album_id: editFormData.album_id || undefined,
                is_featured: editFormData.is_featured,
              }
            : m
        )
      );
      setFeedback({ type: 'success', message: `Metadata for "${editingAsset.original_name}" updated successfully.` });
      setEditingAsset(null);
    } catch (err: any) {
      setFeedback({
        type: 'error',
        message: err.response?.data?.message || `Unable to update "${editingAsset.original_name}". Please retry.`,
      });
    } finally {
      setEditSaving(false);
    }
  };

  // Initiate safe deletion check
  const startDelete = async (asset: MediaAsset) => {
    setDeleteTarget(asset);
    setReferenceChecking(true);
    setReferencesVerified(false);
    setReferenceError(null);
    setReferenceCount(0);

    let verified = false;
    try {
      const refs = await adminApi.getMediaReferences(asset.id);
      if (Array.isArray(refs)) {
        setReferenceCount(refs.length);
        verified = true;
      } else {
        throw new Error('Unexpected response while checking media references.');
      }
    } catch {
      setReferenceError('Unable to verify whether this file is in use. Deletion is disabled until the reference check succeeds.');
    } finally {
      setReferencesVerified(verified);
      setReferenceChecking(false);
    }
  };

  // Execute deletion (force if referenced)
  const confirmDelete = async (force: boolean) => {
    if (!deleteTarget || !referencesVerified || deleteSaving) return;

    setDeleteSaving(true);
    try {
      await adminApi.deleteMedia(deleteTarget.id, force);
      setMedia((prev) => prev.filter((m) => m.id !== deleteTarget.id));
      setFeedback({ type: 'success', message: `Asset "${deleteTarget.original_name}" deleted successfully.` });
      setDeleteTarget(null);
      setReferenceCount(0);
    } catch (err: any) {
      setFeedback({
        type: 'error',
        message: err.response?.data?.message || `Unable to delete "${deleteTarget.original_name}". The asset remains in the library.`,
      });
    } finally {
      setDeleteSaving(false);
    }
  };

  const filtered = media.filter((m) => {
    const matchesSearch =
      m.original_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.caption?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.alt_text?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesAlbum =
      selectedAlbumFilter === 'all' || m.album_id === selectedAlbumFilter;

    return matchesSearch && matchesAlbum;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-white flex items-center space-x-3">
            <ImageIcon className="w-7 h-7 text-crimson-500" />
            <span>Media Asset Library</span>
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Centrally manage photography, archival video, certificates, and safe reference links.
          </p>
        </div>

        <div>
          <input
            type="file"
            multiple
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
            accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm,application/pdf"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="px-4 py-2.5 rounded-xl bg-crimson-600 hover:bg-crimson-500 disabled:opacity-50 text-white font-semibold text-xs tracking-wider uppercase transition-colors shadow-md shadow-crimson-900/40 flex items-center space-x-2"
          >
            <Upload className="w-4 h-4" />
            <span>{uploading ? 'Validating & Uploading...' : 'Upload Media Files'}</span>
          </button>
        </div>
      </div>

      {/* Global Feedback Banner */}
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

      {/* Search & Album Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            aria-label="Search media by file name, alt text, or caption"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by file name, alt text, or caption..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-charcoal-900 border border-charcoal-700 text-white placeholder-gray-500 text-xs focus:outline-none focus:border-gold-500"
          />
        </div>

        {albums.length > 0 && (
          <div className="flex items-center space-x-2">
            <Folder className="w-4 h-4 text-gold-400 flex-shrink-0" />
            <select
              value={selectedAlbumFilter}
              onChange={(e) => setSelectedAlbumFilter(e.target.value)}
              className="px-3 py-2.5 rounded-xl bg-charcoal-900 border border-charcoal-700 text-white text-xs focus:outline-none focus:border-gold-500"
            >
              <option value="all">All Albums ({media.length})</option>
              {albums.map((alb) => (
                <option key={alb.id} value={alb.id}>
                  {alb.title}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Media Grid */}
      {loadError ? (
        <div role="alert" className="rounded-2xl border border-crimson-700/60 bg-crimson-950/60 p-6 text-center">
          <p className="text-sm font-semibold text-crimson-200">{loadError}</p>
          <button
            type="button"
            onClick={() => fetchMedia()}
            className="mt-4 rounded-xl border border-charcoal-700 bg-charcoal-800 px-4 py-2 text-xs font-semibold text-white hover:bg-charcoal-700"
          >
            Retry
          </button>
        </div>
      ) : loading ? (
        <div className="p-8 text-center text-gray-500 font-mono text-sm">Loading media library...</div>
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-charcoal-900 border border-charcoal-800 text-gray-400 text-xs">
          No media assets match your query.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="group relative rounded-xl bg-charcoal-900 border border-charcoal-800 overflow-hidden hover:border-gold-500/50 transition-colors shadow flex flex-col justify-between"
            >
              {/* Featured Badge */}
              {item.is_featured && (
                <div className="absolute top-2 left-2 z-10 px-1.5 py-0.5 rounded bg-gold-500/90 text-charcoal-950 font-mono text-[9px] font-bold uppercase flex items-center space-x-1 shadow">
                  <Star className="w-2.5 h-2.5 fill-current" />
                  <span>Featured</span>
                </div>
              )}

              {/* Reference Count Badge */}
              {item.reference_count !== undefined && item.reference_count > 0 && (
                <div
                  className="absolute top-2 right-2 z-10 px-1.5 py-0.5 rounded bg-cobalt-950/90 border border-cobalt-700 text-cobalt-300 font-mono text-[9px] font-semibold"
                  title={`Referenced in ${item.reference_count} places across website`}
                >
                  {item.reference_count} refs
                </div>
              )}

              <div className="aspect-square bg-charcoal-950 flex items-center justify-center overflow-hidden relative">
                <img
                  src={item.file_path}
                  alt={item.alt_text || item.original_name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/logo.png';
                  }}
                />
              </div>

              <div className="p-2.5 bg-charcoal-900 flex flex-col justify-between space-y-1">
                <p className="text-[11px] font-medium text-white truncate" title={item.original_name}>
                  {item.original_name}
                </p>

                {item.caption && (
                  <p className="text-[10px] text-gray-400 truncate" title={item.caption}>
                    {item.caption}
                  </p>
                )}

                <div className="flex items-center justify-between pt-1 border-t border-charcoal-800 text-[10px] text-gray-500">
                  <span>{(item.file_size / 1024).toFixed(0)} KB</span>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => openEditModal(item)}
                      className="p-1 rounded text-gray-400 hover:text-gold-400 hover:bg-charcoal-800 transition-colors"
                      title="Edit metadata & alt text"
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => startDelete(item)}
                      className="p-1 rounded text-gray-400 hover:text-crimson-400 hover:bg-charcoal-800 transition-colors"
                      title="Delete asset"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Metadata Modal */}
      {editingAsset && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div data-admin-dialog role="dialog" aria-modal="true" aria-labelledby="edit-media-title" tabIndex={-1} className="w-full max-w-lg max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-2xl bg-charcoal-900 border border-charcoal-800 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-charcoal-800 pb-3">
              <h2 id="edit-media-title" className="text-sm font-display font-bold text-white flex items-center space-x-2">
                <Edit2 className="w-4 h-4 text-gold-400" />
                <span>Edit Media Asset Metadata</span>
              </h2>
              <button
                type="button"
                onClick={() => setEditingAsset(null)}
                aria-label="Close edit media dialog"
                className="text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div className="flex items-center space-x-3 p-3 rounded-xl bg-charcoal-950 border border-charcoal-800">
                <img
                  src={editingAsset.file_path}
                  alt={editingAsset.alt_text}
                  className="w-14 h-14 object-cover rounded-lg"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/logo.png';
                  }}
                />
                <div className="truncate text-xs">
                  <p className="font-semibold text-white truncate">{editingAsset.original_name}</p>
                  <p className="text-[10px] text-gray-500 font-mono">
                    {editingAsset.mime_type} • {(editingAsset.file_size / 1024).toFixed(0)} KB
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Accessible Alt Text (for Screen Readers & SEO) *
                </label>
                <input
                  type="text"
                  required
                  value={editFormData.alt_text}
                  onChange={(e) => setEditFormData({ ...editFormData, alt_text: e.target.value })}
                  placeholder="Describe image content..."
                  className="w-full px-3 py-2 rounded-xl bg-charcoal-950 border border-charcoal-700 text-white text-xs focus:outline-none focus:border-gold-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Display Caption</label>
                <textarea
                  rows={2}
                  value={editFormData.caption}
                  onChange={(e) => setEditFormData({ ...editFormData, caption: e.target.value })}
                  placeholder="Optional explanatory caption..."
                  className="w-full px-3 py-2 rounded-xl bg-charcoal-950 border border-charcoal-700 text-white text-xs focus:outline-none focus:border-gold-500"
                />
              </div>

              {albums.length > 0 && (
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Assign to Album</label>
                  <select
                    value={editFormData.album_id}
                    onChange={(e) => setEditFormData({ ...editFormData, album_id: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-charcoal-950 border border-charcoal-700 text-white text-xs focus:outline-none focus:border-gold-500"
                  >
                    <option value="">No Album (General Uncategorized)</option>
                    {albums.map((alb) => (
                      <option key={alb.id} value={alb.id}>
                        {alb.title}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="featuredToggle"
                  checked={editFormData.is_featured}
                  onChange={(e) => setEditFormData({ ...editFormData, is_featured: e.target.checked })}
                  className="w-4 h-4 rounded text-crimson-600 focus:ring-crimson-500 bg-charcoal-950 border-charcoal-700"
                />
                <label htmlFor="featuredToggle" className="text-xs text-gray-300 font-semibold cursor-pointer">
                  Feature this media asset on the homepage preview gallery
                </label>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-charcoal-800">
                <button
                  type="button"
                  onClick={() => setEditingAsset(null)}
                  className="px-4 py-2 rounded-xl bg-charcoal-800 hover:bg-charcoal-700 text-gray-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editSaving}
                  className="px-4 py-2 rounded-xl bg-crimson-600 hover:bg-crimson-500 disabled:opacity-50 text-white text-xs font-semibold uppercase tracking-wider"
                >
                  {editSaving ? 'Saving...' : 'Save Metadata'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete / Reference Warning Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div data-admin-dialog role="alertdialog" aria-modal="true" aria-labelledby="delete-media-title" tabIndex={-1} className="w-full max-w-md max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-2xl bg-charcoal-900 border border-charcoal-800 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center space-x-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  referenceCount > 0
                    ? 'bg-amber-950 border border-amber-700 text-amber-400'
                    : 'bg-crimson-950 border border-crimson-700 text-crimson-400'
                }`}
              >
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h2 id="delete-media-title" className="text-sm font-display font-bold text-white">
                  {referenceCount > 0 ? 'Warning: Asset In Use' : 'Confirm Asset Deletion'}
                </h2>
                <p className="text-xs text-gray-400">
                  {deleteTarget.original_name}
                </p>
              </div>
            </div>

            {referenceChecking ? (
              <p className="text-xs text-gray-400 font-mono">Checking asset reference links...</p>
            ) : referenceError ? (
              <p role="alert" className="rounded-xl border border-crimson-700/60 bg-crimson-950/60 p-3 text-xs text-crimson-200">
                {referenceError}
              </p>
            ) : referenceCount > 0 ? (
              <div className="p-3.5 rounded-xl bg-amber-950/60 border border-amber-800/80 text-amber-300 text-xs space-y-1.5">
                <p className="font-semibold">
                  This media item is referenced in {referenceCount} place(s) across the website!
                </p>
                <p className="text-[11px] text-amber-400/90 leading-relaxed">
                  Deleting this file will result in missing images on public pages (such as achievements, articles, or instructor profiles).
                </p>
              </div>
            ) : (
              <p className="text-xs text-gray-300 leading-relaxed">
                Are you sure you want to delete this media asset? This action will remove the record and unlink the asset.
              </p>
            )}

            <div className="flex items-center justify-end space-x-2 pt-3 border-t border-charcoal-800">
              <button
                type="button"
                onClick={() => {
                  setDeleteTarget(null);
                  setReferenceCount(0);
                  setReferenceError(null);
                  setReferencesVerified(false);
                }}
                className="px-4 py-2 rounded-xl bg-charcoal-800 hover:bg-charcoal-700 text-gray-300 text-xs font-semibold"
              >
                Cancel (Keep Asset)
              </button>

              {referenceCount > 0 ? (
                <button
                  type="button"
                  onClick={() => confirmDelete(true)}
                  disabled={!referencesVerified || referenceChecking || deleteSaving}
                  className="px-4 py-2 rounded-xl bg-crimson-700 hover:bg-crimson-600 disabled:opacity-50 text-white text-xs font-semibold uppercase tracking-wider"
                >
                  {deleteSaving ? 'Deleting...' : 'Force Delete Anyway'}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => confirmDelete(false)}
                  disabled={!referencesVerified || referenceChecking || deleteSaving}
                  className="px-4 py-2 rounded-xl bg-crimson-600 hover:bg-crimson-500 disabled:opacity-50 text-white text-xs font-semibold uppercase tracking-wider"
                >
                  {deleteSaving ? 'Deleting...' : 'Delete Asset'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
