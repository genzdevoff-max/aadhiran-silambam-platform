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
  Star,
  Cloud
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
      setLoadError('Unable to load media from the cloud server. Check the connection and retry.');
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
          error: `File "${file.name}" exceeds the maximum cloud upload limit of 10MB (${(file.size / (1024 * 1024)).toFixed(1)}MB).`,
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
      setFeedback({ type: 'success', message: `${files.length} file(s) uploaded to Backblaze B2 storage.` });
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

  // Execute deletion
  const confirmDelete = async (force: boolean) => {
    if (!deleteTarget || !referencesVerified || deleteSaving) return;

    setDeleteSaving(true);
    try {
      await adminApi.deleteMedia(deleteTarget.id, force);
      setMedia((prev) => prev.filter((m) => m.id !== deleteTarget.id));
      setFeedback({ type: 'success', message: `Asset "${deleteTarget.original_name}" removed from cloud storage and library.` });
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
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-[#102137] flex items-center space-x-3">
            <span className="p-2 rounded-xl bg-[#102137]/5 text-[#102137] border border-[#E8E3D9] flex items-center justify-center">
              <ImageIcon className="w-5 h-5 text-[#C6A04A]" />
            </span>
            <span>Cloud Media Asset Library</span>
          </h1>
          <p className="text-xs text-[#64748B] mt-1">
            Centrally manage high-resolution photography, archival video, certificates, and B2 cloud storage assets.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="hidden lg:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#F8F5EE] border border-[#E8E3D9] text-[11px] text-[#64748B]">
            <Cloud className="w-3.5 h-3.5 text-[#C6A04A]" />
            <span>Backblaze B2 Storage</span>
          </div>
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
            className="px-4 py-2.5 rounded-xl bg-[#102137] hover:bg-[#183B5B] disabled:opacity-50 text-white font-medium text-xs tracking-wider uppercase transition-all shadow-sm border border-[#102137] flex items-center space-x-2"
          >
            <Upload className="w-4 h-4 text-[#C6A04A]" />
            <span>{uploading ? 'Uploading to B2...' : 'Upload Cloud Files'}</span>
          </button>
        </div>
      </div>

      {/* Global Feedback Banner */}
      {feedback && (
        <div
          className={`p-4 rounded-xl text-xs flex items-center space-x-2.5 ${
            feedback.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-800 shadow-sm'
              : 'bg-rose-50 border border-rose-200 text-rose-800 shadow-sm'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          )}
          <span>{feedback.message}</span>
          <button onClick={() => setFeedback(null)} className="ml-auto text-[#64748B] hover:text-[#182332] text-xs">
            ✕
          </button>
        </div>
      )}

      {/* Search & Album Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2 shrink-0" />
          <input
            type="text"
            aria-label="Search media by file name, alt text, or caption"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by file name, alt text, or caption..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-[#E8E3D9] text-[#182332] placeholder-[#64748B] text-xs focus:outline-none focus:border-[#102137] transition-colors shadow-sm"
          />
        </div>

        {albums.length > 0 && (
          <div className="flex items-center space-x-2">
            <Folder className="w-4 h-4 text-[#C6A04A] shrink-0" />
            <select
              value={selectedAlbumFilter}
              onChange={(e) => setSelectedAlbumFilter(e.target.value)}
              className="px-3 py-2.5 rounded-xl bg-white border border-[#E8E3D9] text-[#182332] text-xs focus:outline-none focus:border-[#102137] transition-colors shadow-sm"
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
        <div role="alert" className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-center">
          <p className="text-sm font-semibold text-rose-800">{loadError}</p>
          <button
            type="button"
            onClick={() => fetchMedia()}
            className="mt-4 rounded-xl border border-[#E8E3D9] bg-white px-4 py-2 text-xs font-semibold text-[#182332] hover:bg-[#F8F5EE] transition-colors"
          >
            Retry
          </button>
        </div>
      ) : loading ? (
        <div className="p-8 text-center text-[#64748B] font-mono text-sm">Connecting to cloud storage and media library...</div>
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-white border border-[#E8E3D9] text-[#64748B] text-xs">
          No media assets match your query.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="group relative rounded-xl bg-white border border-[#E8E3D9] overflow-hidden hover:border-[#C6A04A] transition-all shadow-sm hover:shadow-md flex flex-col justify-between"
            >
              {/* Featured Badge */}
              {item.is_featured && (
                <div className="absolute top-2 left-2 z-10 px-1.5 py-0.5 rounded bg-[#C6A04A] text-white font-mono text-[9px] font-bold uppercase flex items-center space-x-1 shadow">
                  <Star className="w-2.5 h-2.5 fill-current shrink-0" />
                  <span>Featured</span>
                </div>
              )}

              {/* Reference Count Badge */}
              {item.reference_count !== undefined && item.reference_count > 0 && (
                <div
                  className="absolute top-2 right-2 z-10 px-1.5 py-0.5 rounded bg-[#102137]/90 text-white font-mono text-[9px] font-semibold"
                  title={`Referenced in ${item.reference_count} places across website`}
                >
                  {item.reference_count} refs
                </div>
              )}

              <div className="aspect-square bg-[#F8F5EE] flex items-center justify-center overflow-hidden relative">
                <img
                  src={item.file_path}
                  alt={item.alt_text || item.original_name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/logo.png';
                  }}
                />
              </div>

              <div className="p-2.5 bg-white flex flex-col justify-between space-y-1">
                <p className="text-[11px] font-medium text-[#182332] truncate" title={item.original_name}>
                  {item.original_name}
                </p>

                {item.caption && (
                  <p className="text-[10px] text-[#64748B] truncate" title={item.caption}>
                    {item.caption}
                  </p>
                )}

                <div className="flex items-center justify-between pt-1 border-t border-[#E8E3D9] text-[10px] text-[#64748B]">
                  <span>{(item.file_size / 1024).toFixed(0)} KB</span>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => openEditModal(item)}
                      className="p-1 rounded text-[#64748B] hover:text-[#C6A04A] hover:bg-[#F8F5EE] transition-colors"
                      title="Edit metadata & alt text"
                    >
                      <Edit2 className="w-3 h-3 shrink-0" />
                    </button>
                    <button
                      onClick={() => startDelete(item)}
                      className="p-1 rounded text-[#64748B] hover:text-rose-600 hover:bg-[#F8F5EE] transition-colors"
                      title="Delete asset"
                    >
                      <Trash2 className="w-3 h-3 shrink-0" />
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
        <div className="fixed inset-0 z-50 bg-[#102137]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div data-admin-dialog role="dialog" aria-modal="true" aria-labelledby="edit-media-title" tabIndex={-1} className="w-full max-w-lg max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-2xl bg-white border border-[#E8E3D9] p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#E8E3D9] pb-3">
              <h2 id="edit-media-title" className="text-base font-display font-bold text-[#102137] flex items-center space-x-2">
                <Edit2 className="w-4 h-4 text-[#C6A04A] shrink-0" />
                <span>Edit Media Asset Metadata</span>
              </h2>
              <button
                type="button"
                onClick={() => setEditingAsset(null)}
                aria-label="Close edit media dialog"
                className="text-[#64748B] hover:text-[#182332]"
              >
                <X className="w-4 h-4 shrink-0" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div className="flex items-center space-x-3 p-3 rounded-xl bg-[#F8F5EE] border border-[#E8E3D9]">
                <img
                  src={editingAsset.file_path}
                  alt={editingAsset.alt_text}
                  className="w-14 h-14 object-cover rounded-lg border border-[#E8E3D9]"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/logo.png';
                  }}
                />
                <div className="truncate text-xs">
                  <p className="font-semibold text-[#182332] truncate">{editingAsset.original_name}</p>
                  <p className="text-[10px] text-[#64748B] font-mono">
                    {editingAsset.mime_type} • {(editingAsset.file_size / 1024).toFixed(0)} KB
                  </p>
                  <p className="text-[10px] text-[#C6A04A] font-mono truncate mt-0.5">
                    {editingAsset.file_path}
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#182332] mb-1">
                  Accessible Alt Text (for Screen Readers & SEO) *
                </label>
                <input
                  type="text"
                  required
                  value={editFormData.alt_text}
                  onChange={(e) => setEditFormData({ ...editFormData, alt_text: e.target.value })}
                  placeholder="Describe image content..."
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#E8E3D9] text-[#182332] text-xs focus:outline-none focus:border-[#102137] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#182332] mb-1">Display Caption</label>
                <textarea
                  rows={2}
                  value={editFormData.caption}
                  onChange={(e) => setEditFormData({ ...editFormData, caption: e.target.value })}
                  placeholder="Optional explanatory caption..."
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#E8E3D9] text-[#182332] text-xs focus:outline-none focus:border-[#102137] transition-colors"
                />
              </div>

              {albums.length > 0 && (
                <div>
                  <label className="block text-xs font-semibold text-[#182332] mb-1">Assign to Album</label>
                  <select
                    value={editFormData.album_id}
                    onChange={(e) => setEditFormData({ ...editFormData, album_id: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#E8E3D9] text-[#182332] text-xs focus:outline-none focus:border-[#102137] transition-colors"
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
                  className="w-4 h-4 rounded text-[#102137] focus:ring-[#102137] border-[#E8E3D9]"
                />
                <label htmlFor="featuredToggle" className="text-xs text-[#182332] font-semibold cursor-pointer">
                  Feature this media asset on the homepage preview gallery
                </label>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-[#E8E3D9]">
                <button
                  type="button"
                  onClick={() => setEditingAsset(null)}
                  className="px-4 py-2 rounded-xl bg-white hover:bg-[#F8F5EE] text-[#64748B] text-xs font-semibold border border-[#E8E3D9] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editSaving}
                  className="px-5 py-2 rounded-xl bg-[#102137] hover:bg-[#183B5B] disabled:opacity-50 text-white text-xs font-medium tracking-wider transition-all shadow-sm"
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
        <div className="fixed inset-0 z-50 bg-[#102137]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div data-admin-dialog role="alertdialog" aria-modal="true" aria-labelledby="delete-media-title" tabIndex={-1} className="w-full max-w-md max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-2xl bg-white border border-[#E8E3D9] p-6 space-y-4 shadow-2xl">
            <div className="flex items-center space-x-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  referenceCount > 0
                    ? 'bg-amber-50 border border-amber-200 text-amber-700'
                    : 'bg-rose-50 border border-rose-200 text-rose-700'
                }`}
              >
                <AlertTriangle className="w-5 h-5 shrink-0" />
              </div>
              <div>
                <h2 id="delete-media-title" className="text-base font-display font-bold text-[#102137]">
                  {referenceCount > 0 ? 'Warning: Asset In Use' : 'Confirm Asset Deletion'}
                </h2>
                <p className="text-xs text-[#64748B]">
                  {deleteTarget.original_name}
                </p>
              </div>
            </div>

            {referenceChecking ? (
              <p className="text-xs text-[#64748B] font-mono">Checking cloud asset reference links...</p>
            ) : referenceError ? (
              <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800">
                {referenceError}
              </p>
            ) : referenceCount > 0 ? (
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs space-y-1.5">
                <p className="font-semibold">
                  This media item is referenced in {referenceCount} place(s) across the website!
                </p>
                <p className="text-[11px] text-amber-700 leading-relaxed">
                  Deleting this file will result in missing images on public pages (such as achievements, articles, or instructor profiles).
                </p>
              </div>
            ) : (
              <p className="text-xs text-[#64748B] leading-relaxed">
                Are you sure you want to delete this media asset? This action will remove the record from cloud storage and database.
              </p>
            )}

            <div className="flex items-center justify-end space-x-2 pt-3 border-t border-[#E8E3D9]">
              <button
                type="button"
                onClick={() => {
                  setDeleteTarget(null);
                  setReferenceCount(0);
                  setReferenceError(null);
                  setReferencesVerified(false);
                }}
                className="px-4 py-2 rounded-xl bg-white hover:bg-[#F8F5EE] text-[#64748B] text-xs font-semibold border border-[#E8E3D9] transition-colors"
              >
                Cancel (Keep Asset)
              </button>

              {referenceCount > 0 ? (
                <button
                  type="button"
                  onClick={() => confirmDelete(true)}
                  disabled={!referencesVerified || referenceChecking || deleteSaving}
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white text-xs font-medium tracking-wider transition-all shadow-sm"
                >
                  {deleteSaving ? 'Deleting...' : 'Force Delete Anyway'}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => confirmDelete(false)}
                  disabled={!referencesVerified || referenceChecking || deleteSaving}
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white text-xs font-medium tracking-wider transition-all shadow-sm"
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
