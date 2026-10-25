"use strict";
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
const s3Client = new client_s3_1.S3Client({
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
function publicUrl(key) {
    validateKey(key);
    return `${endpoint}/${bucket}/${key
        .split("/")
        .map(encodeURIComponent)
        .join("/")}`;
}
async function uploadToB2(file, isPublic = true) {
    if (!file?.path) {
        throw new Error("Upload file path is missing");
    }
    const extension = path_1.default.extname(file.originalname);
    const key = `${objectPrefix}${(0, crypto_1.randomUUID)()}${extension}`;
    try {
        await s3Client.send(new client_s3_1.PutObjectCommand({
            Bucket: bucket,
            Key: key,
            Body: fs_1.default.createReadStream(file.path),
            ContentType: file.mimetype || "application/octet-stream",
        }));
        const url = isPublic
            ? publicUrl(key)
            : await (0, s3_request_presigner_1.getSignedUrl)(s3Client, new client_s3_1.GetObjectCommand({ Bucket: bucket, Key: key }), { expiresIn: 3600 });
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
async function deleteFromB2(key) {
    validateKey(key);
    await s3Client.send(new client_s3_1.DeleteObjectCommand({
        Bucket: bucket,
        Key: key,
    }));
}
async function getUrlForKey(key, isPublic = true) {
    validateKey(key);
    if (isPublic) {
        return publicUrl(key);
    }
    return (0, s3_request_presigner_1.getSignedUrl)(s3Client, new client_s3_1.GetObjectCommand({ Bucket: bucket, Key: key }), { expiresIn: 3600 });
}
