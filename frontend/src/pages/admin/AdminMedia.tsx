import React, { useEffect, useState, useRef } from 'react';
import {
  Image as ImageIcon,
  Upload,
  Trash2,
  Search,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { adminApi } from '../../services/api';
import type { MediaAsset } from '../../types';

export const AdminMedia: React.FC = () => {
  const [media, setMedia] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [uploading, setUploading] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchMedia = async () => {
    try {
      const data = await adminApi.getMedia();
      if (Array.isArray(data)) {
        setMedia(data);
      }
    } catch (err) {
      console.error('Failed to load media assets:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }

    setUploading(true);
    try {
      await adminApi.uploadMedia(formData);
      setFeedback({ type: 'success', message: `${files.length} file(s) uploaded successfully.` });
      fetchMedia();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.response?.data?.message || 'File upload failed.' });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this media asset?')) return;
    try {
      await adminApi.deleteMedia(id, true);
      setFeedback({ type: 'success', message: 'Asset removed successfully.' });
      fetchMedia();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.response?.data?.message || 'Failed to delete.' });
    }
  };

  const filtered = media.filter(
    (m) =>
      m.original_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.caption?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.alt_text?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-white flex items-center space-x-3">
            <ImageIcon className="w-7 h-7 text-crimson-500" />
            <span>Media Asset Library</span>
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Centrally manage and upload photography, certificates, and archival assets.
          </p>
        </div>

        <div>
          <input
            type="file"
            multiple
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
            accept="image/*"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="px-4 py-2.5 rounded-xl bg-crimson-600 hover:bg-crimson-500 disabled:opacity-50 text-white font-semibold text-xs tracking-wider uppercase transition-colors shadow-md shadow-crimson-900/40 flex items-center space-x-2"
          >
            <Upload className="w-4 h-4" />
            <span>{uploading ? 'Uploading Files...' : 'Upload Media Files'}</span>
          </button>
        </div>
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
          placeholder="Search by file name or caption..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-charcoal-900 border border-charcoal-700 text-white placeholder-gray-500 text-xs focus:outline-none focus:border-gold-500"
        />
      </div>

      {loading ? (
        <div className="p-8 text-center text-gray-500 font-mono text-sm">Loading media library...</div>
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-charcoal-900 border border-charcoal-800 text-gray-400 text-xs">
          No media assets found. Upload photos above to populate the library.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="group relative rounded-xl bg-charcoal-900 border border-charcoal-800 overflow-hidden hover:border-gold-500/50 transition-colors shadow flex flex-col justify-between"
            >
              <div className="aspect-square bg-charcoal-950 flex items-center justify-center overflow-hidden">
                <img
                  src={item.file_path}
                  alt={item.alt_text || item.original_name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/silambam.png';
                  }}
                />
              </div>

              <div className="p-2.5 bg-charcoal-900 flex flex-col justify-between">
                <p className="text-[11px] font-medium text-white truncate" title={item.original_name}>
                  {item.original_name}
                </p>
                <div className="flex items-center justify-between mt-1 text-[10px] text-gray-500">
                  <span>{(item.file_size / 1024).toFixed(0)} KB</span>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1 rounded text-gray-400 hover:text-crimson-400 hover:bg-charcoal-800 transition-colors"
                    title="Delete file"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
