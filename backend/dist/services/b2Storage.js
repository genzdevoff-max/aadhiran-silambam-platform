"use strict";
// Backend service for Backblaze B2 (S3 compatible) storage
// Uses AWS SDK v3 S3 client. Handles upload, delete, and URL generation.
// Public media URLs are stable; private media URLs are signed with limited TTL.
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadToB2 = uploadToB2;
exports.deleteFromB2 = deleteFromB2;
exports.getUrlForKey = getUrlForKey;
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const crypto_1 = require("crypto");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const mime_types_1 = __importDefault(require("mime-types"));
// Load env vars (backend uses dotenv at server start)
const { B2_ENDPOINT, B2_REGION, B2_BUCKET_NAME, B2_APPLICATION_KEY_ID, B2_APPLICATION_KEY, } = process.env;
if (!B2_ENDPOINT || !B2_REGION || !B2_BUCKET_NAME || !B2_APPLICATION_KEY_ID || !B2_APPLICATION_KEY) {
    console.error("[b2Storage] Missing required Backblaze B2 configuration. Uploads will be disabled.");
}
const s3Client = new client_s3_1.S3Client({
    endpoint: B2_ENDPOINT,
    region: B2_REGION,
    credentials: {
        accessKeyId: B2_APPLICATION_KEY_ID ?? "",
        secretAccessKey: B2_APPLICATION_KEY ?? "",
    },
    forcePathStyle: true, // B2 requires path‑style URLs
});
/**
 * Upload a file (provided by Multer) to B2.
 * Returns the generated object key and the public URL (or signed URL for private files).
 */
async function uploadToB2(file, isPublic = true) {
    const ext = path_1.default.extname(file.originalname) || mime_types_1.default.extension(file.mimetype) ? `.${mime_types_1.default.extension(file.mimetype)}` : "";
    const key = `${(0, crypto_1.randomUUID)()}${ext}`;
    const putCmd = new client_s3_1.PutObjectCommand({
        Bucket: B2_BUCKET_NAME, // non‑null because of earlier guard
        Key: key,
        Body: fs_1.default.createReadStream(file.path),
        ContentType: file.mimetype,
        ACL: isPublic ? "public-read" : undefined,
    });
    await s3Client.send(putCmd);
    // Delete local temporary file after successful upload
    try {
        await fs_1.default.promises.unlink(file.path);
    }
    catch (e) {
        console.warn("[b2Storage] Failed to delete temporary file:", file.path, e);
    }
    const url = isPublic ? `${B2_ENDPOINT}/${B2_BUCKET_NAME}/${key}` : await (0, s3_request_presigner_1.getSignedUrl)(s3Client, new client_s3_1.GetObjectCommand({ Bucket: B2_BUCKET_NAME, Key: key }), { expiresIn: 3600 });
    return { key, url };
}
/** Delete an object from B2 */
async function deleteFromB2(key) {
    const delCmd = new client_s3_1.DeleteObjectCommand({ Bucket: B2_BUCKET_NAME, Key: key });
    await s3Client.send(delCmd);
}
/** Generate a URL for an existing object. Public objects get a stable URL; private get signed URL. */
async function getUrlForKey(key, isPublic = true) {
    if (isPublic) {
        return `${B2_ENDPOINT}/${B2_BUCKET_NAME}/${key}`;
    }
    const signed = await (0, s3_request_presigner_1.getSignedUrl)(s3Client, new client_s3_1.GetObjectCommand({ Bucket: B2_BUCKET_NAME, Key: key }), { expiresIn: 3600 });
    return signed;
}
