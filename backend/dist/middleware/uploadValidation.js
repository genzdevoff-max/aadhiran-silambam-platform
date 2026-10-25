"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateMediaFile = exports.getSafeUploadExtension = exports.UploadValidationError = exports.sniffMediaType = exports.SUPPORTED_MEDIA_TYPES = void 0;
const path_1 = __importDefault(require("path"));
exports.SUPPORTED_MEDIA_TYPES = [
    { mimeType: 'image/jpeg', extensions: ['.jpg', '.jpeg'] },
    { mimeType: 'image/png', extensions: ['.png'] },
    { mimeType: 'image/webp', extensions: ['.webp'] },
    { mimeType: 'image/gif', extensions: ['.gif'] },
    { mimeType: 'video/mp4', extensions: ['.mp4'] },
    { mimeType: 'video/webm', extensions: ['.webm'] },
    { mimeType: 'application/pdf', extensions: ['.pdf'] },
];
const sniffMediaType = (header) => {
    if (header.length >= 3 && header[0] === 0xff && header[1] === 0xd8 && header[2] === 0xff) {
        return exports.SUPPORTED_MEDIA_TYPES[0];
    }
    if (header.length >= 8 && header.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) {
        return exports.SUPPORTED_MEDIA_TYPES[1];
    }
    if (header.length >= 12 && header.toString('ascii', 0, 4) === 'RIFF' && header.toString('ascii', 8, 12) === 'WEBP') {
        return exports.SUPPORTED_MEDIA_TYPES[2];
    }
    if (header.length >= 6 && ['GIF87a', 'GIF89a'].includes(header.toString('ascii', 0, 6))) {
        return exports.SUPPORTED_MEDIA_TYPES[3];
    }
    if (header.length >= 12 && header.toString('ascii', 4, 8) === 'ftyp') {
        return exports.SUPPORTED_MEDIA_TYPES[4];
    }
    if (header.length >= 4 && header.subarray(0, 4).equals(Buffer.from([0x1a, 0x45, 0xdf, 0xa3]))) {
        return exports.SUPPORTED_MEDIA_TYPES[5];
    }
    if (header.length >= 5 && header.toString('ascii', 0, 5) === '%PDF-') {
        return exports.SUPPORTED_MEDIA_TYPES[6];
    }
    return undefined;
};
exports.sniffMediaType = sniffMediaType;
class UploadValidationError extends Error {
    statusCode = 400;
    constructor() {
        super('Unsupported or invalid media file. Allowed formats: JPEG, PNG, WebP, GIF, MP4, WebM, and PDF.');
        this.name = 'UploadValidationError';
    }
}
exports.UploadValidationError = UploadValidationError;
const getSafeUploadExtension = (originalName) => {
    const extension = path_1.default.extname(path_1.default.basename(originalName)).toLowerCase();
    return exports.SUPPORTED_MEDIA_TYPES.some((type) => type.extensions.includes(extension))
        ? extension
        : undefined;
};
exports.getSafeUploadExtension = getSafeUploadExtension;
const validateMediaFile = (originalName, claimedMimeType, header) => {
    const actual = (0, exports.sniffMediaType)(header);
    return Boolean(actual &&
        actual.extensions.includes(path_1.default.extname(path_1.default.basename(originalName)).toLowerCase()) &&
        actual.mimeType === claimedMimeType.toLowerCase());
};
exports.validateMediaFile = validateMediaFile;
