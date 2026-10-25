import path from 'path';

export interface SupportedMediaType {
  mimeType: string;
  extensions: readonly string[];
}

export const SUPPORTED_MEDIA_TYPES: readonly SupportedMediaType[] = [
  { mimeType: 'image/jpeg', extensions: ['.jpg', '.jpeg'] },
  { mimeType: 'image/png', extensions: ['.png'] },
  { mimeType: 'image/webp', extensions: ['.webp'] },
  { mimeType: 'image/gif', extensions: ['.gif'] },
  { mimeType: 'video/mp4', extensions: ['.mp4'] },
  { mimeType: 'video/webm', extensions: ['.webm'] },
  { mimeType: 'application/pdf', extensions: ['.pdf'] },
];

export const sniffMediaType = (header: Buffer): SupportedMediaType | undefined => {
  if (header.length >= 3 && header[0] === 0xff && header[1] === 0xd8 && header[2] === 0xff) {
    return SUPPORTED_MEDIA_TYPES[0];
  }
  if (header.length >= 8 && header.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) {
    return SUPPORTED_MEDIA_TYPES[1];
  }
  if (header.length >= 12 && header.toString('ascii', 0, 4) === 'RIFF' && header.toString('ascii', 8, 12) === 'WEBP') {
    return SUPPORTED_MEDIA_TYPES[2];
  }
  if (header.length >= 6 && ['GIF87a', 'GIF89a'].includes(header.toString('ascii', 0, 6))) {
    return SUPPORTED_MEDIA_TYPES[3];
  }
  if (header.length >= 12 && header.toString('ascii', 4, 8) === 'ftyp') {
    return SUPPORTED_MEDIA_TYPES[4];
  }
  if (header.length >= 4 && header.subarray(0, 4).equals(Buffer.from([0x1a, 0x45, 0xdf, 0xa3]))) {
    return SUPPORTED_MEDIA_TYPES[5];
  }
  if (header.length >= 5 && header.toString('ascii', 0, 5) === '%PDF-') {
    return SUPPORTED_MEDIA_TYPES[6];
  }
  return undefined;
};

export class UploadValidationError extends Error {
  readonly statusCode = 400;

  constructor() {
    super('Unsupported or invalid media file. Allowed formats: JPEG, PNG, WebP, GIF, MP4, WebM, and PDF.');
    this.name = 'UploadValidationError';
  }
}

export const getSafeUploadExtension = (originalName: string): string | undefined => {
  const extension = path.extname(path.basename(originalName)).toLowerCase();
  return SUPPORTED_MEDIA_TYPES.some((type) => type.extensions.includes(extension))
    ? extension
    : undefined;
};

export const validateMediaFile = (
  originalName: string,
  claimedMimeType: string,
  header: Buffer
): boolean => {
  const actual = sniffMediaType(header);
  return Boolean(
    actual &&
    actual.extensions.includes(path.extname(path.basename(originalName)).toLowerCase()) &&
    actual.mimeType === claimedMimeType.toLowerCase()
  );
};
