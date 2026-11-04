"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.s3Client = void 0;
exports.validateKey = validateKey;
exports.getUsableB2Url = getUsableB2Url;
exports.publicUrl = publicUrl;
exports.uploadToB2 = uploadToB2;
exports.uploadBufferToB2 = uploadBufferToB2;
exports.getObjectFromB2 = getObjectFromB2;
exports.deleteFromB2 = deleteFromB2;
exports.getUrlForKey = getUrlForKey;
const client_s3_1 = require("@aws-sdk/client-s3");
const crypto_1 = require("crypto");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const mime_types_1 = __importDefault(require("mime-types"));
const { B2_ENDPOINT, B2_REGION, B2_BUCKET_NAME, B2_APPLICATION_KEY_ID, B2_APPLICATION_KEY, } = process.env;
const requiredConfig = {
    B2_ENDPOINT,
    B2_REGION,
    B2_BUCKET_NAME,
    B2_APPLICATION_KEY_ID,
    B2_APPLICATION_KEY,
};
const missingConfig = Object.entries(requiredConfig)
    .filter(([, value]) => !value)
    .map(([name]) => name);
if (missingConfig.length > 0) {
    throw new Error(`[b2Storage] Missing required configuration: ${missingConfig.join(", ")}`);
}
const endpoint = B2_ENDPOINT.replace(/\/+$/, "");
const bucket = B2_BUCKET_NAME;
const objectPrefix = "silambam/";
exports.s3Client = new client_s3_1.S3Client({
    endpoint,
    region: B2_REGION,
    credentials: {
        accessKeyId: B2_APPLICATION_KEY_ID,
        secretAccessKey: B2_APPLICATION_KEY,
    },
    forcePathStyle: true,
});
function validateKey(key) {
    if (!key.startsWith(objectPrefix) ||
        key.includes("\\") ||
        key.split("/").some((part) => part === "..") ||
        key.includes("\0")) {
        throw new Error("Invalid B2 object key or prefix");
    }
}
/**
 * Returns permanent usable URL for an asset stored in the private B2 bucket.
 * Routes through the authenticated streaming proxy `/api/public/media/stream/:key`
 * with long-lived Cache-Control and ETag validation.
 */
function getUsableB2Url(key) {
    validateKey(key);
    return `/api/public/media/stream/${key}`;
}
function publicUrl(key) {
    return getUsableB2Url(key);
}
async function uploadToB2(file, _isPublic = true) {
    if (!file?.path) {
        throw new Error("Upload file path is missing");
    }
    const extension = path_1.default.extname(file.originalname);
    const key = `${objectPrefix}${(0, crypto_1.randomUUID)()}${extension}`;
    try {
        await exports.s3Client.send(new client_s3_1.PutObjectCommand({
            Bucket: bucket,
            Key: key,
            Body: fs_1.default.createReadStream(file.path),
            ContentType: file.mimetype || "application/octet-stream",
        }));
        const url = getUsableB2Url(key);
        return { key, url };
    }
    finally {
        try {
            await fs_1.default.promises.unlink(file.path);
        }
        catch (error) {
            console.warn("[b2Storage] Could not remove temporary upload file.");
        }
    }
}
async function uploadBufferToB2(buffer, originalname, mimetype) {
    const extension = path_1.default.extname(originalname);
    const key = `${objectPrefix}${(0, crypto_1.randomUUID)()}${extension}`;
    await exports.s3Client.send(new client_s3_1.PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: buffer,
        ContentType: mimetype || "application/octet-stream",
    }));
    const url = getUsableB2Url(key);
    return { key, url };
}
async function getObjectFromB2(key) {
    validateKey(key);
    const response = await exports.s3Client.send(new client_s3_1.GetObjectCommand({
        Bucket: bucket,
        Key: key,
    }));
    return {
        body: response.Body,
        contentType: response.ContentType || mime_types_1.default.lookup(key) || "application/octet-stream",
        contentLength: response.ContentLength,
        eTag: response.ETag,
        lastModified: response.LastModified,
    };
}
async function deleteFromB2(key) {
    validateKey(key);
    await exports.s3Client.send(new client_s3_1.DeleteObjectCommand({
        Bucket: bucket,
        Key: key,
    }));
}
async function getUrlForKey(key, _isPublic = true) {
    return getUsableB2Url(key);
}
