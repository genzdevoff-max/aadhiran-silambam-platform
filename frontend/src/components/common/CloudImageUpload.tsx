import React, { useState, useRef, useCallback } from 'react';
import { UploadCloud, X, RefreshCw, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { adminApi } from '../../services/api';

export interface CloudImageUploadProps {
  value?: string;
  onChange: (url: string, asset?: any) => void;
  label?: string;
  required?: boolean;
  helperText?: string;
  albumId?: string;
  altText?: string;
  folder?: string;
  className?: string;
  maxSizeBytes?: number; // default 10MB
}

const DEFAULT_MAX_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif'];
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.avif', '.gif'];

export const CloudImageUpload: React.FC<CloudImageUploadProps> = ({
  value = '',
  onChange,
  label = 'Image Upload (Cloud B2)',
  required = false,
  helperText = 'JPEG, PNG, WebP or AVIF (Up to 10MB). Stored securely on Backblaze B2.',
  albumId,
  altText = '',
  className = '',
  maxSizeBytes = DEFAULT_MAX_SIZE,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    const ext = `.${file.name.split('.').pop()?.toLowerCase()}`;
    if (!ALLOWED_TYPES.includes(file.type) && !ALLOWED_EXTENSIONS.includes(ext)) {
      return `Invalid format (${file.type || ext}). Please select a JPEG, PNG, WebP, or AVIF image.`;
    }
    if (file.size > maxSizeBytes) {
      const maxMb = (maxSizeBytes / (1024 * 1024)).toFixed(0);
      const actualMb = (file.size / (1024 * 1024)).toFixed(1);
      return `File size is ${actualMb}MB. Maximum allowed is ${maxMb}MB.`;
    }
    return null;
  };

  const handleUpload = async (file: File) => {
    setError(null);
    setSuccess(null);

    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsUploading(true);
    setUploadProgress(15);

    try {
      const progressTimer = setInterval(() => {
        setUploadProgress((prev) => (prev < 85 ? prev + 15 : prev));
      }, 250);

      const response = await adminApi.uploadSingleMedia(file, {
        album_id: albumId,
        alt_text: altText || file.name,
      });

      clearInterval(progressTimer);
      setUploadProgress(100);

      if (response?.url) {
        onChange(response.url, response.media);
        setSuccess(`Image uploaded successfully to cloud storage: ${file.name}`);
        setTimeout(() => setSuccess(null), 4000);
      } else {
        throw new Error(response?.message || 'Server did not return a cloud URL.');
      }
    } catch (err: any) {
      console.error('Cloud image upload failed:', err);
      setError(err?.response?.data?.message || err?.message || 'Failed to upload image to cloud storage.');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleUpload(file);
    }
  };

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      const file = e.dataTransfer.files?.[0];
      if (file) {
        handleUpload(file);
      }
    },
    [handleUpload]
  );

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setError(null);
    setSuccess(null);
    onChange('', null);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Label and Status */}
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-[#102137] uppercase tracking-wider">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        {value && (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            <CheckCircle className="w-3 h-3 text-emerald-600" />
            B2 Cloud Connected
          </span>
        )}
      </div>

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={onFileSelect}
        accept={ALLOWED_EXTENSIONS.join(',')}
        className="hidden"
        aria-label={label}
      />

      {/* Upload Box / Preview Area */}
      {value ? (
        <div className="relative rounded-xl border border-[#E8E3D9] bg-white p-3 shadow-sm hover:border-[#C6A04A] transition-all">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            {/* Image Preview */}
            <div className="relative w-full sm:w-36 h-28 rounded-lg overflow-hidden bg-[#F8F5EE] border border-[#E8E3D9] shrink-0 flex items-center justify-center">
              <img
                src={value}
                alt={altText || 'Uploaded cloud asset preview'}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity flex items-end p-1.5">
                <span className="text-[10px] text-white truncate max-w-full">
                  {value.split('/').pop()}
                </span>
              </div>
            </div>

            {/* URL & Actions */}
            <div className="flex-1 min-w-0 space-y-2 text-left w-full">
              <div className="flex items-center gap-1.5 text-xs text-[#183B5B]">
                <span className="font-semibold text-[#102137]">Cloud Storage URL:</span>
              </div>
              <p className="text-[11px] font-mono text-[#64748B] bg-[#F8F5EE] px-2.5 py-1.5 rounded border border-[#E8E3D9] break-all select-all">
                {value}
              </p>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#102137] hover:bg-[#183B5B] text-white text-xs font-medium transition-colors shadow-sm disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isUploading ? 'animate-spin' : ''}`} />
                  Replace Image
                </button>
                <button
                  type="button"
                  onClick={handleRemove}
                  disabled={isUploading}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-red-50 text-red-600 border border-red-200 text-xs font-medium transition-colors disabled:opacity-50"
                >
                  <X className="w-3.5 h-3.5" />
                  Remove
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Empty Upload Dropzone */
        <div
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onClick={() => !isUploading && fileInputRef.current?.click()}
          className={`relative rounded-xl border-2 border-dashed p-6 text-center transition-all cursor-pointer ${
            isDragging
              ? 'border-[#C6A04A] bg-[#FDFBF7] scale-[1.01]'
              : 'border-[#E8E3D9] bg-white hover:border-[#C6A04A] hover:bg-[#FDFBF7]'
          }`}
        >
          {isUploading ? (
            <div className="flex flex-col items-center justify-center space-y-3 py-2">
              <Loader2 className="w-8 h-8 text-[#C6A04A] animate-spin" />
              <div className="text-xs font-semibold text-[#102137]">
                Uploading directly to Backblaze B2 cloud storage...
              </div>
              {/* Progress Bar */}
              <div className="w-48 bg-[#E8E3D9] rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-[#C6A04A] h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center space-y-2 py-2">
              <div className="w-12 h-12 rounded-full bg-[#F8F5EE] border border-[#E8E3D9] flex items-center justify-center text-[#183B5B] group-hover:text-[#C6A04A] transition-colors">
                <UploadCloud className="w-6 h-6 text-[#183B5B]" />
              </div>
              <div>
                <span className="text-xs font-semibold text-[#102137]">
                  Click to upload image
                </span>{' '}
                <span className="text-xs text-[#64748B]">or drag and drop here</span>
              </div>
              <p className="text-[11px] text-[#64748B] max-w-xs">{helperText}</p>
            </div>
          )}
        </div>
      )}

      {/* Upload Feedback Alerts */}
      {error && (
        <div className="flex items-center gap-2 p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
          <span>{error}</span>
        </div>
      )}
      {success && (
        <div className="flex items-center gap-2 p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs">
          <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>{success}</span>
        </div>
      )}
    </div>
  );
};
